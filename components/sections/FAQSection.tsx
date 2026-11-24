import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone, Mail } from 'lucide-react';

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
        margin: 'clamp(40px, 5.5vh, 64px) auto',
        padding: '0 clamp(20px, 4vw, 48px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '84px',
        textAlign: 'left',
      }}
    >
      <style>{`
        .framer-faq-whitebox {
          background: #F4F5F7;
          border: 1px solid #E5E7EB;
          border-radius: 28px;
          padding: clamp(32px, 4vw, 56px);
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.25);
        }
        .framer-faq-inner-grid {
          display: grid;
          grid-template-columns: minmax(300px, 420px) 1fr;
          gap: clamp(32px, 5vw, 56px);
          align-items: start;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 960px) {
          .framer-faq-inner-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .framer-faq-whitebox {
            border-radius: 20px;
            padding: 24px;
          }
        }
        .framer-faq-item-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .framer-faq-item-card:hover {
          border-color: #D1D5DB;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .framer-faq-contact-link:hover {
          opacity: 0.8;
        }
      `}</style>

      {/* ── THE WHITE / LIGHT FRAMER BOX CONTAINER ── */}
      <div className="framer-faq-whitebox">
        {/* Giant Watermark "FAQ" Text behind the left column */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '32px',
            fontSize: 'clamp(140px, 20vw, 240px)',
            fontWeight: 800,
            fontFamily: '"Geist", -apple-system, sans-serif',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(0deg, rgba(228, 230, 235, 0) 0%, rgba(209, 213, 219, 0.75) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0.7,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          FAQ
        </div>

        <div className="framer-faq-inner-grid">
          {/* ── LEFT COLUMN: TITLE, SUBTITLE & CONTACT ACTIONS ── */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                fontFamily: '"Geist", -apple-system, sans-serif',
                fontSize: 'clamp(30px, 3.4vw, 38px)',
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 14px',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                textAlign: 'left',
              }}
            >
              Questions &amp; Answers
            </h2>

            <p
              style={{
                fontFamily: '"Geist", -apple-system, sans-serif',
                fontSize: '15px',
                lineHeight: 1.55,
                color: '#4B5563',
                margin: '0 0 32px',
                fontWeight: 400,
                textAlign: 'left',
              }}
            >
              Have more questions? Don't hesitate to email us:
            </p>

            {/* Contact links with circular icon buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'flex-start',
              }}
            >
              {/* Phone / Call */}
              <a
                href="https://calendly.com/youdecide-std/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="framer-faq-contact-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  color: '#111827',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#374151',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={17} />
                </span>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    fontFamily: '"Geist", -apple-system, sans-serif',
                    color: '#111827',
                  }}
                >
                  Book a 30-min Call
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:youdecide.std@gmail.com"
                className="framer-faq-contact-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  color: '#111827',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#374151',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={17} />
                </span>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    fontFamily: '"Geist", -apple-system, sans-serif',
                    color: '#111827',
                  }}
                >
                  youdecide.std@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN: WHITE ACCORDION CARDS ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              width: '100%',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.number} className="framer-faq-item-card">
                  <button
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
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
                        gap: '14px',
                        flex: 1,
                      }}
                    >
                      {/* Number Badge */}
                      <span
                        style={{
                          fontFamily: '"Geist", -apple-system, sans-serif',
                          fontSize: '15px',
                          fontWeight: 500,
                          color: '#6B7280',
                          minWidth: '28px',
                          flexShrink: 0,
                        }}
                      >
                        {faq.number}
                      </span>

                      {/* Question Text */}
                      <span
                        style={{
                          fontFamily: '"Geist", -apple-system, sans-serif',
                          fontSize: '15px',
                          fontWeight: 600,
                          lineHeight: 1.4,
                          color: '#111827',
                        }}
                      >
                        {faq.question}
                      </span>
                    </div>

                    {/* Chevron Icon (rotates 180deg when open) */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.44, 0, 0.56, 1] }}
                      style={{
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
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
                        transition={{ duration: 0.25, ease: [0.44, 0, 0.56, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            padding: '0 24px 20px clamp(48px, 4vw, 66px)',
                            fontSize: '14px',
                            lineHeight: 1.65,
                            color: '#4B5563',
                            fontWeight: 400,
                            fontFamily: '"Geist", -apple-system, sans-serif',
                          }}
                        >
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
