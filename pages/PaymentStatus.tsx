import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Download, Mail, Calendar, MapPin, CreditCard, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import confetti from 'canvas-confetti';
import { updatePaymentStatus } from '../lib/payments';
import { updateRegistrationPayment } from '../lib/registrations';
import { getEventById, EventData } from '../lib/events';
import { sendEventConfirm } from '../lib/emailService';

interface PaymentStatusState {
  status: 'success' | 'failed' | 'pending';
  registrationId: string;
  paymentId?: string;
  orderId?: string;
  error?: string;
  eventTitle: string;
  registrationData?: {
    name: string;
    email: string;
    phone: string;
    college?: string;
    year?: string;
  };
}

const PaymentStatus: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentStatusState;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingRecords, setUpdatingRecords] = useState(false);

  useEffect(() => {
    const loadEventAndUpdateRecords = async () => {
      if (!eventId || !state) {
        navigate('/events');
        return;
      }

      try {
        // Load event details
        const eventData = await getEventById(eventId);
        if (eventData) {
          setEvent(eventData);
        }

        // If payment succeeded, update records
        if (state.status === 'success' && state.paymentId && state.orderId && !updatingRecords) {
          setUpdatingRecords(true);
          
          try {
            // First, get the payment record by order ID
            const { getPaymentByOrderId } = await import('../lib/payments');
            const paymentRecord = await getPaymentByOrderId(state.orderId);
            
            if (paymentRecord && paymentRecord.id) {
              // Update payment status
              await updatePaymentStatus(paymentRecord.id, 'success', {
                razorpayPaymentId: state.paymentId,
              });

              // Update registration with payment info
              await updateRegistrationPayment(
                state.registrationId,
                'completed',
                state.paymentId,
                eventData?.pricing?.amount || 0
              );

              // Send confirmation email to the registrant
              if (state.registrationData?.name && state.registrationData?.email) {
                try {
                  await sendEventConfirm({
                    name: state.registrationData.name,
                    email: state.registrationData.email,
                    eventTitle: state.eventTitle,
                    eventDate: eventData?.date || '',
                    eventLocation: eventData?.location || 'TBA',
                  });
                } catch (emailError) {
                  console.error('Failed to send confirmation email:', emailError);
                  // Don't block the UI for email failures
                }
              }

              console.log('Payment and registration records updated successfully');
            } else {
              console.warn('Payment record not found for order ID:', state.orderId);
            }
          } catch (error) {
            console.error('Error updating records:', error);
            // Don't block the UI, just log the error
          } finally {
            setUpdatingRecords(false);
          }
        }
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEventAndUpdateRecords();
  }, [eventId, state, navigate, updatingRecords]);

  // Trigger confetti on success
  useEffect(() => {
    if (state?.status === 'success' && !loading) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#000000', '#ffffff', '#666666'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#000000', '#ffffff', '#666666'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [state?.status, loading]);

  const handleDownloadReceipt = () => {
    // Generate receipt content
    const receiptContent = `
THE 404 SOCIETY
Payment Receipt

Event: ${state.eventTitle}
Registration ID: ${state.registrationId}
Payment ID: ${state.paymentId}
Order ID: ${state.orderId}
Status: Payment Successful
Date: ${new Date().toLocaleString()}

Thank you for registering!
    `.trim();

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${state.registrationId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Manrope', sans-serif" }}>
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Manrope', sans-serif" }}>
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Invalid payment session</p>
          <button
            onClick={() => navigate('/events')}
            className="border-2 border-black px-6 py-2 font-bold uppercase hover:bg-black hover:text-white transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment {state.status === 'success' ? 'Successful' : 'Status'} | The 404 Society</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        className="min-h-screen bg-white text-black flex items-center justify-center"
        style={{
          fontFamily: "'Manrope', sans-serif",
          padding: '40px 20px',
        }}
      >
        <div className="max-w-2xl w-full">
          {/* Success State */}
          {state.status === 'success' && (
            <div className="border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-white p-8 md:p-12">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center border-4 border-black">
                  <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              </div>

              {/* Success Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                  Payment Successful!
                </h1>
                <p className="text-lg text-gray-700">
                  Your registration for <strong>{state.eventTitle}</strong> is confirmed.
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 border-2 border-black p-6 mb-6">
                <div className="grid gap-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b-2 border-dashed border-gray-300">
                    <span className="font-medium text-gray-600">Registration ID</span>
                    <span className="font-mono font-bold">{state.registrationId}</span>
                  </div>
                  {state.paymentId && (
                    <div className="flex justify-between items-center pb-3 border-b-2 border-dashed border-gray-300">
                      <span className="font-medium text-gray-600">Payment ID</span>
                      <span className="font-mono font-bold">{state.paymentId}</span>
                    </div>
                  )}
                  {state.orderId && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Order ID</span>
                      <span className="font-mono font-bold">{state.orderId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Details */}
              {event && (
                <div className="border-2 border-black p-6 mb-6">
                  <h2 className="text-xl font-black uppercase tracking-tight mb-4">
                    Event Details
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="font-medium">{event.location}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Notice */}
              <div className="bg-blue-50 border-2 border-blue-500 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <div className="font-bold mb-1">Confirmation Email Sent</div>
                    <div>
                      A confirmation email with your registration details and receipt has been sent to your email address.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadReceipt}
                  className="flex-1 border-4 border-black bg-white font-black uppercase tracking-[0.1em] py-4 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Receipt
                </button>
                <button
                  onClick={() => navigate('/events')}
                  className="flex-1 border-4 border-black bg-black text-white font-black uppercase tracking-[0.1em] py-4 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Back to Events
                </button>
              </div>
            </div>
          )}

          {/* Failed State */}
          {state.status === 'failed' && (
            <div className="border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-white p-8 md:p-12">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center border-4 border-black">
                  <XCircle className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              </div>

              {/* Error Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                  Payment Failed
                </h1>
                <p className="text-lg text-gray-700">
                  We couldn't process your payment for <strong>{state.eventTitle}</strong>.
                </p>
              </div>

              {/* Error Details */}
              {state.error && (
                <div className="bg-red-50 border-2 border-red-500 p-6 mb-6">
                  <div className="text-sm">
                    <div className="font-bold text-red-800 mb-2">Error Details:</div>
                    <div className="text-red-700">{state.error}</div>
                  </div>
                </div>
              )}

              {/* Registration Info */}
              <div className="bg-gray-50 border-2 border-black p-6 mb-6">
                <div className="text-sm">
                  <div className="font-medium text-gray-600 mb-2">Registration ID</div>
                  <div className="font-mono font-bold">{state.registrationId}</div>
                  <div className="text-gray-600 mt-3">
                    Your registration is saved as pending. You can retry the payment using the button below.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(`/events/${eventId}/register`)}
                  className="flex-1 border-4 border-black bg-black text-white font-black uppercase tracking-[0.1em] py-4 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/events')}
                  className="flex-1 border-4 border-black bg-white font-black uppercase tracking-[0.1em] py-4 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Back to Events
                </button>
              </div>
            </div>
          )}

          {/* Pending State */}
          {state.status === 'pending' && (
            <div className="border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-white p-8 md:p-12">
              {/* Pending Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center border-4 border-black">
                  <Loader2 className="w-12 h-12 text-white animate-spin" strokeWidth={3} />
                </div>
              </div>

              {/* Pending Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                  Payment Pending
                </h1>
                <p className="text-lg text-gray-700">
                  Your payment for <strong>{state.eventTitle}</strong> is being processed.
                </p>
              </div>

              {/* Pending Details */}
              <div className="bg-yellow-50 border-2 border-yellow-500 p-6 mb-6">
                <div className="text-sm text-yellow-900">
                  <div className="font-bold mb-2">What's happening?</div>
                  <div className="space-y-2">
                    <p>Your payment is currently being verified with the payment gateway.</p>
                    <p>This usually takes a few moments. You can check back in a few minutes.</p>
                  </div>
                </div>
              </div>

              {/* Registration Info */}
              <div className="bg-gray-50 border-2 border-black p-6 mb-6">
                <div className="text-sm">
                  <div className="font-medium text-gray-600 mb-2">Registration ID</div>
                  <div className="font-mono font-bold">{state.registrationId}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 border-4 border-black bg-black text-white font-black uppercase tracking-[0.1em] py-4 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
                >
                  Check Status
                </button>
                <button
                  onClick={() => navigate('/events')}
                  className="flex-1 border-4 border-black bg-white font-black uppercase tracking-[0.1em] py-4 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Back to Events
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentStatus;
