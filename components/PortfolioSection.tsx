import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MilkGlassFolder, PortfolioCategory } from './MilkGlassFolder';
import { BrandLogoShowcase, WEBSITES } from './BrandLogoShowcase';
import { Cpu, BarChart3, Globe, Sparkles, ArrowRight, Zap, ShieldCheck, Activity, Layers } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('websites');
  const showcaseRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = (cat: PortfolioCategory) => {
    setSelectedCategory(cat);
    // Smooth scroll to showcase view on mobile if needed
    if (typeof window !== 'undefined' && window.innerWidth < 768 && showcaseRef.current) {
      setTimeout(() => {
        showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  return (
    <section
      id="portfolio"
      style={{
        position: 'relative',
        width: '100%',
        padding: '80px 20px 100px',
        boxSizing: 'border-box',
        background: 'linear-gradient(180deg, rgba(7, 7, 9, 0) 0%, rgba(13, 14, 20, 0.7) 40%, rgba(7, 7, 9, 1) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Ambient Aura */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(900px, 95vw)',
          height: '450px',
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, rgba(59, 130, 246, 0.03) 50%, transparent 80%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1240px',
          margin: '0 auto',
          zIndex: 1,
        }}
      >
        {/* Section Main Eyebrow & Title */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: '"Geist Mono", monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#818CF8',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              marginBottom: '16px',
            }}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>PORTFOLIO & CAPABILITIES</span>
          </div>

          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: 'clamp(32px, 5.5vw, 56px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
              lineHeight: 1.15,
            }}
          >
            Interactive Studio Archive
          </h2>

          <p
            style={{
              margin: '0 auto',
              maxWidth: '640px',
              fontSize: 'clamp(14px, 2.2vw, 17px)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            Explore our crafted software, autonomous automations, and data engines. Open the milk glass folder below or tap a category to inspect the collection.
          </p>
        </div>

        {/* ── MILK GLASS FOLDER COMPONENT ── */}
        <div style={{ marginBottom: '64px' }}>
          <MilkGlassFolder
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            isOpenDefault={false}
          />
        </div>

        {/* ── DYNAMIC CATEGORY SHOWCASE CONTENT ── */}
        <div ref={showcaseRef}>
          <AnimatePresence mode="wait">
            {selectedCategory === 'websites' && (
              <motion.div
                key="websites"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <BrandLogoShowcase />
              </motion.div>
            )}

            {selectedCategory === 'automations' && (
              <motion.div
                key="automations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  maxWidth: '960px',
                  margin: '0 auto',
                  padding: '36px 24px',
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#34D399',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      marginBottom: '12px',
                    }}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>AUTONOMOUS ENGINE CAPABILITIES</span>
                  </div>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: 700, color: '#FFFFFF' }}>
                    Engineered Workflows & AI Automations
                  </h3>
                  <p style={{ margin: '0 auto', maxWidth: '600px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    High-reliability asynchronous pipelines, intelligent agent frameworks, and programmatic integrations running 24/7.
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Zap className="w-6 h-6 text-emerald-400" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                      Event-Driven Webhooks
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.65)' }}>
                      Synchronizing CRM leads, instant transaction webhooks, and Slack/Discord alerts in real-time.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Cpu className="w-6 h-6 text-emerald-400" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                      AI Agent Task Runners
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.65)' }}>
                      Multi-agent reasoning pipelines that extract intelligence, generate summaries, and route customer queries.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <ShieldCheck className="w-6 h-6 text-emerald-400" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                      Automated CI/CD Verification
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.65)' }}>
                      Zero-downtime deployment assertions, automated security rule validation, and synthetic uptime alerts.
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedCategory('websites')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>View Websites Built</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {selectedCategory === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  maxWidth: '960px',
                  margin: '0 auto',
                  padding: '36px 24px',
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, rgba(168, 85, 247, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(192, 132, 252, 0.2)',
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#C084FC',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      marginBottom: '12px',
                    }}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>METRICS & TELEMETRY OBSERVABILITY</span>
                  </div>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: 700, color: '#FFFFFF' }}>
                    Conversion Telemetry & Performance
                  </h3>
                  <p style={{ margin: '0 auto', maxWidth: '600px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Precision instrumentation capturing user conversion milestones, real user Core Web Vitals, and actionable insights.
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Activity className="w-6 h-6 text-purple-400" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                      Core Web Vitals Monitoring
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.65)' }}>
                      Sub-second Largest Contentful Paint (LCP) and zero Cumulative Layout Shift tracking in production.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <BarChart3 className="w-6 h-6 text-purple-400" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                      Funnel Drop-off Analysis
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.65)' }}>
                      Visual attribution modeling revealing where prospective clients engage, drop off, and convert.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Layers className="w-6 h-6 text-purple-400" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                      Custom Event Instrumentation
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.65)' }}>
                      Privacy-respecting cookieless event logging providing clear answers without intrusive tracking scripts.
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedCategory('websites')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Back to Websites Built</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
