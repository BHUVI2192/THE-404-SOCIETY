import { collection, getDocs, doc, deleteDoc, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export interface Registration {
    id?: string;
    eventId: string;
    eventTitle: string;
    name: string;
    email: string;
    studentId?: string;
    createdAt?: number;
}

const REG_COLLECTION = "nexus_registrations";

export const getRegistrations = async (): Promise<Registration[]> => {
    try {
        const regsRef = collection(db, REG_COLLECTION);
        const q = query(regsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
    } catch (error) {
        console.error("Error getting registrations:", error);
        return [];
    }
};

export const saveRegistration = async (reg: Omit<Registration, 'id'>) => {
    try {
        const regsRef = collection(db, REG_COLLECTION);
        const newReg = { ...reg, createdAt: Date.now() };
        const docRef = await addDoc(regsRef, newReg);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error saving registration:", error);
    }
};

export const deleteRegistration = async (id: string) => {
    try {
        const docRef = doc(db, REG_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting registration:", error);
    }
};
