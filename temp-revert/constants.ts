
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
    name: 'Bhuvan N', 
    role: 'Founder & President / CEO', 
    group: 'Core', 
    bio: 'Sets vision and direction for 404 Society, represents the club externally, and takes final calls on strategy, culture, and major initiatives.', 
    image: 'https://ui-avatars.com/api/?name=Bhuvan+N&background=000&color=fff&size=200' 
  },
  { 
    id: '2', 
    name: 'K Hrishikesh', 
    role: 'Co-Founder & Vice President', 
    group: 'Core', 
    bio: 'Supports the Founder in execution, coordinates across all leads, tracks progress of events/projects, and ensures smooth day-to-day operations.', 
    image: 'https://ui-avatars.com/api/?name=K+Hrishikesh&background=000&color=fff&size=200' 
  },
  
  // Leads
  { 
    id: '3', 
    name: 'Deepak', 
    role: 'Technical Lead', 
    group: 'Tech', 
    bio: 'Leads all tech, dev, and infra.', 
    image: 'https://ui-avatars.com/api/?name=Deepak&background=111&color=ccc&size=200' 
  },
  { 
    id: '4', 
    name: 'Mizba', 
    role: 'Events & Operations Lead', 
    group: 'Events', 
    bio: 'Event planning, logistics, and coordination.', 
    image: 'https://ui-avatars.com/api/?name=Mizba&background=111&color=ccc&size=200' 
  },
  { 
    id: '5', 
    name: 'Trisha', 
    role: 'Community & Membership Lead', 
    group: 'Operations', 
    bio: 'Manages members, onboarding, and groups.', 
    image: 'https://ui-avatars.com/api/?name=Trisha&background=111&color=ccc&size=200' 
  },
  { 
    id: '6', 
    name: 'Trupthi', 
    role: 'Marketing & Outreach Lead', 
    group: 'Marketing', 
    bio: 'Promotions, collabs, and external outreach.', 
    image: 'https://ui-avatars.com/api/?name=Trupthi&background=111&color=ccc&size=200' 
  },
  { 
    id: '7', 
    name: 'Thara', 
    role: 'Design & Branding Lead', 
    group: 'Design', 
    bio: 'Visual identity, posters, and creatives.', 
    image: 'https://ui-avatars.com/api/?name=Thara&background=111&color=ccc&size=200' 
  },
  { 
    id: '8', 
    name: 'Harini', 
    role: 'Content & Documentation Lead', 
    group: 'Content', 
    bio: 'Copies, docs, reports, and descriptions.', 
    image: 'https://ui-avatars.com/api/?name=Harini&background=111&color=ccc&size=200' 
  },
  { 
    id: '9', 
    name: 'Kirtana', 
    role: 'Finance & Sponsorship Lead', 
    group: 'Operations', 
    bio: 'Budgeting, funds, and sponsorship follow-up.', 
    image: 'https://ui-avatars.com/api/?name=Kirtana&background=111&color=ccc&size=200' 
  },
  { 
    id: '10', 
    name: 'Rudresh', 
    role: 'Photography & Videography Lead', 
    group: 'Design', 
    bio: 'Event photos and media assets.', 
    image: 'https://ui-avatars.com/api/?name=Rudresh&background=111&color=ccc&size=200' 
  },
  { 
    id: '11', 
    name: 'Pramath', 
    role: 'Academics & Learning Lead', 
    group: 'Tech', 
    bio: 'Sessions, study groups, and learning plans.', 
    image: 'https://ui-avatars.com/api/?name=Pramath&background=111&color=ccc&size=200' 
  },
  { 
    id: '12', 
    name: 'Ananya V', 
    role: 'Culture/Welfare Lead', 
    group: 'Events', 
    bio: 'Cultural events and welfare vibe.', 
    image: 'https://ui-avatars.com/api/?name=Ananya+V&background=111&color=ccc&size=200' 
  },
  { 
    id: '13', 
    name: 'Neha K', 
    role: 'Social / Media Lead', 
    group: 'Marketing', 
    bio: 'Social media posting & engagement.', 
    image: 'https://ui-avatars.com/api/?name=Neha+K&background=111&color=ccc&size=200' 
  },
  { 
    id: '14', 
    name: 'Yash', 
    role: 'Projects Lead', 
    group: 'Tech', 
    bio: 'Internal projects and execution.', 
    image: 'https://ui-avatars.com/api/?name=Yash&background=111&color=ccc&size=200' 
  },
  { 
    id: '15', 
    name: 'Prathik S R', 
    role: 'Social / Media Lead', 
    group: 'Marketing', 
    bio: 'Social media posting & engagement.', 
    image: 'https://ui-avatars.com/api/?name=Prathik+S+R&background=111&color=ccc&size=200' 
  },
];

export const EVENTS: EventItem[] = [
  { id: '1', title: 'AI & The Future', date: 'Oct 24, 2025', description: 'Exploring LLMs and generative art.', type: 'upcoming', category: 'Workshop', image: 'https://picsum.photos/800/400', registrationStatus: 'open' },
  { id: '2', title: 'HackTheNight 4.0', date: 'Nov 12, 2025', description: '24-hour coding marathon.', type: 'upcoming', category: 'Hackathon', image: 'https://picsum.photos/800/401', registrationStatus: 'locked' },
  { id: '5', title: 'UI/UX Design Systems', date: 'Dec 02, 2025', description: 'Building scalable designs for modern apps.', type: 'upcoming', category: 'Design', image: 'https://picsum.photos/800/402', registrationStatus: 'open' },
  { id: '3', title: 'Intro to React', date: 'Sep 10, 2025', description: 'Building your first component.', type: 'past', category: 'Workshop' },
  { id: '4', title: 'Tech Showcase', date: 'Aug 15, 2025', description: 'Student projects demo day.', type: 'past', category: 'Exhibition' },
];

export const POSTS: BlogPost[] = [
  { 
    id: '1', 
    title: 'Why 404 isn\'t just an error', 
    date: 'Oct 01, 2023', 
    category: 'Culture', 
    excerpt: 'Embracing the unexpected in software development.',
    content: `
      In the world of the web, 404 is synonymous with failure. It means the server couldn't find what you were looking for. But at The 404 Society, we view it differently.
      
      The "Not Found" status represents the vast unknown of technology. It's the space where innovation happens—where the path isn't mapped out, and the documentation hasn't been written yet.
      
      We embrace the glitch. We celebrate the bug. Because every time you encounter a 404, you're at the edge of the known system. Our goal is to inhabit that edge, to build in the gaps, and to turn "Not Found" into "Just Created."
      
      Software engineering is often taught as a series of logical steps, but real-world engineering is messy. It's about navigating dead ends and turning them into new beginnings. That's the core of our culture.
    `
  },
  { 
    id: '2', 
    title: 'Recap: HackTheNight 3.0', 
    date: 'Sep 15, 2023', 
    category: 'Events', 
    excerpt: 'Winners, losers, and lots of caffeine.',
    content: `
      HackTheNight 3.0 has officially concluded, and the results are staggering. Over 24 hours, 45 teams pushed their limits to build solutions for modern urban problems.
      
      The energy in the lab was electric—fueled by high-intensity music and an endless supply of caffeine. From AI-driven traffic management to blockchain-based voting systems, the diversity of projects showcased the incredible talent within our community.
      
      Congratulations to Team 'LogicBomb' for taking home the first prize with their revolutionary peer-to-peer energy sharing platform. Their implementation of a custom consensus algorithm in under 24 hours was nothing short of brilliant.
      
      But more than the winners, we celebrate the spirit of collaboration. Seeing seniors debug a junior's code at 3 AM is exactly why this society exists.
    `
  },
  { 
    id: '3', 
    title: 'Getting started with Open Source', 
    date: 'Aug 20, 2023', 
    category: 'Tech', 
    excerpt: 'How to make your first PR without fear.',
    content: `
      Open source can be intimidating. Staring at a massive repository like React or Linux and thinking "how can I possibly contribute?" is a universal developer experience.
      
      The secret is to start small. Look for "Good First Issue" tags. Documentation, typo fixes, and adding test cases are all valid and highly appreciated contributions.
      
      In this guide, we break down the workflow:
      1. Forking the repository.
      2. Cloning locally.
      3. Creating a feature branch.
      4. Making changes and committing.
      5. Pushing and opening that first Pull Request.
      
      Remember, every maintainer was once a beginner. The 404 Society hosts monthly 'Sprints' where we help you land your first contribution to real-world projects.
    `
  },
];

// Mocking 30+ items for the gallery
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', src: 'https://picsum.photos/600/400?sig=1', caption: 'Hackathon Winners', type: 'image', category: 'Hackathons' },
  { id: '2', src: 'https://picsum.photos/600/401?sig=2', caption: 'Workshop Session', type: 'image', category: 'Workshops' },
  { id: '3', src: 'https://picsum.photos/600/600?sig=3', caption: 'Team Outing', type: 'image', category: 'Socials' },
  { id: '4', src: 'https://picsum.photos/600/300?sig=4', caption: 'Keynote Speaker', type: 'image', category: 'Events' as any },
  { id: '5', src: 'https://picsum.photos/600/500?sig=5', caption: 'Project Demo', type: 'image', category: 'Projects' },
  { id: '6', src: 'https://picsum.photos/600/450?sig=6', caption: 'Late Night Coding', type: 'image', category: 'Hackathons' },
  { id: '7', src: 'https://picsum.photos/600/400?sig=7', caption: 'Design Workshop', type: 'image', category: 'Workshops' },
  { id: '8', src: 'https://picsum.photos/600/401?sig=8', caption: 'Annual Meetup', type: 'image', category: 'Socials' },
  { id: '9', src: 'https://picsum.photos/600/402?sig=9', caption: 'New Prototype', type: 'image', category: 'Projects' },
  { id: '10', src: 'https://picsum.photos/600/403?sig=10', caption: 'Code Review', type: 'image', category: 'Workshops' },
  { id: '11', src: 'https://picsum.photos/600/404?sig=11', caption: 'Award Ceremony', type: 'image', category: 'Events' as any },
  { id: '12', src: 'https://picsum.photos/600/405?sig=12', caption: 'Networking Hour', type: 'image', category: 'Socials' },
  { id: '13', src: 'https://picsum.photos/600/406?sig=13', caption: 'Open Source Day', type: 'image', category: 'Workshops' },
  { id: '14', src: 'https://picsum.photos/600/407?sig=14', caption: 'Hardware Lab', type: 'image', category: 'Projects' },
  { id: '15', src: 'https://picsum.photos/600/408?sig=15', caption: 'Brainstorming', type: 'image', category: 'Socials' },
  { id: '16', src: 'https://picsum.photos/600/409?sig=16', caption: 'Pitch Deck Session', type: 'image', category: 'Workshops' },
  { id: '17', src: 'https://picsum.photos/600/410?sig=17', caption: 'Robotics Demo', type: 'image', category: 'Projects' },
  { id: '18', src: 'https://picsum.photos/600/411?sig=18', caption: 'Closing Ceremony', type: 'image', category: 'Events' as any },
  { id: '19', src: 'https://picsum.photos/600/412?sig=19', caption: 'Tech Talk', type: 'image', category: 'Workshops' },
  { id: '20', src: 'https://picsum.photos/600/413?sig=20', caption: 'Community Pizza', type: 'image', category: 'Socials' },
  { id: '21', src: 'https://picsum.photos/600/414?sig=21', caption: 'Debug Session', type: 'image', category: 'Hackathons' },
  { id: '22', src: 'https://picsum.photos/600/415?sig=22', caption: 'VR Experience', type: 'image', category: 'Projects' },
  { id: '23', src: 'https://picsum.photos/600/416?sig=23', caption: 'Alumni Dinner', type: 'image', category: 'Socials' },
  { id: '24', src: 'https://picsum.photos/600/417?sig=24', caption: 'Git Training', type: 'image', category: 'Workshops' },
  { id: '25', src: 'https://picsum.photos/600/418?sig=25', caption: 'Final Pitch', type: 'image', category: 'Hackathons' },
  { id: '26', src: 'https://picsum.photos/600/419?sig=26', caption: 'Member Spotlight', type: 'image', category: 'Socials' },
  { id: '27', src: 'https://picsum.photos/600/420?sig=27', caption: 'Deep Learning Talk', type: 'image', category: 'Workshops' },
  { id: '28', src: 'https://picsum.photos/600/421?sig=28', caption: 'Society Launch', type: 'image', category: 'Events' as any },
  { id: '29', src: 'https://picsum.photos/600/422?sig=29', caption: 'Office Hours', type: 'image', category: 'Workshops' },
  { id: '30', src: 'https://picsum.photos/600/423?sig=30', caption: 'Project Expo', type: 'image', category: 'Projects' },
  { id: '31', src: 'https://picsum.photos/600/424?sig=31', caption: 'Coffee & Code', type: 'image', category: 'Socials' },
  { id: '32', src: 'https://picsum.photos/600/425?sig=32', caption: 'Security Audit', type: 'image', category: 'Projects' },
];
