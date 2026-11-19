import { fitCanvas, observe, tooltip, roundRect } from '../lib/canvas.js';
import { resolve, themeColors } from '../lib/colors.js';
import { num } from '../lib/format.js';

/**
 * rows: [{ key, label, values: number[] }], cols: [{ key, label, color }]
 * Each cell is tinted with its column color; intensity follows a log scale.
 */
export function heatmap(canvas, rows, cols, { onRowClick } = {}) {
  const left = 214, top = 44, cell = 28, gap = 4;
  const max = Math.max(...rows.flatMap((r) => r.values), 1);
  let hover = null;

  const draw = () => {
    const H = top + rows.length * (cell + gap) + 8;
    const { ctx, w } = fitCanvas(canvas, H);
    const th = themeColors();
    ctx.clearRect(0, 0, w, H);
    const cw = Math.max(48, (w - left) / cols.length - gap);
    ctx.textBaseline = 'middle';
    ctx.font = '600 11px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    cols.forEach((c, j) => {
      ctx.fillStyle = th.muted;
      ctx.fillText(c.label, left + j * (cw + gap) + cw / 2, top / 2);
    });
    rows.forEach((r, i) => {
      const y = top + i * (cell + gap);
      ctx.textAlign = 'right';
      ctx.font = `${hover?.i === i ? 700 : 500} 12px Montserrat, sans-serif`;
      ctx.fillStyle = hover?.i === i ? th.ink : th.muted;
      ctx.fillText(r.label, left - 14, y + cell / 2);
      r.values.forEach((v, j) => {
        const x = left + j * (cw + gap);
        roundRect(ctx, x, y, cw, cell, 7);
        ctx.fillStyle = th.border; ctx.globalAlpha = 0.45; ctx.fill();
        if (v > 0) {
          const t = Math.log1p(v) / Math.log1p(max);
          ctx.globalAlpha = 0.14 + t * 0.86;
          ctx.fillStyle = resolve(c(cols, j).color); ctx.fill();
          if (t > 0.45 && cw > 44) {
            ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
            ctx.font = '600 10.5px Montserrat, sans-serif';
            ctx.fillText(num(v), x + cw / 2, y + cell / 2 + 0.5);
          }
        }
        ctx.globalAlpha = 1;
        if (hover && hover.i === i && hover.j === j) {
          roundRect(ctx, x - 1, y - 1, cw + 2, cell + 2, 8);
          ctx.strokeStyle = th.ink; ctx.lineWidth = 2; ctx.stroke();
        }
      });
    });
    canvas._geo = { cw };
  };
  const c = (cols, j) => cols[j];

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cw = canvas._geo.cw;
    const j = Math.floor((x - left) / (cw + gap)), i = Math.floor((y - top) / (cell + gap));
    const inside = i >= 0 && i < rows.length && j >= 0 && j < cols.length && x >= left;
    const next = inside ? { i, j } : (i >= 0 && i < rows.length && x < left ? { i, j: -1 } : null);
    if (JSON.stringify(next) !== JSON.stringify(hover)) { hover = next; draw(); }
    canvas.style.cursor = next ? 'pointer' : 'default';
    if (inside) tooltip.show(`<b>${rows[i].label}</b><span>${cols[j].label}: </span>${num(rows[i].values[j])}`, e.clientX, e.clientY);
    else tooltip.hide();
  };
  canvas.onmouseleave = () => { hover = null; draw(); tooltip.hide(); };
  canvas.onclick = () => { if (hover) onRowClick?.(rows[hover.i]); };
  draw();
  const off = observe(canvas, draw);
  window.addEventListener('themechange', draw);
  return { destroy() { off(); window.removeEventListener('themechange', draw); } };
}
