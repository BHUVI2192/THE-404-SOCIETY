import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';

export interface WebsiteItem {
  id: string;
  order: string;
  title: string;
  category: string;
  url: string;
  logo: string;
  logoBg: string;
  accentColor: string;
  description: string;
  tags: string[];
}

export const WEBSITES: WebsiteItem[] = [
  {
    id: 'parivarthana',
    order: '01',
    title: 'Parivarthana School',
    category: 'Institutional & Academics',
    url: 'https://parivarthanaschool.com/RSchool/',
    logo: '/portfolio/parivarthana.png',
    logoBg: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f7f3ed 100%)',
    accentColor: '#DC2626',
    description: 'Comprehensive educational portal with online admissions, real-time campus notices, and academic curriculum guides.',
    tags: ['Education', 'Admissions Portal', 'Live'],
  },
  {
    id: 'the404society',
    order: '02',
    title: 'The 404 Society',
    category: 'Developer Community & Tech',
    url: 'https://www.the404society.in/',
    logo: '/portfolio/the404society.png',
    logoBg: 'radial-gradient(circle at 50% 50%, #151728 0%, #0c0d16 100%)',
    accentColor: '#6366F1',
    description: 'Flagship student developer collective hub for PESITM, featuring event management, hackathons, and project showcases.',
    tags: ['Developer Hub', 'Events', 'Live'],
  },
  {
    id: 'rayaramutt',
    order: '03',
    title: 'Rayara Mutt Honnali',
    category: 'Religious & Cultural Trust',
    url: 'https://www.rayaramutthonnali.org/',
    logo: '/portfolio/rayaramutt.png',
    logoBg: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fff7ed 100%)',
    accentColor: '#D97706',
    description: 'Cultural trust and sacred matha heritage portal facilitating online seva bookings, pooja calendars, and community services.',
    tags: ['Cultural Trust', 'Seva Booking', 'Live'],
  },
  {
    id: 'nike-vision',
    order: '04',
    title: 'Nike Vision Project',
    category: 'Fashion & Editorial Runway',
    url: 'https://nike-vision.vercel.app/',
    logo: '/portfolio/nike.svg',
    logoBg: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f3f4f6 100%)',
    accentColor: '#000000',
    description: 'High-concept Nike Studio lookbook experience featuring seasonal archive collections and interactive runway showcases.',
    tags: ['Nike Runway', 'Lookbook', 'Live'],
  },
  {
    id: 'helio',
    order: '05',
    title: 'Helio · KILN',
    category: 'Ceramic Atelier & Craft',
    url: 'https://helio-beryl-eta.vercel.app/',
    logo: '/portfolio/helio.svg',
    logoBg: 'linear-gradient(135deg, #1f1c19 0%, #121110 100%)',
    accentColor: '#B4532A',
    description: 'Kyoto and Lisbon ceramic design studio featuring stoneware collections, material tactile archives, and artisan pottery.',
    tags: ['Atelier', 'Luxury Catalog', 'Live'],
  },
  {
    id: 'momo',
    order: '06',
    title: 'Momo Studio',
    category: 'Lifestyle & Desk Objects',
    url: 'https://momo-five-liart.vercel.app/',
    logo: '/portfolio/momo.svg',
    logoBg: 'linear-gradient(135deg, #fff9ec 0%, #f6e7cb 100%)',
    accentColor: '#EAB308',
    description: 'Curated lifestyle store for joyful desk stationery, ceramic coasters, playful desk accessories, and everyday goods.',
    tags: ['Good Moods', 'Interactive Shop', 'Live'],
  },
];

interface BrandLogoShowcaseProps {
  onSelectSite?: (site: WebsiteItem) => void;
}

export const BrandLogoShowcase: React.FC<BrandLogoShowcaseProps> = ({ onSelectSite }) => {
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Section Subheader */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '42px',
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
            color: '#60A5FA',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            marginBottom: '14px',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>PORTFOLIO COLLECTION // WEBSITES BUILT</span>
        </div>

        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: 'clamp(28px, 4.5vw, 42px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}
        >
          Specially Engineered Web Experiences
        </h3>

        <p
          style={{
            margin: 0,
            maxWidth: '620px',
            fontSize: 'clamp(14px, 2vw, 16px)',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          From high-traffic institutional portals to artisanal luxury studios. Click any card below to launch and explore the live web application.
        </p>
      </div>

      {/* Grid of Brand Logo Cards (Faithfully based on Brand-Logo-Images Framer Component) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 30vw, 360px), 1fr))',
          gap: '24px',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        {WEBSITES.map((site) => {
          const isHovered = hoveredSite === site.id;

          return (
            <motion.a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredSite(site.id)}
              onMouseLeave={() => setHoveredSite(null)}
              onClick={() => onSelectSite?.(site)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: isHovered
                  ? `1px solid ${site.accentColor}`
                  : '1px solid rgba(255, 255, 255, 0.09)',
                boxShadow: isHovered
                  ? `0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px -5px ${site.accentColor}33`
                  : '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                padding: '24px',
                boxSizing: 'border-box',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                touchAction: 'manipulation',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Card Ambient Glow Line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${site.accentColor}, transparent)`,
                  opacity: isHovered ? 1 : 0.4,
                  transition: 'opacity 0.3s ease',
                }}
              />

              {/* Top Row: Index number & Category */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: site.accentColor,
                    }}
                  >
                    #{site.order}
                  </span>
                  <span
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {site.category}
                  </span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>LIVE</span>
                </div>
              </div>

              {/* Brand Logo Container (Aspect Ratio 1 / 1, like Brand-Logo-Images Framer Component) */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  maxHeight: '260px',
                  borderRadius: '18px',
                  background: site.logoBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 8px 24px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* Logo Image */}
                <motion.img
                  src={site.logo}
                  alt={`${site.title} logo`}
                  animate={{
                    scale: isHovered ? 1.06 : 1,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    maxWidth: '180px',
                    maxHeight: '180px',
                    filter: isHovered ? 'drop-shadow(0 10px 18px rgba(0,0,0,0.4))' : 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))',
                    transition: 'filter 0.3s ease',
                  }}
                />

                {/* Subtle Glass Sheen on Top of Logo */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15), transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Title & Description */}
              <div style={{ marginTop: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{site.title}</span>
                  <motion.div
                    animate={{
                      x: isHovered ? 3 : 0,
                      y: isHovered ? -3 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowUpRight
                      className="w-5 h-5"
                      style={{
                        color: isHovered ? site.accentColor : 'rgba(255, 255, 255, 0.4)',
                        transition: 'color 0.25s ease',
                      }}
                    />
                  </motion.div>
                </h4>

                <p
                  style={{
                    margin: '0 0 18px 0',
                    fontSize: '13px',
                    lineHeight: 1.55,
                    color: 'rgba(255, 255, 255, 0.65)',
                    flex: 1,
                  }}
                >
                  {site.description}
                </p>

                {/* Tags row */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                    marginBottom: '18px',
                  }}
                >
                  {site.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Direct Action Link Button */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    minHeight: '44px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: isHovered ? site.accentColor : 'rgba(255, 255, 255, 0.07)',
                    color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    transition: 'all 0.25s ease',
                    boxSizing: 'border-box',
                  }}
                >
                  <span>Open Live Website</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default BrandLogoShowcase;
