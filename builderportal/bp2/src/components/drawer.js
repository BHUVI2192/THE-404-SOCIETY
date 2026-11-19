import { icon } from '../lib/icons.js';
import { TYPE_META } from '../lib/colors.js';
import { esc, host } from '../lib/format.js';

const el = () => document.getElementById('drawer');

export function resourceRow(r, types, showHost = true) {
  const t = types[r[0]], meta = TYPE_META[t];
  const internal = String(r[2]).startsWith('#');
  return `<a class="res" href="${esc(r[2])}" ${internal ? '' : 'target="_blank" rel="noopener noreferrer"'}>
    <span class="badge" style="background:color-mix(in srgb, ${meta.color} 14%, transparent);color:${meta.color}">${meta.single}</span>
    <span><div class="res-title">${esc(r[1] || r[2])}</div>${showHost ? `<div class="res-meta">${internal ? 'Opens in builderportal' : esc(host(r[2]))}</div>` : ''}</span>
    ${icon('external')}
  </a>`;
}

export function openTopic(topic, roadmap, types, { done, onToggle } = {}) {
  const d = el();
  const groups = {};
  topic.resources.forEach((r) => (groups[types[r[0]]] ||= []).push(r));
  d.innerHTML = `
    <div class="drawer-head">
      <div>
        <h2>${esc(topic.title)}</h2>
        <small>${topic.resources.length} resource${topic.resources.length === 1 ? '' : 's'} in ${esc(roadmap.title)}</small>
      </div>
      <button class="btn-icon" id="drawer-close" aria-label="Close">${icon('close')}</button>
    </div>
    <div class="drawer-body">
      ${onToggle ? `<button class="btn ${done ? '' : 'primary'}" id="drawer-done">${done ? 'Completed. Undo' : 'Mark as completed'}</button>` : ''}
      ${topic.description ? `<p>${esc(topic.description)}</p>` : '<p>No description yet for this topic.</p>'}
      ${Object.entries(groups).map(([type, list]) => `
        <div>
          <div class="section-label" style="color:${TYPE_META[type].color}">${TYPE_META[type].label} (${list.length})</div>
          <div class="res-list">${list.map((r) => resourceRow(r, types)).join('')}</div>
        </div>`).join('') || '<div class="empty">No linked resources.</div>'}
    </div>`;
  d.classList.add('open');
  d.setAttribute('aria-hidden', 'false');
  d.querySelector('#drawer-close').onclick = closeDrawer;
  const b = d.querySelector('#drawer-done');
  if (b) b.onclick = () => { const now = onToggle(topic); b.className = `btn ${now ? '' : 'primary'}`; b.textContent = now ? 'Completed. Undo' : 'Mark as completed'; };
}

export function closeDrawer() {
  const d = el();
  d.classList.remove('open');
  d.setAttribute('aria-hidden', 'true');
}
