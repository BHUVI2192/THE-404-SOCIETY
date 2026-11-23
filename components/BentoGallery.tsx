// BentoGallery — Framer Component Adapted for React & Vite
// Source: https://framer.com/m/BentoGallery-T6VH.js@MaI7yHbDqGVoRWLiezpW
// Customisable modular bento gallery with individual cell imagery, dynamic spanning,
// sharp editorial borders, and integrated analytics content.

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface BentoGalleryItem {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  image?: string;
  highlights?: { title: string; desc: string }[] | string[];
  footer?: string;
  colSpan?: number;
  rowSpan?: number;
}

export interface BentoGalleryProps {
  items: BentoGalleryItem[];
  gap?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  animationDuration?: number;
  grayscaleOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BentoGallery: React.FC<BentoGalleryProps> = ({
  items,
  gap = 16,
  borderRadius = 0,
  borderWidth = 1,
  borderColor = 'rgba(255, 255, 255, 0.12)',
  backgroundColor = 'rgba(255, 255, 255, 0.015)',
  animationDuration = 0.25,
  grayscaleOnHover = false,
  className = '',
  style,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className={`bento-gallery-container ${className}`}
      style={{
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        className="bento-gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: `${gap}px`,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {items.map((item, index) => {
          const isHovered = hoveredId === item.id;
          const colSpan = item.colSpan || 6;

          return (
            <motion.div
              key={item.id}
              className={`bento-card bento-card-${item.id}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                gridColumn: `span ${colSpan}`,
                backgroundColor: isHovered
                  ? 'rgba(255, 255, 255, 0.04)'
                  : backgroundColor,
                border: `${borderWidth}px solid ${
                  isHovered ? 'rgba(255, 255, 255, 0.28)' : borderColor
                }`,
                borderRadius: `${borderRadius}px`,
                padding: 'clamp(26px, 3.8vh, 36px)',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: `background-color ${animationDuration}s, border-color ${animationDuration}s, transform ${animationDuration}s`,
                transform: isHovered ? 'translateY(-3px)' : 'none',
              }}
            >
              {/* Optional background image with dark overlay for readability */}
              {item.image && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.12,
                      filter: isHovered && grayscaleOnHover ? 'grayscale(100%)' : 'none',
                      transition: `filter ${animationDuration}s, transform 0.6s ease`,
                      transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(180deg, rgba(4, 7, 17, 0.92) 0%, rgba(4, 7, 17, 0.98) 100%)',
                    }}
                  />
                </div>
              )}

              {/* Card Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
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
                    {item.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize:
                      colSpan >= 8
                        ? 'clamp(22px, 2.4vw, 30px)'
                        : 'clamp(20px, 2vw, 24px)',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    color: '#FFFFFF',
                    margin: '0 0 14px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: '0 0 24px',
                    maxWidth: colSpan >= 8 ? '680px' : '100%',
                  }}
                >
                  {item.description}
                </p>

                {/* Highlights / Sub-Bento Grid */}
                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        typeof item.highlights[0] === 'object'
                          ? 'repeat(auto-fit, minmax(180px, 1fr))'
                          : 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '10px',
                      marginTop: '8px',
                    }}
                  >
                    {item.highlights.map((hl, hlIdx) => {
                      if (typeof hl === 'object' && hl !== null) {
                        return (
                          <div
                            key={hlIdx}
                            style={{
                              padding: '14px 16px',
                              borderRadius: 0,
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              boxSizing: 'border-box',
                            }}
                          >
                            <div
                              style={{
                                fontFamily: '"Geist", sans-serif',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#FFFFFF',
                                marginBottom: '4px',
                              }}
                            >
                              {hl.title}
                            </div>
                            <div
                              style={{
                                fontFamily: '"Geist", sans-serif',
                                fontSize: '12px',
                                lineHeight: 1.45,
                                color: 'rgba(255, 255, 255, 0.6)',
                              }}
                            >
                              {hl.desc}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={hlIdx}
                          style={{
                            display: 'inline-block',
                            fontFamily: '"Geist", sans-serif',
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: '8px 14px',
                            borderRadius: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxSizing: 'border-box',
                          }}
                        >
                          {hl}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              {item.footer && (
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '16px',
                    marginTop: '24px',
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {item.footer}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Responsive Styles (Strict 0px Border Radius) */}
      <style>{`
        @media (max-width: 960px) {
          .bento-gallery-grid > div {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BentoGallery;
