import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

// Target date: November 25, 2026
const TARGET_DATE = new Date('2026-11-25T00:00:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const distance = TARGET_DATE.getTime() - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

// Animated liquid/orb background using canvas
const LiquidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const orbs = [
      { x: 0.2, y: 0.3, r: 0.45, color: 'rgba(102,179,255,0.35)', speed: 0.0007 },
      { x: 0.8, y: 0.6, r: 0.4, color: 'rgba(180,220,255,0.25)', speed: 0.0005 },
      { x: 0.5, y: 0.1, r: 0.35, color: 'rgba(66,153,225,0.2)', speed: 0.0009 },
      { x: 0.1, y: 0.8, r: 0.3, color: 'rgba(255,255,255,0.15)', speed: 0.0006 },
      { x: 0.9, y: 0.1, r: 0.3, color: 'rgba(147,197,253,0.2)', speed: 0.0008 },
    ];

    const draw = () => {
      t += 1;
      const w = canvas.width;
      const h = canvas.height;

      // Base background gradient
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#f0f7ff');
      bg.addColorStop(0.5, '#e8f4fd');
      bg.addColorStop(1, '#dbeafe');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Draw animated orbs
      orbs.forEach((orb, i) => {
        const cx = (orb.x + Math.sin(t * orb.speed + i) * 0.15) * w;
        const cy = (orb.y + Math.cos(t * orb.speed * 0.7 + i) * 0.15) * h;
        const radius = orb.r * Math.min(w, h);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

// Single countdown digit block
const CountBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const displayValue = String(value).padStart(2, '0');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          position: 'relative',
          width: 'clamp(80px, 18vw, 160px)',
          height: 'clamp(90px, 20vw, 180px)',
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(102,179,255,0.3)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 40px rgba(66,153,225,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        <span
          style={{
            fontFamily: '"Space Mono", "JetBrains Mono", monospace',
            fontSize: 'clamp(36px, 9vw, 80px)',
            fontWeight: 700,
            color: '#0a1628',
            letterSpacing: '-2px',
            lineHeight: 1,
          }}
        >
          {displayValue}
        </span>
      </div>
      <span
        style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'clamp(9px, 1.5vw, 13px)',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#3b82f6',
        }}
      >
        {label}
      </span>
    </div>
  );
};

const YouDecideStudio: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const launched = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>YouDecide Studio | The 404 Society</title>
        <meta name="description" content="Something is coming. The 404 Society — YouDecide Studio." />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LiquidBackground />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(32px, 6vh, 60px)',
            padding: '40px 24px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {/* Top badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(102,179,255,0.35)',
              borderRadius: '100px',
              padding: '8px 20px',
              fontFamily: '"Manrope", sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#3b82f6',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#3b82f6',
                animation: 'pulse 2s infinite',
              }}
            />
            The 404 Society
          </div>

          {/* Title */}
          <div>
            <h1
              style={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: 'clamp(36px, 9vw, 96px)',
                fontWeight: 800,
                color: '#0a1628',
                letterSpacing: '-3px',
                lineHeight: 0.95,
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              YouDecide
            </h1>
            <h2
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: 'clamp(14px, 3vw, 28px)',
                fontWeight: 400,
                color: '#3b82f6',
                letterSpacing: '0.3em',
                margin: '8px 0 0',
                textTransform: 'uppercase',
              }}
            >
              .studio
            </h2>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'clamp(14px, 2.5vw, 20px)',
              fontWeight: 500,
              color: '#1e3a5f',
              maxWidth: '540px',
              lineHeight: 1.6,
              margin: 0,
              opacity: 0.75,
            }}
          >
            {launched
              ? 'We\'re live. Something remarkable begins now.'
              : 'Something remarkable is on its way. The community decides what\'s next.'}
          </p>

          {/* Countdown */}
          {!launched ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(8px, 3vw, 32px)',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <CountBlock value={timeLeft.days} label="Days" />
              <div
                style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: 'clamp(28px, 7vw, 72px)',
                  fontWeight: 700,
                  color: '#3b82f6',
                  marginTop: 'clamp(20px, 4vw, 48px)',
                  opacity: 0.6,
                  animation: 'blink 1s step-end infinite',
                }}
              >
                :
              </div>
              <CountBlock value={timeLeft.hours} label="Hours" />
              <div
                style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: 'clamp(28px, 7vw, 72px)',
                  fontWeight: 700,
                  color: '#3b82f6',
                  marginTop: 'clamp(20px, 4vw, 48px)',
                  opacity: 0.6,
                  animation: 'blink 1s step-end infinite',
                }}
              >
                :
              </div>
              <CountBlock value={timeLeft.minutes} label="Minutes" />
              <div
                style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: 'clamp(28px, 7vw, 72px)',
                  fontWeight: 700,
                  color: '#3b82f6',
                  marginTop: 'clamp(20px, 4vw, 48px)',
                  opacity: 0.6,
                  animation: 'blink 1s step-end infinite',
                }}
              >
                :
              </div>
              <CountBlock value={timeLeft.seconds} label="Seconds" />
            </div>
          ) : (
            <div
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: 'clamp(24px, 6vw, 56px)',
                fontWeight: 700,
                color: '#3b82f6',
                letterSpacing: '-1px',
              }}
            >
              WE'RE LIVE 🚀
            </div>
          )}

          {/* Target date label */}
          <div
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: '#3b82f6',
              opacity: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Launching 25 Nov 2026
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'fixed',
              bottom: '28px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: '"Manrope", sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: '#3b82f6',
              opacity: 0.4,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            © 2026 The 404 Society
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.1; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </>
  );
};

export default YouDecideStudio;

