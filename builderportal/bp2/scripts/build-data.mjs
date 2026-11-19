/**
 * Parses <CONTENT_REPO>/roadmaps/<slug>/content/*.md into compact JSON files for builderportal.
 *   public/data/index.json            overview, stats, categories, cross-links
 *   public/data/roadmaps/<slug>.json  { topics, layout } — stages are auto-clustered, or taken from /layouts/<slug>.json
 *   public/data/resources.json        flat list of every resource (lazy-loaded)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { clusterTopics } from './cluster.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const REPO = process.env.CONTENT_REPO || join(here, '..', '..', 'developer-roadmap');
const LAYOUTS = join(here, '..', 'layouts');
const ROADMAPS = join(REPO, 'roadmaps');
const OUT = join(here, '..', 'public', 'data');

const TYPES = ['article', 'official', 'video', 'opensource', 'roadmap', 'course', 'book', 'podcast'];

const CATEGORIES = {
  'ai-ml': ['ai-agents', 'ai-data-scientist', 'ai-engineer', 'ai-product-builder', 'ai-red-teaming', 'inference-engineering', 'machine-learning', 'mlops', 'prompt-engineering', 'claude-code', 'codex', 'cursor', 'openclaw', 'vibe-coding'],
  web: ['frontend', 'frontend-beginner', 'backend', 'backend-beginner', 'full-stack', 'html', 'css', 'react', 'vue', 'angular', 'nextjs', 'nodejs', 'wordpress', 'graphql', 'api-design', 'design-system', 'aspnet-core', 'django', 'laravel', 'ruby-on-rails', 'spring-boot'],
  languages: ['c', 'cpp', 'java', 'javascript', 'typescript', 'python', 'golang', 'rust', 'kotlin', 'php', 'ruby', 'scala', 'r', 'r-programming', 'shell-bash', 'sql'],
  'cloud-devops': ['aws', 'cloudflare', 'cloud-computing', 'devops', 'devops-beginner', 'devsecops', 'docker', 'kubernetes', 'terraform', 'linux', 'git-github', 'git-github-beginner', 'network-engineer'],
  data: ['bi-analyst', 'data-analyst', 'data-engineer', 'python-data-analysis', 'power-bi', 'postgresql-dba', 'mongodb', 'redis', 'elasticsearch'],
  mobile: ['android', 'ios', 'flutter', 'react-native', 'swift-ui', 'game-developer', 'server-side-game-developer'],
  security: ['cyber-security', 'blockchain', 'qa', 'code-review'],
  'cs-career': ['computer-science', 'datastructures-and-algorithms', 'leetcode', 'system-design', 'software-architect', 'software-design-architecture', 'engineering-manager', 'product-manager', 'product-design', 'ux-design', 'technical-writer', 'devrel', 'forward-deployed-engineer', 'seo'],
};
const CATEGORY_LABELS = {
  'ai-ml': 'AI & ML', web: 'Web', languages: 'Languages', 'cloud-devops': 'Cloud & DevOps',
  data: 'Data', mobile: 'Mobile & Games', security: 'Security & Quality', 'cs-career': 'CS & Career',
};
const slugToCategory = {};
for (const [cat, slugs] of Object.entries(CATEGORIES)) for (const s of slugs) slugToCategory[s] = cat;

const ACRONYMS = new Set(['ai', 'aws', 'api', 'bi', 'css', 'html', 'ios', 'qa', 'seo', 'sql', 'ux', 'dba', 'dsa', 'ui', 'c', 'r', 'mlops', 'devops', 'devsecops', 'devrel', 'graphql', 'php']);
const SPECIAL = {
  ios: 'iOS',
  cpp: 'C++', golang: 'Go', nodejs: 'Node.js', nextjs: 'Next.js', javascript: 'JavaScript', typescript: 'TypeScript',
  'git-github': 'Git & GitHub', 'git-github-beginner': 'Git & GitHub (Beginner)', 'swift-ui': 'SwiftUI', 'ruby-on-rails': 'Ruby on Rails',
  'aspnet-core': 'ASP.NET Core', 'postgresql-dba': 'PostgreSQL DBA', 'datastructures-and-algorithms': 'Data Structures & Algorithms',
  'power-bi': 'Power BI', 'mongodb': 'MongoDB', 'wordpress': 'WordPress', 'openclaw': 'OpenClaw', 'leetcode': 'LeetCode',
  'shell-bash': 'Shell / Bash', 'react-native': 'React Native', 'cyber-security': 'Cyber Security', 'devops': 'DevOps',
  'devsecops': 'DevSecOps', 'graphql': 'GraphQL', 'mlops': 'MLOps', 'python-data-analysis': 'Python Data Analysis',
  'r-programming': 'R Programming', 'claude-code': 'Claude Code', 'forward-deployed-engineer': 'Forward Deployed Engineer',
};
const titleCase = (slug) =>
  SPECIAL[slug] ||
  slug.split('-').map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))).join(' ');

const SITE = /roadmap\.sh/i;
const cleanText = (t) =>
  t
    .replace(/[^.!?\n]*discord server[^.!?\n]*[.!?]?/gi, '')
    .replace(/\[([^\]]+)\]\(https?:\/\/(?:www\.)?roadmap\.sh[^)]*\)/gi, '$1')
    .replace(/https?:\/\/(?:www\.)?roadmap\.sh\S*/gi, '')
    .replace(/roadmap\.sh/gi, 'builderportal')
    .replace(/\n{2,}/g, '\n')
    .trim();

const LINK_RE = /\[@(\w+)@([^\]]*)\]\(([^)\s]+)\)/g;

function parseTopic(file, raw) {
  const [slugPart, idPart] = file.replace(/\.md$/, '').split('@');
  const lines = raw.split(/\r?\n/);
  const heading = lines.findIndex((l) => /^#\s+/.test(l));
  const title = heading >= 0 ? lines[heading].replace(/^#\s+/, '').trim() : slugPart;
  const body = lines.slice(heading + 1).filter((l) => !/^\s*-\s*\[@\w+@/.test(l));
  const description = body
    .filter((l) => !/^Visit the following resources/i.test(l.trim()))
    .join('\n');
  const resources = [];
  for (const m of raw.matchAll(LINK_RE)) {
    const type = TYPES.includes(m[1]) ? m[1] : 'article';
    resources.push([TYPES.indexOf(type), m[2].trim(), m[3]]);
  }
  return { id: idPart || slugPart, title: cleanText(title), description: cleanText(description).slice(0, 1200), resources };
}

if (!existsSync(ROADMAPS)) {
  console.error(`roadmaps directory not found at ${ROADMAPS} (set ROADMAP_REPO)`);
  process.exit(1);
}
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'roadmaps'), { recursive: true });

const slugs = readdirSync(ROADMAPS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const roadmaps = [];
const flat = [];
const totals = Object.fromEntries(TYPES.map((t) => [t, 0]));

slugs.forEach((slug, rIdx) => {
  const dir = join(ROADMAPS, slug, 'content');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : [];
  const topics = files.map((f) => parseTopic(f, readFileSync(join(dir, f), 'utf8')));
  // links to the hosting site become in-app roadmap links (or are dropped)
  const known = new Set(slugs);
  for (const t of topics) {
    t.resources = t.resources.flatMap(([ti, title, url]) => {
      if (!SITE.test(url)) return [[ti, title, url]];
      const target = url.replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop();
      const direct = /^https?:\/\/(?:www\.)?roadmap\.sh\/[^/]+\/?$/i.test(url.replace(/[?#].*$/, ''));
      if (!direct || !known.has(target) || target === slug) return [];
      return [[TYPES.indexOf('roadmap'), `Open the ${titleCase(target)} roadmap`, `#/roadmap/${target}`]];
    });
  }
  const counts = Object.fromEntries(TYPES.map((t) => [t, 0]));
  for (const t of topics) {
    for (const [ti, title, url] of t.resources) {
      counts[TYPES[ti]]++;
      totals[TYPES[ti]]++;
      flat.push([ti, title, url, rIdx, t.title]);
    }
  }
  const layoutFile = join(LAYOUTS, `${slug}.json`);
  const layout = existsSync(layoutFile) ? JSON.parse(readFileSync(layoutFile, 'utf8')) : null;
  writeFileSync(join(OUT, 'roadmaps', `${slug}.json`), JSON.stringify({ topics, layout: layout || { auto: true, stages: clusterTopics(topics, slug) } }));
  roadmaps.push({
    slug, title: titleCase(slug), category: slugToCategory[slug] || 'cs-career',
    topics: topics.length, resources: Object.values(counts).reduce((a, b) => a + b, 0), counts,
    withoutResources: topics.filter((t) => t.resources.length === 0).length,
  });
});

// cross-links between roadmaps via @roadmap@ resources
const slugSet = new Set(slugs);
const edgeMap = new Map();
flat.forEach(([ti, , url, rIdx]) => {
  if (TYPES[ti] !== 'roadmap') return;
  const target = url.replace(/\/+$/, '').split('/').pop();
  if (!slugSet.has(target) || target === slugs[rIdx]) return;
  const key = `${slugs[rIdx]}>${target}`;
  edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
});
const links = [...edgeMap].map(([k, w]) => { const [s, t] = k.split('>'); return { source: s, target: t, weight: w }; });

const index = {
  generatedAt: new Date().toISOString(),
  types: TYPES,
  categories: Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
  totals: {
    roadmaps: roadmaps.length,
    emptyRoadmaps: roadmaps.filter((r) => r.topics === 0).length,
    topics: roadmaps.reduce((a, r) => a + r.topics, 0),
    resources: flat.length,
    byType: totals,
  },
  roadmaps,
  links,
};
writeFileSync(join(OUT, 'index.json'), JSON.stringify(index));
writeFileSync(join(OUT, 'resources.json'), JSON.stringify(flat));
console.log(`✔ ${roadmaps.length} roadmaps · ${index.totals.topics} topics · ${flat.length} resources · ${links.length} cross-links`);
