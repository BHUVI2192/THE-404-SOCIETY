import { collection, getDocs, doc, deleteDoc, addDoc, query, orderBy, where } from "firebase/firestore";
import { db } from "./firebase";

export interface NewsletterSubscriber {
    id?: string;
    email: string;
    name?: string;
    subscribedAt?: number;
}

const NEWSLETTER_COLLECTION = "nexus_newsletter_subscribers";

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
        const subsRef = collection(db, NEWSLETTER_COLLECTION);
        const q = query(subsRef, orderBy("subscribedAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsletterSubscriber));
    } catch (error) {
        console.error("Error getting subscribers:", error);
        return [];
    }
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<void> {
    try {
        const trimmedEmail = email.toLowerCase().trim();
        const subsRef = collection(db, NEWSLETTER_COLLECTION);

        // Check for existing subscription
        const qCheck = query(subsRef, where("email", "==", trimmedEmail));
        const checkSnapshot = await getDocs(qCheck);
        if (!checkSnapshot.empty) {
            throw new Error("This email is already subscribed!");
        }

        const newSub = {
            email: trimmedEmail,
            name: name?.trim() || "",
            subscribedAt: Date.now(),
        };

        await addDoc(subsRef, newSub);
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        throw error; // re-throw so the UI can show the error
    }
}

export async function unsubscribeById(id: string): Promise<void> {
    try {
        const docRef = doc(db, NEWSLETTER_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error unsubscribing by id:", error);
    }
}
