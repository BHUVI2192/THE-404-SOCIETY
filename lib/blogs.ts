import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
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

export const getBlogs = async (): Promise<BlogData[]> => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION);
        const q = query(blogsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogData));
        return data.sort((a: any, b: any) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
    } catch (e) {
        console.error("Error getting blogs:", e);
        return [];
    }
};

export const getBlogById = async (id: string): Promise<BlogData | null> => {
    try {
        const docRef = doc(db, BLOGS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BlogData;
        }
        return null;
    } catch (e) {
        console.error("Error getting blog by id:", e);
        return null;
    }
};

export const addBlog = async (blog: Omit<BlogData, "id">) => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION);
        const newBlog = {
            ...blog,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const docRef = await addDoc(blogsRef, newBlog);
        return { id: docRef.id, ...newBlog };
    } catch (e) {
        console.error("Error adding blog:", e);
        return null;
    }
};

export const updateBlog = async (id: string, updates: Partial<BlogData>) => {
    try {
        const docRef = doc(db, BLOGS_COLLECTION, id);
        const updateData = { ...updates, updatedAt: Date.now() };
        await updateDoc(docRef, updateData);
        return { id, ...updateData };
    } catch (e) {
        console.error("Error updating blog:", e);
        return null;
    }
};

export const deleteBlog = async (id: string) => {
    try {
        const docRef = doc(db, BLOGS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (e) {
        console.error("Error deleting blog:", e);
    }
};
