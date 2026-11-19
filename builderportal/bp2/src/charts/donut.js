import { fitCanvas, observe, tooltip } from '../lib/canvas.js';
import { resolve, themeColors } from '../lib/colors.js';
import { num, pct } from '../lib/format.js';

/** Interactive donut. segments: [{ key, label, value, color }] */
export function donut(canvas, segments, { centerLabel = 'Total', onHover } = {}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  let active = -1;
  let geo = null;

  const draw = () => {
    const { ctx, w, h } = fitCanvas(canvas, canvas.clientWidth);
    const th = themeColors();
    const cx = w / 2, cy = h / 2, R = Math.max(0, Math.min(w, h) / 2 - 6), r = Math.max(0, R * 0.68);
    geo = { cx, cy, R, r, arcs: [] };
    if (R <= 0 || r <= 0) return;
    ctx.clearRect(0, 0, w, h);
    let a0 = -Math.PI / 2;
    const gap = 0.025;
    segments.forEach((s, i) => {
      const sweep = (s.value / total) * Math.PI * 2;
      const a1 = a0 + sweep;
      geo.arcs.push([a0, a1]);
      const grow = i === active ? 5 : 0;
      ctx.beginPath();
      ctx.arc(cx, cy, R + grow, a0 + gap, Math.max(a0 + gap, a1 - gap));
      ctx.arc(cx, cy, r, Math.max(a0 + gap, a1 - gap), a0 + gap, true);
      ctx.closePath();
      ctx.fillStyle = resolve(s.color);
      ctx.globalAlpha = active === -1 || active === i ? 1 : 0.28;
      ctx.fill();
      a0 = a1;
    });
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const seg = segments[active];
    ctx.fillStyle = th.ink;
    ctx.font = '700 28px Montserrat, sans-serif';
    ctx.fillText(num(seg ? seg.value : total), cx, cy - 8);
    ctx.fillStyle = th.muted;
    ctx.font = '500 12px Montserrat, sans-serif';
    ctx.fillText(seg ? `${seg.label} · ${pct(seg.value, total)}` : centerLabel, cx, cy + 16);
  };

  const hit = (e) => {
    const rect = canvas.getBoundingClientRect();
    const dx = e.clientX - rect.left - geo.cx, dy = e.clientY - rect.top - geo.cy;
    const d = Math.hypot(dx, dy);
    if (d < geo.r - 4 || d > geo.R + 8) return -1;
    let a = Math.atan2(dy, dx); if (a < -Math.PI / 2) a += Math.PI * 2;
    return geo.arcs.findIndex(([s, t]) => a >= s && a < t);
  };
  const move = (e) => {
    const i = hit(e);
    if (i !== active) { active = i; draw(); onHover?.(i); }
    canvas.style.cursor = i >= 0 ? 'pointer' : 'default';
  };
  const leave = () => { if (active !== -1) { active = -1; draw(); onHover?.(-1); } tooltip.hide(); };
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseleave', leave);
  draw();
  const off = observe(canvas, draw);
  window.addEventListener('themechange', draw);
  return {
    highlight(i) { active = i; draw(); },
    destroy() { off(); window.removeEventListener('themechange', draw); },
  };
}
