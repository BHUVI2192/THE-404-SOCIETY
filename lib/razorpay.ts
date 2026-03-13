/**
 * Razorpay Payment Gateway Integration
 * Documentation: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
 */

import { createPayment } from './payments';

// Razorpay Configuration — only the public key lives in the browser bundle.
// The secret key is kept server-side in api/create-order.js.
const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  mode: import.meta.env.VITE_RAZORPAY_MODE || 'TEST', // TEST or LIVE
};

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Razorpay response structure for successful payments
 */
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

/**
 * Razorpay checkout options
 */
export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler?: (response: RazorpaySuccessResponse) => void;
}

/**
 * Create a Razorpay Order via the backend API endpoint.
 * Returns the Razorpay order ID (e.g. "order_ABC123") or null on failure.
 */
const createRazorpayOrder = async (amount: number, receipt: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'INR', receipt }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.orderId || null;
  } catch {
    return null;
  }
};

/**
 * Generate unique order/transaction ID
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `order_${timestamp}_${random}`;
};

/**
 * Check if Razorpay SDK is loaded
 */
export const isRazorpayLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined';
};

/**
 * Wait for Razorpay SDK to load
 */
export const waitForRazorpay = (timeout = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isRazorpayLoaded()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Initialize Razorpay payment checkout
 * @param options - Payment configuration
 * @returns Promise with payment initialization status
 */
export const initiatePayment = async (
  eventId: string,
  eventTitle: string,
  registrationId: string,
  amount: number, // Amount in paise (100 paise = 1 INR)
  userDetails: {
    name: string;
    email: string;
    phone: string;
  },
  onSuccess: (response: RazorpaySuccessResponse) => void,
  onFailure: (error: any) => void
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if Razorpay is loaded
    const loaded = await waitForRazorpay();
    if (!loaded) {
      return {
        success: false,
        error: 'Razorpay SDK not loaded. Please refresh the page.',
      };
    }

    // Generate unique reference ID for internal Firestore tracking
    const referenceId = generateOrderId();

    // Create a real Razorpay Order via the backend — this enables UPI, QR, and all payment methods
    const razorpayOrderId = await createRazorpayOrder(amount, referenceId);

    // Create payment record in Firestore first
    const paymentRecordId = await createPayment({
      userId: userDetails.email, // Using email as user identifier
      eventId: eventId,
      registrationId: registrationId,
      amount: amount,
      currency: 'INR',
      status: 'pending',
      razorpayOrderId: razorpayOrderId || referenceId,
      userName: userDetails.name,
      userEmail: userDetails.email,
      userPhone: userDetails.phone,
    });

    if (!paymentRecordId) {
      return {
        success: false,
        error: 'Failed to create payment record',
      };
    }

    // Razorpay options (without order_id for test mode)
    const options: RazorpayOptions = {
      key: RAZORPAY_CONFIG.keyId,
      amount: amount, // Amount in paise
      currency: 'INR',
      name: 'The 404 Society',
      description: `Registration for ${eventTitle}`,
      // image: '/logo.png', // Commented out - causes CORS issues in localhost
      ...(razorpayOrderId && { order_id: razorpayOrderId }),
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      notes: {
        eventId: eventId,
        registrationId: registrationId,
        eventTitle: eventTitle,
        paymentRecordId: paymentRecordId,
      },
      theme: {
        color: '#000000', // Black theme for 404 Society
      },
      handler: function (response: RazorpaySuccessResponse) {
        // Payment successful
        onSuccess({
          ...response,
          razorpay_order_id: response.razorpay_order_id || razorpayOrderId || referenceId,
        });
      },
      modal: {
        ondismiss: function () {
          // User closed the payment modal
          onFailure({ 
            description: 'Payment cancelled by user',
            code: 'PAYMENT_CANCELLED'
          });
        },
      },
    };

    // Create Razorpay instance and open checkout
    const razorpayInstance = new window.Razorpay(options);
    
    // Handle payment failure
    razorpayInstance.on('payment.failed', function (response: any) {
      onFailure(response.error);
    });

    // Open checkout
    razorpayInstance.open();

    return { success: true };
  } catch (error) {
    console.error('[Razorpay] Payment initiation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate payment',
    };
  }
};

/**
 * Verify payment signature (should be done on backend for security)
 * This is a client-side verification for testing only
 */
export const verifyPaymentSignature = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  try {
    // In production, this should be done on the backend
    // For now, we'll just return true if we have all required fields
    return !!(orderId && paymentId && signature);
  } catch (error) {
    console.error('[Razorpay] Signature verification error:', error);
    return false;
  }
};

/**
 * Format amount from INR to paise
 */
export const convertToPaise = (amountInRupees: number): number => {
  return Math.round(amountInRupees * 100);
};

/**
 * Format amount from paise to INR
 */
export const convertToRupees = (amountInPaise: number): number => {
  return amountInPaise / 100;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amountInPaise: number): string => {
  const rupees = convertToRupees(amountInPaise);
  return `₹${rupees.toLocaleString('en-IN', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  })}`;
};

/**
 * Get payment method display name
 */
export const getPaymentMethodName = (method?: string): string => {
  const methods: Record<string, string> = {
    card: 'Debit/Credit Card',
    netbanking: 'Net Banking',
    wallet: 'Wallet',
    upi: 'UPI',
    emi: 'EMI',
  };
  return methods[method?.toLowerCase() || ''] || 'Unknown';
};

/**
 * Check if Razorpay is configured
 */
export const isRazorpayConfigured = (): boolean => {
  return !!RAZORPAY_CONFIG.keyId;
};

/**
 * Get configuration status for debugging
 */
export const getConfigStatus = () => {
  return {
    configured: isRazorpayConfigured(),
    mode: RAZORPAY_CONFIG.mode,
    keyId: RAZORPAY_CONFIG.keyId ? '***' + RAZORPAY_CONFIG.keyId.slice(-4) : 'Not set',
    sdkLoaded: isRazorpayLoaded(),
  };
};

/**
 * Load Razorpay script dynamically if not already loaded
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Create a test payment for development
 */
export const createTestPayment = async (
  amount: number = 100 // Default ₹1 for testing
) => {
  console.log('[Razorpay] Creating test payment for ₹', amount / 100);
  
  return initiatePayment(
    'test_event_id',
    'Test Event',
    'test_registration_id',
    amount,
    {
      name: 'Test User',
      email: 'test@example.com',
      phone: '9999999999',
    },
    (response) => {
      console.log('[Razorpay] Test payment successful:', response);
      alert('Test payment successful!\nPayment ID: ' + response.razorpay_payment_id);
    },
    (error) => {
      console.error('[Razorpay] Test payment failed:', error);
      alert('Test payment failed: ' + (error.description || error.message || 'Unknown error'));
    }
  );
};

// Export configuration
export const RAZORPAY_KEY_ID = RAZORPAY_CONFIG.keyId;
export const RAZORPAY_MODE = RAZORPAY_CONFIG.mode;
