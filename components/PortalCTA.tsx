import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './UI';
import { ArrowRight } from 'lucide-react';
import { useCircleTransition } from '../src/hooks/useCircleTransition';

const PortalCTA = () => {
    // Use the circle transition hook
    const { buttonRef, triggerTransition, maskStyle, isTransitioning } = useCircleTransition({
        path: '/community',
        duration: 0.8,
        delay: 0.1
    });

    return (
        <section className="relative w-full py-32 px-6 bg-[#f5f5f7] overflow-hidden flex flex-col items-center justify-center">

            {/* CIRCULAR MASK OVERLAY */}
            <div style={maskStyle} />

            <div className="w-full max-w-[960px] mx-auto flex flex-col items-center relative z-10">

                {/* 1. HEADLINE & SUBTEXT */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                    animate={isTransitioning ? { opacity: 0, y: -20, transition: { duration: 0.3 } } : { opacity: 1, y: 0 }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-neutral-900 tracking-tight mb-6 leading-[1.1]">
                        Join PESITM's Premier Student Developer Community
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Be part of Shivamogga's most active coding club — hackathons, workshops, open-source & peer learning.
                    </p>
                </motion.div>

                {/* 2. CTA BUTTON */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-10px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    animate={isTransitioning ? { opacity: 0, scale: 0.8, transition: { duration: 0.2 } } : { opacity: 1, scale: 1 }}
                >
                    <button
                        ref={buttonRef}
                        onClick={triggerTransition}
                        className="group relative bg-neutral-900 text-white rounded-full px-10 py-5 text-xl shadow-xl hover:shadow-2xl hover:bg-neutral-800 border-none flex items-center gap-4 transition-all duration-300 outline-none"
                    >
                        <span>Join the Coding Community</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-white/70 group-hover:text-white" />
                    </button>
                </motion.div>

            </div>

        </section>
    );
};

export default PortalCTA;
