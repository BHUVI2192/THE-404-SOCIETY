import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, Code, Globe, Zap, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does the 'Pay As You Wish' model work without upfront risk?",
    answer:
      "We believe exceptional work speaks for itself. We begin by scoping your project and building an initial interactive milestone without asking for an advance retainer. Once you test the working build and experience the design quality firsthand, you decide what our execution is worth. No speculative invoices, no lock-in.",
  },
  {
    question: 'Who owns the intellectual property, design assets, and source code?',
    answer:
      'You have 100% full commercial ownership. Upon milestone approval and delivery, all source code (Git repository), Figma assets, custom shader configurations, and database credentials are completely transferred to your team with no residual licensing claims.',
  },
  {
    question: "What happens if a deliverable doesn't align with our exact vision?",
    answer:
      "We build in fast, transparent sprint loops. Because you review functional prototypes rather than static mockups, feedback is incorporated immediately. If for any reason the direction cannot be aligned, you are under zero obligation to pay anything for that milestone.",
  },
  {
    question: 'What is your typical turnaround timeline for a production website or automation?',
    answer:
      'Most custom websites and business automation pipelines are delivered within 5 to 14 business days. For urgent venture launches or event portals, we can expedite sprints with dedicated engineering focus.',
  },
  {
    question: 'Do you offer ongoing hosting, security patches, and post-launch maintenance?',
    answer:
      'Yes. We configure seamless modern deployments (Vercel, Cloudflare, Supabase, Firebase) that require near-zero maintenance. We also offer monthly retainer-free check-ins for content updates, analytics reporting, and scaling automations as your venture grows.',
  },
];

const MILESTONES = [
  {
    step: '01',
    title: 'Discovery & Live Prototype',
    desc: 'We map your technical requirements, brand aesthetic, and build a live interactive prototype with zero advance retainer required.',
    icon: <Globe size={20} color="#60A5FA" />,
  },
  {
    step: '02',
    title: 'Milestone Review & Valuation',
    desc: 'You test the live build across desktop and mobile, evaluate the code and speed, and determine the fair valuation for the milestone.',
    icon: <ShieldCheck size={20} color="#60A5FA" />,
  },
  {
    step: '03',
    title: 'DNS Transfer & Handover',
    desc: 'We connect your custom domain, transfer the Git repository and deployment pipelines, and hand over 100% intellectual property ownership.',
    icon: <Code size={20} color="#60A5FA" />,
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
      {/* ── SECTION HEADER ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          marginBottom: 'clamp(36px, 5vh, 52px)',
          textAlign: 'left',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(38px, 5.5vw, 76px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: '0 0 14px',
            textAlign: 'left',
          }}
        >
          Frequently asked questions.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: 'clamp(16px, 1.8vw, 22px)',
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 18px',
            textAlign: 'left',
          }}
        >
          5. Philosophy &amp; Framework
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist", -apple-system, sans-serif',
            fontSize: 'clamp(15px, 1.6vw, 17px)',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.65)',
            margin: 0,
            maxWidth: '720px',
            fontWeight: 400,
            textAlign: 'left',
          }}
        >
          How we partner with founders and institutions without speculative price barriers, retainers, or hidden fees.
        </motion.p>
      </div>

      {/* ── 3-SPRINT MILESTONE TIMELINE ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: 'clamp(44px, 6vh, 64px)',
          width: '100%',
        }}
      >
        {MILESTONES.map((m, idx) => (
          <motion.div
            key={m.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '28px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: '#60A5FA',
                    background: 'rgba(96, 165, 250, 0.12)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}
                >
                  SPRINT {m.step}
                </span>
                {m.icon}
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  margin: '0 0 10px',
                }}
              >
                {m.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.65)',
                  margin: 0,
                }}
              >
                {m.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── INTERACTIVE ACCORDION ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{
                background: isOpen ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: isOpen
                  ? '1px solid rgba(96, 165, 250, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
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
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 'clamp(15px, 1.6vw, 17px)',
                  fontWeight: 500,
                  outline: 'none',
                  gap: '16px',
                }}
              >
                <span>{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ flexShrink: 0, color: isOpen ? '#60A5FA' : 'rgba(255, 255, 255, 0.5)' }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 24px 24px',
                        fontSize: '15px',
                        lineHeight: 1.65,
                        color: 'rgba(255, 255, 255, 0.72)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '16px',
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
    </section>
  );
};

export default FAQSection;
