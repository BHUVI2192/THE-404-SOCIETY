import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppleHelloIntroProps {
  onComplete?: () => void;
}

export const AppleHelloIntro: React.FC<AppleHelloIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'drawing' | 'drawn' | 'exiting' | 'done'>('drawing');

  useEffect(() => {
    // 1. Path drawing completes at ~1.7s
    const drawnTimer = setTimeout(() => {
      setStage('drawn');
    }, 1750);

    // 2. Pause briefly to admire the full cursive signature, then trigger bottom-to-top curtain lift
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 2200);

    // 3. Complete curtain reveal and unmount
    const doneTimer = setTimeout(() => {
      setStage('done');
      onComplete?.();
    }, 3050);

    return () => {
      clearTimeout(drawnTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="apple-hello-intro"
          initial={{ y: 0 }}
          animate={{
            y: stage === 'exiting' ? '-100%' : 0,
          }}
          transition={{
            duration: 0.82,
            ease: [0.76, 0, 0.24, 1], // Cinematic smooth curtain lift
          }}
          onClick={() => {
            if (stage !== 'exiting') setStage('exiting');
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#040711',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: stage === 'exiting' ? 'none' : 'auto',
            cursor: stage === 'exiting' ? 'default' : 'pointer',
          }}
        >
          {/* Luminous Aurora Atmosphere Overlays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 90% 60% at 50% 35%, rgba(38, 208, 206, 0.22) 0%, rgba(25, 32, 240, 0.18) 40%, rgba(4, 7, 17, 0.95) 80%, #040711 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Vertical Aurora Rays / Luminous Sheen */}
          <div
            style={{
              position: 'absolute',
              top: '-25%',
              left: '15%',
              right: '15%',
              height: '85%',
              background:
                'radial-gradient(ellipse at top, rgba(97, 238, 224, 0.16) 0%, rgba(25, 32, 240, 0.12) 50%, transparent 80%)',
              filter: 'blur(45px)',
              pointerEvents: 'none',
            }}
          />

          {/* Ambient ground shimmer glow */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '35%',
              background:
                'linear-gradient(to top, rgba(25, 32, 240, 0.14) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Central Authentic Apple "hello" SVG Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: stage === 'exiting' ? 0.35 : 1,
              scale: stage === 'exiting' ? 1.03 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '560px',
              padding: '0 28px',
              boxSizing: 'border-box',
            }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 638 200"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={14.8883}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                overflow: 'visible',
                filter:
                  stage === 'drawn' || stage === 'exiting'
                    ? 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 40px rgba(64, 224, 208, 0.35))'
                    : 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.28))',
                transition: 'filter 0.4s ease',
              }}
            >
              <title>hello</title>

              {/* Path 1: Initial 'h' stem loop */}
              <motion.path
                d="M8.69214 166.553C36.2393 151.239 61.3409 131.548 89.8191 98.0295C109.203 75.1488 119.625 49.0228 120.122 31.0026C120.37 17.6036 113.836 7.43883 101.759 7.43883C88.3598 7.43883 79.9231 17.6036 74.7122 40.9363C69.005 66.5793 64.7866 96.0036 54.1166 190.356"
                style={{ strokeLinecap: 'round' }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.65,
                  ease: 'easeInOut',
                  opacity: { duration: 0.25 },
                }}
              />

              {/* Path 2: Continuous cursive 'ello' body */}
              <motion.path
                d="M55.1624 181.135C60.6251 133.114 81.4118 98.0479 107.963 98.0479C123.844 98.0479 133.937 110.703 131.071 128.817C129.457 139.487 127.587 150.405 125.408 163.06C122.869 178.941 130.128 191.348 152.122 191.348C184.197 191.348 219.189 173.523 237.097 145.915C243.198 136.509 245.68 128.073 245.928 119.884C246.176 104.996 237.739 93.8296 222.851 93.8296C203.992 93.8296 189.6 115.17 189.6 142.465C189.6 171.745 205.481 192.341 239.208 192.341C285.066 192.341 335.86 137.292 359.199 75.8585C365.788 58.513 368.26 42.4065 368.26 31.1512C368.26 17.8057 364.042 7.55823 352.131 7.55823C340.469 7.55823 332.777 16.6141 325.829 30.9129C317.688 47.4967 311.667 71.4162 309.203 98.4549C303 166.301 316.896 191.348 349.936 191.348C390 191.348 434.542 135.534 457.286 75.6686C463.803 58.513 466.275 42.4065 466.275 31.1512C466.275 17.8057 462.057 7.55823 450.146 7.55823C438.484 7.55823 430.792 16.6141 423.844 30.9129C415.703 47.4967 409.682 71.4162 407.218 98.4549C401.015 166.301 414.911 191.348 444.416 191.348C473.874 191.348 489.877 165.67 499.471 138.402C508.955 111.447 520.618 94.8221 544.935 94.8221C565.035 94.8221 580.916 109.71 580.916 137.75C580.916 168.768 560.792 192.093 535.362 192.341C512.984 192.589 498.285 174.475 499.774 147.179C501.511 116.907 519.873 94.8221 543.943 94.8221C557.839 94.8221 569.51 100.999 578.682 107.725C603.549 125.866 622.709 114.656 630.047 96.7186"
                style={{ strokeLinecap: 'round' }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.45,
                  ease: 'easeInOut',
                  delay: 0.4,
                  opacity: { duration: 0.4, delay: 0.4 },
                }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppleHelloIntro;
