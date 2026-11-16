import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getEventById, EventData, getEffectivePrice, isEventFree } from '../lib/events';
import { initiatePayment } from '../lib/razorpay';
import { Loader2, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface PaymentPageState {
  registrationId: string;
  registrationData: {
    name: string;
    email: string;
    phone: string;
    college?: string;
    year?: string;
  };
}

const Payment: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentPageState;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        navigate('/events');
        return;
      }

      // Validate that we have registration state
      if (!state || !state.registrationId || !state.registrationData) {
        alert('Invalid payment session. Please register again.');
        navigate(`/events/${eventId}/register`);
        return;
      }

      try {
        const eventData = await getEventById(eventId);
        if (!eventData) {
          alert('Event not found');
          navigate('/events');
          return;
        }

        // Check if event is actually paid
        if (isEventFree(eventData)) {
          // Free event, shouldn't be on payment page
          navigate('/events');
          return;
        }

        setEvent(eventData);
      } catch (error) {
        console.error('Error loading event:', error);
        alert('Failed to load event details');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, navigate, state]);

  const handlePayment = async () => {
    if (!event || !state || !agreedToTerms) return;

    setProcessing(true);

    try {
      const effectivePrice = getEffectivePrice(event);
      const amountInPaise = effectivePrice * 100; // Convert rupees to paise
      
      await initiatePayment(
        event.id,
        event.title,
        state.registrationId,
        amountInPaise,
        {
          name: state.registrationData.name,
          email: state.registrationData.email,
          phone: state.registrationData.phone,
        },
        (response) => {
          // Navigate to success page
          navigate(`/events/${eventId}/payment-status`, {
            state: {
              status: 'success',
              registrationId: state.registrationId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              eventTitle: event.title,
              registrationData: state.registrationData,
            },
          });
        },
        (error) => {
          // Navigate to failure page
          navigate(`/events/${eventId}/payment-status`, {
            state: {
              status: 'failed',
              registrationId: state.registrationId,
              error: error.description || 'Payment failed',
              eventTitle: event.title,
              registrationData: state.registrationData,
            },
          });
        }
      );
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Manrope', sans-serif" }}>
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  // Validate state before rendering
  if (!state || !state.registrationData) {
    return null; // Will be redirected by useEffect
  }

  if (!event) return null;

  const basePrice = event.pricing?.amount || 0;
  const effectivePrice = getEffectivePrice(event);
  const hasEarlyBirdDiscount = effectivePrice < basePrice;
  const discountAmount = basePrice - effectivePrice;
  const discountPercent = event.pricing?.earlyBirdDiscount?.discountPercent || 0;

  return (
    <>
      <Helmet>
        <title>Payment - {event.title} | The 404 Society</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        className="min-h-screen bg-white text-black"
        style={{ fontFamily: "'Manrope', sans-serif", paddingTop: '80px', paddingBottom: '64px' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

          {/* Back button */}
          <button
            onClick={() => navigate('/events')}
            className="text-sm font-bold uppercase tracking-[0.2em] text-black hover:text-gray-500 transition-colors flex items-center gap-3 mb-10"
          >
            <span className="text-xl leading-none">←</span> Back to Events
          </button>

          {/* Page title */}
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Complete Your Registration</p>
            <h1
              className="font-black uppercase tracking-tighter text-black leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              {event.title}
            </h1>
          </div>

          <div className="grid md:grid-cols-5 gap-8">

            {/* LEFT — Event + Registrant info (3 cols) */}
            <div className="md:col-span-3 space-y-6">

              {/* Event info */}
              <div style={{ border: '3px solid #000' }}>
                {event.img && (
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full object-cover"
                    style={{ height: '200px', display: 'block' }}
                  />
                )}
                <div className="p-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Date</p>
                    <p className="font-bold">{event.date}{event.year ? `, ${event.year}` : ''}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Venue</p>
                    <p className="font-bold">{event.location}</p>
                  </div>
                </div>
              </div>

              {/* Registrant details */}
              <div style={{ border: '3px solid #000' }}>
                <div className="px-5 py-3 border-b-2 border-black bg-gray-50">
                  <p className="text-xs font-black uppercase tracking-[0.25em]">Registrant Details</p>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Name</p>
                    <p className="font-bold">{state.registrationData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                    <p className="font-bold break-all">{state.registrationData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                    <p className="font-bold">{state.registrationData.phone}</p>
                  </div>
                  {state.registrationData.year && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Year</p>
                      <p className="font-bold">{state.registrationData.year}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT — Payment summary (2 cols, sticky) */}
            <div className="md:col-span-2">
              <div className="sticky" style={{ top: '24px', border: '3px solid #000', boxShadow: '6px 6px 0 0 #000' }}>

                {/* Header */}
                <div className="bg-black px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-white">Payment Summary</p>
                </div>

                <div className="p-5 bg-white">
                  {/* Price breakdown */}
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Registration Fee</span>
                      <span className="font-bold">₹{basePrice.toFixed(2)}</span>
                    </div>
                    {hasEarlyBirdDiscount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700 font-medium flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" /> Early Bird ({discountPercent}%)
                        </span>
                        <span className="font-bold text-green-700">−₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-4" style={{ borderTop: '3px solid #000' }}>
                      <span className="font-black uppercase tracking-tight text-base">Total</span>
                      <span className="text-3xl font-black">₹{effectivePrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Reg ID */}
                  <div className="bg-gray-50 border border-gray-200 px-3 py-2.5 mb-5">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Registration ID</p>
                    <p className="text-xs font-mono font-bold break-all">{state.registrationId}</p>
                  </div>

                  {/* Terms checkbox */}
                  <label className="flex items-start gap-3 mb-5 cursor-pointer">
                    <div className="relative mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className="w-5 h-5 border-2 border-black flex items-center justify-center"
                        style={{ background: agreedToTerms ? '#000' : '#fff' }}
                      >
                        {agreedToTerms && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the terms &amp; conditions. Payments are non-refundable unless the event is cancelled.
                    </span>
                  </label>

                  {/* Pay button */}
                  <button
                    onClick={handlePayment}
                    disabled={!agreedToTerms || processing}
                    className="w-full font-black uppercase tracking-[0.12em] py-4 text-sm transition-colors"
                    style={{
                      border: '3px solid #000',
                      background: !agreedToTerms || processing ? '#e5e5e5' : '#000',
                      color: !agreedToTerms || processing ? '#999' : '#fff',
                      cursor: !agreedToTerms || processing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                      </span>
                    ) : (
                      `Pay ₹${effectivePrice.toFixed(2)}`
                    )}
                  </button>

                  <p className="mt-4 text-xs text-gray-400 text-center">Secured by Razorpay · 256-bit SSL</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
