// components/AboutHeroAnimation.tsx
import React, { CSSProperties } from "react";
import { motion, MotionStyle } from "framer-motion";

// --- Configuration ---
const CONFIG = {
    text: "STREETWEAR FOOTWEAR COLLECTION ",
    scrollSpeed: 40, // Duration in seconds (Higher = Slower)
    fontFamily: "'Manrope', sans-serif",
    // Images to float around
    images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80",
    ],
};

const AboutHeroAnimation = () => {
    return (
        <div style={styles.container}>
            {/* Inject Manrope Font locally for this component */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@800&display=swap');`}
            </style>

            {/* --- Floating Images Layer --- */}
            <div style={styles.imageLayer}>
                {CONFIG.images.map((src, index) => (
                    <FloatingImage key={index} src={src} index={index} />
                ))}
            </div>

            {/* --- Marquee Text Layer --- */}
            <div style={styles.marqueeContainer}>
                <MarqueeText />
            </div>
        </div>
    );
};

// --- Sub-Components ---

const MarqueeText = () => {
    return (
        <div style={styles.marqueeWrapper}>
            <motion.div
                style={styles.track as MotionStyle}
                animate={{ x: "-50%" }}
                transition={{
                    ease: "linear",
                    duration: CONFIG.scrollSpeed,
                    repeat: Infinity,
                }}
            >
                {/* Repeated 4 times to ensure no gaps on wide screens */}
                {[...Array(4)].map((_, i) => (
                    <span key={i} style={styles.text}>{CONFIG.text}</span>
                ))}
            </motion.div>
        </div>
    );
};

interface FloatingImageProps {
    src: string;
    index: number;
    [key: string]: any;
}

const FloatingImage = ({ src, index }: FloatingImageProps) => {
    // Random positioning logic
    // Use useMemo to prevent re-caclulation on re-renders if likely, but simple component relies on mount.
    // Actually, since this component re-renders, the randoms might jump if parent re-renders?
    // But parent is static.
    // Ideally these should be stable.
    const randomTop = React.useMemo(() => Math.floor(Math.random() * 60) + 10, []); // Avoid extreme top/bottom
    const randomLeft = React.useMemo(() => Math.floor(Math.random() * 80) + 5, []);
    const randomRotate = React.useMemo(() => Math.floor(Math.random() * 30) - 15, []);

    return (
        <motion.img
            src={src}
            alt="decorative"
            style={{
                ...styles.floatingImage,
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                rotate: `${randomRotate}deg`,
            } as any} // Cast to any to accept rotate string or MotionStyle
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }} // Animate when user scrolls to it
            viewport={{ once: true }}
            animate={{
                y: [0, -15, 0], // Gentle bobbing
            }}
            transition={{
                y: {
                    repeat: Infinity,
                    duration: 3 + index,
                    ease: "easeInOut",
                }
            }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        />
    );
};

// --- Isolated Styles ---
const styles: Record<string, CSSProperties> = {
    container: {
        position: "relative",
        width: "100%",
        height: "100vh", // Takes up full viewport height
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // Crucial: Cuts off text going outside
    },
    marqueeContainer: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        mixBlendMode: "screen", // Makes text interact coolly with images if they overlap
    },
    marqueeWrapper: {
        display: "flex",
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    track: {
        display: "flex",
    },
    text: {
        fontFamily: CONFIG.fontFamily,
        fontSize: "clamp(6rem, 20vw, 20rem)", // Responsive: huge but won't break mobile
        fontWeight: "800",
        color: "#ffffff",
        textTransform: "uppercase",
        paddingRight: "40px",
        lineHeight: 1,
        letterSpacing: "-0.02em",
    },
    imageLayer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none",
    },
    floatingImage: {
        position: "absolute",
        width: "clamp(150px, 15vw, 300px)", // Responsive image size
        height: "auto",
        objectFit: "cover",
        borderRadius: "8px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        pointerEvents: "auto",
        cursor: "grab",
        opacity: 0.9,
    },
};

export default AboutHeroAnimation;
