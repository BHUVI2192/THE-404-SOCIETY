import React from 'react';
import { motion } from 'framer-motion';

const WhatIsSection: React.FC = () => {
    const cards = [
        {
            id: 1,
            title: "Agent‑Powered Problem Makers",
            subtitle: "Building with AI agents, not just code.",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            glowColor: "rgba(102, 126, 234, 0.4)"
        },
        {
            id: 2,
            title: "Cloud‑Ready Full‑Stack Doers",
            subtitle: "From UI to deploy, end‑to‑end.",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd876 100%)",
            glowColor: "rgba(245, 87, 108, 0.4)"
        },
        {
            id: 3,
            title: "Hackathons, Startups & Serendipity",
            subtitle: "Ideas, teams and launch‑ready builds.",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)",
            glowColor: "rgba(79, 172, 254, 0.4)"
        }
    ];

    return (
        <div className="what-is-container" style={styles.container}>
            {/* Left Side - Text Block */}
            <div className="what-is-left" style={styles.leftSection}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 style={styles.heading}>
                        What is The <span style={styles.highlight}>404 Society</span>?
                    </h2>
                    <p style={styles.description}>
                        We're a student developer community at PESITM Shivamogga that thrives on innovation, collaboration, and building the future. From AI-powered solutions to full-stack deployments, we're reshaping what it means to be a student developer in Karnataka.
                    </p>
                    <p style={styles.descriptionSecondary}>
                        Join us in hackathons, workshops, and open-source projects that matter.
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Glassmorphism Cards Stack */}
            <div style={styles.rightSection}>
                <div className="what-is-cards-container" style={styles.cardsContainer}>
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            style={{
                                ...styles.cardWrapper,
                                marginBottom: index < cards.length - 1 ? '30px' : '0'
                            }}
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                ease: "easeOut"
                            }}
                            whileHover={{
                                y: -12,
                                scale: 1.02,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                        >
                            <motion.div
                                style={{
                                    ...styles.card,
                                    background: card.gradient
                                }}
                                className="what-is-card"
                                whileHover={{
                                    boxShadow: `0 25px 60px -12px ${card.glowColor}, 0 0 40px ${card.glowColor}`,
                                }}
                            >
                                {/* Glassmorphism overlay */}
                                <div style={styles.glassOverlay} />
                                
                                {/* Content */}
                                <div style={styles.cardContent}>
                                    <h3 className="what-is-card-title" style={styles.cardTitle}>{card.title}</h3>
                                    <p className="what-is-card-subtitle" style={styles.cardSubtitle}>{card.subtitle}</p>
                                </div>

                                {/* Decorative elements */}
                                <div style={styles.decorativeDot} />
                                <motion.div
                                    style={styles.decorativeLine}
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
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
        gap: '80px',
        position: 'relative',
        overflow: 'hidden'
    },
    leftSection: {
        flex: '1',
        maxWidth: '500px',
        paddingRight: '40px'
    },
    heading: {
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '30px',
        color: '#000',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    highlight: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontStyle: 'italic'
    },
    description: {
        fontSize: '1.125rem',
        lineHeight: '1.8',
        color: '#333',
        marginBottom: '20px',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    descriptionSecondary: {
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#666',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    rightSection: {
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '650px'
    },
    cardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '480px'
    },
    cardWrapper: {
        position: 'relative',
        width: '100%'
    },
    card: {
        position: 'relative',
        width: '100%',
        height: '200px',
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    glassOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '24px',
        zIndex: 1
    },
    cardContent: {
        position: 'relative',
        zIndex: 2
    },
    cardTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        lineHeight: '1.3',
        marginBottom: '12px',
        color: '#ffffff',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    cardSubtitle: {
        fontSize: '1rem',
        lineHeight: '1.5',
        color: 'rgba(255, 255, 255, 0.95)',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    decorativeDot: {
        position: 'absolute',
        top: '24px',
        right: '24px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        zIndex: 2
    },
    decorativeLine: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '3px',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        transformOrigin: 'left',
        zIndex: 2
    }
};

// Responsive styles
const responsiveStyles = `
    @media (max-width: 1024px) {
        .what-is-container {
            flex-direction: column !important;
            padding: 60px 40px !important;
            gap: 60px !important;
        }
        
        .what-is-left {
            max-width: 100% !important;
            padding-right: 0 !important;
            text-align: center !important;
        }
        
        .what-is-cards-container {
            max-width: 400px !important;
        }
    }
    
    @media (max-width: 768px) {
        .what-is-container {
            padding: 40px 24px !important;
            min-height: auto !important;
        }
        
        .what-is-cards-container {
            max-width: 100% !important;
        }
        
        .what-is-card {
            height: 180px !important;
            padding: 24px !important;
            border-radius: 20px !important;
        }
        
        .what-is-card-title {
            font-size: 1.25rem !important;
        }
        
        .what-is-card-subtitle {
            font-size: 0.9rem !important;
        }
    }
`;

// Inject responsive styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = responsiveStyles;
    document.head.appendChild(styleSheet);
}

export default WhatIsSection;
