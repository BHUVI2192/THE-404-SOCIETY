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
const LEGACY_MIGRATION_FLAG = "nexus_blog_posts_migrated_to_firestore";

const getLegacyLocalPosts = (): BlogPostData[] => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const data = localStorage.getItem(BLOG_COLLECTION);
        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("[blog] Failed to parse legacy local posts:", error);
        return [];
    }
};

const migrateLegacyPostsIfNeeded = async () => {
    if (typeof window === "undefined") {
        return;
    }

    if (localStorage.getItem(LEGACY_MIGRATION_FLAG) === "true") {
        return;
    }

    try {
        const postsRef = collection(db, BLOG_COLLECTION);
        const existingSnapshot = await getDocs(postsRef);

        // Migrate local posts only when Firestore does not already have blog data.
        if (!existingSnapshot.empty) {
            localStorage.setItem(LEGACY_MIGRATION_FLAG, "true");
            return;
        }

        const legacyPosts = getLegacyLocalPosts();
        if (!legacyPosts.length) {
            localStorage.setItem(LEGACY_MIGRATION_FLAG, "true");
            return;
        }

        for (const post of legacyPosts) {
            const { id, ...data } = post;
            await addDoc(postsRef, {
                ...data,
                createdAt: data.createdAt || Date.now(),
            });
        }

        localStorage.setItem(LEGACY_MIGRATION_FLAG, "true");
    } catch (error) {
        console.error("[blog] Legacy migration failed:", error);
    }
};

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
        createdAt: Date.now(),
        authorName: "SYSTEM CONFIG",
        readTime: "3 MIN"
    }
];

export const getBlogPosts = async (): Promise<BlogPostData[]> => {
    try {
        await migrateLegacyPostsIfNeeded();
        const postsRef = collection(db, BLOG_COLLECTION);
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs
            .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as BlogPostData))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (error) {
        console.error("[blog] Failed to fetch posts:", error);
        return [];
    }
};

export const subscribeToBlogPosts = (callback: (posts: BlogPostData[]) => void) => {
    void migrateLegacyPostsIfNeeded();

    const postsRef = collection(db, BLOG_COLLECTION);
    const q = query(postsRef, orderBy("createdAt", "desc"));

    return onSnapshot(
        q,
        (snapshot) => {
            const posts = snapshot.docs
                .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as BlogPostData))
                .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
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
