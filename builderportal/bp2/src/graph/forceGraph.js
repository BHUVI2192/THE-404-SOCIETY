import { themeColors } from '../lib/colors.js';

/**
 * Small dependency-free force-directed graph on <canvas>.
 * Supports pan, wheel-zoom, node dragging, hover/selection highlighting and dimming filters.
 *
 * nodes: { id, x?, y?, fixed?, r, color, label?, always? , ...data }
 * links: { source, target, dist, strength?, width?, alpha? }
 */
export class ForceGraph {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.opts = { repulse: 1400, gravity: 0.015, damping: 0.82, pad: 3, labelZoom: 1.1, ...opts };
    this.view = { x: 0, y: 0, k: 1 };
    this.nodes = [];
    this.links = [];
    this.byId = new Map();
    this.adj = new Map();
    this.alpha = 0;
    this.hover = null;
    this.selected = null;
    this.filter = null; // (node) => boolean ; false => dimmed
    this.theme = themeColors();
    this._bind();
    this.resize();
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(canvas);
    this._onTheme = () => { this.theme = themeColors(); this.draw(); };
    window.addEventListener('themechange', this._onTheme);
  }

  setData(nodes, links, warm = 220) {
    this.nodes = nodes;
    this.byId = new Map(nodes.map((n) => [n.id, n]));
    this.links = links.map((l) => ({ ...l, s: this.byId.get(l.source), t: this.byId.get(l.target) })).filter((l) => l.s && l.t);
    this.adj = new Map(nodes.map((n) => [n.id, new Set()]));
    for (const l of this.links) { this.adj.get(l.s.id).add(l.t.id); this.adj.get(l.t.id).add(l.s.id); }
    nodes.forEach((n, i) => {
      if (n.x == null) {
        const a = i * 2.399963; // golden angle spiral
        const r = 14 * Math.sqrt(i + 1);
        n.x = Math.cos(a) * r; n.y = Math.sin(a) * r;
      }
      n.vx = 0; n.vy = 0;
    });
    nodes.forEach((n) => (n.deg = 0));
    for (const l of this.links) { l.s.deg++; l.t.deg++; }
    this.alpha = 1;
    for (let i = 0; i < warm; i++) this._tick(Math.max(0.05, 1 - i / warm));
    this.alpha = 0.25;
    this.fit(false);
    this._loop();
  }

  _tick(alpha) {
    const { repulse, gravity, damping, pad } = this.opts;
    const ns = this.nodes, n = ns.length;
    for (let i = 0; i < n; i++) {
      const a = ns[i];
      for (let j = i + 1; j < n; j++) {
        const b = ns[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        let d2 = dx * dx + dy * dy;
        if (d2 > 90000) continue;
        if (d2 < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 0.5; }
        const d = Math.sqrt(d2);
        let f = (repulse * alpha) / d2;
        const min = a.r + b.r + pad;
        if (d < min) f += (min - d) * 0.35;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy;
      }
    }
    for (const l of this.links) {
      const dx = l.t.x - l.s.x, dy = l.t.y - l.s.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      // degree-normalised spring (as in d3-force) keeps high-degree hubs stable
      const f = ((d - l.dist) / d) * (l.strength ?? 0.12) * alpha / Math.min(l.s.deg, l.t.deg);
      const b = l.s.deg / (l.s.deg + l.t.deg);
      l.s.vx += dx * f * (1 - b); l.s.vy += dy * f * (1 - b);
      l.t.vx -= dx * f * b; l.t.vy -= dy * f * b;
    }
    for (const a of ns) {
      if (a.fixed) { a.vx = a.vy = 0; continue; }
      a.vx -= a.x * gravity * alpha; a.vy -= a.y * gravity * alpha;
      a.vx *= damping; a.vy *= damping;
      const sp = Math.hypot(a.vx, a.vy);
      if (sp > 30) { a.vx *= 30 / sp; a.vy *= 30 / sp; }
      a.x += a.vx; a.y += a.vy;
    }
  }

  _loop() {
    if (this._raf) return;
    const step = () => {
      this._raf = null;
      if (this.alpha > 0.015 || this.dragging) {
        this._tick(Math.max(this.alpha, 0.05));
        this.alpha *= 0.985;
        this.draw();
        this._raf = requestAnimationFrame(step);
      } else this.draw();
    };
    this._raf = requestAnimationFrame(step);
  }

  reheat(a = 0.3) { this.alpha = Math.max(this.alpha, a); this._loop(); }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.w = w; this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.dpr = dpr;
    this.draw();
  }

  fit(animate = true, pad = 70) {
    if (!this.nodes.length || !this.w) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const n of this.nodes) { x0 = Math.min(x0, n.x - n.r); y0 = Math.min(y0, n.y - n.r); x1 = Math.max(x1, n.x + n.r); y1 = Math.max(y1, n.y + n.r); }
    const k = Math.min((this.w - pad * 2) / (x1 - x0 || 1), (this.h - pad * 2) / (y1 - y0 || 1), 2.2);
    const target = { k, x: this.w / 2 - ((x0 + x1) / 2) * k, y: this.h / 2 - ((y0 + y1) / 2) * k };
    if (!animate) { this.view = target; return; }
    const from = { ...this.view }, t0 = performance.now();
    const anim = (t) => {
      const p = Math.min(1, (t - t0) / 380), e = 1 - Math.pow(1 - p, 3);
      this.view = { k: from.k + (target.k - from.k) * e, x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e };
      this.draw();
      if (p < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }

  zoomBy(f, cx = this.w / 2, cy = this.h / 2) {
    const v = this.view, k = Math.min(6, Math.max(0.15, v.k * f));
    v.x = cx - ((cx - v.x) / v.k) * k; v.y = cy - ((cy - v.y) / v.k) * k; v.k = k;
    this.draw();
  }

  toWorld(px, py) { return { x: (px - this.view.x) / this.view.k, y: (py - this.view.y) / this.view.k }; }

  pick(px, py) {
    const { x, y } = this.toWorld(px, py);
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i], r = n.r + 3 / this.view.k;
      if ((n.x - x) ** 2 + (n.y - y) ** 2 <= r * r) return n;
    }
    return null;
  }

  _bind() {
    const c = this.canvas;
    const pos = (e) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    let down = null;
    c.addEventListener('pointerdown', (e) => {
      const [px, py] = pos(e);
      const node = this.pick(px, py);
      down = { px, py, node, moved: false, vx: this.view.x, vy: this.view.y };
      c.setPointerCapture(e.pointerId);
      if (!node) c.classList.add('grabbing');
    });
    c.addEventListener('pointermove', (e) => {
      const [px, py] = pos(e);
      if (down) {
        const dx = px - down.px, dy = py - down.py;
        if (Math.abs(dx) + Math.abs(dy) > 4) down.moved = true;
        if (down.node && down.moved && !down.node.fixed) {
          this.dragging = true;
          const w = this.toWorld(px, py);
          down.node.x = w.x; down.node.y = w.y; down.node.vx = down.node.vy = 0;
          this.reheat(0.2);
        } else if (!down.node) {
          this.view.x = down.vx + dx; this.view.y = down.vy + dy;
          this.draw();
        }
        return;
      }
      const n = this.pick(px, py);
      if (n !== this.hover) {
        this.hover = n;
        c.classList.toggle('pointer', !!n);
        this.draw();
      }
      this.opts.onHover?.(n, e);
    });
    const end = (e) => {
      if (!down) return;
      const d = down; down = null; this.dragging = false;
      c.classList.remove('grabbing');
      if (!d.moved) {
        const [px, py] = pos(e);
        const n = this.pick(px, py);
        this.selected = n;
        this.draw();
        this.opts.onSelect?.(n);
      }
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('pointerleave', () => { if (!down && this.hover) { this.hover = null; this.opts.onHover?.(null); this.draw(); } });
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const [px, py] = pos(e);
      this.zoomBy(Math.exp(-e.deltaY * 0.0015), px, py);
    }, { passive: false });
  }

  select(node) { this.selected = node; this.draw(); }
  setFilter(fn) { this.filter = fn; this.draw(); }

  draw() {
    const { ctx, view: v, dpr } = this;
    if (!this.w) return;
    const th = this.theme, o = this.opts;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.save();
    ctx.translate(v.x, v.y);
    ctx.scale(v.k, v.k);

    const focus = this.hover || this.selected;
    const near = focus ? this.adj.get(focus.id) : null;
    const visible = (n) => !this.filter || this.filter(n);
    const lit = (n) => (!focus || n === focus || near.has(n.id)) && visible(n);

    for (const l of this.links) {
      const on = focus ? l.s === focus || l.t === focus : visible(l.s) && visible(l.t);
      ctx.globalAlpha = on ? (l.alpha ?? 0.5) : 0.05;
      ctx.strokeStyle = on && focus ? (l.s.color) : th.faint;
      ctx.lineWidth = (l.width ?? 1) / Math.sqrt(v.k) * (on && focus ? 1.6 : 1);
      ctx.beginPath(); ctx.moveTo(l.s.x, l.s.y); ctx.lineTo(l.t.x, l.t.y); ctx.stroke();
    }

    for (const n of this.nodes) {
      const on = lit(n);
      ctx.globalAlpha = on ? 1 : 0.13;
      ctx.fillStyle = n.color;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      if (n === this.selected || n === this.hover) {
        ctx.lineWidth = 2.5 / v.k; ctx.strokeStyle = th.ink;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 3 / v.k, 0, 6.2832); ctx.stroke();
      } else if (n.ring) {
        ctx.lineWidth = 1.6 / v.k; ctx.strokeStyle = th.bg;
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const n of this.nodes) {
      const emphasised = n === this.hover || n === this.selected || (near && near.has(n.id) && n.always !== false && v.k > 0.9 && n.r > 8);
      const show = emphasised || (n.always && lit(n)) || (n.label && v.k >= o.labelZoom * (n.zoomAt ?? 1) && lit(n) && n.r * v.k > 6);
      if (!show || !n.label) continue;
      const fs = Math.max(9.5, Math.min(n.labelSize ?? 12, 13)) / (n.stickyLabel ? 1 : 1);
      ctx.font = `${n.weight ?? 600} ${fs / v.k}px Montserrat, sans-serif`;
      const below = n.r + (6 + fs * 0.5) / v.k;
      ctx.globalAlpha = lit(n) ? 1 : 0.2;
      ctx.lineWidth = 4 / v.k; ctx.strokeStyle = th.bg; ctx.lineJoin = 'round';
      ctx.strokeText(n.label, n.x, n.y + below);
      ctx.fillStyle = th.ink;
      ctx.fillText(n.label, n.x, n.y + below);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    this._ro.disconnect();
    window.removeEventListener('themechange', this._onTheme);
  }
}
