/**
 * PageViewCounter — Supabase-backed live page view counter
 *
 * Features:
 *  • Auto-detects page slug (window.location.pathname)
 *  • Increments once per session (sessionStorage guard) to avoid spam
 *  • Smooth animated count-up on first render
 *  • Compact number formatting  (1,234 / 12.4k / 1.2M)
 *  • Fully styled to match the site's dark aesthetic
 *  • Graceful: shows nothing if Supabase is unreachable
 */

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PageViewCounterProps {
  /** Override the auto-detected slug. Default: window.location.pathname */
  slug?: string;
  /** Label shown after the number. Default: 'visitors' */
  label?: string;
  /** Number format: 'compact' (1.2k), 'comma' (1,234), 'plain' (1234). Default: 'compact' */
  format?: 'compact' | 'comma' | 'plain';
  /** Colour of the count number. Default: white */
  countColor?: string;
  /** Colour of the dot & label. Default: rgba(255,255,255,0.5) */
  labelColor?: string;
  /** Additional className for the outer wrapper */
  className?: string;
  style?: React.CSSProperties;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCount(n: number, fmt: 'compact' | 'comma' | 'plain'): string {
  if (fmt === 'compact') {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    return String(n);
  }
  if (fmt === 'comma') return n.toLocaleString('en-IN');
  return String(n);
}

/** Animated count-up hook */
function useCountUp(target: number, duration = 1200): number {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    if (target === 0) return;
    fromRef.current = displayed;
    startRef.current = null;

    const animate = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return displayed;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const PageViewCounter: React.FC<PageViewCounterProps> = ({
  slug: slugProp,
  label = 'visitors',
  format = 'compact',
  countColor = '#FFFFFF',
  labelColor = 'rgba(255,255,255,0.5)',
  className = '',
  style = {},
}) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const displayedCount = useCountUp(count, 1400);

  useEffect(() => {
    const slug = slugProp || window.location.pathname || '/';
    const storageKey = `pv_tracked_${slug}`;
    const alreadyTracked = sessionStorage.getItem(storageKey) === '1';

    async function trackAndFetch() {
      try {
        if (!alreadyTracked) {
          // Upsert: insert if new, increment if exists
          const { error: upsertErr } = await supabase.rpc('increment_page_view', { p_slug: slug });

          // Fallback if the RPC doesn't exist yet — manual upsert
          if (upsertErr) {
            const { data: existing } = await supabase
              .from('page_views')
              .select('views')
              .eq('slug', slug)
              .maybeSingle();

            if (existing) {
              await supabase
                .from('page_views')
                .update({ views: existing.views + 1, updated_at: new Date().toISOString() })
                .eq('slug', slug);
            } else {
              await supabase
                .from('page_views')
                .insert({ slug, views: 1 });
            }
          }

          sessionStorage.setItem(storageKey, '1');
        }

        // Fetch current count
        const { data } = await supabase
          .from('page_views')
          .select('views')
          .eq('slug', slug)
          .maybeSingle();

        if (data) {
          setCount(data.views);
          setVisible(true);
        }
      } catch {
        // Silently fail — counter is non-critical UI
      }
    }

    trackAndFetch();
  }, [slugProp]);

  if (!visible) return null;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Animated live-pulse dot */}
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '7px',
          height: '7px',
          flexShrink: 0,
        }}
      >
        {/* Outer ring ping animation */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: '#22c55e',
            opacity: 0.5,
            animation: 'pv-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
        {/* Solid core dot */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: '#22c55e',
          }}
        />
      </span>

      {/* Animated Count */}
      <span
        style={{
          fontFamily: '"Geist Mono", monospace',
          fontWeight: 500,
          fontSize: 'clamp(11px, 1.2vw, 13px)',
          letterSpacing: '0.04em',
          color: countColor,
          lineHeight: 1,
        }}
      >
        {formatCount(displayedCount, format)}
      </span>

      {/* Label */}
      <span
        style={{
          fontFamily: '"Geist", sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(11px, 1.1vw, 12px)',
          letterSpacing: '0.03em',
          color: labelColor,
          lineHeight: 1,
        }}
      >
        {label}
      </span>

      {/* Ping keyframe injected once */}
      <style>{`
        @keyframes pv-ping {
          75%, 100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PageViewCounter;
