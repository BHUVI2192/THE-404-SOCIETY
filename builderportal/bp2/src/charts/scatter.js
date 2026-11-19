import { fitCanvas, observe, tooltip } from '../lib/canvas.js';
import { themeColors } from '../lib/colors.js';
import { num } from '../lib/format.js';

/** points: [{ id, label, x, y, color, size }] */
export function scatter(canvas, points, { xLabel, yLabel, height = 420, onClick } = {}) {
  const m = { l: 62, r: 24, t: 20, b: 52 };
  let hover = null, pos = [];

  const nice = (v) => { const p = 10 ** Math.floor(Math.log10(v)); const f = v / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; };

  const draw = () => {
    const { ctx, w, h } = fitCanvas(canvas, height);
    const th = themeColors();
    ctx.clearRect(0, 0, w, h);
    const xm = nice(Math.max(...points.map((p) => p.x)) * 1.05), ym = nice(Math.max(...points.map((p) => p.y)) * 1.05);
    const X = (v) => m.l + (v / xm) * (w - m.l - m.r), Y = (v) => h - m.b - (v / ym) * (h - m.t - m.b);
    ctx.font = '500 11px Montserrat, sans-serif';
    ctx.textBaseline = 'middle'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const v = (ym / 4) * i, y = Y(v);
      ctx.strokeStyle = th.border; ctx.beginPath(); ctx.moveTo(m.l, y); ctx.lineTo(w - m.r, y); ctx.stroke();
      ctx.fillStyle = th.faint; ctx.textAlign = 'right'; ctx.fillText(num(Math.round(v)), m.l - 12, y);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let i = 0; i <= 4; i++) { const v = (xm / 4) * i; ctx.fillStyle = th.faint; ctx.fillText(num(Math.round(v)), X(v), h - m.b + 12); }
    ctx.fillStyle = th.muted; ctx.font = '600 11px Montserrat, sans-serif';
    ctx.fillText(xLabel, (m.l + w - m.r) / 2, h - 18);
    ctx.save(); ctx.translate(16, (m.t + h - m.b) / 2); ctx.rotate(-Math.PI / 2); ctx.textBaseline = 'middle'; ctx.fillText(yLabel, 0, 0); ctx.restore();

    pos = points.map((p) => ({ p, x: X(p.x), y: Y(p.y), r: p.size }));
    pos.forEach(({ p, x, y, r }) => {
      ctx.globalAlpha = hover && hover.p !== p ? 0.35 : 0.82;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1; ctx.lineWidth = 1.5; ctx.strokeStyle = th.bg; ctx.stroke();
    });
    const top = [...pos].sort((a, b) => b.p.y - a.p.y).slice(0, 7);
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '600 11px Montserrat, sans-serif';
    top.forEach(({ p, x, y, r }) => {
      ctx.lineWidth = 4; ctx.strokeStyle = th.bg; ctx.strokeText(p.label, x + r + 6, y);
      ctx.fillStyle = th.ink; ctx.fillText(p.label, x + r + 6, y);
    });
  };

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const hit = [...pos].reverse().find((q) => (q.x - x) ** 2 + (q.y - y) ** 2 <= (q.r + 3) ** 2) || null;
    if ((hit?.p ?? null) !== (hover?.p ?? null)) { hover = hit; draw(); }
    canvas.style.cursor = hit ? 'pointer' : 'default';
    if (hit) tooltip.show(`<b>${hit.p.label}</b>${num(hit.p.x)} topics · ${num(hit.p.y)} resources`, e.clientX, e.clientY);
    else tooltip.hide();
  };
  canvas.onmouseleave = () => { hover = null; draw(); tooltip.hide(); };
  canvas.onclick = () => hover && onClick?.(hover.p);
  draw();
  const off = observe(canvas, draw);
  window.addEventListener('themechange', draw);
  return { destroy() { off(); window.removeEventListener('themechange', draw); } };
}
