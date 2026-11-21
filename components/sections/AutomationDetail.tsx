import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AutomationItem } from '../../data/automations';

interface AutomationDetailProps {
  item: AutomationItem | null;
  onClose: () => void;
}

export const AutomationDetail: React.FC<AutomationDetailProps> = ({ item, onClose }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // ESC key listener & body scroll locking
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [item, onClose]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose();
    // Allow modal exit animation then scroll cleanly to contact
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = 'contact';
      }
    }, 240);
  };

  const modalContent = (
    <AnimatePresence>
      {item && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="automation-detail-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(16px, 4vw, 36px)',
            boxSizing: 'border-box',
          }}
        >
          {/* Frosted Midnight Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(2, 6, 18, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          />

          {/* Expanded Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              backgroundColor: '#040711',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 32px 96px rgba(0, 0, 0, 0.75)',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              padding: 'clamp(28px, 4.5vw, 48px)',
              boxSizing: 'border-box',
              color: '#FFFFFF',
              fontFamily: 'Geist, -apple-system, sans-serif',
            }}
          >
            {/* Header: Number, Category & Close Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#60A5FA',
                }}
              >
                {item.number} / {item.category}
              </div>

              {/* Minimal Accessible Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close detail modal"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '999px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  transition: 'background 0.2s, transform 0.2s',
                  outline: 'none',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="1" y1="1" x2="13" y2="13" />
                  <line x1="13" y1="1" x2="1" y2="13" />
                </svg>
              </button>
            </div>

            {/* Main Automation Name in Bold Uppercase */}
            <h3
              id="automation-detail-title"
              style={{
                fontFamily: '"Geist", -apple-system, sans-serif',
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                margin: '0 0 14px',
                color: '#FFFFFF',
              }}
            >
              {item.name}
            </h3>

            {/* Short Introduction */}
            <p
              style={{
                fontSize: 'clamp(16px, 1.8vw, 19px)',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.5,
                margin: '0 0 28px',
                fontWeight: 400,
              }}
            >
              {item.introduction}
            </p>

            {/* Section: What It Solves */}
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '10px',
                }}
              >
                What It Solves
              </div>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.72)',
                  margin: 0,
                }}
              >
                {item.whatItSolves}
              </p>
            </div>

            {/* Section: Key Capabilities */}
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '12px',
                }}
              >
                Key Capabilities
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '10px 24px',
                }}
              >
                {item.capabilities.map((cap, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: 'rgba(255, 255, 255, 0.82)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: '#60A5FA',
                        marginTop: '7px',
                        flexShrink: 0,
                      }}
                    />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section: Example Workflow Sequence */}
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '14px',
                }}
              >
                Example Workflow Sequence
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                }}
              >
                {item.workflow.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        backgroundColor: '#000000',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#FFFFFF',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: '10px',
                          color: '#60A5FA',
                          fontWeight: 600,
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    {idx < item.workflow.length - 1 && (
                      <span
                        aria-hidden="true"
                        style={{
                          fontFamily: '"Geist Mono", monospace',
                          color: 'rgba(255, 255, 255, 0.35)',
                          fontSize: '13px',
                          padding: '0 2px',
                        }}
                      >
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Section: Relevant Technologies & Integrations */}
            <div style={{ marginBottom: '36px' }}>
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '12px',
                }}
              >
                Relevant Technologies & Integrations
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {item.technologies.map((tech, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.75)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions: CTA & Return */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <a
                href="#contact"
                onClick={handleCtaClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  padding: '13px 26px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: '"Geist Mono", monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 0.2s, transform 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <span>DISCUSS YOUR PROJECT</span>
                <span style={{ fontSize: '14px' }}>→</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontSize: '13px',
                  fontFamily: '"Geist Mono", monospace',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)';
                }}
              >
                Return to gallery
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
};

export default AutomationDetail;
