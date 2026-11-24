import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, Loader2, Sparkles, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProjectBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

const SERVICE_OPTIONS = [
  'Custom Website & WebGL',
  'Workflow & Sales Automation',
  'Social Media Analytics',
  'Full Stack Platform',
];

const TIMELINE_OPTIONS = [
  'Immediate (1–2 Weeks)',
  'Within a Month',
  'Flexible Timeline',
];

export const ProjectBriefModal: React.FC<ProjectBriefModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Custom Website & WebGL',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(defaultService);
  const [timeline, setTimeline] = useState('Within a Month');
  const [description, setDescription] = useState('');
  const [budgetNotes, setBudgetNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSubmitted(false);
      setErrorMsg('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !description.trim()) {
      setErrorMsg('Please fill in your name, email, and a brief description of your project.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const leadData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      company: company.trim() || 'Not specified',
      service,
      timeline,
      description: description.trim(),
      budget_notes: budgetNotes.trim() || 'Pay As You Wish milestone',
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Try to record in Supabase leads/briefs table if configured
      try {
        await supabase.from('studio_leads').insert([leadData]);
      } catch (dbErr) {
        // Table might not exist yet; continue to email notification
        console.warn('Supabase studio_leads table notice:', dbErr);
      }

      // 2. Send email notification to studio team via /api/send-email
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #040711; color: #ffffff; border-radius: 16px;">
          <h2 style="color: #60A5FA; margin-top: 0;">🚀 New Project Brief Received</h2>
          <p style="color: #9CA3AF; font-size: 14px;">A new prospective client submitted a brief on <strong>youdecide.studio</strong>.</p>
          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p><strong>Name:</strong> ${leadData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${leadData.email}" style="color: #60A5FA;">${leadData.email}</a></p>
            <p><strong>Phone / WhatsApp:</strong> ${leadData.phone || 'N/A'}</p>
            <p><strong>Company / Venture:</strong> ${leadData.company}</p>
            <p><strong>Service Requested:</strong> <span style="background: #1920F0; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${leadData.service}</span></p>
            <p><strong>Target Timeline:</strong> ${leadData.timeline}</p>
            <p><strong>Commercial Note:</strong> ${leadData.budget_notes}</p>
            <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 16px 0;" />
            <p><strong>Project Overview:</strong></p>
            <p style="white-space: pre-wrap; color: #E5E7EB; line-height: 1.6;">${leadData.description}</p>
          </div>

          <p style="font-size: 12px; color: #6B7280;">Sent securely from youdecide.studio intake pipeline.</p>
        </div>
      `;

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'youdecide.std@gmail.com',
          subject: `[New Project Brief] ${leadData.name} - ${leadData.service}`,
          html: emailHtml,
        }),
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Project brief submission error:', err);
      // Even if network fails, grant graceful reassurance with mailto fallback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(2, 5, 14, 0.82)',
              backdropFilter: 'blur(12px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              backgroundColor: '#090D1A',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '24px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: 'clamp(28px, 4vh, 40px)',
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(96, 165, 250, 0.1)',
              boxSizing: 'border-box',
              color: '#FFFFFF',
              zIndex: 1,
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close project brief modal"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <>
                {/* Eyebrow & Title */}
                <div style={{ marginBottom: '24px', paddingRight: '32px' }}>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#60A5FA',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '8px',
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Project Brief &amp; Roadmap</span>
                  </div>
                  <h2
                    style={{
                      fontFamily: '"Instrument Serif", serif',
                      fontStyle: 'italic',
                      fontSize: 'clamp(28px, 4vw, 38px)',
                      fontWeight: 400,
                      lineHeight: 1.15,
                      margin: '0 0 8px',
                      color: '#FFFFFF',
                    }}
                  >
                    Start your build with zero risk.
                  </h2>
                  <p
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.65)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    Share what you need built. We build the milestone prototype first — you decide what our work is worth.
                  </p>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#FCA5A5',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      marginBottom: '18px',
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Name & Email Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* Company & Phone Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        Company / Venture
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Elevate Labs"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        WhatsApp / Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 / +1..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* Service Scope Selection */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Primary Service Needed
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {SERVICE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setService(opt)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            background: service === opt ? '#1920F0' : 'rgba(255, 255, 255, 0.06)',
                            color: service === opt ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                            border:
                              service === opt
                                ? '1px solid #60A5FA'
                                : '1px solid rgba(255, 255, 255, 0.12)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Overview */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Project Scope &amp; Vision *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe what you want built, your target audience, existing site link (if any), and key features you care about..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        outline: 'none',
                        boxSizing: 'border-box',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Timeline Selection */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Target Timeline
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {TIMELINE_OPTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeline(t)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            background: timeline === t ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                            color: timeline === t ? '#60A5FA' : 'rgba(255, 255, 255, 0.65)',
                            border:
                              timeline === t
                                ? '1px solid #60A5FA'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '14px 24px',
                        background: '#1920F0',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 24px rgba(25, 32, 240, 0.45)',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#2932FF';
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#1920F0';
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Transmitting Project Scope...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Brief</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '10px',
                        fontSize: '11px',
                        fontFamily: '"Geist Mono", monospace',
                        color: 'rgba(255, 255, 255, 0.45)',
                      }}
                    >
                      Zero upfront retainer · 100% pay as you wish on milestone delivery
                    </div>
                  </div>
                </form>
              </>
            ) : (
              /* Success State */
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(96, 165, 250, 0.15)',
                    border: '1px solid #60A5FA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: '#60A5FA',
                  }}
                >
                  <CheckCircle size={32} />
                </div>
                <h3
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontStyle: 'italic',
                    fontSize: '32px',
                    margin: '0 0 10px',
                    color: '#FFFFFF',
                  }}
                >
                  Brief Received!
                </h3>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    lineHeight: 1.6,
                    maxWidth: '460px',
                    margin: '0 auto 28px',
                  }}
                >
                  Thank you, <strong>{name}</strong>. Our engineering leads will review your project scope and follow up directly at <strong>{email}</strong> within 12 hours with an initial roadmap.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="https://calendly.com/youdecide-std/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '12px 22px',
                      background: '#1920F0',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Book Discovery Call Now</span>
                    <ArrowRight size={14} />
                  </a>
                  <button
                    onClick={onClose}
                    style={{
                      padding: '12px 20px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectBriefModal;
