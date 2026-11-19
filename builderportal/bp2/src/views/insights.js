import { getIndex } from '../store.js';
import { TYPE_META, CATEGORY_COLORS, resolve } from '../lib/colors.js';
import { num } from '../lib/format.js';
import { heatmap } from '../charts/heatmap.js';
import { scatter } from '../charts/scatter.js';
import { barList, pageHead } from '../components/common.js';

export async function insights(root) {
  const idx = await getIndex();
  const { roadmaps, types } = idx;
  const top = [...roadmaps].sort((a, b) => b.resources - a.resources).slice(0, 24);
  const dense = roadmaps.filter((r) => r.topics >= 15).map((r) => ({ r, v: r.resources / r.topics })).sort((a, b) => b.v - a.v);
  const videoTop = [...roadmaps].sort((a, b) => b.counts.video - a.counts.video).slice(0, 8);

  root.innerHTML = `<div class="page">
    ${pageHead({ title: 'Insights', sub: 'Where the learning material lives: resource density by roadmap, size versus depth, and the richest topics per resource.' })}
    <div class="stack">
      <div class="card">
        <div class="card-head"><div class="card-title">Resource heatmap</div><div class="card-sub">Top 24 roadmaps · colour intensity is log-scaled</div></div>
        <canvas class="chart-canvas" id="heat"></canvas>
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">Size vs. depth</div><div class="card-sub">Each bubble is a roadmap, coloured by category</div></div>
        <canvas class="chart-canvas" id="scatter"></canvas>
        <div class="chips" style="margin-top:12px;gap:18px">${idx.categories.map((c) => `<span class="card-sub"><span class="dot" style="background:${CATEGORY_COLORS[c.id]};margin-right:6px"></span>${c.label}</span>`).join('')}</div>
      </div>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-head"><div class="card-title">Richest resource density</div><div class="card-sub">Resources per topic · ≥15 topics</div></div>
          ${barList(dense.slice(0, 8).map(({ r, v }) => ({ label: r.title, value: +v.toFixed(2), color: CATEGORY_COLORS[r.category], slug: r.slug })), { href: (i) => `#/roadmap/${i.slug}` })}
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">Most video-rich roadmaps</div><div class="card-sub">Video links</div></div>
          ${barList(videoTop.map((r) => ({ label: r.title, value: r.counts.video, color: resolve(TYPE_META.video.color), slug: r.slug })), { href: (i) => `#/roadmap/${i.slug}` })}
        </div>
      </div>
    </div>
  </div>`;

  const cols = types.map((t) => ({ key: t, label: TYPE_META[t].single, color: TYPE_META[t].color }));
  const rows = top.map((r) => ({ key: r.slug, label: r.title, values: types.map((t) => r.counts[t]) }));
  const h = heatmap(root.querySelector('#heat'), rows, cols, { onRowClick: (r) => (location.hash = `#/roadmap/${r.key}`) });
  const s = scatter(root.querySelector('#scatter'), roadmaps.map((r) => ({
    id: r.slug, label: r.title, x: r.topics, y: r.resources, color: CATEGORY_COLORS[r.category], size: 5 + Math.sqrt(r.counts.video) * 0.7,
  })), { xLabel: 'Topics', yLabel: 'Resources', onClick: (p) => (location.hash = `#/roadmap/${p.id}`) });
  return () => { h.destroy(); s.destroy(); };
}
