import { db } from "./firebase";

export interface NewsletterSubscriber {
    id?: string;
    email: string;
    name?: string;
    subscribedAt?: number;
}

const NEWSLETTER_COLLECTION = "nexus_newsletter_subscribers";

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
    return db.get(NEWSLETTER_COLLECTION).sort((a: any, b: any) => b.subscribedAt - a.subscribedAt);
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<void> {
    const trimmedEmail = email.toLowerCase().trim();
    const subs = await getSubscribers();

    if (subs.some(s => s.email === trimmedEmail)) {
        throw new Error("This email is already subscribed!");
    }

    const newSub = {
        id: db.generateId(),
        email: trimmedEmail,
        name: name?.trim() || "",
        subscribedAt: Date.now(),
    };

    db.set(NEWSLETTER_COLLECTION, [newSub, ...subs]);
}

export async function unsubscribeById(id: string): Promise<void> {
    const subs = await getSubscribers();
    const filtered = subs.filter(s => s.id !== id);
    db.set(NEWSLETTER_COLLECTION, filtered);
}
