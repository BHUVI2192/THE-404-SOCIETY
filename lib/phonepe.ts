import CryptoJS from 'crypto-js';
import { PhonePePaymentRequest, PhonePePaymentResponse } from '../types';

// PhonePe Configuration
const PHONEPE_CONFIG = {
  merchantId: import.meta.env.VITE_PHONEPE_MERCHANT_ID || '',
  saltKey: import.meta.env.VITE_PHONEPE_SALT_KEY || '',
  saltIndex: import.meta.env.VITE_PHONEPE_SALT_INDEX || '1',
  mode: import.meta.env.VITE_PHONEPE_MODE || 'SANDBOX', // SANDBOX or PRODUCTION
  callbackUrl: import.meta.env.VITE_PHONEPE_CALLBACK_URL || `${window.location.origin}/api/payment-callback`,
  redirectUrl: import.meta.env.VITE_PHONEPE_REDIRECT_URL || `${window.location.origin}/payment-status`,
};

// Get API Base URL based on mode
const getApiBaseUrl = (): string => {
  return PHONEPE_CONFIG.mode === 'PRODUCTION'
    ? 'https://api.phonepe.com/apis/hermes'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
};

/**
 * Generate SHA256 checksum for PhonePe API requests
 * Formula: Base64(SHA256(base64Payload + endpoint + saltKey)) + ### + saltIndex
 */
export const generateChecksum = (payload: string, endpoint: string): string => {
  const stringToHash = payload + endpoint + PHONEPE_CONFIG.saltKey;
  const sha256Hash = CryptoJS.SHA256(stringToHash).toString(CryptoJS.enc.Hex);
  return `${sha256Hash}###${PHONEPE_CONFIG.saltIndex}`;
};

/**
 * Verify checksum from PhonePe callback
 */
export const verifyChecksum = (
  base64Response: string,
  receivedChecksum: string,
  endpoint: string = '/pg/v1/status'
): boolean => {
  const expectedChecksum = generateChecksum(base64Response, endpoint);
  return expectedChecksum === receivedChecksum;
};

/**
 * Generate unique merchant transaction ID
 */
export const generateMerchantTransactionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `MT_${timestamp}_${random}`;
};

/**
 * Initialize payment with PhonePe
 * @param eventId - Event ID
 * @param userId - User ID (email or unique identifier)
 * @param amount - Amount in INR (in paise, e.g., 50000 for ₹500)
 * @param userName - User's name
 * @param userPhone - User's phone number
 * @returns Payment initiation response with redirect URL
 */
export const initiatePayment = async (
  eventId: string,
  userId: string,
  amount: number, // Amount in paise (100 paise = 1 INR)
  userName: string,
  userPhone: string
): Promise<{ success: boolean; data?: any; error?: string; redirectUrl?: string }> => {
  try {
    const merchantTransactionId = generateMerchantTransactionId();
    
    // Prepare payment request payload
    const paymentRequest: PhonePePaymentRequest = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId,
      amount: amount, // Amount in paise
      merchantUserId: userId,
      redirectUrl: `${PHONEPE_CONFIG.redirectUrl}?txnId=${merchantTransactionId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: PHONEPE_CONFIG.callbackUrl,
      mobileNumber: userPhone.replace(/\D/g, ''), // Remove non-digits
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Convert to base64
    const payloadString = JSON.stringify(paymentRequest);
    const base64Payload = btoa(payloadString);
    
    // Generate checksum
    const endpoint = '/pg/v1/pay';
    const checksum = generateChecksum(base64Payload, endpoint);

    // Make API call to PhonePe
    const apiUrl = `${getApiBaseUrl()}${endpoint}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const result: PhonePePaymentResponse = await response.json();

    if (result.success && result.data) {
      // Return the payment page URL for redirection
      return {
        success: true,
        data: {
          merchantTransactionId,
          ...result.data
        },
        redirectUrl: result.data.instrumentResponse?.redirectInfo?.url || ''
      };
    } else {
      return {
        success: false,
        error: result.message || 'Payment initiation failed'
      };
    }
  } catch (error) {
    console.error('[PhonePe] Payment initiation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Check payment status
 * @param merchantTransactionId - Merchant transaction ID
 * @returns Payment status response
 */
export const checkPaymentStatus = async (
  merchantTransactionId: string
): Promise<PhonePePaymentResponse> => {
  try {
    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`;
    const checksum = generateChecksum('', endpoint);

    const apiUrl = `${getApiBaseUrl()}${endpoint}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId
      }
    });

    const result: PhonePePaymentResponse = await response.json();
    return result;
  } catch (error) {
    console.error('[PhonePe] Status check error:', error);
    return {
      success: false,
      code: 'ERROR',
      message: error instanceof Error ? error.message : 'Failed to check payment status'
    };
  }
};

/**
 * Handle PhonePe callback
 * @param callbackData - Callback data from PhonePe
 * @returns Parsed callback response
 */
export const handleCallback = (callbackData: {
  response: string;
  checksum: string;
}): { success: boolean; data?: any; error?: string } => {
  try {
    // Verify checksum
    const isValid = verifyChecksum(callbackData.response, callbackData.checksum);
    
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid checksum - possible tampering detected'
      };
    }

    // Decode base64 response
    const decodedResponse = atob(callbackData.response);
    const parsedResponse = JSON.parse(decodedResponse);

    return {
      success: true,
      data: parsedResponse
    };
  } catch (error) {
    console.error('[PhonePe] Callback handling error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process callback'
    };
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
 * Get payment method display name
 */
export const getPaymentMethodName = (type?: string): string => {
  const methods: Record<string, string> = {
    'UPI': 'UPI',
    'CARD': 'Debit/Credit Card',
    'NETBANKING': 'Net Banking',
    'WALLET': 'Wallet'
  };
  return methods[type || ''] || 'Unknown';
};

/**
 * Check if PhonePe is configured
 */
export const isPhonePeConfigured = (): boolean => {
  return !!(
    PHONEPE_CONFIG.merchantId &&
    PHONEPE_CONFIG.saltKey &&
    PHONEPE_CONFIG.saltIndex
  );
};

/**
 * Get configuration status for debugging
 */
export const getConfigStatus = () => {
  return {
    configured: isPhonePeConfigured(),
    mode: PHONEPE_CONFIG.mode,
    merchantId: PHONEPE_CONFIG.merchantId ? '***' + PHONEPE_CONFIG.merchantId.slice(-4) : 'Not set',
    apiUrl: getApiBaseUrl()
  };
};
