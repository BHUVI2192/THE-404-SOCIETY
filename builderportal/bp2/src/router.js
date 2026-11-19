import { getSession } from './auth.js';

const routes = [];
let cleanup = null;

export const route = (pattern, view) => {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '/?$');
  routes.push({ re, keys, view });
};

export const currentPath = () => location.hash.replace(/^#/, '') || '/';

export async function navigate(container) {
  const path = currentPath().split('?')[0];
  const session = getSession();

  // Authentication guards
  if (!session && path !== '/login') {
    location.hash = '#/login';
    return;
  }
  if (session && path === '/login') {
    location.hash = '#/';
    return;
  }

  for (const r of routes) {
    const m = r.re.exec(path);
    if (!m) continue;
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    if (cleanup) { try { cleanup(); } catch { /* noop */ } cleanup = null; }
    container.innerHTML = '';
    container.scrollTop = 0;
    cleanup = (await r.view(container, params)) || null;
    window.dispatchEvent(new CustomEvent('routechange', { detail: path }));
    return;
  }
  location.hash = session ? '#/' : '#/login';
}
