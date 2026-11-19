import { layoutFlow } from './layout.js';
import { esc } from '../lib/format.js';

let ctx;
const measureWith = (font) => {
  ctx ||= document.createElement('canvas').getContext('2d');
  ctx.font = font;
  return (s) => ctx.measureText(s).width;
};

/** Returns { svg, height, width, layout } for a roadmap's stages. */
export function renderFlow(stages, { done, query = '', title, sub }) {
  const L = layoutFlow(stages, measureWith('600 11.5px Montserrat, sans-serif'));
  const q = query.trim().toLowerCase();
  const total = stages.reduce((a, s) => a + s.topics.length, 0);
  const doneN = stages.reduce((a, s) => a + s.topics.filter((t) => done.has(t.id)).length, 0);
  const p = [];
  p.push(`<svg class="flow" viewBox="0 0 ${L.width} ${L.height}" width="${L.width}" height="${L.height}" role="img" aria-label="${esc(title)} flowchart">`);
  L.spine.forEach((d) => p.push(`<path class="spine" d="${d}"/>`));
  const r = L.root;
  p.push(`<g class="root"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="14"/><text x="${r.x + r.w / 2}" y="${r.y + 24}" text-anchor="middle" class="root-t">${esc(title)}</text><text x="${r.x + r.w / 2}" y="${r.y + 43}" text-anchor="middle" class="root-s">${esc(sub)}</text></g>`);
  L.stages.forEach((s) => {
    const d = s.chips.filter((c) => done.has(c.topic.id)).length;
    p.push(`<g id="stage-${s.index}" class="stage" style="--c:${s.color}">`);
    s.paths.forEach((dd) => p.push(`<path class="link" d="${dd}"/>`));
    const n = s.node;
    p.push(`<g class="snode"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="12"/><text x="${n.x + n.w / 2}" y="${n.y + 21}" text-anchor="middle" class="sn-t">${esc(s.title.length > 26 ? s.title.slice(0, 25) + '…' : s.title)}</text><text x="${n.x + n.w / 2}" y="${n.y + 36}" text-anchor="middle" class="sn-s">${d} of ${s.count} done</text></g>`);
    s.chips.forEach((c) => {
      const isDone = done.has(c.topic.id);
      const dim = q && !c.topic.title.toLowerCase().includes(q);
      const ty = c.lines.length === 1 ? c.y + c.h / 2 + 4 : c.y + c.h / 2 - 3;
      p.push(`<g class="tchip${isDone ? ' done' : ''}${dim ? ' dim' : ''}" data-id="${esc(c.topic.id)}" tabindex="0" role="button" aria-label="${esc(c.topic.title)}${isDone ? ', completed' : ''}">
        <rect class="bg" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="9"/>
        <rect class="strip" x="${c.x}" y="${c.y + 8}" width="4" height="${c.h - 16}" rx="2"/>
        <text x="${c.x + 16}" y="${ty}" class="ct">${c.lines.map((l, i) => `<tspan x="${c.x + 16}" dy="${i ? 14 : 0}">${esc(l)}</tspan>`).join('')}</text>
        <g class="chk" data-act="toggle" role="checkbox" aria-checked="${isDone}" aria-label="Mark ${esc(c.topic.title)} as done"><circle class="ring-c" cx="${c.x + c.w - 17}" cy="${c.y + c.h / 2}" r="8.5"/><path class="tick" d="M${c.x + c.w - 21},${c.y + c.h / 2} l3,3 l6,-6"/></g>
      </g>`);
    });
    p.push('</g>');
  });
  const e = L.end;
  p.push(`<g class="end${doneN === total && total ? ' complete' : ''}"><rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="22"/><text x="${e.x + e.w / 2}" y="${e.y + 27}" text-anchor="middle">${doneN === total && total ? 'Roadmap complete' : `${doneN} of ${total} done`}</text></g>`);
  p.push('</svg>');
  return { svg: p.join(''), width: L.width, height: L.height, layout: L };
}
