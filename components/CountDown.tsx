/**
 * Exact Framer Countdown Component
 * Source: https://framer.com/m/Count-Down-yIqNhX.js@YlPlrUmsTptewPC0PkbF
 *
 * PRO COUNTDOWN (GOOGLE FONTS EDITION)
 * Features dynamic Google font loader, spring blur transitions,
 * individual digit AnimatePresence flipping, and customizable typography.
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ProCountdownProps {
  targetDate?: string | Date | number;
  tint?: string;
  labelColor?: string;
  fontSize?: number;
  gap?: number;
  showSeparators?: boolean;
  fontFamily?: string;
  fontWeight?: number | string;
}

export default function ProCountdown(props: ProCountdownProps) {
  const {
    targetDate = "2026-11-25T00:00:00",
    tint = "#171717",
    labelColor = "#1920F0",
    fontSize = 64,
    gap = 28,
    showSeparators = true,
    fontFamily = "Geist Mono",
    fontWeight = 600,
  } = props;

  // 1. DYNAMIC FONT LOADER
  React.useEffect(() => {
    if (!fontFamily) return;
    const linkId = `font-${fontFamily.replace(/\s+/g, "-")}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
        /\s+/g,
        "+"
      )}:wght@400;500;600;700;800&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, [fontFamily]);

  // 2. TIMER LOGIC
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft(targetDate));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const time = timeLeft || { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const style: React.CSSProperties = {
    ...containerStyle,
    gap: gap,
    color: tint,
    fontFamily: `"${fontFamily}", monospace, sans-serif`,
    fontWeight: fontWeight as any,
  };

  return (
    <div style={style}>
      <NumberGroup value={time.days} label="DAYS" {...props} />
      {showSeparators && (
        <Separator fontSize={fontSize} tint={tint} fontFamily={fontFamily} />
      )}
      <NumberGroup value={time.hours} label="HOURS" {...props} />
      {showSeparators && (
        <Separator fontSize={fontSize} tint={tint} fontFamily={fontFamily} />
      )}
      <NumberGroup value={time.minutes} label="MINUTES" {...props} />
      {showSeparators && (
        <Separator fontSize={fontSize} tint={tint} fontFamily={fontFamily} />
      )}
      <NumberGroup value={time.seconds} label="SECONDS" {...props} />
    </div>
  );
}

function Separator({
  fontSize,
  tint,
  fontFamily,
}: {
  fontSize: number;
  tint: string;
  fontFamily: string;
}) {
  return (
    <div
      style={{
        ...separatorStyle,
        fontSize: fontSize,
        color: tint,
        fontFamily: `"${fontFamily}", monospace, sans-serif`,
      }}
    >
      :
    </div>
  );
}

function NumberGroup(props: any) {
  const { value, label, tint, labelColor, fontSize, fontFamily } = props;
  const digits = (value < 10 ? `0${value}` : `${value}`).split("");
  return (
    <div style={groupContainerStyle}>
      <div style={digitsRowStyle}>
        {digits.map((digit: string, index: number) => (
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
          ...labelStyle,
          color: labelColor,
          fontFamily: `"${fontFamily}", monospace, sans-serif`,
        }}
      >
        {label}
      </div>
    </div>
  );
}

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
        position: "relative",
        height: fontSize * 1.1,
        width: fontSize * 0.65,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          style={{
            fontSize: fontSize,
            lineHeight: 1,
            color: tint,
            position: "absolute",
            fontFamily: `"${fontFamily}", monospace, sans-serif`,
            fontWeight: "inherit",
          }}
          initial={{ y: "-60%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "60%", opacity: 0, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 450, damping: 35, mass: 1 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* --- LOGIC --- */
const calculateTimeLeft = (targetDate: any) => {
  const difference = +new Date(targetDate) - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1e3 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1e3 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1e3 / 60) % 60),
      seconds: Math.floor((difference / 1e3) % 60),
    };
  }
  return null;
};

/* --- STYLES --- */
const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  height: "auto",
  flexWrap: "nowrap",
};

const groupContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const digitsRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const separatorStyle: React.CSSProperties = {
  fontWeight: "bold",
  lineHeight: 1,
  opacity: 0.25,
  marginTop: "-2px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  marginTop: "12px",
  textAlign: "center",
};
