/**
 * Resolves the stage layout shipped with each roadmap (see scripts/cluster.mjs and /layouts)
 * into stages that reference real topic objects.
 * Spec: { stages: [{ title, topics: [topicId | topicTitle, ...] }] }
 * Topics not mentioned in the spec are collected in a trailing "More topics" stage.
 */
export function buildStages(topics, layout) {
  const byId = new Map(topics.map((t) => [t.id, t]));
  const byTitle = new Map(topics.map((t) => [t.title.toLowerCase(), t]));
  const seen = new Set();
  const stages = (layout?.stages || []).map((s, i) => ({
    id: `s${i}`,
    title: s.title,
    topics: (s.topics || []).map((k) => byId.get(k) || byTitle.get(String(k).toLowerCase())).filter((t) => t && !seen.has(t.id) && seen.add(t.id)),
  })).filter((s) => s.topics.length);

  const rest = topics.filter((t) => !seen.has(t.id));
  if (rest.length) stages.push({ id: `s${stages.length}`, title: 'More topics', topics: rest });
  return stages;
}
