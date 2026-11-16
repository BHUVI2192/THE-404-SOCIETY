import { collection, doc, getDocs, addDoc, query, orderBy, limit, where, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { EmailLog } from "../types";

const EMAIL_LOG_COLLECTION = "nexus_email_logs";

export const logEmail = async (
  recipientEmail: string,
  recipientName: string,
  trigger: string,
  subject: string,
  status: 'sent' | 'failed' = 'sent',
  error?: string
): Promise<void> => {
  try {
    const logsRef = collection(db, EMAIL_LOG_COLLECTION);
    const newLog = {
      recipientEmail,
      recipientName,
      trigger,
      subject,
      status,
      error: error || null,
      timestamp: Date.now(),
    };
    await addDoc(logsRef, newLog);
  } catch (err) {
    console.error("Error logging email:", err);
  }
};

export const getEmailLogs = async (limitCount?: number): Promise<EmailLog[]> => {
  try {
    const logsRef = collection(db, EMAIL_LOG_COLLECTION);
    let q = query(logsRef, orderBy("timestamp", "desc"));
    if (limitCount) {
      q = query(logsRef, orderBy("timestamp", "desc"), limit(limitCount));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailLog));
  } catch (error) {
    console.error("Error getting email logs:", error);
    return [];
  }
};

export const getEmailLogsByTrigger = async (trigger: string): Promise<EmailLog[]> => {
  try {
    const logsRef = collection(db, EMAIL_LOG_COLLECTION);
    const q = query(logsRef, where("trigger", "==", trigger), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailLog));
  } catch (error) {
    console.error("Error getting email logs by trigger:", error);
    return [];
  }
};

export const getEmailLogsByRecipient = async (email: string): Promise<EmailLog[]> => {
  try {
    const logsRef = collection(db, EMAIL_LOG_COLLECTION);
    const q = query(logsRef, where("recipientEmail", "==", email), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailLog));
  } catch (error) {
    console.error("Error getting email logs by recipient:", error);
    return [];
  }
};

export const clearOldLogs = async (daysOld: number = 90): Promise<number> => {
  try {
    const logsRef = collection(db, EMAIL_LOG_COLLECTION);
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    const q = query(logsRef, where("timestamp", "<", cutoffTime));
    const snapshot = await getDocs(q);

    let deletedCount = 0;
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, EMAIL_LOG_COLLECTION, document.id));
      deletedCount++;
    }
    return deletedCount;
  } catch (error) {
    console.error("Error clearing old logs:", error);
    return 0;
  }
};
