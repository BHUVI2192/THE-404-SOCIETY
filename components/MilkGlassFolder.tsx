import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Cpu, BarChart3, ArrowRight, Folder, FolderOpen } from 'lucide-react';

export type PortfolioCategory = 'websites' | 'automations' | 'analytics';

interface MilkGlassFolderProps {
  selectedCategory: PortfolioCategory;
  onSelectCategory: (category: PortfolioCategory) => void;
  isOpenDefault?: boolean;
}

interface CategoryCardData {
  id: PortfolioCategory;
  title: string;
  badge: string;
  count: string;
  tagline: string;
  gradient: string;
  borderColor: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryCardData[] = [
  {
    id: 'websites',
    title: 'Websites',
    badge: 'CLIENT & STUDIO',
    count: '6 Live Sites',
    tagline: 'High-performance web applications, institutional portals & bespoke brand experiences',
    gradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%)',
    borderColor: 'rgba(96, 165, 250, 0.4)',
    icon: <Globe className="w-5 h-5 text-blue-400" />,
  },
  {
    id: 'automations',
    title: 'Automations',
    badge: 'WORKFLOWS & AI',
    count: 'Agent Systems',
    tagline: 'Autonomous AI pipelines, scheduled scraping daemons & real-time webhook integrations',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    icon: <Cpu className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    badge: 'METRICS & TELEMETRY',
    count: 'Telemetry Hub',
    tagline: 'Conversion funnel analytics, Web Vitals telemetry & unified business intelligence',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(217, 70, 239, 0.15) 100%)',
    borderColor: 'rgba(192, 132, 252, 0.4)',
    icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
  },
];

export const MilkGlassFolder: React.FC<MilkGlassFolderProps> = ({
  selectedCategory,
  onSelectCategory,
  isOpenDefault = false,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [hoveredCard, setHoveredCard] = useState<PortfolioCategory | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCardClick = (id: PortfolioCategory, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onSelectCategory(id);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Pre-calculated authentic KOJA svg paths (width 352, height 264 for back, 194 for front)
  const backClipPath =
    'path("M 0,18 A 18,18 0 0 1 18,0 L 118,0 C 138,0 142,22 162,22 L 334,22 A 18,18 0 0 1 352,40 L 352,246 A 18,18 0 0 1 334,264 L 18,264 A 18,18 0 0 1 0,246 Z")';
  const frontClipPath =
    'path("M 0,18 A 18,18 0 0 1 18,0 L 136,0 C 150,0 152,13 176,13 C 200,13 202,0 216,0 L 334,0 A 18,18 0 0 1 352,18 L 352,176 A 18,18 0 0 1 334,194 L 18,194 A 18,18 0 0 1 0,176 Z")';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Category Pills Header for Quick 1-Tap Switching (Mobile & Desktop) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          marginBottom: '28px',
          maxWidth: '92vw',
          flexWrap: 'wrap',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setIsOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                border: isSelected
                  ? '1px solid rgba(255, 255, 255, 0.24)'
                  : '1px solid transparent',
                background: isSelected
                  ? 'rgba(255, 255, 255, 0.14)'
                  : 'transparent',
                color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                outline: 'none',
                touchAction: 'manipulation',
              }}
            >
              {cat.icon}
              <span>{cat.title}</span>
              {cat.id === 'websites' && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: 'rgba(96, 165, 250, 0.25)',
                    color: '#93C5FD',
                    fontWeight: 700,
                  }}
                >
                  6
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Milk Glass Folder Frame */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onClick={toggleOpen}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label="Portfolio Milk Glass Folder. Click to open and preview works."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
        style={{
          position: 'relative',
          width: 'clamp(290px, 86vw, 380px)',
          height: 'clamp(280px, 60vw, 320px)',
          margin: '0 auto',
          cursor: 'pointer',
          touchAction: 'manipulation',
          outline: 'none',
        }}
      >
        {/* Soft Ground Shadow */}
        <div
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            bottom: '-12px',
            height: '36px',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.65) 0%, transparent 70%)',
            filter: 'blur(10px)',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'all 0.4s ease',
            transform: isOpen ? 'scale(1.08) translateY(6px)' : 'scale(1)',
            opacity: isOpen ? 0.85 : 0.6,
          }}
        />

        {/* ── BACK PANEL OF FOLDER ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            background: 'linear-gradient(145deg, #181922 0%, #0d0e14 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px -15px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          {/* Back Tab Header Graphic */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '135px',
              height: '32px',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)',
              borderBottomRightRadius: '14px',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '16px',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              COLLECTION // 26
            </span>
          </div>

          {/* Interior Subtle Shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 80% 20%, rgba(97, 105, 255, 0.12), transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ── CARDS NESTED INSIDE THE FOLDER ── */}
        <div
          style={{
            position: 'absolute',
            left: '16px',
            right: '16px',
            top: '32px',
            height: '200px',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        >
          {CATEGORIES.map((card, index) => {
            const isSelected = selectedCategory === card.id;
            const isHovered = hoveredCard === card.id;

            // Compute transforms based on open state and index
            // Staggered fan: Websites (0), Automations (1), Analytics (2)
            let y = 0;
            let x = 0;
            let rotate = 0;
            let scale = 1;

            if (isOpen) {
              if (index === 0) {
                // Websites (fanned left)
                y = -105;
                x = -24;
                rotate = -4;
                scale = isSelected ? 1.03 : 0.98;
              } else if (index === 1) {
                // Automations (elevated center)
                y = -122;
                x = 0;
                rotate = 0.5;
                scale = isSelected ? 1.03 : 0.98;
              } else {
                // Analytics (fanned right)
                y = -105;
                x = 24;
                rotate = 4;
                scale = isSelected ? 1.03 : 0.98;
              }
            } else {
              // Closed peek state
              y = index * -6;
              rotate = (index - 1) * 1.4;
              scale = 1 - index * 0.02;
            }

            return (
              <motion.div
                key={card.id}
                onClick={(e) => handleCardClick(card.id, e)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                animate={{
                  y,
                  x,
                  rotate,
                  scale: isHovered ? scale * 1.03 : scale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                  mass: 0.8,
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '16px',
                  background: isSelected
                    ? 'linear-gradient(145deg, #1e2030 0%, #11131c 100%)'
                    : 'linear-gradient(145deg, #171822 0%, #0e0f17 100%)',
                  border: isSelected
                    ? `1.5px solid ${card.borderColor}`
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: isSelected
                    ? `0 12px 28px -8px rgba(0,0,0,0.8), 0 0 20px -4px ${card.borderColor}`
                    : '0 8px 20px -6px rgba(0,0,0,0.6)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  pointerEvents: isOpen ? 'auto' : 'none',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  zIndex: isSelected ? 10 : 3 - index,
                }}
              >
                {/* Decorative Ambient Card Top Light */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: isSelected ? card.borderColor : 'transparent',
                    opacity: 0.8,
                  }}
                />

                {/* Card Top: Title, Badge, Count */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: isSelected ? '#A5B4FC' : 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      {card.badge}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: isSelected ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.06)',
                        color: '#FFFFFF',
                      }}
                    >
                      {card.count}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {card.icon}
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        color: '#FFFFFF',
                      }}
                    >
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* Card Bottom: Tagline & Prompt */}
                <div style={{ marginTop: 'auto' }}>
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '11px',
                      lineHeight: 1.35,
                      color: 'rgba(255, 255, 255, 0.7)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {card.tagline}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: isSelected ? '#60A5FA' : 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <span>{isSelected ? 'Viewing Selection' : 'Click to View'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── FRONT MILK GLASS PANEL ── */}
        <motion.div
          animate={{
            y: isOpen ? 12 : 0,
            scaleY: isOpen ? 0.97 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 26,
          }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 'clamp(180px, 42vw, 215px)',
            borderRadius: '24px',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow:
              'inset 0 1px 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.2), 0 16px 36px -10px rgba(0, 0, 0, 0.65)',
            zIndex: 6,
            pointerEvents: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 24px',
            boxSizing: 'border-box',
          }}
        >
          {/* Specular Glare reacting to cursor/pointer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle 240px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.28), transparent 70%)`,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />

          {/* Top Thumb Cut subtle lip */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '54px',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '0 0 8px 8px',
              filter: 'blur(0.5px)',
            }}
          />

          {/* Folder Label & Details at Bottom Left */}
          <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
            <div
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.55)',
                marginBottom: '4px',
              }}
            >
              SELECTED WORKS // ARCHIVE
            </div>
            <h4
              style={{
                margin: 0,
                fontSize: 'clamp(20px, 4vw, 24px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              Portfolio
            </h4>
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{isOpen ? 'Tap card to inspect' : 'Tap to expand folder'}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: '#93C5FD', fontWeight: 600 }}>
                {selectedCategory === 'websites' ? 'Websites Active' : selectedCategory}
              </span>
            </div>
          </div>

          {/* Bottom Right Circular Key / Action Button */}
          <div
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(220,225,235,0.85))',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow:
                'inset 0 1px 0 #ffffff, inset 0 -2px 6px rgba(0,0,0,0.18), 0 8px 16px -4px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              zIndex: 3,
              transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            {isOpen ? (
              <FolderOpen className="w-5 h-5 text-indigo-950" />
            ) : (
              <ArrowRight className="w-5 h-5 text-indigo-950" />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MilkGlassFolder;
