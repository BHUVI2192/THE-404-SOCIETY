import { db } from "./firebase";
import { EmailLog } from "../types";

const EMAIL_LOG_COLLECTION = "email_logs";

export const logEmail = async (
  recipientEmail: string,
  recipientName: string,
  trigger: string,
  subject: string,
  status: 'sent' | 'failed' = 'sent',
  error?: string
): Promise<void> => {
  const logs = await getEmailLogs();
  const newLog: EmailLog = {
    id: db.generateId(),
    recipientEmail,
    recipientName,
    trigger,
    subject,
    status,
    error,
    timestamp: Date.now(),
  };
  db.set(EMAIL_LOG_COLLECTION, [newLog, ...logs]);
};

export const getEmailLogs = async (limit?: number): Promise<EmailLog[]> => {
  const logs = db.get(EMAIL_LOG_COLLECTION) || [];
  const sorted = logs.sort((a: any, b: any) => b.timestamp - a.timestamp);
  return limit ? sorted.slice(0, limit) : sorted;
};

export const getEmailLogsByTrigger = async (trigger: string): Promise<EmailLog[]> => {
  const logs = await getEmailLogs();
  return logs.filter((log) => log.trigger === trigger);
};

export const getEmailLogsByRecipient = async (email: string): Promise<EmailLog[]> => {
  const logs = await getEmailLogs();
  return logs.filter((log) => log.recipientEmail.toLowerCase() === email.toLowerCase());
};

export const clearOldLogs = async (daysOld: number = 90): Promise<number> => {
  const logs = await getEmailLogs();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = logs.filter((log) => log.timestamp > cutoffTime);
  const deletedCount = logs.length - filtered.length;
  db.set(EMAIL_LOG_COLLECTION, filtered);
  return deletedCount;
};
