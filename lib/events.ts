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

// Initial Mock Data
const MOCK_EVENTS: EventData[] = [
    {
        id: "1",
        title: "HackTheNight 4.0",
        date: "MAR 15",
        year: "2026",
        location: "Main Auditorium",
        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
        status: "open",
        category: "Hackathon",
        description: "The 4th edition of our flagship overnight hackathon.",
        createdAt: Date.now()
    }
];

export const getEvents = async (): Promise<EventData[]> => {
    let data = db.get(EVENTS_COLLECTION);
    if (data.length === 0) {
        db.set(EVENTS_COLLECTION, MOCK_EVENTS);
        data = MOCK_EVENTS;
    }
    return data.sort((a: any, b: any) => b.createdAt - a.createdAt);
};

export const getEventById = async (id: string): Promise<EventData | null> => {
    const events = await getEvents();
    return events.find(e => e.id === id) || null;
};

export const addEvent = async (event: Omit<EventData, "id">) => {
    const events = await getEvents();
    const newEvent = { ...event, id: db.generateId(), createdAt: Date.now() };
    db.set(EVENTS_COLLECTION, [newEvent, ...events]);
    return newEvent.id;
};

export const updateEvent = async (id: string, data: Partial<EventData>) => {
    const events = await getEvents();
    const updated = events.map(e => e.id === id ? { ...e, ...data } : e);
    db.set(EVENTS_COLLECTION, updated);
};

export const deleteEvent = async (id: string) => {
    const events = await getEvents();
    const filtered = events.filter(e => e.id !== id);
    db.set(EVENTS_COLLECTION, filtered);
};
