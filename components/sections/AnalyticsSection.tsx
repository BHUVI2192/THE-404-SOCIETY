// Analytics Section — Framer Flexible Accordion Component
// Customized with bespoke live SVG/CSS analytical visualizers (Zero AI imagery)
// Minimal, non-bold typography matching the rest of the website
// Spacious section padding & generous breathing room

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, TrendingUp, CheckCircle, BarChart3, Compass } from 'lucide-react';
import { AnalyticsDetail, AnalyticsDetailItem, ANALYTICS_ITEMS } from './AnalyticsDetail';

export interface AnalyticsSectionProps {
  className?: string;
}

interface AccordionTabItem {
  id: string;
  tab: string;
  eyebrow: string;
  title: string;
  description: string;
  analyticsItem: AnalyticsDetailItem;
}

const ACCORDION_ITEMS: AccordionTabItem[] = [
  {
    id: 'social-media',
    tab: 'Social Reach',
    eyebrow: '01 · SOCIAL MEDIA ANALYTICS',
    title: 'Content that turns into customer conversations.',
    description:
      'We track what content actually turns into customer conversations, sales enquiries, and brand authority instead of empty likes and vanity numbers.',
    analyticsItem: ANALYTICS_ITEMS[0],
  },
  {
    id: 'monthly-briefs',
    tab: 'Monthly Briefs',
    eyebrow: '02 · PERFORMANCE BRIEFS',
    title: 'Reports you can read in two minutes.',
    description:
      'A clean one-page summary of what worked, what did not, and three simple action steps for next month in plain words without marketing jargon.',
    analyticsItem: ANALYTICS_ITEMS[1],
  },
  {
    id: 'visitor-flow',
    tab: 'Visitor Flow',
    eyebrow: '03 · WEBSITE & VISITOR FLOW',
    title: 'Where visitors come from and why they stay.',
    description:
      'See traffic sources, pages that hold attention the longest, and drop-off bottlenecks where casual visitors leave or convert into clients.',
    analyticsItem: ANALYTICS_ITEMS[2],
  },
  {
    id: 'competitor-watch',
    tab: 'Competitor Watch',
    eyebrow: '04 · MARKET BENCHMARKS',
    title: 'Know what others in your field are doing.',
    description:
      'Learn what competitors in your field are doing well and what falls flat so your brand can capture buyer attention and fill untapped content gaps.',
    analyticsItem: ANALYTICS_ITEMS[3],
  },
];

/* ── VIBRANT GRAPHIC DESIGN POSTER VISUALIZERS (CLEAN & MINIMAL, ZERO CLUTTER) ── */

// POSTER 1: SOCIAL MEDIA ANALYTICS (Vivid Electric Ultramarine & Neon Lime)
const SocialReachVisual: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0920D6 0%, #1711B8 45%, #050C47 100%)',
      color: '#FFFFFF',
      fontFamily: '"Geist", -apple-system, sans-serif',
      boxSizing: 'border-box',
      padding: 'clamp(28px, 4vw, 48px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
    }}
  >
    {/* Fine Geometric Grid Accent */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '36px 36px',
        pointerEvents: 'none',
      }}
    />

    {/* Giant Background Watermark Number */}
    <div
      style={{
        position: 'absolute',
        left: '4%',
        bottom: '-8%',
        fontFamily: '"Geist", sans-serif',
        fontSize: 'clamp(140px, 18vw, 240px)',
        fontWeight: 900,
        lineHeight: 1,
        color: 'rgba(255, 255, 255, 0.08)',
        userSelect: 'none',
        pointerEvents: 'none',
        letterSpacing: '-0.06em',
      }}
    >
      01
    </div>

    {/* Center Right Graphic Typography Block */}
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        maxWidth: '72%',
      }}
    >
      {/* Subhead / Concept in Italic Serif */}
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 2.6vw, 32px)',
          color: '#D8FF00',
          lineHeight: 1.15,
          marginBottom: '8px',
        }}
      >
        High-intent conversations over empty clicks.
      </div>

      {/* Main Bold Graphic Poster Headline */}
      <h2
        style={{
          fontFamily: '"Geist", -apple-system, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(36px, 4.6vw, 62px)',
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          margin: '0 0 18px',
          textShadow: '0 12px 32px rgba(0,0,0,0.4)',
        }}
      >
        SOCIAL<br />MEDIA<br />
        <span style={{ color: '#D8FF00' }}>ANALYTICS</span>
      </h2>

      {/* Graphic Badges Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Neon Rotated Sticker */}
        <div
          style={{
            background: '#D8FF00',
            color: '#060C38',
            fontFamily: '"Geist Mono", monospace',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '0.04em',
            padding: '7px 16px',
            borderRadius: '6px',
            transform: 'rotate(-2.5deg)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          +38.4% QUALIFIED LEADS ↗
        </div>

        {/* Translucent Glass Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.24)',
            color: '#FFFFFF',
            fontFamily: '"Geist Mono", monospace',
            fontSize: '11.5px',
            fontWeight: 500,
            padding: '7px 14px',
            borderRadius: '6px',
          }}
        >
          9.2% CONVERSION RATE
        </div>
      </div>
    </div>
  </div>
);

// POSTER 2: EXECUTIVE BRIEFS (Radiant Hot Tangerine & Solar Yellow)
const MonthlyBriefVisual: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #FF4500 0%, #E62A00 45%, #660A00 100%)',
      color: '#FFFFFF',
      fontFamily: '"Geist", -apple-system, sans-serif',
      boxSizing: 'border-box',
      padding: 'clamp(28px, 4vw, 48px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
    }}
  >
    {/* Diagonal Graphic Accent */}
    <div
      style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 230, 0, 0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />

    {/* Giant Background Watermark Number */}
    <div
      style={{
        position: 'absolute',
        left: '4%',
        bottom: '-8%',
        fontFamily: '"Geist", sans-serif',
        fontSize: 'clamp(140px, 18vw, 240px)',
        fontWeight: 900,
        lineHeight: 1,
        color: 'rgba(255, 255, 255, 0.08)',
        userSelect: 'none',
        pointerEvents: 'none',
        letterSpacing: '-0.06em',
      }}
    >
      02
    </div>

    {/* Center Right Graphic Typography Block */}
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        maxWidth: '72%',
      }}
    >
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 2.6vw, 32px)',
          color: '#FFE600',
          lineHeight: 1.15,
          marginBottom: '8px',
        }}
      >
        Plain English. Zero marketing jargon.
      </div>

      <h2
        style={{
          fontFamily: '"Geist", -apple-system, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(36px, 4.6vw, 62px)',
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          margin: '0 0 18px',
          textShadow: '0 12px 32px rgba(0,0,0,0.35)',
        }}
      >
        MONTHLY<br />EXECUTIVE<br />
        <span style={{ color: '#FFE600' }}>BRIEFS</span>
      </h2>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div
          style={{
            background: '#FFE600',
            color: '#1A0500',
            fontFamily: '"Geist Mono", monospace',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '0.04em',
            padding: '7px 16px',
            borderRadius: '6px',
            transform: 'rotate(2.5deg)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          100% SIGNAL // 0% NOISE
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            color: '#FFFFFF',
            fontFamily: '"Geist Mono", monospace',
            fontSize: '11.5px',
            fontWeight: 500,
            padding: '7px 14px',
            borderRadius: '6px',
          }}
        >
          DELIVERED 1ST MONDAY
        </div>
      </div>
    </div>
  </div>
);

// POSTER 3: VISITOR FLOW (New Color: Electric Hyper Cyan & Cerulean Aqua)
const VisitorFlowVisual: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 50%, #021B4A 100%)',
      color: '#FFFFFF',
      fontFamily: '"Geist", -apple-system, sans-serif',
      boxSizing: 'border-box',
      padding: 'clamp(28px, 4vw, 48px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
    }}
  >
    {/* Geometric Vector Radar Rings */}
    <div
      style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        border: '1px dashed rgba(255, 255, 255, 0.18)',
        pointerEvents: 'none',
      }}
    />

    {/* Giant Background Watermark Number */}
    <div
      style={{
        position: 'absolute',
        left: '4%',
        bottom: '-8%',
        fontFamily: '"Geist", sans-serif',
        fontSize: 'clamp(140px, 18vw, 240px)',
        fontWeight: 900,
        lineHeight: 1,
        color: 'rgba(255, 255, 255, 0.08)',
        userSelect: 'none',
        pointerEvents: 'none',
        letterSpacing: '-0.06em',
      }}
    >
      03
    </div>

    {/* Center Right Graphic Typography Block */}
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        maxWidth: '72%',
      }}
    >
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 2.6vw, 32px)',
          color: '#00F5FF',
          lineHeight: 1.15,
          marginBottom: '8px',
        }}
      >
        Where visitors arrive and why they stay.
      </div>

      <h2
        style={{
          fontFamily: '"Geist", -apple-system, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(36px, 4.6vw, 62px)',
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          margin: '0 0 18px',
          textShadow: '0 12px 32px rgba(0,0,0,0.35)',
        }}
      >
        VISITOR<br />JOURNEY<br />
        <span style={{ color: '#00F5FF' }}>&amp; FLOW</span>
      </h2>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div
          style={{
            background: '#00F5FF',
            color: '#021B38',
            fontFamily: '"Geist Mono", monospace',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '0.04em',
            padding: '7px 16px',
            borderRadius: '6px',
            transform: 'rotate(-2deg)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          72% STAGE RETENTION ↗
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            color: '#FFFFFF',
            fontFamily: '"Geist Mono", monospace',
            fontSize: '11.5px',
            fontWeight: 500,
            padding: '7px 14px',
            borderRadius: '6px',
          }}
        >
          ZERO DROP-OFF SURPRISES
        </div>
      </div>
    </div>
  </div>
);

// POSTER 4: COMPETITOR WATCH (New Color: Hot Neon Crimson & Solar Gold)
const CompetitorWatchVisual: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #FF0055 0%, #E6004C 50%, #4D0017 100%)',
      color: '#FFFFFF',
      fontFamily: '"Geist", -apple-system, sans-serif',
      boxSizing: 'border-box',
      padding: 'clamp(28px, 4vw, 48px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
    }}
  >
    {/* Geometric Crosshair Accents */}
    <div
      style={{
        position: 'absolute',
        top: '15%',
        right: '25%',
        fontSize: '28px',
        color: 'rgba(255, 255, 255, 0.2)',
        fontFamily: '"Geist Mono", monospace',
        userSelect: 'none',
      }}
    >
      +
    </div>

    {/* Giant Background Watermark Number */}
    <div
      style={{
        position: 'absolute',
        left: '4%',
        bottom: '-8%',
        fontFamily: '"Geist", sans-serif',
        fontSize: 'clamp(140px, 18vw, 240px)',
        fontWeight: 900,
        lineHeight: 1,
        color: 'rgba(255, 255, 255, 0.08)',
        userSelect: 'none',
        pointerEvents: 'none',
        letterSpacing: '-0.06em',
      }}
    >
      04
    </div>

    {/* Center Right Graphic Typography Block */}
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        maxWidth: '72%',
      }}
    >
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 2.6vw, 32px)',
          color: '#FFD600',
          lineHeight: 1.15,
          marginBottom: '8px',
        }}
      >
        Untapped gaps competitors miss.
      </div>

      <h2
        style={{
          fontFamily: '"Geist", -apple-system, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(36px, 4.6vw, 62px)',
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          margin: '0 0 18px',
          textShadow: '0 12px 32px rgba(0,0,0,0.35)',
        }}
      >
        MARKET<br />WATCH &amp;<br />
        <span style={{ color: '#FFD600' }}>BENCHMARKS</span>
      </h2>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div
          style={{
            background: '#FFD600',
            color: '#33000E',
            fontFamily: '"Geist Mono", monospace',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '0.04em',
            padding: '7px 16px',
            borderRadius: '6px',
            transform: 'rotate(2.5deg)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          3.4X VELOCITY ADVANTAGE
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            color: '#FFFFFF',
            fontFamily: '"Geist Mono", monospace',
            fontSize: '11.5px',
            fontWeight: 500,
            padding: '7px 14px',
            borderRadius: '6px',
          }}
        >
          FOUNDER BENCHMARKS
        </div>
      </div>
    </div>
  </div>
);

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDetail, setSelectedDetail] = useState<AnalyticsDetailItem | null>(null);

  const total = ACCORDION_ITEMS.length;

  const goTo = useCallback((idx: number) => {
    setActiveIndex(Math.max(0, Math.min(idx, total - 1)));
  }, [total]);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev >= total - 1 ? 0 : prev + 1));
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? total - 1 : prev - 1));
  }, [total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  const activeItem = ACCORDION_ITEMS[activeIndex];

  return (
    <section
      id="analytics"
      className={`analytics-section ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        maxWidth: '1320px',
        width: '100%',
        margin: 'clamp(84px, 12vh, 140px) auto',
        padding: '0 clamp(20px, 4vw, 48px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '100px',
        textAlign: 'left',
        outline: 'none',
      }}
    >
      <style>{`
        .framer-accordion-container {
          position: relative;
          width: 100%;
          min-height: 600px;
          height: clamp(560px, 68vh, 660px);
          box-sizing: border-box;
        }
        .framer-accordion-image-panel {
          position: absolute;
          right: 0;
          top: 6%;
          width: 66%;
          height: 86%;
          border-radius: 24px;
          overflow: hidden;
          background-color: #050a17;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
        }
        .framer-accordion-card {
          position: absolute;
          left: 0;
          top: 14%;
          width: 50%;
          height: 72%;
          padding: clamp(28px, 3.2vw, 42px);
          box-sizing: border-box;
          border-radius: 24px;
          background-color: #FFFFFF;
          color: #111827;
          border: 1px solid #E5E7EB;
          box-shadow: 0 24px 56px rgba(0, 0, 0, 0.35);
          z-index: 3;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          overflow: hidden;
        }
        .framer-accordion-nav {
          position: absolute;
          left: 0;
          bottom: 4px;
          display: flex;
          align-items: center;
          gap: 20px;
          z-index: 5;
        }
        @media (max-width: 960px) {
          .framer-accordion-container {
            height: auto;
            min-height: unset;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .framer-accordion-image-panel {
            position: relative;
            top: 0;
            right: 0;
            width: 100%;
            height: 340px;
            border-radius: 20px;
          }
          .framer-accordion-card {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            border-radius: 20px;
            padding: 24px 22px;
          }
          .framer-accordion-nav {
            position: relative;
            left: 0;
            bottom: 0;
            margin-top: 8px;
          }
        }
        .framer-accordion-tab-btn {
          appearance: none;
          border: none;
          outline: none;
          background: transparent;
          cursor: pointer;
          font-family: "Geist", -apple-system, sans-serif;
          font-size: 14px;
          padding: 0 0 10px;
          flex-shrink: 0;
          white-space: nowrap;
          transition: color 0.25s ease, border-color 0.25s ease;
        }
      `}</style>

      {/* ── SECTION HEADER: CONSISTENT EDITORIAL TITLE ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          marginBottom: 'clamp(28px, 4.5vh, 42px)',
          textAlign: 'left',
          paddingLeft: '0',
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
          Analytics in simple words.
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
          3. Analytics
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
            maxWidth: '680px',
            fontWeight: 400,
            textAlign: 'left',
          }}
        >
          What we track, why it matters, and how we turn complex digital traffic into straightforward business decisions.
        </motion.p>
      </div>

      {/* ── FRAMER FLEXIBLE ACCORDION (ASYMMETRIC TABS COMPONENT) ── */}
      <div className="framer-accordion-container">
        {/* RIGHT PANEL: BESPOKE LIVE SVG/CSS ANALYTICS VISUALIZER (NON-AI) */}
        <div className="framer-accordion-image-panel">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{ width: '100%', height: '100%', position: 'relative' }}
            >
              {activeIndex === 0 && <SocialReachVisual />}
              {activeIndex === 1 && <MonthlyBriefVisual />}
              {activeIndex === 2 && <VisitorFlowVisual />}
              {activeIndex === 3 && <CompetitorWatchVisual />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* LEFT PANEL: OVERLAPPING WHITE ASYMMETRIC CARD */}
        <div className="framer-accordion-card">
          {/* Top Row: Horizontal Tabs (Minimal font, non-bold) */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '22px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              borderBottom: '1px solid #F3F4F6',
              paddingBottom: '4px',
            }}
          >
            {ACCORDION_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className="framer-accordion-tab-btn"
                  style={{
                    color: isActive ? '#111827' : '#6B7280',
                    borderBottom: isActive ? '1.5px solid #111827' : '1.5px solid transparent',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {item.tab}
                </button>
              );
            })}
          </div>

          {/* Middle Row: Animated Copy (Minimal typography, non-bold) */}
          <div style={{ padding: '24px 0 16px', minHeight: 0, flex: 1, overflow: 'hidden' }}>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ width: '100%' }}
              >
                {/* Eyebrow */}
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#2563EB',
                    marginBottom: '10px',
                  }}
                >
                  {activeItem.eyebrow}
                </div>

                {/* Title: Minimal, non-bold editorial title */}
                <h3
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(26px, 2.8vw, 36px)',
                    fontWeight: 400,
                    lineHeight: 1.18,
                    letterSpacing: '-0.01em',
                    color: '#111827',
                    margin: '0 0 14px',
                  }}
                >
                  {activeItem.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: '"Geist", -apple-system, sans-serif',
                    fontSize: '14.5px',
                    lineHeight: 1.6,
                    color: '#4B5563',
                    margin: 0,
                    fontWeight: 400,
                    maxWidth: '440px',
                  }}
                >
                  {activeItem.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Row: Call-to-action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #F3F4F6',
            }}
          >
            {/* Primary Action: View Deep Breakdown Modal */}
            <button
              type="button"
              onClick={() => setSelectedDetail(activeItem.analyticsItem)}
              style={{
                appearance: 'none',
                border: 'none',
                outline: 'none',
                height: '42px',
                padding: '0 20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '999px',
                backgroundColor: '#111827',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              className="hover:bg-black"
            >
              <span>Explore Breakdown</span>
              <ArrowRight size={14} />
            </button>

            {/* Secondary Action: Book a Call on Calendly */}
            <a
              href="https://calendly.com/youdecide-std/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#111827',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 0',
                borderBottom: '1px solid #111827',
                transition: 'opacity 0.2s ease',
              }}
              className="hover:opacity-75"
            >
              <span>Book a 30-min Call</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* BOTTOM NAVIGATION: COUNTER & ARROWS */}
        <div className="framer-accordion-nav">
          <div
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.08em',
              minWidth: '50px',
            }}
          >
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous tab"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
              className="hover:bg-white/15"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next tab"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#FFFFFF',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              className="hover:opacity-90"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── FULL SCREEN DETAILED VIEW MODAL ── */}
      <AnalyticsDetail item={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </section>
  );
};

export default AnalyticsSection;
