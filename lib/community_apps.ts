import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy, onSnapshot, where, limit } from "firebase/firestore";
import { db } from "./firebase";

export interface CommunityApp {
    id?: string;
    name: string;
    email: string;
    contact: string;
    college: string;
    year: string;
    interest?: string;
    skills?: string;
    reason?: string;
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

/** Returns true if an application with this email already exists */
export const checkDuplicateCommunityApp = async (email: string): Promise<boolean> => {
    try {
        const appsRef = collection(db, COMMUNITY_COLLECTION);
        const q = query(appsRef, where("email", "==", email.trim().toLowerCase()), limit(1));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch {
        return false; // fail open
    }
};

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

export const subscribeToCommunityApps = (callback: (apps: CommunityApp[]) => void) => {
    const appsRef = collection(db, COMMUNITY_COLLECTION);
    const q = query(appsRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityApp));
        callback(data);
    }, (error) => {
        console.error("Error subscribing to community apps:", error);
        callback([]);
    });
};

export const saveCommunityApp = async (app: Omit<CommunityApp, 'id' | 'status'>) => {
    try {
        const appsRef = collection(db, COMMUNITY_COLLECTION);
        const newApp = {
            ...app,
            email: app.email?.trim().toLowerCase(),
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
