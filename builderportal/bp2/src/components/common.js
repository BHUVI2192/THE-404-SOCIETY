import { TYPE_META, CATEGORY_COLORS } from '../lib/colors.js';
import { num, esc } from '../lib/format.js';

export const stackBar = (counts, types) => {
  const total = types.reduce((a, t) => a + counts[t], 0) || 1;
  return `<div class="stackbar">${types.filter((t) => counts[t]).map((t) => `<i style="width:${(counts[t] / total) * 100}%;background:${TYPE_META[t].color}" title="${TYPE_META[t].label}: ${num(counts[t])}"></i>`).join('')}</div>`;
};

export const categoryLabel = (idx, id) => idx.categories.find((c) => c.id === id)?.label ?? id;

export const roadmapCard = (r, idx) => `
  <a class="card rm-card" href="#/roadmap/${r.slug}">
    <div class="rm-top">
      <span class="dot" style="background:${CATEGORY_COLORS[r.category]}"></span>
      <div><div class="rm-title">${esc(r.title)}</div><div class="rm-cat">${esc(categoryLabel(idx, r.category))}</div></div>
    </div>
    <div class="rm-nums">
      <div class="rm-num"><b>${num(r.topics)}</b><span>Topics</span></div>
      <div class="rm-num"><b>${num(r.resources)}</b><span>Resources</span></div>
      <div class="rm-num"><b>${num(r.counts.video)}</b><span>Videos</span></div>
    </div>
    ${stackBar(r.counts, idx.types)}
  </a>`;

export const barList = (items, { href } = {}) => {
  const max = Math.max(...items.map((i) => i.value), 1);
  return `<div class="bars">${items.map((i) => {
    const tag = href ? 'a' : 'div';
    return `<${tag} class="bar-row" ${href ? `href="${href(i)}"` : ''}>
      <span class="name">${esc(i.label)}</span>
      <span class="bar-track"><span class="bar-fill" style="display:block;width:${(i.value / max) * 100}%;background:${i.color}"></span></span>
      <span class="val">${num(i.value)}</span>
    </${tag}>`;
  }).join('')}</div>`;
};

export const pageHead = ({ title, sub, crumb, actions = '' }) => `
  <div class="page-head">
    <div>${crumb ? `<a class="crumb" href="${crumb.href}">${crumb.icon}${esc(crumb.label)}</a>` : ''}
      <h1>${esc(title)}</h1>${sub ? `<p>${sub}</p>` : ''}</div>
    ${actions}
  </div>`;
