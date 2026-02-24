
import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Instagram, Linkedin, Github, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { subscribeToNewsletter } from '../lib/newsletter';

import { AnimatePresence, motion } from 'framer-motion';

// Custom Discord Icon SVG
const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

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
  // Professional Pill Style
  const baseStyle = "inline-flex items-center justify-center px-8 py-3 rounded-full font-manrope font-bold tracking-tight transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800 hover:scale-[1.02]",
    secondary: "bg-white text-black border border-neutral-200 hover:border-black hover:bg-neutral-50",
    outline: "bg-transparent text-black border border-neutral-300 hover:border-black hover:text-black",
    // RGB Professional style: Black button with subtle RGB gradient border feeling
    living: "relative overflow-hidden bg-black text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border border-transparent hover:border-white/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#FF0000] before:via-[#00FF00] before:to-[#0000FF] before:opacity-0 before:hover:opacity-20 before:transition-opacity"
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
    <section id={id} className={`py-32 md:py-40 px-6 md:px-12 lg:px-24 relative overflow-hidden ${themeClass} ${className}`}>
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
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <RouterNavLink to="/" className="flex items-center gap-2 group z-50">
          <span className="font-bold text-xl tracking-tight text-black group-hover:scale-105 transition-transform">
            The 404 Society
          </span>
        </RouterNavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 items-center">
          {NAV_LINKS.map((link) => (
            <RouterNavLink
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 ${isActive(link.path) ? 'text-[#4F46E5] font-bold' : 'text-neutral-600 hover:text-[#4F46E5]'}`}
            >
              {link.label}
            </RouterNavLink>
          ))}
          <RouterNavLink to="/community">
            <Button variant="primary" className="!px-6 !py-2 !text-xs !bg-[#4F46E5] hover:!bg-[#4338CA]">Join</Button>
          </RouterNavLink>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-black z-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-neutral-100 absolute w-full left-0 top-0 pt-24 pb-8 flex flex-col px-6 gap-6 shadow-xl"
          >
            {NAV_LINKS.map((link) => (
              <RouterNavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-xl font-medium ${isActive(link.path) ? 'text-[#4F46E5]' : 'text-neutral-600'}`}
              >
                {link.label}
              </RouterNavLink>
            ))}
            <RouterNavLink to="/community">
              <Button variant="primary" className="w-full">Join Community</Button>
            </RouterNavLink>
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
      className="bg-white text-black border-t border-neutral-100 py-10 md:py-20 px-6 relative overflow-hidden"
    >
      {/* Subtle Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4F46E5]/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">The 404 Society</span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-500">
            PESITM Campus, Shivamogga.<br />
            Innovation through chaos.
          </p>
          <div className="flex gap-2 text-neutral-400">
            <a href="https://discord.gg/the404society" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-[#5865F2] hover:-translate-y-1 transition-all p-2 rounded-full hover:bg-neutral-50">
              <DiscordIcon size={20} />
            </a>
            <a href="https://instagram.com/the404society" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#E1306C] hover:-translate-y-1 transition-all p-2 rounded-full hover:bg-neutral-50">
              <Instagram size={20} />
            </a>
            <a href="https://github.com/the404society" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-black hover:-translate-y-1 transition-all p-2 rounded-full hover:bg-neutral-50">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/company/the404society" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#0077B5] hover:-translate-y-1 transition-all p-2 rounded-full hover:bg-neutral-50">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#4F46E5]">Explore</h3>
          <ul className="space-y-3 text-sm text-neutral-600">
            {NAV_LINKS.slice(0, 4).map(link => (
              <li key={link.path}><RouterNavLink to={link.path} className="hover:text-black hover:pl-2 transition-all">{link.label}</RouterNavLink></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#10B981]">Contact</h3>
          <ul className="space-y-3 text-sm text-neutral-600">
            <li>B-Wing, 3rd Floor, PESITM</li>
            <li>Shivamogga, KA</li>
            <li><a href="mailto:hello@the404society.in" className="hover:text-[#4F46E5]">hello@the404society.in</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-black">Updates</h3>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="email@example.com"
                className="bg-neutral-50 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all placeholder:text-neutral-400 focus:bg-white shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading} className="bg-black text-white rounded-full px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#4F46E5] hover:shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Get Updates"}
              </button>
            </form>
          ) : (
            <div className="text-[#10B981] font-medium text-sm p-4 bg-[#10B981]/10 rounded-2xl animate-in fade-in flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              You're on the list.
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 md:mt-16 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-4 border-t border-neutral-100 pt-8">
        <span>© {new Date().getFullYear()} The 404 Society.</span>
        <span className="font-mono opacity-50">EST. 2025 // SHIVAMOGGA</span>
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

