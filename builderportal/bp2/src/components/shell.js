import { icon, brandMark } from '../lib/icons.js';
import { getSession, logout } from '../auth.js';

const NAV = [
  { href: '#/', id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '#/universe', id: 'universe', label: 'Universe', icon: 'universe' },
  { href: '#/roadmaps', id: 'roadmaps', label: 'Roadmaps', icon: 'roadmaps' },
  { href: '#/resources', id: 'resources', label: 'Resources', icon: 'resources' },
  { href: '#/videos', id: 'videos', label: 'Videos', icon: 'video' },
  { href: '#/insights', id: 'insights', label: 'Insights', icon: 'insights' },
];

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function renderShell(root) {
  root.innerHTML = `
    <div class="app" id="app-root">
      <aside class="sidebar" id="app-sidebar">
        <a class="brand" href="#/">
          <span class="brand-mark">${brandMark}</span>
          <span class="brand-name">builderportal<small>Learn, build, ship</small></span>
        </a>
        <nav class="nav">
          <div class="nav-label">Explore</div>
          ${NAV.map((n) => `<a href="${n.href}" data-nav="${n.id}">${icon(n.icon)}<span>${n.label}</span></a>`).join('')}
        </nav>
        <div class="sidebar-foot">
          <div class="user-profile-slot" id="user-profile-slot"></div>
          <button class="btn theme-btn" id="theme-toggle" aria-label="Toggle theme">${icon('moon')}<span>Dark mode</span></button>
          <div class="source-note">404 Society · Progress saved per member.</div>
        </div>
      </aside>
      <main class="main" id="main"></main>
    </div>
    <aside class="drawer" id="drawer" aria-hidden="true"></aside>`;

  const appEl = root.querySelector('#app-root');
  const profileSlot = root.querySelector('#user-profile-slot');

  function renderProfile() {
    const session = getSession();
    if (!session) {
      profileSlot.innerHTML = '';
      return;
    }
    profileSlot.innerHTML = `
      <div class="user-profile-badge">
        <div class="profile-avatar">${getInitials(session.name)}</div>
        <div class="profile-meta">
          <div class="profile-name" title="${session.name}">${session.name}</div>
          <div class="profile-sub">
            <span class="profile-id">${session.id}</span>
            ${session.role ? `<span class="profile-role">${session.role}</span>` : ''}
          </div>
        </div>
        <button class="btn-icon signout-btn" id="btn-signout" title="Sign out (${session.name})">
          ${icon('logout')}
        </button>
      </div>
    `;

    const signoutBtn = profileSlot.querySelector('#btn-signout');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  }

  const saved = localStorage.getItem('theme');
  const setTheme = (t) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem('theme', t);
    const btn = root.querySelector('#theme-toggle');
    btn.innerHTML = `${icon(t === 'dark' ? 'sun' : 'moon')}<span>${t === 'dark' ? 'Light mode' : 'Dark mode'}</span>`;
    window.dispatchEvent(new Event('themechange'));
  };
  setTheme(saved || 'light');
  root.querySelector('#theme-toggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  const setActive = (path) => {
    const session = getSession();
    const isLogin = path === '/login' || !session;
    appEl.classList.toggle('auth-mode', isLogin);

    const id = path === '/' ? 'dashboard' : path.split('/')[1].replace(/^roadmap$/, 'roadmaps');
    root.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === id));
    renderProfile();
  };

  window.addEventListener('routechange', (e) => setActive(e.detail));
  window.addEventListener('authchange', () => {
    setActive(location.hash.replace(/^#/, '') || '/');
  });

  renderProfile();
  return root.querySelector('#main');
}
