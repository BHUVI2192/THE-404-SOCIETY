
import { NavLink, TeamMember, EventItem, BlogPost, GalleryItem } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Events', path: '/events' },
  { label: 'Community', path: '/community' },
  { label: 'Team', path: '/team' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
];

export const TEAM_MEMBERS: TeamMember[] = [
  // Founders (Core Group)
  { 
    id: '1', 
    name: 'Alex Chen', 
    role: 'Founder & President', 
    group: 'Core', 
    bio: 'Orchestrating the society\'s vision from the kernel level up. Dedicated to building a legacy of open-source innovation and student leadership.', 
    image: 'https://picsum.photos/200' 
  },
  { 
    id: '2', 
    name: 'Sarah Jenkins', 
    role: 'Founder & Vice President', 
    group: 'Core', 
    bio: 'Compiling scattered ideas into executable strategies. She ensures the community\'s runtime is error-free, efficient, and inclusive.', 
    image: 'https://picsum.photos/201' 
  },
  
  // Co-founders & Leads (Other Groups)
  { 
    id: '3', 
    name: 'Sam Rivera', 
    role: 'Co-founder & Tech Lead', 
    group: 'Tech', 
    bio: 'A polyglot developer who speaks everything from Rust to TypeScript. Building the digital infrastructure that powers our entire node.', 
    image: 'https://picsum.photos/202' 
  },
  { 
    id: '4', 
    name: 'Casey Smith', 
    role: 'Co-founder & Design Lead', 
    group: 'Design', 
    bio: 'Designing the interface between human and machine. Believes that good UI is invisible and great UX is inevitable.', 
    image: 'https://picsum.photos/203' 
  },
  { 
    id: '5', 
    name: 'Jordan Lee', 
    role: 'Co-founder & Event Director', 
    group: 'Events', 
    bio: 'Deploying events with zero downtime. From hackathons to workshops, he manages the community\'s social stack with precision.', 
    image: 'https://picsum.photos/204' 
  },
  { 
    id: '6', 
    name: 'Priyansh Gupta', 
    role: 'Co-founder & AI Research', 
    group: 'Tech', 
    bio: 'Decoding the black box of Deep Learning. Exploring the latent space between data science theory and real-world application.', 
    image: 'https://picsum.photos/205' 
  },
  { 
    id: '7', 
    name: 'Ayesha Khan', 
    role: 'Co-founder & Web Dev Lead', 
    group: 'Tech', 
    bio: 'Crafting pixel-perfect web experiences. She optimizes the DOM and ensures our digital footprint is lightweight, accessible, and fast.', 
    image: 'https://picsum.photos/206' 
  },
  { 
    id: '8', 
    name: 'David Kim', 
    role: 'Co-founder & CyberSec Lead', 
    group: 'Tech', 
    bio: 'Our first line of digital defense. Specializes in penetration testing and securing the society\'s encrypted communication channels.', 
    image: 'https://picsum.photos/207' 
  },
  { 
    id: '9', 
    name: 'Elena Rodriguez', 
    role: 'Co-founder & Outreach', 
    group: 'Events', 
    bio: 'Handshaking with industry protocols. She establishes the vital connections that link students directly to the wider tech ecosystem.', 
    image: 'https://picsum.photos/208' 
  },
  { 
    id: '10', 
    name: 'Michael Chang', 
    role: 'Co-founder & Operations', 
    group: 'Events', 
    bio: 'Managing resource allocation and system logistics. He keeps the hardware running, the venue booked, and the caffeine flowing.', 
    image: 'https://picsum.photos/209' 
  },
  { 
    id: '11', 
    name: 'Olivia Wilson', 
    role: 'Co-founder & Content', 
    group: 'Design', 
    bio: 'Documenting the source code of our community. She translates raw technical achievements into human-readable stories for the world.', 
    image: 'https://picsum.photos/210' 
  },
];

export const EVENTS: EventItem[] = [
  { id: '1', title: 'AI & The Future', date: 'Oct 24, 2023', description: 'Exploring LLMs and generative art.', type: 'upcoming', category: 'Workshop', image: 'https://picsum.photos/800/400' },
  { id: '2', title: 'HackTheNight 4.0', date: 'Nov 12, 2023', description: '24-hour coding marathon.', type: 'upcoming', category: 'Hackathon', image: 'https://picsum.photos/800/401' },
  { id: '3', title: 'Intro to React', date: 'Sep 10, 2023', description: 'Building your first component.', type: 'past', category: 'Workshop' },
  { id: '4', title: 'Tech Showcase', date: 'Aug 15, 2023', description: 'Student projects demo day.', type: 'past', category: 'Exhibition' },
];

export const POSTS: BlogPost[] = [
  { id: '1', title: 'Why 404 isn\'t just an error', date: 'Oct 01, 2023', category: 'Culture', excerpt: 'Embracing the unexpected in software development.' },
  { id: '2', title: 'Recap: HackTheNight 3.0', date: 'Sep 15, 2023', category: 'Events', excerpt: 'Winners, losers, and lots of caffeine.' },
  { id: '3', title: 'Getting started with Open Source', date: 'Aug 20, 2023', category: 'Tech', excerpt: 'How to make your first PR without fear.' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', src: 'https://picsum.photos/600/400', caption: 'Hackathon Winners', type: 'image' },
  { id: '2', src: 'https://picsum.photos/600/401', caption: 'Workshop Session', type: 'image' },
  { id: '3', src: 'https://picsum.photos/600/600', caption: 'Team Outing', type: 'image' },
  { id: '4', src: 'https://picsum.photos/600/300', caption: 'Keynote Speaker', type: 'image' },
  { id: '5', src: 'https://picsum.photos/600/500', caption: 'Project Demo', type: 'image' },
  { id: '6', src: 'https://picsum.photos/600/450', caption: 'Late Night Coding', type: 'image' },
];
