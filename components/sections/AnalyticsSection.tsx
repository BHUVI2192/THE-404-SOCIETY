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

/* ── BESPOKE CODE-DRIVEN ANALYTICAL VISUALIZERS (100% NON-AI) ── */

const SocialReachVisual: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      padding: 'clamp(24px, 3.5vw, 36px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'radial-gradient(circle at 80% 20%, #112048 0%, #050a17 100%)',
      color: '#FFFFFF',
      fontFamily: '"Geist", -apple-system, sans-serif',
    }}
  >
    {/* Top Bar with Live Indicator */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60A5FA', boxShadow: '0 0 10px #60A5FA' }} />
        <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '11px', letterSpacing: '0.12em', color: '#93C5FD', textTransform: 'uppercase' }}>
          Live Pipeline Conversion
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
        <TrendingUp size={14} color="#34D399" />
        <span style={{ color: '#34D399', fontWeight: 500 }}>+38.4%</span> vs last month
      </div>
    </div>

    {/* Metric Cards Row */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', margin: '18px 0' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px 16px' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>Qualified Leads</div>
        <div style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em' }}>142</div>
        <div style={{ fontSize: '11px', color: '#60A5FA', marginTop: '2px' }}>High-intent founders</div>
      </div>
      <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px 16px' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>Conversion Rate</div>
        <div style={{ fontSize: '24px', fontWeight: 600, color: '#34D399', letterSpacing: '-0.02em' }}>9.2%</div>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>3.1x agency avg</div>
      </div>
      <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px 16px' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>Call Bookings</div>
        <div style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em' }}>38</div>
        <div style={{ fontSize: '11px', color: '#93C5FD', marginTop: '2px' }}>Direct enquiries</div>
      </div>
    </div>

    {/* SVG Analytics Graph */}
    <div style={{ width: '100%', height: '140px', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 500 140" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Subtle grid lines */}
        <line x1="0" y1="35" x2="500" y2="35" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
        <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
        <line x1="0" y1="105" x2="500" y2="105" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

        {/* Shaded Area */}
        <path
          d="M0 120 C 60 110, 100 80, 160 85 C 220 90, 270 45, 340 50 C 400 55, 440 20, 500 15 L 500 140 L 0 140 Z"
          fill="url(#blueGlow)"
        />
        {/* Crisp Line */}
        <path
          d="M0 120 C 60 110, 100 80, 160 85 C 220 90, 270 45, 340 50 C 400 55, 440 20, 500 15"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Interactive Dots */}
        <circle cx="160" cy="85" r="4" fill="#60A5FA" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="340" cy="50" r="4" fill="#60A5FA" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="500" cy="15" r="5" fill="#34D399" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    </div>

    {/* Platform Conversion Share */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60A5FA' }} />
        <span>LinkedIn 54%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A78BFA' }} />
        <span>X / Twitter 28%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F472B6' }} />
        <span>Direct Enquiries 18%</span>
      </div>
    </div>
  </div>
);

const MonthlyBriefVisual: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      padding: 'clamp(24px, 3.5vw, 36px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'radial-gradient(circle at 75% 25%, #0f2240 0%, #060b18 100%)',
      color: '#FFFFFF',
      fontFamily: '"Geist", -apple-system, sans-serif',
    }}
  >
    {/* Executive Brief Header */}
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '11px', letterSpacing: '0.14em', color: '#93C5FD', textTransform: 'uppercase' }}>
          Monthly Executive Summary
        </span>
        <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '999px' }}>
          2 Min Read
        </span>
      </div>
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
        October Sprint Intelligence &amp; Action Plan
      </div>
    </div>

    {/* 3 Human Actionable Bullet Points */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 14px' }}>
        <CheckCircle size={18} color="#34D399" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Traffic to Discovery Call rose 42%</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Interactive prototype milestones removed upfront buyer friction.</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 14px' }}>
        <CheckCircle size={18} color="#60A5FA" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Pruned 3 zero-conversion content formats</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Redirected 16 engineering hours directly into founder teardown case studies.</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 14px' }}>
        <CheckCircle size={18} color="#A78BFA" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>3 Concrete actions for next sprint</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Publish live payment portal, launch client dashboard preview, expand founder FAQs.</div>
        </div>
      </div>
    </div>

    {/* Bottom Footer */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <span>Plain English · Zero buzzwords</span>
      <span style={{ color: '#60A5FA', fontWeight: 500 }}>Delivered 1st Monday of every month</span>
    </div>
  </div>
);

const VisitorFlowVisual: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      padding: 'clamp(24px, 3.5vw, 36px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'radial-gradient(circle at 75% 25%, #0f1c3f 0%, #060b17 100%)',
      color: '#FFFFFF',
      fontFamily: '"Geist", -apple-system, sans-serif',
    }}
  >
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart3 size={16} color="#60A5FA" />
        <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '11px', letterSpacing: '0.12em', color: '#93C5FD', textTransform: 'uppercase' }}>
          Visitor Journey &amp; Conversion Funnel
        </span>
      </div>
      <span style={{ fontSize: '12px', color: '#34D399', fontWeight: 500 }}>3m 42s avg session</span>
    </div>

    {/* Interactive 4-Stage Funnel Flow */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
      {[
        { step: '1. Traffic Sources', label: 'Direct Referrals & Search', val: '100%', count: '12,480 visits', color: '#60A5FA' },
        { step: '2. Engaged Viewers', label: 'Explored Websites & Automations', val: '72%', count: '8,985 readers', color: '#818CF8' },
        { step: '3. Prototype Review', label: 'Tested Live Demos & Pricing', val: '46%', count: '4,120 testers', color: '#A78BFA' },
        { step: '4. Direct Enquiry', label: 'Booked 30-Min Call / Contacted', val: '18.4%', count: '142 consultations', color: '#34D399' },
      ].map((f) => (
        <div key={f.step}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{f.step} · <span style={{ color: 'rgba(255,255,255,0.6)' }}>{f.label}</span></span>
            <span style={{ fontFamily: '"Geist Mono", monospace', color: f.color, fontWeight: 600 }}>{f.val} ({f.count})</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: f.val, height: '100%', background: f.color, borderRadius: '999px' }} />
          </div>
        </div>
      ))}
    </div>

    {/* Top Retention Pages */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <span>Highest retention: <strong style={{ color: '#FFFFFF' }}>/work (4m 12s)</strong></span>
      <span>Lowest drop-off: <strong style={{ color: '#34D399' }}>FAQ &amp; Pay As You Wish</strong></span>
    </div>
  </div>
);

const CompetitorWatchVisual: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      padding: 'clamp(24px, 3.5vw, 36px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'radial-gradient(circle at 75% 25%, #131d42 0%, #060a16 100%)',
      color: '#FFFFFF',
      fontFamily: '"Geist", -apple-system, sans-serif',
    }}
  >
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass size={16} color="#60A5FA" />
        <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '11px', letterSpacing: '0.12em', color: '#93C5FD', textTransform: 'uppercase' }}>
          Market Intelligence &amp; Benchmarks
        </span>
      </div>
      <span style={{ fontSize: '12px', color: '#34D399', fontWeight: 500 }}>Live market scan</span>
    </div>

    {/* Side-by-Side Comparison Metrics */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '16px 0' }}>
      {[
        { label: 'Turnaround Velocity', studio: '94%', market: '38%', note: '2-week sprint vs 10-week agency cycle' },
        { label: 'Decision Maker Engagement', studio: '86%', market: '24%', note: '3.6x higher founder reply rate' },
        { label: 'Client Retention Rate', studio: '98%', market: '52%', note: '100% full IP code handover' },
      ].map((m) => (
        <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500, color: '#FFFFFF', marginBottom: '8px' }}>
            <span>{m.label}</span>
            <span style={{ color: '#34D399', fontFamily: '"Geist Mono", monospace' }}>{m.studio} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>vs {m.market} market</span></span>
          </div>
          <div style={{ display: 'flex', gap: '6px', height: '6px', width: '100%' }}>
            <div style={{ width: m.studio, background: '#60A5FA', borderRadius: '4px' }} />
            <div style={{ width: m.market, background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }} />
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{m.note}</div>
        </div>
      ))}
    </div>

    {/* Market Opportunity Callout */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#93C5FD', background: 'rgba(96, 165, 250, 0.1)', padding: '8px 12px', borderRadius: '8px' }}>
      <span>★ Opportunity: Technical milestone demos generate 3.4x higher conversion than static portfolio images.</span>
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
