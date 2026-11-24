import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { smoothScrollToSection } from '../lib/scrollUtils';

const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_IN = [0.4, 0, 1, 1];
const EASE_SMOOTH = [0.65, 0, 0.35, 1];
const ICON_MS = 520;
const DEFAULT_OVERLAY_Z_INDEX = 10000;

export interface MenuLinkItem {
  label: string;
  link: string;
  newTab?: boolean;
}

export interface MotionOverlayMenuProps {
  brandElement?: React.ReactNode;
  brandText?: string;
  brandHref?: string;
  links?: MenuLinkItem[];
  secondaryLinks?: MenuLinkItem[];
  note?: string;
  noteLink?: string;
  menuLabel?: string;
  closeLabel?: string;
  headerColor?: string;
  barBackground?: string;
  barBorder?: string;
  overlayBackground?: string;
  accent?: string;
  rightAction?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_MENU_LINKS: MenuLinkItem[] = [
  { label: 'Websites', link: '#websites-built' },
  { label: 'Automations', link: '#automations' },
  { label: 'Analytics', link: '#analytics' },
  { label: 'Book a Call', link: 'https://calendly.com/youdecide-std/30min', newTab: true },
];

const DEFAULT_SECONDARY: MenuLinkItem[] = [
  { label: 'Book on Calendly', link: 'https://calendly.com/youdecide-std/30min', newTab: true },
  { label: 'youdecide.std@gmail.com', link: 'mailto:youdecide.std@gmail.com' },
];

export const MotionOverlayMenu: React.FC<MotionOverlayMenuProps> = ({
  brandElement,
  brandText,
  brandHref = '#',
  links = DEFAULT_MENU_LINKS,
  secondaryLinks = DEFAULT_SECONDARY,
  note = '© 2026 youdecide.studio · All rights reserved',
  noteLink,
  menuLabel = 'Menu',
  closeLabel = 'Close',
  headerColor = '#FFFFFF',
  barBackground = 'rgba(10, 15, 30, 0.65)',
  barBorder = 'rgba(255, 255, 255, 0.12)',
  overlayBackground = 'rgba(4, 7, 17, 0.96)',
  accent = '#60A5FA',
  rightAction,
  className = '',
  style = {},
}) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [btnHover, setBtnHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const origin = useRef<string>('calc(100% - 44px) 36px');

  useEffect(() => {
    setMounted(true);
  }, []);

  const openMenu = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    const el = buttonRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      origin.current = `${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`;
    }
    setHovered(null);
    setClosing(false);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    if (closeTimer.current) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setClosing(false);
      setOpen(false);
    }, ICON_MS * 0.35);
  }, []);

  // Lock scroll & handle Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeMenu]);

  // Focus trap
  useEffect(() => {
    if (open) {
      overlayRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // Two-phase morphing burger icon into X
  const dur = ICON_MS / 1000;
  const phase = { duration: dur, times: [0, 0.5, 1], ease: EASE_SMOOTH };
  const topVariants = {
    open: { y: [0, 2.75, 2.75], rotate: [0, 0, 45], transition: phase },
    closed: { y: [2.75, 2.75, 0], rotate: [45, 0, 0], transition: phase },
  };
  const bottomVariants = {
    open: { y: [0, -2.75, -2.75], rotate: [0, 0, -45], transition: phase },
    closed: { y: [-2.75, -2.75, 0], rotate: [-45, 0, 0], transition: phase },
  };
  const lineStyle: React.CSSProperties = {
    display: 'block',
    height: 1.5,
    borderRadius: 2,
    background: 'currentColor',
    transformOrigin: 'center',
  };

  const bgVariants = {
    hidden: { clipPath: `circle(0% at ${origin.current})` },
    visible: {
      clipPath: `circle(150% at ${origin.current})`,
      transition: { duration: 0.85, ease: EASE_OUT },
    },
    exit: {
      clipPath: `circle(0% at ${origin.current})`,
      transition: { duration: 0.65, ease: EASE_IN },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28, filter: 'blur(12px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: EASE_OUT, delay: 0.2 + i * 0.07 },
    }),
    exit: {
      opacity: 0,
      y: -10,
      filter: 'blur(8px)',
      transition: { duration: 0.35, ease: EASE_IN },
    },
  };

  const TopBarContent = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '6px 14px',
        boxSizing: 'border-box',
        color: headerColor,
        background: barBackground,
        border: `1px solid ${barBorder}`,
        borderRadius: '999px',
        boxShadow:
          '0 8px 24px -10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      }}
    >
      {/* Brand / Logo */}
      <a
        href={brandHref}
        onClick={(e) => {
          if (brandHref && brandHref.startsWith('#')) {
            e.preventDefault();
            smoothScrollToSection(brandHref);
          }
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: 'inherit',
          outline: 'none',
        }}
      >
        {brandElement}
        {brandText && (
          <span
            style={{
              fontFamily: '"Geist", sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '-0.02em',
            }}
          >
            {brandText}
          </span>
        )}
      </a>

      {/* Right controls: Optional Action Button + Menu Morph Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {rightAction}

        <button
          ref={buttonRef}
          type="button"
          aria-label={open ? closeLabel : menuLabel}
          aria-expanded={open}
          onClick={open ? closeMenu : openMenu}
          onPointerEnter={() => setBtnHover(true)}
          onPointerLeave={() => setBtnHover(false)}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            background: 'none',
            border: 0,
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: 'inherit',
            userSelect: 'none',
            touchAction: 'manipulation',
            outline: 'none',
          }}
        >
          {/* Animated Text Flip: "Menu" / "Close" */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: '"Geist", sans-serif',
              fontSize: 'clamp(11px, 1.2vw, 12px)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1,
              position: 'relative',
              height: '14px',
              overflow: 'hidden',
              display: 'inline-flex',
              alignItems: 'center',
              opacity: btnHover || open ? 1 : 0.75,
              transition: 'opacity 0.25s ease',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'menu'}
                initial={{ y: open ? 8 : -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: open ? -8 : 8, opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                style={{ display: 'block', whiteSpace: 'nowrap' }}
              >
                {open ? closeLabel : menuLabel}
              </motion.span>
            </AnimatePresence>
          </span>

          {/* Morphing Burger/X Icon */}
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: btnHover || open ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              transition: 'background 0.3s ease, border-color 0.3s ease',
              flex: 'none',
            }}
          >
            <motion.span
              style={{ ...lineStyle, width: 13 }}
              variants={topVariants}
              animate={open && !closing ? 'open' : 'closed'}
            />
            <motion.span
              style={{
                ...lineStyle,
                width: open || btnHover ? 13 : 8,
                transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              variants={bottomVariants}
              animate={open && !closing ? 'open' : 'closed'}
            />
          </span>
        </button>
      </div>
    </div>
  );

  const overlayElement = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          variants={bgVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: DEFAULT_OVERLAY_Z_INDEX,
            outline: 'none',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: overlayBackground,
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            color: '#FFFFFF',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(850px 580px at 85% 15%, rgba(25, 32, 240, 0.18), transparent 70%)',
            }}
          />

          {/* Top Bar Spacer inside Overlay: preserves clean clearance below the fixed top bar */}
          <div
            aria-hidden="true"
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(60px, 8vh, 76px)',
              flexShrink: 0,
              boxSizing: 'border-box',
            }}
          />

          {/* Navigation Links Body */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 48px 48px',
              maxWidth: '1280px',
              width: '100%',
              margin: '0 auto',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          >
            <nav
              aria-label="Main"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '24px 0',
              }}
            >
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(10px, 1.8vh, 24px)',
                }}
              >
                {links.map((item, i) => {
                  const isHovered = hovered === i;
                  const isDimmed = hovered !== null && !isHovered;
                  const padNum = String(i + 1).padStart(2, '0');

                  return (
                    <motion.li key={i} custom={i} variants={itemVariants} style={{ margin: 0, padding: 0 }}>
                      <motion.a
                        href={item.link}
                        target={item.newTab ? '_blank' : undefined}
                        rel={item.newTab ? 'noopener noreferrer' : undefined}
                        onPointerEnter={() => setHovered(i)}
                        onPointerLeave={() => setHovered(null)}
                        onClick={(e) => {
                          if (item.link && item.link.startsWith('#')) {
                            e.preventDefault();
                            closeMenu();
                            setTimeout(() => {
                              smoothScrollToSection(item.link);
                            }, 320);
                          } else {
                            closeMenu();
                          }
                        }}
                        animate={{
                          x: isHovered ? 20 : 0,
                          opacity: isDimmed ? 0.35 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.7 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'baseline',
                          gap: '24px',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          userSelect: 'none',
                          fontFamily: '"Geist", sans-serif',
                          fontWeight: 500,
                          fontSize: 'clamp(36px, 5.2vw, 68px)',
                          letterSpacing: '-0.03em',
                          lineHeight: 1.1,
                          padding: '4px 0',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            fontFamily: '"Geist Mono", monospace',
                            fontSize: 'clamp(13px, 1.3vw, 18px)',
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            color: accent,
                            display: 'inline-block',
                            transform: 'translateY(-0.7em)',
                          }}
                        >
                          {padNum}
                        </span>
                        <span>{item.label}</span>
                      </motion.a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer Row inside Overlay */}
            <div style={{ flex: 'none', paddingTop: '24px' }}>
              <div
                style={{
                  height: 1,
                  background: 'rgba(255, 255, 255, 0.12)',
                  marginBottom: '20px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.65)',
                }}
              >
                <div>{note}</div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {secondaryLinks.map((sec, j) => (
                    <a
                      key={j}
                      href={sec.link}
                      target={sec.newTab ? '_blank' : undefined}
                      rel={sec.newTab ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        if (sec.link && sec.link.startsWith('#')) {
                          e.preventDefault();
                          closeMenu();
                          setTimeout(() => {
                            smoothScrollToSection(sec.link);
                          }, 320);
                        } else {
                          closeMenu();
                        }
                      }}
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
                    >
                      {sec.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        ...style,
      }}
    >
      {TopBarContent}
      {mounted && typeof document !== 'undefined' ? createPortal(overlayElement, document.body) : overlayElement}
    </div>
  );
};

export default MotionOverlayMenu;

