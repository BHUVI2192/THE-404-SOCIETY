// Brand Logo Images — Framer Marketplace Component Adapted for Portfolio Websites
// Source: https://framer.com/m/Brand-Logo-Images-D51ZYs.js@nEclhYlpV3JBxdyXre3u
//
// Interactive two-column portfolio showcase matching Framer design:
// - Header: "we build" (Instrument Serif italic) & "1. Websites" (minimal uppercase)
// - Left: Vertical interactive typography list of websites built (enlarged & minimal)
// - Right: Framer Brand Logo Images component displaying active website logo & index
//   with a cute minimal floating "Tap for link ↗" button on hover.

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WebsiteBrand {
  id: string;
  name: string;
  indexText: string;
  url: string;
  logoSrc: string;
  localFallback: string;
  aspect: string;
}

export const WEBSITE_BRANDS: WebsiteBrand[] = [
  {
    id: 'parivarthana',
    name: 'Parivarthana School',
    indexText: '01 / 06   PARIVARTHANA SCHOOL',
    url: 'https://parivarthanaschool.com/RSchool/',
    logoSrc: '/portfolio/parivarthana.png',
    localFallback: '/portfolio/parivarthana.png',
    aspect: '1 / 1',
  },
  {
    id: 'the404society',
    name: 'The 404 Society',
    indexText: '02 / 06   THE 404 SOCIETY',
    url: 'https://www.the404society.in/',
    logoSrc: '/portfolio/the404society.png',
    localFallback: '/portfolio/the404society.png',
    aspect: '1 / 1',
  },
  {
    id: 'rayaramutt',
    name: 'Rayaramutthonnali',
    indexText: '03 / 06   RAYARAMUTTHONNALI',
    url: 'https://www.rayaramutthonnali.org/',
    logoSrc: '/portfolio/rayaramutt.png',
    localFallback: '/portfolio/rayaramutt.png',
    aspect: '1 / 1',
  },
  {
    id: 'mikan',
    name: 'Mikan',
    indexText: '04 / 06   MIKAN',
    url: 'https://mikan-ten.vercel.app/',
    logoSrc: '/portfolio/mikan.svg',
    localFallback: '/portfolio/mikan.svg',
    aspect: '1 / 1',
  },
  {
    id: 'helio',
    name: 'Helio',
    indexText: '05 / 06   HELIO',
    url: 'https://helio-beryl-eta.vercel.app/',
    logoSrc: '/portfolio/helio.svg',
    localFallback: '/portfolio/helio.svg',
    aspect: '1 / 1',
  },
  {
    id: 'momo',
    name: 'Momo',
    indexText: '06 / 06   MOMO',
    url: 'https://momo-five-liart.vercel.app/',
    logoSrc: '/portfolio/momo.svg',
    localFallback: '/portfolio/momo.svg',
    aspect: '1 / 1',
  },
];

const BRAND_LOOKUP: Record<string, WebsiteBrand> = {};
WEBSITE_BRANDS.forEach((b) => {
  BRAND_LOOKUP[b.id] = b;
  BRAND_LOOKUP[b.name.toLowerCase()] = b;
  BRAND_LOOKUP[b.name] = b;
});

export interface BrandLogoImagesProps {
  /** Selected website name or id */
  variant?: string;
  /** Width in pixels or CSS string */
  width?: number | string;
  /** Height in pixels or CSS string */
  height?: number | string;
  /** How the logo fits inside the container */
  fit?: 'contain' | 'fill';
  /** Background color of the card */
  backgroundColor?: string;
  /** Custom inline style */
  style?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Show the cute minimal "Tap for link" button on hover */
  showLinkButton?: boolean;
}

/**
 * BrandLogoImages
 *
 * Generated Framer component replica displaying active portfolio logo & index.
 * @framerIntrinsicHeight 360
 * @framerIntrinsicWidth 320
 */
export const BrandLogoImages: React.FC<BrandLogoImagesProps> = ({
  variant = 'Parivarthana School',
  width = 320,
  height = 'auto',
  fit = 'contain',
  backgroundColor = 'transparent',
  style,
  className = '',
  onClick,
  showLinkButton = true,
}) => {
  const brand = BRAND_LOOKUP[variant] || BRAND_LOOKUP[variant.toLowerCase()] || WEBSITE_BRANDS[0];
  const [imgSrc, setImgSrc] = useState<string>(brand.logoSrc);

  useEffect(() => {
    setImgSrc(brand.logoSrc);
  }, [brand]);

  return (
    <div
      className={`brand-logo-card ${className}`}
      data-framer-name={brand.name}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: '24px',
        padding: '0',
        overflow: 'visible',
        boxSizing: 'border-box',
        flexShrink: 0,
        position: 'relative',
        ...style,
      }}
    >
      {/* 1:1 Aspect Ratio Logo Graphic with Tap For Link Overlay */}
      <a
        href={brand.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${brand.name} website`}
        className="brand-logo-img-wrapper"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          position: 'relative',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        <img
          src={imgSrc}
          onError={() => {
            if (imgSrc !== brand.localFallback) {
              setImgSrc(brand.localFallback);
            }
          }}
          alt={`${brand.name} Logo`}
          loading="lazy"
          className="brand-logo-img"
          style={{
            maxWidth: fit === 'fill' ? '100%' : '88%',
            maxHeight: fit === 'fill' ? '100%' : '88%',
            objectFit: 'contain',
            display: 'block',
            userSelect: 'none',
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        {/* Cute Minimalist "Tap for link" Floating Pill Button */}
        {showLinkButton && (
          <div
            className="tap-link-btn"
            style={{
              position: 'absolute',
              bottom: '16px',
              padding: '8px 16px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: '"Geist Mono", monospace',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              zIndex: 10,
              pointerEvents: 'none',
              transition: 'opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1), transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <span>Tap for link</span>
            <span style={{ fontSize: '12px', lineHeight: 1 }}>↗</span>
          </div>
        )}
      </a>

      {/* Index & Name Typography */}
      <div
        className="brand-logo-label"
        style={{
          width: '100%',
          padding: '0',
          boxSizing: 'border-box',
          textAlign: 'left',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: '"Anek Latin", "Inter", -apple-system, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            lineHeight: '120%',
            color: '#000000',
            textTransform: 'uppercase',
            whiteSpace: 'pre',
          }}
        >
          {brand.indexText}
        </p>
      </div>
    </div>
  );
};

export default BrandLogoImages;

/**
 * BrandLogosSection
 *
 * Interactive portfolio showcase with minimal italic header:
 * - Header: "we build" (italic serif) & "1. Websites" (minimal monospace)
 * - Left column: Vertical stack of websites (hover/click to highlight)
 * - Right column: Framer BrandLogoImages component with "Tap for link" button
 */
export const BrandLogosSection: React.FC<{
  initialVariant?: string;
  className?: string;
}> = ({
  initialVariant = 'Parivarthana School',
  className = '',
}) => {
  const [activeBrand, setActiveBrand] = useState<string>(initialVariant);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cycleIndexRef = useRef<number>(
    WEBSITE_BRANDS.findIndex((b) => b.name === initialVariant) || 0
  );

  // Smooth auto-cycling when the user is not hovering
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      cycleIndexRef.current = (cycleIndexRef.current + 1) % WEBSITE_BRANDS.length;
      setActiveBrand(WEBSITE_BRANDS[cycleIndexRef.current].name);
    }, 3600);

    return () => clearInterval(timer);
  }, [isHovered]);

  const handleSelectBrand = (name: string, idx: number) => {
    cycleIndexRef.current = idx;
    setActiveBrand(name);
  };

  const currentBrand =
    BRAND_LOOKUP[activeBrand] ||
    BRAND_LOOKUP[activeBrand.toLowerCase()] ||
    WEBSITE_BRANDS[0];

  return (
    <section
      id="websites-built"
      className={`brand-logos-showcase-section ${className}`}
      style={{
        maxWidth: '1280px',
        width: '100%',
        margin: 'clamp(56px, 9vh, 96px) auto clamp(64px, 11vh, 112px)',
        padding: '0 clamp(16px, 4vw, 32px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '110px',
      }}
    >
      {/* ── Section Header: Italic & Minimal ── */}
      <div
        style={{
          width: '100%',
          marginBottom: 'clamp(20px, 3.5vh, 32px)',
          paddingLeft: '4px',
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
            fontSize: 'clamp(44px, 5.5vw, 72px)',
            color: '#FFFFFF',
            fontWeight: 400,
            margin: '0 0 6px',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          we build
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.65)',
            margin: 0,
          }}
        >
          1. Websites
        </motion.p>
      </div>

      {/* ── Outer White Showcase Canvas (Enlarged) ── */}
      <div
        className="brand-interactive-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          padding: 'clamp(60px, 7vw, 96px) clamp(36px, 7vw, 100px)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '48px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Left Column: Vertical Brand Typography List (Enlarged) */}
        <div
          className="brand-interactive-list"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(12px, 2vh, 20px)',
            userSelect: 'none',
            maxWidth: '660px',
            flex: '1 1 auto',
          }}
        >
          {WEBSITE_BRANDS.map((b, idx) => {
            const isActive = activeBrand === b.name;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBrand(b.name, idx)}
                onMouseEnter={() => handleSelectBrand(b.name, idx)}
                className={`brand-interactive-item ${isActive ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: 'clamp(36px, 4.2vw, 58px)',
                  fontWeight: isActive ? 600 : 500,
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  color: isActive ? '#000000' : 'rgba(0, 0, 0, 0.18)',
                  transition:
                    'color 0.22s cubic-bezier(0.22, 1, 0.36, 1), transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
                  outline: 'none',
                  transform: isActive ? 'translateX(6px)' : 'none',
                  whiteSpace: 'nowrap',
                  willChange: 'color, transform',
                }}
              >
                {b.name}
              </button>
            );
          })}
        </div>

        {/* Right Column: Framer BrandLogoImages Component Display (Enlarged) */}
        <div
          className="brand-interactive-display"
          style={{
            width: 'clamp(280px, 30vw, 360px)',
            minHeight: '380px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBrand.id}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%' }}
            >
              <BrandLogoImages
                variant={currentBrand.name}
                width="100%"
                height="auto"
                fit="contain"
                backgroundColor="transparent"
                showLinkButton={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scoped CSS for Hover Transitions, Button Visibility & Mobile Layout */}
      <style>{`
        .brand-interactive-item:hover:not(.active) {
          color: rgba(0, 0, 0, 0.5) !important;
        }
        /* Tap for link button: appears gracefully on hover */
        .tap-link-btn {
          opacity: 0;
          transform: translateY(8px) scale(0.92);
        }
        .brand-logo-img-wrapper:hover .tap-link-btn {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
        .brand-logo-img-wrapper:hover .brand-logo-img {
          transform: scale(1.04) !important;
        }
        @media (max-width: 920px) {
          .brand-interactive-container {
            flex-direction: column-reverse !important;
            padding: 44px 28px !important;
            gap: 36px !important;
            align-items: center !important;
          }
          .brand-interactive-list {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            width: 100% !important;
            text-align: center !important;
          }
          .brand-interactive-item {
            font-size: clamp(24px, 6vw, 34px) !important;
            text-align: center !important;
            white-space: normal !important;
            transform: none !important;
          }
          .brand-interactive-display {
            width: clamp(220px, 60vw, 280px) !important;
            min-height: 280px !important;
          }
          /* Always show tap for link button on touch/mobile */
          .tap-link-btn {
            opacity: 1 !important;
            transform: translateY(0) scale(1) !important;
          }
        }
      `}</style>
    </section>
  );
};
