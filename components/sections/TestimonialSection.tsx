// Testimonial Section — Framer Component Adapted for YouDecide Studio
// Foundation: Framer Testimonial Component (https://framer.com/m/Testimonial-YyghqS.js@cQVk1ixHjhivCHFjhRuL)
// Features:
// - Wildflower meadow ambient background matching the design reference screenshot
// - Crisp, rounded white testimonial card with 3D fun mascot imagery
// - Authentic client testimonials: Dr. Dhananjaya K. B, Hrishikesh, Vadiraj Kamrur, Mr. B V Kumar
// - Animated Framer Motion carousel with circular arrow buttons, pagination pills, and touch/keyboard controls

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  mascotImage: string;
  mascotBg: string;
  accentColor: string;
  tag: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'hrishikesh',
    name: 'Hrishikesh',
    role: 'Co-Founder',
    company: 'The 404 Society',
    quote:
      "Working with the YouDecide team felt like collaborating with a top-tier digital design lab. From custom WebGL shaders to seamless automated pipelines, they delivered a site that truly reflects our builder culture without any friction or rigid agency retainers.",
    mascotImage: '/testimonials/mascot-astro.jpg',
    mascotBg: '#EFF6FF',
    accentColor: '#1920F0',
    tag: 'Community Platform & WebGL',
  },
  {
    id: 'vadiraj-kamrur',
    name: 'Vadiraj Kamrur',
    role: 'Trustee & Operations Lead',
    company: 'Rayaramutt',
    quote:
      "Our trust needed a clean, dignified digital presence that devotees and donors across the country could easily navigate. The team delivered lightning-fast execution, automated donor updates, and an honest collaborative process from day one.",
    mascotImage: '/testimonials/mascot-blue.jpg',
    mascotBg: '#FEF3C7',
    accentColor: '#0EA5E9',
    tag: 'Web Platform & Automation',
  },
  {
    id: 'dr-dhananjaya',
    name: 'Dr. Dhananjaya K. B',
    role: 'Principal & Academic Director',
    company: 'Parivarthana School',
    quote:
      "YouDecide built an institutional web portal for Parivarthana School that completely transformed how parents, teachers, and prospective students interact with our campus. Their pay-as-you-wish milestone model gave us total peace of mind, and the final deliverable far exceeded our expectations.",
    mascotImage: '/testimonials/mascot-cloud.jpg',
    mascotBg: '#FCE7F3',
    accentColor: '#3B82F6',
    tag: 'Institutional Web Portal',
  },
  {
    id: 'mr-bv-kumar',
    name: 'Mr. B V Kumar',
    role: 'Managing Director',
    company: 'Commercial & Retail Ventures',
    quote:
      "The social media analytics and custom business automations streamlined our customer intake within weeks. Having clear numbers instead of vanity metrics made all the difference. Their commercial model is revolutionary for growing businesses.",
    mascotImage: '/testimonials/mascot-red.jpg',
    mascotBg: '#FEE2E2',
    accentColor: '#EF4444',
    tag: 'Social Analytics & Sales CRM',
  },
];

export interface TestimonialSectionProps {
  className?: string;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const total = TESTIMONIALS.length;
  const current = TESTIMONIALS[currentIndex];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Optional subtle auto-rotation when not hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 8500);
    return () => clearInterval(timer);
  }, [isHovered, handleNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.99,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.99,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      id="testimonials"
      className={`testimonial-section ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        maxWidth: '1320px',
        width: '100%',
        margin: 'clamp(84px, 12vh, 140px) auto',
        padding: '0 clamp(24px, 5vw, 64px)',
        boxSizing: 'border-box',
        position: 'relative',
        scrollMarginTop: '100px',
        outline: 'none',
      }}
    >
      {/* ── SECTION HEADER: CONSISTENT WITH WEBSITES, AUTOMATION & ANALYTICS ── */}
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
          Trusted by builders &amp; leaders.
        </motion.h2>

        {/* 4. Testimonials Subhead — Consistent Typography */}
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
          4. Testimonials
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
          What educators, founders, and managing directors say about our design execution, autonomous workflows,
          and pay-as-you-wish milestone partnership.
        </motion.p>
      </div>

      {/* ── CRISP WHITE TESTIMONIAL CARD (FRAMER COMPONENT ADAPTED) ── */}
      <div
        className="testimonial-card-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '1320px',
          margin: '0 auto',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'clamp(300px, 34vw, 440px) 1fr',
          minHeight: 'clamp(440px, 52vh, 520px)',
          boxSizing: 'border-box',
        }}
      >
          {/* Left Column: Mascot fun visual container */}
          <div
            style={{
              position: 'relative',
              backgroundColor: current.mascotBg,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              borderRight: '1px solid #F3F4F6',
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={current.mascotImage}
                  alt={`${current.name} Mascot`}
                  style={{
                    width: '100%',
                    maxHeight: '360px',
                    objectFit: 'contain',
                    borderRadius: '20px',
                    filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.12))',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Fun Tag Badge */}
            <div
              style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '999px',
                padding: '4px 12px',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '11px',
                fontWeight: 600,
                color: '#1F2937',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                zIndex: 3,
              }}
            >
              {current.tag}
            </div>
          </div>

          {/* Right Column: Editorial Quote, Author Details & Controls */}
          <div
            style={{
              padding: 'clamp(32px, 4.5vh, 48px) clamp(28px, 4vw, 52px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {/* Top row: Minimal Studio logo / Brand Mark */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#4B5563',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#1920F0',
                    display: 'inline-block',
                  }}
                />
                <span>YOUDECIDE · CLIENT REVIEW</span>
              </div>

              {/* Decorative minimal quote symbol */}
              <div style={{ color: '#E5E7EB' }}>
                <Quote size={28} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>

            {/* Middle: Testimonial Quote Text with Smooth Crossfade */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', margin: '12px 0 24px' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.p
                  key={current.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{
                    fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: 'clamp(18px, 2.1vw, 24px)',
                    fontWeight: 500,
                    lineHeight: 1.45,
                    letterSpacing: '-0.02em',
                    color: '#111827',
                    margin: 0,
                    textAlign: 'left',
                  }}
                >
                  “{current.quote}”
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Bottom Row: Author details & Circular Navigation Arrows */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid #F3F4F6',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              {/* Author Info & Index Pills */}
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div
                      style={{
                        fontFamily: '"Geist", sans-serif',
                        fontSize: '17px',
                        fontWeight: 600,
                        color: '#111827',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {current.name}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Geist", sans-serif',
                        fontSize: '13px',
                        fontWeight: 400,
                        color: '#6B7280',
                        marginTop: '2px',
                      }}
                    >
                      {current.role} · <strong style={{ color: '#374151', fontWeight: 600 }}>{current.company}</strong>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Pagination Indicators (matching Framer dots & active pill) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px' }}>
                  {TESTIMONIALS.map((t, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setDirection(idx > currentIndex ? 1 : -1);
                          setCurrentIndex(idx);
                        }}
                        aria-label={`Go to testimonial ${idx + 1}`}
                        style={{
                          height: '6px',
                          width: isActive ? '24px' : '6px',
                          borderRadius: '999px',
                          backgroundColor: isActive ? '#18181B' : '#D1D5DB',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Circular Navigation Arrow Buttons (Identical to reference screenshot) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#2E3239',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.2s',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#18181B';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2E3239';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#2E3239',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.2s',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#18181B';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2E3239';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Responsive Styles for Mobile */}
      <style>{`
        @media (max-width: 820px) {
          .testimonial-card-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;

