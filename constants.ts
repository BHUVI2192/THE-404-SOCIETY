
import { NavLink, BlogPost } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Events', path: '/events' },


  { label: 'Blog', path: '/blog' },
];




export const POSTS: BlogPost[] = [
  {
    id: '1',
    colSpan: 2, // HERO ARTICLE (Wide)
    rowSpan: 2,
    date: "OCT 01, 2026",
    category: "CULTURE",
    title: "Why 404 isn't just an error: Embracing the Glitch.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    content: `
      In the world of the web, 404 is synonymous with failure. It means the server couldn't find what you were looking for. But at The 404 Society, we view it differently.
      
      The "Not Found" status represents the vast unknown of technology. It's the space where innovation happens—where the path isn't mapped out, and the documentation hasn't been written yet.
      
      We embrace the glitch. We celebrate the bug. Because every time you encounter a 404, you're at the edge of the known system. Our goal is to inhabit that edge, to build in the gaps, and to turn "Not Found" into "Just Created."
    `,
    excerpt: "Why 404 isn't just an error: Embracing the Glitch and the unknown."
  },
  {
    id: '2',
    colSpan: 1, // Standard Vertical
    rowSpan: 2,
    date: "SEP 15, 2026",
    category: "EVENTS",
    title: "Recap: HackTheNight 3.0 Winners.",
    excerpt: "Celebrating the innovators who coded through the night.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    content: `More info...`
  },
  {
    id: '3',
    colSpan: 1, // Small Square
    rowSpan: 1,
    date: "AUG 28, 2026",
    category: "TECH",
    title: "Open Source 101.",
    excerpt: "Your beginner-friendly guide to making your first open-source pull request.",
    image: "https://images.unsplash.com/photo-1607799275518-d58665d099db?q=80&w=600&auto=format&fit=crop",
    content: `More info...`
  },
  {
    id: '4',
    colSpan: 1, // Small Square
    rowSpan: 1,
    date: "JUL 10, 2026",
    category: "DESIGN",
    title: "The Art of the CLI.",
    excerpt: "Why the terminal is every developer's most powerful productivity tool.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    content: `More info...`
  },
  {
    id: '5',
    colSpan: 1, // Small Square
    rowSpan: 1,
    date: "JUN 05, 2026",
    category: "COMMUNITY",
    title: "Building Squads.",
    excerpt: "How small developer squads drive big impact through collaborative coding.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    content: `More info...`
  },
  {
    id: '6',
    colSpan: 2, // Wide Feature
    rowSpan: 1,
    date: "MAY 22, 2026",
    category: "SPOTLIGHT",
    title: "Interview: The Future of AI Agents with 404 Labs.",
    excerpt: "Exploring autonomous AI agents and how they'll reshape software development.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
    content: `More info...`
  }
];
