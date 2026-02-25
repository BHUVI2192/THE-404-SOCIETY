import { db } from "./firebase";

export interface BlogData {
    id?: string;
    title: string;
    author: string;
    category: string;
    content: string;
    img: string;
    excerpt?: string;
    status: "draft" | "published";
    createdAt?: number;
    updatedAt?: number;
}

const BLOGS_COLLECTION = "nexus_blogs";

// Initial Mock Data
const MOCK_BLOGS: BlogData[] = [
    {
        id: "1",
        title: "Getting Started with Web Development",
        author: "404 Society",
        category: "Tutorial",
        content: "Learn the basics of web development and build your first website.",
        img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
        excerpt: "A comprehensive guide to starting your web development journey.",
        status: "published",
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

export const getBlogs = async (): Promise<BlogData[]> => {
    let data = db.get(BLOGS_COLLECTION);
    if (data.length === 0) {
        db.set(BLOGS_COLLECTION, MOCK_BLOGS);
        data = MOCK_BLOGS;
    }
    return data.sort((a: any, b: any) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
};

export const getBlogById = async (id: string): Promise<BlogData | null> => {
    const blogs = await getBlogs();
    return blogs.find(b => b.id === id) || null;
};

export const addBlog = async (blog: Omit<BlogData, "id">) => {
    const blogs = await getBlogs();
    const newBlog = { 
        ...blog, 
        id: db.generateId(), 
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    db.set(BLOGS_COLLECTION, [...blogs, newBlog]);
    return newBlog;
};

export const updateBlog = async (id: string, updates: Partial<BlogData>) => {
    const blogs = await getBlogs();
    const updatedBlogs = blogs.map(blog =>
        blog.id === id 
            ? { ...blog, ...updates, updatedAt: Date.now() } 
            : blog
    );
    db.set(BLOGS_COLLECTION, updatedBlogs);
    return updatedBlogs.find(b => b.id === id);
};

export const deleteBlog = async (id: string) => {
    const blogs = await getBlogs();
    const filtered = blogs.filter(blog => blog.id !== id);
    db.set(BLOGS_COLLECTION, filtered);
};
