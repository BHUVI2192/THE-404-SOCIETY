// Full-Screen Dedicated Intelligence Breakdown for Analytics & Business Intelligence
// Displays the offering title in clean, elegant big letters (not bold, not italic),
// complete business data monitoring, relevant industry metrics, dashboard architecture,
// data integration pipeline, decision-maker profiles, strategic business value,
// and observable lead indicators with confirmed vs potential classification.

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyticsOffering } from '../../data/analytics';

interface AnalyticsDetailProps {
  item: AnalyticsOffering | null;
  onClose: () => void;
}

export const AnalyticsDetail: React.FC<AnalyticsDetailProps> = ({ item, onClose }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key listener & body scroll locking with Lenis synchronization
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Save exact landing page scroll position
    const savedScrollY = window.scrollY;

    // Pause Lenis smooth scrolling so wheel events inside modal never scroll background page
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
            boxSizing: 'border-box',
          }}
        >
          {/* Top Sticky Header Bar */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 30,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '18px clamp(20px, 4vw, 56px)',
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
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  margin: '-8px -12px',
                  borderRadius: '6px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <span>←</span>
                <span>Back to Analytics</span>
              </button>

              {/* Number and Category Tag */}
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#6169FF',
                }}
              >
                {item.number} / 10 &nbsp; {item.category}
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div
            style={{
              maxWidth: '1280px',
              width: '100%',
              margin: '0 auto',
              padding:
                'clamp(32px, 5vh, 64px) clamp(20px, 4vw, 56px) clamp(80px, 10vh, 140px)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(48px, 6vh, 72px)',
            }}
          >
            {/* Header Hero Section */}
            <div>
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '13px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.45)',
                  marginBottom: '16px',
                }}
              >
                Analytics Service {item.number} &nbsp;·&nbsp; YouDecide Studio
              </div>

              {/* Title: Big, Clean, NOT Bold, NOT Italic */}
              <h1
                id="analytics-page-title"
                style={{
                  fontFamily: '"Geist", -apple-system, sans-serif',
                  fontSize: 'clamp(38px, 6.2vw, 92px)',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  lineHeight: 1.04,
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF',
                  margin: '0 0 24px',
                  wordBreak: 'break-word',
                }}
              >
                {item.title}
              </h1>

              {/* Tagline & Overview */}
              <p
                style={{
                  fontFamily: '"Geist", -apple-system, sans-serif',
                  fontSize: 'clamp(18px, 2.2vw, 24px)',
                  lineHeight: 1.45,
                  color: 'rgba(255, 255, 255, 0.85)',
                  margin: '0 0 16px',
                  maxWidth: '880px',
                  fontWeight: 400,
                }}
              >
                {item.tagline}
              </p>

              <p
                style={{
                  fontFamily: '"Geist", -apple-system, sans-serif',
                  fontSize: 'clamp(15px, 1.6vw, 17px)',
                  lineHeight: 1.65,
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                  maxWidth: '820px',
                  fontWeight: 400,
                }}
              >
                {item.overview}
              </p>
            </div>

            {/* Visual Media Showcase with 3D Image */}
            <div
              style={{
                width: '100%',
                height: 'clamp(260px, 40vh, 440px)',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#10B981',
                      marginBottom: '4px',
                    }}
                  >
                    ● Telemetry Architecture Active
                  </div>
                  <div
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                    }}
                  >
                    {item.dashboardArchitecture.type}
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    color: '#FFFFFF',
                  }}
                >
                  {item.reportingAndIntegration.cadence}
                </div>
              </div>
            </div>

            {/* 2-Column Grid: Business Data to Monitor & Relevant Industry Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(32px, 5vw, 64px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '48px',
              }}
            >
              {/* Column 1: What Business Data To Monitor */}
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#6169FF',
                    marginBottom: '16px',
                  }}
                >
                  1. Business Data To Monitor
                </div>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.55)',
                    marginBottom: '20px',
                    lineHeight: 1.5,
                  }}
                >
                  Essential telemetry streams required to extract conclusive intelligence and detect operational anomalies:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {item.dataToMonitor.map((dataItem, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: '11px',
                          color: '#6169FF',
                          marginTop: '2px',
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <span
                        style={{
                          fontFamily: '"Geist", sans-serif',
                          fontSize: '15px',
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: 1.45,
                        }}
                      >
                        {dataItem}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Relevant Industry Metrics */}
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#10B981',
                    marginBottom: '16px',
                  }}
                >
                  2. Relevant Industry Metrics
                </div>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.55)',
                    marginBottom: '20px',
                    lineHeight: 1.5,
                  }}
                >
                  Primary KPIs tracked across real-time dashboards to quantify operational velocity and bottom-line health:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {item.keyMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: '13px',
                        color: '#A7F3D0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: '#10B981' }}>▲</span>
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Architecture & Integration Pipeline */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(32px, 5vw, 64px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '48px',
              }}
            >
              {/* Column 3: Dashboard Architecture */}
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#F59E0B',
                    marginBottom: '16px',
                  }}
                >
                  3. Dashboard Architecture
                </div>
                <h3
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '20px',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    margin: '0 0 10px',
                  }}
                >
                  {item.dashboardArchitecture.type}
                </h3>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.65)',
                    marginBottom: '20px',
                  }}
                >
                  {item.dashboardArchitecture.description}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {item.dashboardArchitecture.components.map((comp, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontFamily: '"Geist", sans-serif',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: '#F59E0B' }}>•</span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 4: Reporting & Data Integration */}
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#EC4899',
                    marginBottom: '16px',
                  }}
                >
                  4. Reporting & Data Integration
                </div>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.65)',
                    marginBottom: '18px',
                  }}
                >
                  {item.reportingAndIntegration.pipeline}
                </p>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.45)',
                    marginBottom: '10px',
                  }}
                >
                  Supported Native Connectors
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {item.reportingAndIntegration.connectors.map((conn, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      {conn}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decision Makers & Strategic Business Value */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(32px, 5vw, 64px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '48px',
              }}
            >
              {/* Column 5: Relevant Decision-Makers */}
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#38BDF8',
                    marginBottom: '16px',
                  }}
                >
                  5. Relevant Decision-Makers
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {item.decisionMakers.map((dm, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: '"Geist", sans-serif',
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#FFFFFF',
                          marginBottom: '4px',
                        }}
                      >
                        {dm.role}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Geist", sans-serif',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.55)',
                        }}
                      >
                        Focus: {dm.focus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 6: Why Analytics Delivers Business Value */}
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#A855F7',
                    marginBottom: '16px',
                  }}
                >
                  6. Strategic Business Value & ROI
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.06)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: '16px',
                      lineHeight: 1.65,
                      color: 'rgba(255, 255, 255, 0.95)',
                      margin: '0 0 16px',
                      fontWeight: 400,
                    }}
                  >
                    {item.businessValue}
                  </p>
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '12px',
                      color: '#D8B4FE',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>✦</span>
                    <span>Direct Bottom-Line Return & Operating Leverage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Observable Indicators & Lead Classification Framework */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '48px',
              }}
            >
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.45)',
                  marginBottom: '12px',
                }}
              >
                Lead Research & Opportunity Framework
              </div>
              <h3
                style={{
                  fontFamily: '"Geist", sans-serif',
                  fontSize: 'clamp(22px, 2.8vw, 32px)',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  margin: '0 0 24px',
                }}
              >
                Observable Indicators & Classification
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px',
                  marginBottom: '40px',
                }}
              >
                {/* Confirmed Observations */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '12px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#10B981',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>✓</span>
                    <span>Confirmed Observations</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {item.leadEvaluation.confirmedObservations.map((obs, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontFamily: '"Geist", sans-serif',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.75)',
                          lineHeight: 1.5,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: '#10B981', marginTop: '2px' }}>–</span>
                        <span>{obs}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Potential Opportunities */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '12px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#6169FF',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>✦</span>
                    <span>Potential Opportunities</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {item.leadEvaluation.potentialOpportunities.map((opp, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontFamily: '"Geist", sans-serif',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.75)',
                          lineHeight: 1.5,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: '#6169FF', marginTop: '2px' }}>–</span>
                        <span>{opp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Call to Action */}
              <div
                style={{
                  backgroundColor: '#121216',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: 'clamp(28px, 4vw, 44px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#6169FF',
                  }}
                >
                  Commission This Analytics Infrastructure
                </div>
                <h4
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: 'clamp(24px, 3.2vw, 36px)',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    margin: 0,
                    maxWidth: '680px',
                  }}
                >
                  Transform your organization's fragmented data into an authoritative decision engine.
                </h4>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a
                    href="#contact"
                    onClick={handleCtaClick}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '14px 28px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'transform 0.2s, opacity 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <span>Deploy Analytics Engine</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '13px',
                      fontWeight: 500,
                      padding: '14px 28px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    }}
                  >
                    <span>Return to Overview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(pageContent, document.body) : null;
};

export default AnalyticsDetail;
