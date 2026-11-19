import React, { useState, useRef } from 'react';
import InteractivePet from './InteractivePet';

const PIP_PHRASES = [
  'Need any help? 👋',
  "Hey! I'm Pip 🔥",
  'Design beyond the surface ✨',
  'youdecide.studio 🚀',
  "Let's build something epic! 💡",
  'Drag me anywhere on screen! 😊',
];

export const FlamePetWidget: React.FC = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialOffset = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDragging.current = true;
    hasMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialOffset.current = { ...dragOffset };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.hypot(dx, dy) > 5) {
      hasMoved.current = true;
    }
    setDragOffset({
      x: initialOffset.current.x + dx,
      y: initialOffset.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Clicked without dragging: cycle speech phrase
    if (!hasMoved.current) {
      setPhraseIdx((prev) => (prev + 1) % PIP_PHRASES.length);
    }
  };

  return (
    <aside
      aria-label="Interactive Flame Pet"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999999,
        touchAction: 'none',
        userSelect: 'none',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
        transition: isDragging.current ? 'none' : 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {isMinimized ? (
        // Minimized floating flame button
        <button
          type="button"
          aria-label="Expand Flame Pet"
          onClick={() => setIsMinimized(false)}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6A00, #EE0979)',
            boxShadow: '0 8px 24px rgba(255, 68, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '22px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          🔥
        </button>
      ) : (
        // Full Interactive 3D Flame Pet
        <div style={{ position: 'relative', width: '180px', height: '200px' }}>
          {/* Minimize button on hover */}
          {isHovered && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 4,
                zIndex: 110,
                background: 'rgba(5, 10, 25, 0.75)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 100, 30, 0.3)',
                borderRadius: '999px',
                padding: '2px 6px',
              }}
            >
              <button
                type="button"
                title="Minimize Pip"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                style={{
                  background: 'none',
                  border: 0,
                  color: 'rgba(255, 255, 255, 0.85)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  padding: '2px',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Pip 3D Canvas */}
          <InteractivePet
            scale={1.12}
            bubbleText={PIP_PHRASES[phraseIdx]}
            idleText="Zzz... 💤"
            showBubble={true}
            bubbleBg="rgba(8, 14, 30, 0.9)"
            bubbleColor="#FFFFFF"
            pipColorBottom="#FFD700"
            pipColorMiddle="#FF5500"
            pipColorTop="#FF2244"
            speed={0.07}
            wobbleSpeed={2.2}
            enableIdle={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
    </aside>
  );
};

export default FlamePetWidget;
