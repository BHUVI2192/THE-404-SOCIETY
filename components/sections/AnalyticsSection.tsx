// Analytics Section — Compact & Plain-English Analytics Showcase
// Displays social media analytics for companies, website insights, and market data in simple words.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  TrendingUp,
  Compass,
  FileText,
  ArrowRight,
  CheckCircle2,
  BarChart2,
} from 'lucide-react';

export interface AnalyticsSectionProps {
  className?: string;
}

interface AnalyticsCardItem {
  id: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  title: string;
  headline: string;
  description: string;
  metrics: string[];
  footerNote: string;
}

const ANALYTICS_CARDS: AnalyticsCardItem[] = [
  {
    id: 'social-media',
    badge: 'SOCIAL MEDIA FOR COMPANIES',
    badgeColor: '#60A5FA',
    icon: <Share2 size={20} color="#60A5FA" />,
    title: 'Social Media Analytics',
    headline: 'Know which posts actually bring customers.',
    description:
      'We track your company’s Instagram, LinkedIn, YouTube, and X accounts. We show you what content grabs real attention, who is watching, and what turns viewers into paying clients instead of just empty likes.',
    metrics: ['Reach & Impressions', 'Real Engagement Rate', 'Follower Growth', 'Content That Converts'],
    footerNote: 'Instagram · LinkedIn · X · YouTube',
  },
  {
    id: 'web-funnel',
    badge: 'WEBSITE & VISITOR FLOW',
    badgeColor: '#34D399',
    icon: <TrendingUp size={20} color="#34D399" />,
    title: 'Website & Funnel Insights',
    headline: 'See where your visitors come from and why they stay.',
    description:
      'Understand how people find your site, which pages they actually read, and where they leave or click to contact you. No confusing dashboards or bloated menus — just clear, honest answers.',
    metrics: ['Traffic Sources', 'Most Read Pages', 'Button & Form Clicks', 'Mobile vs Desktop Split'],
    footerNote: 'Visits → Reading Time → Enquiries',
  },
  {
    id: 'competitor-watch',
    badge: 'COMPETITOR BENCHMARKS',
    badgeColor: '#F59E0B',
    icon: <Compass size={20} color="#F59E0B" />,
    title: 'Market & Competitor Watch',
    headline: 'Learn what works in your market before copying.',
    description:
      'We look at what other companies in your field are doing well and what falls flat. We find the topics people are searching for so your company can post what actually matters to buyers.',
    metrics: ['Competitor Growth', 'Trending Formats', 'Audience Interests', 'Untapped Content Gaps'],
    footerNote: 'Benchmark against 3-5 rivals',
  },
  {
    id: 'simple-reports',
    badge: 'ZERO CONFUSION',
    badgeColor: '#A78BFA',
    icon: <FileText size={20} color="#A78BFA" />,
    title: '1-Page Monthly Briefs',
    headline: 'Reports you can read in 2 minutes.',
    description:
      'No 50-page PDFs full of marketing buzzwords. Every month, you get a clean one-page briefing: what worked, what didn’t, and 3 clear action steps for next month in simple language.',
    metrics: ['1-Page Summary', 'Plain English Takeaways', 'Clear Next Steps', 'No Confusing Jargon'],
    footerNote: 'Delivered monthly in plain language',
  },
];

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ className = '' }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="analytics"
      className={`analytics-section ${className}`}
      style={{
        maxWidth: '1320px',
        width: '100%',
        margin: 'clamp(72px, 11vh, 128px) 0',
        padding: '0 clamp(24px, 5vw, 64px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '110px',
        textAlign: 'left',
      }}
    >
      {/* ── SECTION HEADER: LEFT ALIGNED & CONSISTENT WITH WEBSITES & AUTOMATIONS ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          marginBottom: 'clamp(28px, 4.5vh, 44px)',
          paddingLeft: '0',
          textAlign: 'left',
        }}
      >
        {/* Main Title: Instrument Serif Italic */}
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
            margin: '0 0 10px',
          }}
        >
          Analytics, in simple words.
        </motion.h2>

        {/* 3. Analytics Subhead — Consistent with 1. Websites & 2. Automation */}
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
          }}
        >
          3. Analytics
        </motion.p>

        {/* Supporting description in plain simple words */}
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
          }}
        >
          We do social media analytics for companies, track website growth, and break down what your
          audience actually cares about — in simple, everyday words with zero confusing jargon.
        </motion.p>
      </div>

      {/* ── COMPACT 2x2 GRID OF ANALYTICS CARDS (IN SMALL) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
          width: '100%',
        }}
      >
        {ANALYTICS_CARDS.map((card, idx) => {
          const isHovered = hoveredCard === card.id;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: isHovered
                  ? 'rgba(255, 255, 255, 0.045)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: isHovered
                  ? '1px solid rgba(255, 255, 255, 0.18)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: 'clamp(22px, 3vh, 32px)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition:
                  'background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
                transform: isHovered ? 'translateY(-3px)' : 'none',
                boxShadow: isHovered
                  ? '0 16px 36px -12px rgba(0, 0, 0, 0.6)'
                  : '0 8px 24px -12px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle top ambient glow on hover */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: '1px',
                  background: isHovered
                    ? `linear-gradient(90deg, transparent, ${card.badgeColor}, transparent)`
                    : 'transparent',
                  transition: 'background 0.3s ease',
                }}
              />

              <div>
                {/* Header: Icon + Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </div>

                  <span
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: card.badgeColor,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Headline in simple words */}
                <h3
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: 'clamp(18px, 1.8vw, 22px)',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: '#FFFFFF',
                    margin: '0 0 10px',
                  }}
                >
                  {card.headline}
                </h3>

                {/* Body paragraph */}
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.55,
                    color: 'rgba(255, 255, 255, 0.65)',
                    margin: '0 0 20px',
                  }}
                >
                  {card.description}
                </p>

                {/* Key check bullets */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '8px 12px',
                    marginBottom: '22px',
                  }}
                >
                  {card.metrics.map((metric) => (
                    <div
                      key={metric}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: '"Geist", sans-serif',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <CheckCircle2
                        size={13}
                        style={{ color: card.badgeColor, flexShrink: 0 }}
                      />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom tag line */}
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.45)',
                }}
              >
                <span>{card.footerNote}</span>
                <span style={{ color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)' }}>
                  →
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── COMPACT BOTTOM CALLOUT BAR: REQUEST SIMPLE AUDIT ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginTop: 'clamp(24px, 3.5vh, 36px)',
          padding: '18px 24px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div
            style={{
              fontFamily: '"Geist", sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: '#FFFFFF',
              marginBottom: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <BarChart2 size={16} color="#60A5FA" />
            <span>Want a quick, clear look at your company's social numbers?</span>
          </div>
          <div
            style={{
              fontFamily: '"Geist", sans-serif',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: 1.45,
            }}
          >
            Send us your company's social handles or website. We’ll show you what’s working and what
            to fix in plain language.
          </div>
        </div>

        <a
          href="#contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            color: '#040711',
            fontFamily: '"Geist Mono", monospace',
            fontSize: '12px',
            fontWeight: 600,
            padding: '10px 18px',
            borderRadius: '999px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <span>Ask for Analytics Audit</span>
          <ArrowRight size={13} />
        </a>
      </motion.div>
    </section>
  );
};

export default AnalyticsSection;
