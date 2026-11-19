const nf = new Intl.NumberFormat('en-US');
export const num = (n) => nf.format(n);
export const compact = (n) => (n >= 10000 ? `${(n / 1000).toFixed(1)}k` : nf.format(n));
export const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '0%');
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const host = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };
export const debounce = (fn, ms = 160) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
