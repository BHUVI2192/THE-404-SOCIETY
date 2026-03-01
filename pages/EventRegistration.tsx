
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { getEventById, EventData } from '../lib/events';
import { saveRegistration } from '../lib/registrations';
import { Loader2, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Helmet } from 'react-helmet-async';

import './EventRegistration.css';

gsap.registerPlugin(ScrollTrigger);

// =============================================================================
// HELPERS
// =============================================================================
const importGoogleFont = () => {
  if (!document.querySelector('[data-font="manrope"]')) {
    const link = document.createElement('link');
    link.setAttribute('data-font', 'manrope');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800;900&display=swap';
    document.head.appendChild(link);
  }
};

// =============================================================================
// PART 3: BRUTALIST LOCKED PAGE — clean modern design
// =============================================================================
const LockedPage: React.FC<{ eventTitle: string; eventCategory?: string }> = ({ eventTitle, eventCategory }) => {
  React.useEffect(() => { importGoogleFont(); }, []);
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full overflow-hidden bg-white flex flex-col items-center justify-center font-sans"
      style={{ fontFamily: "'Manrope', sans-serif", minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px' }}
    >
      {/* LAYER 1: BACKGROUND WATERMARK */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0"
        style={{ overflow: 'hidden' }}
      >
        <h1
          className="font-black tracking-tighter text-gray-100 select-none leading-none"
          style={{ fontSize: '25vw' }}
          aria-hidden="true"
        >
          CLOSED
        </h1>
      </div>

      {/* BACK BUTTON */}
      <div className="w-[90%] max-w-4xl mb-6 z-10 relative">
        <button
          onClick={() => { window.scrollTo(0, 0); navigate('/events', { replace: true }); }}
          className="text-sm font-bold uppercase tracking-[0.2em] text-black hover:text-gray-500 transition-colors flex items-center gap-3"
        >
          <span className="text-xl leading-none">←</span> Back to The Sessions
        </button>
      </div>

      {/* BRUTALIST PLACARD — guaranteed border + shadow via inline styles */}
      <div
        className="relative z-10 flex flex-col items-center text-center bg-white"
        style={{
          width: '90%',
          maxWidth: '900px',
          padding: 'clamp(32px, 6vw, 80px) clamp(24px, 5vw, 64px)',
          border: '4px solid #000',
          boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
        }}
      >
        {/* Badge */}
        <div style={{ border: '2px solid #000', padding: '6px 24px', marginBottom: '32px', display: 'inline-block' }}>
          <span className="text-xs font-black uppercase" style={{ letterSpacing: '0.3em' }}>Registration Closed</span>
        </div>

        {/* Event title */}
        <h2
          className="font-black uppercase tracking-tighter text-black leading-none mb-4"
          style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
        >
          {eventTitle}
        </h2>

        {/* Category */}
        {eventCategory && (
          <h3 className="text-lg font-bold uppercase tracking-widest text-gray-400 mb-8">
            {eventCategory}
          </h3>
        )}

        {/* Description */}
        <p className="text-base font-medium text-gray-700 leading-relaxed mb-12" style={{ maxWidth: '560px' }}>
          The intake sequence for this session has officially concluded.
          Access is currently restricted. If you require special accommodation, please reach out to the lead coordinators.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            onClick={() => { window.scrollTo(0, 0); navigate('/events', { replace: true }); }}
            className="w-full sm:w-auto font-black uppercase text-black transition-colors hover:bg-gray-100"
            style={{ padding: '18px 48px', border: '4px solid #000', letterSpacing: '0.15em', fontSize: '0.9rem' }}
          >
            Return
          </button>
          <a
            href="mailto:connect@the404society.in"
            className="w-full sm:w-auto font-black uppercase text-white transition-colors text-center hover:bg-gray-900"
            style={{ padding: '18px 48px', border: '4px solid #000', background: '#000', letterSpacing: '0.15em', fontSize: '0.9rem' }}
          >
            Contact Admin
          </a>
        </div>
      </div>
    </div>
  );
};


// =============================================================================
// PART 2: HORIZONTAL TICKET TEAR — modern clean design
// =============================================================================
interface TicketFormProps {
  event: EventData;
}

const TicketForm: React.FC<TicketFormProps> = ({ event }) => {
  React.useEffect(() => { importGoogleFont(); }, []);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    branch: '',
    year: '',
    teamName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const ticketLeftRef = useRef<HTMLDivElement>(null);
  const ticketRightRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const confirmationSectionRef = useRef<HTMLDivElement>(null);

  const posterImage =
    event.img ||
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // useRef flag — no state change = no React re-render during GSAP
  const hasAnimated = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    setIsSubmitting(true);

    try {
      // 1. Save to Firebase
      await saveRegistration({
        eventId: event.id || '',
        eventTitle: event.title,
        ...formData
      });

      // 2. Send Email via EmailJS
      const templateParams = {
        to_name: formData.name,
        to_email: formData.email,
        event_name: event.title,
        event_date: event.date,
        event_time: '10:00 AM', // Or dynamic if added later
        event_location: event.location || 'Lab 404, PESITM',
        student_id: formData.studentId,
        branch: formData.branch,
        year: formData.year,
        phone: formData.phone,
        team_name: formData.teamName || 'N/A'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_EVENT_REGISTRATION_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_APPLICATION_RECEIVED_ID, // fallback
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setIsSuccess(true);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Something went wrong with the registration. Please try again.");
      setIsSubmitting(false);
      hasAnimated.current = false; // Allow retry
      return; // Stop animation if failed
    }

    const isMobile = window.innerWidth < 768;

    // Tear sound
    try { new Audio('/tear.mp3').play(); } catch (_) { }

    const tl = gsap.timeline();

    if (isMobile) {
      // Mobile: right falls downward, left slides to center
      tl.to(ticketRightRef.current, {
        transformOrigin: 'top center',
        rotateZ: 3,
        duration: 0.12,
        ease: 'power1.inOut',
      })
        .to(ticketRightRef.current, {
          y: window.innerHeight + 400,
          x: 20,
          rotateZ: 8,
          opacity: 0,
          duration: 1.0,
          ease: 'power3.in',
        }, 0)
        // Left piece slides to center
        .to(ticketLeftRef.current, {
          x: window.innerWidth / 2 - (window.innerWidth * 0.45),
          duration: 1.0,
          ease: 'power2.inOut',
        }, 0)
        .add(() => { try { new Audio('/stamp.mp3').play(); } catch (_) { } }, 0.7)
        .fromTo(
          stampRef.current,
          { scale: 5, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, rotation: -15, duration: 0.5, ease: 'back.out(2)' },
          0.7
        )
        .add(() => {
          // Auto-scroll to confirmation section
          setTimeout(() => {
            confirmationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        });
    } else {
      // Desktop: right rips & falls to the side, left slides to center
      tl.to(ticketRightRef.current, {
        transformOrigin: 'top left',
        rotateZ: 8,
        duration: 0.15,
        ease: 'power1.inOut',
      })
        .to(ticketRightRef.current, {
          y: window.innerHeight + 500,
          x: 200,
          rotateZ: 35,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.in',
        }, 0)
        // Left piece slides to center
        .to(ticketLeftRef.current, {
          x: window.innerWidth / 2 - (window.innerWidth * 0.45),
          duration: 1.2,
          ease: 'power2.inOut',
        }, 0)
        .add(() => { try { new Audio('/stamp.mp3').play(); } catch (_) { } }, 0.8)
        .fromTo(
          stampRef.current,
          { scale: 5, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, rotation: -15, duration: 0.5, ease: 'back.out(2)' },
          0.8
        )
        .add(() => {
          // Auto-scroll to confirmation section
          setTimeout(() => {
            confirmationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>Register: {event.title} | The 404 Society</title>
        <meta name="description" content={`Register for ${event.title} hosted by The 404 Society.`} />
        <meta property="og:title" content={`Register: ${event.title} | The 404 Society`} />
        {event.img && <meta property="og:image" content={event.img} />}
      </Helmet>
      <div
        className="bg-white flex flex-col relative"
        style={{ fontFamily: "'Manrope', sans-serif", minHeight: '100vh', paddingTop: '80px' }}
      >
        {/* Back link */}
        <div className="flex items-center px-5 py-4 border-b border-gray-200 shrink-0">
          <button
            onClick={() => { window.scrollTo(0, 0); navigate('/events', { replace: true }); }}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Events
          </button>
        </div>

        {/* Centering wrapper */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:px-6" style={{ minHeight: 0 }}>

          {/* TWO-PIECE TICKET — stacks vertically on mobile, horizontal on desktop */}
          <div
            className="ticket-wrapper relative flex flex-col md:flex-row w-full"
            style={{ maxWidth: '1000px' }}
          >

            {/* LEFT HALF — event details */}
            <div
              ref={ticketLeftRef}
              className="ticket-left-half relative flex flex-col justify-between bg-black text-white overflow-hidden z-10"
              style={{
                padding: 'clamp(16px, 4vw, 32px) clamp(16px, 4vw, 36px)',
              }}
            >
              {/* Poster image overlay */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${posterImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  opacity: 0.15, pointerEvents: 'none',
                }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold opacity-50">The 404 Society</span>
                  <span className="text-xs font-semibold opacity-30">EST. 2025</span>
                </div>
                <div className="inline-block border border-white/30 px-3 py-1 mb-3">
                  <span className="text-xs font-semibold text-white/60">{event.category}</span>
                </div>
                <h1
                  className="font-black uppercase tracking-tighter leading-none mb-4"
                  style={{ fontSize: 'clamp(1.6rem, 5vw, 2.8rem)' }}
                >
                  {event.title}
                </h1>
                <p
                  className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: event.description?.replace(/\n/g, '<br/>') || "" }}
                />
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 border-t border-white/20 pt-3 mt-3">
                {[
                  { label: 'Date', value: event.date },
                  { label: 'Time', value: '10:00 AM' },
                  { label: 'Venue', value: event.location || 'Lab 404, PESITM' },
                  { label: 'Format', value: 'In Person' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold opacity-40 mb-0.5">{label}</p>
                    <p className="text-xs font-bold leading-tight">{value}</p>
                  </div>
                ))}
              </div>

              {/* Perforation — bottom on mobile, right on desktop */}
              <div
                className="absolute bottom-0 left-0 right-0 md:bottom-auto md:right-0 md:top-0 md:left-auto"
                style={{
                  height: '4px',
                  borderBottom: '4px dashed #9ca3af',
                  transform: 'translateY(2px)',
                  zIndex: 20,
                }}
              />
              {/* Desktop-only vertical perforation */}
              <div
                className="hidden md:block absolute right-0 top-0 bottom-0 z-20"
                style={{ borderRight: '4px dashed #9ca3af', transform: 'translateX(2px)' }}
              />

              {/* APPROVED STAMP */}
              <div
                ref={stampRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none invisible"
                style={{ zIndex: 50 }}
              >
                <div
                  style={{
                    border: '8px solid #22c55e',
                    padding: '12px 28px',
                    transform: 'rotate(-15deg)',
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <span
                    className="font-black uppercase block"
                    style={{ fontSize: 'clamp(1.8rem, 6vw, 4rem)', letterSpacing: '0.08em', color: '#22c55e', whiteSpace: 'nowrap' }}
                  >
                    APPROVED
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT HALF — registration form, the piece that falls */}
            <div
              ref={ticketRightRef}
              className="ticket-right-half relative flex flex-col justify-center bg-white text-black z-30"
              style={{
                padding: 'clamp(20px, 5vw, 32px) clamp(20px, 5vw, 36px)',
                transformOrigin: 'top left',
              }}
            >
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Registration</p>
                <h2
                  className="font-black uppercase tracking-tighter leading-tight border-b-4 border-black pb-3"
                  style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}
                >
                  Secure Your Seat
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Full Name</label>
                    <input
                      type="text" name="name"
                      value={formData.name} onChange={handleChange}
                      required
                      className="w-full border-2 md:border-4 border-black p-2 md:p-2.5 text-xs md:text-sm font-bold outline-none focus:bg-gray-50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Email Address</label>
                    <input
                      type="email" name="email"
                      value={formData.email} onChange={handleChange}
                      required
                      pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                      title="Please enter a valid email address containing @"
                      className="w-full border-2 md:border-4 border-black p-2 md:p-2.5 text-xs md:text-sm font-bold outline-none focus:bg-gray-50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Student ID/USN</label>
                    <input
                      type="text" name="studentId"
                      value={formData.studentId} onChange={handleChange}
                      required
                      className="w-full border-2 md:border-4 border-black p-2 md:p-2.5 text-xs md:text-sm font-bold outline-none focus:bg-gray-50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Phone (WhatsApp)</label>
                    <input
                      type="tel" name="phone"
                      value={formData.phone} onChange={handleChange}
                      required
                      pattern="^[0-9]{10}$"
                      maxLength={10}
                      title="Phone number must be exactly 10 digits"
                      className="w-full border-2 md:border-4 border-black p-2 md:p-2.5 text-xs md:text-sm font-bold outline-none focus:bg-gray-50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Branch</label>
                    <input
                      type="text" name="branch"
                      value={formData.branch} onChange={handleChange}
                      required
                      placeholder="e.g. CSE, ISE, ECE"
                      className="w-full border-2 md:border-4 border-black p-2 md:p-2.5 text-xs md:text-sm font-bold outline-none focus:bg-gray-50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Year of Study</label>
                    <select
                      name="year"
                      value={formData.year} onChange={handleChange as any}
                      required
                      className="w-full border-2 md:border-4 border-black p-2 md:p-2.5 text-xs md:text-sm font-bold outline-none focus:bg-gray-50 transition-colors bg-white"
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Team Name (Optional)</label>
                  <input
                    type="text" name="teamName"
                    value={formData.teamName} onChange={handleChange}
                    placeholder="Leave blank if registering solo"
                    className="w-full border-2 md:border-4 border-black p-2 md:p-2.5 text-xs md:text-sm font-bold outline-none focus:bg-gray-50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Complete Registration"}
                </button>
              </form>

              <p className="mt-2 text-xs text-gray-400">Confirmation will be sent to your email.</p>
            </div>

          </div>
        </div>

        {/* Success Confirmation Section */}
        {isSuccess && (
          <div
            ref={confirmationSectionRef}
            className="w-full flex items-center justify-center px-4 md:px-8 py-24 md:py-32 bg-gradient-to-b from-white to-neutral-50"
          >
            <div
              className="max-w-3xl w-full text-center p-12 md:p-16 border-4 border-black bg-white shadow-lg"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <h2
                className="font-black uppercase tracking-tighter mb-8 text-black leading-tight"
                style={{ fontSize: 'clamp(2.2rem, 7vw, 3.5rem)' }}
              >
                Event Registration is{' '}
                <span style={{ color: '#22c55e' }}>Confirmed</span>
              </h2>

              <div className="w-16 h-1 bg-black mx-auto mb-8" />

              <p
                className="text-base md:text-lg font-medium text-neutral-700 mb-6 leading-relaxed"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Your seat has been successfully reserved for
              </p>

              <h3
                className="text-2xl md:text-3xl font-black text-black mb-8 tracking-tight"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {event.title}
              </h3>

              <div className="bg-neutral-100 border-2 border-neutral-200 rounded-lg p-6 mb-8 text-left">
                <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-3">Confirmation Details</p>
                <p className="text-neutral-700 font-medium mb-2">
                  <span className="text-neutral-500">Email:</span> {formData.email}
                </p>
                <p className="text-neutral-700 font-medium">
                  <span className="text-neutral-500">Name:</span> {formData.name}
                </p>
              </div>

              <p
                className="text-base md:text-lg font-medium text-neutral-600 mb-10 leading-relaxed"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                A confirmation email with event details and important updates has been sent to your inbox. Please check your email (and spam folder) for further information.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => { window.scrollTo(0, 0); navigate('/events', { replace: true }); }}
                  className="w-full sm:w-auto px-10 py-4 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-neutral-900 transition-colors"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Back to Events
                </button>
                <button
                  onClick={() => navigate('/join')}
                  className="w-full sm:w-auto px-10 py-4 border-4 border-black text-black font-black uppercase tracking-widest text-sm hover:bg-neutral-50 transition-colors"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Join Community
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// =============================================================================
// MAIN EXPORT
// =============================================================================
const EventRegistration: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top instantly on mount + kill stale GSAP triggers on unmount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => { });
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        const data = await getEventById(eventId);
        setEvent(data);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-200" size={48} />
      </div>
    );
  }

  // Not found — render clean white screen instead of broken text
  if (!event) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center font-sans p-6 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Event Not Found</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-8">The requested session ID is invalid or has been purged.</p>
        <button onClick={() => navigate('/events')} className="bg-black text-white px-8 py-4 font-black uppercase tracking-widest text-xs">Return to Registry</button>
      </div>
    );
  }

  if (event.status === 'locked') {
    return <LockedPage eventTitle={event.title} eventCategory={event.category} />;
  }

  return <TicketForm event={event} />;
};

export default EventRegistration;
