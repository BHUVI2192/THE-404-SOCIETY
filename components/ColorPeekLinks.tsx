// ColorPeekLinks — Framer Component Adapted for React & Vite
// Source: https://framer.com/m/ColorPeekLinks-jb8X4M.js@1Mw7GEjwAelcvDrTRhVI
// Module: https://framerusercontent.com/modules/6OgASNrAFAp6ZcVZ2kBZ/1Mw7GEjwAelcvDrTRhVI/ColorPeekLinks.js

import React from 'react';
import { useReducedMotion } from 'framer-motion';

export interface ColorPeekItem {
  id?: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt?: string;
    srcSet?: string;
  };
  imagePosition?: string;
  background?: string;
  textColor?: string;
  cta?: string;
  link?: string;
  onClick?: () => void;
}

export interface ColorPeekLinksProps {
  items: ColorPeekItem[];
  gap?: number;
  cardHeight?: number;
  radius?: number;
  cardPadding?: number;
  imageInset?: number;
  imageWidth?: number;
  hoverWidth?: number;
  imageRadius?: number;
  titleSize?: number;
  animationSpeed?: number;
  background?: string;
  titleFont?: React.CSSProperties;
  smallFont?: React.CSSProperties;
  style?: React.CSSProperties;
  className?: string;
  onItemClick?: (item: ColorPeekItem, index: number) => void;
}

const STYLE = `
.cpl-root { container-type: inline-size; }
.cpl-card {
  isolation: isolate;
  position: relative;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  text-align: left;
  border: none;
}
.cpl-image {
  position: absolute;
  display: block;
  top: var(--cpl-inset);
  bottom: var(--cpl-inset);
  right: var(--cpl-image-right);
  width: var(--cpl-rest);
  overflow: hidden;
  z-index: 0;
  transition: width var(--cpl-duration) cubic-bezier(.22,1,.36,1), transform var(--cpl-duration) cubic-bezier(.22,1,.36,1), border-radius var(--cpl-duration) cubic-bezier(.22,1,.36,1);
  will-change: width;
}
.cpl-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.001);
  transition: transform var(--cpl-duration) cubic-bezier(.22,1,.36,1);
}
.cpl-arrow {
  position: absolute;
  z-index: 2;
  right: var(--cpl-arrow-right);
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: white;
  color: #171717;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform .45s cubic-bezier(.22,1,.36,1), background .25s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}
.cpl-content {
  position: relative;
  z-index: 2;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  max-width: 48%;
}
.cpl-title {
  font-size: var(--cpl-title-size);
  margin: 0;
  letter-spacing: -.035em;
  line-height: 1.05;
  font-weight: 700;
}
.cpl-cta {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .02em;
  white-space: nowrap;
  text-transform: uppercase;
}
.cpl-description {
  font-size: 13.5px;
  line-height: 1.35;
  font-weight: 500;
  opacity: .88;
}
.cpl-copybottom {
  display: flex;
  align-items: center;
  gap: 17px;
  flex-wrap: wrap;
}

/* Hover & Focus Interactions */
.cpl-card:hover .cpl-image,
.cpl-card:focus-visible .cpl-image {
  width: var(--cpl-hover);
}
.cpl-card:hover .cpl-image img,
.cpl-card:focus-visible .cpl-image img {
  transform: scale(1.055);
}
.cpl-card:hover .cpl-arrow,
.cpl-card:focus-visible .cpl-arrow {
  transform: translateY(-50%) rotate(45deg);
  background: #FFFFFF;
}
.cpl-card:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.6);
  outline-offset: 4px;
}

@container (max-width: 750px) {
  .cpl-title { font-size: clamp(22px, 5.2cqw, 34px); }
  .cpl-content { max-width: 50%; }
  .cpl-image { width: 26%; }
  .cpl-card:hover .cpl-image, .cpl-card:focus-visible .cpl-image { width: 34% !important; }
}

@container (max-width: 520px) {
  .cpl-card { min-height: 156px !important; padding: 18px 20px !important; }
  .cpl-image { right: 10px !important; width: 30% !important; top: 9px; bottom: 9px; }
  .cpl-card:hover .cpl-image, .cpl-card:focus-visible .cpl-image { width: 33% !important; }
  .cpl-arrow { right: 16px !important; top: 24px; transform: none; width: 32px; height: 32px; }
  .cpl-card:hover .cpl-arrow, .cpl-card:focus-visible .cpl-arrow { transform: rotate(45deg); }
  .cpl-content { max-width: 52%; }
  .cpl-title { font-size: clamp(19px, 6.8cqw, 26px); letter-spacing: -.03em; }
  .cpl-description { font-size: 11.5px; }
  .cpl-copybottom { display: block; }
  .cpl-cta { margin-top: 6px; font-size: 11px; }
}

@media (hover: none) {
  .cpl-card:hover .cpl-image { width: var(--cpl-rest); }
  .cpl-card:hover .cpl-image img { transform: scale(1.001); }
}

@media (prefers-reduced-motion: reduce) {
  .cpl-image, .cpl-image img, .cpl-arrow { transition-duration: 0ms !important; }
}
`;

function ArrowIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const ColorPeekLinks: React.FC<ColorPeekLinksProps> = ({
  items,
  gap = 12,
  cardHeight = 156,
  radius = 22,
  cardPadding = 28,
  imageInset = 10,
  imageWidth = 24,
  hoverWidth = 35,
  imageRadius = 16,
  titleSize = 36,
  animationSpeed = 0.65,
  background = 'transparent',
  titleFont,
  smallFont,
  style,
  className = '',
  onItemClick,
}) => {
  const prefersReduced = useReducedMotion();
  const duration = prefersReduced ? '0ms' : `${Math.max(0.15, animationSpeed)}s`;

  return (
    <div
      className={`cpl-root ${className}`}
      style={{
        ...style,
        width: '100%',
        boxSizing: 'border-box',
        background,
        fontFamily: '"Geist", -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: Math.max(0, gap),
        minWidth: 0,
      }}
    >
      <style>{STYLE}</style>

      {items.map((item, index) => {
        const link = typeof item.link === 'string' ? item.link.trim() : '';
        const hasCustomClick = typeof item.onClick === 'function' || typeof onItemClick === 'function';
        const canNavigate = link.length > 0;
        const isClickable = canNavigate || hasCustomClick;
        const CardTag = canNavigate ? 'a' : isClickable ? 'button' : 'div';
        const textColor = item.textColor || '#FFFFFF';
        const imageUrl = item.image?.src || '';

        const handleClick = (e: React.MouseEvent) => {
          if (item.onClick) {
            item.onClick();
          } else if (onItemClick) {
            onItemClick(item, index);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (!canNavigate && isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick(e as any);
          }
        };

        return (
          <CardTag
            key={item.id || `${index}-${item.title}`}
            className="cpl-card"
            href={canNavigate ? link : undefined}
            target={canNavigate ? '_blank' : undefined}
            rel={canNavigate ? 'noopener noreferrer' : undefined}
            onClick={isClickable ? handleClick : undefined}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            tabIndex={isClickable ? 0 : undefined}
            role={isClickable && !canNavigate ? 'button' : undefined}
            aria-label={`${item.title}: ${item.cta || 'Explore Details'}`}
            style={{
              height: Math.max(120, cardHeight),
              width: '100%',
              boxSizing: 'border-box',
              display: 'block',
              textDecoration: 'none',
              color: textColor,
              background: item.background || '#087FB0',
              borderRadius: `${radius}px`,
              overflow: 'hidden',
              cursor: isClickable ? 'pointer' : 'default',
              padding: `${cardPadding}px`,
              ...( {
                '--cpl-inset': `${imageInset}px`,
                '--cpl-image-right': '76px',
                '--cpl-arrow-right': '20px',
                '--cpl-rest': `${imageWidth}%`,
                '--cpl-hover': `${hoverWidth}%`,
                '--cpl-duration': duration,
                '--cpl-title-size': `${titleSize}px`,
              } as React.CSSProperties ),
            }}
          >
            {/* Color Peek Image that Expands on Hover */}
            <div
              className="cpl-image"
              style={{
                borderRadius: `${imageRadius}px`,
                background: 'rgba(0, 0, 0, 0.12)',
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  srcSet={item.image?.srcSet}
                  alt={item.image?.alt || item.title}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  style={{
                    objectPosition: item.imagePosition || '50% 50%',
                  }}
                />
              )}
            </div>

            {/* Left Content Column */}
            <div className="cpl-content">
              <h3
                className="cpl-title"
                style={{
                  ...titleFont,
                  fontSize: `clamp(22px, ${(titleSize / 11.2).toFixed(2)}cqw, ${titleSize}px)`,
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.05,
                  margin: 0,
                  color: textColor,
                }}
              >
                {item.title}
              </h3>

              <div className="cpl-copybottom">
                <span
                  className="cpl-description"
                  style={{
                    ...smallFont,
                    color: textColor,
                  }}
                >
                  {item.description}
                </span>

                {isClickable && (
                  <span
                    className="cpl-cta"
                    style={{
                      ...smallFont,
                      color: textColor,
                    }}
                  >
                    <span>{item.cta || 'View Details'}</span>
                    <ArrowIcon size={13} />
                  </span>
                )}
              </div>
            </div>

            {/* Circular Arrow Badge */}
            {isClickable && (
              <div className="cpl-arrow" aria-hidden="true">
                <ArrowIcon size={19} />
              </div>
            )}
          </CardTag>
        );
      })}
    </div>
  );
};

export default ColorPeekLinks;

