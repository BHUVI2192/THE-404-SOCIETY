import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export interface CommunityApp {
    id?: string;
    name: string;
    email: string;
    contact: string;
    college: string;
    year: string;
    interest?: string;
    social?: string;
    status: "pending" | "approved" | "rejected" | "waitlisted";
    memberId?: string;
    feedbackReason?: string;
    emailsSent?: {
        applicationReceived?: boolean;
        applicationApproved?: boolean;
        applicationRejected?: boolean;
        applicationWaitlisted?: boolean;
    };
    createdAt?: number;
    updatedAt?: number;
}

const COMMUNITY_COLLECTION = "nexus_community_applications";

export const getCommunityApps = async (): Promise<CommunityApp[]> => {
    try {
        const appsRef = collection(db, COMMUNITY_COLLECTION);
        const q = query(appsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityApp));
    } catch (error) {
        console.error("Error getting community apps:", error);
        return [];
    }
};

export const saveCommunityApp = async (app: Omit<CommunityApp, 'id' | 'status'>) => {
    try {
        const appsRef = collection(db, COMMUNITY_COLLECTION);
        const newApp = {
            ...app,
            status: "pending" as const,
            createdAt: Date.now()
        };
        const docRef = await addDoc(appsRef, newApp);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error saving community app:", error);
    }
};

export const updateCommunityApp = async (id: string, data: Partial<CommunityApp>) => {
    try {
        const docRef = doc(db, COMMUNITY_COLLECTION, id);
        await updateDoc(docRef, { ...data, updatedAt: Date.now() });
    } catch (error) {
        console.error("Error updating community app:", error);
    }
};

export const deleteCommunityApp = async (id: string) => {
    try {
        const docRef = doc(db, COMMUNITY_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting community app:", error);
    }
};
