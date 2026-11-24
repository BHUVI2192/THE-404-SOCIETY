// Full-Screen Pure Black Page View for Automation Details
// Displays the automation name in elegant cursive letters (Instrument Serif Italic),
// complete capability breakdown, example workflow, and a back button to return.

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

  // ESC key listener & body scroll locking with Lenis synchronization
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Save exact landing page scroll position so return never jumps or glitches
    const savedScrollY = window.scrollY;

    // Pause Lenis smooth scrolling so wheel events inside modal never scroll the background page
    const lenis = (window as any).__lenis || (window as any).lenis;
    lenis?.stop();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      // Restore exact landing page scroll position
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      // Resume Lenis smooth scrolling cleanly
      lenis?.start();
      lenis?.resize?.();
    };
  }, [item, onClose]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = 'contact';
      }
    }, 280);
  };

  const pageContent = (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="automation-page-title"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Floating / Sticky Header Bar */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 20,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '18px clamp(20px, 5vw, 64px)',
            }}
          >
            <div
              style={{
                maxWidth: '1120px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Back button to come back */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to Automations"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '6px 0',
                  outline: 'none',
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.75';
                  e.currentTarget.style.transform = 'translateX(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>←</span>
                <span>Back to Automations</span>
              </button>

              {/* Number and Category indicator */}
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
            </div>
          </div>

          {/* Main Black Page Content Container */}
          <div
            style={{
              maxWidth: '1120px',
              margin: '0 auto',
              padding: 'clamp(40px, 6vh, 72px) clamp(20px, 5vw, 64px) clamp(64px, 10vh, 120px)',
              boxSizing: 'border-box',
            }}
          >
            {/* Eyebrow Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '16px',
              }}
            >
              Automation System {item.number}
            </motion.div>

            {/* Name of Automation — Clean, Minimal Editorial Sans-Serif Typography */}
            <motion.h1
              id="automation-page-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: 'clamp(36px, 5.2vw, 68px)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                margin: '0 0 20px',
              }}
            >
              {item.cardTitle}
            </motion.h1>

            {/* One-Line Introduction */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: '"Geist", -apple-system, sans-serif',
                fontSize: 'clamp(20px, 2.4vw, 26px)',
                lineHeight: 1.45,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: '0 0 48px',
                maxWidth: '840px',
                fontWeight: 400,
              }}
            >
              {item.introduction}
            </motion.p>

            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                marginBottom: '48px',
              }}
            />

            {/* Two-Column Information Layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(36px, 5vw, 64px)',
                marginBottom: '56px',
              }}
            >
              {/* Left Column: What It Solves & Technologies */}
              <div>
                {/* What It Solves */}
                <div style={{ marginBottom: '40px' }}>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#60A5FA',
                      marginBottom: '14px',
                    }}
                  >
                    What It Solves
                  </div>
                  <p
                    style={{
                      fontFamily: '"Geist", -apple-system, sans-serif',
                      fontSize: '16px',
                      lineHeight: 1.65,
                      color: 'rgba(255, 255, 255, 0.72)',
                      margin: 0,
                    }}
                  >
                    {item.whatItSolves}
                  </p>
                </div>

                {/* Relevant Technologies & Integrations */}
                <div>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '14px',
                    }}
                  >
                    Connected Stack & Ecosystem
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
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '0.04em',
                          padding: '6px 14px',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: 'rgba(255, 255, 255, 0.85)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Key Capabilities */}
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#60A5FA',
                    marginBottom: '14px',
                  }}
                >
                  Key Capabilities
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {item.capabilities.map((cap, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontFamily: '"Geist", -apple-system, sans-serif',
                        fontSize: '15px',
                        lineHeight: 1.55,
                        color: 'rgba(255, 255, 255, 0.85)',
                        paddingBottom: '10px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#60A5FA',
                          marginTop: '8px',
                          flexShrink: 0,
                        }}
                      />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Example Workflow Sequence */}
            <div
              style={{
                marginBottom: '56px',
                padding: '28px 32px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.55)',
                  marginBottom: '16px',
                }}
              >
                Production Workflow Blueprint
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {item.workflow.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#000000',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: '10px',
                        fontFamily: '"Geist", -apple-system, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#FFFFFF',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: '11px',
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
                          color: 'rgba(255, 255, 255, 0.4)',
                          fontSize: '14px',
                          padding: '0 4px',
                        }}
                      >
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Bottom Actions: CTA & Back Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
                paddingTop: '32px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Primary CTA */}
              <a
                href="#contact"
                onClick={handleCtaClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#1920F0',
                  color: '#FFFFFF',
                  padding: '14px 30px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: '"Geist Mono", monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 0.2s, transform 0.2s',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(25, 32, 240, 0.4)',
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
                <span style={{ fontSize: '15px' }}>→</span>
              </a>

              {/* Bottom Back Button */}
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '13px',
                  fontFamily: '"Geist Mono", monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '10px 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateX(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <span>←</span>
                <span>Back to Automations</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(pageContent, document.body);
};

export default AutomationDetail;
