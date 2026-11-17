import React from 'react';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ProCountdown } from '../components/CountDown';
import { AnimatedLiquidBackground } from '../components/admin/AnimatedLiquidBackground';
import { ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';

export const YouDecideStudio: React.FC = () => {
  // Target: 25th Nov 2026 00:00:00 IST
  const targetDate = "2026-11-25T00:00:00";

  return (
    <>
      <Helmet>
        <title>youdecide.studio | The 404 Society</title>
        <meta
          name="description"
          content="The official countdown to youdecide.studio by The 404 Society. Launching November 25, 2026."
        />
        <meta property="og:title" content="youdecide.studio | The 404 Society" />
        <meta
          property="og:description"
          content="Something extraordinary is arriving on November 25, 2026."
        />
      </Helmet>

      <div
        className="min-h-screen relative flex flex-col justify-between p-6 sm:p-12 overflow-hidden selection:bg-black selection:text-white"
        style={{
          fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
          color: '#09090b',
        }}
      >
        {/* Ambient Blue and White Liquid WebGL Shader Background */}
        <AnimatedLiquidBackground
          color1="#0c2340"
          color2="#38bdf8"
          color3="#ffffff"
          speed={0.8}
          scale={0.015}
          swirl={0.55}
          swirlIterations={14}
          softness={0.52}
          opacity={0.88}
        />

        {/* Subtle ambient light gradient mesh */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.7) 0%, transparent 65%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)',
            zIndex: 1,
          }}
        />

        {/* Top Header */}
        <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between pt-2">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-black/10 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>The 404 Society</span>
          </NavLink>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-black/10 font-mono text-xs font-bold tracking-wider text-black">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>NOV 25, 2026</span>
          </div>
        </header>

        {/* Centerpiece Hero Container */}
        <main className="relative z-10 w-full max-w-4xl mx-auto my-auto py-12 flex flex-col items-center text-center">
          
          {/* Studio Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-mono text-[11px] font-bold tracking-[2px] uppercase text-zinc-700">
              youdecide.studio // Initiative
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-[0.95] mb-6">
            The Countdown
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-800 to-sky-700">
              Has Begun.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 max-w-2xl font-medium mb-12 sm:mb-16 leading-relaxed">
            A new frontier of collaboration, design, and engineering is coming to life.
            Mark your calendar for November 25, 2026.
          </p>

          {/* Frosted Glass Countdown Card */}
          <div
            className="w-full max-w-3xl rounded-3xl p-8 sm:p-12 border border-black/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.04)]"
            style={{
              background: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            }}
          >
            <ProCountdown
              targetDate={targetDate}
              tint="#000000"
              labelColor="#52525b"
              fontSize={54}
              gap={24}
              showSeparators={true}
              fontFamily="Space Mono"
            />
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <NavLink
              to="/join"
              className="px-7 py-3.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <span>Join The 404 Society</span>
              <ExternalLink className="w-4 h-4" />
            </NavLink>

            <NavLink
              to="/events"
              className="px-7 py-3.5 rounded-xl bg-white/80 backdrop-blur-md text-black font-semibold text-sm border border-black/10 hover:bg-white transition-all shadow-sm hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <span>Explore Upcoming Events</span>
            </NavLink>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/5 text-xs text-zinc-500 font-mono">
          <div>© 2026 The 404 Society. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>PESITM Shivamogga</span>
            <span>•</span>
            <span className="text-black font-bold">youdecide.studio</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default YouDecideStudio;

