import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { X } from 'lucide-react';

const teamMembers = [
  {
    id: '01',
    name: 'BHUVAN N',
    role: 'FOUNDER & PRESIDENT (CEO)',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop',
    bio: 'Visionary leader who drives the roadmap while crafting exceptional UI/UX. Blends strategic decision-making with hands-on design excellence.'
  },
  {
    id: '02',
    name: 'K HRISHIKESH',
    role: 'CO-FOUNDER & VICE PRESIDENT',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop',
    bio: 'Operational architect. Shapes community goals and scales initiatives across new colleges while maintaining tight vision-execution alignment.'
  },
  {
    id: '03',
    name: 'DEEPAK K',
    role: 'CHIEF TECHNOLOGY OFFICER',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    bio: 'Technical backbone architect. Oversees engineering standards for all learning tracks and client projects, mentoring the next generation.'
  },
  {
    id: '04',
    name: 'RUDRESH J',
    role: 'CHIEF CREATIVE OFFICER',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
    bio: 'Creative storyteller. Transforms ideas into compelling visual narratives that resonate beyond campus walls through innovative media production.'
  },
  {
    id: '05',
    name: 'PRAMATH H',
    role: 'CHIEF INNOVATION OFFICER',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop',
    bio: 'AI and ML pioneer. Explores cutting-edge technologies and integrates them into client architectures to keep the society at innovation frontiers.'
  },
  {
    id: '06',
    name: 'YASHWARDHAN KUMAR',
    role: 'CHIEF OPERATIONS OFFICER',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
    bio: 'Operations engine. Coordinates developer teams, monitors sprint progress, and orchestrates seamless scaling of technical and creative operations.'
  }
];

interface BodyState {
  id: string;
  x: number;
  y: number;
  angle: number;
}

export default function ZeroGravityPit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const bodiesMapRef = useRef<Map<string, any>>(new Map());
  const [bodyStates, setBodyStates] = useState<BodyState[]>([]);
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const dragRef = useRef<any>(null);

  // Initialize physics - runs once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 1;
    engine.gravity.x = 0;

    // Add walls
    const wallOpts = { isStatic: true };
    Matter.World.add(engine.world, [
      Matter.Bodies.rectangle(width / 2, -40, width * 2, 80, wallOpts),
      Matter.Bodies.rectangle(width / 2, height + 40, width * 2, 80, wallOpts),
      Matter.Bodies.rectangle(-40, height / 2, 80, height * 2, wallOpts),
      Matter.Bodies.rectangle(width + 40, height / 2, 80, height * 2, wallOpts),
    ]);

    // Create bodies for each member
    teamMembers.forEach((member, idx) => {
      const body = Matter.Bodies.rectangle(
        Math.random() * width,
        -100 - idx * 120,
        250,
        80,
        {
          restitution: 0.7,
          friction: 0.3,
          frictionAir: 0.02,
          density: 0.001,
        }
      );
      Matter.World.add(engine.world, body);
      bodiesMapRef.current.set(member.id, body);
    });

    // Animation loop
    let animId: ReturnType<typeof setInterval> | null = null;
    
    const startAnimation = () => {
      if (animId !== null) clearInterval(animId);
      
      animId = setInterval(() => {
        if (!engineRef.current) return;

        Matter.Engine.update(engineRef.current);

        const states: BodyState[] = [];
        bodiesMapRef.current.forEach((body, id) => {
          states.push({
            id,
            x: body.position.x - 125,
            y: body.position.y - 40,
            angle: body.angle,
          });
        });

        setBodyStates(states);
      }, 1000 / 60);
    };

    startAnimation();

    return () => {
      if (animId !== null) clearInterval(animId);
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, memberId: string) => {
    if (!containerRef.current) return;

    const body = bodiesMapRef.current.get(memberId);
    if (!body) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    dragRef.current = {
      body,
      offsetX: mx - body.position.x,
      offsetY: my - body.position.y,
    };

    e.preventDefault();
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!dragRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      Matter.Body.setPosition(dragRef.current.body, {
        x: mx - dragRef.current.offsetX,
        y: my - dragRef.current.offsetY,
      });

      Matter.Body.setVelocity(dragRef.current.body, { x: 0, y: 0 });
    };

    const handleUp = () => {
      dragRef.current = null;
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <div className="absolute top-8 left-8 z-10 text-gray-600 text-xs uppercase tracking-[0.2em] pointer-events-none">
        <p>Drag, Throw & Discover</p>
      </div>

      {bodyStates.map((state) => {
        const member = teamMembers.find((m) => m.id === state.id);
        if (!member) return null;

        return (
          <div
            key={state.id}
            onMouseDown={(e) => handleMouseDown(e, state.id)}
            onDoubleClick={() => setSelectedMember(member)}
            className="absolute w-[250px] h-20 flex items-center justify-center border-2 border-white bg-black cursor-grab active:cursor-grabbing"
            style={{
              transform: `translate(${state.x}px, ${state.y}px) rotate(${state.angle}rad)`,
              transformOrigin: 'center',
              userSelect: 'none',
              willChange: 'transform',
            }}
          >
            <span className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white pointer-events-none whitespace-nowrap">
              {member.name}
            </span>
          </div>
        );
      })}

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={() => setSelectedMember(null)}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 transition-colors"
          >
            <X size={32} className="text-white" />
          </button>

          <div className="max-w-6xl w-full h-screen md:h-auto md:max-h-[90vh] flex flex-col md:flex-row bg-[#0A0A0A] border-4 border-white overflow-hidden">
            
            <div className="w-full md:w-1/2 h-1/3 md:h-full relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-8 -right-8 text-[20vw] md:text-[15vw] font-black text-white/5 leading-none pointer-events-none select-none">
                {selectedMember.id}
              </div>
            </div>

            <div className="w-full md:w-1/2 h-2/3 md:h-full flex flex-col justify-center p-8 md:p-16 bg-black border-t-4 md:border-t-0 md:border-l-4 border-white">
              <div className="mb-12">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-500 block mb-6">
                  {selectedMember.role}
                </span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight break-words">
                  {selectedMember.name}
                </h2>
              </div>

              <p className="text-base md:text-xl text-gray-300 font-medium leading-relaxed mb-12 pr-4">
                {selectedMember.bio}
              </p>

              <div className="pt-8 border-t border-gray-800 mt-auto">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] hover:opacity-70 transition-opacity text-gray-400 hover:text-white"
                >
                  X Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-8 z-10 text-gray-600 text-xs uppercase tracking-[0.2em] pointer-events-none md:hidden">
        <p>Tilt to move</p>
        <p>Tap to expand</p>
      </div>
    </section>
  );
}
