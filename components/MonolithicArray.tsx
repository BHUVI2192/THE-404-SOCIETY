import React, { useState } from 'react';

const teamMembers = [
    { id: '01', name: 'BHUVAN N', role: 'FOUNDER & CEO', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop', bio: 'Visionary and strategic lead. Drives the creative and operational roadmap, blending high-level decision-making with hands-on UI/UX craftsmanship.' },
    { id: '02', name: 'K HRISHIKESH', role: 'CO-FOUNDER & VP', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop', bio: 'The operational bridge. Shapes long-term community goals and scales operations to new colleges, ensuring vision and execution remain tightly connected.' },
    { id: '03', name: 'DEEPAK K', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop', bio: 'Architect of the technical backbone. Oversees the tech stack for all learning tracks, ensuring our infrastructure never breaks under scale.' },
    { id: '04', name: 'RUDRESH J', role: 'CCO', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop', bio: 'The creative force behind visual storytelling. Leads media production from concept to final edit, ensuring the society\'s impact is seen and felt.' },
    { id: '05', name: 'PRAMATH H', role: 'CINO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop', bio: 'Spearheads the exploration of AI and machine learning. Integrates cutting-edge tools into architectures to keep us at the absolute frontier.' },
    { id: '06', name: 'YASHWARDHAN KUMAR', role: 'COO', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop', bio: 'The engine of efficiency. Coordinates between developers, monitors project sprints, and keeps all deliverables running like clockwork.' }
];

export default function MonolithicArray() {
    // Default to the first member being open
    const [activeId, setActiveId] = useState(teamMembers[0].id);

    return (
        <section className="relative w-full h-[100svh] bg-black text-white overflow-hidden font-sans">

            {/* Intro Overlay (Sits on top of the array) */}
            <div className="absolute top-6 md:top-12 left-6 md:left-12 z-50 pointer-events-none mix-blend-difference">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                    THE CORE
                </h2>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-300 block mt-2">
                    Initiative Leads // 404
                </span>
            </div>

            {/* THE EXPANSION ARRAY */}
            {/* Flex-col on mobile (stack vertically), Flex-row on desktop (side by side) */}
            <div className="flex flex-col md:flex-row w-full h-full">
                {teamMembers.map((member) => {
                    const isActive = activeId === member.id;

                    return (
                        <div
                            key={member.id}
                            onClick={() => setActiveId(member.id)}
                            onMouseEnter={() => window.innerWidth >= 768 && setActiveId(member.id)}
                            className={`relative overflow-hidden cursor-pointer border-b md:border-b-0 md:border-r border-[#1a1a1a] transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group ${isActive ? 'flex-[6] md:flex-[8]' : 'flex-[1]'
                                }`}
                        >

                            {/* The Background Image */}
                            <img
                                src={member.image}
                                alt={member.name}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${isActive ? 'grayscale-0 opacity-100 scale-100' : 'grayscale opacity-40 scale-110 group-hover:opacity-70'
                                    }`}
                            />

                            {/* Heavy Shadow Overlay for text legibility */}
                            <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${isActive ? 'from-black/90 via-black/40 to-transparent' : 'from-black/80 to-black/20'
                                }`}></div>

                            {/* --- INACTIVE STATE CONTENT (Collapsed) --- */}
                            {/* On desktop, text is rotated 90deg sideways. On mobile, it stays horizontal */}
                            <div
                                className={`absolute inset-0 flex items-end md:items-center justify-start md:justify-center p-4 transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 delay-300'
                                    }`}
                            >
                                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-6 md:-rotate-180 md:[writing-mode:vertical-rl]">
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">
                                        ID: {member.id}
                                    </span>
                                    <h3 className="text-sm md:text-xl font-black uppercase tracking-widest text-white whitespace-nowrap opacity-50 group-hover:opacity-100 transition-opacity">
                                        {member.name}
                                    </h3>
                                </div>
                            </div>

                            {/* --- ACTIVE STATE CONTENT (Expanded Bio Panel) --- */}
                            <div
                                className={`absolute bottom-0 left-0 w-full md:w-auto md:max-w-md p-6 md:p-12 transition-all duration-700 ease-out ${isActive ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-10 opacity-0 pointer-events-none invisible'
                                    }`}
                            >
                                <span className="inline-block border border-gray-600 bg-black/50 backdrop-blur-md px-3 py-1 mb-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                                    {member.role}
                                </span>

                                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-4 drop-shadow-lg">
                                    {member.name}
                                </h2>

                                <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed drop-shadow-md">
                                    {member.bio}
                                </p>

                                <button className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-indigo-400 transition-colors">
                                    <span className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center">
                                        +
                                    </span>
                                    View Full Clearances
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>

        </section>
    );
}
