/* Aria Edit — lesson & quiz engine (یادگیری واقعی، نه فقط چک‌لیست).
 * Depends on: window.ARIA_LESSONS (data/lessons.js), the app's global `state`/`save()`,
 * and the DOM of index.html. Renders into its own overlay, so it cannot break the app shell. */
(function () {
  'use strict';

  var DATA = window.ARIA_LESSONS || {};
  var MONTH_KEYS = ['y0c0m0', 'y0c0m1', 'y0c0m2'];
  var PASS_SCORE = 4; // out of 5

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fa(n) { return Number(n || 0).toLocaleString('fa-IR'); }
  function hasData() { return MONTH_KEYS.every(function (k) { return !!DATA[k]; }); }

  /* ---------- progress (lives inside the per-user state) ---------- */
  /* state is a top-level let in index.html: it is a global lexical binding, not a
     property of window, so read it through a guarded accessor. */
  function appState() { try { return state; } catch (e) { return null; } }

  function progress() {
    if (!appState()) return null;
    if (!state.lessonProgress || typeof state.lessonProgress !== 'object') state.lessonProgress = {};
    return state.lessonProgress;
  }
  function scoreOf(key) {
    var p = progress(); if (!p) return 0;
    return (p[key] && p[key].best) || 0;
  }
  function record(key, score) {
    var p = progress(); if (!p) return;
    var cur = p[key] || { best: 0, tries: 0 };
    cur.best = Math.max(cur.best || 0, score);
    cur.tries = (cur.tries || 0) + 1;
    cur.at = Date.now();
    p[key] = cur;
    if (window.save) save();
  }
  function passedCount() {
    return MONTH_KEYS.filter(function (k) { return scoreOf(k) >= PASS_SCORE; }).length;
  }
  function doneCount() {
    var p = progress() || {};
    return MONTH_KEYS.reduce(function (n, k) { return n + ((p[k] && p[k].read) || 0); }, 0);
  }

  /* ---------- overlay plumbing ---------- */
  var overlay = null;
  function ensureOverlay() {
    close();
    overlay = el('div', 'ls-overlay');
    overlay.id = 'lsOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'درس و آزمون');
    var card = el('div', 'ls-card');
    overlay.appendChild(card);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    return card;
  }
  function close() {
    var old = document.getElementById('lsOverlay');
    if (old) old.remove();
    document.body.style.overflow = '';
    overlay = null;
  }

  function head(card, title, sub) {
    var h = el('div', 'ls-head');
    var box = el('div', 'ls-head-text');
    box.appendChild(el('div', 'ls-kicker', sub || 'درس و آزمون'));
    box.appendChild(el('h2', 'ls-title', title));
    var x = el('button', 'ls-close', '✕');
    x.type = 'button';
    x.setAttribute('aria-label', 'بستن');
    x.onclick = close;
    h.append(box, x);
    card.appendChild(h);
  }

  /* ---------- month page ---------- */
  function openMonth(mi) {
    var key = MONTH_KEYS[mi];
    var m = DATA[key];
    if (!m) { openMissing(); return; }
    var card = ensureOverlay();
    head(card, m.title, 'درس‌ماژول ماه ' + fa(mi + 1));

    var body = el('div', 'ls-body');
    card.appendChild(body);

    /* objectives */
    var obj = el('section', 'ls-section');
    obj.appendChild(el('h3', 'ls-h3', 'اهداف یادگیری این ماه'));
    var ul = el('ul', 'ls-objectives');
    m.objectives.forEach(function (o) { ul.appendChild(el('li', null, o)); });
    obj.appendChild(ul);
    body.appendChild(obj);

    /* lessons */
    var ls = el('section', 'ls-section');
    ls.appendChild(el('h3', 'ls-h3', 'درس‌ها (' + fa(m.lessons.length) + ' درس)'));
    m.lessons.forEach(function (lesson, i) {
      var item = el('details', 'ls-lesson');
      var sum = el('summary', 'ls-lesson-sum');
      sum.append(el('span', 'ls-lesson-title', lesson.title), el('span', 'ls-min', fa(lesson.minutes) + ' دقیقه'));
      item.appendChild(sum);
      var inner = el('div', 'ls-lesson-body');
      lesson.body.split('\n\n').forEach(function (p) { inner.appendChild(el('p', 'ls-p', p)); });
      if (lesson.keyPoints && lesson.keyPoints.length) {
        var kp = el('div', 'ls-keypoints');
        kp.appendChild(el('div', 'ls-kp-title', 'نکته‌های کلیدی'));
        var kul = el('ul', 'ls-kp-list');
        lesson.keyPoints.forEach(function (t) { kul.appendChild(el('li', null, t)); });
        kp.appendChild(kul);
        inner.appendChild(kp);
      }
      var bar = el('div', 'ls-lesson-actions');
      var done = el('button', 'ls-btn ls-btn-ghost', 'خواندم');
      done.type = 'button';
      done.onclick = function () {
        var p = progress(); if (!p) return;
        var rec = p[key] || { best: 0, tries: 0 };
        rec.read = Math.max(rec.read || 0, i + 1);
        p[key] = rec;
        if (window.save) save();
        done.textContent = 'خوانده شد ✓';
        done.disabled = true;
      };
      bar.appendChild(done);
      inner.appendChild(bar);
      item.appendChild(inner);
      ls.appendChild(item);
    });
    body.appendChild(ls);

    /* practice */
    if (m.practice) {
      var pr = el('section', 'ls-section');
      pr.appendChild(el('h3', 'ls-h3', 'تمرین عملی'));
      pr.appendChild(el('p', 'ls-p ls-strong', m.practice.title));
      var steps = el('ol', 'ls-steps');
      m.practice.steps.forEach(function (s) { steps.appendChild(el('li', null, s)); });
      pr.appendChild(steps);
      if (m.practice.successCriteria) {
        pr.appendChild(el('div', 'ls-kp-title', 'معیار موفقیت (خودت چک کن)'));
        var crit = el('ul', 'ls-kp-list');
        m.practice.successCriteria.forEach(function (c) { crit.appendChild(el('li', null, c)); });
        pr.appendChild(crit);
      }
      body.appendChild(pr);
    }

    /* quiz entry */
    var qs = el('section', 'ls-section ls-quiz-entry');
    var best = scoreOf(key);
    qs.appendChild(el('h3', 'ls-h3', 'آزمون پایان ماه'));
    qs.appendChild(el('p', 'ls-p', best
      ? 'بهترین نمره‌ات: ' + fa(best) + ' از ' + fa(m.quiz.length) + (best >= PASS_SCORE ? ' — قبول ✅' : ' — برای قبولی حداقل ' + fa(PASS_SCORE) + ' لازم است.')
      : 'پنج سؤال کوتاه برای اینکه مطمئن شوی مفاهیم را گرفته‌ای.'));
    var startBtn = el('button', 'ls-btn ls-btn-primary', best ? 'آزمون مجدد' : 'شروع آزمون');
    startBtn.type = 'button';
    startBtn.onclick = function () { openQuiz(mi); };
    qs.appendChild(startBtn);
    body.appendChild(qs);

    if (m.project) {
      var pj = el('section', 'ls-section ls-project');
      pj.appendChild(el('h3', 'ls-h3', 'خروجی این ماه'));
      pj.appendChild(el('p', 'ls-p', m.project));
      body.appendChild(pj);
    }

    /* certificate footer */
    var foot = el('div', 'ls-foot');
    var certBtn = el('button', 'ls-btn ls-btn-ghost', 'گواهی پایان دوره');
    certBtn.type = 'button';
    certBtn.onclick = openCertificate;
    foot.appendChild(certBtn);
    card.appendChild(foot);
  }

  /* ---------- quiz ---------- */
  function openQuiz(mi) {
    var key = MONTH_KEYS[mi];
    var m = DATA[key];
    if (!m) return;
    var card = ensureOverlay();
    head(card, 'آزمون: ' + m.title, 'پنج سؤال، بدون محدودیت زمان');

    var body = el('div', 'ls-body');
    card.appendChild(body);
    var answers = new Array(m.quiz.length).fill(-1);
    var form = el('form', 'ls-quiz');
    form.noValidate = true;

    m.quiz.forEach(function (q, qi) {
      var block = el('div', 'ls-q');
      block.appendChild(el('div', 'ls-q-title', fa(qi + 1) + '. ' + q.q));
      var opts = el('div', 'ls-opts');
      q.options.forEach(function (o, oi) {
        var lab = el('label', 'ls-opt');
        var input = el('input');
        input.type = 'radio';
        input.name = 'q' + qi;
        input.value = String(oi);
        input.id = 'q' + qi + '_' + oi;
        input.addEventListener('change', function () { answers[qi] = oi; });
        lab.appendChild(input);
        lab.appendChild(el('span', 'ls-opt-text', o));
        opts.appendChild(lab);
      });
      block.appendChild(opts);
      form.appendChild(block);
    });

    var msg = el('div', 'ls-msg');
    form.appendChild(msg);
    var submit = el('button', 'ls-btn ls-btn-primary', 'ثبت پاسخ‌ها');
    submit.type = 'submit';
    form.appendChild(submit);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var unanswered = answers.findIndex(function (a) { return a < 0; });
      if (unanswered >= 0) {
        msg.textContent = 'سؤال ' + fa(unanswered + 1) + ' بی‌پاسخ مانده است.';
        return;
      }
      var score = 0;
      m.quiz.forEach(function (q, qi) {
        var block = form.querySelectorAll('.ls-q')[qi];
        block.querySelectorAll('.ls-opt').forEach(function (opt, oi) {
          opt.classList.remove('correct', 'wrong');
          if (oi === q.answer) opt.classList.add('correct');
          else if (oi === answers[qi]) opt.classList.add('wrong');
          opt.querySelector('input').disabled = true;
        });
        var why = el('div', 'ls-why', 'چرا: ' + q.why);
        block.appendChild(why);
        if (answers[qi] === q.answer) score++;
      });
      record(key, score);
      submit.disabled = true;
      msg.className = 'ls-msg ls-result ' + (score >= PASS_SCORE ? 'pass' : 'fail');
      msg.textContent = 'نمره تو: ' + fa(score) + ' از ' + fa(m.quiz.length) +
        (score >= PASS_SCORE ? ' — قبول شدی ✅' : ' — یک بار دیگر بخوان و دوباره امتحان کن.');
      var again = el('button', 'ls-btn ls-btn-ghost', 'بازگشت به درس');
      again.type = 'button';
      again.onclick = function () { openMonth(mi); };
      form.appendChild(again);
    });

    body.appendChild(form);
  }

  /* ---------- certificate ---------- */
  function openCertificate() {
    var mi = 0;
    var card = ensureOverlay();
    head(card, 'گواهی پیشرفت', 'آریا ادیت');
    var body = el('div', 'ls-body');
    card.appendChild(body);

    var st = appState();
    var name = (st && st.profile && st.profile.name) || 'دانش‌آموز آریا ادیت';
    var passed = passedCount();
    var all = MONTH_KEYS.length;

    var sheet = el('div', 'ls-cert');
    sheet.appendChild(el('div', 'ls-cert-brand', 'آریا ادیت'));
    sheet.appendChild(el('div', 'ls-cert-title', passed === all ? 'گواهی پایان دوره مقدماتی تدوین' : 'گواهی پیشرفت'));
    sheet.appendChild(el('div', 'ls-cert-name', name));
    sheet.appendChild(el('div', 'ls-cert-line', passed === all
      ? 'دوره مقدماتی تدوین ویدیو (ماه ۱ تا ۳) را با موفقیت کامل کرد.'
      : fa(passed) + ' از ' + fa(all) + ' آزمون ماهانه را با موفقیت گذرانده است.'));
    var scores = el('div', 'ls-cert-scores');
    MONTH_KEYS.forEach(function (k, i) {
      var s = scoreOf(k);
      scores.appendChild(el('span', 'ls-cert-chip ' + (s >= PASS_SCORE ? 'ok' : ''), 'ماه ' + fa(i + 1) + ': ' + fa(s) + '/۵'));
    });
    sheet.appendChild(scores);
    var d = new Date();
    var dateStr;
    try { dateStr = d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch (e) { dateStr = d.toISOString().slice(0, 10); }
    sheet.appendChild(el('div', 'ls-cert-date', dateStr));
    sheet.appendChild(el('div', 'ls-cert-foot', 'تولید دانش‌آموز · نسخه برنامه: ۱.۲.۵'));
    body.appendChild(sheet);

    body.appendChild(el('p', 'ls-p ls-muted', 'برای نگه‌داشتن گواهی، از این صفحه اسکرین‌شات بگیر.'));
    var copy = el('button', 'ls-btn ls-btn-ghost', 'کپی متن گواهی');
    copy.type = 'button';
    copy.onclick = function () {
      var text = 'آریا ادیت — ' + (passed === all ? 'گواهی پایان دوره مقدماتی تدوین' : 'گواهی پیشرفت') +
        '\n' + name + '\n' + fa(passed) + ' از ' + fa(all) + ' آزمون ماهانه\n' + dateStr;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { copy.textContent = 'کپی شد ✓'; },
          function () { copy.textContent = 'کپی نشد'; });
      } else { copy.textContent = 'کپی پشتیبانی نمی‌شود'; }
    };
    body.appendChild(copy);
  }

  function openMissing() {
    var card = ensureOverlay();
    head(card, 'درس‌ها', 'در حال آماده‌سازی');
    var body = el('div', 'ls-body');
    body.appendChild(el('p', 'ls-p', 'محتوای درس این ماه هنوز وارد برنامه نشده است. فعلاً از چک‌لیست تمرین‌های همان ماه استفاده کن.'));
    card.appendChild(body);
  }

  /* ---------- dashboard + roadmap entry points ---------- */
  function nextLessonTarget() {
    for (var i = 0; i < MONTH_KEYS.length; i++) {
      if (scoreOf(MONTH_KEYS[i]) < PASS_SCORE) return i;
    }
    return 0;
  }

  function injectDashboardCard() {
    var dash = document.getElementById('view-dashboard');
    if (!dash || document.getElementById('lsDashCard') || !hasData()) return;
    var anchor = dash.querySelector('.summary-row') || dash.firstElementChild;
    var mi = nextLessonTarget();
    var m = DATA[MONTH_KEYS[mi]];
    var card = el('div', 'card ls-dash');
    card.id = 'lsDashCard';
    var top = el('div', 'ls-dash-top');
    top.appendChild(el('div', 'ls-kicker', 'درس امروز'));
    top.appendChild(el('div', 'ls-dash-pct', fa(passedCount()) + '/' + fa(MONTH_KEYS.length)));
    card.appendChild(top);
    card.appendChild(el('div', 'ls-dash-title', m.title));
    card.appendChild(el('div', 'ls-dash-sub', m.objectives[0]));
    var go = el('button', 'ls-btn ls-btn-primary', 'شروع درس و آزمون');
    go.type = 'button';
    go.onclick = function () { openMonth(mi); };
    card.appendChild(go);
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(card, anchor.nextSibling);
    else dash.appendChild(card);
  }

  function hookRoadmap() {
    var root = document.getElementById('skillTreeRoot');
    if (!root) return;
    root.addEventListener('click', function (e) {
      var head = e.target.closest && e.target.closest('.month-head');
      if (!head) return;
      setTimeout(function () {
        var card = head.closest('.month-card');
        if (!card || !card.classList.contains('open')) return;
        if (card.querySelector('.ls-month-launch')) return;
        var body = card.querySelector('.month-body-inner');
        if (!body) return;
        var mi = Number(card.dataset.mi);
        var key = MONTH_KEYS[mi];
        var row = el('div', 'ls-month-launch');
        var b = el('button', 'ls-btn ls-btn-primary ls-btn-sm', DATA[key] ? 'درس و آزمون این ماه' : 'درس این ماه (به‌زودی)');
        b.type = 'button';
        b.onclick = function (ev) { ev.stopPropagation(); if (DATA[key]) openMonth(mi); else openMissing(); };
        row.appendChild(b);
        body.insertBefore(row, body.firstChild);
      }, 30);
    }, true);
  }

  function init() {
    if (!hasData()) return;
    injectDashboardCard();
    hookRoadmap();
    // the dashboard card is re-created only if the view is rebuilt; keep it fresh on tab switches
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { setTimeout(injectDashboardCard, 60); });
    });
  }

  window.AriaLessons = {
    open: openMonth,
    openQuiz: openQuiz,
    certificate: openCertificate,
    stats: function () { return { passed: passedCount(), months: MONTH_KEYS.length, read: doneCount() }; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
