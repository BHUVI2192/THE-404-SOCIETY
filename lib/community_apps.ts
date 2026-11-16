import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy, onSnapshot, where, limit } from "firebase/firestore";
import { db } from "./firebase";
import { supabase } from "./supabase";

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

/** Get applications directly from Supabase SQL table */
export const getSupabaseOnboardingApps = async () => {
    try {
        const { data, error } = await supabase
            .from('onboarding_applications')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching onboarding apps from Supabase:", error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error("Exception fetching from Supabase:", e);
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
    const cleanEmail = app.email?.trim().toLowerCase();

    // 1. Save to Supabase SQL table (onboarding_applications)
    try {
        const { data, error } = await supabase
            .from('onboarding_applications')
            .insert([{
                name: app.name,
                email: cleanEmail,
                contact: app.contact || '',
                college: app.college || '',
                year: app.year || '',
                interest: app.interest || '',
                skills: app.skills || '',
                reason: app.reason || '',
                social: app.social || '',
                status: 'pending'
            }])
            .select();

        if (error) {
            console.error("Error saving to Supabase onboarding_applications:", error);
        } else {
            console.log("Successfully stored onboarding in Supabase SQL:", data);
        }
    } catch (sbErr) {
        console.error("Supabase onboarding storage exception:", sbErr);
    }

    // 2. Also save to Firestore for backward compatibility
    try {
        const appsRef = collection(db, COMMUNITY_COLLECTION);
        const newApp = {
            ...app,
            email: cleanEmail,
            status: "pending" as const,
            createdAt: Date.now()
        };
        const docRef = await addDoc(appsRef, newApp);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error saving community app to Firestore:", error);
    }
};

export const updateCommunityApp = async (id: string, data: Partial<CommunityApp>) => {
    try {
        const docRef = doc(db, COMMUNITY_COLLECTION, id);
        await updateDoc(docRef, { ...data, updatedAt: Date.now() });
    } catch (error) {
        console.error("Error updating community app:", error);
    }

    // Mirror updates to Supabase if email is available
    if (data.email) {
        try {
            await supabase
                .from('onboarding_applications')
                .update({
                    status: data.status,
                    member_id: data.memberId,
                    feedback_reason: data.feedbackReason,
                    updated_at: new Date().toISOString()
                })
                .eq('email', data.email.trim().toLowerCase());
        } catch (e) {
            console.error("Error mirroring update to Supabase:", e);
        }
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
