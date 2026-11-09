/* Aria Edit — learning resources. Data is static; DOM is built with textContent only. */
(function () {
  'use strict';
  var ALLOWED = ['faradars.org', 'www.youtube.com', 'youtube.com', 'www.udemy.com', 'gravityofficial.ir', 'www.gravityofficial.ir', 'maajara.com', 'www.maajara.com', 'danup.ir', 'www.danup.ir'];
  var COURSES = [
    { id: 'khosravi', name: 'آموزش تدوین ویدیو با Premiere Pro ۲۰۲۵', teacher: 'استاد علی خسروی', platform: 'فرادرس — ۹ ساعت، ۲۰ فصل، ۸۲ درس',
      desc: 'دوره کامل و جامع پریمیر پرو ۲۰۲۵ از آشنایی با محیط نرم‌افزار تا خروجی گرفتن، آزمون جامع و گواهینامه.',
      topics: ['فصل ۱: آشنایی با نرم‌افزار پریمیر (پروژه جدید، Workspace، ایجاد سکانس)', 'فصل ۲: آشنایی با پنل‌های مهم (Project، تایم‌لاین، مانیتورها، Effect و Effect Control)', 'فصل ۳: کاربرد Source Monitor (مارکرها، Insert و Overwrite)', 'فصل ۴: کاربرد Time Line (جداسازی صدا و تصویر، Razor، Slow/Fast Motion، Rate Stretch)', 'فصل ۵: کاربرد Program Monitor (منوی Edit، History، Copy & Paste)', 'فصل ۶: تدوین خودکار و سایر ابزارها (Automate Sequence، انواع کات)', 'فصل ۷: تغییر خصوصیات کلیپ (ابعاد، شفافیت، چرخش، Crop، مد ترکیبی)', 'فصل ۸: انیمیشن (کی‌فریم، شتاب، Nest و Subsequence)', 'فصل ۹: Transition', 'فصل ۱۰: افزودن افکت‌ها (Adjustment Layer، Blur، Distort، پریست و پلاگین)', 'فصل ۱۱: گرافیک و موشن‌گرافیک (متن، شکل، Essential Graphics، زیرنویس خودکار)', 'فصل ۱۲: تدوین پیشرفته (Multicam، Time Remapping)', 'فصل ۱۳: اصلاح رنگ (Lumetri، Look سینمایی، ذخیره Preset)', 'فصل ۱۴: تنظیم و ویرایش صدا (ضبط صدا، Remix، Essential Sound)', 'فصل ۱۵: ماسک و پرده سبز (Track Matte)', 'فصل ۱۶: سایر قابلیت‌ها (Auto Frame، Proxy، لرزش‌گیری، Echo، Freeze Frame)', 'فصل ۱۷: خروجی گرفتن (فرمت‌ها، شبکه‌های اجتماعی، Media Encoder)', 'فصل ۱۸: راهنمایی ادامه مسیر', 'فصل ۱۹: آزمون جامع و گواهینامه', 'فصل ۲۰: محتوای تکمیلی (خلاصه متنی، واژه‌نامه، پرسش‌های متداول، مشاغل مرتبط)'],
      url: 'https://faradars.org/courses/video-editing-using-premiere-pro-2025-fvadb306' },
    { id: 'eskandari', name: 'آموزش ادوبی پریمیر پرو ۲۰۲۴ (مسترکلاس)', teacher: 'استاد زاروان اسکندری', platform: 'یوتیوب (کانال VideoPost) — رایگان، حدود ۱۲ ساعت',
      desc: 'پلی‌لیست مسترکلاس پریمیر پرو ۲۰۲۴ با تدریس تدوینگر حرفه‌ای سینما و تلویزیون.',
      topics: ['آشنایی با محیط نرم‌افزار و ورک‌اسپیس‌ها', 'تنظیمات اولیه برنامه و ستینگ‌ها', 'مدیریت فایل‌ها و پروجکت تمپلیت‌ها', 'ساخت تایم‌لاین و سکانس جدید', 'سورس مانیتور و پروگرم مانیتور', 'ادیت در تایم‌لاین', 'کلیدهای میانبر و مارکرها', 'افکت‌ها و پنل Effect Control', 'انیمیشن و کی‌فریم', 'تایم‌لاین پیشرفته', 'ترنزیشن‌ها', 'تغییر سرعت ویدیو', 'پراکسی برای ادیت روی سیستم ضعیف', 'کار با صدا', 'ماسک و ترک کردن سوژه', 'اصلاح رنگ با Lumetri Color', 'کروماکی (پرده سبز)', 'پنل Essential Graphics', 'ساخت زیرنویس و کپشن', 'تغییر قاب اتوماتیک و اندازه فریم برای شبکه‌های اجتماعی', 'ادیت چند دوربینه', 'صداگذاری پیشرفته', 'خروجی گرفتن و تنظیمات خروجی'],
      url: 'https://www.youtube.com/playlist?list=PLpZ6IYEaF8g3FvrfJYj-q_jawHdvU6mq1' },
    { id: 'udemy', name: 'Complete Adobe Premiere Pro Megacourse: Beginner to Expert', teacher: 'دوره مکمل — Adam Bowles و Hosna Kachooee', platform: 'Udemy (انگلیسی)',
      desc: 'دوره تکمیلی انگلیسی؛ از وارد کردن و مدیریت مدیا تا کی‌فریم، رنگ‌بندی و گرافیک.',
      topics: ['دانلود Premiere Pro', 'معرفی کلی Adobe Premiere Pro', 'تنظیم اولیه Premiere Pro', 'ورود و مدیریت مدیا و برش کلیپ‌ها', 'ترنزیشن‌ها و صدا', 'انیمیشن با کی‌فریم', 'رنگ‌بندی (Color Grading)', 'Essential Graphics و افکت‌های پویا'],
      url: 'https://www.udemy.com/course/complete-adobe-premiere-pro-megacourse-beginner-to-expert/' },
    { id: "gravity-ae", name: "دوره آموزش افترافکت (After Effects) گرویتی", teacher: "گرویتی", platform: "وب‌سایت رسمی گرویتی",
      desc: "دوره پیشنهادی برای مسیر آموزشی آریا ادیت.", goal: "یادگیری صفر تا صد مباحث پایه و ساختارمند کردن ذهن برای ورود به موشن گرافیک.", months: "ماه ۱۳ و ۱۴",
      topics: ["آموزش از صفر محیط نرم‌افزار،مدیریت کی‌فریم‌ها،انیمیشن‌های پایه،کار با متن و لایه‌های شکل (Shape Layers)،انجام پروژه‌های عملی برای تثبیت"],
      url: 'https://gravityofficial.ir/course/%d8%af%d9%88%d8%b1%d9%87-%d8%a2%d9%85%d9%88%d8%b2%d8%b4-%d8%a7%d9%81%d8%aa%d8%b1%d8%a7%d9%81%da%a9%d8%aa-after-effects/' },
    { id: "yt-motion-advanced", name: "پلی‌لیست آموزش موشن گرافیک پیشرفته", teacher: "یوتیوب (پلی‌لیست)", platform: "یوتیوب — پلی‌لیست",
      desc: "دوره پیشنهادی برای مسیر آموزشی آریا ادیت.", goal: "تثبیت آموخته‌های گرویتی، یادگیری ترفندهای جدید و بالا بردن سرعت و کیفیت کار در سطح استادی.", months: "ماه ۱۳ تا ۱۵",
      topics: ["تکنیک‌های پیشرفته‌تر انیمیشن،کار با اکسپرشن‌ها (Expressions)،ترکیب لایه‌ها،افکت‌های پیچیده‌تر،گردش کار حرفه‌ای"],
      url: 'https://youtube.com/playlist?list=PLNY5uf-PNvMQw84h2ENXWoSCGHLaaivqF' },
    { id: "gravity-davinci", name: "دوره آموزش داوینچی رزولو (DaVinci Resolve) گرویتی", teacher: "گرویتی", platform: "وب‌سایت رسمی گرویتی",
      desc: "دوره پیشنهادی برای مسیر آموزشی آریا ادیت.", goal: "ورود اصولی و بدون سردرگمی به دنیای داوینچی و یادگیری پایه‌های تدوین و رنگ.", months: "ماه ۱۷ و ۱۸",
      topics: ["آشنایی با محیط نرم‌افزار،کار در صفحه Edit (تدوین)،اصول اولیه Color (رنگ‌بندی)،آشنایی با Fusion و Fairlight (صدا)"],
      url: 'https://gravityofficial.ir/course/%D8%AF%D9%88%D8%B1%D9%87-%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%D8%AF%D8%A7%D9%88%DB%8C%D9%86%DA%86%DB%8C-%D8%B1%DB%8C%D8%B2%D8%A7%D9%84%D9%88%D9%8Ddavinci-resolve/' },
    { id: "eskandari-davinci", name: "آموزش داوینچی رزولو", teacher: "استاد زاروان اسکندری", platform: "یوتیوب",
      desc: "دوره پیشنهادی برای مسیر آموزشی آریا ادیت.", goal: "عمق بخشیدن به مهارت رنگ‌بندی، یادگیری استانداردهای سینمایی و تثبیت دانش داوینچی با تجربه یک استاد.", months: "ماه ۱۸ و ۳۲",
      topics: ["تدوین حرفه‌ای،تکنیک‌های پیشرفته رنگ‌بندی سینمایی،مدیریت رنگ (Color Management)،کار با نودها،نکات تجربی یک تدوینگر سینما"],
      url: 'https://youtube.com/playlist?list=PLpZ6IYEaF8g1C_1R6F2MoDL3W9FYx9_UL' },
    { id: "majera-sound", name: "دوره مقدماتی صداگذاری فیلم", teacher: "زهره علی‌اکبری", platform: "مدرسه فیلم ماجرا",
      desc: "دوره پیشنهادی برای مسیر آموزشی آریا ادیت.", goal: "درک عمیق از اینکه چطور صدا می‌تواند فضاسازی کند و حس را منتقل کند (فراتر از صرفاً کار با نرم‌افزار).", months: "ماه ۱۹ و ۲۰",
      topics: ["فیزیک و روانشناسی صدا،آشنایی با نرم‌افزار Nuendo،اصول صداگذاری،ساخت فولی (Foley)،دیالوگ،میکس،یک پروژه کامل سینمایی"],
      url: 'https://maajara.com/Course/262/%D8%AF%D9%88%D8%B1%D9%87_%D9%85%D9%82%D8%AF%D9%85%D8%A7%D8%AA%DB%8C_%D8%B5%D8%AF%D8%A7%DA%AF%D8%B0%D8%A7%D8%B1%DB%8C_%D9%81%DB%8C%D9%84%D9%85' },
    { id: "danup-editing", name: "پکیج آموزش جامع تدوین سینمایی (عمق تدوین)", teacher: "داناپ", platform: "وب‌سایت داناپ (Danup)",
      desc: "دوره پیشنهادی برای مسیر آموزشی آریا ادیت.", goal: "تبدیل شدن از یک «ادیتور» به یک «داستان‌گو» که می‌داند کجا و چرا کات بزند تا مخاطب را تحت تأثیر قرار دهد.", months: "ماه ۲۱ و ۳۴",
      topics: ["تئوری تدوین،ریتم،ساختار داستانی،زیبایی‌شناسی بصری،روانشناسی مخاطب،آموزش کامل و پیشرفته پریمیر"],
      url: 'https://danup.ir/courses/film-editing/' }
  ];
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function safe(u) { try { var p = new URL(u); return p.protocol === 'https:' && ALLOWED.indexOf(p.hostname) > -1; } catch (e) { return false; } }
  function render() {
    var root = document.getElementById('resourcesRoot'); if (!root) return; root.textContent = '';
    COURSES.forEach(function (c) {
      var card = el('details', 'card rs-card'), sum = el('summary', 'rs-sum');
      sum.append(el('span', 'rs-name', c.name), el('span', 'rs-teacher', c.teacher)); card.appendChild(sum);
      var b = el('div', 'rs-body');
      b.append(el('div', 'rs-label', 'پلتفرم'), el('p', null, c.platform), el('div', 'rs-label', 'توضیحات'), el('p', null, c.desc), el('div', 'rs-label', 'سرفصل‌ها'));
      if (c.goal) b.insertBefore(el('p', null, 'هدف دوره: ' + c.goal), b.lastChild.previousSibling ? b.lastChild.previousSibling : null);
      if (c.months) b.insertBefore(el('p', 'rs-note', 'مرتبط با نقشه راه: ' + c.months), b.lastChild);
      if (c.topics.length) { var ul = el('ul', 'rs-list'); c.topics.forEach(function (t) { ul.appendChild(el('li', null, t)); }); b.appendChild(ul); }
      else b.appendChild(el('p', 'rs-note', 'سرفصل‌های دقیق این دوره هنوز در برنامه وارد نشده؛ فعلاً از صفحه دوره ببینید.'));
      b.appendChild(el('div', 'rs-label', 'لینک آموزش'));
      if (!c.url) b.appendChild(el('p', 'rs-note', 'لینک این دوره هنوز در برنامه وارد نشده؛ با نام دوره در پلتفرم جست‌وجو کنید.'));
      else if (safe(c.url)) { var a = el('a', 'ghost-btn primary rs-link', 'باز کردن دوره'); a.href = c.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; b.appendChild(a); }
      card.appendChild(b); root.appendChild(card);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
