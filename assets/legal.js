// Páginas legais: idioma (PT/EN) e preferências de cookies. Não carrega serviços de análise.
(function () {
const params = new URLSearchParams(location.search);
let lang = params.get('lang') === 'en' ? 'en' : 'pt';
const toggle = document.getElementById('lang-toggle');

// ===== Preferências de cookies (mesmas chaves que a página inicial) =====
const MAX_AGE = 183 * 24 * 60 * 60 * 1000; // a escolha é pedida de novo ao fim de ~6 meses
function getConsent() {
try {
const v = localStorage.getItem('axis-consent');
const at = Number(localStorage.getItem('axis-consent-at')) || 0;
if (v && Date.now() - at > MAX_AGE) return null;
return v;
} catch (e) { return null; }
}
function setConsent(v) {
try { localStorage.setItem('axis-consent', v); localStorage.setItem('axis-consent-at', String(Date.now())); } catch (e) {}
}
function clearAnalyticsCookies() {
const host = location.hostname;
const domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
document.cookie.split(';').forEach(c => {
const name = c.split('=')[0].trim();
if (/^(_ga|_gid|_clck|_clsk)/.test(name)) {
domains.forEach(d => { document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : ''); });
}
});
}
function updateCookieStatus() {
const v = getConsent();
const key = v === 'accepted' ? 'accepted' : v === 'rejected' ? 'rejected' : 'none';
const text = {
pt: { accepted: 'Aceitaste os cookies de análise.', rejected: 'Recusaste os cookies de análise.', none: 'Ainda não escolheste. Os cookies de análise estão desligados.' },
en: { accepted: 'You accepted analytics cookies.', rejected: 'You declined analytics cookies.', none: 'You have not chosen yet. Analytics cookies are off.' }
};
document.querySelectorAll('.js-cookie-status').forEach(el => {
const l = (el.closest('[lang]') || document.documentElement).lang === 'en' ? 'en' : 'pt';
el.textContent = text[l][key];
});
}
document.querySelectorAll('.js-cookie-accept').forEach(b => b.addEventListener('click', () => { setConsent('accepted'); updateCookieStatus(); }));
document.querySelectorAll('.js-cookie-reject').forEach(b => b.addEventListener('click', () => { setConsent('rejected'); clearAnalyticsCookies(); updateCookieStatus(); }));

// ===== Idioma =====
function applyLang() {
document.documentElement.lang = lang === 'en' ? 'en' : 'pt-PT';
document.title = document.documentElement.getAttribute(lang === 'en' ? 'data-title-en' : 'data-title-pt') || document.title;
if (toggle) {
toggle.textContent = lang === 'en' ? 'PT' : 'EN';
toggle.setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
toggle.setAttribute('lang', lang === 'en' ? 'pt-PT' : 'en');
}
// Links internos mantêm o idioma escolhido
document.querySelectorAll('a[data-keep-lang]').forEach(a => {
const url = new URL(a.getAttribute('href'), location.href);
if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
a.href = url.href;
});
}

if (toggle) toggle.addEventListener('click', () => {
lang = lang === 'en' ? 'pt' : 'en';
const url = new URL(location.href);
if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
history.replaceState(null, '', url);
applyLang();
updateCookieStatus();
});

applyLang();
updateCookieStatus();
})();
