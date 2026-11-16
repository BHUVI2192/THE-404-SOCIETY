import React, { useState, useRef } from "react";
import { subscribeToNewsletter } from "../lib/newsletter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import gsap from 'gsap';

interface NewsletterWidgetProps {
    variant?: "full" | "compact";
}

export default function NewsletterWidget({ variant = "full" }: NewsletterWidgetProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    // Refs for animated elements (Golden Spotlight Noir)
    const blackoutRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const formWrapperRef = useRef<HTMLDivElement>(null);
    const spotlightGlowRef = useRef<HTMLDivElement>(null);
    const goldButtonLayerRef = useRef<HTMLSpanElement>(null);

    // --- THE GSAP "SPOTLIGHT NOIR" TIMELINE ---
    const handleFocus = () => {
        if (variant !== "full") return;
        const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.out" } });

        tl
            // 1. Fade in the full-screen blackout layer
            .to(blackoutRef.current, { autoAlpha: 1 }, 0)
            // 2. Dim the surrounding text
            .to(textContainerRef.current, { opacity: 0.2, scale: 0.98 }, 0)
            // 3. Ignite the golden spotlight glow behind the form
            .to(spotlightGlowRef.current, { opacity: 1, scale: 1.1 }, 0)
            // 4. Cross-fade the button background to gold gradient
            .to(goldButtonLayerRef.current, { opacity: 1 }, 0);
    };

    const handleBlur = () => {
        if (variant !== "full") return;
        const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power3.inOut" } });

        tl
            // Reverse everything back to the base dark state
            .to(blackoutRef.current, { autoAlpha: 0 }, 0)
            .to(textContainerRef.current, { opacity: 1, scale: 1 }, 0)
            .to(spotlightGlowRef.current, { opacity: 0, scale: 0.9 }, 0)
            .to(goldButtonLayerRef.current, { opacity: 0 }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus("loading");
        try {
            await subscribeToNewsletter(email.trim(), "");
            setStatus("success");
            setEmail("");
            // ensure focus is cleared logic
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "Something went wrong. Please try again.");
            setTimeout(() => setStatus("idle"), 4000);
        }
    };

    if (variant === "compact") {
        return (
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {status === "success" ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 text-emerald-400"
                        >
                            <CheckCircle size={18} />
                            <span className="text-sm font-semibold">You're subscribed!</span>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            className="flex gap-2"
                        >
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="bg-white text-black px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
                            >
                                {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
                {status === "error" && <p className="text-red-400 text-xs mt-2">{message}</p>}
            </div>
        );
    }

    return (
        // BASE UI: Dark Charcoal Background
        <section className="relative w-full bg-[#111111] text-white py-32 md:py-48 flex flex-col items-center justify-center overflow-hidden font-sans border-t border-[#222222]">

            {/* --- LAYER 1: THE BLACKOUT OVERLAY (Fixed, covers entire site) --- */}
            <div
                ref={blackoutRef}
                className="fixed inset-0 z-[998] bg-black invisible opacity-0 pointer-events-none"
            ></div>

            <div className="w-full max-w-5xl mx-auto px-6 relative z-[999]">

                {/* --- LAYER 2: TEXT CONTENT (Dims on focus) --- */}
                <div ref={textContainerRef} className="text-center mb-16 transition-transform origin-center">
                    <div className="inline-block border border-white/30 px-4 py-1 mb-6 rounded-full">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                            The 404 Transmission
                        </span>
                    </div>
                    <h2 className="text-[10vw] md:text-[7vw] font-black uppercase tracking-tighter leading-[0.9] mb-8">
                        Receive<br />The Signal.
                    </h2>
                    <p className="text-xl md:text-2xl font-medium text-gray-400 max-w-2xl mx-auto">
                        Enter the network. Get unfiltered updates on drops, hackathons, and community chaos.
                    </p>
                </div>

                {/* --- LAYER 3: THE FORM BLOCK & SPOTLIGHT --- */}
                <div ref={formWrapperRef} className="relative w-full max-w-3xl mx-auto">

                    {/* THE GOLDEN SPOTLIGHT GLOW (Absolute behind the form) */}
                    <div
                        ref={spotlightGlowRef}
                        className="absolute -inset-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/40 via-orange-500/10 to-transparent blur-[60px] opacity-0 pointer-events-none"
                    ></div>

                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success-full"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="relative flex flex-col items-center gap-4 p-8 border-2 border-white/20 bg-white/5 backdrop-blur-sm uppercase tracking-widest font-black"
                            >
                                <div className="flex items-center gap-4 text-yellow-500">
                                    <CheckCircle size={32} />
                                    <span className="text-2xl md:text-3xl">Signal Received.</span>
                                </div>
                                <p className="text-sm text-gray-400 max-w-sm leading-relaxed text-center">
                                    Welcome to the network. Check your inbox for confirmation.
                                </p>
                            </motion.div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="relative flex flex-col md:flex-row w-full bg-white/5 border-2 border-white/20 backdrop-blur-sm p-2"
                            >
                                {/* Input Field */}
                                <input
                                    type="email"
                                    placeholder="ENTER YOUR EMAIL"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className="w-full md:w-2/3 bg-transparent p-6 text-xl md:text-3xl font-bold uppercase text-white placeholder:text-white/30 outline-none"
                                />

                                {/* The Transformative Button */}
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="relative w-full md:w-1/3 overflow-hidden group disabled:opacity-50"
                                >
                                    {/* Layer A: Base White State */}
                                    <span className="absolute inset-0 bg-white z-10"></span>

                                    {/* Layer B: Golden Gradient State (Fades in) */}
                                    <span
                                        ref={goldButtonLayerRef}
                                        className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 z-20 opacity-0"
                                    ></span>

                                    {/* Button Text (Sits on top) */}
                                    <span className="relative z-30 block p-6 text-xl md:text-2xl font-black uppercase tracking-widest text-black group-hover:scale-105 transition-transform flex items-center justify-center h-full">
                                        {status === "loading" ? <Loader2 className="animate-spin" size={28} /> : "Initialize"}
                                    </span>
                                </button>
                            </form>
                        )}
                    </AnimatePresence>

                    {status === "error" && (
                        <p className="text-red-500 font-bold uppercase text-sm mt-6 text-center">{message}</p>
                    )}

                    {status !== "success" && (
                        <p className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">
                            Zero spam. Unsubscribe anytime.
                        </p>
                    )}

                </div>

            </div>
        </section>
    );
}
