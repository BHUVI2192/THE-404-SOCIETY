import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export interface BlogPostData {
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

const BLOG_COLLECTION = "nexus_blog_posts";

export const getBlogPosts = async (): Promise<BlogPostData[]> => {
    try {
        const blogsRef = collection(db, BLOG_COLLECTION);
        const q = query(blogsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPostData));
    } catch (e) {
        console.error("Error getting blog posts:", e);
        return [];
    }
};

export const addBlogPost = async (post: Omit<BlogPostData, 'id'>) => {
    try {
        const blogsRef = collection(db, BLOG_COLLECTION);
        const newPost = { ...post, createdAt: Date.now() };
        const docRef = await addDoc(blogsRef, newPost);
        return { id: docRef.id };
    } catch (e) {
        console.error("Error adding blog post:", e);
        return { id: "" };
    }
};

export const updateBlogPost = async (id: string, data: Partial<BlogPostData>) => {
    try {
        const docRef = doc(db, BLOG_COLLECTION, id);
        await updateDoc(docRef, data);
    } catch (e) {
        console.error("Error updating blog post:", e);
    }
};

export const deleteBlogPost = async (id: string) => {
    try {
        const docRef = doc(db, BLOG_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (e) {
        console.error("Error deleting blog post:", e);
    }
};
