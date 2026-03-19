import React, { useRef, useCallback } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

// ── 3D Circular Carousel ─────────────────────────────────────────────────────
interface CarouselItem {
    id: number;
    label: string;
    title: string;
    subtitle: string;
    gradient: string;
    icon: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
    {
        id: 1,
        label: '01 // AI',
        title: "Agent‑Powered Problem Makers",
        subtitle: "Building with AI agents, not just code.",
        gradient: "linear-gradient(145deg, #667eea 0%, #764ba2 60%, #f093fb 100%)",
        icon: '⚡',
    },
    {
        id: 2,
        label: '02 // WEB',
        title: "Cloud‑Ready Full‑Stack Doers",
        subtitle: "From UI to deploy, end‑to‑end.",
        gradient: "linear-gradient(145deg, #f5576c 0%, #c471ed 60%, #f093fb 100%)",
        icon: '🚀',
    },
    {
        id: 3,
        label: '03 // BUILD',
        title: "Hackathons, Startups & Serendipity",
        subtitle: "Ideas, teams and launch‑ready builds.",
        gradient: "linear-gradient(145deg, #0f9b8e 0%, #4facfe 60%, #43e97b 100%)",
        icon: '🛠',
    },
    {
        id: 4,
        label: '04 // COMMUNITY',
        title: "Peer Learning & Open Source",
        subtitle: "Collaborate, contribute and grow together.",
        gradient: "linear-gradient(145deg, #f7971e 0%, #ffd200 60%, #f9f047 100%)",
        icon: '🌐',
    },
    {
        id: 5,
        label: '05 // EVENTS',
        title: "Workshops, Talks & Meetups",
        subtitle: "Real‑world experiences that spark connections.",
        gradient: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        icon: '🎯',
    },
];

const BASE_RPM   = 0.018; // base auto-spin speed (deg/ms)
const TILT_X     = -14;   // outward tilt in degrees (negative = top leans back = towards viewer at bottom)
const FRICTION   = 0.94;  // drag momentum decay per frame

const Carousel3D: React.FC = () => {
    const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth < 1024;

    // Dynamic Sizing
    const RADIUS = isMobile ? 160 : isTablet ? 200 : 260;
    const CARD_W = isMobile ? 140 : isTablet ? 180 : 220;
    const CARD_H = isMobile ? 200 : isTablet ? 240 : 280;
    const SCENE_H = isMobile ? 320 : isTablet ? 400 : 480;

    const trackRef     = useRef<HTMLDivElement>(null);
    const angleRef     = useRef(0);
    const velRef       = useRef(0);          // extra angular velocity from drag
    const draggingRef  = useRef(false);
    const lastXRef     = useRef(0);
    const n            = CAROUSEL_ITEMS.length;
    const step         = 360 / n;

    // ── Styles (moved inside to be dynamic) ──
    const carouselStyles: Record<string, React.CSSProperties> = {
        scene: {
            width: '100%',
            height: `${SCENE_H}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1000px',
            perspectiveOrigin: '50% 55%',
            position: 'relative',
            cursor: 'grab',
            userSelect: 'none',
            touchAction: 'none',
        },
        groundShadow: {
            position: 'absolute',
            bottom: isMobile ? '10px' : '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${RADIUS * 2 + CARD_W}px`,
            height: isMobile ? '40px' : '60px',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
        },
        track: {
            transformStyle: 'preserve-3d',
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            position: 'relative',
            transform: `rotateX(${TILT_X}deg) rotateY(0deg)`,
        },
        card: {
            position: 'absolute',
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            borderRadius: isMobile ? '15px' : '20px',
            padding: isMobile ? '16px' : '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.35)',
            backfaceVisibility: 'visible',
            transition: 'box-shadow 0.3s ease',
        },
        grain: {
            position: 'absolute',
            inset: 0,
            borderRadius: isMobile ? '15px' : '20px',
            backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.06\'/%3E%3C/svg%3E")',
            opacity: 0.5,
            pointerEvents: 'none',
        },
        shine: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            borderRadius: isMobile ? '15px 15px 0 0' : '20px 20px 0 0',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)',
            pointerEvents: 'none',
        },
        cardMeta: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        cardLabel: {
            fontFamily: "'Space Mono', monospace",
            fontSize: isMobile ? '0.5rem' : '0.6rem',
            fontWeight: '700',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase' as const,
        },
        cardIcon: {
            fontSize: isMobile ? '1rem' : '1.3rem',
            lineHeight: 1,
        },
        cardTitle: {
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            fontWeight: '800',
            color: '#fff',
            lineHeight: 1.25,
            marginBottom: '8px',
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
            fontFamily: "'Manrope', sans-serif",
        },
        cardSub: {
            fontSize: isMobile ? '0.65rem' : '0.8rem',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.5,
            fontFamily: "'Manrope', sans-serif",
            margin: 0,
        },
    };

    // ── auto-spin + drag momentum ──
    useAnimationFrame((_, delta) => {
        // Always add base rotation
        velRef.current = velRef.current * FRICTION; // decay drag momentum
        angleRef.current += delta * BASE_RPM + velRef.current;

        if (trackRef.current) {
            trackRef.current.style.transform =
                `rotateX(${TILT_X}deg) rotateY(${angleRef.current}deg)`;
        }
    });

    // ── pointer drag handlers ──
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        draggingRef.current = true;
        lastXRef.current = e.clientX;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!draggingRef.current) return;
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        // dx / RADIUS gives a natural arc feel; scale to keep it snappy
        const delta = (dx / RADIUS) * 25;
        angleRef.current += delta;
        velRef.current = delta * 0.35; // seed momentum
    }, []);

    const onPointerUp = useCallback(() => {
        draggingRef.current = false;
    }, []);

    return (
        <div
            style={carouselStyles.scene}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {/* Soft ground shadow */}
            <div style={carouselStyles.groundShadow} />

            {/* Rotating track — tilt applied here via inline style in animation frame */}
            <div ref={trackRef} style={carouselStyles.track}>
                {CAROUSEL_ITEMS.map((item, i) => (
                    <div
                        key={item.id}
                        style={{
                            ...carouselStyles.card,
                            transform: `rotateY(${step * i}deg) translateZ(${RADIUS}px)`,
                            background: item.gradient,
                        }}
                    >
                        {/* Noise / grain overlay */}
                        <div style={carouselStyles.grain} />

                        {/* Top meta */}
                        <div style={carouselStyles.cardMeta}>
                            <span style={carouselStyles.cardLabel}>{item.label}</span>
                            <span style={carouselStyles.cardIcon}>{item.icon}</span>
                        </div>

                        {/* Bottom copy */}
                        <div>
                            <h3 style={carouselStyles.cardTitle}>{item.title}</h3>
                            <p  style={carouselStyles.cardSub}>{item.subtitle}</p>
                        </div>

                        {/* Shine strip */}
                        <div style={carouselStyles.shine} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

const WhatIsSection: React.FC = () => {
    const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth < 1024;

    const dynamicStyles: { [key: string]: React.CSSProperties } = {
        ...styles,
        container: {
            ...styles.container,
            padding: isMobile ? '60px 24px' : isTablet ? '60px 40px' : '80px 60px',
            flexDirection: isTablet ? 'column' : 'row',
            gap: isMobile ? '20px' : isTablet ? '40px' : '60px',
            minHeight: isMobile ? 'auto' : '100vh',
        },
        leftSection: {
            ...styles.leftSection,
            maxWidth: isTablet ? '100%' : '480px',
            paddingRight: isTablet ? '0' : '20px',
            textAlign: isTablet ? 'center' : 'left',
        },
        rightSection: {
            ...styles.rightSection,
            minHeight: isMobile ? '320px' : isTablet ? '400px' : '520px',
        }
    };

    return (
        <div className="what-is-container" style={dynamicStyles.container}>
            {/* Left Side - Text Block */}
            <div className="what-is-left" style={dynamicStyles.leftSection}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 style={styles.heading}>
                        What is <span style={styles.highlight}>The 404 Society</span>?
                    </h2>
                    <p style={styles.description}>
                        We're a student developer community at PESITM Shivamogga that thrives on innovation, collaboration, and building the future. From AI-powered solutions to full-stack deployments, we're reshaping what it means to be a student developer in Karnataka.
                    </p>
                    <p style={styles.descriptionSecondary}>
                        Join us in hackathons, workshops, and open-source projects that matter.
                    </p>
                </motion.div>
            </div>

            {/* Right Side ─ 3D Rotating Carousel */}
            <div style={dynamicStyles.rightSection}>
                <Carousel3D />
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '80px 60px',
        gap: '60px',
        position: 'relative',
        overflow: 'hidden',
    },
    leftSection: {
        flex: '1',
        maxWidth: '480px',
        paddingRight: '20px',
    },
    heading: {
        fontSize: 'clamp(2rem, 5vw, 4rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '30px',
        color: '#000',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    highlight: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontStyle: 'italic',
    },
    description: {
        fontSize: '1.125rem',
        lineHeight: '1.8',
        color: '#333',
        marginBottom: '20px',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    descriptionSecondary: {
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#666',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    rightSection: {
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '520px',
    },
};

// Responsive styles
const responsiveStyles = `
    @media (max-width: 1024px) {
        .what-is-container {
            flex-direction: column !important;
            padding: 60px 40px !important;
            gap: 40px !important;
        }
        .what-is-left {
            max-width: 100% !important;
            padding-right: 0 !important;
            text-align: center !important;
        }
    }
    @media (max-width: 768px) {
        .what-is-container {
            padding: 60px 24px !important;
            min-height: auto !important;
        }
    }
`;

if (typeof document !== 'undefined') {
    if (!document.querySelector('[data-what-is-styles]')) {
        const styleSheet = document.createElement("style");
        styleSheet.setAttribute('data-what-is-styles', '');
        styleSheet.textContent = responsiveStyles;
        document.head.appendChild(styleSheet);
    }
}

export default WhatIsSection;
