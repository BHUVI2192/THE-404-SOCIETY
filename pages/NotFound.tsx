import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Terminal, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/UI';

const NotFound: React.FC = () => {
  const [glitchText, setGlitchText] = useState('404');

  // Simulate a mild glitch effect on the text occasionally
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let newText = '';
        for (let i = 0; i < 3; i++) {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
        setGlitchText(newText);
        setTimeout(() => setGlitchText('404'), 150);
      }
    }, 1000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Helmet>
        <title>404 - Signal Lost | The 404 Society</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'linear-gradient(to bottom, transparent 50%, rgba(255, 255, 255, 1) 51%)',
          backgroundSize: '100% 4px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* 404 Glitch Element */}
        <div className="mb-8 relative inline-block">
          <motion.div
            animate={{ x: [-2, 2, -1, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            className="text-[120px] md:text-[200px] font-black tracking-tighter leading-none text-transparent"
            style={{
              WebkitTextStroke: '2px white',
              fontFamily: "'Space Mono', monospace"
            }}
          >
            {glitchText}
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-red-500 opacity-50 mix-blend-screen" />
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">
            Signal <span className="text-red-500 line-through">Lost</span>
          </h1>
          <p className="text-neutral-400 font-mono text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            The transmission you are looking for has been purged from our archives or never existed in this timeline.
          </p>
          <div className="flex flex-col items-center gap-2 text-xs font-mono text-neutral-600 uppercase tracking-widest mt-4">
            <span className="flex items-center gap-2"><Terminal size={12} /> ERR_CONNECTION_REFUSED</span>
            <span>TARGET: UNKNOWN_NODE</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NavLink to="/">
            <Button variant="primary" className="!bg-white !text-black hover:!bg-neutral-200 flex items-center gap-2 h-12 px-8">
              <Home size={18} />
              Establish Connection
            </Button>
          </NavLink>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors h-12 px-8 border border-neutral-800 hover:border-neutral-600 rounded-none bg-transparent"
          >
            <ArrowLeft size={18} />
            Retreat
          </button>
        </div>
      </motion.div>

      {/* Random binary background elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 4, delay: i * 0.7, repeat: Infinity }}
          className="absolute font-mono text-xs text-neutral-800 pointer-events-none select-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `translate(-50%, -50%) rotate(${Math.random() > 0.5 ? 90 : 0}deg)`
          }}
        >
          {Math.random() > 0.5 ? '01000100' : '01000101'}
        </motion.div>
      ))}
    </div>
  );
};

export default NotFound;