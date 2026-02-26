import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';

const teamMembers = [
  {
    id: 0,
    name: 'BHUVAN N',
    role: 'FOUNDER & CEO',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    bio: 'Visionary and strategic lead. Drives the creative and operational roadmap, blending high-level decision-making with hands-on UI/UX craftsmanship.'
  },
  {
    id: 1,
    name: 'K HRISHIKESH',
    role: 'CO-FOUNDER & VP',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    bio: 'The operational bridge. Shapes long-term community goals and scales operations to new colleges, ensuring vision and execution remain tightly connected.'
  },
  {
    id: 2,
    name: 'DEEPAK K',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bio: 'Architect of the technical backbone. Oversees the tech stack for all learning tracks, ensuring our infrastructure never breaks under scale.'
  },
  {
    id: 3,
    name: 'RUDRESH J',
    role: 'CCO',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    bio: 'The creative force behind visual storytelling. Leads media production from concept to final edit, ensuring the society\'s impact is seen and felt.'
  },
  {
    id: 4,
    name: 'PRAMATH H',
    role: 'CINO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    bio: 'Spearheads the exploration of AI and machine learning. Integrates cutting-edge tools into architectures to keep us at the absolute frontier.'
  },
  {
    id: 5,
    name: 'YASHWARDHAN KUMAR',
    role: 'COO',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    bio: 'The engine of efficiency. Coordinates between developers, monitors project sprints, and keeps all deliverables running like clockwork.'
  }
];

export default function SpatialNexusRoster() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);

  // --- DRAG TO SPIN LOGIC ---
  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    if (activeId !== null) return;
    isDragging.current = true;
    startX.current = (e as any).clientX || (e as any).touches?.[0]?.clientX;
    gsap.killTweensOf(currentRotation);
  };

  const handlePointerMove = (e: React.PointerEvent | React.TouchEvent) => {
    if (!isDragging.current || activeId !== null) return;
    const clientX = (e as any).clientX || (e as any).touches?.[0]?.clientX;
    const deltaX = clientX - startX.current;

    targetRotation.current += deltaX * 0.2;
    startX.current = clientX;

    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        rotationY: targetRotation.current,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          currentRotation.current = gsap.getProperty(carouselRef.current, 'rotationY');
        }
      });
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // --- CLICK TO REVEAL LOGIC ---
  const handleCardClick = (id: number) => {
    if (isDragging.current && Math.abs(currentRotation.current - targetRotation.current) > 2) return;

    setActiveId(id);

    // Calculate shortest path to face camera (each card is 60deg apart)
    const cardAngle = id * 60;
    const currentMod = currentRotation.current % 360;
    let shortestDiff = ((-cardAngle - currentMod + 540) % 360) - 180;
    targetRotation.current = currentRotation.current + shortestDiff;

    const isMobile = window.innerWidth < 768;

    const tl = gsap.timeline();

    // 1. Spin carousel to center the clicked card
    tl.to(
      carouselRef.current,
      {
        rotationY: targetRotation.current,
        duration: 0.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          currentRotation.current = targetRotation.current;
        }
      },
      0
    );

    // 2. Shift the 3D Stage (Left on Desktop, Up on Mobile)
    tl.to(
      stageRef.current,
      {
        x: isMobile ? '0vw' : '-20vw',
        y: isMobile ? '-25vh' : '0vh',
        scale: isMobile ? 0.8 : 1,
        duration: 0.8,
        ease: 'power3.inOut'
      },
      0
    );

    // 3. Fade in the Glassmorphic Dossier
    tl.fromTo(
      dossierRef.current,
      { autoAlpha: 0, x: isMobile ? 0 : 50, y: isMobile ? 50 : 0 },
      { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' },
      0.4
    );
  };

  const handleClose = () => {
    setActiveId(null);
    const tl = gsap.timeline();

    tl.to(dossierRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0);
    tl.to(
      stageRef.current,
      {
        x: '0vw',
        y: '0vh',
        scale: 1,
        duration: 0.8,
        ease: 'power3.inOut'
      },
      0.2
    );
  };

  const activeMember = teamMembers.find((m) => m.id === activeId);

  return (
    <section
      className="relative w-full h-[100svh] bg-[#050505] text-white overflow-hidden font-sans select-none flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{ fontFamily: "'Manrope', sans-serif" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-[#050505] to-[#050505] pointer-events-none" />

      {/* --- THE 3D STAGE --- */}
      <div
        ref={stageRef}
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {/* THE SPINNING CAROUSEL */}
        <div
          ref={carouselRef}
          className="relative w-[280px] h-[400px] md:w-[320px] md:h-[450px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {teamMembers.map((member, i) => (
            <div
              key={member.id}
              onClick={() => handleCardClick(member.id)}
              className="absolute inset-0 border border-gray-800 bg-[#0a0a0a] shadow-2xl overflow-hidden group cursor-pointer transition-colors duration-500 hover:border-gray-600"
              style={{
                transform: `rotateY(${i * 60}deg) translateZ(${window.innerWidth < 768 ? '250px' : '350px'})`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Card Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              {/* Card Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  {member.role}
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight">
                  {member.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- GLASSMORPHIC DOSSIER PANEL --- */}
      <div
        ref={dossierRef}
        className="fixed right-0 top-0 w-full md:w-1/2 h-full bg-white/5 backdrop-blur-2xl border-l border-white/10 overflow-y-auto z-50"
        style={{ autoAlpha: 0 }}
      >
        {activeMember && (
          <div className="p-8 md:p-12 max-w-2xl">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 transition-colors rounded-lg backdrop-blur-sm border border-white/20"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Portrait */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-8 border border-white/20 backdrop-blur-sm">
              <img
                src={activeMember.image}
                alt={activeMember.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
                  IDENTITY CODE
                </div>
                <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight break-words">
                  {activeMember.name}
                </h2>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
                  POSITION
                </div>
                <p className="text-xl font-bold uppercase tracking-tight text-white/90">
                  {activeMember.role}
                </p>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">
                  DOSSIER
                </div>
                <p className="text-base leading-relaxed text-white/80 font-medium">
                  {activeMember.bio}
                </p>
              </div>

              {/* Decorative Line */}
              <div className="py-4 border-t border-white/10" />

              <button
                onClick={handleClose}
                className="w-full py-3 px-6 border border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 backdrop-blur-sm rounded-lg"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UI Hint */}
      <div className="absolute bottom-8 left-8 text-xs uppercase tracking-[0.2em] text-white/40 pointer-events-none">
        <p>Drag to rotate • Click to inspect</p>
      </div>
    </section>
  );
}
