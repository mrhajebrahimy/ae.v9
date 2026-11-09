/* Aria Edit — on-device lag lab (v1.2.6).
 * Replaces the old FPS panel: it isolates every expensive layer in turn and can measure
 * a real 5-second scroll (frame times + long tasks) so fixes are data-driven.
 * Nothing here touches saved progress. */
(function () {
  'use strict';
  var panel = null, liveRaf = 0;
  var flags = { gl: false, p: false, anim: false, shadow: false, filter: false, pseudo: false, flat: false, tick: false };
  var fpsEl, worstEl, resultEl, benchBtn;
  var live = { frames: 0, worst: 0, last: 0, t0: 0 };

  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  function apply() {
    window.__DBG_OFF_GL = flags.gl;
    window.__DBG_OFF_P = flags.p;
    window.__DBG_OFF_TICK = flags.tick;
    var gl = document.getElementById('threeScene'), pc = document.getElementById('bgParticles');
    if (gl) gl.style.display = flags.gl ? 'none' : '';
    if (pc) pc.style.display = flags.p ? 'none' : '';
    var root = document.documentElement;
    root.classList.toggle('dbg-flat', flags.flat);
    root.classList.toggle('lag-noanim', flags.anim);
    root.classList.toggle('lag-noshadow', flags.shadow);
    root.classList.toggle('lag-nofilter', flags.filter);
    root.classList.toggle('lag-nopseudo', flags.pseudo);
  }

  function liveFrame(now) {
    live.frames++;
    if (live.last) live.worst = Math.max(live.worst, now - live.last);
    live.last = now;
    if (now - live.t0 >= 1000) {
      fpsEl.textContent = live.frames;
      worstEl.textContent = Math.round(live.worst);
      live.frames = 0; live.worst = 0; live.t0 = now;
    }
    liveRaf = requestAnimationFrame(liveFrame);
  }

  var bench = { running: false, frames: [], raf: 0 };

  function startBench(ms) {
    if (bench.running) return;
    bench.running = true;
    bench.frames = [];
    var longTasks = 0, po = null;
    try {
      po = new PerformanceObserver(function (list) { longTasks += list.getEntries().length; });
      po.observe({ entryTypes: ['longtask'] });
    } catch (e) { po = null; }
    var t0 = performance.now(), last = t0;
    benchBtn.disabled = true;
    benchBtn.textContent = 'در حال اندازه‌گیری… حالا اسکرول کن';
    resultEl.textContent = '';
    function step(now) {
      if (!bench.running) return;
      bench.frames.push(now - last);
      last = now;
      if (now - t0 < ms) bench.raf = requestAnimationFrame(step);
      else finish(now - t0, longTasks, po);
    }
    bench.raf = requestAnimationFrame(step);
  }

  function finish(elapsed, longTasks, po) {
    bench.running = false;
    if (po) { try { po.disconnect(); } catch (e) {} }
    var f = bench.frames.slice(3).sort(function (a, b) { return a - b; });
    if (!f.length) {
      resultEl.textContent = 'اندازه‌گیری نشد.';
      benchBtn.disabled = false;
      benchBtn.textContent = 'شروع اندازه‌گیری ۵ ثانیه‌ای';
      return;
    }
    var sum = f.reduce(function (a, b) { return a + b; }, 0);
    function at(p) { return f[Math.min(f.length - 1, Math.floor(f.length * p))]; }
    var jank = f.filter(function (x) { return x > 33.4; }).length;
    var line = 'میانگین ' + (sum / f.length).toFixed(1) + 'ms · میانه ' + at(0.5).toFixed(1) +
      'ms · p95 ' + at(0.95).toFixed(1) + 'ms · بدترین ' + f[f.length - 1].toFixed(1) +
      'ms · فریم کند ' + jank + '/' + f.length + ' · LongTask ' + longTasks +
      ' · حدود ' + Math.round(f.length / (elapsed / 1000)) + 'fps';
    resultEl.textContent = line;
    window.__lastBench = line;
    benchBtn.disabled = false;
    benchBtn.textContent = 'اندازه‌گیری مجدد';
  }

  function deviceInfo() {
    var ua = navigator.userAgent || '';
    var m = /Chrome\/([\d.]+)/.exec(ua);
    return [
      window.innerWidth + '×' + window.innerHeight,
      'dpr ' + (window.devicePixelRatio || 1),
      'هسته ' + (navigator.hardwareConcurrency || '?'),
      'WebView ' + (m ? m[1] : '?')
    ].join(' · ');
  }

  function open() {
    if (panel) return;
    panel = el('div', 'dg-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'آزمایشگاه لگ');

    var head = el('div', 'dg-head');
    head.append(el('b', null, 'FPS: '), fpsEl = el('span', null, '–'),
      el('span', null, '   بدترین فریم: '), worstEl = el('span', null, '–'));
    panel.appendChild(head);
    panel.appendChild(el('div', 'dg-info', deviceInfo()));

    var benchBox = el('div', 'dg-bench');
    benchBtn = el('button', 'dg-btn dg-primary', 'شروع اندازه‌گیری ۵ ثانیه‌ای');
    benchBtn.type = 'button';
    benchBtn.onclick = function () { startBench(5000); };
    benchBox.appendChild(benchBtn);
    benchBox.appendChild(el('div', 'dg-hint', 'بعد از زدن دکمه، ۵ ثانیه با انگشت اسکرول کن.'));
    resultEl = el('div', 'dg-result');
    benchBox.appendChild(resultEl);
    var copyBtn = el('button', 'dg-btn', 'کپی نتیجه');
    copyBtn.type = 'button';
    copyBtn.onclick = function () {
      var txt = (window.__lastBench || '—') + ' | ' + JSON.stringify(flags) + ' | ' + deviceInfo();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { copyBtn.textContent = 'کپی شد ✓'; },
          function () { copyBtn.textContent = 'کپی نشد'; });
      } else { copyBtn.textContent = 'کپی پشتیبانی نمی‌شود'; }
    };
    benchBox.appendChild(copyBtn);
    panel.appendChild(benchBox);

    var opts = [
      ['gl', 'پس‌زمینه‌ی سه‌بعدی (WebGL)'],
      ['p', 'ذرات پس‌زمینه'],
      ['pseudo', 'لایه‌های گرادیان تمام‌صفحه'],
      ['anim', 'همه‌ی انیمیشن‌ها'],
      ['shadow', 'سایه‌ها'],
      ['filter', 'فیلترها و بلور'],
      ['flat', 'لایه‌های سه‌بعدی کارت‌ها'],
      ['tick', 'به‌روزرسانی هر ثانیه']
    ];
    opts.forEach(function (o) {
      var b = el('button', 'dg-btn', o[1] + ': روشن');
      b.type = 'button';
      b.onclick = function () {
        flags[o[0]] = !flags[o[0]];
        b.textContent = o[1] + ': ' + (flags[o[0]] ? 'خاموش' : 'روشن');
        b.classList.toggle('off', flags[o[0]]);
        apply();
      };
      panel.appendChild(b);
    });

    var close = el('button', 'dg-btn dg-close', 'بستن و برگرداندن همه‌چیز');
    close.type = 'button';
    close.onclick = shut;
    panel.appendChild(close);

    document.body.appendChild(panel);
    live.frames = 0; live.worst = 0; live.last = 0; live.t0 = performance.now();
    liveRaf = requestAnimationFrame(liveFrame);
  }

  function shut() {
    cancelAnimationFrame(liveRaf);
    if (bench.running) { bench.running = false; cancelAnimationFrame(bench.raf); }
    flags = { gl: false, p: false, anim: false, shadow: false, filter: false, pseudo: false, flat: false, tick: false };
    apply();
    if (panel) panel.remove();
    panel = null;
  }

  function card() {
    var v = document.getElementById('view-profile'); if (!v) return;
    var c = el('div', 'card');
    c.appendChild(el('div', 'section-title', 'آزمایشگاه لگ'));
    c.appendChild(el('p', 'au-sub', 'اگر برنامه روی گوشی کند است: پنل را باز کن، «اندازه‌گیری» را بزن و ۵ ثانیه اسکرول کن؛ بعد هر گزینه را یکی‌یکی خاموش کن و دوباره اندازه بگیر.'));
    var b = el('button', 'ghost-btn', 'باز کردن آزمایشگاه لگ');
    b.type = 'button'; b.onclick = open;
    c.appendChild(b);
    v.appendChild(c);
  }

  window.AriaDiag = { open: open, close: shut, flags: function () { return flags; }, bench: startBench };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', card); else card();
})();
