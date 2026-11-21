// Automation Services — Black Typographic Masonry Gallery
// Foundation: Framer Masonry Component (https://framer.com/m/Image-Grid-Hnw0.js@9meAnis8i2TyPz9xYr15)
// Aesthetic: Brutally minimal, black-and-white, typography-driven editorial showcase

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AUTOMATIONS, AutomationItem } from '../../data/automations';
import { AutomationDetail } from './AutomationDetail';

export interface AutomationSectionProps {
  className?: string;
  gap?: number;
  borderRadius?: number;
}

export const AutomationSection: React.FC<AutomationSectionProps> = ({
  className = '',
  gap = 16,
  borderRadius = 16,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationItem | null>(null);

  // ResizeObserver tracks container width responsively (matching Framer component)
  useEffect(() => {
    if (!containerRef.current) return;

    let resizeObserver: ResizeObserver | null = null;
    let rafId: number | null = null;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updateWidth();
      });
      resizeObserver.observe(containerRef.current);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateWidth);
    }

    // Force update on next animation frame to prevent stale measurement
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      rafId = window.requestAnimationFrame(updateWidth);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (resizeObserver && containerRef.current) {
        resizeObserver.disconnect();
      } else if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateWidth);
      }
    };
  }, []);

  // Determine column count based on viewport container width
  const columns = useMemo(() => {
    if (containerWidth === 0) return 3;
    if (containerWidth >= 960) return 3;
    if (containerWidth >= 600) return 2;
    return 1;
  }, [containerWidth]);

  // Column width calculation
  const columnWidth = useMemo(() => {
    if (containerWidth === 0) return 0;
    return (containerWidth - gap * (columns - 1)) / columns;
  }, [containerWidth, columns, gap]);

  // Masonry layout calculation using shortest-column algorithm from Framer component
  const masonryLayout = useMemo(() => {
    if (columnWidth === 0) return [];

    const columnHeights = new Array(columns).fill(0);
    const layout: Array<{
      item: AutomationItem;
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];

    AUTOMATIONS.forEach((item) => {
      // Find shortest column
      const shortestColIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // Height calculation based on tile aspect ratio
      // If single column on mobile, normalize height for comfortable mobile viewing
      const effectiveRatio = columns === 1 ? Math.min(item.aspectRatio, 0.72) : item.aspectRatio;
      const finalHeight = Math.max(Math.round(columnWidth * effectiveRatio), 180);

      layout.push({
        item,
        x: shortestColIndex * (columnWidth + gap),
        y: columnHeights[shortestColIndex],
        width: columnWidth,
        height: finalHeight,
      });

      // Update column height
      columnHeights[shortestColIndex] += finalHeight + gap;
    });

    return layout;
  }, [columnWidth, columns, gap]);

  const totalHeight = useMemo(() => {
    if (masonryLayout.length === 0) return 400;
    const calculatedHeight = Math.max(...masonryLayout.map((tile) => tile.y + tile.height));
    return Math.max(calculatedHeight, 200);
  }, [masonryLayout]);

  return (
    <section
      id="automations"
      className={`automation-showcase-section ${className}`}
      style={{
        maxWidth: '1320px',
        width: '100%',
        margin: 'clamp(72px, 11vh, 128px) auto',
        padding: '0 clamp(16px, 4vw, 36px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '110px',
      }}
    >
      {/* ── SECTION INTRODUCTION: SMALL, SIMPLE & MINIMAL ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          marginBottom: 'clamp(28px, 4.5vh, 44px)',
          paddingLeft: '2px',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#60A5FA',
            margin: '0 0 12px',
          }}
        >
          WHAT WE AUTOMATE
        </motion.p>

        {/* Heading: Small, clean, bold */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist", -apple-system, sans-serif',
            fontSize: 'clamp(26px, 3.4vw, 42px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            color: '#FFFFFF',
            margin: '0 0 14px',
            textTransform: 'uppercase',
          }}
        >
          AUTOMATION, BEYOND THE OBVIOUS.
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist", -apple-system, sans-serif',
            fontSize: 'clamp(15px, 1.6vw, 17px)',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.65)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          We build systems that eliminate repetitive work, connect disconnected tools and make
          businesses run smarter.
        </motion.p>
      </div>

      {/* ── MASONRY CANVAS: 8 PURE BLACK RECTANGULAR TILES ── */}
      <div
        ref={containerRef}
        className="automation-masonry-container"
        style={{
          width: '100%',
          height: `${totalHeight}px`,
          position: 'relative',
          transition: 'height 0.28s ease-out',
        }}
      >
        {masonryLayout.map(({ item, x, y, width, height }, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.45,
              delay: idx * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={() => setSelectedAutomation(item)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${item.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedAutomation(item);
              }
            }}
            className="automation-masonry-tile"
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: '#000000',
              borderRadius: `${borderRadius}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(24px, 3.2vw, 40px)',
              boxSizing: 'border-box',
              cursor: 'pointer',
              overflow: 'hidden',
              userSelect: 'none',
              outline: 'none',
              transition:
                'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Pure typography: Bold uppercase automation name only */}
            <div
              className="automation-tile-text"
              style={{
                fontFamily: '"Geist", -apple-system, sans-serif',
                fontSize: 'clamp(20px, 2.2vw, 30px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.16,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                transition: 'opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {item.number}. {item.name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── EXPANDED MODAL DETAIL VIEW ── */}
      <AutomationDetail
        item={selectedAutomation}
        onClose={() => setSelectedAutomation(null)}
      />

      {/* Scoped CSS for hover micro-interactions */}
      <style>{`
        .automation-masonry-tile:hover {
          transform: translateY(-4px) scale(1.008);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);
        }
        .automation-masonry-tile:hover .automation-tile-text {
          opacity: 0.88;
        }
        .automation-masonry-tile:focus-visible {
          box-shadow: 0 0 0 2px #60A5FA;
        }
        @media (prefers-reduced-motion: reduce) {
          .automation-masonry-tile {
            transition: none !important;
          }
          .automation-masonry-tile:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AutomationSection;
