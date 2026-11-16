import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "./firebase";
import { PaymentData } from "../types";

const PAYMENTS_COLLECTION = "nexus_payments";

/**
 * Create a new payment record
 */
export const createPayment = async (payment: Omit<PaymentData, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const newPayment: Omit<PaymentData, 'id'> = {
      ...payment,
      createdAt: Date.now()
    };
    const docRef = await addDoc(paymentsRef, newPayment);
    return docRef.id;
  } catch (error) {
    console.error('[Payments] Error creating payment:', error);
    return null;
  }
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (paymentId: string): Promise<PaymentData | null> => {
  try {
    const docRef = doc(db, PAYMENTS_COLLECTION, paymentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PaymentData;
    }
    return null;
  } catch (error) {
    console.error('[Payments] Error getting payment by ID:', error);
    return null;
  }
};

/**
 * Get payment by Razorpay order ID
 */
export const getPaymentByOrderId = async (
  razorpayOrderId: string
): Promise<PaymentData | null> => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(
      paymentsRef,
      where("razorpayOrderId", "==", razorpayOrderId)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as PaymentData;
    }
    return null;
  } catch (error) {
    console.error('[Payments] Error getting payment by order ID:', error);
    return null;
  }
};

/**
 * Get payment by Razorpay payment ID
 */
export const getPaymentByPaymentId = async (
  razorpayPaymentId: string
): Promise<PaymentData | null> => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(
      paymentsRef,
      where("razorpayPaymentId", "==", razorpayPaymentId)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as PaymentData;
    }
    return null;
  } catch (error) {
    console.error('[Payments] Error getting payment by payment ID:', error);
    return null;
  }
};

/**
 * Get all payments for an event
 */
export const getPaymentsByEvent = async (eventId: string): Promise<PaymentData[]> => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(
      paymentsRef,
      where("eventId", "==", eventId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentData));
  } catch (error) {
    console.error('[Payments] Error getting payments by event:', error);
    return [];
  }
};

/**
 * Get all payments for a user
 */
export const getPaymentsByUser = async (userId: string): Promise<PaymentData[]> => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(
      paymentsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentData));
  } catch (error) {
    console.error('[Payments] Error getting payments by user:', error);
    return [];
  }
};

/**
 * Get payment by registration ID
 */
export const getPaymentByRegistrationId = async (
  registrationId: string
): Promise<PaymentData | null> => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(
      paymentsRef,
      where("registrationId", "==", registrationId)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as PaymentData;
    }
    return null;
  } catch (error) {
    console.error('[Payments] Error getting payment by registration ID:', error);
    return null;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentData['status'],
  additionalData?: Partial<PaymentData>
): Promise<boolean> => {
  try {
    const docRef = doc(db, PAYMENTS_COLLECTION, paymentId);
    const updateData: any = {
      status,
      updatedAt: Date.now(),
      ...additionalData
    };

    // Add timestamp for specific statuses
    if (status === 'success') {
      updateData.paymentTimestamp = Date.now();
    } else if (status === 'refunded') {
      updateData.refundTimestamp = Date.now();
    }

    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('[Payments] Error updating payment status:', error);
    return false;
  }
};

/**
 * Get all payments (for admin)
 */
export const getAllPayments = async (): Promise<PaymentData[]> => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(paymentsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentData));
  } catch (error) {
    console.error('[Payments] Error getting all payments:', error);
    return [];
  }
};

/**
 * Subscribe to payments for real-time updates (admin)
 */
export const subscribeToPayments = (callback: (payments: PaymentData[]) => void) => {
  const paymentsRef = collection(db, PAYMENTS_COLLECTION);
  const q = query(paymentsRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentData));
      callback(data);
    },
    (error) => {
      console.error('[Payments] Error subscribing to payments:', error);
      callback([]);
    }
  );
};

/**
 * Subscribe to payments for a specific event
 */
export const subscribeToEventPayments = (
  eventId: string,
  callback: (payments: PaymentData[]) => void
) => {
  const paymentsRef = collection(db, PAYMENTS_COLLECTION);
  const q = query(
    paymentsRef,
    where("eventId", "==", eventId),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentData));
      callback(data);
    },
    (error) => {
      console.error('[Payments] Error subscribing to event payments:', error);
      callback([]);
    }
  );
};

/**
 * Get payment statistics for an event
 */
export const getEventPaymentStats = async (eventId: string) => {
  try {
    const payments = await getPaymentsByEvent(eventId);
    
    const stats = {
      total: payments.length,
      successful: payments.filter(p => p.status === 'success').length,
      pending: payments.filter(p => p.status === 'pending').length,
      failed: payments.filter(p => p.status === 'failed').length,
      refunded: payments.filter(p => p.status === 'refunded').length,
      totalRevenue: payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0),
      averageAmount: 0
    };

    stats.averageAmount = stats.successful > 0 
      ? stats.totalRevenue / stats.successful 
      : 0;

    return stats;
  } catch (error) {
    console.error('[Payments] Error getting payment stats:', error);
    return {
      total: 0,
      successful: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
      totalRevenue: 0,
      averageAmount: 0
    };
  }
};

/**
 * Get overall payment statistics (admin dashboard)
 */
export const getOverallPaymentStats = async () => {
  try {
    const payments = await getAllPayments();
    
    const paymentsByMethod: Record<string, number> = {};
    payments.forEach(p => {
      const method = p.paymentMethod || 'Unknown';
      paymentsByMethod[method] = (paymentsByMethod[method] || 0) + 1;
    });

    return {
      total: payments.length,
      successful: payments.filter(p => p.status === 'success').length,
      pending: payments.filter(p => p.status === 'pending').length,
      failed: payments.filter(p => p.status === 'failed').length,
      refunded: payments.filter(p => p.status === 'refunded').length,
      totalRevenue: payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0),
      paymentsByMethod,
      recentPayments: payments.slice(0, 10)
    };
  } catch (error) {
    console.error('[Payments] Error getting overall payment stats:', error);
    return null;
  }
};

/**
 * Export payments to CSV format
 */
export const exportPaymentsToCSV = (payments: PaymentData[]): string => {
  const headers = [
    'Payment ID',
    'Order ID',
    'Razorpay Payment ID',
    'Event ID',
    'User Name',
    'User Email',
    'Amount (INR)',
    'Status',
    'Payment Method',
    'Created At',
    'Payment Timestamp'
  ];

  const rows = payments.map(p => [
    p.id || '',
    p.razorpayOrderId,
    p.razorpayPaymentId || 'N/A',
    p.eventId,
    p.userName,
    p.userEmail,
    (p.amount / 100).toFixed(2),
    p.status,
    p.paymentMethod || 'N/A',
    new Date(p.createdAt).toLocaleString(),
    p.paymentTimestamp ? new Date(p.paymentTimestamp).toLocaleString() : 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};
