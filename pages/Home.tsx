
import React, { useRef, useState, useEffect } from 'react';
import { Section, Button, ScrollReveal, GlassCard } from '../components/UI';
import { ArrowRight, Calendar, MapPin, Users, Code, Cpu, Globe, Rocket, Zap, Layers, Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getEvents, EventData } from '../lib/events';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useScrollOpacity } from '../src/hooks/useScrollOpacity';
import PortalCTA from '../components/PortalCTA';
import HeroParticles from '../src/components/HeroParticles';
import { Helmet } from 'react-helmet-async';
import WhatIsSection from '../components/WhatIsSection';
import TeamAvatars from '../components/TeamAvatars';




// --- SUB-COMPONENTS ---

const EventsTimeline = ({ highlights, loading }: { highlights: EventData[], loading: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const opacity = useScrollOpacity(contentRef, { enterStart: 0.9, enterEnd: 0.5 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <Section className="relative !py-32">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-12 relative" ref={containerRef} style={{ position: 'relative' }}>
                {/* Left Header */}
                <div className="relative" ref={contentRef} style={{ opacity, transition: 'opacity 0.2s linear' }}>
                    <div className="sticky top-32">
                        <span className="text-[#10B981] font-mono text-xs font-bold tracking-widest uppercase mb-4 block">Calendar</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Upcoming <br /> Events</h2>
                        <NavLink to="/events" className="group inline-flex items-center gap-2 text-black font-bold hover:text-[#4F46E5] transition-colors">
                            View Full Schedule
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </NavLink>
                    </div>
                </div>

                {/* Right Timeline - Container with explicit relative positioning for Framer Motion scroll animations */}
                <div className="relative pl-8 md:pl-12" style={{ position: 'relative' }}>
                    {/* Timeline Track */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neutral-100" />
                    <motion.div
                        style={{ height: lineHeight }}
                        className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-[#4F46E5] to-[#10B981]"
                    />

                    <div className="flex flex-col gap-16 pb-20">
                        {loading ? (
                            <div className="flex items-center gap-3 text-neutral-400 font-bold uppercase tracking-widest text-xs">
                                <Loader2 className="animate-spin" size={16} /> Syncing Events...
                            </div>
                        ) : highlights.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="text-neutral-300 mb-4"><Calendar size={32} className="mx-auto opacity-40" /></div>
                                <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm mb-4">No Upcoming Events</p>
                                <p className="text-neutral-500 text-sm mb-6">Check back soon for exciting workshops, hackathons, and community events.</p>
                                <NavLink to="/events" className="text-[#4F46E5] font-bold text-sm hover:underline">View Event Archive →</NavLink>
                            </div>
                        ) : (
                            highlights.map((event, i) => (
                                <ScrollReveal key={event.id} delay={i * 0.1}>
                                    <NavLink to={`/register-event/${event.id}`} className="block group">
                                        <GlassCard className="!p-0 overflow-hidden hover:!border-[#4F46E5]/40 transition-all duration-500">
                                            <div className="grid md:grid-cols-[200px_1fr] h-full">
                                                {/* Date Side */}
                                                <div className="bg-neutral-50 p-8 flex flex-col justify-center items-center text-center border-r border-neutral-100 group-hover:bg-[#4F46E5]/5 transition-colors">
                                                    <span className="text-3xl font-black text-black block mb-1">{event.date.split(' ')[0]}</span>
                                                    <span className="text-xs font-mono uppercase text-neutral-500">{event.date.split(' ')[1] || event.year}</span>
                                                </div>
                                                {/* Content Side */}
                                                <div className="p-8 flex flex-col justify-center relative">
                                                    <div className="mb-2">
                                                        <span className="inline-block px-2 py-1 bg-white border border-neutral-200 rounded text-[10px] font-bold uppercase tracking-wider text-neutral-500 group-hover:border-[#4F46E5] group-hover:text-[#4F46E5] transition-colors">
                                                            {event.category || "General"}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#4F46E5] transition-colors">{event.title}</h3>
                                                    <p className="text-neutral-500 text-sm line-clamp-2 mb-4">{event.description || "Join us for this exciting session."}</p>

                                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black group-hover:translate-x-2 transition-transform">
                                                        {event.status === 'locked' ? 'View Details' : 'Register Now'} <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </NavLink>
                                </ScrollReveal>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Section>
    );
};

// Helper for floating chips
const FloatingChip = ({ children, className, delay, x, y }: any) => (
    <motion.div
        style={{ x, y }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay, ease: "backOut" }}
        className={`absolute bg-white border border-neutral-100 shadow-xl px-6 py-4 rounded-2xl ${className}`}
    >
        {children}
    </motion.div>
);

const Home: React.FC = () => {
    const [highlights, setHighlights] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHighlights = async () => {
            const data = await getEvents();
            // Show all events sorted by most recent
            setHighlights(data);
            setLoading(false);
        };
        fetchHighlights();
    }, []);

    // Mouse parallax for Hero
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(((clientX - left) / width) - 0.5);
        mouseY.set(((clientY - top) / height) - 0.5);
    }

    // Scroll Opacities for other sections
    const whatIsRef = useRef<HTMLDivElement>(null);
    const whatIsOpacity = useScrollOpacity(whatIsRef, { enterStart: 0.8, enterEnd: 0.4 });

    const visionRef = useRef<HTMLDivElement>(null);
    const visionOpacity = useScrollOpacity(visionRef, { enterStart: 0.8, enterEnd: 0.4 });

    return (
        <>
            <Helmet>
                <title>The 404 Society – PESITM Student Developer Community</title>
                <meta name="description" content="The 404 Society is a student-run coding club at PESITM Shivamogga. Join our AI workshops, hackathons, full-stack development sessions, and peer-to-peer learning community." />
                <meta property="og:title" content="The 404 Society – PESITM Student Developer Community" />
                <meta property="og:description" content="Where students build, code & innovate. The premier coding club at PESITM, Shivamogga." />
                <meta property="og:image" content="https://the404society.in/logo.png?v=1.1" />
                <meta property="og:type" content="website" />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content="The 404 Society – PESITM Student Developer Community" />
                <meta property="twitter:description" content="Where students build, code & innovate. The premier coding club at PESITM, Shivamogga." />
                <meta property="twitter:image" content="https://the404society.in/logo.png?v=1.1" />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section
                className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-white"
                onMouseMove={handleMouseMove}
            >
                {/* Minimalist RGB Background Accents */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0000] via-[#00FF00] to-[#0000FF] opacity-80" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-black/[0.02] to-transparent rounded-full pointer-events-none" />

                <div className="w-full max-w-[1920px] mx-auto px-4 relative z-10 flex flex-col items-center justify-center">

                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 flex items-center gap-4"
                    >
                        <div className="h-px w-12 bg-black/20"></div>
                        <span className="font-mono text-[9px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.3em] text-neutral-400 uppercase whitespace-nowrap">Est. 2025 // PESITM Shivamogga, Karnataka</span>
                        <div className="h-px w-12 bg-black/20"></div>
                    </motion.div>

                    {/* Main Title - Massive Single Line */}
                    <div className="relative mb-6 sm:mb-8 text-center">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="leading-none font-black tracking-tighter text-black mix-blend-multiply relative z-20"
                            style={{ fontSize: 'clamp(8vw, 11vw, 11vw)' }}
                        >
                            THE <span className="italic font-serif font-thin text-neutral-800">404</span> SOCIETY
                        </motion.h1>

                        {/* RGB Decor elements (Behind Text) */}
                        <motion.div
                            style={{ x: useTransform(mouseX, [-0.5, 0.5], [-20, 20]), y: useTransform(mouseY, [-0.5, 0.5], [-20, 20]) }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-black/5 rounded-full -z-10"
                        />
                        <motion.div
                            style={{ x: useTransform(mouseX, [-0.5, 0.5], [20, -20]), y: useTransform(mouseY, [-0.5, 0.5], [20, -20]) }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38vw] h-[38vw] border border-[#FF0000]/10 rounded-full -z-10"
                        />
                        <motion.div
                            style={{ x: useTransform(mouseX, [-0.5, 0.5], [10, -10]), y: useTransform(mouseY, [-0.5, 0.5], [-10, 10]) }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[39vw] h-[39vw] border border-[#0000FF]/10 rounded-full -z-10"
                        />
                    </div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-2xl text-center text-lg sm:text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed mb-8 sm:mb-10 px-4"
                    >
                        Where students <span className="text-black font-bold border-b border-black">build, code & innovate</span>.
                        The premier coding club at PESITM, Shivamogga.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pointer-events-auto px-4"
                    >
                        <NavLink to="/join">
                            <Button variant="primary" className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg w-full sm:w-auto">Join Our Community</Button>
                        </NavLink>
                        <NavLink to="/about">
                            <Button variant="secondary" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto">Explore Our Mission</Button>
                        </NavLink>
                    </motion.div>
                </div>

                {/* Bottom Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-black to-transparent"></div>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-[#FF0000] rounded-full"></div>
                        <div className="w-1 h-1 bg-[#00FF00] rounded-full"></div>
                        <div className="w-1 h-1 bg-[#0000FF] rounded-full"></div>
                    </div>
                </motion.div>
            </section>


            {/* --- WHAT IS 404 (Glassmorphism Cards) --- */}
            <WhatIsSection />


            {/* --- VISION & MISSION (Stacked Kinetic) --- */}
            < Section className="bg-neutral-50 border-t border-neutral-100 !py-40 relative" >
                {/* Background Decor */}
                < div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-50 via-transparent to-transparent opacity-50" />

                <div ref={visionRef} className="max-w-5xl mx-auto space-y-32 relative z-10" style={{ opacity: visionOpacity, transition: 'opacity 0.2s linear' }}>
                    {/* Vision */}
                    <div className="relative pl-8 md:pl-0">
                        <h3 className="text-xl font-mono text-[#4F46E5] mb-6 flex items-center gap-3 font-bold">
                            <span className="w-12 h-[2px] bg-[#4F46E5]"></span> Vision
                        </h3>
                        <p className="text-5xl md:text-7xl font-bold leading-[1.1] text-black tracking-tight relative">
                            To make PESITM the most{' '}
                            <span className="relative inline-block text-[#4F46E5]">
                                vibrant
                                <motion.span
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: "100%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                                    className="absolute bottom-1 left-0 h-4 bg-[#A78BFA]/30 -z-10 -rotate-2 rounded-sm"
                                />
                            </span> student tech hub in Karnataka.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="relative pl-8 md:pl-20">
                        <h3 className="text-xl font-mono text-[#10B981] mb-6 flex items-center gap-3 font-bold">
                            <span className="w-12 h-[2px] bg-[#10B981]"></span> Mission
                        </h3>
                        <p className="text-5xl md:text-7xl font-bold leading-[1.1] text-black tracking-tight">
                            <span className="inline-block hover:scale-[1.02] transition-transform origin-left cursor-default">Learn by doing.</span>{' '}
                            <span className="text-neutral-400 font-medium tracking-normal text-3xl md:text-5xl block mt-4">
                                Real-World Projects. Open Source. Peer Learning.
                            </span>
                        </p>
                        {/* Floating Dot */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-4 top-0 lg:right-20 lg:top-10 text-6xl opacity-20 pointer-events-none"
                        >
                            ✨
                        </motion.div>
                    </div>
                </div>
            </Section >


            {/* --- UPCOMING EVENTS (Timeline) --- */}
            <EventsTimeline highlights={highlights} loading={loading} />

            {/* --- TEAM AVATARS --- */}
            <TeamAvatars />

            {/* --- PORTAL FINAL CTA --- */}
            <PortalCTA />



        </>
    );
};



export default Home;
