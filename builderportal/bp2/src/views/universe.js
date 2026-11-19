import { getIndex } from '../store.js';
import { icon } from '../lib/icons.js';
import { CATEGORY_COLORS } from '../lib/colors.js';
import { num } from '../lib/format.js';
import { ForceGraph } from '../graph/forceGraph.js';
import { tooltip } from '../lib/canvas.js';
import { pageHead, categoryLabel } from '../components/common.js';

export async function universe(root) {
  const idx = await getIndex();
  const off = new Set();

  root.innerHTML = `<div class="page">
    ${pageHead({
      title: 'Roadmap universe',
      sub: `${idx.roadmaps.length} roadmaps connected by ${idx.links.length} cross-links. Node size reflects topic count, colour reflects category.`,
    })}
    <div class="card graph-card">
      <canvas id="g"></canvas>
      <div class="graph-hint">Drag to pan · scroll to zoom · click a roadmap to open</div>
      <div class="graph-tools">
        <button class="btn-icon" data-z="1.25" aria-label="Zoom in">${icon('plus')}</button>
        <button class="btn-icon" data-z="0.8" aria-label="Zoom out">${icon('minus')}</button>
        <button class="btn-icon" data-fit aria-label="Fit to view">${icon('fit')}</button>
      </div>
      <div class="graph-legend" id="legend">
        ${idx.categories.map((c) => `<div class="row btn-row" data-cat="${c.id}"><span class="dot" style="background:${CATEGORY_COLORS[c.id]}"></span>${c.label}</div>`).join('')}
      </div>
    </div>
  </div>`;

  const hubs = idx.categories.map((c) => ({ id: `cat:${c.id}`, r: 9, color: CATEGORY_COLORS[c.id], label: c.label, always: true, hub: true, category: c.id, weight: 700, labelSize: 12, ring: true }));
  const nodes = [
    ...hubs,
    ...idx.roadmaps.map((r) => ({ id: r.slug, r: 4 + Math.sqrt(r.topics) * 0.62, color: CATEGORY_COLORS[r.category], label: r.title, category: r.category, data: r, weight: 500, labelSize: 11, zoomAt: r.topics > 150 ? 0.3 : r.topics > 80 ? 1.3 : 2.4 })),
  ];
  const links = [
    ...idx.roadmaps.map((r) => ({ source: `cat:${r.category}`, target: r.slug, dist: 60 + Math.random() * 70, strength: 0.7, alpha: 0.2 })),
    ...idx.links.map((l) => ({ source: l.source, target: l.target, dist: 160, strength: 0.006, width: 0.8 + Math.min(2, l.weight * 0.25), alpha: 0.4 })),
    ...hubs.flatMap((a, i) => hubs.slice(i + 1).map((b) => ({ source: a.id, target: b.id, dist: 330, strength: 0.08, alpha: 0 }))),
  ];

  const canvas = root.querySelector('#g');
  await document.fonts.ready;
  const g = new ForceGraph(canvas, {
    repulse: 5200, gravity: 0.012, labelZoom: 0.9,
    onHover: (n, e) => {
      if (n && !n.hub) tooltip.show(`<b>${n.label}</b>${num(n.data.topics)} topics · ${num(n.data.resources)} resources<br><span>${categoryLabel(idx, n.category)}</span>`, e.clientX, e.clientY);
      else tooltip.hide();
    },
    onSelect: (n) => { if (n && !n.hub) location.hash = `#/roadmap/${n.id}`; },
  });
  g.setData(nodes, links, 320);

  root.querySelectorAll('[data-z]').forEach((b) => (b.onclick = () => g.zoomBy(+b.dataset.z)));
  root.querySelector('[data-fit]').onclick = () => g.fit();
  root.querySelectorAll('[data-cat]').forEach((row) => {
    row.onclick = () => {
      const c = row.dataset.cat;
      off.has(c) ? off.delete(c) : off.add(c);
      row.classList.toggle('off', off.has(c));
      g.setFilter(off.size ? (n) => !off.has(n.category) : null);
    };
  });
  return () => { g.destroy(); tooltip.hide(); };
}
