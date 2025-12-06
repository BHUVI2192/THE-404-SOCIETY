export interface NavLink {
  label: string;
  path: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  group: 'Core' | 'Tech' | 'Events' | 'Design';
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'upcoming' | 'past';
  category: string;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  caption: string;
  type: 'image' | 'video';
}