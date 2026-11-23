// Analytics Section — Framer BentoGallery Implementation
// Integrates the Framer BentoGallery component (https://framer.com/m/BentoGallery-T6VH.js@MaI7yHbDqGVoRWLiezpW)
// High-contrast, sharp 0px corners, white subtitles with black text, zero symbols, zero emojis.

import React from 'react';
import { motion } from 'framer-motion';
import { BentoGallery, BentoGalleryItem } from '../BentoGallery';

export interface AnalyticsSectionProps {
  className?: string;
}

const ANALYTICS_BENTO_ITEMS: BentoGalleryItem[] = [
  {
    id: 'social-media',
    subtitle: 'Social Media for Companies',
    title: 'Know which posts actually bring customers',
    description:
      'We track your company Instagram, LinkedIn, YouTube, and X accounts. We reveal what content captures attention, who is watching, and what turns viewers into paying clients instead of empty likes.',
    image: 'https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg',
    colSpan: 8,
    highlights: [
      { title: 'Content Reach', desc: 'Audience attention on every post' },
      { title: 'Real Engagement', desc: 'Active comments, shares, and saves' },
      { title: 'Business Leads', desc: 'Direct enquiries that drive revenue' },
    ],
    footer: 'Channels covered: Instagram, LinkedIn, X, YouTube',
  },
  {
    id: 'monthly-briefs',
    subtitle: 'Monthly Briefs',
    title: 'Reports you can read in two minutes',
    description:
      'No fifty page files full of buzzwords. Every month you receive a clean summary of what worked, what did not, and three simple actions for next month.',
    image: 'https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg',
    colSpan: 4,
    highlights: [
      'One page summary',
      'Plain language conclusions',
      'Three clear next steps',
    ],
    footer: 'Delivered monthly in plain language',
  },
  {
    id: 'visitor-flow',
    subtitle: 'Website Visitor Flow',
    title: 'See where your visitors come from and why they stay',
    description:
      'Understand how people find your site, which pages they spend time reading, and where they leave or contact you. No confusing dashboards, just clear answers.',
    image: 'https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg',
    colSpan: 6,
    highlights: [
      'Traffic sources',
      'Most read pages',
      'Button and form clicks',
      'Mobile and desktop split',
    ],
    footer: 'Visitor path: Visits to reading time to customer enquiries',
  },
  {
    id: 'competitor-watch',
    subtitle: 'Competitor Benchmarks',
    title: 'Learn what works in your market before copying',
    description:
      'We examine what competitors in your field post and what gets real traction. We find the topics buyers search for so your company can post what truly matters.',
    image: 'https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg',
    colSpan: 6,
    highlights: [
      'Competitor growth',
      'Trending post topics',
      'Audience interests',
      'Untapped content gaps',
    ],
    footer: 'Market comparison against direct competitors',
  },
];

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ className = '' }) => {
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
      {/* ── SECTION HEADER: SHARP & EDITORIAL ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          marginBottom: 'clamp(32px, 5vh, 48px)',
          paddingLeft: '0',
          textAlign: 'left',
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
          }}
        >
          Analytics in simple words.
        </motion.h2>

        {/* Section Subtitle: White Box With Name Written In Black */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '16px' }}
        >
          <span
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontFamily: '"Geist Mono", monospace',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              display: 'inline-block',
              borderRadius: 0,
            }}
          >
            3. Analytics
          </span>
        </motion.div>

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
          audience actually cares about in simple everyday words.
        </motion.p>
      </div>

      {/* ── FRAMER BENTO GALLERY COMPONENT ── */}
      <BentoGallery
        items={ANALYTICS_BENTO_ITEMS}
        gap={16}
        borderRadius={0}
        borderWidth={1}
        borderColor="rgba(255, 255, 255, 0.12)"
        backgroundColor="rgba(255, 255, 255, 0.015)"
        animationDuration={0.25}
      />

      {/* ── WIDE BOTTOM BENTO CALLOUT (SHARP 0PX EDGES) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginTop: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 0,
          padding: '24px 32px',
          boxSizing: 'border-box',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                display: 'inline-block',
                borderRadius: 0,
              }}
            >
              Free Review
            </span>
          </div>
          <div
            style={{
              fontFamily: '"Geist", sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#FFFFFF',
              marginBottom: '4px',
            }}
          >
            Want a quick look at your company numbers
          </div>
          <div
            style={{
              fontFamily: '"Geist", sans-serif',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: 1.5,
            }}
          >
            Share your company social profiles or website with us. We will prepare an honest
            breakdown with clear next steps in simple words.
          </div>
        </div>

        <a
          href="#contact"
          style={{
            display: 'inline-block',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontFamily: '"Geist Mono", monospace',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '12px 24px',
            borderRadius: 0,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.85';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'none';
          }}
        >
          Request Analytics Review
        </a>
      </motion.div>
    </section>
  );
};

export default AnalyticsSection;
