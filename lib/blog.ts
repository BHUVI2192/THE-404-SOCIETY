import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

export interface BlogPostData {
    author?: any;
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

export const HARDCODED_POSTS: BlogPostData[] = [];

export const getBlogPosts = async (): Promise<BlogPostData[]> => {
    try {
        const postsRef = collection(db, BLOG_COLLECTION);
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs
            .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as BlogPostData));
    } catch (error) {
        console.error("[blog] Failed to fetch posts:", error);
        return [];
    }
};

export const subscribeToBlogPosts = (callback: (posts: BlogPostData[]) => void) => {
    const postsRef = collection(db, BLOG_COLLECTION);
    const q = query(postsRef, orderBy("createdAt", "desc"));

    return onSnapshot(
        q,
        (snapshot) => {
            const posts = snapshot.docs
                .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as BlogPostData));
            callback(posts);
        },
        (error) => {
            console.error("[blog] Realtime subscription failed:", error);
            callback([]);
        }
    );
};

export const addBlogPost = async (post: Omit<BlogPostData, 'id'>) => {
    const postsRef = collection(db, BLOG_COLLECTION);
    const newPost = {
        ...post,
        createdAt: Date.now(),
    };
    const docRef = await addDoc(postsRef, newPost);
    return { id: docRef.id };
};

export const updateBlogPost = async (id: string, data: Partial<BlogPostData>) => {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await updateDoc(docRef, data);
};

export const deleteBlogPost = async (id: string) => {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await deleteDoc(docRef);
};
