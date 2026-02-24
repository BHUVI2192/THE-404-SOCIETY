import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Code, Users, Globe, Zap, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from './UI';

const Tile = ({ item, index }: { item: any; index: number;[key: string]: any }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="group relative flex-1 min-w-[280px] h-[320px] rounded-3xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-md overflow-hidden flex flex-col justify-between p-8 hover:bg-white/[0.06] transition-colors"
            style={{
                perspective: "1000px"
            }}
        >
            {/* Hover 3D Tilt Effect Wrapper (CSS-based for performance or simple Framer) */}
            {/* Gradient Accent Border - Top */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Ambient Content Glow */}
            <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity duration-500 rounded-full pointer-events-none`} />

            <div className="relative z-10">
                <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-6 group-hover:bg-white/10 transition-colors border border-white/5`}>
                    <item.icon size={28} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                    {item.title}
                </h3>
                <p className="text-neutral-400 text-sm font-medium leading-relaxed group-hover:text-neutral-300 transition-colors">
                    {item.description}
                </p>
            </div>

            <div className="relative z-10 flex items-center text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors gap-2 opacity-60 group-hover:opacity-100">
                <span>Explore</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    );
};

const CommunityCTA = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const cards = [
        {
            title: "Hackathons",
            icon: Code,
            description: "24-hour sprints to ship wild ideas and win prizes.",
            gradient: "from-neutral-100 to-neutral-400"
        },
        {
            title: "Mentorship",
            icon: Users,
            description: "Get guidance from seniors who've cracked top companies.",
            gradient: "from-emerald-400 to-emerald-600"
        },
        {
            title: "Open Source",
            icon: Globe,
            description: "Contribute to real-world projects used by thousands.",
            gradient: "from-indigo-400 to-purple-500"
        },
        {
            title: "Tech Talks",
            icon: Zap,
            description: "Weekly deep dives into new tech stacks and trends.",
            gradient: "from-amber-300 to-orange-500"
        }
    ];

    return (
        <section ref={sectionRef} className="relative w-full min-h-[90vh] bg-neutral-950 flex flex-col items-center justify-center overflow-hidden py-32">

            {/* --- CINEMATIC BACKGROUND --- */}
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Parallax Orbs */}
            <motion.div style={{ y: y1 }} className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <motion.div style={{ y: y2 }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 pointer-events-none z-0" />

            {/* --- CONTENT --- */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">

                {/* STORY / HEADLINE */}
                <div className="text-center mb-20 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                            <span className="text-neutral-400">Build more than</span> <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                just
                            </span>
                            {" "}
                            <span className="relative inline-block">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 animate-gradient-x bg-[length:200%_auto]">
                                    résumés.
                                </span>
                                {/* Glow under text */}
                                <div className="absolute -inset-4 bg-purple-500/20 blur-xl -z-10 rounded-full opacity-50" />
                            </span>
                        </h2>

                        <p className="text-xl md:text-2xl text-neutral-400 font-medium max-w-2xl mx-auto mb-10">
                            Ship projects, lead teams, and grow with people who care about your craft.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <NavLink to="/community">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10">Apply for Membership</span>
                                    <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </NavLink>
                            <span className="text-xs font-mono uppercase tracking-widest text-neutral-600">
                                Takes 2 minutes • No fees to apply
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* INTERACTIVE PILLARS */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {cards.map((card, i) => (
                        <Tile key={i} item={card} index={i} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CommunityCTA;
