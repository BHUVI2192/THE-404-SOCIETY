import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
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

const BLOG_COLLECTION = "nexus_blogs";

export const getBlogPosts = async (): Promise<BlogPostData[]> => {
    try {
        const blogsRef = collection(db, BLOG_COLLECTION);
        const q = query(blogsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                excerpt: data.excerpt || "",
                content: data.content || "",
                category: data.category || "Community",
                image: data.image || data.coverImage || data.img,
                date: data.date || new Date(data.createdAt || Date.now()).toLocaleDateString(),
                colSpan: data.colSpan || 1,
                rowSpan: data.rowSpan || 1,
                createdAt: data.createdAt,
                authorName: data.authorName || data.author,
                readTime: data.readTime,
            } as BlogPostData;
        });
    } catch (e) {
        console.error("Error getting blog posts:", e);
        return [];
    }
};

export const subscribeToBlogPosts = (callback: (blogs: BlogPostData[]) => void) => {
    const blogsRef = collection(db, BLOG_COLLECTION);
    const q = query(blogsRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const result = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                excerpt: data.excerpt || "",
                content: data.content || "",
                category: data.category || "Community",
                image: data.image || data.coverImage || data.img,
                date: data.date || new Date(data.createdAt || Date.now()).toLocaleDateString(),
                colSpan: data.colSpan || 1,
                rowSpan: data.rowSpan || 1,
                createdAt: data.createdAt,
                authorName: data.authorName || data.author,
                readTime: data.readTime,
            } as BlogPostData;
        });
        callback(result);
    }, (error) => {
        console.error("Error subscribing to blog posts:", error);
        callback([]);
    });
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
