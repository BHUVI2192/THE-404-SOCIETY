/**
 * WebsitesBuiltSection — "What We Build / 1. Websites"
 *
 * Implements:
 * 1. "WHAT WE BUILD" to the extreme left of the page
 * 2. "1. WEBSITES" category heading
 * 3. The Framer Brand Logo Images component showcasing the 6 websites in order:
 *    1. https://parivarthanaschool.com/RSchool/
 *    2. https://www.the404society.in/
 *    3. https://www.rayaramutthonnali.org/
 *    4. https://nike-vision.vercel.app/
 *    5. https://helio-beryl-eta.vercel.app/
 *    6. https://momo-five-liart.vercel.app/
 * 4. Sleek minimal typography and aesthetic
 * 5. Multi-layered luminous Aurora ambient background glow
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrandLogoImages, WEBSITES_BUILT, WebsiteBrand } from './BrandLogoImages';

export const WebsitesBuiltSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active card index (card width ~306px with gap)
    const cardWidth = 306;
    const index = Math.min(
      WEBSITES_BUILT.length - 1,
      Math.max(0, Math.round(scrollLeft / cardWidth))
    );
    setActiveIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    checkScroll();
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 306;
    const delta = direction === 'left' ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section
      id="websites"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#040711',
        overflow: 'hidden',
        scrollMarginTop: 'clamp(76px, 10vh, 96px)',
        padding: 'clamp(80px, 11vh, 120px) 0 clamp(70px, 10vh, 110px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      {/* ── AURORA BACKGROUND GLOW ── */}
      <div
        aria-hidden="true"
        className="aurora-glow-container"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {/* Aurora Blob 1: Cyan / Emerald Northern Lights Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '12%',
            width: 'clamp(320px, 45vw, 650px)',
            height: 'clamp(280px, 35vw, 500px)',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.18) 0%, rgba(52, 211, 153, 0.12) 45%, transparent 70%)',
            filter: 'blur(90px)',
            opacity: 0.9,
            animation: 'auroraFloat1 18s ease-in-out infinite alternate',
          }}
        />

        {/* Aurora Blob 2: Deep Indigo / Violet Plasma */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '8%',
            width: 'clamp(340px, 50vw, 700px)',
            height: 'clamp(300px, 40vw, 540px)',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.22) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 72%)',
            filter: 'blur(100px)',
            opacity: 0.85,
            animation: 'auroraFloat2 22s ease-in-out infinite alternate',
          }}
        />

        {/* Aurora Blob 3: Center Ambient Ribbons */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '42%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(300px, 40vw, 600px)',
            height: 'clamp(220px, 25vw, 360px)',
            borderRadius: '40%',
            background:
              'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(139, 92, 246, 0.14) 55%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.8,
            animation: 'auroraFloat3 16s ease-in-out infinite alternate',
          }}
        />

        {/* Minimal Noise & Aurora Grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <style>{`
        @keyframes auroraFloat1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, 25px) scale(1.08); }
          100% { transform: translate(-30px, 35px) scale(0.96); }
        }
        @keyframes auroraFloat2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-45px, -30px) scale(1.1); }
          100% { transform: translate(25px, -20px) scale(0.92); }
        }
        @keyframes auroraFloat3 {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          50% { transform: translate(-46%, -48%) scale(1.15) rotate(5deg); }
          100% { transform: translate(-54%, -52%) scale(0.9) rotate(-4deg); }
        }
        .websites-scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        .websites-scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 999px;
        }
        .websites-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
        }
        .websites-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        @media (max-width: 860px) {
          .rail-sidebar {
            position: static !important;
            writing-mode: horizontal-tb !important;
            transform: none !important;
            margin-bottom: 12px !important;
          }
        }
      `}</style>

      {/* ── SECTION CONTENT WRAPPER ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 48px)',
          boxSizing: 'border-box',
        }}
      >
        {/* ── TOP HEADER ROW: "WHAT WE BUILD" (EXTREME LEFT) + "1. WEBSITES" + CONTROLS ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: 'clamp(28px, 4.5vh, 44px)',
          }}
        >
          {/* Left Block: "WHAT WE BUILD" on extreme left + "1. WEBSITES" heading */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Extreme Left Index Marker: WHAT WE BUILD */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#60A5FA',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#60A5FA',
                  boxShadow: '0 0 10px #60A5FA',
                }}
              />
              <span>WHAT WE BUILD</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>/</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>PORTFOLIO ARCHIVE</span>
            </div>

            {/* Category Heading: 1. WEBSITES */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: '"Geist", -apple-system, sans-serif',
                  fontSize: 'clamp(28px, 3.8vw, 42px)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                }}
              >
                1. Websites
              </h2>
              <span
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                [ {WEBSITES_BUILT.length} Custom Deployments ]
              </span>
            </div>

            {/* Sleek Minimal Description */}
            <p
              style={{
                margin: 0,
                fontFamily: '"Geist", -apple-system, sans-serif',
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                color: 'rgba(255, 255, 255, 0.55)',
                maxWidth: '540px',
                lineHeight: 1.55,
                fontWeight: 400,
              }}
            >
              Tailored digital flagships, interactive web experiences, and bespoke brand platforms crafted with precision engineering.
            </p>
          </div>

          {/* Right Block: Minimal Navigation Controls & Carousel Progress */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              alignSelf: 'flex-end',
            }}
          >
            {/* Active Counter: e.g. 01 / 06 */}
            <div
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                letterSpacing: '0.06em',
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)', margin: '0 4px' }}>/</span>
              <span>{String(WEBSITES_BUILT.length).padStart(2, '0')}</span>
            </div>

            {/* Left Scroll Button */}
            <button
              onClick={() => scrollByAmount('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left to previous website"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: canScrollLeft
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  canScrollLeft
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)'
                }`,
                color: canScrollLeft ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollLeft ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollByAmount('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right to next website"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: canScrollRight
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  canScrollRight
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)'
                }`,
                color: canScrollRight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollRight ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── FRAMER BRAND LOGO IMAGES CAROUSEL SHOWCASE ── */}
        <div
          ref={scrollRef}
          className="websites-scroll-container"
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            padding: '12px 4px 28px',
            scrollbarWidth: 'thin',
          }}
        >
          {WEBSITES_BUILT.map((brand, index) => (
            <div
              key={brand.id}
              style={{
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
              }}
            >
              <BrandLogoImages
                brand={brand}
                width={286}
                interactive={true}
              />
            </div>
          ))}
        </div>

        {/* ── BOTTOM PROGRESS BAR & SLEEK QUICK LINKS ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Active website pill indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: '"Geist Mono", monospace',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <span style={{ color: WEBSITES_BUILT[activeIndex]?.accentColor || '#60A5FA' }}>
              ●
            </span>
            <span>SHOWING:</span>
            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>
              {WEBSITES_BUILT[activeIndex]?.name}
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>—</span>
            <a
              href={WEBSITES_BUILT[activeIndex]?.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#60A5FA',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span>{WEBSITES_BUILT[activeIndex]?.displayUrl}</span>
              <span>↗</span>
            </a>
          </div>

          {/* Minimal Drag / Swipe Hint */}
          <div
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            DRAG / SCROLL TO EXPLORE ALL 6 WEBSITES →
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebsitesBuiltSection;
