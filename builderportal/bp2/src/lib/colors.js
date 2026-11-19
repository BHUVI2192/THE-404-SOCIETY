export const TYPE_META = {
  article: { label: 'Articles', single: 'Article', color: 'var(--t-article)' },
  official: { label: 'Official docs', single: 'Official', color: 'var(--t-official)' },
  video: { label: 'Videos', single: 'Video', color: 'var(--t-video)' },
  opensource: { label: 'Open source', single: 'Open source', color: 'var(--t-opensource)' },
  roadmap: { label: 'Roadmap links', single: 'Roadmap', color: 'var(--t-roadmap)' },
  course: { label: 'Courses', single: 'Course', color: 'var(--t-course)' },
  book: { label: 'Books', single: 'Book', color: 'var(--t-book)' },
  podcast: { label: 'Podcasts', single: 'Podcast', color: 'var(--t-podcast)' },
};

export const CATEGORY_COLORS = {
  'ai-ml': '#8b5cf6',
  web: '#3b82f6',
  languages: '#f59e0b',
  'cloud-devops': '#06b6d4',
  data: '#10b981',
  mobile: '#ec4899',
  security: '#ef4444',
  'cs-career': '#64748b',
};

/** Resolve a CSS variable (e.g. "var(--t-video)") to a concrete color for canvas use. */
export function resolve(color) {
  const m = /^var\((--[\w-]+)\)$/.exec(color);
  if (!m) return color;
  return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim();
}

export const themeColors = () => {
  const s = getComputedStyle(document.documentElement);
  const g = (n) => s.getPropertyValue(n).trim();
  return { bg: g('--surface'), ink: g('--ink'), muted: g('--muted'), faint: g('--faint'), border: g('--border'), accent: g('--accent') };
};
