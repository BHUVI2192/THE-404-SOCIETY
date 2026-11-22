// Analytics & Business Intelligence Showcase Section
// Features the Framer PrismFlow Gallery WebGL component (https://framer.com/m/PrismFlow-Gallery-je0J8O.js@JzO5QHDXWcbkvA7vTCSS)
// Displays YouDecide Service Category 3: Analytics & Business Intelligence

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ANALYTICS_OFFERINGS, AnalyticsOffering } from '../../data/analytics';
import { PrismFlowGallery, PrismFlowItem } from '../PrismFlowGallery';
import { AnalyticsDetail } from './AnalyticsDetail';

export interface AnalyticsSectionProps {
  className?: string;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ className = '' }) => {
  const [selectedOffering, setSelectedOffering] = useState<AnalyticsOffering | null>(null);

  // Map offerings into PrismFlow gallery items
  const galleryItems: PrismFlowItem[] = ANALYTICS_OFFERINGS.map((offering) => ({
    id: offering.id,
    image: offering.image,
    title: offering.title,
    number: offering.number,
    category: offering.category,
  }));

  const handleItemSelect = (item: PrismFlowItem, _index: number) => {
    const found = ANALYTICS_OFFERINGS.find((o) => o.id === item.id);
    if (found) {
      setSelectedOffering(found);
    }
  };

  return (
    <section
      id="analytics"
      className={`analytics-showcase-section ${className}`}
      style={{
        maxWidth: '1320px',
        width: '100%',
        margin: 'clamp(72px, 11vh, 128px) 0',
        padding: '0 clamp(24px, 5vw, 64px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '110px',
      }}
    >
      {/* ── SECTION HEADER: BIG, CURSIVE & IN ONE LINE ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          marginBottom: 'clamp(28px, 4.5vh, 44px)',
          paddingLeft: '0',
        }}
      >
        {/* Main Title: Big & Cursive (Instrument Serif Italic) — In Single Line */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(26px, 4.5vw, 76px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: '0 0 10px',
            whiteSpace: 'nowrap',
          }}
        >
          Intelligence, beyond the numbers.
        </motion.h2>

        {/* 3. Analytics Subhead — Same size and styling as 1. Websites & 2. Automation */}
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

        {/* Supporting text */}
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
          We engineer enterprise dashboards, real-time telemetry pipelines, and automated reporting
          systems that convert complex data streams into decisive action.
        </motion.p>
      </div>

      {/* ── PRISM FLOW GALLERY WEBGL CAROUSEL ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          position: 'relative',
          marginBottom: '24px',
        }}
      >
        <PrismFlowGallery
          items={galleryItems}
          height="clamp(420px, 52vh, 580px)"
          onItemSelect={handleItemSelect}
          layout={{
            itemWidth: 1.25,
            itemHeight: 2.2,
            gap: 0.2,
            cameraZoom: 5.2,
            radius: 24,
          }}
          motion={{
            drag: true,
            dragSpeed: 0.75,
            wheel: true,
            wheelSpeed: 0.6,
            autoplay: true,
            autoplaySpeed: 0.14,
            pauseOnHover: true,
            loopMode: 'infinite',
            smoothness: 10,
          }}
          effects={{
            wave: true,
            wavePower: 0.85,
            vignette: true,
            vignetteOpacity: 0.3,
            edgeFade: true,
            edgeFadeOpacity: 0.4,
          }}
          close={{
            showHint: true,
            hintText: 'Click anywhere to close · Click card to view deep intelligence',
          }}
        />
      </motion.div>

      {/* ── OFFERINGS DIRECTORY / PILL NAVIGATION ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)',
            marginRight: '8px',
            flexShrink: 0,
          }}
        >
          Explore All 10:
        </div>
        {ANALYTICS_OFFERINGS.map((offering) => (
          <button
            key={offering.id}
            type="button"
            onClick={() => setSelectedOffering(offering)}
            style={{
              flexShrink: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '999px',
              padding: '8px 16px',
              fontFamily: '"Geist", sans-serif',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.75)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s, border-color 0.2s, color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: '11px',
                color: '#6169FF',
              }}
            >
              {offering.number}
            </span>
            <span>{offering.title}</span>
            <span style={{ fontSize: '10px', opacity: 0.5 }}>↗</span>
          </button>
        ))}
      </div>

      {/* ── DETAILED MODAL VIEW ── */}
      <AnalyticsDetail
        item={selectedOffering}
        onClose={() => setSelectedOffering(null)}
      />
    </section>
  );
};

export default AnalyticsSection;
