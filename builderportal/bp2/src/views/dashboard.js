import { getIndex } from '../store.js';
import { icon } from '../lib/icons.js';
import { TYPE_META, CATEGORY_COLORS } from '../lib/colors.js';
import { num, pct } from '../lib/format.js';
import { donut } from '../charts/donut.js';
import { barList, pageHead, categoryLabel } from '../components/common.js';
import { getSession } from '../auth.js';

export async function dashboard(root) {
  const session = getSession();
  const idx = await getIndex();
  const { totals, roadmaps, types } = idx;
  const segs = types.map((t) => ({ key: t, label: TYPE_META[t].label, value: totals.byType[t], color: TYPE_META[t].color }));
  const top = [...roadmaps].sort((a, b) => b.topics - a.topics).slice(0, 10);

  const cats = idx.categories.map((c) => {
    const list = roadmaps.filter((r) => r.category === c.id);
    return { ...c, count: list.length, topics: list.reduce((a, r) => a + r.topics, 0) };
  }).sort((a, b) => b.topics - a.topics);

  const unresourced = roadmaps.reduce((a, r) => a + r.withoutResources, 0);
  const thin = [...roadmaps].filter((r) => r.topics >= 20).map((r) => ({ r, ratio: r.resources / r.topics })).sort((a, b) => a.ratio - b.ratio).slice(0, 5);

  const stat = (ic, color, value, label) => `
    <div class="card stat">
      <div class="stat-icon" style="background:color-mix(in srgb, ${color} 14%, transparent);color:${color}">${icon(ic)}</div>
      <div><div class="stat-value">${num(value)}</div><div class="stat-label">${label}</div></div>
    </div>`;

  const memberGreeting = session ? `Welcome back, ${session.name}` : 'Overview';
  const memberSub = session
    ? `Member ID: ${session.id} · ${session.role || 'Builder'} · 404 Society Builder Portal`
    : 'All roadmaps, topics, and learning resources at a glance.';

  root.innerHTML = `<div class="page">
    ${pageHead({
      title: memberGreeting,
      sub: memberSub,
      actions: `<a class="btn primary" href="#/universe">${icon('universe')}Open universe</a>`,
    })}
    <div class="grid grid-4">
      ${stat('roadmaps', 'var(--accent)', totals.roadmaps, 'Roadmaps')}
      ${stat('topics', 'var(--t-official)', totals.topics, 'Topics')}
      ${stat('layers', 'var(--t-article)', totals.resources, 'Curated resources')}
      ${stat('video', 'var(--t-video)', totals.byType.video, 'Video links')}
    </div>
    <div class="grid grid-3-2" style="margin-top:20px">
      <div class="card">
        <div class="card-head"><div class="card-title">Resource mix</div><div class="card-sub">Hover a slice</div></div>
        <div class="donut-layout">
          <canvas class="donut-canvas" id="donut"></canvas>
          <div class="legend" id="legend">
            ${segs.map((s, i) => `<div class="legend-row" data-i="${i}"><span class="dot" style="background:${s.color}"></span><span>${s.label}</span><span class="n">${num(s.value)}</span><span class="p">${pct(s.value, totals.resources)}</span></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">Topics by category</div><div class="card-sub">${cats.length} groups</div></div>
        ${barList(cats.map((c) => ({ label: c.label, value: c.topics, color: CATEGORY_COLORS[c.id] })))}
      </div>
    </div>
    <div class="grid grid-3-2" style="margin-top:20px">
      <div class="card">
        <div class="card-head"><div class="card-title">Largest roadmaps</div><a class="card-sub" href="#/roadmaps">View all →</a></div>
        ${barList(top.map((r) => ({ label: r.title, value: r.topics, color: CATEGORY_COLORS[r.category], slug: r.slug })), { href: (i) => `#/roadmap/${i.slug}` })}
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">Content gaps</div><div class="card-sub">Opportunities</div></div>
        <div class="gap-list">
          <div class="gap-item"><span>Topics with no resources</span><b>${num(unresourced)}</b></div>
          <div class="gap-item"><span>Share of all topics</span><b>${pct(unresourced, totals.topics)}</b></div>
          <div class="gap-item"><span>Roadmaps without content</span><b>${num(totals.emptyRoadmaps)}</b></div>
        </div>
        <div class="section-label" style="margin:22px 0 8px">Thinnest coverage · resources per topic</div>
        <div class="gap-list">
          ${thin.map(({ r, ratio }) => `<a class="gap-item" href="#/roadmap/${r.slug}"><span>${r.title}</span><b>${ratio.toFixed(2)}</b></a>`).join('')}
        </div>
      </div>
    </div>
  </div>`;

  const legend = root.querySelector('#legend');
  const chart = donut(root.querySelector('#donut'), segs, {
    centerLabel: 'Resources',
    onHover: (i) => legend.querySelectorAll('.legend-row').forEach((row) => row.classList.toggle('hl', +row.dataset.i === i)),
  });
  legend.querySelectorAll('.legend-row').forEach((row) => {
    row.onmouseenter = () => chart.highlight(+row.dataset.i);
    row.onmouseleave = () => chart.highlight(-1);
  });
  return () => chart.destroy();
}
