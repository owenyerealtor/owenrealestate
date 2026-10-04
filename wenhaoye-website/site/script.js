// ================================================================
//  Wenhao Ye website – content is loaded from content/*.json
//  (edited through the admin backend at /admin/)
// ================================================================
const urlLang = new URLSearchParams(location.search).get('lang');
let lang = (urlLang === 'en' || urlLang === 'zh') ? urlLang
  : localStorage.getItem('wy_lang') || (/^zh/i.test(navigator.language || '') ? 'zh' : 'en');

const META = {
  zh: { title: 'Wenhao Ye | 休斯敦地产经纪 · 房屋贷款 · 建筑 · 房屋管理',
        desc: 'Wenhao Ye — 休斯敦持牌地产经纪人、贷款专员（NMLS #2541101），经营建筑公司与房屋管理公司，提供一站式房产服务。' },
  en: { title: 'Wenhao Ye | Houston Real Estate · Mortgage · Construction · Property Management',
        desc: 'Wenhao Ye — Houston REALTOR®, Mortgage Loan Officer (NMLS #2541101), and owner of construction and property management companies. One-stop real estate solutions.' }
};
const CAT = {
  realestate: { zh: '地产', en: 'Real Estate' },
  construction: { zh: '建筑', en: 'Construction' },
  management: { zh: '房屋管理', en: 'Management' },
  other: { zh: '其他', en: 'Other' }
};

let SITE = null;          // content/site.json
let GALLERY = [];         // content/gallery.json items
let filter = 'all';
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const langBtn = $('#langBtn');

// ---------- helpers ----------
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// allow only <br> and <small> from CMS text, everything else escaped
const safeHtml = s => esc(s).replace(/&lt;br\s*\/?&gt;/gi, '<br>').replace(/&lt;(\/?)small&gt;/gi, '<$1small>').replace(/\n/g, '<br>');
const getText = key => { if (!SITE) return null; const [sec, k] = key.split('.'); return SITE.texts?.[sec]?.[k] || null; };
const telHref = p => 'tel:+1' + String(p).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');

// ---------- language ----------
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  $$('[data-zh]').forEach(el => {
    const t = el.dataset.k && getText(el.dataset.k);
    el.innerHTML = t ? safeHtml(t[lang] || t.zh || t.en) : el.dataset[lang];
  });
  $$('[data-ph-zh]').forEach(el => {
    const t = el.dataset.pk && getText(el.dataset.pk);
    el.placeholder = t ? (t[lang] || '') : (lang === 'zh' ? el.dataset.phZh : el.dataset.phEn);
  });
  langBtn.textContent = lang === 'zh' ? 'EN' : '中文';
  document.title = META[lang].title;
  $('meta[name=description]').content = META[lang].desc;
  const u = new URL(location); u.searchParams.set('lang', lang); history.replaceState(null, '', u);
  renderGallery();
}
langBtn.onclick = () => { lang = lang === 'zh' ? 'en' : 'zh'; localStorage.setItem('wy_lang', lang); applyLang(); };

// ---------- apply site settings & images ----------
function applySite() {
  if (!SITE) return;
  const s = SITE.settings || {}, im = SITE.images || {};
  if (s.phone) {
    $$('.js-phone').forEach(e => e.textContent = s.phone);
    $$('.js-tel').forEach(e => e.href = telHref(s.phone));
  }
  if (s.email) { const a = $('.js-email'); a.style.display = ''; a.href = 'mailto:' + s.email; $('.js-email-t').textContent = s.email; }
  if (s.wechat) { $('.js-wechat').style.display = ''; $('.js-wechat-t').textContent = s.wechat; }
  if (s.har_url) $$('.js-har').forEach(e => e.href = s.har_url);
  if (s.loan_url) $$('.js-loan').forEach(e => e.href = s.loan_url);
  if (s.apply_url) $$('.js-apply').forEach(e => e.href = s.apply_url);
  $$('[data-img]').forEach(e => { const v = im[e.dataset.img]; if (v) e.src = v; });
  if (im.hero_bg) $('.hero').style.backgroundImage =
    `linear-gradient(100deg,rgba(10,28,46,.9) 0%,rgba(10,28,46,.6) 50%,rgba(10,28,46,.15) 100%),url("${im.hero_bg}")`;
}

// ---------- gallery ----------
const title = p => (lang === 'en' ? (p.title_en || p.title_zh) : (p.title_zh || p.title_en)) || '';
function renderGallery() {
  const g = $('#grid'); if (!g) return;
  const list = GALLERY.map((p, i) => ({ ...p, i })).filter(p => p.image && (filter === 'all' || p.category === filter));
  if (!list.length) { g.innerHTML = `<div class="empty">${lang === 'zh' ? '暂无照片' : 'No photos yet'}</div>`; return; }
  g.innerHTML = list.map(p => `
    <div class="g-item" data-i="${p.i}">
      <img src="${esc(p.image)}" alt="${esc(title(p))}" loading="lazy">
      <div class="g-cap"><small>${CAT[p.category]?.[lang] || ''}</small><br>${esc(title(p))}</div>
    </div>`).join('');
}
$('#filters').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#filters button').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); filter = b.dataset.f; renderGallery();
};
const lb = $('#lightbox');
$('#grid').onclick = e => {
  const it = e.target.closest('.g-item'); if (!it) return;
  const p = GALLERY[+it.dataset.i];
  $('#lbImg').src = p.image; $('#lbCap').textContent = title(p);
  lb.classList.add('open');
};
$('#lbClose').onclick = () => lb.classList.remove('open');
lb.onclick = e => { if (e.target === lb) lb.classList.remove('open'); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });

// ---------- nav ----------
const nav = $('#nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
$('#menuBtn').onclick = () => $('#navLinks').classList.toggle('open');
$$('#navLinks a').forEach(a => a.onclick = () => $('#navLinks').classList.remove('open'));
$('#yr').textContent = new Date().getFullYear();

// ---------- contact form -> SMS ----------
$('#contactForm').onsubmit = e => {
  e.preventDefault();
  const v = id => $('#' + id).value.trim();
  const L = lang === 'zh' ? ['网站咨询', '姓名', '电话', '邮箱', '需求', '留言'] : ['Website inquiry', 'Name', 'Phone', 'Email', 'Need', 'Message'];
  const body = `[${L[0]}] ${L[1]}: ${v('fName')} | ${L[2]}: ${v('fPhone')} | ${L[3]}: ${v('fEmail')} | ${L[4]}: ${v('fNeed')} | ${L[5]}: ${v('fMsg')}`;
  const phone = telHref(SITE?.settings?.phone || '(347) 774-5396').replace('tel:', '');
  location.href = `sms:${phone}${/iPhone|iPad|Mac/.test(navigator.userAgent) ? '&' : '?'}body=${encodeURIComponent(body)}`;
};

// ---------- load content ----------
async function getJSON(u) { try { const r = await fetch(u, { cache: 'no-cache' }); return r.ok ? await r.json() : null; } catch (e) { return null; } }
applyLang(); // instant render with built-in text
(async () => {
  const [site, gal] = await Promise.all([getJSON('content/site.json'), getJSON('content/gallery.json')]);
  if (site) SITE = site;
  if (gal && Array.isArray(gal.items)) GALLERY = gal.items;
  applySite();
  applyLang();
})();
