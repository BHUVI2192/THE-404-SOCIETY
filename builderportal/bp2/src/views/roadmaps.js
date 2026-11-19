import { getIndex } from '../store.js';
import { icon } from '../lib/icons.js';
import { CATEGORY_COLORS } from '../lib/colors.js';
import { debounce, esc, num } from '../lib/format.js';
import { pageHead } from '../components/common.js';
import { getDone } from '../flow/progress.js';

// Job-title roadmaps; everything else is a skill, tool or language path.
const ROLE = new Set(['frontend', 'backend', 'ai-engineer', 'cyber-security', 'full-stack', 'devops', 'data-analyst', 'ai-data-scientist', 'machine-learning', 'data-engineer', 'network-engineer', 'qa', 'software-architect', 'forward-deployed-engineer', 'game-developer', 'android', 'ux-design', 'product-manager', 'product-design', 'devsecops', 'bi-analyst', 'postgresql-dba', 'mlops', 'seo', 'blockchain', 'ios', 'engineering-manager', 'inference-engineering', 'technical-writer', 'server-side-game-developer', 'devrel']);
const BEGINNER = (s) => s.endsWith('-beginner');

export async function roadmaps(root) {
  const idx = await getIndex();
  const state = { q: '', cat: 'all', sort: 'name' };
  const sorters = {
    name: (a, b) => a.title.localeCompare(b.title),
    topics: (a, b) => b.topics - a.topics,
    resources: (a, b) => b.resources - a.resources,
  };
  const prog = new Map(idx.roadmaps.map((r) => [r.slug, getDone(r.slug).size]));
  const catCount = (id) => idx.roadmaps.filter((r) => r.category === id).length;

  root.innerHTML = `<div class="page">
    ${pageHead({ title: 'Roadmaps', sub: `${idx.roadmaps.length} step-by-step learning paths. Open one to follow its flowchart and track your progress.` })}
    <div class="dir">
      <aside class="dir-side">
        <div class="input-wrap" style="min-width:0;max-width:none">${icon('search')}<input class="input" id="q" placeholder="Search roadmaps" /></div>
        <select class="input" id="sort" style="padding-left:14px"><option value="name">Sort: name</option><option value="topics">Sort: most topics</option><option value="resources">Sort: most resources</option></select>
        <div class="cats" id="cats">
          <button class="on" data-cat="all">All roadmaps<span class="count">${idx.roadmaps.length}</span></button>
          ${idx.categories.map((c) => `<button data-cat="${c.id}"><span class="dot" style="background:${CATEGORY_COLORS[c.id]}"></span>${esc(c.label)}<span class="count">${catCount(c.id)}</span></button>`).join('')}
        </div>
      </aside>
      <div id="out"></div>
    </div>
  </div>`;

  const tile = (r) => {
    const d = prog.get(r.slug) || 0;
    return `<a class="tile" href="#/roadmap/${r.slug}">
      <div class="t-top"><span class="dot" style="background:${CATEGORY_COLORS[r.category]}"></span>${esc(r.title)}</div>
      <div class="t-meta">${num(r.topics)} topics, ${num(r.resources)} resources</div>
      ${d ? `<div class="t-bar"><i style="width:${Math.min(100, (d / r.topics) * 100)}%"></i></div>` : ''}
    </a>`;
  };
  const out = root.querySelector('#out');
  const render = () => {
    const q = state.q.toLowerCase();
    const list = idx.roadmaps.filter((r) => (state.cat === 'all' || r.category === state.cat) && r.title.toLowerCase().includes(q)).sort(sorters[state.sort]);
    const groups = [['Role-based roadmaps', list.filter((r) => ROLE.has(r.slug))], ['Skill-based roadmaps', list.filter((r) => !ROLE.has(r.slug) && !BEGINNER(r.slug))], ['Beginner tracks', list.filter((r) => BEGINNER(r.slug))]].filter(([, l]) => l.length);
    out.innerHTML = groups.map(([t, l]) => `<section class="dir-section"><h2><span>${t}</span><span>${l.length}</span></h2><div class="tiles">${l.map(tile).join('')}</div></section>`).join('') || '<div class="empty">No roadmaps match your search.</div>';
  };
  root.querySelector('#q').oninput = debounce((e) => { state.q = e.target.value; render(); });
  root.querySelector('#sort').onchange = (e) => { state.sort = e.target.value; render(); };
  root.querySelector('#cats').onclick = (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    state.cat = b.dataset.cat;
    root.querySelectorAll('#cats button').forEach((c) => c.classList.toggle('on', c === b));
    render();
  };
  render();
}
