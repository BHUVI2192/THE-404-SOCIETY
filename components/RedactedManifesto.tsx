import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';

const teamMembers = [
  {
    id: '01',
    name: 'BHUVAN N',
    role: 'FOUNDER & PRESIDENT (CEO)',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop',
    bio: 'Visionary and strategic lead. Drives the creative and operational roadmap for The 404 Society, blending high-level decision-making with hands-on UI/UX craftsmanship to build a unified brand experience.'
  },
  {
    id: '02',
    name: 'K HRISHIKESH',
    role: 'CO-FOUNDER & VICE PRESIDENT',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop',
    bio: 'The operational bridge. Shapes long-term community goals and scales operations to new colleges, ensuring that vision and execution remain tightly connected.'
  },
  {
    id: '03',
    name: 'DEEPAK K',
    role: 'CHIEF TECHNOLOGY OFFICER (CTO)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    bio: 'Architect of the technical backbone. Oversees the tech stack for all learning tracks and client projects, mentoring junior developers.'
  },
  {
    id: '04',
    name: 'RUDRESH J',
    role: 'CHIEF CREATIVE OFFICER (CCO)',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
    bio: 'The creative force behind visual storytelling. Leads media production from concept to final edit, ensuring the society\'s impact is seen and felt.'
  },
  {
    id: '05',
    name: 'PRAMATH H',
    role: 'CHIEF INNOVATION OFFICER (CINO)',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop',
    bio: 'Spearheads the exploration of AI and machine learning. Integrates cutting-edge tools into client architectures to keep The 404 Society at the frontier.'
  },
  {
    id: '06',
    name: 'YASHWARDHAN KUMAR',
    role: 'CHIEF OPERATIONS OFFICER (COO)',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
    bio: 'The engine of efficiency. Coordinates between junior and senior developers, monitors project sprints, and scales operations like clockwork.'
  }
];

interface BlockPosition {
  name: string;
  startIndex: number;
  endIndex: number;
  revealed: boolean;
}

export default function RedactedManifesto() {
  const manifestoText = `The 404 Society is not just a coding club. Under the stewardship of BHUVAN N, we are an ecosystem of builders, innovators, and creators who believe that shipping real code teaches more than a semester of theory. Our co-founder K HRISHIKESH ensures that every expansion, every new initiative, every student reaches the support they deserve. Through the technical lens of DEEPAK K, we maintain cutting-edge standards that rival industry projects. RUDRESH J transforms our work into visual narratives that resonate beyond campus walls. With PRAMATH H exploring the frontiers of artificial intelligence, and YASHWARDHAN KUMAR orchestrating our operations with precision, The 404 Society stands as Karnataka's most ambitious student developer collective. We don't just code. We build. We mentor. We ship. We lead.`;

  const blockPositions: BlockPosition[] = [
    { name: 'BHUVAN N', startIndex: 135, endIndex: 144, revealed: false },
    { name: 'K HRISHIKESH', startIndex: 259, endIndex: 271, revealed: false },
    { name: 'DEEPAK K', startIndex: 384, endIndex: 392, revealed: false },
    { name: 'RUDRESH J', startIndex: 467, endIndex: 476, revealed: false },
    { name: 'PRAMATH H', startIndex: 548, endIndex: 557, revealed: false },
    { name: 'YASHWARDHAN KUMAR', startIndex: 629, endIndex: 646, revealed: false }
  ];

  const [revealedBlocks, setRevealedBlocks] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const textContainerRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement to reveal blocks
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (!manifestoRef.current) return;

      const spans = manifestoRef.current.querySelectorAll('[data-block]');
      const revealRadius = 120;
      const newRevealed: string[] = [];

      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const spanCenterX = rect.left + rect.width / 2;
        const spanCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - spanCenterX, 2) + Math.pow(e.clientY - spanCenterY, 2)
        );

        if (distance < revealRadius) {
          newRevealed.push(span.getAttribute('data-block') || '');
        }
      });

      setRevealedBlocks(newRevealed);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Render manifesto with blocks
  const renderManifesto = () => {
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    blockPositions.forEach((block) => {
      // Add text before block
      if (lastIndex < block.startIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {manifestoText.substring(lastIndex, block.startIndex)}
          </span>
        );
      }

      // Add redacted block
      const isRevealed = revealedBlocks.includes(block.name);
      elements.push(
        <span
          key={`block-${block.name}`}
          data-block={block.name}
          onClick={() => handleBlockClick(block.name)}
          className={`relative inline-block cursor-pointer transition-all duration-300 ${
            isRevealed ? 'text-white' : 'text-transparent'
          }`}
        >
          {/* Censorship block background */}
          <span
            className={`absolute inset-0 bg-black transition-all duration-500 ${
              isRevealed ? 'w-0 opacity-0' : 'w-full opacity-100'
            }`}
            style={{
              transform: isRevealed ? 'translateX(100%)' : 'translateX(0)',
              zIndex: isRevealed ? -1 : 10
            }}
          />
          {manifestoText.substring(block.startIndex, block.endIndex)}
        </span>
      );

      lastIndex = block.endIndex;
    });

    // Add remaining text
    if (lastIndex < manifestoText.length) {
      elements.push(
        <span key={`text-${lastIndex}`}>
          {manifestoText.substring(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  const handleBlockClick = (name: string) => {
    const member = teamMembers.find((m) => m.name === name);
    if (member) {
      setSelectedMember(member);
      // Trigger slice animation
      if (detailsRef.current) {
        const topHalf = manifestoRef.current?.querySelector('[data-top]') as HTMLElement;
        const bottomHalf = manifestoRef.current?.querySelector('[data-bottom]') as HTMLElement;

        if (topHalf && bottomHalf) {
          gsap.timeline()
            .to(topHalf, { y: -200, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
            .to(bottomHalf, { y: 200, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
            .to(
              detailsRef.current,
              { opacity: 1, autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
              0.3
            );
        }
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex items-center justify-center p-8 md:p-12" style={{ fontFamily: "'Manrope', sans-serif" }}>
      
      {/* --- MAIN MANIFESTO --- */}
      <div
        ref={manifestoRef}
        className="max-w-5xl w-full relative z-10"
        data-top="true"
      >
        <div className="inline-block border border-gray-700 px-6 py-2 mb-12 rounded-full">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
            Classified Documents
          </span>
        </div>

        <p className="text-2xl md:text-4xl lg:text-5xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-bold text-gray-300 tracking-tight">
          {renderManifesto()}
        </p>

        <div className="mt-12 text-gray-500 text-sm font-medium uppercase tracking-[0.2em]">
          ↑ Hover to reveal classified information
        </div>
      </div>

      {/* --- MEMBER DETAILS MODAL --- */}
      {selectedMember && (
        <div
          ref={detailsRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm opacity-0"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="relative max-w-4xl w-full h-screen md:h-auto md:max-h-[85vh] flex flex-col md:flex-row bg-[#0A0A0A] border-4 border-white overflow-hidden">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-6 right-6 z-50 p-2 hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Image side */}
            <div className="w-full md:w-1/2 h-1/3 md:h-full relative overflow-hidden">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-full h-full object-cover filter grayscale"
              />
              <div className="absolute -bottom-6 -right-6 text-[15vw] md:text-[12vw] font-black text-white/10 leading-none pointer-events-none select-none">
                {selectedMember.id}
              </div>
            </div>

            {/* Dossier side */}
            <div className="w-full md:w-1/2 h-2/3 md:h-full flex flex-col justify-center p-8 md:p-12 bg-black">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 block mb-4">
                  {selectedMember.role}
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
                  {selectedMember.name}
                </h2>
              </div>

              <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed mb-8">
                {selectedMember.bio}
              </p>

              <div className="pt-8 border-t border-gray-800">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-sm font-bold uppercase tracking-[0.2em] border-b border-gray-600 pb-1 hover:text-white hover:border-white transition-colors"
                >
                  Close Dossier &times;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
