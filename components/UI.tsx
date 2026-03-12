
import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { subscribeToNewsletter } from '../lib/newsletter';
import { SocialDock } from './SocialDock';

import { AnimatePresence, motion } from 'framer-motion';

// --- ATOMS ---

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'living';
  className?: string;
  onClick?: () => void;
  to?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}> = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled }) => {
  // Professional Pill Style with enhanced mobile touch targets
  const baseStyle = "inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3 min-h-[44px] rounded-full font-manrope font-bold tracking-tight transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation";

  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800 active:scale-[0.98] hover:scale-[1.02]",
    secondary: "bg-white text-black border border-neutral-200 hover:border-black hover:bg-neutral-50 active:scale-[0.98]",
    outline: "bg-transparent text-black border border-neutral-300 hover:border-black hover:text-black active:scale-[0.98]",
    // RGB Professional style: Black button with subtle RGB gradient border feeling
    living: "relative overflow-hidden bg-black text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-white/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#FF0000] before:via-[#00FF00] before:to-[#0000FF] before:opacity-0 before:hover:opacity-20 before:transition-opacity"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  // Removed glitch effect for professional clean look
  return (
    <span className={`font-black tracking-tighter ${className}`}>
      {text}
    </span>
  );
};

export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}> = ({ children, className = "", hoverEffect = true }) => {
  return (
    <div className={`backdrop-blur-md bg-white/60 border border-white/50 rounded-3xl p-8 shadow-sm transition-all duration-300 ${hoverEffect ? 'hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#4F46E5]/20' : ''} ${className}`}>
      {children}
    </div>
  );
};

export const Section: React.FC<{
  children: React.ReactNode;
  theme?: 'dark' | 'light';
  className?: string;
  id?: string;
}> = ({ children, theme = 'light', className = '', id }) => {
  // Defaulting to light/white theme for Antigravity
  const themeClass = theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black';
  return (
    <section id={id} className={`py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden ${themeClass} ${className}`}>
      <div className="max-w-[1400px] mx-auto relative z-10">
        {children}
      </div>
    </section>
  );
};

// --- LAYOUT ---

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-20 flex items-center justify-between">
        <RouterNavLink to="/" className="flex items-center gap-2 group z-50">
          <span className="font-bold text-sm sm:text-lg md:text-xl tracking-tight text-black group-hover:scale-105 transition-transform whitespace-nowrap">
            The 404 Society
          </span>
        </RouterNavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 lg:gap-10 items-center">
          {NAV_LINKS.map((link) => (
            <RouterNavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `text-xs sm:text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 ${isActive ? 'text-[#4F46E5] font-bold border-b-2 border-[#4F46E5] pb-1' : 'text-neutral-600 hover:text-[#4F46E5]'}`}
            >
              {link.label}
            </RouterNavLink>
          ))}
          <RouterNavLink to="/join">
            <Button variant="primary" className="!px-4 md:!px-6 !py-2 !text-xs !bg-[#4F46E5] hover:!bg-[#4338CA]">Join</Button>
          </RouterNavLink>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-black z-[60] relative p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-neutral-100 shadow-lg"
          >
            <div className="flex flex-col gap-2 sm:gap-4 px-4 sm:px-6 py-4 sm:py-6 max-h-[calc(100vh-80px)] overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <RouterNavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `text-lg sm:text-xl font-bold tracking-tight transition-colors py-3 px-2 rounded-lg touch-manipulation ${isActive ? 'text-[#4F46E5] bg-[#4F46E5]/5' : 'text-black hover:text-[#4F46E5] hover:bg-neutral-50 active:bg-neutral-100'}`}
                >
                  {link.label}
                </RouterNavLink>
              ))}
              <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-neutral-100">
                <RouterNavLink to="/join" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full text-sm sm:text-base py-3 min-h-[48px]">Join Community</Button>
                </RouterNavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      try {
        await subscribeToNewsletter(email, '');
        setSubscribed(true);
        setEmail('');
      } catch (err) {
        console.error("Failed to subscribe:", err);
      }
      setLoading(false);
    }
  };

  return (

    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-neutral-50 text-black border-t border-neutral-200 py-16 md:py-24 px-6 relative overflow-hidden shadow-[0_-8px_30px_rgb(0,0,0,0.02)]"
      style={{ zIndex: 50, position: 'relative' }}
    >
      {/* Structural Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4F46E5]/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">The 404 Society</span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-500">
            PESITM Campus, Shivamogga.<br />
            Innovation through chaos.
          </p>
          <div style={{ pointerEvents: 'auto', zIndex: 51 }}>
            <SocialDock />
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#4F46E5]">Explore</h3>
          <ul className="space-y-3 text-sm text-neutral-600">
            {NAV_LINKS.slice(0, 5).map(link => (
              <li key={link.path}><RouterNavLink to={link.path} className="hover:text-black hover:pl-2 transition-all touch-manipulation" style={{ pointerEvents: 'auto', zIndex: 51 }}>{link.label}</RouterNavLink></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#10B981]">Contact</h3>
          <ul className="space-y-3 text-sm text-neutral-600">
            <li>B-Wing, 3rd Floor, PESITM</li>
            <li>Shivamogga, KA</li>
            <li><a href="mailto:connect@the404society.in" className="hover:text-[#4F46E5] touch-manipulation" style={{ pointerEvents: 'auto', zIndex: 51 }}>connect@the404society.in</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-black">Updates</h3>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-white border border-neutral-200 rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5]/30 outline-none transition-all placeholder:text-neutral-400 shadow-sm group-hover:border-neutral-300 touch-manipulation"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ pointerEvents: 'auto', zIndex: 51 }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white rounded-full px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#4F46E5] hover:shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center touch-manipulation"
                style={{ pointerEvents: 'auto', zIndex: 51 }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Subscribe"}
              </button>
            </form>
          ) : (
            <div className="text-[#10B981] font-semibold text-sm p-4 bg-white border border-[#10B981]/10 rounded-2xl animate-in zoom-in-95 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              Welcome to the society.
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 md:mt-24 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-neutral-400 gap-4 border-t border-neutral-200 pt-10">
        <div className="flex items-center gap-6">
          <span>© {new Date().getFullYear()} The 404 Society. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 font-mono opacity-60">
          <span>SECURED BY DESIGN</span>
          <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
          <span>EST. 2025 // SHIVAMOGGA</span>
        </div>
      </div>
    </motion.footer>

  );
};

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-[#4F46E5] selection:text-white">
      <Header />
      <main className="flex-grow mt-20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

// --- CARDS ---

// Simplified "Strip" Event Card for Antigravity Theme
export const EventCard: React.FC<{
  id: string;
  title: string;
  date: string;
  category: string;
  image?: string;
  isPast?: boolean;
  registrationStatus?: 'open' | 'locked';
}> = ({ id, title, date, category, image, isPast, registrationStatus = 'open' }) => {
  // This component might be less used in the new homepage but kept for other pages
  // Updating to match the white theme

  return (
    <div className={`group relative bg-white border border-neutral-200 rounded-3xl overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 h-full flex flex-col`}>
      {image && (
        <div className="h-56 overflow-hidden relative">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black">
            {category}
          </span>
        </div>
      )}
      <div className="p-8 flex-grow flex flex-col">
        <div className="mb-4 text-sm text-[#4F46E5] font-medium">{date}</div>
        <h3 className="text-2xl font-bold mb-3 text-black leading-tight group-hover:text-[#4F46E5] transition-colors">{title}</h3>

        {!isPast && (
          <RouterNavLink
            to={`/register-event/${id}`}
            className="mt-auto inline-flex items-center text-sm font-bold uppercase tracking-wider text-neutral-500 group-hover:text-black transition-all"
          >
            Details <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </RouterNavLink>
        )}
      </div>
    </div>
  );
};

