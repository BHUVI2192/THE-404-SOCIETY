/** Size a canvas to its CSS box at device pixel ratio and return a ready 2D context. */
export function fitCanvas(canvas, height) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = height ?? canvas.clientHeight;
  if (height) canvas.style.height = `${height}px`;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h, dpr };
}

export function observe(el, cb) {
  const ro = new ResizeObserver(() => cb());
  ro.observe(el);
  return () => ro.disconnect();
}

export const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
};

const tip = document.createElement('div');
tip.className = 'tooltip';
document.body.appendChild(tip);

export const tooltip = {
  show(html, x, y) {
    tip.innerHTML = html;
    tip.classList.add('show');
    const r = tip.getBoundingClientRect();
    tip.style.left = `${Math.min(x + 14, window.innerWidth - r.width - 12)}px`;
    tip.style.top = `${Math.min(y + 14, window.innerHeight - r.height - 12)}px`;
  },
  hide() { tip.classList.remove('show'); },
};
