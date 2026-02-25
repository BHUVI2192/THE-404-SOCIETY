import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useCircleTransition } from "../src/hooks/useCircleTransition";

// --- CONFIGURATION ---
const CONFIG = {
    text: "WHO WE ARE",
    images: [
        { id: 1, src: "the core.jpg", left: "2%", top: "15vh", rot: "-5deg" },
        { id: 2, src: "hrishi.jpg", left: "18%", top: "55vh", rot: "3deg" },
        { id: 3, src: "workspac.jpg", left: "35%", top: "10vh", rot: "-2deg" },
        { id: 4, src: "github.jpg", left: "48%", top: "60vh", rot: "4deg" },
        { id: 5, src: "bhu.jpg", left: "65%", top: "10vh", rot: "-2deg" },
        { id: 6, src: "group.jpg", left: "78%", top: "15vh", rot: "-4deg" }, // Adjusted from 82%
        { id: 7, src: "WhatsApp Image 2025-10-29 at 17.38.31_4dcd0610.jpg", left: "92%", top: "60vh", rot: "4deg" }, // Adjusted from 86%
    ],
    fontFamily: "'Manrope', sans-serif",
};

const CARDS = [
    { id: 1, title: "HACKATHONS", desc: "48-hour coding marathons — build, ship & compete at PESITM Shivamogga.", color: "#111", text: "#fff" },
    { id: 2, title: "COMPETITIONS", desc: "Competitive coding battles, UI/UX design challenges & algorithm showdowns.", color: "#F5F5F7", text: "#000" },
    { id: 3, title: "WORKSHOPS", desc: "Hands-on tech workshops in web development, AI/ML & cloud computing.", color: "#111", text: "#fff" },
    { id: 4, title: "404 INNOVATORS", desc: "Lead the student developer movement on your campus in Karnataka.", color: "#F5F5F7", text: "#000" },
];

const WINGS = [
    {
        id: "01",
        title: "404 Studios",
        role: "CREATIVE AGENCY",
        desc: "We craft digital experiences that matter. From branding to UI/UX design, our creative studio defines the visual language of student-driven innovation.",
        color: "#fff",
        text: "#000"
    },
    {
        id: "02",
        title: "404 Careers",
        role: "TALENT & HIRING",
        desc: "Connecting PESITM's top student developers with industry internships, placements & world-class career opportunities.",
        color: "#111",
        text: "#fff"
    },
    {
        id: "03",
        title: "SnapShutter",
        role: "MEDIA & PRODUCTION",
        desc: "Capturing tech event moments & framing narratives. Led by Rudresh J, we turn Shivamogga's coding culture into cinematic history.",
        color: "#f0f0f0",
        text: "#000"
    }
];

const AboutRevealSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100, mass: 0.5 });

    // --- ANIMATION TIMELINE ---
    // OPTIMIZED: Keep aggressive mask for image reveal effect while maintaining performance
    const maskSize = useTransform(smoothProgress, [0, 0.05], ["0%", "150%"]);
    const maskGradient = useTransform(maskSize, (val: string) =>
        `radial-gradient(circle at center, black ${val}, transparent ${val})`
    );

    const xMove = useTransform(smoothProgress, [0.05, 0.28], ["0vw", "-300vw"]);
    const trackOpacity = useTransform(smoothProgress, [0.28, 0.32], [1, 0]);

    // Parallax for images (Faster close to eye)
    const imgParallax = useTransform(smoothProgress, [0.05, 0.28], ["0vw", "-50vw"]);

    return (
        // Height: 1500vh
        <div ref={containerRef} className="about-scroll-container" style={{ height: "1500vh", position: "relative", backgroundColor: "#fff" }}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&display=swap');`}
                {`::-webkit-scrollbar { display: none; } body { margin: 0; }`}
                {`
                    .who-text { font-size: 75vh; line-height: 0.85; }
                    .society-title { font-size: 5rem; }
                    .gallery-img-wrapper { 
                        width: 26vw; 
                        rotate: var(--rot);
                    }

                    @media (max-width: 768px) {
                        .who-text { font-size: 15vh !important; }
                        .society-title { font-size: 3rem !important; }
                        /* Make images slightly smaller and REMOVE TILT on mobile */
                        .gallery-img-wrapper { 
                            width: 45vw !important; 
                            rotate: 0deg !important;
                        }

                        /* Shrink the overall scroll container height on mobile */
                        .about-scroll-container {
                            height: 1300vh !important;
                        }
                        
                        .mobile-hidden {
                            display: none !important;
                        }

                        /* Hero title + subtitle mobile size reduction */
                        .hero-big-title {
                            font-size: 13vw !important;
                        }
                        .hero-subtitle {
                            font-size: 1rem !important;
                            margin-top: 12px !important;
                        }
                        .hero-scroll-hint {
                            font-size: 0.75rem !important;
                            margin-top: 28px !important;
                            padding: 8px 16px !important;
                        }

                        /* Society/Community section text (horizontal scrolling panel) */
                        .society-title {
                            font-size: 2rem !important;
                            margin-bottom: 16px !important;
                        }
                        .society-desc {
                            font-size: 1.05rem !important;
                            line-height: 1.5 !important;
                        }

                        /* Remove ALL gap in Join CTA on mobile */
                        .cta-container {
                            padding: 20px 0 !important;
                            margin: 0 !important;
                        }
                        .connector-line {
                            height: 30px !important;
                            margin-bottom: 10px !important;
                        }
                        .cta-footer-small {
                            display: none !important;
                        }
                        .cta-content {
                            gap: 24px !important;
                        }

                        /* Thought section — 100vh is too tall on mobile */
                        .thought-container {
                            height: auto !important;
                            padding: 60px 20px !important;
                        }

                        /* Stacking Cards Mobile Resize */
                        .stack-card-inner {
                            height: 55vh !important; /* Slightly taller to fit text */
                            padding: 25px !important;
                            border-radius: 20px !important;
                            display: flex !important;
                            flex-direction: column !important;
                            justify-content: center !important;
                        }
                        .stack-card-text {
                            font-size: clamp(1.8rem, 5vw, 2.5rem) !important;
                            line-height: 1.1 !important;
                            word-break: break-word !important; /* Prevent overflow */
                            hyphens: auto !important;
                        }
                        .stack-card-desc {
                            font-size: 1rem !important;
                            margin-top: 15px !important;
                            line-height: 1.4 !important;
                        }

                        /* Dynamic Stack Variables Override for Mobile */
                        :root {
                            --stack-start: 22vh; /* Start lower to center visuals */
                            --stack-step: 15px; /* Tighter visual gap */
                        }

                        /* Reduce container height on mobile to lessen scroll gap */
                        .stack-container {
                            height: 60vh !important; /* Was 100vh on desktop */
                        }

                        /* Wings Section Mobile Fixes */
                        .wing-content {
                            width: 90% !important;
                            height: 70% !important; /* Reduce height to fit better */
                            justify-content: center !important;
                            gap: 20px !important;
                        }
                        .wing-heading {
                            font-size: 3.5rem !important;
                            line-height: 1 !important;
                        }
                        .wing-desc {
                            font-size: 1.1rem !important;
                            margin-top: 15px !important;
                        }
                        .wing-btn {
                            padding: 12px 30px !important;
                            font-size: 0.9rem !important;
                        }
                    }
                `}
            </style>

            {/* --- LAYER 1: HERO (Fixed + Fades Out) --- */}
            <motion.div style={{ ...styles.fixedLayer, opacity: trackOpacity }}>
                <HeroContent />
            </motion.div>

            {/* --- LAYER 2: MASKED HORIZONTAL TRACK (Fixed + Fades Out) --- */}
            <motion.div
                style={{
                    ...styles.fixedLayer,
                    zIndex: 10,
                    // Restored clip-path / mask-image for effect requested by user
                    WebkitMaskImage: maskGradient,
                    maskImage: maskGradient,
                    backgroundColor: "#000",
                    opacity: trackOpacity,
                    willChange: "mask-image, opacity",
                    // Force GPU compositing
                    transform: "translate3d(0,0,0)",
                    backfaceVisibility: "hidden",
                    perspective: 1000,
                    transformZ: 0
                }}
            >
                <motion.div style={{ ...styles.horizontalTrack, x: xMove }}>
                    {/* WHO WE ARE */}
                    <div style={styles.sectionWho}>
                        <h1 style={styles.hugeText} className="who-text">{CONFIG.text}</h1>
                        {CONFIG.images.map((img, index) => {
                            const isLastTwo = index >= CONFIG.images.length - 2;
                            return (
                                <motion.div
                                    key={img.id}
                                    className={`gallery-img-wrapper ${isLastTwo ? 'mobile-hidden' : ''}`}
                                    style={{
                                        position: 'absolute',
                                        left: img.left,
                                        top: img.top,
                                        zIndex: 2,
                                        // @ts-ignore
                                        "--rot": img.rot, // Passed as CSS var for responsive control
                                        x: imgParallax
                                    }}
                                >
                                    <div style={styles.imageCard}>
                                        <div style={styles.noiseOverlay} />
                                        <img loading="lazy" src={img.src} alt="404 Society" style={styles.image} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* COMMUNITY */}
                    <div style={styles.sectionCommunity}>
                        <div style={styles.textBlock}>
                            <h2 style={{ ...styles.societyTitle, fontSize: undefined }} className="society-title">
                                THE <span style={{ fontStyle: 'italic', borderBottom: '2px solid white' }}>404</span> SOCIETY
                            </h2>
                            <p style={styles.societyDesc} className="society-desc">
                                We <span style={{ fontStyle: 'italic' }}>build, code &amp; innovate</span>.<br /><br />
                                PESITM's coding club driving hackathons, workshops &amp; open-source projects in Karnataka.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* --- LAYER 3: SPACER --- */}
            <div style={{ height: "420vh" }}></div>

            {/* --- LAYER 4: STACKING CARDS --- */}
            <div style={{ position: 'relative', zIndex: 20, backgroundColor: '#fff', minHeight: '100vh' }}>
                <StackingCardsApple />
            </div>

            {/* --- LAYER 5: WINGS SECTION --- */}
            <div style={{ position: 'relative', zIndex: 30, backgroundColor: '#fff' }}>
                <WingsSection />
            </div>

            {/* --- LAYER 6: THOUGHT SECTION --- */}
            <ThoughtSection />

            {/* --- LAYER 7: JOIN CTA (Fill Gap) --- */}
            <JoinCTA />

        </div>
    );
}

// --- SUB-COMPONENTS ---
const HeroContent = () => (
    <div style={styles.heroFrame}>
        <motion.div
            style={styles.centeredContent}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 } // Reduced from 0.3
                }
            }}
        >
            {/* Animated Title */}
            <motion.h1
                className="hero-big-title"
                style={styles.bigHeroTitle}
                variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
            >
                ABOUT US
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.p
                className="hero-subtitle"
                style={styles.heroSubtitle}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
            >
                PESITM's Student-Run Developer Community in Shivamogga
            </motion.p>

            {/* Animated Scroll Hint */}
            <motion.div
                className="hero-scroll-hint"
                style={styles.scrollHint}
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } }
                }}
            >
                Scroll to Explore &darr;
            </motion.div>
        </motion.div>
    </div>
);

const StackingCardsApple = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={ref} style={styles.stackContainer}>
            <div style={styles.stackHeader}>
                <h2 style={styles.stackTitle}>WE BUILD<br />THE FUTURE</h2>
                <p style={styles.stackSubtitle}>Our initiatives are designed to push boundaries.</p>
            </div>

            <div style={styles.cardsWrapper}>
                {CARDS.map((card, i) => {
                    const targetScale = 1 - ((CARDS.length - i) * 0.05);
                    return (
                        <StickyCard key={i} i={i} {...card} progress={scrollYProgress} targetScale={targetScale} />
                    )
                })}
            </div>
        </div>
    );
};

const StickyCard = ({ i, title, desc, color, text, progress, targetScale }: any) => {
    const rangeStart = i * 0.20;
    const rangeEnd = 1;
    const scale = useTransform(progress, [rangeStart, rangeEnd], [1, targetScale]);

    return (
        // Use CSS variables for responsive top offset
        <div className="stack-container" style={{ ...styles.cardStickyContainer, top: `calc(var(--stack-start, 10vh) + ${i} * var(--stack-step, 40px))` }}>
            <motion.div className="stack-card-inner" style={{ ...styles.cardInner, backgroundColor: color, color: text, scale }}>
                {/* Removed heavy maskImage usage for performance */}<div style={styles.cardHeader}><span style={styles.cardNum}>(0{i + 1})</span></div>
                <div style={styles.cardLeft}><h2 className="stack-card-text" style={styles.cardBigText}>{title}</h2></div>
                <div style={styles.cardBottom}>
                    <div style={{ ...styles.cardLine, backgroundColor: text }} />
                    <p className="stack-card-desc" style={styles.cardDesc}>{desc}</p>
                </div>
            </motion.div>
        </div>
    )
}

const WingsSection = () => {
    return (
        <div style={styles.wingsWrapper}>
            <div style={styles.wingsHeader}>
                <h2 style={styles.wingsTitleText}>THE WINGS<br />OF 404</h2>
                <div style={styles.wingsLine}></div>
            </div>
            {WINGS.map((wing, i) => (
                <div key={i} className="wing-curtain" style={{ ...styles.wingCurtain, backgroundColor: wing.color, color: wing.text, top: 0, zIndex: i + 1 }}>
                    <div className="wing-content" style={styles.wingContent}>
                        <div style={styles.wingTopRow}>
                            <span style={styles.wingId}>{wing.id}</span>
                            <span style={styles.wingRole}>{wing.role}</span>
                        </div>
                        <div style={styles.wingMain}>
                            <h3 className="wing-heading" style={styles.wingHeading}>{wing.title}</h3>
                            <p className="wing-desc" style={styles.wingDesc}>{wing.desc}</p>
                        </div>
                        <div style={styles.wingBottom}>
                            <button className="wing-btn" style={{ ...styles.wingButton, borderColor: wing.text }}>EXPLORE</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ThoughtSection = () => {
    return (
        <div className="thought-container" style={styles.thoughtContainer}>
            <div style={styles.thoughtContent}>
                <h2 style={styles.thoughtText}>
                    "Thinking is the hardest work there is, which is probably the reason why so <span style={styles.highlight}>few engage in it</span>."
                </h2>
                <p style={{ ...styles.thoughtAuthor, fontStyle: 'italic', marginTop: '20px', opacity: 0.6 }}>— Henry Ford</p>
            </div>
        </div>
    );
};

const JoinCTA = () => {
    const { buttonRef, triggerTransition, maskStyle } = useCircleTransition({
        path: '/community',
        duration: 0.8,
        delay: 0.1
    });

    return (
        <div className="cta-container" style={styles.ctaContainer}>
            {/* Morph Mask - Fixed Position */}
            <div style={maskStyle} />

            <div className="connector-line" style={styles.connectorLine}></div>
            <div className="cta-content" style={styles.ctaContent}>
                <h2 style={styles.ctaTitle}>READY TO JOIN PESITM'S<br />TOP CODING COMMUNITY?</h2>
                <button
                    ref={buttonRef}
                    onClick={triggerTransition}
                    style={styles.ctaButton}
                >
                    BECOME A MEMBER
                </button>
                <div className="cta-footer-small" style={styles.ctaFooterSmall}>
                    <span>© 2026 // SHIVAMOGGA</span>
                </div>
            </div>
        </div>
    )
}

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
    // LAYOUT
    fixedLayer: { position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden" },

    // HERO STYLES
    heroFrame: { height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "#fff" },
    centeredContent: { textAlign: "center", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", willChange: "transform, opacity" },
    bigHeroTitle: { fontSize: "11vw", fontWeight: "900", letterSpacing: "-0.05em", margin: 0, lineHeight: 0.9, color: "#000", willChange: "transform, opacity", transform: "translate3d(0,0,0)" },
    heroSubtitle: { fontSize: "1.5rem", marginTop: "20px", color: "#555", fontWeight: "500", willChange: "transform, opacity", transform: "translate3d(0,0,0)" },
    scrollHint: { marginTop: "50px", fontSize: "1rem", fontWeight: "600", color: "#000", padding: "10px 20px", border: "1px solid #000", borderRadius: "30px", willChange: "opacity" },

    // HORIZONTAL TRACK
    horizontalTrack: { display: "flex", height: "100%", width: "max-content", alignItems: 'center' },
    sectionWho: { position: 'relative', minWidth: "250vw", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5vw", willChange: "transform" },
    hugeText: { fontWeight: "300", color: "#ffffff", margin: 0, lineHeight: 0.85, whiteSpace: "nowrap", letterSpacing: "-0.04em", userSelect: "none", zIndex: 1, willChange: "none", transform: "translate3d(0,0,0)" },
    imageCard: { width: "100%", aspectRatio: "16/9", backgroundColor: "#fff", padding: "8px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" },
    image: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

    // COMMUNITY SECTION
    sectionCommunity: { width: "120vw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "10vw" },
    textBlock: { color: "white", maxWidth: "800px" },
    societyTitle: { fontSize: "5rem", fontWeight: "300", margin: "0 0 30px 0", lineHeight: 1.1 },
    societyDesc: { fontSize: "1.8rem", fontWeight: "300", lineHeight: 1.5, opacity: 0.8 },

    // STACK SECTION
    stackContainer: { backgroundColor: "#fff", position: "relative", width: "100%", paddingBottom: "10vh", paddingTop: "10vh" },
    stackHeader: { height: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" },
    stackTitle: { fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: "800", lineHeight: 0.9, margin: 0, letterSpacing: "-0.04em", color: "#000" },
    stackSubtitle: { marginTop: "30px", fontSize: "1.2rem", color: "#666", maxWidth: "500px" },
    cardsWrapper: { position: "relative", paddingBottom: "10vh" },
    cardStickyContainer: { height: "100vh", position: "sticky", top: 0, display: "flex", alignItems: "center", justifyContent: "center" },
    cardInner: {
        width: "90vw",
        height: "85vh",
        borderRadius: "40px",
        padding: "50px",
        boxShadow: "0 -30px 60px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transformOrigin: "top center"
    },
    cardHeader: { display: "flex", justifyContent: "flex-end" },
    cardNum: { fontSize: "1.5rem", fontWeight: "600", opacity: 0.6 },
    cardLeft: { flex: 1, display: "flex", alignItems: "center" },
    cardBigText: { fontSize: "clamp(4rem, 12vw, 10rem)", fontWeight: "800", margin: 0, lineHeight: 0.9, textTransform: "uppercase" },
    cardBottom: { width: "100%" },
    cardLine: { width: "100%", height: "1px", opacity: 0.3, marginBottom: "20px" },
    cardDesc: { fontSize: "1.5rem", fontWeight: "500", maxWidth: "600px" },

    // WINGS SECTION STYLES
    wingsWrapper: { position: 'relative', backgroundColor: '#fff', paddingBottom: '0', zIndex: 30 },
    wingsHeader: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 1 } as React.CSSProperties,
    wingsTitleText: { fontSize: "clamp(3rem, 10vw, 8rem)", fontWeight: "800", textAlign: 'center', lineHeight: 0.9, letterSpacing: "-0.04em" },
    wingsLine: { width: '2px', height: '100px', backgroundColor: '#000', marginTop: '50px' },
    wingCurtain: {
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 -40px 80px rgba(0,0,0,0.2)"
    },
    wingContent: { width: "80%", maxWidth: "1400px", display: "flex", flexDirection: "column", height: "80%", justifyContent: "space-between" },
    wingTopRow: { display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "600", opacity: 0.7, borderBottom: "1px solid currentColor", paddingBottom: "20px" },
    wingMain: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
    wingHeading: { fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: "800", margin: 0, lineHeight: 1 },
    wingDesc: { fontSize: "1.5rem", marginTop: "30px", maxWidth: "600px", lineHeight: 1.4, opacity: 0.8 },
    wingBottom: { display: "flex", justifyContent: "flex-end" },
    wingButton: { padding: "15px 40px", fontSize: "1rem", background: "transparent", border: "1px solid", borderRadius: "50px", cursor: "pointer", fontWeight: "700", textTransform: "uppercase" },

    // THOUGHT SECTION
    thoughtContainer: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        color: "#000",
        position: "relative",
        zIndex: 35
    },
    thoughtContent: { maxWidth: "1200px", width: "90%", textAlign: "center" },
    thoughtText: { fontSize: "clamp(2rem, 5vw, 4.5rem)", fontWeight: "300", lineHeight: 1.2, letterSpacing: "-0.02em" },
    highlight: {
        fontWeight: "800",
        fontStyle: "italic",
        background: "linear-gradient(90deg, #000, #2E86C1, #8E44AD)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    thoughtAuthor: { fontSize: "1.2rem", letterSpacing: "0.05em" },

    // NEW JOIN CTA
    ctaContainer: {
        position: 'relative',
        zIndex: 40,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '20vh'
    },
    connectorLine: {
        width: '2px',
        height: '150px',
        backgroundColor: '#000',
        marginBottom: '50px'
    },
    ctaContent: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px'
    },
    ctaTitle: {
        fontSize: "clamp(3rem, 8vw, 6rem)",
        fontWeight: "900",
        lineHeight: 0.9,
        letterSpacing: "-0.04em",
        margin: 0
    },
    ctaButton: {
        padding: "20px 60px",
        fontSize: "1.2rem",
        backgroundColor: "#000",
        color: "#fff",
        borderRadius: "100px",
        border: "none",
        cursor: "pointer",
        fontWeight: "700",
        letterSpacing: "0.05em",
        transition: "transform 0.2s ease"
    },
    ctaFooterSmall: {
        marginTop: "100px",
        fontSize: "0.8rem",
        opacity: 0.4,
        letterSpacing: "0.1em"
    }
};

export default AboutRevealSection;
