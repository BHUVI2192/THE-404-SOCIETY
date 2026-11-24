import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpRight, Calendar, Mail } from 'lucide-react';

interface FAQItemData {
  number: string;
  question: string;
  answer: string;
}

const FAQS: FAQItemData[] = [
  {
    number: '01',
    question: "How does the 'Pay As You Wish' model work without upfront risk?",
    answer:
      "We believe exceptional work speaks for itself. We begin by scoping your project and building an initial interactive milestone without asking for an advance retainer. Once you test the working build and experience the design quality firsthand, you decide what our execution is worth. No speculative invoices, no lock-in.",
  },
  {
    number: '02',
    question: 'Who owns the intellectual property, design assets, and source code?',
    answer:
      'You have 100% full commercial ownership. Upon milestone approval and delivery, all source code (Git repository), Figma assets, custom shader configurations, and database credentials are completely transferred to your team with no residual licensing claims.',
  },
  {
    number: '03',
    question: "What happens if a deliverable doesn't align with our exact vision?",
    answer:
      "We build in fast, transparent sprint loops. Because you review functional prototypes rather than static mockups, feedback is incorporated immediately. If for any reason the direction cannot be aligned, you are under zero obligation to pay anything for that milestone.",
  },
  {
    number: '04',
    question: 'What is your typical turnaround timeline for a production website or automation?',
    answer:
      'Most custom websites and business automation pipelines are delivered within 5 to 14 business days. For urgent venture launches or event portals, we can expedite sprints with dedicated engineering focus.',
  },
  {
    number: '05',
    question: 'Do you offer ongoing hosting, security patches, and post-launch maintenance?',
    answer:
      'Yes. We configure seamless modern deployments (Vercel, Cloudflare, Supabase, Firebase) that require near-zero maintenance. We also offer monthly retainer-free check-ins for content updates, analytics reporting, and scaling automations as your venture grows.',
  },
  {
    number: '06',
    question: 'Can you integrate with our existing APIs, CRMs, and payment gateways?',
    answer:
      'Absolutely. We routinely integrate with existing backend REST/GraphQL APIs, CRM platforms (HubSpot, Salesforce), payment providers (PhonePe, Razorpay, Stripe), authentication services (Supabase, Firebase, Auth0), and analytics systems without disrupting active operations.',
  },
];

export const FAQSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className={`faq-section ${className}`}
      style={{
        maxWidth: '1320px',
        width: '100%',
        margin: 'clamp(72px, 11vh, 128px) auto',
        padding: '0 clamp(24px, 5vw, 64px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '110px',
        textAlign: 'left',
      }}
    >
      <style>{`
        .framer-faq-grid {
          display: grid;
          grid-template-columns: minmax(320px, 420px) 1fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: start;
        }
        .framer-faq-sticky {
          position: sticky;
          top: 120px;
        }
        @media (max-width: 960px) {
          .framer-faq-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .framer-faq-sticky {
            position: static;
          }
        }
        .framer-faq-card:hover {
          border-color: rgba(255, 255, 255, 0.16) !important;
          background: rgba(255, 255, 255, 0.03) !important;
        }
        .framer-faq-btn:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
        }
      `}</style>

      <div className="framer-faq-grid">
        {/* ── LEFT COLUMN: CATEGORY, TITLE, SUBTITLE & CONTACT LINK ── */}
        <div className="framer-faq-sticky">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category / Badge Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(96, 165, 250, 0.1)',
                border: '1px solid rgba(96, 165, 250, 0.25)',
                marginBottom: '18px',
              }}
            >
              <span
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#60A5FA',
                }}
              >
                FAQ
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: '"Instrument Serif", serif',
                fontStyle: 'italic',
                fontSize: 'clamp(38px, 4.6vw, 64px)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: '0 0 16px',
                textAlign: 'left',
              }}
            >
              Frequently asked questions.
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: '"Geist", -apple-system, sans-serif',
                fontSize: 'clamp(15px, 1.5vw, 17px)',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.65)',
                margin: '0 0 32px',
                fontWeight: 400,
                textAlign: 'left',
              }}
            >
              Everything you need to know about our Pay As You Wish model, delivery timelines, and full code ownership.
            </p>

            {/* Direct Contact Card (ButtonIconLink component adaptation) */}
            <div
              style={{
                padding: '24px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: '"Geist", -apple-system, sans-serif',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginBottom: '4px',
                  }}
                >
                  Have more questions?
                </div>
                <div
                  style={{
                    fontFamily: '"Geist", -apple-system, sans-serif',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'rgba(255, 255, 255, 0.55)',
                  }}
                >
                  Don't hesitate to email us or schedule a discovery call with our founding team.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="https://calendly.com/youdecide-std/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="framer-faq-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={16} color="#60A5FA" />
                    Book a 30-min Call
                  </span>
                  <ArrowUpRight size={16} color="rgba(255, 255, 255, 0.6)" />
                </a>

                <a
                  href="mailto:youdecide.std@gmail.com"
                  className="framer-faq-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '13px',
                    fontFamily: '"Geist Mono", monospace',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={15} color="#93C5FD" />
                    youdecide.std@gmail.com
                  </span>
                  <ArrowUpRight size={14} color="rgba(255, 255, 255, 0.4)" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: NUMBERED ACCORDION CARDS ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          }}
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="framer-faq-card"
                style={{
                  background: isOpen ? 'rgba(255, 255, 255, 0.035)' : 'rgba(255, 255, 255, 0.015)',
                  border: isOpen
                    ? '1px solid rgba(96, 165, 250, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'background 0.25s ease, border-color 0.25s ease',
                }}
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: '22px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    outline: 'none',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flex: 1,
                    }}
                  >
                    {/* Number Badge */}
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isOpen ? '#60A5FA' : 'rgba(255, 255, 255, 0.45)',
                        minWidth: '24px',
                        flexShrink: 0,
                        transition: 'color 0.25s ease',
                      }}
                    >
                      {faq.number}
                    </span>

                    {/* Question text */}
                    <span
                      style={{
                        fontFamily: '"Geist", -apple-system, sans-serif',
                        fontSize: 'clamp(15px, 1.4vw, 17px)',
                        fontWeight: 500,
                        lineHeight: 1.45,
                        color: isOpen ? '#FFFFFF' : 'rgba(255, 255, 255, 0.88)',
                        transition: 'color 0.25s ease',
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Rotating Chevron Icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.44, 0, 0.56, 1] }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isOpen ? 'rgba(96, 165, 250, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      color: isOpen ? '#60A5FA' : 'rgba(255, 255, 255, 0.5)',
                      flexShrink: 0,
                      transition: 'background 0.25s ease, color 0.25s ease',
                    }}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.44, 0, 0.56, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          padding: '0 24px 22px 56px',
                          fontSize: '15px',
                          lineHeight: 1.65,
                          color: 'rgba(255, 255, 255, 0.68)',
                          fontWeight: 400,
                          fontFamily: '"Geist", -apple-system, sans-serif',
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
