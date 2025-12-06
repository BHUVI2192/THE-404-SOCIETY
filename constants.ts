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
  { id: '1', name: 'Alex Chen', role: 'President', group: 'Core', bio: 'Full-stack visionary.', image: 'https://picsum.photos/200' },
  { id: '2', name: 'Sam Rivera', role: 'Tech Lead', group: 'Tech', bio: 'Lives in the terminal.', image: 'https://picsum.photos/201' },
  { id: '3', name: 'Jordan Lee', role: 'Event Head', group: 'Events', bio: 'Making things happen.', image: 'https://picsum.photos/202' },
  { id: '4', name: 'Casey Smith', role: 'Design Lead', group: 'Design', bio: 'Pixel perfectionist.', image: 'https://picsum.photos/203' },
  { id: '5', name: 'Morgan Doe', role: 'Secretary', group: 'Core', bio: 'Organization wizard.', image: 'https://picsum.photos/204' },
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