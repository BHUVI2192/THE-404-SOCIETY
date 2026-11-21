/**
 * Brand Logo Images — Framer Component adapted for React 19 & Framer Motion
 * Source: https://framer.com/m/Brand-Logo-Images-D51ZYs.js@nEclhYlpV3JBxdyXre3u
 *
 * Implements the Framer Brand Logo Images component showcasing websites built:
 * 1. Parivarthana School
 * 2. The 404 Society
 * 3. Rayara Mutt Honnali
 * 4. Mikan
 * 5. Helio
 * 6. Momo
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WebsiteBrand {
  id: string;
  order: string;
  variant: string;
  name: string;
  tagline: string;
  url: string;
  displayUrl: string;
  logoSrc: string;
  logoAlt: string;
  accentColor: string;
  auroraColor: string;
}

export const WEBSITES_BUILT: WebsiteBrand[] = [
  {
    id: 'parivarthana',
    order: '01 / 06',
    variant: 'Parivarthana',
    name: 'PARIVARTHANA SCHOOL',
    tagline: 'Residential School & PU College',
    url: 'https://parivarthanaschool.com/RSchool/',
    displayUrl: 'parivarthanaschool.com/RSchool',
    logoSrc: '/brands/parivarthana-logo.png',
    logoAlt: 'Parivarthana Residential School and PU College Logo',
    accentColor: '#EAB308',
    auroraColor: 'rgba(234, 179, 8, 0.22)',
  },
  {
    id: 'the404society',
    order: '02 / 06',
    variant: 'The404Society',
    name: 'THE 404 SOCIETY',
    tagline: 'Student Developer Community',
    url: 'https://www.the404society.in/',
    displayUrl: 'the404society.in',
    logoSrc: '/brands/the404society-logo.png',
    logoAlt: 'The 404 Society Brand Logo',
    accentColor: '#38BDF8',
    auroraColor: 'rgba(56, 189, 248, 0.25)',
  },
  {
    id: 'rayaramutt',
    order: '03 / 06',
    variant: 'RayaraMutt',
    name: 'RAYARA MUTT HONNALI',
    tagline: 'Sacred Heritage & Trust',
    url: 'https://www.rayaramutthonnali.org/',
    displayUrl: 'rayaramutthonnali.org',
    logoSrc: '/brands/rayaramutt-logo.png',
    logoAlt: 'Sri Rayara Mutt Honnali Sacred Seal Logo',
    accentColor: '#F59E0B',
    auroraColor: 'rgba(245, 158, 11, 0.22)',
  },
  {
    id: 'mikan',
    order: '04 / 06',
    variant: 'Mikan',
    name: 'MIKAN',
    tagline: 'Sparkling Tangerine Citrus',
    url: 'https://mikan-ten.vercel.app/',
    displayUrl: 'mikan-ten.vercel.app',
    logoSrc: '/brands/mikan-logo.svg',
    logoAlt: 'Mikan Sparkling Citrus Japanese Mon Logo',
    accentColor: '#FF6E14',
    auroraColor: 'rgba(255, 110, 20, 0.24)',
  },
  {
    id: 'helio',
    order: '05 / 06',
    variant: 'Helio',
    name: 'HELIO',
    tagline: 'Ceramic Atelier & Objects',
    url: 'https://helio-beryl-eta.vercel.app/',
    displayUrl: 'helio-beryl-eta.vercel.app',
    logoSrc: '/brands/helio-logo.svg',
    logoAlt: 'Helio Kiln Ceramic Atelier Mark',
    accentColor: '#C28E73',
    auroraColor: 'rgba(194, 142, 115, 0.24)',
  },
  {
    id: 'momo',
    order: '06 / 06',
    variant: 'Momo',
    name: 'MOMO',
    tagline: 'Small Objects for Good Moods',
    url: 'https://momo-five-liart.vercel.app/',
    displayUrl: 'momo-five-liart.vercel.app',
    logoSrc: '/brands/momo-logo.svg',
    logoAlt: 'Momo Montreal Playful Objects Brand Logo',
    accentColor: '#A78BFA',
    auroraColor: 'rgba(167, 139, 250, 0.26)',
  },
];

// Framer spring transition specification
const framerSpring = {
  type: 'spring',
  bounce: 0.25,
  duration: 0.35,
};

export interface BrandLogoImageProps {
  brand: WebsiteBrand;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
  interactive?: boolean;
}

/**
 * BrandLogoImages Card — faithful to Framer component specification:
 * - 286px intrinsic width
 * - 1:1 aspect ratio logo container with crisp centered logo
 * - Framer RichText typography: minimal uppercase font, 12px, letter-spacing 0.08em
 */
export const BrandLogoImages: React.FC<BrandLogoImageProps> = ({
  brand,
  width = 286,
  height = 'auto',
  style,
  className,
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${brand.name} website: ${brand.url}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      whileHover={interactive ? { y: -6, scale: 1.015 } : undefined}
      transition={framerSpring}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '16px',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        borderRadius: '20px',
        padding: '16px 16px 20px',
        background: isHovered
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${
          isHovered ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.08)'
        }`,
        boxShadow: isHovered
          ? `0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 35px -5px ${brand.auroraColor}`
          : '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition:
          'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Subtle Aurora Ambient Bloom inside Card */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: brand.auroraColor,
          filter: 'blur(45px)',
          opacity: isHovered ? 0.75 : 0.25,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top right live link indicator */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontFamily: '"Geist Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
          transition: 'color 0.25s ease',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isHovered ? brand.accentColor : 'rgba(255, 255, 255, 0.3)',
            boxShadow: isHovered ? `0 0 8px ${brand.accentColor}` : 'none',
            transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
          }}
        />
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isHovered ? 'translate(1px, -1px)' : 'none',
            transition: 'transform 0.25s ease',
          }}
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>

      {/* ── 1:1 Aspect Ratio Logo Box (Exact Framer .framer-1f7gh52) ── */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          position: 'relative',
          borderRadius: '14px',
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.05) 0%, rgba(4, 7, 17, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Subtle grid pattern inside card viewport */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.12,
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Logo Image */}
        <motion.img
          src={brand.logoSrc}
          alt={brand.logoAlt}
          loading="lazy"
          animate={{
            scale: isHovered ? 1.06 : 1,
          }}
          transition={framerSpring}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '180px',
            maxHeight: '180px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.45))',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── RichText Typography (Exact Framer .framer-1l3sqgk & sharedStyle) ── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          padding: '2px 4px 0',
          boxSizing: 'border-box',
          zIndex: 1,
        }}
      >
        {/* Minimal Index & Name: e.g. "01 / 06   PARIVARTHANA SCHOOL" */}
        <div
          style={{
            fontFamily: '"Geist", "Anek Latin", -apple-system, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'color 0.25s ease',
          }}
        >
          <span
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: '11px',
              color: isHovered ? brand.accentColor : 'rgba(255, 255, 255, 0.45)',
              letterSpacing: '0.04em',
              transition: 'color 0.25s ease',
            }}
          >
            {brand.order}
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {brand.name}
          </span>
        </div>

        {/* Minimal Sub-Tagline & Domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontFamily: '"Geist Mono", monospace',
            fontSize: '10.5px',
            color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {brand.tagline}
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export default BrandLogoImages;
