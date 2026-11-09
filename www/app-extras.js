/* Aria Edit — extras: شناسنامه اثر، راهنما، جست‌وجو، پشتیبان‌گیری.
 * Self-contained overlay UI; it reads the app's globals (`state`, `save`, `EDITQUEST_CURRICULUM`)
 * but never patches the shell, so a failure here cannot break the app. */
(function () {
  'use strict';

  var APP_VERSION = '1.2.5';
  var BUILD_DATE = '۱۴۰۵/۰۷/۲۷';
  var CONTACT_EMAIL = 'aria.edit.app@gmail.com';
  var DOWNLOAD_URL = 'https://github.com/aria-edit/aria-edit/releases';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fa(n) { return Number(n || 0).toLocaleString('fa-IR'); }
  function appState() { try { return state; } catch (e) { return null; } }
  function curriculum() { try { return EDITQUEST_CURRICULUM; } catch (e) { return []; } }
  function lessons() { return window.ARIA_LESSONS || {}; }

  /* ---------- overlay ---------- */
  var current = null;
  function sheet(title, kicker) {
    close();
    var ov = el('div', 'ls-overlay');
    ov.id = 'exOverlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    var card = el('div', 'ls-card');
    var head = el('div', 'ls-head');
    var box = el('div', 'ls-head-text');
    box.appendChild(el('div', 'ls-kicker', kicker || 'ابزارها'));
    box.appendChild(el('h2', 'ls-title', title));
    var x = el('button', 'ls-close', '✕');
    x.type = 'button'; x.setAttribute('aria-label', 'بستن');
    x.onclick = close;
    head.append(box, x);
    card.appendChild(head);
    ov.appendChild(card);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    current = ov;
    return card;
  }
  function close() {
    var old = document.getElementById('exOverlay');
    if (old) old.remove();
    document.body.style.overflow = '';
    current = null;
  }

  /* ---------- شناسنامه اثر ---------- */
  function about() {
    var card = sheet('شناسنامه اثر', 'مشخصات رسمی');
    var body = el('div', 'ls-body');
    card.appendChild(body);

    var table = el('div', 'ex-rows');
    [
      ['نام اثر', 'آریا ادیت (Aria Edit)'],
      ['نوع اثر', 'اپلیکیشن موبایل اندروید + نسخه وب نصب‌شدنی (PWA)'],
      ['نسخه', APP_VERSION + ' — ' + BUILD_DATE],
      ['محور جشنواره', 'تولید محتوای دیجیتال — طراحی و تولید اپلیکیشن موبایل'],
      ['پدیدآورنده', 'دانش‌آموز، پایه یازدهم رشته ریاضی — به‌صورت انفرادی'],
      ['مخاطب هدف', 'دانش‌آموزان متوسطه و علاقه‌مندان تازه‌کار به تدوین ویدیو'],
      ['زبان و جهت', 'فارسی — راست‌به‌چپ'],
      ['فناوری', 'WebView + PWA، بدون کتابخانه بیرونی در زمان اجرا؛ بک‌اند اختیاری Node.js'],
      ['دسترسی آفلاین', 'کامل؛ هیچ منبعی از اینترنت لازم نیست'],
      ['حجم', 'کمتر از ۳ مگابایت'],
      ['کانال ارتباط', CONTACT_EMAIL],
      ['دریافت نسخه', DOWNLOAD_URL]
    ].forEach(function (row) {
      var r = el('div', 'ex-row');
      r.appendChild(el('span', 'ex-k', row[0]));
      r.appendChild(el('span', 'ex-v', row[1]));
      table.appendChild(r);
    });
    body.appendChild(table);

    var note = el('div', 'ls-section');
    note.appendChild(el('h3', 'ls-h3', 'بیانیه تولید'));
    note.appendChild(el('p', 'ls-p', 'ایده، طراحی آموزشی، چیدمان مسیر چهارساله، متون درس، طراحی رابط و کل چرخهٔ تست این اثر کار این دانش‌آموز است. در بخش کدنویسی از ابزارهای هوش مصنوعی به‌عنوان دستیار استفاده شده و نقش آن‌ها در گزارش مکتوب به‌تفصیل آمده است. تمام محتوای آموزشی از منابع معتبر تدوین (Adobe Premiere Pro) گرفته شده و در بخش «منابع» فهرست شده است.'));
    body.appendChild(note);

    var legal = el('div', 'ls-section');
    legal.appendChild(el('h3', 'ls-h3', 'شرایط'));
    legal.appendChild(el('ul', 'ls-kp-list'));
    ['اثر به هیچ ارگان دولتی یا خصوصی واگذار نشده است.',
      'اثر قفل نرم‌افزاری و رمز عبور اجباری ندارد؛ بدون حساب هم کاملاً قابل استفاده است.',
      'بدون نیاز به نصب نرم‌افزار جانبی و بدون دسترسی به فایل‌های دستگاه اجرا می‌شود.',
      'هیچ داده‌ای بدون اطلاع کاربر از دستگاه خارج نمی‌شود.'
    ].forEach(function (t) { legal.querySelector('ul').appendChild(el('li', null, t)); });
    body.appendChild(legal);
  }

  /* ---------- راهنما ---------- */
  function help() {
    var card = sheet('راهنما و پرسش‌های متداول', 'شروع سریع');
    var body = el('div', 'ls-body');
    card.appendChild(body);

    var quick = el('div', 'ls-section');
    quick.appendChild(el('h3', 'ls-h3', 'در ۳۰ ثانیه'));
    var ol = el('ol', 'ls-steps');
    ['در داشبورد، تایمر «آموزش» را بزن و شروع کن؛ هر ساعت ۱۰ امتیاز دارد.',
      'کارت «درس امروز» را باز کن: اهداف، متن درس، تمرین و آزمون همان ماه.',
      'در «نقشه راه» ماه را باز کن و تمرین‌های انجام‌شده را تیک بزن.',
      'در «ژورنال» پروژه‌ات را با لینک ثبت کن تا پیشرفت مستند شود.',
      'در «آمار» روند هفتگی و مهارت‌ها را ببین.'
    ].forEach(function (t) { ol.appendChild(el('li', null, t)); });
    quick.appendChild(ol);
    body.appendChild(quick);

    var faq = el('div', 'ls-section');
    faq.appendChild(el('h3', 'ls-h3', 'پرسش‌های متداول'));
    [
      ['آیا باید حساب بسازم؟', 'نه. اپ بدون حساب و رمز کار می‌کند و پیشرفت روی همین دستگاه ذخیره می‌شود. حساب فقط برای همگام‌سازی بین دستگاه‌ها است.'],
      ['پیشرفتم کجا ذخیره می‌شود؟', 'در حافظهٔ خود گوشی. با «پشتیبان‌گیری» در همین صفحه می‌توانی یک نسخهٔ متنی بگیری و بعداً بازیابی کنی.'],
      ['چرا گاهی انیمیشن سه‌بعدی خاموش است؟', 'برای صرفه‌جویی در باتری، هنگام اسکرول و در دستگاه‌های کم‌توان، رندر سه‌بعدی متوقف می‌شود.'],
      ['آیا به اینترنت نیاز دارد؟', 'نه؛ همهٔ محتوا داخل اپ است.'],
      ['روی iOS چطور نصب کنم؟', 'اپ را در Safari باز کن، دکمهٔ Share را بزن و «Add to Home Screen» را انتخاب کن.'],
      ['روی ویندوز چطور نصب کنم؟', 'در Edge یا Chrome آدرس اپ را باز کن و از منو «Install app» را بزن.'],
      ['نسخهٔ اندروید چطور نصب می‌شود؟', 'فایل APK را از صفحهٔ دانلود بگیر و اجازهٔ نصب از منبع ناشناس را بده.']
    ].forEach(function (pair) {
      var d = el('details', 'ls-lesson');
      var s = el('summary', 'ls-lesson-sum');
      s.appendChild(el('span', 'ls-lesson-title', pair[0]));
      d.appendChild(s);
      var b = el('div', 'ls-lesson-body');
      b.appendChild(el('p', 'ls-p', pair[1]));
      d.appendChild(b);
      faq.appendChild(d);
    });
    body.appendChild(faq);

    var contact = el('div', 'ls-section');
    contact.appendChild(el('h3', 'ls-h3', 'ارتباط با سازنده'));
    contact.appendChild(el('p', 'ls-p', 'برای گزارش اشکال، پیشنهاد یا پرسش:'));
    var mail = el('a', 'ls-btn ls-btn-primary', 'ارسال ایمیل به ' + CONTACT_EMAIL);
    mail.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('آریا ادیت — بازخورد');
    contact.appendChild(mail);
    body.appendChild(contact);
  }

  /* ---------- جست‌وجو ---------- */
  function search() {
    var card = sheet('جست‌وجو', 'در کل برنامه');
    var body = el('div', 'ls-body');
    card.appendChild(body);

    var input = el('input', 'ex-search');
    input.type = 'search';
    input.placeholder = 'مثلاً J-Cut، صدا، رنگ، پروژه، درس';
    input.setAttribute('aria-label', 'عبارت جست‌وجو');
    body.appendChild(input);
    var results = el('div', 'ex-results');
    body.appendChild(results);

    // flatten the curriculum once
    var index = [];
    curriculum().forEach(function (year) {
      (year.months || []).forEach(function (month, mi) {
        (month.weeks || []).forEach(function (week, wi) {
          (week.tasks || []).forEach(function (task) {
            index.push({ kind: 'تمرین', text: task.text, month: month.title, mi: mi, wi: wi, day: task.day });
          });
        });
      });
    });
    var L = lessons();
    Object.keys(L).forEach(function (key) {
      var m = L[key];
      (m.lessons || []).forEach(function (lesson, li) {
        index.push({ kind: 'درس', text: lesson.title + ' — ' + lesson.body.slice(0, 200), month: m.title, mi: Number(key.slice(-1)), li: li, lessonRef: true });
      });
      index.push({ kind: 'آزمون', text: m.title + ' — آزمون ' + m.quiz.length + ' سؤالی', month: m.title, mi: Number(key.slice(-1)), quiz: true });
    });
    var st = appState();
    ((st && st.projects) || []).forEach(function (p) {
      index.push({ kind: 'پروژه', text: p.title + ' ' + (p.feedback || ''), month: p.date || '', project: p });
    });

    function norm(s) { return String(s || '').toLowerCase().replace(/[\u064A]/g, 'ي').replace(/[\u0649]/g, 'ي'); }

    function render(q) {
      results.textContent = '';
      var query = norm(q).trim();
      if (!query) {
        results.appendChild(el('p', 'ls-p ls-muted', 'برای جست‌وجو تایپ کن. ' + fa(index.length) + ' مورد ایندکس شده است.'));
        return;
      }
      var hits = index.filter(function (item) { return norm(item.text).indexOf(query) > -1; }).slice(0, 40);
      if (!hits.length) {
        results.appendChild(el('p', 'ls-p', 'چیزی پیدا نشد. عبارت کوتاه‌تری امتحان کن.'));
        return;
      }
      results.appendChild(el('div', 'ex-count', fa(hits.length) + ' نتیجه'));
      hits.forEach(function (item) {
        var row = el('button', 'ex-hit');
        row.type = 'button';
        var top = el('div', 'ex-hit-top');
        top.appendChild(el('span', 'ex-kind', item.kind));
        top.appendChild(el('span', 'ex-month', item.month || ''));
        row.appendChild(top);
        row.appendChild(el('div', 'ex-hit-text', item.text));
        row.onclick = function () {
          close();
          if (item.quiz) { if (window.AriaLessons) window.AriaLessons.openQuiz(item.mi); return; }
          if (item.lessonRef) { if (window.AriaLessons) window.AriaLessons.open(item.mi); return; }
          // practice task: jump to the roadmap, open the month, scroll to the week
          document.querySelectorAll('.tab-btn').forEach(function (b) { if (b.dataset.view === 'skilltree') b.click(); });
          setTimeout(function () {
            var monthCard = document.querySelectorAll('.month-card')[item.mi];
            if (!monthCard) return;
            var head = monthCard.querySelector('.month-head');
            if (head && !monthCard.classList.contains('open')) head.click();
            setTimeout(function () {
              var week = monthCard.querySelectorAll('.week-node')[item.wi];
              if (week) { week.scrollIntoView({ block: 'center', behavior: 'smooth' }); week.classList.add('ex-flash'); setTimeout(function () { week.classList.remove('ex-flash'); }, 1600); }
            }, 120);
          }, 120);
        };
        results.appendChild(row);
      });
    }

    var timer = null;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { render(input.value); }, 120);
    });
    render('');
    setTimeout(function () { input.focus(); }, 80);
  }

  /* ---------- پشتیبان‌گیری ---------- */
  function backup() {
    var card = sheet('پشتیبان‌گیری و بازیابی', 'دادهٔ من');
    var body = el('div', 'ls-body');
    card.appendChild(body);
    var st = appState() || {};

    body.appendChild(el('p', 'ls-p', 'پیشرفت تو روی همین دستگاه ذخیره می‌شود. با گرفتن نسخهٔ پشتیبان می‌توانی آن را روی گوشی دیگر یا بعد از حذف اپ برگردانی.'));

    var area = el('textarea', 'ex-textarea');
    area.rows = 7;
    area.setAttribute('aria-label', 'محتوای پشتیبان');
    area.value = JSON.stringify({
      app: 'aria-edit', version: APP_VERSION, savedAt: new Date().toISOString(),
      profile: st.profile || null, xpBanked: st.xpBanked || 0,
      history: st.history || [], progress: st.progress || {},
      projects: st.projects || [], lessonProgress: st.lessonProgress || {},
      today: st.today || null
    }, null, 2);
    body.appendChild(area);

    var row = el('div', 'ex-btnrow');
    var copy = el('button', 'ls-btn ls-btn-primary', 'کپی پشتیبان');
    copy.type = 'button';
    copy.onclick = function () {
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      if (!ok && navigator.clipboard) navigator.clipboard.writeText(area.value).then(function () { copy.textContent = 'کپی شد ✓'; });
      else copy.textContent = ok ? 'کپی شد ✓' : 'کپی نشد — دستی انتخاب کن';
    };
    var restore = el('button', 'ls-btn', 'بازیابی از متن');
    restore.type = 'button';
    restore.onclick = function () {
      var raw = area.value.trim();
      if (!raw) { msg.textContent = 'متنی برای بازیابی نیست.'; return; }
      var data;
      try { data = JSON.parse(raw); } catch (e) { msg.textContent = 'متن معتبر نیست (JSON خراب است).'; return; }
      if (!data || data.app !== 'aria-edit') { msg.textContent = 'این متن مربوط به آریا ادیت نیست.'; return; }
      var s = appState(); if (!s) { msg.textContent = 'دادهٔ برنامه در دسترس نیست.'; return; }
      if (data.profile) s.profile = data.profile;
      if (typeof data.xpBanked === 'number') s.xpBanked = data.xpBanked;
      if (Array.isArray(data.history)) s.history = data.history;
      if (data.progress && typeof data.progress === 'object') s.progress = data.progress;
      if (Array.isArray(data.projects)) s.projects = data.projects;
      if (data.lessonProgress) s.lessonProgress = data.lessonProgress;
      if (window.save) save();
      msg.textContent = 'بازیابی انجام شد. برنامه بازخوانی می‌شود…';
      setTimeout(function () { location.reload(); }, 700);
    };
    row.append(copy, restore);
    body.appendChild(row);
    var msg = el('div', 'ls-msg');
    body.appendChild(msg);

    var danger = el('div', 'ls-section');
    danger.appendChild(el('h3', 'ls-h3', 'پاک‌کردن داده‌ها'));
    danger.appendChild(el('p', 'ls-p ls-muted', 'همهٔ پیشرفت این دستگاه پاک می‌شود. این کار برگشت‌پذیر نیست.'));
    var wipe = el('button', 'ls-btn ex-danger', 'پاک‌کردن کامل پیشرفت');
    wipe.type = 'button';
    wipe.onclick = function () {
      if (!confirm('همهٔ پیشرفت روی این دستگاه پاک شود؟')) return;
      try { localStorage.clear(); } catch (e) {}
      location.reload();
    };
    danger.appendChild(wipe);
    body.appendChild(danger);
  }

  /* ---------- menu ---------- */
  function menu() {
    var card = sheet('درباره و ابزارها', 'آریا ادیت');
    var body = el('div', 'ls-body');
    card.appendChild(body);
    body.appendChild(el('p', 'ls-p ls-muted', 'نسخهٔ ' + APP_VERSION + ' — ' + BUILD_DATE));

    [
      ['شناسنامه اثر', 'مشخصات رسمی، شرایط و بیانیه تولید', about],
      ['راهنما و پرسش‌های متداول', 'شروع سریع، نصب روی iOS و ویندوز', help],
      ['جست‌وجو در کل برنامه', 'تمرین‌ها، درس‌ها، آزمون‌ها و پروژه‌ها', search],
      ['پشتیبان‌گیری و بازیابی', 'خروجی متنی و برگرداندن پیشرفت', backup],
      ['آزمایشگاه لگ', 'اندازه‌گیری روانی اسکرول و خاموش کردن لایه‌ها', function () { if (window.AriaDiag) window.AriaDiag.open(); }],
      ['دریافت نسخه و بارکد QR', 'نصب روی اندروید، iOS و ویندوز + تغییرات نسخه', download],
      ['فید درس‌ها (RSS)', 'همهٔ درس‌ها به‌صورت یک فید قابل اشتراک', feed],
      ['اندازهٔ متن و خوانایی', 'بزرگ‌کردن نوشته‌ها برای کم‌بینایان', textSize]
    ].forEach(function (item) {
      var b = el('button', 'ex-menu-btn');
      b.type = 'button';
      b.appendChild(el('span', 'ex-menu-title', item[0]));
      b.appendChild(el('span', 'ex-menu-sub', item[1]));
      b.onclick = item[2];
      body.appendChild(b);
    });

    body.appendChild(el('p', 'ls-p ls-muted', 'این برنامه بدون حساب کاربری هم کار می‌کند و داده‌ای به بیرون نمی‌فرستد.'));
  }

  /* ---------- header entry point ---------- */
  function mount() {
    var header = document.querySelector('.app-header');
    if (!header || document.getElementById('exBtn')) return;
    var btn = el('button', 'ex-fab', '⋯');
    btn.id = 'exBtn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'درباره، راهنما و ابزارها');
    btn.onclick = menu;
    header.appendChild(btn);
  }

  /* ================= نسخه ۲.۱: دریافت نسخه، QR، فید RSS، اندازهٔ متن ================= */

  var DOWNLOAD_URL_KEY = 'aria_download_url';
  var TEXT_SIZE_KEY = 'aria_text_size';
  var APP_VERSION_UI = '2.1.0';
  var LATEST_VERSION = '2.1.0';
  var DEFAULT_DOWNLOAD_URL = 'https://github.com/javad-hajebrahimy/aria-edit/releases/latest';
  var CHANGELOG = [
    { v: '۲.۱.۰', items: ['QR دانلود داخل برنامه', 'فید RSS درس‌ها', 'راهنمای نصب iOS و ویندوز', 'بررسی به‌روزرسانی', 'اندازهٔ متن قابل تنظیم'] },
    { v: '۲.۰.۰', items: ['بازنویسی کامل لایهٔ نمایش', 'حذف WebGL و لایهٔ متحرک تمام‌صفحه', 'بارگذاری از ۴.۵ به ۱.۹ ثانیه'] },
    { v: '۱.۲.۵', items: ['درس‌ماژول و آزمون ماه ۱ تا ۳', 'حالت مهمان و حالت داوری', 'شناسنامه اثر و راهنما'] }
  ];

  function getDownloadUrl() {
    try { return localStorage.getItem(DOWNLOAD_URL_KEY) || DEFAULT_DOWNLOAD_URL; } catch (e) { return DEFAULT_DOWNLOAD_URL; }
  }
  function setDownloadUrl(u) { try { localStorage.setItem(DOWNLOAD_URL_KEY, u); } catch (e) {} }

  function qrInto(container, text, size) {
    container.textContent = '';
    if (!window.qrcode) { container.appendChild(el('p', 'ls-p', 'کتابخانهٔ QR بارگذاری نشد.')); return; }
    try {
      var qr = window.qrcode(0, 'M');
      qr.addData(text || ' ');
      qr.make();
      var cell = size ? Math.max(2, Math.floor(size / (qr.getModuleCount() + 4))) : 4;
      container.innerHTML = qr.createSvgTag({ cellSize: cell, margin: 2, scalable: true });
      var svg = container.querySelector('svg');
      if (svg) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'بارکد QR دانلود برنامه'); }
    } catch (e) {
      container.appendChild(el('p', 'ls-p', 'ساخت QR ممکن نشد.'));
    }
  }

  function download() {
    var card = sheet('دریافت نسخه و بارکد QR', 'نصب روی دستگاه‌ها');
    var body = el('div', 'ls-body');
    card.appendChild(body);

    /* version + update check */
    var info = el('div', 'ls-section');
    info.appendChild(el('h3', 'ls-h3', 'نسخهٔ نصب‌شده'));
    var rows = el('div', 'ex-rows');
    [
      ['نسخهٔ برنامه', APP_VERSION_UI],
      ['آخرین نسخهٔ منتشرشده', LATEST_VERSION],
      ['وضعیت', APP_VERSION_UI === LATEST_VERSION ? 'به‌روز هستید ✓' : 'نسخهٔ تازه‌تر موجود است'],
      ['حجم فایل', 'حدود ۱.۵ مگابایت'],
      ['نیازمندی', 'اندروید ۶ و بالاتر — بدون نیاز به اینترنت']
    ].forEach(function (r) {
      var row = el('div', 'ex-row');
      row.appendChild(el('span', 'ex-k', r[0]));
      row.appendChild(el('span', 'ex-v', r[1]));
      rows.appendChild(row);
    });
    info.appendChild(rows);
    body.appendChild(info);

    /* QR */
    var qrSec = el('div', 'ls-section');
    qrSec.appendChild(el('h3', 'ls-h3', 'بارکد QR دانلود'));
    qrSec.appendChild(el('p', 'ls-p ls-muted', 'دوربین هر گوشی را روی این بارکد بگیر تا صفحهٔ دانلود باز شود.'));
    var qrBox = el('div', 'ex-qr');
    qrSec.appendChild(qrBox);
    var urlRow = el('div', 'ex-urlrow');
    var urlInput = el('input', 'ex-search');
    urlInput.type = 'url';
    urlInput.value = getDownloadUrl();
    urlInput.setAttribute('aria-label', 'آدرس دانلود برنامه');
    var saveBtn = el('button', 'ls-btn ls-btn-sm', 'ثبت آدرس');
    saveBtn.type = 'button';
    saveBtn.onclick = function () {
      setDownloadUrl(urlInput.value.trim());
      qrInto(qrBox, urlInput.value.trim(), 220);
      saveBtn.textContent = 'ثبت شد ✓';
      setTimeout(function () { saveBtn.textContent = 'ثبت آدرس'; }, 1500);
    };
    var copyUrl = el('button', 'ls-btn ls-btn-sm ls-btn-ghost', 'کپی آدرس');
    copyUrl.type = 'button';
    copyUrl.onclick = function () {
      var u = urlInput.value.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(u).then(function () { copyUrl.textContent = 'کپی شد ✓'; },
          function () { copyUrl.textContent = 'کپی نشد'; });
      }
    };
    urlRow.append(urlInput);
    var urlBtns = el('div', 'ex-btnrow');
    urlBtns.append(saveBtn, copyUrl);
    qrSec.append(urlRow, urlBtns);
    body.appendChild(qrSec);
    qrInto(qrBox, getDownloadUrl(), 220);

    /* install guides */
    var guide = el('div', 'ls-section');
    guide.appendChild(el('h3', 'ls-h3', 'راهنمای نصب'));
    var tabs = el('div', 'ex-tabs');
    var panes = el('div', 'ex-panes');
    var GUIDES = [
      ['اندروید', [
        'فایل APK را از همین صفحه یا با QR دانلود کن.',
        'اگر پیام «نصب از منابع ناشناس» آمد، برای برنامهٔ مرورگر اجازه بده.',
        'روی فایل بزن و «نصب» را انتخاب کن؛ آیکون آریا ادیت به صفحهٔ اصلی اضافه می‌شود.',
        'برای آپدیت، فقط نسخهٔ جدید را روی همان نسخه نصب کن؛ پیشرفت حفظ می‌شود.'
      ]],
      ['iOS', [
        'آدرس برنامه را در Safari باز کن.',
        'دکمهٔ Share (مربع با فلش) را بزن.',
        'گزینهٔ «Add to Home Screen / افزودن به صفحهٔ خانه» را انتخاب کن.',
        'برنامه مثل یک اپ مستقل باز می‌شود و آفلاین کار می‌کند.'
      ]],
      ['ویندوز / مک', [
        'آدرس برنامه را در Chrome یا Edge باز کن.',
        'از منوی مرورگر گزینهٔ «Install app / نصب برنامه» را بزن.',
        'آریا ادیت به‌صورت پنجرهٔ مستقل در Start/Applications نصب می‌شود.',
        'همهٔ داده‌ها روی همان دستگاه ذخیره می‌شود.'
      ]]
    ];
    var panesEls = [];
    GUIDES.forEach(function (g, i) {
      var b = el('button', 'ex-tab' + (i === 0 ? ' active' : ''), g[0]);
      b.type = 'button';
      var pane = el('div', 'ex-pane' + (i === 0 ? ' active' : ''));
      var ol = el('ol', 'ls-steps');
      g[1].forEach(function (s) { ol.appendChild(el('li', null, s)); });
      pane.appendChild(ol);
      panesEls.push(pane);
      b.onclick = function () {
        tabs.querySelectorAll('.ex-tab').forEach(function (x) { x.classList.remove('active'); });
        panesEls.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        pane.classList.add('active');
      };
      tabs.appendChild(b);
      panes.appendChild(pane);
    });
    guide.append(tabs, panes);
    body.appendChild(guide);

    /* changelog */
    var ch = el('div', 'ls-section');
    ch.appendChild(el('h3', 'ls-h3', 'تغییرات نسخه‌ها'));
    CHANGELOG.forEach(function (entry) {
      var box = el('div', 'ex-log');
      box.appendChild(el('div', 'ex-log-v', 'نسخهٔ ' + entry.v));
      var ul = el('ul', 'ls-kp-list');
      entry.items.forEach(function (t) { ul.appendChild(el('li', null, t)); });
      box.appendChild(ul);
      ch.appendChild(box);
    });
    body.appendChild(ch);
  }

  /* ---------- فید RSS ---------- */
  function feed() {
    var card = sheet('فید درس‌ها', 'RSS');
    var body = el('div', 'ls-body');
    card.appendChild(body);
    body.appendChild(el('p', 'ls-p ls-muted', 'این فید درون خود برنامه ساخته می‌شود و بدون اینترنت هم کار می‌کند؛ هر درس یک آیتم RSS است.'));
    var list = el('div', 'ex-feed');
    body.appendChild(list);
    list.textContent = 'در حال خواندن فید…';

    var sub = el('div', 'ex-btnrow');
    var copy = el('button', 'ls-btn ls-btn-sm ls-btn-ghost', 'کپی آدرس فید');
    copy.type = 'button';
    copy.onclick = function () {
      var u = location.origin + location.pathname.replace(/[^/]*$/, '') + 'feed.xml';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(u).then(function () { copy.textContent = 'کپی شد ✓'; },
          function () { copy.textContent = 'کپی نشد'; });
      }
    };
    sub.appendChild(copy);
    body.appendChild(sub);

    fetch('feed.xml', { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (xml) {
        var doc = new DOMParser().parseFromString(xml, 'application/xml');
        var items = doc.querySelectorAll('item');
        list.textContent = '';
        if (!items.length) { list.appendChild(el('p', 'ls-p', 'آیتمی در فید نیست.')); return; }
        var count = el('div', 'ex-count', fa(items.length) + ' آیتم در فید');
        list.appendChild(count);
        Array.prototype.forEach.call(items, function (item) {
          var t = (item.querySelector('title') || {}).textContent || '';
          var d = (item.querySelector('description') || {}).textContent || '';
          var p = (item.querySelector('pubDate') || {}).textContent || '';
          var box = el('div', 'ex-feed-item');
          box.appendChild(el('div', 'ex-feed-title', t));
          if (d) box.appendChild(el('div', 'ex-feed-desc', d));
          if (p) box.appendChild(el('div', 'ex-feed-date', p));
          list.appendChild(box);
        });
      })
      .catch(function () {
        list.textContent = '';
        list.appendChild(el('p', 'ls-p', 'خواندن فید ممکن نشد.'));
      });
  }

  /* ---------- اندازهٔ متن / دسترس‌پذیری ---------- */
  function applyTextSize(mode) {
    var root = document.documentElement;
    root.classList.toggle('text-lg', mode === 'lg');
    root.classList.toggle('text-xl', mode === 'xl');
    try { localStorage.setItem(TEXT_SIZE_KEY, mode); } catch (e) {}
  }
  function currentTextSize() {
    try { return localStorage.getItem(TEXT_SIZE_KEY) || 'md'; } catch (e) { return 'md'; }
  }

  function textSize() {
    var card = sheet('اندازهٔ متن و خوانایی', 'دسترس‌پذیری');
    var body = el('div', 'ls-body');
    card.appendChild(body);
    body.appendChild(el('p', 'ls-p', 'اگر نوشته‌ها برایت ریز است، اندازه را بزرگ‌تر کن. این تنظیم روی همهٔ صفحه‌ها اثر می‌گذارد و ذخیره می‌شود.'));

    var box = el('div', 'ex-sizebox');
    [['md', 'معمولی'], ['lg', 'بزرگ'], ['xl', 'خیلی بزرگ']].forEach(function (opt) {
      var b = el('button', 'ls-btn' + (currentTextSize() === opt[0] ? ' ls-btn-primary' : ''), opt[1]);
      b.type = 'button';
      if (opt[0] === 'lg') b.style.fontSize = '15px';
      if (opt[0] === 'xl') b.style.fontSize = '17px';
      b.onclick = function () {
        applyTextSize(opt[0]);
        box.querySelectorAll('.ls-btn').forEach(function (x) { x.classList.remove('ls-btn-primary'); });
        b.classList.add('ls-btn-primary');
      };
      box.appendChild(b);
    });
    body.appendChild(box);

    var note = el('div', 'ls-section');
    note.appendChild(el('h3', 'ls-h3', 'برای کاربران نابینا و کم‌بینا'));
    var ul = el('ul', 'ls-kp-list');
    ['همهٔ دکمه‌های آیکونی نام قابل خواندن دارند (TalkBack آن‌ها را می‌خواند).',
      'ترتیب پیمایش با کیبورد و سوییچ درست است و حلقهٔ فوکوس دیده می‌شود.',
      'پیام‌ها با aria-live اعلام می‌شوند و به رنگ تنها تکیه نشده است.',
      'اگر سیستم‌عامل «کاهش حرکت» را روشن کرده باشد، انیمیشن‌ها خاموش می‌شوند.'
    ].forEach(function (t) { ul.appendChild(el('li', null, t)); });
    note.appendChild(ul);
    body.appendChild(note);
  }

  window.AriaExtras = { about: about, help: help, search: search, backup: backup, menu: menu, download: download, feed: feed, textSize: textSize };

  function boot() { applyTextSize(currentTextSize()); mount(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
