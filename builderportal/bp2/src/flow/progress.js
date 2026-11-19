import { getSession } from '../auth.js';

/** Per-roadmap completion state, persisted per-member in localStorage. */
const key = (slug) => {
  const memberId = getSession()?.id || 'guest';
  return `builderportal:${memberId}:done:${slug}`;
};

export function getDone(slug) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key(slug)) || '[]'));
  } catch {
    return new Set();
  }
}

function save(slug, set) {
  try {
    localStorage.setItem(key(slug), JSON.stringify([...set]));
  } catch {
    /* storage unavailable */
  }
}

export function toggleDone(slug, id) {
  const set = getDone(slug);
  set.has(id) ? set.delete(id) : set.add(id);
  save(slug, set);
  return set.has(id);
}

export const resetDone = (slug) => save(slug, new Set());
