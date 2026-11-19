import React, { useState, useRef, useEffect, useCallback } from 'react';
import InteractivePet, { CharacterType } from './InteractivePet';

const PIP_PHRASES = [
  'Need any help? 👋',
  "Hey! I'm Pip 🔥",
  'Design beyond the surface ✨',
  'youdecide.studio 🚀',
  "Let's build something epic! 💡",
  'Drag me anywhere on screen! 😊',
];

export const FlamePetWidget: React.FC = () => {
  const [character, setCharacter] = useState<CharacterType>('pip');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startWidgetPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize position to bottom right once window dimensions are known
  useEffect(() => {
    const updateDefaultPos = () => {
      if (!position) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setPosition({
          x: Math.max(16, w - 210),
          y: Math.max(16, h - 230),
        });
      }
    };
    updateDefaultPos();
    window.addEventListener('resize', updateDefaultPos);
    return () => window.removeEventListener('resize', updateDefaultPos);
  }, [position]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    // Don't drag if clicking buttons
    if ((e.target as HTMLElement).closest('button')) return;
    isDragging.current = true;
    hasMoved.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    if (position) {
      startWidgetPos.current = { x: position.x, y: position.y };
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    if (Math.hypot(dx, dy) > 4) {
      hasMoved.current = true;
    }
    const newX = Math.min(Math.max(10, startWidgetPos.current.x + dx), window.innerWidth - 180);
    const newY = Math.min(Math.max(10, startWidgetPos.current.y + dy), window.innerHeight - 190);
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    // If it was just a click (not a drag), cycle through phrases
    if (!hasMoved.current) {
      setPhraseIdx((prev) => (prev + 1) % PIP_PHRASES.length);
    }
  };

  const cycleCharacter = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const mascots: CharacterType[] = ['pip', 'botty', 'puff', 'spook'];
    const nextIdx = (mascots.indexOf(character) + 1) % mascots.length;
    setCharacter(mascots[nextIdx]);
  }, [character]);

  if (!position) return null;

  return (
    <aside
      aria-label="Interactive Mascot Pet"
      ref={widgetRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 99999,
        touchAction: 'none',
        userSelect: 'none',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        transition: isDragging.current ? 'none' : 'transform 0.15s ease',
      }}
    >
      {isMinimized ? (
        // Minimized floating orb
        <button
          type="button"
          aria-label="Expand Mascot"
          onClick={() => setIsMinimized(false)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF5500, #FF2244)',
            boxShadow: '0 8px 24px rgba(255, 68, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
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
        // Full Interactive 3D Pet
        <div style={{ position: 'relative', width: '190px', height: '210px' }}>
          {/* Subtle Hover Controls */}
          {isHovered && (
            <div
              style={{
                position: 'absolute',
                top: 4,
                right: 8,
                zIndex: 110,
                display: 'flex',
                gap: '4px',
                background: 'rgba(5, 10, 25, 0.75)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '999px',
                padding: '2px 4px',
              }}
            >
              <button
                type="button"
                title="Switch Mascot"
                onClick={cycleCharacter}
                style={{
                  background: 'none',
                  border: 0,
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  padding: '2px 4px',
                  lineHeight: 1,
                }}
              >
                🔄
              </button>
              <button
                type="button"
                title="Minimize"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                style={{
                  background: 'none',
                  border: 0,
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  padding: '2px 4px',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* 3D WebGL Pet Canvas */}
          <InteractivePet
            characterType={character}
            scale={1.05}
            bubbleText={PIP_PHRASES[phraseIdx]}
            idleText="Zzz... 💤"
            showBubble={true}
            bubbleBg="rgba(8, 16, 36, 0.85)"
            bubbleColor="#FFFFFF"
            bubbleOffsetX={1.15}
            bubbleOffsetY={1.45}
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
