import React, { useEffect, useRef, useState, useId } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface ButterflyCursorProps {
  hideNativeCursor?: boolean;
  size?: number;
  smoothing?: number;
  fillType?: 'solid' | 'gradient';
  color?: string;
  gradientStart?: string;
  gradientEnd?: string;
}

export const ButterflyCursor: React.FC<ButterflyCursorProps> = ({
  hideNativeCursor = false,
  size = 2.2,
  smoothing = 0.6,
  fillType = 'gradient',
  color = '#38BDF8',
  gradientStart = '#60A5FA',
  gradientEnd = '#1920F0',
}) => {
  const rawId = useId().replace(/:/g, '');
  const gradientId = `butterfly-grad-${rawId}`;

  const baseWidth = 12;
  const baseHeight = 16;
  const width = baseWidth * size;
  const height = baseHeight * size;

  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const cursorOpacity = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 450, damping: 42 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 42 });
  const smoothOpacity = useSpring(cursorOpacity, { stiffness: 400, damping: 30 });

  const rotate = useMotionValue(0);
  const targetRotation = useRef(0);
  const clickBoost = useSpring(0, { stiffness: 300, damping: 25 });

  const [animKey, setAnimKey] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);

  // Optional hide native cursor
  useEffect(() => {
    if (typeof document === 'undefined' || !hideNativeCursor) return;
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = prevCursor;
    };
  }, [hideNativeCursor]);

  // Pointer tracking & Click boost
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!hasMoved.current) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (springX.jump) springX.jump(e.clientX);
        if (springY.jump) springY.jump(e.clientY);
        hasMoved.current = true;
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
      cursorOpacity.set(1);
    };

    const handleMouseLeave = () => {
      hasMoved.current = false;
      cursorOpacity.set(0);
    };

    const handleClick = () => {
      clickBoost.set(1);
      setAnimKey((k) => k + 1);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        clickBoost.set(0);
        timeoutRef.current = null;
      }, 250);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('pointerdown', handleClick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerdown', handleClick);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [mouseX, mouseY, cursorOpacity, springX, springY, clickBoost]);

  // Dynamic orientation facing flight velocity
  useEffect(() => {
    let animationFrameId: number;

    const updateRotation = () => {
      const vx = springX.getVelocity();
      const vy = springY.getVelocity();
      const speed = Math.sqrt(vx * vx + vy * vy);
      const isMoving = speed > 15;

      if (isMoving) {
        targetRotation.current = Math.atan2(vy, vx) * (180 / Math.PI) + 90;
      } else {
        // Drift back towards neutral upright position when hovering still
        targetRotation.current = 0;
      }

      const currentAngle = rotate.get();
      let delta = targetRotation.current - (currentAngle % 360);
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      const ease = isMoving ? 0.1 : 0.02;
      rotate.set(currentAngle + delta * ease);

      animationFrameId = requestAnimationFrame(updateRotation);
    };

    animationFrameId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, [springX, springY, rotate]);

  const baseDuration = 0.35 + Math.pow(smoothing, 2) * 1.5;
  const baseAmplitude = 44 * (1 - smoothing * 0.35);
  const amplitude = useTransform(clickBoost, [0, 1], [baseAmplitude, baseAmplitude * 1.6]);
  const duration = useTransform(clickBoost, [0, 1], [baseDuration, baseDuration * 0.45]);

  const fillValue = fillType === 'gradient' ? `url(#${gradientId})` : color;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        perspective: 5000,
        zIndex: 99998,
        overflow: 'hidden',
      }}
    >
      {fillType === 'gradient' && (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientStart} />
              <stop offset="100%" stopColor={gradientEnd} />
            </linearGradient>
          </defs>
        </svg>
      )}

      <motion.div
        style={{
          position: 'absolute',
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          width: width * 2,
          height: height,
          rotate,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          opacity: smoothOpacity,
          filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.65)) drop-shadow(0 0 20px rgba(25, 32, 240, 0.35))',
        }}
      >
        {/* Left Wing */}
        <motion.div
          key={`left-${animKey}`}
          style={{
            position: 'absolute',
            width,
            height,
            left: '50%',
            top: '50%',
            x: '-100%',
            y: '-50%',
            transformStyle: 'flat',
          }}
        >
          <motion.svg
            viewBox="0 0 12 16"
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: 'right center',
              rotateY: amplitude,
            }}
            animate={{ rotateY: [0, 52, 0, 52, 0] }}
            transition={{
              repeat: Infinity,
              duration: duration.get(),
              ease: 'easeInOut',
            }}
          >
            <path
              d="M0.221799 0.392428C2.006 -1.40921 12 3.24805 12 9.14307C12 12.4736 10.7625 16 7.41203 16C3.91959 16 5.56313 10.7104 6.17939 9.79611C2.68705 10.2533 -0.942285 1.56789 0.221799 0.392428Z"
              fill={fillValue}
            />
          </motion.svg>
        </motion.div>

        {/* Right Wing */}
        <motion.div
          key={`right-${animKey}`}
          style={{
            position: 'absolute',
            width,
            height,
            left: '50%',
            top: '50%',
            x: '0%',
            y: '-50%',
            transformStyle: 'flat',
          }}
        >
          <motion.svg
            viewBox="0 0 12 16"
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: 'left center',
              rotateY: amplitude,
            }}
            animate={{ rotateY: [0, -52, 0, -52, 0] }}
            transition={{
              repeat: Infinity,
              duration: duration.get(),
              ease: 'easeInOut',
            }}
          >
            <path
              d="M11.7782 0.392428C9.994 -1.40921 0 3.24805 0 9.14307C0 12.4736 1.23752 16 4.58797 16C8.08041 16 6.43687 10.7104 5.82061 9.79611C9.31295 10.2533 12.9423 1.56789 11.7782 0.392428Z"
              fill={fillValue}
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ButterflyCursor;
