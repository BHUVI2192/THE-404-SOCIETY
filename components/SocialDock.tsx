import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────
   Brand SVG icons — each rendered in its official brand color(s)
   ────────────────────────────────────────────────────────────────── */

// Discord — Blurple #5865F2
const IconDiscord = () => (
  <svg viewBox="0 0 24 24" fill="#5865F2" style={{ width: '60%', height: '60%' }}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

// Instagram — official gradient via a linearGradient def
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" style={{ width: '58%', height: '58%' }}>
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#feda75" />
        <stop offset="25%" stopColor="#fa7e1e" />
        <stop offset="50%" stopColor="#d62976" />
        <stop offset="75%" stopColor="#962fbf" />
        <stop offset="100%" stopColor="#4f5bd5" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-grad)" />
    <circle cx="12" cy="12" r="4.5" fill="none" stroke="#fff" strokeWidth="1.8" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="#fff" />
  </svg>
);


// LinkedIn — official blue
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" style={{ width: '60%', height: '60%' }}>
    <rect width="24" height="24" rx="5" fill="#0A66C2" />
    <path fill="#ffffff" d="M7.75 9.5h-2.5v8h2.5v-8zm-1.25-4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9.25 4c-1.2 0-2.1.6-2.5 1.2V9.5h-2.5v8h2.5v-4.25c0-1.1.9-1.75 1.75-1.75s1.75.65 1.75 1.75V17.5h2.5v-4.75c0-2.65-1.4-3.25-3.5-3.25z" />
  </svg>
);

// YouTube — brand red
const IconYouTube = () => (
  <svg viewBox="0 0 24 24" style={{ width: '62%', height: '62%' }}>
    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
    <path fill="#ffffff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/* ── dock items data ─────────────────────────────────────────────── */

const DOCK_ITEMS = [
  {
    label: 'Discord',
    href: 'https://discord.gg/CbvtZJhtbR',
    icon: <IconDiscord />,
    glowColor: 'rgba(88,101,242,0.55)',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/404__society/?__pwa=1',
    icon: <IconInstagram />,
    glowColor: 'rgba(214,41,118,0.55)',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/the-404-society/',
    icon: <IconLinkedIn />,
    glowColor: 'rgba(10,102,194,0.55)',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@The404Society',
    icon: <IconYouTube />,
    glowColor: 'rgba(255,0,0,0.5)',
  },
] as const;

/* ── single dock icon ────────────────────────────────────────────── */

function DockIcon({
  item,
  mouseX,
}: {
  item: (typeof DOCK_ITEMS)[number];
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  /* distance from cursor to icon centre */
  const distance = useTransform(mouseX, (val) => {
    const el = ref.current;
    if (!el) return Infinity;
    const { left, width } = el.getBoundingClientRect();
    return val - (left + width / 2);
  });

  /* size: 48 → 80 px */
  const sizeRaw = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const size = useSpring(sizeRaw, { mass: 0.08, stiffness: 200, damping: 16 });

  /* lift: icons rise upward, applied to the outer wrapper so tooltip moves with it */
  const yRaw = useTransform(distance, [-150, 0, 150], [0, -20, 0]);
  const y = useSpring(yRaw, { mass: 0.08, stiffness: 200, damping: 16 });

  return (
    /* outer wrapper — NOT clipped, gives room for lift + tooltip */
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
      <motion.div
        style={{ y, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* tooltip — sits above the icon, moves with it */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 4, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 3, scale: 0.88 }}
              transition={{ duration: 0.14 }}
              style={{
                marginBottom: 8,
                pointerEvents: 'none',
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  padding: '3px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  color: '#fff',
                  background: 'rgba(18,18,20,0.90)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                }}
              >
                {item.label}
              </div>
              {/* caret */}
              <div style={{
                width: 0, height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid rgba(18,18,20,0.90)',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* icon bubble */}
        <motion.a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: size,
            height: size,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 18,
            cursor: 'pointer',
            boxShadow: hovered
              ? `0 8px 28px ${item.glowColor}`
              : '0 2px 8px rgba(0,0,0,0.15)',
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(0,0,0,0.07)',
            flexShrink: 0,
          }}
          whileTap={{ scale: 0.88 }}
          transition={{ boxShadow: { duration: 0.2 } }}
        >
          {item.icon}
        </motion.a>
      </motion.div>
    </div>
  );
}

/* ── dock container ──────────────────────────────────────────────── */

export const SocialDock: React.FC = () => {
  const mouseX = useMotionValue(Infinity);

  return (
    /*
     * Outer shell: overflow visible + padding-top so lifted icons and
     * tooltips have room to breathe above the pill — nothing gets clipped.
     */
    <div
      style={{
        paddingTop: 56,          /* room for 20px lift + tooltip height */
        display: 'inline-flex',
        alignItems: 'flex-end',
      }}
    >
      {/* The visible dock pill */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 22,
          background: 'rgba(238, 238, 241, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'visible',
        }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.label} item={item} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  );
};

export default SocialDock;
