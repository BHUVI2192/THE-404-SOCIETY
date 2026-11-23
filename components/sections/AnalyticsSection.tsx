// Analytics Section — Sharp Bento Gallery Showcase
// 100% Sharp corners (no rounded boxes or corners), white subtitles with black text,
// zero symbols, zero emojis, editorial bento gallery matching the site's aesthetic.

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface AnalyticsSectionProps {
  className?: string;
}

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

      {/* ── BENTO GALLERY GRID (ZERO ROUNDED CORNERS) ── */}
      <div className="analytics-bento-grid">
        {/* ── BENTO TILE 1: FEATURED HERO (SOCIAL MEDIA FOR COMPANIES) ── */}
        <motion.div
          className="bento-tile bento-hero"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHoveredCard('social')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            backgroundColor:
              hoveredCard === 'social'
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(255, 255, 255, 0.015)',
            border:
              hoveredCard === 'social'
                ? '1px solid rgba(255, 255, 255, 0.28)'
                : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 0,
            padding: 'clamp(26px, 3.8vh, 36px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s, border-color 0.25s, transform 0.25s',
            transform: hoveredCard === 'social' ? 'translateY(-3px)' : 'none',
          }}
        >
          <div>
            {/* Subtitle: White Box With Name Written In Black */}
            <div style={{ marginBottom: '18px' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  display: 'inline-block',
                  borderRadius: 0,
                }}
              >
                Social Media for Companies
              </span>
            </div>

            <h3
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                fontWeight: 600,
                lineHeight: 1.25,
                color: '#FFFFFF',
                margin: '0 0 14px',
                letterSpacing: '-0.01em',
              }}
            >
              Know which posts actually bring customers
            </h3>

            <p
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: '15px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0 0 24px',
                maxWidth: '680px',
              }}
            >
              We track your company Instagram, LinkedIn, YouTube, and X accounts. We reveal what
              content captures attention, who is watching, and what turns viewers into paying clients
              instead of empty likes.
            </p>

            {/* Sub-Bento Mini Grid with Sharp Rectangles */}
            <div className="bento-subgrid">
              <div className="bento-subitem">
                <div className="bento-subitem-title">Content Reach</div>
                <div className="bento-subitem-desc">Audience attention on every post</div>
              </div>
              <div className="bento-subitem">
                <div className="bento-subitem-title">Real Engagement</div>
                <div className="bento-subitem-desc">Active comments, shares, and saves</div>
              </div>
              <div className="bento-subitem">
                <div className="bento-subitem-title">Business Leads</div>
                <div className="bento-subitem-desc">Direct enquiries that drive revenue</div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px',
              marginTop: '24px',
              fontFamily: '"Geist Mono", monospace',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Channels covered: Instagram, LinkedIn, X, YouTube
          </div>
        </motion.div>

        {/* ── BENTO TILE 2: 1-PAGE MONTHLY BRIEFS ── */}
        <motion.div
          className="bento-tile bento-side"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHoveredCard('reports')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            backgroundColor:
              hoveredCard === 'reports'
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(255, 255, 255, 0.015)',
            border:
              hoveredCard === 'reports'
                ? '1px solid rgba(255, 255, 255, 0.28)'
                : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 0,
            padding: 'clamp(26px, 3.8vh, 36px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s, border-color 0.25s, transform 0.25s',
            transform: hoveredCard === 'reports' ? 'translateY(-3px)' : 'none',
          }}
        >
          <div>
            {/* Subtitle: White Box With Name Written In Black */}
            <div style={{ marginBottom: '18px' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  display: 'inline-block',
                  borderRadius: 0,
                }}
              >
                Monthly Briefs
              </span>
            </div>

            <h3
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: 'clamp(20px, 2vw, 24px)',
                fontWeight: 600,
                lineHeight: 1.3,
                color: '#FFFFFF',
                margin: '0 0 12px',
              }}
            >
              Reports you can read in two minutes
            </h3>

            <p
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.65)',
                margin: '0 0 20px',
              }}
            >
              No fifty page files full of buzzwords. Every month you receive a clean summary of what
              worked, what did not, and three simple actions for next month.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="bento-tag">One page summary</div>
              <div className="bento-tag">Plain language conclusions</div>
              <div className="bento-tag">Three clear next steps</div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px',
              marginTop: '24px',
              fontFamily: '"Geist Mono", monospace',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Delivered monthly in plain language
          </div>
        </motion.div>

        {/* ── BENTO TILE 3: WEBSITE VISITOR FLOW ── */}
        <motion.div
          className="bento-tile bento-half"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHoveredCard('website')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            backgroundColor:
              hoveredCard === 'website'
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(255, 255, 255, 0.015)',
            border:
              hoveredCard === 'website'
                ? '1px solid rgba(255, 255, 255, 0.28)'
                : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 0,
            padding: 'clamp(26px, 3.8vh, 36px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s, border-color 0.25s, transform 0.25s',
            transform: hoveredCard === 'website' ? 'translateY(-3px)' : 'none',
          }}
        >
          <div>
            {/* Subtitle: White Box With Name Written In Black */}
            <div style={{ marginBottom: '18px' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  display: 'inline-block',
                  borderRadius: 0,
                }}
              >
                Website Visitor Flow
              </span>
            </div>

            <h3
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: 'clamp(20px, 2vw, 24px)',
                fontWeight: 600,
                lineHeight: 1.3,
                color: '#FFFFFF',
                margin: '0 0 12px',
              }}
            >
              See where your visitors come from and why they stay
            </h3>

            <p
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.65)',
                margin: '0 0 20px',
              }}
            >
              Understand how people find your site, which pages they spend time reading, and where
              they leave or contact you. No confusing dashboards, just clear answers.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <div className="bento-tag">Traffic sources</div>
              <div className="bento-tag">Most read pages</div>
              <div className="bento-tag">Button and form clicks</div>
              <div className="bento-tag">Mobile and desktop split</div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px',
              marginTop: '24px',
              fontFamily: '"Geist Mono", monospace',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Visitor path: Visits to reading time to customer enquiries
          </div>
        </motion.div>

        {/* ── BENTO TILE 4: COMPETITOR BENCHMARKS ── */}
        <motion.div
          className="bento-tile bento-half"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHoveredCard('market')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            backgroundColor:
              hoveredCard === 'market'
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(255, 255, 255, 0.015)',
            border:
              hoveredCard === 'market'
                ? '1px solid rgba(255, 255, 255, 0.28)'
                : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 0,
            padding: 'clamp(26px, 3.8vh, 36px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s, border-color 0.25s, transform 0.25s',
            transform: hoveredCard === 'market' ? 'translateY(-3px)' : 'none',
          }}
        >
          <div>
            {/* Subtitle: White Box With Name Written In Black */}
            <div style={{ marginBottom: '18px' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  display: 'inline-block',
                  borderRadius: 0,
                }}
              >
                Competitor Benchmarks
              </span>
            </div>

            <h3
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: 'clamp(20px, 2vw, 24px)',
                fontWeight: 600,
                lineHeight: 1.3,
                color: '#FFFFFF',
                margin: '0 0 12px',
              }}
            >
              Learn what works in your market before copying
            </h3>

            <p
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.65)',
                margin: '0 0 20px',
              }}
            >
              We examine what competitors in your field post and what gets real traction. We find
              the topics buyers search for so your company can post what truly matters.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <div className="bento-tag">Competitor growth</div>
              <div className="bento-tag">Trending post topics</div>
              <div className="bento-tag">Audience interests</div>
              <div className="bento-tag">Untapped content gaps</div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px',
              marginTop: '24px',
              fontFamily: '"Geist Mono", monospace',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Market comparison against direct competitors
          </div>
        </motion.div>

        {/* ── BENTO TILE 5: WIDE BOTTOM CALLOUT (ZERO ROUNDED CORNERS) ── */}
        <motion.div
          className="bento-tile bento-full"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          style={{
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
      </div>

      {/* ── BENTO GALLERY RESPONSIVE STYLES (STRICT 0PX BORDER RADIUS) ── */}
      <style>{`
        .analytics-bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
          width: 100%;
        }
        .bento-hero {
          grid-column: span 8;
        }
        .bento-side {
          grid-column: span 4;
        }
        .bento-half {
          grid-column: span 6;
        }
        .bento-full {
          grid-column: span 12;
        }
        .bento-subgrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 8px;
        }
        .bento-subitem {
          padding: 14px 16px;
          border-radius: 0 !important;
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
        }
        .bento-subitem-title {
          font-family: "Geist", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        .bento-subitem-desc {
          font-family: "Geist", sans-serif;
          font-size: 12px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.6);
        }
        .bento-tag {
          display: inline-block;
          font-family: "Geist", sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          padding: 7px 14px;
          border-radius: 0 !important;
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
        }
        @media (max-width: 960px) {
          .bento-hero,
          .bento-side,
          .bento-half,
          .bento-full {
            grid-column: span 12 !important;
          }
          .bento-subgrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AnalyticsSection;
