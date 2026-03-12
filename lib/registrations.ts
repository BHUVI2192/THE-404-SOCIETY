import { collection, getDocs, doc, getDoc, deleteDoc, addDoc, query, orderBy, onSnapshot, updateDoc, where, limit } from "firebase/firestore";
import { db } from "./firebase";

export interface Registration {
    id?: string;
    eventId: string;
    eventTitle: string;
    name: string;
    email: string;
    studentId?: string;
    phone?: string;
    branch?: string;
    year?: string;
    teamName?: string;
    paymentStatus?: 'not_required' | 'pending' | 'completed' | 'failed';
    paymentId?: string;
    amountPaid?: number; // in paise
    createdAt?: number;
}

const REG_COLLECTION = "nexus_registrations";

/** Returns true if (email + eventId) already has a registration */
export const checkDuplicateRegistration = async (email: string, eventId: string): Promise<boolean> => {
    try {
        const regsRef = collection(db, REG_COLLECTION);
        const q = query(regsRef, where("email", "==", email.trim().toLowerCase()), where("eventId", "==", eventId), limit(1));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch {
        return false; // fail open — don't block if Firestore check fails
    }
};

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

export const subscribeToRegistrations = (callback: (regs: Registration[]) => void) => {
    const regsRef = collection(db, REG_COLLECTION);
    const q = query(regsRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
        callback(data);
    }, (error) => {
        console.error("Error subscribing to registrations:", error);
        callback([]);
    });
};

export const saveRegistration = async (reg: Omit<Registration, 'id'>) => {
    try {
        const regsRef = collection(db, REG_COLLECTION);
        const newReg = { ...reg, email: reg.email?.trim().toLowerCase(), createdAt: Date.now() };
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

/**
 * Update registration payment status
 */
export const updateRegistrationPayment = async (
    registrationId: string,
    paymentStatus: Registration['paymentStatus'],
    paymentId?: string,
    amountPaid?: number
) => {
    try {
        const docRef = doc(db, REG_COLLECTION, registrationId);
        const updateData: Partial<Registration> = {
            paymentStatus
        };
        
        if (paymentId) {
            updateData.paymentId = paymentId;
        }
        
        if (amountPaid !== undefined) {
            updateData.amountPaid = amountPaid;
        }
        
        await updateDoc(docRef, updateData);
        return true;
    } catch (error) {
        console.error("Error updating registration payment:", error);
        return false;
    }
};

/**
 * Get registration by ID
 */
export const getRegistrationById = async (id: string): Promise<Registration | null> => {
    try {
        const docRef = doc(db, REG_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Registration;
        }
        return null;
    } catch (error) {
        console.error("Error getting registration by ID:", error);
        return null;
    }
};

