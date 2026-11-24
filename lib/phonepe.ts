/**
 * lib/phonepe.ts — Secure Client-side Payment Service
 * 
 * NOTE: Checksum calculations and merchant secrets are handled on the server (/api/phonepe)
 * to avoid exposing merchant salt keys in the client-side JavaScript bundle.
 */
import { PhonePePaymentResponse } from '../types';

export const generateMerchantTransactionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `MT_${timestamp}_${random}`;
};

/**
 * Initialize payment with PhonePe via serverless backend API
 */
export const initiatePayment = async (
  eventId: string,
  userId: string,
  amount: number, // in paise (e.g. 50000 = ₹500)
  userName: string,
  userPhone: string
): Promise<{ success: boolean; data?: any; error?: string; redirectUrl?: string }> => {
  try {
    const merchantTransactionId = generateMerchantTransactionId();

    const response = await fetch('/api/phonepe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'initiate',
        payload: {
          transactionId: merchantTransactionId,
          amount,
          userId,
          eventId,
          userName,
          userPhone: userPhone.replace(/\D/g, ''),
          redirectUrl: `${window.location.origin}/#/payment-status`,
        },
      }),
    });

    const result = await response.json();

    if (result.success && result.data) {
      return {
        success: true,
        data: {
          merchantTransactionId,
          ...result.data,
        },
        redirectUrl: result.data.instrumentResponse?.redirectInfo?.url || '',
      };
    } else {
      return {
        success: false,
        error: result.message || result.error || 'Payment initiation failed',
      };
    }
  } catch (error) {
    console.error('[PhonePe] Payment initiation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment connection failed',
    };
  }
};

/**
 * Check payment status via serverless backend API
 */
export const checkPaymentStatus = async (
  merchantTransactionId: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch('/api/phonepe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'status',
        payload: {
          transactionId: merchantTransactionId,
        },
      }),
    });

    const result = await response.json();
    return {
      success: result.code === 'PAYMENT_SUCCESS',
      data: result.data,
      error: result.message,
    };
  } catch (error) {
    console.error('[PhonePe] Check status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Status check failed',
    };
  }
};
