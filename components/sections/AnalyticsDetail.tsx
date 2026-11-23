// Full-Screen Page View for Analytics Details
// Displays deep plain-language breakdown of social media analytics for companies,
// website visitor flow, competitor benchmarks, and monthly performance briefs.

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface AnalyticsDetailItem {
  id: string;
  number: string;
  cardTitle: string;
  heroHeadline: string;
  summary: string;
  whatItSolves: string;
  channels: string[];
  whatWeTrack: string[];
  deliverables: string[];
  whyItMatters: string;
}

export const ANALYTICS_ITEMS: AnalyticsDetailItem[] = [
  {
    id: 'social-media',
    number: '01',
    cardTitle: 'Social Media Analytics',
    heroHeadline: 'Social Media Analytics for Companies',
    summary:
      'We track what content actually turns into customer conversations, sales enquiries, and brand authority instead of empty likes and vanity numbers.',
    whatItSolves:
      'Most companies post on social media without knowing whether anyone who views their posts actually intends to buy. We eliminate the guesswork by connecting your company posts directly to visitor actions and customer enquiries.',
    channels: ['Instagram', 'LinkedIn', 'YouTube', 'X'],
    whatWeTrack: [
      'Real audience engagement from business decision makers',
      'Follower growth rate and audience retention',
      'Which content formats drive visitors to your website',
      'Posts that generate inbound direct messages and enquiries',
      'Active times when your target buyers are browsing',
    ],
    deliverables: [
      'One page monthly performance summary',
      'Breakdown of top performing content pillars',
      'Three prioritized action steps for next month',
      'Clear list of post formats to stop wasting time on',
    ],
    whyItMatters:
      'Stop spending company hours on content that gets silent views. Direct your team energy strictly toward the topics and formats that produce paying customers.',
  },
  {
    id: 'monthly-briefs',
    number: '02',
    cardTitle: 'Monthly Performance Briefs',
    heroHeadline: 'One-Page Monthly Performance Briefs',
    summary:
      'Reports you can read in two minutes. A clean summary of what worked, what did not, and three simple action steps for next month in plain words.',
    whatItSolves:
      'Nobody on a leadership team has time to decode fifty-page PDF reports filled with marketing buzzwords. We translate all your digital numbers into clean, human language that informs immediate business decisions.',
    channels: ['All Digital Channels Unified', 'Executive Summary'],
    whatWeTrack: [
      'Month over month business lead and enquiry growth',
      'Return on effort across each social and web channel',
      'Key customer acquisition milestones',
      'Testing results from new content experiments',
    ],
    deliverables: [
      'Single page executive summary',
      'Plain language conclusions with zero marketing jargon',
      'Three concrete action items for the upcoming sprint',
      'Direct walkthrough on request',
    ],
    whyItMatters:
      'Total clarity on your company digital growth in two minutes every month without needing technical analytics expertise.',
  },
  {
    id: 'visitor-flow',
    number: '03',
    cardTitle: 'Website and Visitor Flow',
    heroHeadline: 'Website and Visitor Flow Analytics',
    summary:
      'See where your visitors come from, which pages hold their attention, and exactly where they leave or reach out to your team.',
    whatItSolves:
      'Traditional analytics software is cluttered with hundreds of menus, obscure metrics, and complex graphs. We highlight the core numbers that show why visitors stay on your website or leave without contacting you.',
    channels: ['Company Websites', 'Landing Pages', 'Product Portals'],
    whatWeTrack: [
      'Traffic sources (organic search, social channels, direct referrals)',
      'Pages that hold attention the longest',
      'Button clicks and contact form completions',
      'Drop-off points where visitors abandon reading',
      'Mobile and desktop experience differences',
    ],
    deliverables: [
      'Clear visitor journey maps',
      'Conversion bottleneck identification',
      'Page by page engagement review',
      'Actionable checklist to improve contact rates',
    ],
    whyItMatters:
      'Getting traffic to your website is only half the battle. Knowing why visitors stay or leave is how you convert casual traffic into active revenue.',
  },
  {
    id: 'competitor-watch',
    number: '04',
    cardTitle: 'Competitor Benchmarks',
    heroHeadline: 'Market and Competitor Benchmarks',
    summary:
      'Learn what other companies in your field are doing well and what falls flat so your brand can capture buyer attention.',
    whatItSolves:
      'Instead of copying competitors blindly, we track what their audience genuinely responds to. We identify the topics they ignore so your company can step in and own the conversation.',
    channels: ['Direct Competitors', 'Industry Leaders', 'Market Search Trends'],
    whatWeTrack: [
      'Competitor audience growth and engagement rates',
      'Their highest performing post types and formats',
      'Audience sentiment and recurring customer questions',
      'Emerging search topics gaining momentum in your field',
      'Untapped content gaps in your market',
    ],
    deliverables: [
      'Side by side competitor benchmark report',
      'Trending topic and format directory',
      'Untapped content opportunity list',
      'Quarterly market positioning brief',
    ],
    whyItMatters:
      'Stay two steps ahead of your competition with hard data on what is capturing attention in your market right now.',
  },
];

interface AnalyticsDetailProps {
  item: AnalyticsDetailItem | null;
  onClose: () => void;
}

export const AnalyticsDetail: React.FC<AnalyticsDetailProps> = ({ item, onClose }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key listener & body scroll lock with Lenis synchronization
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const savedScrollY = window.scrollY;
    const lenis = (window as any).__lenis || (window as any).lenis;
    lenis?.stop();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      lenis?.start();
      lenis?.resize?.();
    };
  }, [item, onClose]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = 'contact';
      }
    }, 280);
  };

  const pageContent = (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="analytics-page-title"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            fontFamily: 'Geist, -apple-system, sans-serif',
          }}
        >
          {/* ── STICKY TOP NAVIGATION BAR (SHARP EDGES) ── */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '18px clamp(20px, 4vw, 56px)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                maxWidth: '1280px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Back to Analytics Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to Analytics"
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 0,
                  color: '#FFFFFF',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.borderColor = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                Back to Analytics
              </button>

              {/* Breadcrumb Index */}
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                {item.number} / Analytics
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT CONTAINER (SHARP & EDITORIAL) ── */}
          <div
            style={{
              maxWidth: '1280px',
              width: '100%',
              margin: '0 auto',
              padding:
                'clamp(36px, 5vh, 64px) clamp(20px, 4vw, 56px) clamp(64px, 8vh, 100px)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
            }}
          >
            {/* Subtitle Badge: White Box With Black Text */}
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '5px 12px',
                  display: 'inline-block',
                  borderRadius: 0,
                }}
              >
                Analytics Service {item.number}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              id="analytics-page-title"
              style={{
                fontFamily: '"Instrument Serif", serif',
                fontStyle: 'italic',
                fontSize: 'clamp(40px, 6vw, 84px)',
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: '0 0 20px',
              }}
            >
              {item.heroHeadline}
            </h1>

            {/* Summary */}
            <p
              style={{
                fontFamily: '"Geist", sans-serif',
                fontSize: 'clamp(18px, 2vw, 22px)',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 48px',
                maxWidth: '820px',
              }}
            >
              {item.summary}
            </p>

            {/* ── EDITORIAL GRID: FULL DETAILS ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
                gap: 'clamp(32px, 4vw, 56px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                paddingTop: '40px',
                marginBottom: '48px',
              }}
            >
              {/* Left Column: What It Solves & Why It Matters */}
              <div>
                <div style={{ marginBottom: '40px' }}>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '12px',
                    }}
                  >
                    What This Solves
                  </div>
                  <p
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: '16px',
                      lineHeight: 1.65,
                      color: 'rgba(255, 255, 255, 0.85)',
                      margin: 0,
                    }}
                  >
                    {item.whatItSolves}
                  </p>
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '12px',
                    }}
                  >
                    Channels Covered
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {item.channels.map((ch, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#FFFFFF',
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '6px 14px',
                          borderRadius: 0,
                        }}
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '12px',
                    }}
                  >
                    Why This Matters
                  </div>
                  <p
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: '16px',
                      lineHeight: 1.65,
                      color: 'rgba(255, 255, 255, 0.85)',
                      margin: 0,
                    }}
                  >
                    {item.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Right Column: What We Track & What You Receive */}
              <div>
                <div style={{ marginBottom: '40px' }}>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '14px',
                    }}
                  >
                    What We Track and Measure
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {item.whatWeTrack.map((trackItem, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 0,
                          fontFamily: '"Geist", sans-serif',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          color: '#FFFFFF',
                        }}
                      >
                        {trackItem}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '14px',
                    }}
                  >
                    What Your Company Receives
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {item.deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 0,
                          fontFamily: '"Geist", sans-serif',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          color: '#FFFFFF',
                        }}
                      >
                        {deliv}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── BOTTOM CALLOUT ACTION (SHARP 0PX) ── */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                paddingTop: '36px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginBottom: '4px',
                  }}
                >
                  Ready to see your company numbers clearly
                </div>
                <div
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.65)',
                  }}
                >
                  We will analyze your social profiles or website and deliver an honest breakdown.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="#contact"
                  onClick={handleCtaClick}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '14px 24px',
                    borderRadius: 0,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.85';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  Request Analytics Review
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '14px 20px',
                    borderRadius: 0,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(pageContent, document.body);
};

export default AnalyticsDetail;
