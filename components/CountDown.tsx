import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProCountdownProps {
  targetDate: string | Date;
  tint?: string;
  labelColor?: string;
  fontSize?: number;
  gap?: number;
  showSeparators?: boolean;
  fontFamily?: string;
  fontWeight?: number | string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: string | Date): TimeLeft => {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const difference = target - now;

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

function Digit({
  value,
  fontSize,
  tint,
  fontFamily,
}: {
  value: string;
  fontSize: number;
  tint: string;
  fontFamily: string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        height: fontSize * 1.15,
        width: fontSize * 0.65,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          style={{
            fontSize: fontSize,
            lineHeight: 1,
            color: tint,
            position: 'absolute',
            fontFamily: `"${fontFamily}", monospace`,
            fontWeight: 'inherit',
          }}
          initial={{ y: '-60%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '60%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ type: 'spring', stiffness: 450, damping: 35, mass: 1 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function NumberGroup({
  value,
  label,
  tint = '#000000',
  labelColor = '#71717a',
  fontSize = 60,
  fontFamily = 'Space Mono',
}: {
  value: number;
  label: string;
  tint?: string;
  labelColor?: string;
  fontSize?: number;
  fontFamily?: string;
}) {
  const digits = (value < 10 ? `0${value}` : `${value}`).split('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {digits.map((digit, index) => (
          <Digit
            key={index}
            value={digit}
            fontSize={fontSize}
            tint={tint}
            fontFamily={fontFamily}
          />
        ))}
      </div>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginTop: '8px',
          textAlign: 'center',
          color: labelColor,
          fontFamily: `"${fontFamily}", monospace`,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Separator({
  fontSize = 60,
  tint = '#000000',
  fontFamily = 'Space Mono',
}: {
  fontSize?: number;
  tint?: string;
  fontFamily?: string;
}) {
  return (
    <div
      style={{
        fontWeight: 'bold',
        fontSize: fontSize * 0.85,
        lineHeight: 1,
        opacity: 0.3,
        color: tint,
        fontFamily: `"${fontFamily}", monospace`,
        marginTop: '-4px',
      }}
    >
      :
    </div>
  );
}

/**
 * Exact implementation of Framer Count_Down.js component
 * @see https://framer.com/m/Count-Down-yIqNhX.js@YlPlrUmsTptewPC0PkbF
 */
export const ProCountdown: React.FC<ProCountdownProps> = ({
  targetDate,
  tint = '#000000',
  labelColor = '#71717a',
  fontSize = 64,
  gap = 24,
  showSeparators = true,
  fontFamily = 'Space Mono',
  fontWeight = 700,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: gap,
        color: tint,
        fontFamily: `"${fontFamily}", sans-serif`,
        fontWeight: fontWeight,
        flexWrap: 'wrap',
      }}
    >
      <NumberGroup
        value={timeLeft.days}
        label="DAYS"
        tint={tint}
        labelColor={labelColor}
        fontSize={fontSize}
        fontFamily={fontFamily}
      />
      {showSeparators && (
        <Separator fontSize={fontSize} tint={tint} fontFamily={fontFamily} />
      )}
      <NumberGroup
        value={timeLeft.hours}
        label="HOURS"
        tint={tint}
        labelColor={labelColor}
        fontSize={fontSize}
        fontFamily={fontFamily}
      />
      {showSeparators && (
        <Separator fontSize={fontSize} tint={tint} fontFamily={fontFamily} />
      )}
      <NumberGroup
        value={timeLeft.minutes}
        label="MINUTES"
        tint={tint}
        labelColor={labelColor}
        fontSize={fontSize}
        fontFamily={fontFamily}
      />
      {showSeparators && (
        <Separator fontSize={fontSize} tint={tint} fontFamily={fontFamily} />
      )}
      <NumberGroup
        value={timeLeft.seconds}
        label="SECONDS"
        tint={tint}
        labelColor={labelColor}
        fontSize={fontSize}
        fontFamily={fontFamily}
      />
    </div>
  );
};

export default ProCountdown;
