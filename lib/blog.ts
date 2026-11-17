/**
 * lib/blog.ts — Blog data layer (Supabase only)
 */
import { supabase } from './supabase';

export interface BlogPostData {
  author?: any;
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image?: string;
  date: string;
  colSpan?: number;
  rowSpan?: number;
  createdAt?: number;
  authorName?: string;
  readTime?: string;
}

const fromRow = (row: any): BlogPostData => ({
  id: row.id,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  category: row.category,
  image: row.image,
  date: row.date,
  colSpan: row.col_span,
  rowSpan: row.row_span,
  authorName: row.author_name ?? undefined,
  readTime: row.read_time ?? undefined,
  createdAt: row.created_at,
});

const toRow = (p: Partial<BlogPostData>) => {
  const row: any = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.excerpt !== undefined) row.excerpt = p.excerpt;
  if (p.content !== undefined) row.content = p.content;
  if (p.category !== undefined) row.category = p.category;
  if (p.image !== undefined) row.image = p.image;
  if (p.date !== undefined) row.date = p.date;
  if (p.colSpan !== undefined) row.col_span = p.colSpan;
  if (p.rowSpan !== undefined) row.row_span = p.rowSpan;
  if (p.authorName !== undefined) row.author_name = p.authorName;
  if (p.readTime !== undefined) row.read_time = p.readTime;
  return row;
};

// ── Hardcoded built-in posts (not stored in DB) ──────────────
export const HARDCODED_POSTS: BlogPostData[] = [
  {
    id: 'hc-ai-trends-2026',
    title: '7 AI Trends in 2026 Every Tech Student Should Know',
    excerpt: 'Major 2026 AI shifts every student should track to build better projects, tools, and careers.',
    content: `Why AI Trends Matter for You\n\n2026 is not just another AI year. Major shifts are happening in how AI is built, deployed, and used in real products. If you are in a community like The 404 Society, understanding these trends helps you pick better project ideas, tools, and career paths.\n\nFrom Single Chatbots to AI Agent Teams\n\nThe biggest shift: AI is moving from single assistants to teams of AI agents that can plan, coordinate, and act.\n\n- Call tools, APIs, and services, not just chat\n- Orchestrate workflows: research → summarize → draft → send\n- Be assembled by everyday users with minimal code\n\nAgentic AI in Production, Not Just Demos\n\nEnterprises are now deploying AI agents in production.\n\n- Agents handle cloud optimization, security response, finance monitoring\n\nSmaller, Smarter, Domain-Specific Models\n\n- Smaller, domain-specific models are tuned for particular industries\n- Open-source models power many customized solutions\n- Teams focus on efficient reasoning instead of just raw size\n\nAI as a Core Part of Products\n\nCompanies are building AI into the core of their platforms.\n\n- Agentic capabilities are becoming default in many SaaS tools\n\nWhat This Means for You\n\nPick agent-centric projects. Build with open models. Ship production-ready AI, not just demos.`,
    category: 'AI',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1932&auto=format&fit=crop',
    date: 'JAN 15, 2026',
    colSpan: 2,
    rowSpan: 1,
    authorName: 'The 404 Society',
    createdAt: 1736899200000,
  },
  {
    id: 'hc-community-resilience',
    title: 'Building Resilient Tech Communities in Tier-2 Cities',
    excerpt: 'How grassroots tech communities in smaller cities are quietly becoming the backbone of India\'s next wave of innovation.',
    content: `The Quiet Revolution\n\nWhile the startup spotlight has long been fixed on Bangalore, Mumbai, and Delhi, something remarkable is happening in India's tier-2 cities. Communities like The 404 Society are proving that geography is no longer a barrier to building world-class technical talent.\n\nWhat Makes a Community Resilient\n\nResilient communities share three traits:\n\n1. Peer learning over passive consumption\n2. Shipping real projects, not just attending talks\n3. Radical inclusivity — anyone can contribute\n\nThe 404 Model\n\nWe started with 12 members in a college lab. Today we run cross-college projects, host workshops, and have members working at top companies. The secret: we build in public, fail in public, and grow together.\n\nThe Road Ahead\n\nTier-2 tech communities are not just producing talent — they're creating a new model for how technical education can work outside traditional institutions.`,
    category: 'COMMUNITY',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1770&auto=format&fit=crop',
    date: 'FEB 3, 2026',
    colSpan: 1,
    rowSpan: 2,
    authorName: 'The 404 Society',
    createdAt: 1738540800000,
  },
  {
    id: 'hc-404-ai-action-plan',
    title: 'The 404 AI Action Plan: How We\'re Integrating AI Into Every Project',
    excerpt: 'Our community-wide initiative to make AI a first-class citizen in every project, workshop, and event we run.',
    content: `The Decision\n\nIn early 2026, The 404 Society made a bold call: every project we build will have an AI component. Not as a gimmick — as a core capability.\n\nWhat This Looks Like in Practice\n\n- Every hackathon team must define how AI serves the user\n- Workshops now include hands-on AI tool integration sessions\n- Project mentors review AI architecture before launch\n\nThe Tools We Use\n\n- Gemini API for text, code, and multimodal tasks\n- Hugging Face models for specialized NLP tasks\n- Vercel AI SDK for seamless frontend integration\n- Supabase + pgvector for semantic search\n\nEarly Results\n\nIn our first AI-first cohort, 8 out of 10 projects shipped production AI features. Three of those projects are now being developed into full products.\n\nJoin Us\n\nThe 404 Society is open to builders who want to ship real AI projects, not just learn about AI.`,
    category: 'STRATEGY',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1830&auto=format&fit=crop',
    date: 'MAR 10, 2026',
    colSpan: 1,
    rowSpan: 1,
    authorName: 'The 404 Society',
    createdAt: 1741564800000,
  },
];

export const getBlogPosts = async (): Promise<BlogPostData[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getBlogPosts error:', error); return HARDCODED_POSTS; }
  const dbPosts = (data || []).map(fromRow);
  // Hardcoded posts first, then dynamic DB posts
  return [...HARDCODED_POSTS, ...dbPosts];
};

export const subscribeToBlogPosts = (callback: (posts: BlogPostData[]) => void): (() => void) => {
  getBlogPosts().then(callback);
  const channel = supabase
    .channel('blog_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => {
      getBlogPosts().then(callback);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const addBlogPost = async (post: Omit<BlogPostData, 'id'>): Promise<string | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ ...toRow(post), created_at: Date.now() }])
    .select('id')
    .single();
  if (error) { console.error('addBlogPost error:', error); return null; }
  return data?.id ?? null;
};

export const updateBlogPost = async (id: string, data: Partial<BlogPostData>): Promise<void> => {
  const { error } = await supabase.from('blog_posts').update(toRow(data)).eq('id', id);
  if (error) console.error('updateBlogPost error:', error);
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  if (id.startsWith('hc-')) {
    throw new Error('Cannot delete built-in blog posts');
  }
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) console.error('deleteBlogPost error:', error);
};
