import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface WhoWeAreProps {
    onClose: () => void;
}

const WhoWeAreExperience: React.FC<WhoWeAreProps> = ({ onClose }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.001
    });

    // --- PARALLAX LAYERS ---

    // 1. Text Layer (Background) - Moves Slower/Heavier
    // It spans a shorter distance because it's "far away"
    const textX = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);

    // 2. Image Layer (Foreground) - Moves Faster/Standard
    // This is the main "scroll" track
    const imageX = useTransform(smoothProgress, [0, 1], ["5vw", "-350vw"]);

    // 3. UI Elements
    const promptOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

    // Force scroll to top on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, []);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const target = scrollContainerRef.current;
        const currentProgress = target.scrollTop / (target.scrollHeight - target.clientHeight);
        progress.set(currentProgress || 0);
    };

    const portalRoot = document.body;

    return ReactDOM.createPortal(
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            data-lenis-prevent="true"
            className="fixed inset-0 z-[99999] bg-[#050509] overflow-y-auto overflow-x-hidden scrollbar-hide"
            style={{
                visibility: 'visible',
                pointerEvents: 'auto',
                WebkitOverflowScrolling: 'touch'
            }}
        >
            {/* Back Button */}
            <div className="fixed top-8 left-8 z-[10000] mix-blend-difference text-white">
                <button
                    onClick={onClose}
                    className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all backdrop-blur-xl group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs uppercase tracking-widest">Back</span>
                </button>
            </div>

            {/* EXPANDED SCROLL HEIGHT */}
            <div className="h-[800vh] relative min-w-full">

                <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">

                    {/* --- LAYER 1: MASSIVE KINETIC TYPE (BACKGROUND) --- */}
                    {/* Outline Text Style */}
                    <motion.div
                        style={{ x: textX }}
                        className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap will-change-transform pointer-events-none select-none"
                    >
                        <h1
                            className="font-black tracking-tighter text-transparent leading-none pl-[2vw]"
                            style={{
                                fontSize: '80vh',
                                WebkitTextStroke: '2px rgba(255, 255, 255, 0.15)',
                            }}
                        >
                            WHO WE ARE
                        </h1>
                    </motion.div>

                    {/* --- LAYER 2: SCATTERED IMAGES (FOREGROUND) --- */}
                    {/* This layer contains the "Scattered" images moving at a cleaner pace */}
                    <motion.div
                        style={{ x: imageX }}
                        className="relative h-full flex items-center gap-[25vw] px-[15vw] will-change-transform"
                    >
                        {/* 1. Intro Label */}
                        <div className="shrink-0 flex flex-col justify-end h-[60%]">
                            <p className="font-mono text-xs text-white uppercase tracking-widest mb-4 border-l border-white/40 pl-4">
                                01 // The Collective
                            </p>
                        </div>

                        {/* 2. Image: "BUILD" (Top Align) */}
                        <div className="shrink-0 self-start mt-[15vh]">
                            <div className="w-[300px] md:w-[400px] aspect-[4/5] relative group bg-[#0a0a14] border border-white/10 overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                                <img
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                                    alt="Build"
                                />
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-[10px] font-mono text-white uppercase">Build</span>
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-4xl mt-8 ml-4 uppercase tracking-tighter">
                                Creative <br /> Chaos
                            </h3>
                        </div>

                        {/* 3. Image: "LEARN" (Bottom Align) */}
                        <div className="shrink-0 self-end mb-[15vh]">
                            <div className="w-[350px] md:w-[450px] aspect-video relative group bg-[#0a0a14] border border-white/10 overflow-hidden shadow-2xl -skew-y-3 hover:skew-y-0 transition-transform duration-700">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                                    alt="Learn"
                                />
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-[10px] font-mono text-white uppercase">Learn</span>
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-4xl mt-8 ml-4 uppercase tracking-tighter text-right">
                                Real <br /> Impact
                            </h3>
                        </div>

                        {/* 4. Image: "GROW" (Center Align) */}
                        <div className="shrink-0 self-center">
                            <div className="w-[300px] md:w-[350px] aspect-square relative group bg-[#0a0a14] border border-white/10 overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                                <img
                                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                                    alt="Grow"
                                />
                            </div>
                        </div>

                        {/* 5. Finale Section */}
                        <div className="shrink-0 flex items-center pr-[10vw]">
                            <div className="border-l-2 border-white pl-12 py-8">
                                <h4 className="text-7xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
                                    Join <br /> The <br /> Cult.
                                </h4>
                                <button
                                    onClick={onClose}
                                    className="group flex items-center gap-4 text-white hover:text-indigo-400 transition-colors"
                                >
                                    <span className="text-sm font-mono uppercase tracking-widest border-b border-transparent group-hover:border-indigo-400 pb-1">Return to Reality</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                    </motion.div>

                    {/* Scroll Prompt */}
                    <motion.div
                        style={{ opacity: promptOpacity }}
                        className="absolute bottom-12 left-12 flex items-center gap-4 text-white/30 font-mono text-[10px] uppercase tracking-[0.6em] pointer-events-none"
                    >
                        <ArrowDown size={24} className="animate-bounce" />
                        Explore the gallery
                    </motion.div>
                </div>
            </div>
        </div>,
        portalRoot
    );
};

export default WhoWeAreExperience;
