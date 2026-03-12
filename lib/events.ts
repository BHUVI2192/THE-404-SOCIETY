import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { EventPricing } from "../types";

export interface EventData {
    id?: string;
    title: string;
    date: string;
    year: string;
    location: string;
    img: string;
    status: "open" | "locked";
    category?: string;
    description?: string;
    pricing?: EventPricing;
    maxRegistrations?: number;
    createdAt?: number;
}

const EVENTS_COLLECTION = "nexus_events";

export const getEvents = async (): Promise<EventData[]> => {
    try {
        const eventsRef = collection(db, EVENTS_COLLECTION);
        const q = query(eventsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData));
    } catch (e) {
        console.error("Error getting events:", e);
        return [];
    }
};

export const subscribeToEvents = (callback: (events: EventData[]) => void) => {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData));
        callback(data);
    }, (error) => {
        console.error("Error subscribing to events:", error);
        callback([]);
    });
};

export const getEventById = async (id: string): Promise<EventData | null> => {
    try {
        const docRef = doc(db, EVENTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as EventData;
        }
        return null;
    } catch (e) {
        console.error("Error getting event by id:", e);
        return null;
    }
};

/**
 * Remove undefined fields from an object (Firestore doesn't accept undefined)
 */
const cleanUndefinedFields = (obj: any): any => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => cleanUndefinedFields(item));
    }
    
    if (typeof obj === 'object') {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
                cleaned[key] = cleanUndefinedFields(value);
            }
        }
        return cleaned;
    }
    
    return obj;
};

export const addEvent = async (event: Omit<EventData, "id">) => {
    try {
        const eventsRef = collection(db, EVENTS_COLLECTION);
        const newEvent = cleanUndefinedFields({ ...event, createdAt: Date.now() });
        const docRef = await addDoc(eventsRef, newEvent);
        return docRef.id;
    } catch (e) {
        console.error("Error adding event:", e);
        return null;
    }
};

export const updateEvent = async (id: string, data: Partial<EventData>) => {
    try {
        const docRef = doc(db, EVENTS_COLLECTION, id);
        const cleanedData = cleanUndefinedFields(data);
        await updateDoc(docRef, cleanedData);
    } catch (e) {
        console.error("Error updating event:", e);
    }
};

export const deleteEvent = async (id: string) => {
    try {
        const docRef = doc(db, EVENTS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (e) {
        console.error("Error deleting event:", e);
    }
};

/**
 * Check if an event is free
 */
export const isEventFree = (event: EventData): boolean => {
    return event.pricing?.isFree !== false;
};

/**
 * Get effective price for an event (considering early bird discount)
 */
export const getEffectivePrice = (event: EventData): number => {
    if (!event.pricing || event.pricing.isFree) {
        return 0;
    }

    const baseAmount = event.pricing.amount;
    
    // Check early bird discount
    if (event.pricing.earlyBirdDiscount?.enabled) {
        const validUntil = new Date(event.pricing.earlyBirdDiscount.validUntil);
        const now = new Date();
        
        if (now <= validUntil) {
            const discount = event.pricing.earlyBirdDiscount.discountPercent;
            return Math.round(baseAmount * (1 - discount / 100));
        }
    }
    
    return baseAmount;
};

/**
 * Format price for display
 */
export const formatPrice = (amountInPaise: number): string => {
    const rupees = amountInPaise / 100;
    return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

/**
 * Check if early bird discount is active
 */
export const isEarlyBirdActive = (event: EventData): boolean => {
    if (!event.pricing?.earlyBirdDiscount?.enabled) {
        return false;
    }
    
    const validUntil = new Date(event.pricing.earlyBirdDiscount.validUntil);
    const now = new Date();
    
    return now <= validUntil;
};

