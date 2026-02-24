import { db } from "./firebase";

export interface BlogPostData {
    id?: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image: string;
    date: string;
    colSpan?: number;
    rowSpan?: number;
    createdAt?: number;
}

const BLOG_COLLECTION = "nexus_blog_posts";

export const SAMPLE_POSTS: BlogPostData[] = [
    {
        id: "1",
        title: "The Future of Open Source",
        excerpt: "Why contributing to open source is more important than ever.",
        content: "Open source is the backbone of modern technology...",
        category: "TECH",
        image: "https://images.unsplash.com/photo-1618401471353-b98aadebc25a?q=80&w=800&auto=format&fit=crop",
        date: "FEB 10, 2026",
        colSpan: 1,
        rowSpan: 1,
        createdAt: Date.now()
    }
];

export const getBlogPosts = async (): Promise<BlogPostData[]> => {
    let data = db.get(BLOG_COLLECTION);
    if (data.length === 0) {
        db.set(BLOG_COLLECTION, SAMPLE_POSTS);
        data = SAMPLE_POSTS;
    }
    return data.sort((a: any, b: any) => b.createdAt - a.createdAt);
};

export const addBlogPost = async (post: Omit<BlogPostData, 'id'>) => {
    const posts = await getBlogPosts();
    const newPost = { ...post, id: db.generateId(), createdAt: Date.now() };
    db.set(BLOG_COLLECTION, [newPost, ...posts]);
    return { id: newPost.id };
};

export const updateBlogPost = async (id: string, data: Partial<BlogPostData>) => {
    const posts = await getBlogPosts();
    const updated = posts.map(p => p.id === id ? { ...p, ...data } : p);
    db.set(BLOG_COLLECTION, updated);
};

export const deleteBlogPost = async (id: string) => {
    const posts = await getBlogPosts();
    const filtered = posts.filter(p => p.id !== id);
    db.set(BLOG_COLLECTION, filtered);
};
