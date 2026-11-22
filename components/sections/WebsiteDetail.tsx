// Full-Screen Dedicated Page View for Websites
// Opens when a user clicks on any website name in the Websites section.
// Features:
// - Back button restoring exact landing page position with Lenis scroll synchronization
// - Website name at top in complete big letters, NOT bold and NOT italic
// - Large responsive interactive BrowserWindow component (desktop browser on wide screens, phone on mobile)

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WebsiteBrand } from '../BrandLogoImages';
import { BrowserWindow } from '../BrowserWindow';

export interface WebsiteDetailProps {
  item: WebsiteBrand | null;
  onClose: () => void;
}

export const WebsiteDetail: React.FC<WebsiteDetailProps> = ({ item, onClose }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key listener & body scroll locking with Lenis smooth-scroll synchronization
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Save exact landing page scroll position
    const savedScrollY = window.scrollY;

    // Pause Lenis smooth scrolling so wheel events inside modal never scroll background
    const lenis = (window as any).__lenis || (window as any).lenis;
    lenis?.stop();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      // Restore exact landing page scroll position instant without jump
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      // Resume Lenis smooth scrolling cleanly
      lenis?.start();
      lenis?.resize?.();
    };
  }, [item, onClose]);

  const pageContent = (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="website-page-title"
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
            backgroundColor: '#040711',
            color: '#FFFFFF',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            boxSizing: 'border-box',
          }}
        >
          {/* ── STICKY TOP HEADER BAR ── */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 30,
              backgroundColor: 'rgba(4, 7, 17, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '18px clamp(20px, 5vw, 64px)',
            }}
          >
            <div
              style={{
                maxWidth: '1280px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Back button to return to websites showcase */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to Websites"
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
                <span>Back to Websites</span>
              </button>

              {/* Index & Category indicator */}
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
                {item.indexText}
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT CONTAINER ── */}
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding:
                'clamp(32px, 5vh, 64px) clamp(20px, 5vw, 64px) clamp(64px, 10vh, 120px)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
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
                marginBottom: '14px',
              }}
            >
              Interactive Preview // {item.name}
            </motion.div>

            {/* 
              WEBSITE NAME IN COMPLETE BIG LETTERS:
              - Complete big letters (clamp(40px, 6.5vw, 84px))
              - NOT bold (fontWeight: 400)
              - NOT italic (fontStyle: 'normal')
            */}
            <motion.h1
              id="website-page-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily:
                  '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: 'clamp(40px, 6.5vw, 84px)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                margin: '0 0 clamp(24px, 4vh, 48px)',
                textAlign: 'left',
              }}
            >
              {item.name}
            </motion.h1>

            {/* ── INTERACTIVE BROWSER COMPONENT ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <BrowserWindow
                url={item.url}
                name={item.name}
                id={item.id}
                fallbackLogo={item.logoSrc}
              />
            </motion.div>

            {/* ── BOTTOM CONTEXT & ACTION BAR ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              style={{
                width: '100%',
                marginTop: 'clamp(32px, 5vh, 56px)',
                paddingTop: '28px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              <div>
                <span>You are interacting with live deployment: </span>
                <span style={{ color: '#FFFFFF' }}>{item.url}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#60A5FA',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Launch full tab</span>
                  <span>↗</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                  }}
                >
                  Close preview ✕
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(pageContent, document.body);
};

export default WebsiteDetail;
