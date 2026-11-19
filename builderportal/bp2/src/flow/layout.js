/** Spine layout: stage nodes run down the centre; topics fan out to the left and right with dotted links. */
export const G = {
  W: 1200, CW: 200, CH: 40, CGAP: 8, COLGAP: 10, SW: 230, SH: 46, ROOT_W: 300, ROOT_H: 56, STAGE_GAP: 56, TRUNK: 132,
  PALETTE: ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#64748b', '#84cc16'],
};

export function wrap(text, maxW, measure) {
  const lines = [''];
  for (const w of text.split(/\s+/)) {
    const cur = lines[lines.length - 1];
    const next = cur ? `${cur} ${w}` : w;
    if (measure(next) <= maxW) lines[lines.length - 1] = next;
    else if (lines.length < 2) lines.push(w);
    else lines[1] = `${lines[1]} ${w}`;
  }
  const fit = (s) => { if (measure(s) <= maxW) return s; let t = s; while (t.length > 1 && measure(`${t}…`) > maxW) t = t.slice(0, -1); return `${t.trimEnd()}…`; };
  return lines.map(fit);
}

export function layoutFlow(stages, measure) {
  const { W, CW, CH, CGAP, COLGAP, SW, SH, ROOT_W, ROOT_H, STAGE_GAP, TRUNK, PALETTE } = G;
  const cx = W / 2, textW = CW - 44;
  const out = { width: W, root: { x: cx - ROOT_W / 2, y: 20, w: ROOT_W, h: ROOT_H }, stages: [], spine: [] };
  let y = out.root.y + ROOT_H + STAGE_GAP;
  let prev = { x: cx, y: out.root.y + ROOT_H };

  stages.forEach((s, i) => {
    const color = PALETTE[i % PALETTE.length];
    const n = s.topics.length, leftN = Math.ceil(n / 2), rightN = n - leftN;
    const colsOf = (k) => (k > 12 ? 2 : 1);
    const lc = colsOf(leftN), rc = colsOf(rightN);
    const rowsOf = (k, c) => Math.ceil(k / c);
    const rows = Math.max(rowsOf(leftN, lc), rowsOf(rightN, rc), 1);
    const blockH = rows * CH + (rows - 1) * CGAP;
    const node = { x: cx - SW / 2, y: y + blockH / 2 - SH / 2, w: SW, h: SH };
    const chips = [], links = [];
    const place = (list, side, cols) => {
      const rowsHere = Math.ceil(list.length / cols);
      const offY = y + (blockH - (rowsHere * CH + (rowsHere - 1) * CGAP)) / 2;
      list.forEach((t, k) => {
        const col = Math.floor(k / rowsHere), row = k % rowsHere;
        const inner = cx + side * (TRUNK + 8);
        const x = side < 0 ? inner - CW - col * (CW + COLGAP) : inner + col * (CW + COLGAP);
        const cy = offY + row * (CH + CGAP);
        chips.push({ topic: t, x, y: cy, w: CW, h: CH, lines: wrap(t.title, textW, measure) });
        if (col === 0) links.push({ side, y: cy + CH / 2 });
      });
      return rowsHere;
    };
    place(s.topics.slice(0, leftN), -1, lc);
    place(s.topics.slice(leftN), 1, rc);
    // dotted links: trunk per side, plus a horizontal run to each chip row (outer columns share the same run)
    const paths = [];
    for (const side of [-1, 1]) {
      const ys = chips.filter((c) => (side < 0 ? c.x < cx : c.x > cx)).map((c) => c.y + CH / 2);
      if (!ys.length) continue;
      const nodeY = node.y + SH / 2, tx = cx + side * TRUNK;
      const sideEdge = cx + side * (SW / 2);
      paths.push(`M${sideEdge},${nodeY} H${tx}`);
      paths.push(`M${tx},${Math.min(nodeY, ...ys)} V${Math.max(nodeY, ...ys)}`);
      [...new Set(ys)].forEach((yy) => {
        const far = chips.filter((c) => Math.abs(c.y + CH / 2 - yy) < 1 && (side < 0 ? c.x < cx : c.x > cx));
        const edge = side < 0 ? Math.min(...far.map((c) => c.x)) : Math.max(...far.map((c) => c.x + c.w));
        paths.push(`M${tx},${yy} H${edge}`);
      });
    }
    out.stages.push({ index: i, id: s.id, title: s.title, color, node, chips, paths, top: y, bottom: y + blockH, count: n });
    out.spine.push(`M${prev.x},${prev.y} V${node.y}`);
    prev = { x: cx, y: node.y + SH };
    y += blockH + STAGE_GAP;
  });
  const end = { x: cx - 120, y: y - STAGE_GAP + 40, w: 240, h: 44 };
  out.spine.push(`M${prev.x},${prev.y} V${end.y}`);
  out.end = end;
  out.height = end.y + end.h + 24;
  return out;
}
