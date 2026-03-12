
export interface NavLink {
  label: string;
  path: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
  image?: string;
  colSpan?: number;
  rowSpan?: number;
}

export interface EmailTemplate {
  id: string;
  trigger: 'applicationReceived' | 'applicationApproved' | 'applicationRejected' | 'applicationWaitlisted';
  subject: string;
  body: string;
  enabled: boolean;
  variables: string[];
  createdAt: number;
  updatedAt: number;
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  trigger: string;
  subject: string;
  status: 'sent' | 'failed';
  timestamp: number;
  error?: string;
}

export interface PaymentData {
  id?: string;
  userId: string;
  eventId: string;
  registrationId: string;
  amount: number;
  currency: 'INR';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paymentMethod?: 'card' | 'netbanking' | 'wallet' | 'upi' | 'emi';
  
  // Razorpay specific fields
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  
  // Payment details
  paymentTimestamp?: number;
  refundTimestamp?: number;
  failureReason?: string;
  
  // User details
  userName: string;
  userEmail: string;
  userPhone: string;
  
  // Metadata
  createdAt: number;
  updatedAt?: number;
}

export interface EventPricing {
  isFree: boolean;
  amount: number; // in INR paise (100 paise = 1 INR)
  currency: 'INR';
  earlyBirdDiscount?: {
    enabled: boolean;
    discountPercent: number;
    validUntil: string; // ISO date string
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Stub types for PhonePe (obsolete - now using Razorpay)
// Kept for backwards compatibility with existing code
export interface PhonePePaymentRequest {
  merchantId: string;
  merchantTransactionId: string;
  amount: number;
  [key: string]: any;
}

export interface PhonePePaymentResponse {
  success: boolean;
  code: string;
  message: string;
  [key: string]: any;
}

