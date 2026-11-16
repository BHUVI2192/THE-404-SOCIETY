import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const teamMembers = [
  {
    id: '01',
    sysId: 'SYS_ADMIN_01',
    name: 'BHUVAN N',
    role: 'FOUNDER & PRESIDENT',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop',
    bio: 'Visionary leader driving creative roadmap with hands-on UI/UX excellence.'
  },
  {
    id: '02',
    sysId: 'SYS_ADMIN_02',
    name: 'K HRISHIKESH',
    role: 'CO-FOUNDER & VICE PRESIDENT',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop',
    bio: 'Operations architect scaling initiatives across new colleges.'
  },
  {
    id: '03',
    sysId: 'SYS_ADMIN_03',
    name: 'DEEPAK K',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    bio: 'Technical backbone overseeing engineering standards and mentorship.'
  },
  {
    id: '04',
    sysId: 'SYS_ADMIN_04',
    name: 'RUDRESH J',
    role: 'CCO',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
    bio: 'Creative storyteller transforming ideas into compelling narratives.'
  },
  {
    id: '05',
    sysId: 'SYS_ADMIN_05',
    name: 'PRAMATH H',
    role: 'CHIEF INNOVATION OFFICER',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop',
    bio: 'AI and ML pioneer integrating cutting-edge tech into architecture.'
  },
  {
    id: '06',
    sysId: 'SYS_ADMIN_06',
    name: 'YASHWARDHAN KUMAR',
    role: 'COO',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
    bio: 'Operations maestro coordinating teams and orchestrating scaling.'
  }
];

export default function TerminalDatabase() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const [displayedBio, setDisplayedBio] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const bioRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle member selection
  const handleSelectMember = (member: typeof teamMembers[0]) => {
    setSelectedMember(member);
    setDisplayedBio('');
    setImageLoaded(false);
    setCursorVisible(true);

    // Clear previous timeouts
    if (typewriterTimeoutRef.current) clearTimeout(typewriterTimeoutRef.current);
    if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);

    // Image decryption effect
    if (imageRef.current) {
      imageRef.current.innerHTML = '';
      
      // Create pixelated/glitch effect using canvas
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const containerSize = 300;
        canvas.width = containerSize;
        canvas.height = containerSize;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw image
        ctx.drawImage(img, 0, 0, containerSize, containerSize);
        
        // Animate decryption with pixelation
        let pixelSize = 60;
        const decryptionTl = gsap.timeline();

        const pixelateInterval = setInterval(() => {
          if (pixelSize > 1) {
            pixelSize = Math.max(1, pixelSize * 0.6);
            
            // Clear and redraw with current pixelation
            ctx.clearRect(0, 0, containerSize, containerSize);
            
            const imageData = ctx.getImageData(0, 0, containerSize, containerSize);
            const data = imageData.data;

            // Apply pixelation
            for (let i = 0; i < containerSize; i += pixelSize) {
              for (let j = 0; j < containerSize; j += pixelSize) {
                const idx = (i * containerSize + j) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const a = data[idx + 3];

                for (let di = 0; di < pixelSize && i + di < containerSize; di++) {
                  for (let dj = 0; dj < pixelSize && j + dj < containerSize; dj++) {
                    const pixelIdx = ((i + di) * containerSize + (j + dj)) * 4;
                    data[pixelIdx] = r;
                    data[pixelIdx + 1] = g;
                    data[pixelIdx + 2] = b;
                    data[pixelIdx + 3] = a;
                  }
                }
              }
            }

            ctx.putImageData(imageData, 0, 0);
            if (imageRef.current) {
              imageRef.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
            }
          } else {
            clearInterval(pixelateInterval);
            if (imageRef.current) {
              imageRef.current.style.backgroundImage = `url(${member.image})`;
              imageRef.current.style.backgroundSize = 'cover';
              imageRef.current.style.backgroundPosition = 'center';
            }
            setImageLoaded(true);
          }
        }, 50);
      };

      img.src = member.image;
    }

    // Typewriter effect
    let charIndex = 0;
    const typeNextChar = () => {
      if (charIndex < member.bio.length) {
        setDisplayedBio(member.bio.substring(0, charIndex + 1));
        charIndex++;
        typewriterTimeoutRef.current = setTimeout(typeNextChar, 20);
      }
    };

    typewriterTimeoutRef.current = setTimeout(typeNextChar, 300);
  };

  // Cursor blink animation
  useEffect(() => {
    if (!selectedMember) return;

    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => {
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, [selectedMember]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) clearTimeout(typewriterTimeoutRef.current);
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      
      {/* System header */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black border-b border-gray-800 flex items-center px-8 z-20">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-600">THE 404 SOCIETY TERMINAL DATABASE v1.0</span>
      </div>

      {/* Left Sidebar - System IDs */}
      <div className="w-full md:w-1/3 bg-black border-r border-gray-800 pt-16 pb-8 px-6 md:px-8 overflow-y-auto max-h-[calc(100vh-3rem)]">
        <div className="text-xs uppercase tracking-[0.4em] text-gray-600 mb-8">System Members</div>
        
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => handleSelectMember(member)}
              className={`w-full text-left px-4 py-3 border transition-all duration-300 ${
                selectedMember?.id === member.id
                  ? 'border-white bg-white/5'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                &gt; {member.sysId}
              </span>
              <div className="text-sm font-bold uppercase mt-1 text-white">{member.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Display Matrix */}
      <div className="w-full md:w-2/3 bg-black/50 pt-16 pb-8 px-6 md:px-12 overflow-y-auto max-h-[calc(100vh-3rem)]">
        {selectedMember ? (
          <div className="space-y-8">
            {/* Member info header */}
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                ACCESS LEVEL: {selectedMember.id}
              </div>
              <div className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                {selectedMember.name}
              </div>
              <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mt-3">
                {selectedMember.role}
              </div>
            </div>

            {/* Image decryption matrix */}
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-3">Portfolio Matrix</div>
              <div
                ref={imageRef}
                className="w-full aspect-square bg-gray-900 border-2 border-gray-700"
                style={{
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '300px',
                }}
              />
              {imageLoaded && (
                <div className="mt-2 text-xs text-gray-600">
                  [✓] DECRYPTION COMPLETE
                </div>
              )}
            </div>

            {/* Bio with typewriter effect */}
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-3">System Biography</div>
              <div
                ref={bioRef}
                className="text-lg text-gray-300 leading-relaxed font-medium min-h-[100px] p-4 border border-gray-700 bg-black/30"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  letterSpacing: '0.02em',
                }}
              >
                {displayedBio}
                {selectedMember && displayedBio.length < selectedMember.bio.length && (
                  <span
                    className="animate-pulse"
                    style={{
                      opacity: cursorVisible ? 1 : 0,
                      transition: 'opacity 0.1s',
                    }}
                  >
                    ▮
                  </span>
                )}
              </div>
            </div>

            {/* Access timestamp */}
            <div className="text-xs text-gray-600 border-t border-gray-800 pt-4">
              [ACCESS_LOG] {new Date().toLocaleString().toUpperCase()}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-gray-600 mb-4">
                DISPLAY MATRIX INACTIVE
              </div>
              <p className="text-gray-500 text-sm">
                SELECT A SYSTEM ID TO ACCESS MEMBER DATA
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-700 md:hidden">
        [TERMINAL MODE: MOBILE]
      </div>
    </section>
  );
}
