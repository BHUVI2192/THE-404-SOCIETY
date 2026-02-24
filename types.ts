
export interface NavLink {
  label: string;
  path: string;
}




export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
  image?: string;
  colSpan?: number;
  rowSpan?: number;
}


