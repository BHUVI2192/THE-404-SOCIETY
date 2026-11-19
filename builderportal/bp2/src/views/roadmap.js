import { getIndex, getRoadmap, getResources } from '../store.js';
import { icon } from '../lib/icons.js';
import { TYPE_META, CATEGORY_COLORS, resolve } from '../lib/colors.js';
import { num, esc, debounce } from '../lib/format.js';
import { ForceGraph } from '../graph/forceGraph.js';
import { tooltip } from '../lib/canvas.js';
import { openTopic, closeDrawer, resourceRow } from '../components/drawer.js';
import { pageHead, stackBar, categoryLabel } from '../components/common.js';
import { buildStages } from '../flow/stages.js';
import { renderFlow, } from '../flow/render.js';
import { G } from '../flow/layout.js';
import { getDone, toggleDone, resetDone } from '../flow/progress.js';

const NONE = { label: 'No resources', color: '#a1a1aa' };
const RING = 2 * Math.PI * 38;

export async function roadmap(root, { slug }) {
  const idx = await getIndex();
  const rm = idx.roadmaps.find((r) => r.slug === slug);
  if (!rm) { root.innerHTML = '<div class="page"><div class="empty">Roadmap not found.</div></div>'; return; }
  const { topics, layout } = await getRoadmap(slug);
  const types = idx.types;
  const stages = buildStages(topics, layout);
  const catColor = CATEGORY_COLORS[rm.category];
  const total = topics.length;
  let done = getDone(slug);

  const dominant = (t) => {
    if (!t.resources.length) return 'none';
    const c = {};
    t.resources.forEach((r) => (c[r[0]] = (c[r[0]] || 0) + 1));
    return types[+Object.entries(c).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0]];
  };
  const colorOf = (k) => (k === 'none' ? NONE.color : resolve(TYPE_META[k].color));
  const labelOf = (k) => (k === 'none' ? NONE.label : TYPE_META[k].label);
  const enriched = topics.map((t) => ({ ...t, kind: dominant(t) }));
  const kinds = [...new Set(enriched.map((t) => t.kind))].sort((a, b) => enriched.filter((t) => t.kind === b).length - enriched.filter((t) => t.kind === a).length);
  const related = [...new Set(topics.flatMap((t) => t.resources.filter((r) => String(r[2]).startsWith('#/roadmap/')).map((r) => r[2].slice(10))))]
    .map((s) => idx.roadmaps.find((r) => r.slug === s)).filter((r) => r && r.slug !== slug);
  const topTypes = types.filter((t) => rm.counts[t]).sort((a, b) => rm.counts[b] - rm.counts[a]);

  root.innerHTML = `<div class="page">
    <div class="page-head">
      <div>
        <a class="crumb" href="#/roadmaps">${icon('back')}All roadmaps</a>
        <h1>${esc(rm.title)}</h1>
        <p>${esc(categoryLabel(idx, rm.category))} learning path with ${num(rm.topics)} topics in ${stages.length} stages</p>
      </div>
      <div class="prog" id="prog"></div>
    </div>
    <details class="card about">
      <summary>What is ${esc(rm.title)}?</summary>
      <div class="about-body">This path has <b>${num(rm.topics)} topics</b> and <b>${num(rm.resources)} resources</b>: ${topTypes.slice(0, 4).map((t) => `${num(rm.counts[t])} ${TYPE_META[t].label.toLowerCase()}`).join(', ')}. Topics are grouped into <b>${stages.length} stages</b>, read from the top of the flowchart to the bottom. Select a topic to see its description and links, and tick the circle to track what you have finished.${rm.withoutResources ? ` ${num(rm.withoutResources)} topics do not have linked resources yet.` : ''}</div>
    </details>
    <div class="card" style="margin-bottom:20px;padding:16px 22px">${stackBar(rm.counts, types)}
      <div class="chips" style="margin-top:14px;gap:18px">${topTypes.map((t) => `<span class="card-sub"><span class="dot" style="background:${TYPE_META[t].color};margin-right:6px"></span>${TYPE_META[t].label} <b style="color:var(--ink)">${num(rm.counts[t])}</b></span>`).join('')}</div>
    </div>
    <div class="tabs" id="mode">
      <button class="on" data-m="flow">${icon('roadmaps')}Flowchart</button>
      <button data-m="graph">${icon('graph')}Graph</button>
      <button data-m="list">${icon('list')}List</button>
      <button data-m="res">${icon('resources')}Resources</button>
    </div>
    <div id="view"></div>
    ${related.length ? `<div class="related"><h3>Related roadmaps</h3><div class="chips">${related.map((r) => `<a class="chip" href="#/roadmap/${r.slug}"><span class="dot" style="background:${CATEGORY_COLORS[r.category]}"></span>${esc(r.title)}</a>`).join('')}</div></div>` : ''}
  </div>`;

  const view = root.querySelector('#view');
  let graph = null, query = '', zoom = 1, flowEl = null;

  const drawProg = () => {
    const n = done.size, p = total ? n / total : 0;
    root.querySelector('#prog').innerHTML = `<div class="ring"><svg viewBox="0 0 84 84"><circle class="track" cx="42" cy="42" r="38" fill="none" stroke-width="7"/><circle class="val" cx="42" cy="42" r="38" fill="none" stroke-width="7" stroke-linecap="round" stroke-dasharray="${RING}" stroke-dashoffset="${RING * (1 - p)}"/></svg><b>${Math.round(p * 100)}%</b></div>
      <div class="meta"><b>${n} of ${num(total)}</b><span class="card-sub">topics completed</span><div style="margin-top:8px"><button class="btn" id="reset">Reset progress</button></div></div>`;
    root.querySelector('#reset').onclick = () => { if (!done.size || confirm('Clear your progress on this roadmap?')) { resetDone(slug); done = getDone(slug); drawProg(); if (flowEl) mountFlow(); } };
  };
  const byId = new Map(topics.map((t) => [t.id, t]));
  const toggle = (t) => { const now = toggleDone(slug, t.id); done = getDone(slug); drawProg(); return now; };
  const select = (t) => t && openTopic(t, rm, types, { done: done.has(t.id), onToggle: (tt) => { const r = toggle(tt); if (flowEl) refreshFlow(); return r; } });

  // ---- flowchart
  const refreshFlow = () => { const sc = view.querySelector('.flow-scroll'); const x = sc?.scrollLeft, y = sc?.scrollTop; drawFlow(); if (sc) { const n = view.querySelector('.flow-scroll'); n.scrollLeft = x; n.scrollTop = y; } };
  const drawFlow = () => {
    const f = renderFlow(stages, { done, query, title: rm.title, sub: `${num(total)} topics in ${stages.length} stages` });
    const box = view.querySelector('.flow-scroll');
    box.innerHTML = f.svg;
    const svg = box.querySelector('svg');
    if (zoom === 1) { svg.style.width = '100%'; svg.style.height = 'auto'; } else { svg.style.width = `${f.width * zoom}px`; svg.style.height = `${f.height * zoom}px`; }
    view.querySelector('#zv').textContent = `${Math.round(zoom * 100)}%`;
    view.querySelectorAll('[data-stage]').forEach((b) => { const s = f.layout.stages[+b.dataset.stage]; const d = s.chips.filter((c) => done.has(c.topic.id)).length; b.querySelector('i').textContent = `${d}/${s.count}`; });
  };
  const mountFlow = () => {
    graph?.destroy(); graph = null; tooltip.hide();
    flowEl = true;
    view.innerHTML = `
      <div class="flow-bar">
        <div class="input-wrap">${icon('search')}<input class="input" id="fq" placeholder="Find a topic…" value="${esc(query)}" /></div>
        <span class="grow"></span>
        <div class="zoom"><button class="btn-icon" data-z="-0.1" aria-label="Zoom out">${icon('minus')}</button><span id="zv">100%</span><button class="btn-icon" data-z="0.1" aria-label="Zoom in">${icon('plus')}</button><button class="btn-icon" data-z="0" aria-label="Reset zoom">${icon('fit')}</button></div>
      </div>
      <div class="stage-nav">${stages.map((s, i) => `<button class="chip" data-stage="${i}"><span class="dot" style="background:${G.PALETTE[i % G.PALETTE.length]}"></span>${esc(s.title)} <span class="count"><i style="font-style:normal"></i></span></button>`).join('')}</div>
      <div class="flow-scroll"></div>`;
    drawFlow();
    const sc = view.querySelector('.flow-scroll');
    view.querySelector('#fq').oninput = debounce((e) => { query = e.target.value.trim(); drawFlow(); });
    view.querySelectorAll('[data-z]').forEach((b) => (b.onclick = () => { const d = +b.dataset.z; zoom = d === 0 ? 1 : Math.min(1.6, Math.max(0.5, +(zoom + d).toFixed(2))); drawFlow(); }));
    view.querySelector('.stage-nav').onclick = (e) => { const b = e.target.closest('[data-stage]'); if (b) view.querySelector(`#stage-${b.dataset.stage}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    sc.onclick = (e) => {
      const chip = e.target.closest('.tchip'); if (!chip) return;
      const t = byId.get(chip.dataset.id);
      if (e.target.closest('[data-act="toggle"]')) { toggle(t); refreshFlow(); }
      else select(t);
    };
    sc.onkeydown = (e) => { const chip = e.target.closest?.('.tchip'); if (chip && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(byId.get(chip.dataset.id)); } };
  };

  // ---- graph
  const mountGraph = async () => {
    flowEl = null;
    view.innerHTML = `
      <div class="card graph-card">
        <canvas id="g"></canvas>
        <div class="input-wrap" style="position:absolute;top:16px;left:16px;min-width:260px">${icon('search')}<input class="input" id="tq" placeholder="Highlight topics…" value="${esc(query)}" /></div>
        <div class="graph-tools">
          <button class="btn-icon" data-z="1.25" aria-label="Zoom in">${icon('plus')}</button>
          <button class="btn-icon" data-z="0.8" aria-label="Zoom out">${icon('minus')}</button>
          <button class="btn-icon" data-fit aria-label="Fit to view">${icon('fit')}</button>
        </div>
        <div class="graph-legend">
          <div class="row"><span class="dot" style="background:${catColor};width:13px;height:13px"></span>${esc(rm.title)}</div>
          ${kinds.map((k) => `<div class="row"><span class="dot" style="background:${colorOf(k)}"></span>${labelOf(k)} <span class="card-sub">${enriched.filter((t) => t.kind === k).length}</span></div>`).join('')}
          <div class="card-sub" style="margin-top:4px">Topic colour = dominant resource type</div>
        </div>
      </div>`;
    const canvas = view.querySelector('#g');
    await document.fonts.ready;
    const nodes = [{ id: 'root', r: 26, color: catColor, label: rm.title, always: true, fixed: true, x: 0, y: 0, weight: 700, labelSize: 13, ring: true, root: true }];
    const links = [];
    kinds.forEach((k, i) => {
      const a = (i / kinds.length) * Math.PI * 2;
      nodes.push({ id: `hub:${k}`, r: 13, color: colorOf(k), label: labelOf(k), always: true, weight: 700, labelSize: 11.5, ring: true, hub: true, x: Math.cos(a) * 230, y: Math.sin(a) * 230, kind: k });
      links.push({ source: 'root', target: `hub:${k}`, dist: 230, strength: 0.6, width: 1.6, alpha: 0.5 });
    });
    enriched.forEach((t, i) => {
      nodes.push({ id: `t:${i}`, r: 3.2 + Math.min(t.resources.length, 8) * 0.55, color: colorOf(t.kind), label: t.title, topic: t, kind: t.kind, weight: 500, labelSize: 10.5, zoomAt: 1.9 });
      links.push({ source: `hub:${t.kind}`, target: `t:${i}`, dist: 38 + Math.sqrt(enriched.length) * 2.2, strength: 0.35, alpha: 0.3, width: 0.7 });
    });
    graph = new ForceGraph(canvas, {
      repulse: 900 + Math.sqrt(enriched.length) * 40, gravity: 0.006, labelZoom: 1,
      onHover: (n, e) => { if (n?.topic) tooltip.show(`<b>${esc(n.topic.title)}</b>${n.topic.resources.length} resources, ${labelOf(n.kind)}`, e.clientX, e.clientY); else tooltip.hide(); },
      onSelect: (n) => { n?.topic ? select(n.topic) : closeDrawer(); },
    });
    graph.setData(nodes, links, 300);
    const applyFilter = () => graph.setFilter(query ? (n) => n.root || n.hub || n.topic?.title.toLowerCase().includes(query.toLowerCase()) : null);
    applyFilter();
    view.querySelector('#tq').oninput = debounce((e) => { query = e.target.value.trim(); applyFilter(); });
    view.querySelectorAll('[data-z]').forEach((b) => (b.onclick = () => graph.zoomBy(+b.dataset.z)));
    view.querySelector('[data-fit]').onclick = () => graph.fit();
  };

  // ---- list
  const mountList = () => {
    graph?.destroy(); graph = null; flowEl = null; tooltip.hide();
    view.innerHTML = `
      <div class="toolbar"><div class="input-wrap">${icon('search')}<input class="input" id="lq" placeholder="Search topics…" value="${esc(query)}" /></div></div>
      <div class="card"><div class="res-list" id="topics"></div><div class="more" id="more"></div></div>`;
    let shown = 40;
    const draw = () => {
      const q = query.toLowerCase();
      const list = enriched.filter((t) => t.title.toLowerCase().includes(q));
      view.querySelector('#topics').innerHTML = list.slice(0, shown).map((t) => {
        const i = enriched.indexOf(t);
        return `<a class="res" href="javascript:void(0)" data-i="${i}">
          <span class="dot" style="background:${done.has(t.id) ? '#10b981' : colorOf(t.kind)};width:11px;height:11px"></span>
          <span><div class="res-title">${esc(t.title)}</div><div class="res-meta">${t.resources.length} resource${t.resources.length === 1 ? '' : 's'}${done.has(t.id) ? ', completed' : ''}</div></span>
          <span class="card-sub">${labelOf(t.kind)}</span></a>`;
      }).join('') || '<div class="empty">No topics match.</div>';
      view.querySelector('#more').innerHTML = list.length > shown ? `<button class="btn" id="more-btn">Show more (${list.length - shown})</button>` : '';
      const mb = view.querySelector('#more-btn'); if (mb) mb.onclick = () => { shown += 60; draw(); };
    };
    view.querySelector('#lq').oninput = debounce((e) => { query = e.target.value.trim(); shown = 40; draw(); });
    view.querySelector('#topics').onclick = (e) => { const a = e.target.closest('[data-i]'); if (a) select(enriched[+a.dataset.i]); };
    draw();
  };

  // ---- resources of this roadmap
  const mountRes = () => {
    graph?.destroy(); graph = null; flowEl = null; tooltip.hide();
    const all = [];
    topics.forEach((t) => t.resources.forEach((r) => all.push({ r, topic: t.title })));
    let ty = 'all', shown = 50;
    view.innerHTML = `<div class="chips" id="rchips" style="margin-bottom:16px"><button class="chip on" data-t="all">All <span class="count">${all.length}</span></button>${topTypes.map((t) => `<button class="chip" data-t="${t}"><span class="dot" style="background:${TYPE_META[t].color}"></span>${TYPE_META[t].label} <span class="count">${rm.counts[t]}</span></button>`).join('')}</div>
      <div class="card"><div class="res-list" id="rl"></div><div class="more" id="rm"></div></div>`;
    const draw = () => {
      const list = all.filter((x) => ty === 'all' || types[x.r[0]] === ty);
      view.querySelector('#rl').innerHTML = list.slice(0, shown).map((x) => resourceRow(x.r, types)).join('') || '<div class="empty">Nothing here.</div>';
      view.querySelector('#rm').innerHTML = list.length > shown ? `<button class="btn" id="rmb">Show more (${list.length - shown})</button>` : '';
      const b = view.querySelector('#rmb'); if (b) b.onclick = () => { shown += 80; draw(); };
    };
    view.querySelector('#rchips').onclick = (e) => { const b = e.target.closest('[data-t]'); if (!b) return; ty = b.dataset.t; shown = 50; view.querySelectorAll('#rchips .chip').forEach((c) => c.classList.toggle('on', c === b)); draw(); };
    draw();
  };

  root.querySelector('#mode').onclick = (e) => {
    const b = e.target.closest('[data-m]'); if (!b) return;
    root.querySelectorAll('#mode button').forEach((x) => x.classList.toggle('on', x === b));
    closeDrawer();
    ({ flow: mountFlow, graph: mountGraph, list: mountList, res: mountRes })[b.dataset.m]();
  };
  drawProg();
  mountFlow();
  return () => { graph?.destroy(); tooltip.hide(); closeDrawer(); };
}
