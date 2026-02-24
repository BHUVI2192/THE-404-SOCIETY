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
    return db.get(REG_COLLECTION).sort((a: any, b: any) => b.createdAt - a.createdAt);
};

export const saveRegistration = async (reg: Omit<Registration, 'id'>) => {
    try {
        const regs = await getRegistrations();
        const newReg = { ...reg, id: db.generateId(), createdAt: Date.now() };
        db.set(REG_COLLECTION, [newReg, ...regs]);
        return { id: newReg.id };
    } catch (error) {
        console.error("Error saving registration:", error);
    }
};

export const deleteRegistration = async (id: string) => {
    const regs = await getRegistrations();
    const filtered = regs.filter(r => r.id !== id);
    db.set(REG_COLLECTION, filtered);
};
