import React, { CSSProperties } from "react";
import { motion, MotionStyle } from "framer-motion";

// --- Configuration ---
const CONFIG = {
    // The text content
    text: "WHO WE ARE ",

    // Speed: Higher duration = Slower speed
    speed: 30,

    // The specific font requested
    fontFamily: "'Manrope', sans-serif",

    // Images configuration: 
    // 'left' positions the image horizontally relative to the text block (0% = start, 100% = end)
    // 'top' adjusts vertical position
    images: [
        {
            src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80",
            left: "12%", // Over the "W" in WHO
            top: "10%",
            width: "15vw",
            rotation: "-5deg"
        },
        {
            src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80",
            left: "45%", // In the gap between words
            top: "40%",
            width: "12vw",
            rotation: "10deg"
        },
        {
            src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80",
            left: "75%", // Over the "R" in ARE
            top: "-10%",
            width: "18vw",
            rotation: "3deg"
        }
    ],
};

const IntegratedMarquee = () => {
    return (
        <div style={styles.container}>
            {/* Inject Font */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@800&display=swap');`}
            </style>

            {/* The Marquee Wrapper */}
            <div style={styles.marqueeWrapper}>
                <motion.div
                    style={styles.track as MotionStyle}
                    animate={{ x: "-50%" }} // Moves exactly half the width (one full content set)
                    transition={{
                        ease: "linear",
                        duration: CONFIG.speed,
                        repeat: Infinity,
                    }}
                >
                    {/* We render the content TWICE to create a seamless infinite loop */}
                    <MarqueeContent />
                    <MarqueeContent />
                </motion.div>
            </div>
        </div>
    );
};

// --- Sub-Component: The Content Block ---
const MarqueeContent = () => {
    return (
        <div style={styles.contentBlock}>
            {/* The Huge Text */}
            <h1 style={styles.text}>{CONFIG.text}</h1>

            {/* The Attached Images */}
            {CONFIG.images.map((img, index) => (
                <motion.div
                    key={index}
                    style={{
                        ...styles.imageContainer,
                        left: img.left,
                        top: img.top,
                        width: img.width,
                        transform: `rotate(${img.rotation})`,
                    } as any}
                    // Optional: Add hover effect to images
                    whileHover={{ scale: 1.1, zIndex: 100 }}
                >
                    <img src={img.src} alt="" style={styles.image} />
                </motion.div>
            ))}
        </div>
    );
};

// --- Styles ---
const styles: Record<string, CSSProperties> = {
    container: {
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#ffffff", // White background like reference
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    marqueeWrapper: {
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    track: {
        display: "flex",
        width: "fit-content", // Shrink wrap to content size
    },
    // This block holds one set of Text + Images
    contentBlock: {
        position: "relative", // Needed for absolute positioning of images
        display: "flex",
        alignItems: "center",
        paddingRight: "5vw", // Spacing between the loop iterations
    },
    text: {
        fontFamily: CONFIG.fontFamily,
        fontSize: "35vw", // Massive font size
        fontWeight: "800",
        color: "#000000", // Black text
        margin: 0,
        lineHeight: 0.8,
        letterSpacing: "-0.04em",
        userSelect: "none",
    },
    imageContainer: {
        position: "absolute",
        zIndex: 2, // Sits on top of text
        filter: "grayscale(100%)", // Makes images B&W like the reference
    },
    image: {
        width: "100%",
        height: "auto",
        display: "block",
        boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    },
};

export default IntegratedMarquee;
