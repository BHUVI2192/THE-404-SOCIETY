/**
 * Groups a roadmap's topics into named stages with TF-IDF + spherical k-means.
 * The content repository stores no topic hierarchy, so this derives one from the text itself
 * (titles, descriptions, resource titles). Deterministic: seeded by the roadmap slug.
 */
const STOP = new Set(`a about as vs be me my so up we above after again all also an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its just like make makes many may more most much must my no nor not now of off on once only or other our out over own same she should so some such than that the their theirs them then there these they this those through to too under until up us very was we were what when where which while who whom why will with would you your
visit following resources resource learn learning more used use uses using help helps allows allow provides provide process different various based way ways between often within across will enable enables include includes involves involving key important common type types tool tools framework frameworks application applications development developer developers software programming language languages code coding guide tutorial official docs documentation article video videos course best practice practices basics basic introduction intro overview concept concepts one two three new need needs get gets set sets create creating built build building work works working well see understand understanding ensure ensures support supports e.g i.e etc`.split(/\s+/));

const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

const stem = (w) => /[.+#]/.test(w) ? w : (w.length > 4 && w.endsWith('ies') ? `${w.slice(0, -3)}y` : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);
const tokens = (text) => (text.toLowerCase().match(/[a-z][a-z0-9+#.]{1,}/g) || []).map((t) => t.replace(/\.+$/, '')).filter((t) => t.length > 1 && !STOP.has(t)).map(stem);

const EARLY = /\b(intro|introduction|basics?|fundamentals?|getting started|overview|concepts?|what is|beginners?|setup|installation|history|terminology)\b/i;
const LATE = /\b(advanced|performance|security|testing|tests?|deploy\w*|production|optimi[sz]\w*|best practices|monitoring|scal\w*|ci\/cd|observability|debugging|migrations?)\b/i;
const rank = (title) => (EARLY.test(title) ? -1 : LATE.test(title) ? 1 : 0);

function vectorise(topics) {
  const docs = topics.map((t) => {
    const tf = new Map();
    const add = (list, w) => list.forEach((k) => tf.set(k, (tf.get(k) || 0) + w));
    add(tokens(t.title), 3);
    add(tokens(t.description || ''), 1);
    add(tokens(t.resources.map((r) => r[1]).join(' ')), 0.6);
    return tf;
  });
  const df = new Map();
  docs.forEach((d) => d.forEach((_, k) => df.set(k, (df.get(k) || 0) + 1)));
  const N = docs.length;
  const vocab = new Map();
  for (const [k, c] of df) if (c >= 2 && c <= N * 0.5) vocab.set(k, vocab.size);
  const idf = (k) => Math.log((N + 1) / (df.get(k) + 1)) + 1;
  const vecs = docs.map((d) => {
    const entries = [];
    let norm = 0;
    for (const [k, c] of d) {
      if (!vocab.has(k)) continue;
      const w = (1 + Math.log(c)) * idf(k);
      entries.push([vocab.get(k), w, k]);
      norm += w * w;
    }
    norm = Math.sqrt(norm) || 1;
    return entries.map(([i, w, k]) => [i, w / norm, k]);
  });
  return { vecs, V: vocab.size };
}

const dot = (vec, cen) => vec.reduce((a, [i, w]) => a + w * cen[i], 0);

function kmeans(vecs, V, k, rand) {
  const n = vecs.length;
  const dense = (v) => { const c = new Float32Array(V); v.forEach(([i, w]) => (c[i] = w)); return c; };
  // k-means++ init
  let centroids = [dense(vecs[Math.floor(rand() * n)])];
  while (centroids.length < k) {
    const d = vecs.map((v) => Math.max(1e-6, 1 - Math.max(...centroids.map((c) => dot(v, c)))) ** 2);
    const total = d.reduce((a, b) => a + b, 0);
    let r = rand() * total, pick = 0;
    for (let i = 0; i < n; i++) { r -= d[i]; if (r <= 0) { pick = i; break; } }
    centroids.push(dense(vecs[pick]));
  }
  let assign = new Array(n).fill(0);
  for (let it = 0; it < 25; it++) {
    let changed = false;
    vecs.forEach((v, i) => {
      let best = 0, bs = -1;
      centroids.forEach((c, j) => { const s = dot(v, c); if (s > bs) { bs = s; best = j; } });
      if (assign[i] !== best) { assign[i] = best; changed = true; }
    });
    centroids = centroids.map(() => new Float32Array(V));
    vecs.forEach((v, i) => v.forEach(([x, w]) => (centroids[assign[i]][x] += w)));
    centroids.forEach((c) => { const m = Math.sqrt(c.reduce((a, b) => a + b * b, 0)) || 1; for (let i = 0; i < V; i++) c[i] /= m; });
    if (!changed) break;
  }
  const score = vecs.reduce((a, v, i) => a + dot(v, centroids[assign[i]]), 0);
  return { assign, centroids, score };
}

function cluster(vecs, V, k, rand) {
  let best = null;
  for (let r = 0; r < 4; r++) { const res = kmeans(vecs, V, k, rand); if (!best || res.score > best.score) best = res; }
  return best;
}

export function clusterTopics(topics, slug) {
  const n = topics.length;
  if (n === 0) return [];
  const rand = mulberry(hash(slug));
  const { vecs, V } = vectorise(topics);
  // surface forms: stem -> most common spelling (titles win, keeping acronyms such as DNS / CSS)
  const surface = new Map();
  const seeSurface = (text, weight) => (text.match(/[A-Za-z][A-Za-z0-9+#]+/g) || []).forEach((w) => {
    const k = stem(w.toLowerCase());
    const m = surface.get(k) || surface.set(k, new Map()).get(k);
    m.set(w, (m.get(w) || 0) + weight);
  });
  topics.forEach((t) => { seeSurface(t.title, 5); seeSurface(t.description || '', 1); });
  const spell = (k) => {
    const m = surface.get(k); if (!m) return k;
    const w = [...m].sort((a, b) => b[1] - a[1])[0][0];
    return w === w.toLowerCase() ? w[0].toUpperCase() + w.slice(1) : w;
  };
  const ownName = new Set(tokens(slug.replace(/-/g, ' ')));
  const titleSets = topics.map((t) => new Set(tokens(t.title)));
  const gdf = new Map();
  titleSets.forEach((st) => st.forEach((k) => gdf.set(k, (gdf.get(k) || 0) + 1)));

  let groups = [];
  if (n < 8 || V === 0) groups = [topics.map((_, i) => i)];
  else {
    const k = Math.max(2, Math.min(14, Math.round(Math.sqrt(n / 2))));
    const { assign } = cluster(vecs, V, k, rand);
    const buckets = new Map();
    assign.forEach((c, i) => (buckets.get(c) || buckets.set(c, []).get(c)).push(i));
    groups = [...buckets.values()];
    // split oversized groups once
    groups = groups.flatMap((g) => {
      if (g.length <= 36) return [g];
      const sub = g.map((i) => vecs[i]);
      const kk = Math.ceil(g.length / 18);
      const { assign: a2 } = cluster(sub, V, kk, rand);
      const b = new Map();
      a2.forEach((c, j) => (b.get(c) || b.set(c, []).get(c)).push(g[j]));
      return [...b.values()];
    });
    // fold tiny groups into the closest larger one
    const big = groups.filter((g) => g.length >= 3);
    const small = groups.filter((g) => g.length < 3).flat();
    if (big.length && small.length) {
      const cents = big.map((g) => { const c = new Float32Array(V); g.forEach((i) => vecs[i].forEach(([x, w]) => (c[x] += w))); return c; });
      small.forEach((i) => { let b = 0, bs = -1; cents.forEach((c, j) => { const s = dot(vecs[i], c) / Math.sqrt(big[j].length); if (s > bs) { bs = s; b = j; } }); big[b].push(i); });
      groups = big;
    }
  }

  const used = new Set();
  const stages = groups.map((g) => {
    // name = the title words that best characterise this group (frequent inside it, rare elsewhere)
    const inGroup = new Map();
    g.forEach((i) => titleSets[i].forEach((k) => inGroup.set(k, (inGroup.get(k) || 0) + 1)));
    const cand = [...inGroup]
      .filter(([k, c]) => c >= Math.min(2, g.length) && !used.has(k) && !ownName.has(k))
      .map(([k, c]) => [k, c * Math.log(1 + topics.length / gdf.get(k)) * (c / gdf.get(k))])
      .sort((a, b) => b[1] - a[1]);
    const names = [];
    if (cand.length) {
      names.push(cand[0][0]);
      if (cand[1] && cand[1][1] >= cand[0][1] * 0.85 && g.length >= 8) names.push(cand[1][0]);
    } else {
      const fallback = [...inGroup].sort((a, b) => b[1] - a[1])[0];
      names.push(fallback ? fallback[0] : 'topics');
    }
    names.forEach((k) => used.add(k));
    const pretty = spell;
    const list = g.map((i) => topics[i]).sort((a, b) => rank(a.title) - rank(b.title) || b.resources.length - a.resources.length || a.title.localeCompare(b.title));
    const mean = list.reduce((a, t) => a + rank(t.title), 0) / list.length;
    return { title: names.map(pretty).join(' & '), topics: list, mean };
  }).sort((a, b) => a.mean - b.mean || b.topics.length - a.topics.length);

  const seen = new Map();
  return stages.map((s) => {
    const n = (seen.get(s.title) || 0) + 1;
    seen.set(s.title, n);
    return { title: n > 1 ? `${s.title} ${n}` : s.title, topics: s.topics.map((t) => t.id) };
  });
}
