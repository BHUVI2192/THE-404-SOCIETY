// Text Reveal Scroll — Framer Marketplace Component Adapted for React & Vite
// Source: https://framer.com/m/text-reveal-scroll-helper-16vc5F.js@7Bke0DBIx7GpaBFlIp2X
// Module: https://framerusercontent.com/modules/xDgp5el32fHNjPkyEMsb/7Bke0DBIx7GpaBFlIp2X/text_reveal_scroll_helper.js

import React, { useRef, useEffect, useState, useMemo, useId } from 'react';

export interface TextRevealScrollProps {
  /** The text layer or JSX children to reveal on scroll */
  textComponent?: React.ReactNode;
  children?: React.ReactNode;
  /** Whether to reveal character by character ("chars") or word by word ("words") */
  revealMode?: 'chars' | 'words';
  /** Viewport % from top where reveal begins (default: 88) */
  startOffset?: number;
  /** Viewport % from top where reveal completes (default: 28) */
  endOffset?: number;
  /** Opacity of unrevealed text segments (default: 0.18) */
  dimOpacity?: number;
  /** Toggle custom font size override */
  overrideFontSize?: boolean;
  /** Custom font size in pixels or CSS string */
  fontSize?: number | string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}

function extractPlainText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractPlainText).join('');
  }
  if (React.isValidElement(node)) {
    return extractPlainText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

function normalizeTextComponent(textComponent: React.ReactNode): React.ReactNode {
  const instance = Array.isArray(textComponent) ? textComponent[0] : textComponent;
  if (!React.isValidElement(instance)) return instance ?? null;
  return React.cloneElement(instance as React.ReactElement<any>, {
    style: {
      ...((instance.props as any)?.style || {}),
      width: '100%',
      height: 'auto',
      minWidth: 'unset',
      whiteSpace: 'normal',
    },
  });
}

function createCharSpan(char: string, dimOpacity: number): HTMLSpanElement {
  const span = document.createElement('span');
  span.textContent = char;
  span.style.display = 'inline';
  span.style.opacity = String(dimOpacity);
  span.style.willChange = 'opacity';
  return span;
}

function createWordSpan(word: string, dimOpacity: number): HTMLSpanElement {
  const span = document.createElement('span');
  span.textContent = word;
  span.style.display = 'inline';
  span.style.opacity = String(dimOpacity);
  span.style.willChange = 'opacity';
  return span;
}

function processNodeRecursively(
  el: Node,
  revealMode: 'chars' | 'words',
  dimOpacity: number,
  segments: HTMLElement[]
) {
  const originalChildren = Array.from(el.childNodes);
  for (const node of originalChildren) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (!text.length) continue;
      const frag = document.createDocumentFragment();
      if (revealMode === 'chars') {
        for (const char of text) {
          if (char === ' ') {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const span = createCharSpan(char, dimOpacity);
            frag.appendChild(span);
            segments.push(span);
          }
        }
      } else {
        const parts = text.split(/(\s+)/);
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = createWordSpan(part, dimOpacity);
            frag.appendChild(span);
            segments.push(span);
          }
        }
      }
      node.parentNode?.replaceChild(frag, node);
      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const childEl = node as HTMLElement;
    if (childEl.tagName === 'BR') {
      childEl.style.display = 'inline';
      childEl.style.opacity = String(dimOpacity);
      childEl.style.willChange = 'opacity';
      segments.push(childEl);
      continue;
    }
    processNodeRecursively(childEl, revealMode, dimOpacity, segments);
  }
}

/**
 * TextRevealScroll
 *
 * Reusable scroll-driven text reveal component matching the Framer Marketplace implementation.
 * Words or characters smoothly illuminate from dimOpacity to full opacity as the element is scrolled into view.
 */
export const TextRevealScroll: React.FC<TextRevealScrollProps> = ({
  textComponent,
  children,
  revealMode = 'chars',
  startOffset = 85,
  endOffset = 50,
  dimOpacity = 0.18,
  overrideFontSize = false,
  fontSize = 48,
  style,
  className = '',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<HTMLElement[]>([]);
  const rawId = useId();
  const styleId = `reveal-${rawId.replace(/:/g, '')}`;

  const isVisibleRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(startOffset);
  const endOffsetRef = useRef<number>(endOffset);
  const dimOpacityRef = useRef<number>(dimOpacity);

  startOffsetRef.current = startOffset;
  endOffsetRef.current = endOffset;
  dimOpacityRef.current = dimOpacity;

  const content = children ?? textComponent;
  const connectedText = useMemo(() => normalizeTextComponent(content), [content]);
  const textFingerprint = useMemo(
    () => extractPlainText(connectedText).replace(/\s+/g, ' ').trim(),
    [connectedText]
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !rootRef.current || !textRef.current) {
      return;
    }

    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let scrollHandler: (() => void) | null = null;
    let resizeHandler: (() => void) | null = null;

    const root = rootRef.current;
    const textRoot = textRef.current;
    const allSegments: HTMLElement[] = [];

    textRoot.style.visibility = 'hidden';
    processNodeRecursively(textRoot, revealMode, dimOpacityRef.current, allSegments);

    if (allSegments.length === 0) {
      textRoot.style.visibility = 'visible';
      return;
    }

    segmentsRef.current = allSegments;
    textRoot.style.visibility = 'visible';

    const computeReveal = () => {
      if (!isVisibleRef.current) return;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const startPx = vh * (startOffsetRef.current / 100);
      const endPx = vh * (endOffsetRef.current / 100);
      const totalRange = rect.height + (startPx - endPx);
      const scrolled = startPx - rect.top;
      const progress = Math.min(Math.max(scrolled / totalRange, 0), 1);

      const total = segmentsRef.current.length;
      const litCount = Math.floor(progress * total);

      segmentsRef.current.forEach((seg, i) => {
        if (i < litCount) {
          seg.style.opacity = '1';
        } else if (i === litCount) {
          const frac = progress * total - litCount;
          seg.style.opacity = String(
            dimOpacityRef.current + frac * (1 - dimOpacityRef.current)
          );
        } else {
          seg.style.opacity = String(dimOpacityRef.current);
        }
      });
    };

    const scheduleReveal = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(computeReveal);
    };

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
        if (isVisibleRef.current) scheduleReveal();
      },
      { rootMargin: '250px 0px 250px 0px', threshold: 0 }
    );
    intersectionObserver.observe(root);

    scrollHandler = scheduleReveal;
    resizeHandler = scheduleReveal;
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', resizeHandler, { passive: true });

    mutationObserver = new MutationObserver(() => {
      scheduleReveal();
    });
    mutationObserver.observe(root, { childList: true, subtree: true, characterData: true });

    // Initial calculation
    scheduleReveal();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (intersectionObserver) intersectionObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      segmentsRef.current = [];
    };
  }, [isClient, revealMode, textFingerprint]);

  if (!connectedText) {
    return null;
  }

  const resolvedFontSize =
    typeof fontSize === 'number' ? `${fontSize}px` : fontSize;

  return (
    <div
      ref={rootRef}
      className={`text-reveal-scroll-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        ...style,
      }}
    >
      {overrideFontSize && (
        <style>{`
          #${styleId},
          #${styleId} * {
            font-size: ${resolvedFontSize} !important;
          }
        `}</style>
      )}

      <div
        id={styleId}
        ref={textRef}
        key={`${revealMode}-${textFingerprint}`}
        style={{
          width: '100%',
          height: 'auto',
          fontSize: overrideFontSize ? resolvedFontSize : undefined,
        }}
      >
        {connectedText}
      </div>
    </div>
  );
};

export default TextRevealScroll;

/**
 * ManifestoScrollSection (Studio Introduction Section)
 *
 * Compact, simple and bold studio introduction section using the Framer Text Reveal Scroll Helper:
 * - First statement: NOT A TRADITIONAL AGENCY. (bold uppercase)
 * - Supporting text: We believe good ideas shouldn't be limited by budgets. No fixed prices, no unnecessary packages. Just good work and honest value. (small clean typography)
 * - Final statement: YOU DECIDE. (bold uppercase, centred at the end)
 * - Minimal vertical spacing, elegant, minimal and confident.
 */
export interface ManifestoScrollSectionProps {
  className?: string;
  /**
   * Font size for the middle supporting text.
   * Default: 'clamp(15.5px, 1.35vw, 18px)'.
   * You can pass custom size: e.g. '18px', '20px', 'clamp(16px, 1.4vw, 22px)'
   */
  supportingFontSize?: string | number;
}

export const ManifestoScrollSection: React.FC<ManifestoScrollSectionProps> = ({
  className = '',
  supportingFontSize = 'clamp(17px, 1.6vw, 22px)',
}) => {
  const resolvedSupportingSize =
    typeof supportingFontSize === 'number' ? `${supportingFontSize}px` : supportingFontSize;

  return (
    <section
      id="manifesto"
      className={`studio-intro-section ${className}`}
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(48px, 7vh, 72px) clamp(20px, 4vw, 40px) clamp(44px, 6.5vh, 68px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '90px',
      }}
    >
      {/* Subtle Scroll-based Text Reveal Framer Component */}
      <TextRevealScroll
        revealMode="chars"
        startOffset={85}
        endOffset={45}
        dimOpacity={0.2}
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 'clamp(20px, 3vh, 32px)',
            color: '#FFFFFF',
            margin: '0 auto',
          }}
        >
          {/* First statement: Big, wide, NOT bold (400 weight) */}
          <p
            className="manifesto-lead-text"
            style={{
              margin: 0,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 'clamp(28px, 4.3vw, 64px)',
              fontWeight: 400, // Not bold
              letterSpacing: '0.05em', // Wider letter-spacing / width
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            NOT A TRADITIONAL AGENCY.
          </p>

          {/* Supporting text in clean typography (22px prominent reading scale) */}
          <p
            className="manifesto-supporting-text"
            style={{
              margin: 0,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: resolvedSupportingSize,
              fontWeight: 400,
              lineHeight: 1.65,
              letterSpacing: '-0.01em',
              maxWidth: '740px',
              color: 'rgba(255, 255, 255, 0.88)',
            }}
          >
            We believe good ideas shouldn&apos;t be limited by budgets. No fixed prices, no unnecessary packages. Just good work and honest value.
          </p>

          {/* Closing punchline: Big, wide, NOT bold (400 weight), centered */}
          <p
            className="manifesto-punchline-text"
            style={{
              margin: 'clamp(8px, 1.5vh, 16px) 0 0',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 'clamp(34px, 5.2vw, 74px)',
              fontWeight: 400, // Not bold
              letterSpacing: '0.14em', // Wider letter-spacing / width
              textTransform: 'uppercase',
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            YOU DECIDE.
          </p>
        </div>
      </TextRevealScroll>

      <style>{`
        @media (min-width: 821px) {
          .manifesto-lead-text {
            white-space: nowrap !important;
          }
        }
      `}</style>
    </section>
  );
};
