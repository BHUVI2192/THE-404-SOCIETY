// Analytics Section — Pure White Bento Grid
// Clean complete white background bento grid with single title text.
// When clicked, smoothly opens a dedicated full page with complete detailed information.
// Zero rounded corners, zero symbols, zero emojis.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsDetail, AnalyticsDetailItem, ANALYTICS_ITEMS } from './AnalyticsDetail';

export interface AnalyticsSectionProps {
  className?: string;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ className = '' }) => {
  const [selectedItem, setSelectedItem] = useState<AnalyticsDetailItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Bento layout mapping
  const bentoGridConfig: { [key: string]: { colSpan: number; minHeight: string } } = {
    'social-media': { colSpan: 8, minHeight: 'clamp(240px, 28vh, 320px)' },
    'monthly-briefs': { colSpan: 4, minHeight: 'clamp(240px, 28vh, 320px)' },
    'visitor-flow': { colSpan: 6, minHeight: 'clamp(220px, 24vh, 280px)' },
    'competitor-watch': { colSpan: 6, minHeight: 'clamp(220px, 24vh, 280px)' },
  };

  return (
    <section
      id="analytics"
      className={`analytics-section ${className}`}
      style={{
        maxWidth: '1320px',
        width: '100%',
        margin: 'clamp(40px, 5.5vh, 64px) auto',
        padding: '0 clamp(24px, 5vw, 64px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '84px',
        textAlign: 'left',
      }}
    >
      {/* ── SECTION HEADER: SHARP, EDITORIAL & LEFT-ALIGNED (OF CENTERED CONTENT) ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          marginBottom: 'clamp(32px, 5vh, 48px)',
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
            maxWidth: '720px',
            fontWeight: 400,
            textAlign: 'left',
          }}
        >
          We do social media analytics for companies, track website growth, and break down what your
          audience actually cares about in simple everyday words.
        </motion.p>
      </div>

      {/* ── BENTO GRID: CLEAN COMPLETE WHITE BACKGROUND WITH SLIGHTLY CURVED CORNERS ── */}
      <div
        className="analytics-white-bento-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {ANALYTICS_ITEMS.map((item, index) => {
          const isHovered = hoveredId === item.id;
          const config = bentoGridConfig[item.id] || { colSpan: 6, minHeight: '260px' };

          return (
            <motion.div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedItem(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(item);
                }
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{
                gridColumn: `span ${config.colSpan}`,
                minHeight: config.minHeight,
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                padding: 'clamp(28px, 4vh, 44px)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                transform: isHovered ? 'translateY(-3px)' : 'none',
                boxShadow: isHovered
                  ? '0 20px 48px rgba(0, 0, 0, 0.35)'
                  : '0 4px 16px rgba(0, 0, 0, 0.12)',
              }}
            >
              {/* Minimal Top Index */}
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isHovered ? '#000000' : '#888888',
                  transition: 'color 0.2s ease',
                }}
              >
                {item.number} / Analytics
              </div>

              {/* Just A Single Clean Bold Text of That Analytics Area */}
              <div style={{ margin: 'auto 0' }}>
                <h3
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize:
                      config.colSpan >= 8
                        ? 'clamp(28px, 3.4vw, 46px)'
                        : 'clamp(22px, 2.5vw, 34px)',
                    fontWeight: 600,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    color: '#000000',
                    margin: 0,
                  }}
                >
                  {item.cardTitle}
                </h3>
              </div>

              {/* Minimal Bottom Prompt */}
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isHovered ? '#000000' : '#999999',
                  transition: 'color 0.2s ease',
                }}
              >
                Tap for complete detailed information
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── FULL SCREEN DETAILED VIEW MODAL ── */}
      <AnalyticsDetail item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* ── RESPONSIVE GRID STYLES (STRICT 0PX BORDER RADIUS) ── */}
      <style>{`
        @media (max-width: 960px) {
          .analytics-white-bento-grid > div {
            grid-column: span 12 !important;
            min-height: 200px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AnalyticsSection;
