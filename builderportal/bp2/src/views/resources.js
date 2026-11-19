import { getIndex, getResources } from '../store.js';
import { icon } from '../lib/icons.js';
import { TYPE_META } from '../lib/colors.js';
import { num, esc, debounce } from '../lib/format.js';
import { resourceRow } from '../components/drawer.js';
import { pageHead } from '../components/common.js';

function build(root, { preset }) {
  return (async () => {
    const [idx, all] = await Promise.all([getIndex(), getResources()]);
    const types = idx.types;
    const state = { q: '', type: preset || 'all', rm: 'all', shown: 60 };
    const isVideos = preset === 'video';

    root.innerHTML = `<div class="page">
      ${pageHead({
        title: isVideos ? 'Video library' : 'Resource library',
        sub: isVideos
          ? `${num(idx.totals.byType.video)} curated YouTube lessons, playlists and courses linked across the roadmaps.`
          : `${num(idx.totals.resources)} curated links — articles, official docs, videos, courses, books and more.`,
      })}
      <div class="toolbar">
        <div class="input-wrap">${icon('search')}<input class="input" id="q" placeholder="Search ${isVideos ? 'videos' : 'resources'}…" /></div>
        <select class="input" id="rm"><option value="all">All roadmaps</option>${idx.roadmaps.map((r, i) => `<option value="${i}">${esc(r.title)}</option>`).join('')}</select>
      </div>
      ${isVideos ? '' : `<div class="chips" id="chips" style="margin-bottom:20px">
        <button class="chip on" data-t="all">All <span class="count">${num(idx.totals.resources)}</span></button>
        ${types.map((t, i) => `<button class="chip" data-t="${i}"><span class="dot" style="background:${TYPE_META[t].color}"></span>${TYPE_META[t].label} <span class="count">${num(idx.totals.byType[t])}</span></button>`).join('')}
      </div>`}
      <div class="card"><div class="card-head"><div class="card-title" id="count"></div></div><div class="res-list" id="list"></div><div class="more" id="more"></div></div>
    </div>`;

    const typeIdx = isVideos ? types.indexOf('video') : state.type === 'all' ? -1 : +state.type;
    state.t = typeIdx;
    const list = root.querySelector('#list');
    const render = () => {
      const q = state.q.toLowerCase();
      const out = all.filter((r) => (state.t === -1 || r[0] === state.t) && (state.rm === 'all' || r[3] === +state.rm) && (!q || r[1].toLowerCase().includes(q) || r[4].toLowerCase().includes(q)));
      root.querySelector('#count').textContent = `${num(out.length)} result${out.length === 1 ? '' : 's'}`;
      list.innerHTML = out.slice(0, state.shown).map((r) => {
        const row = resourceRow(r, types, false).replace('<div class="res-title">', `<div class="res-title">`);
        return row.replace(/<\/div><\/span>/, `</div><div class="res-meta">${esc(r[4])} · ${esc(idx.roadmaps[r[3]].title)}</div></span>`);
      }).join('') || '<div class="empty">Nothing matches your filters.</div>';
      root.querySelector('#more').innerHTML = out.length > state.shown ? `<button class="btn" id="more-btn">Show more</button>` : '';
      const mb = root.querySelector('#more-btn'); if (mb) mb.onclick = () => { state.shown += 100; render(); };
    };
    root.querySelector('#q').oninput = debounce((e) => { state.q = e.target.value.trim(); state.shown = 60; render(); });
    root.querySelector('#rm').onchange = (e) => { state.rm = e.target.value; state.shown = 60; render(); };
    root.querySelector('#chips')?.addEventListener('click', (e) => {
      const b = e.target.closest('[data-t]'); if (!b) return;
      state.t = b.dataset.t === 'all' ? -1 : +b.dataset.t; state.shown = 60;
      root.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b));
      render();
    });
    render();
  })();
}

export const resources = (root) => build(root, {});
export const videos = (root) => build(root, { preset: 'video' });
