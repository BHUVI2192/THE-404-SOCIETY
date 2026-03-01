import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

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

export const addEvent = async (event: Omit<EventData, "id">) => {
    try {
        const eventsRef = collection(db, EVENTS_COLLECTION);
        const newEvent = { ...event, createdAt: Date.now() };
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
        await updateDoc(docRef, data);
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
