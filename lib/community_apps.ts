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
    status: "pending" | "approved" | "rejected";
    createdAt?: number;
}

const COMMUNITY_COLLECTION = "nexus_community_applications";

export const getCommunityApps = async (): Promise<CommunityApp[]> => {
    return db.get(COMMUNITY_COLLECTION).sort((a: any, b: any) => b.createdAt - a.createdAt);
};

export const saveCommunityApp = async (app: Omit<CommunityApp, 'id' | 'status'>) => {
    try {
        const apps = await getCommunityApps();
        const newApp = {
            ...app,
            id: db.generateId(),
            status: "pending" as const,
            createdAt: Date.now()
        };
        db.set(COMMUNITY_COLLECTION, [newApp, ...apps]);
        return { id: newApp.id };
    } catch (error) {
        console.error("Error saving community app:", error);
    }
};

export const updateCommunityApp = async (id: string, data: Partial<CommunityApp>) => {
    const apps = await getCommunityApps();
    const updated = apps.map(a => a.id === id ? { ...a, ...data } : a);
    db.set(COMMUNITY_COLLECTION, updated);
};

export const deleteCommunityApp = async (id: string) => {
    const apps = await getCommunityApps();
    const filtered = apps.filter(a => a.id !== id);
    db.set(COMMUNITY_COLLECTION, filtered);
};
