
import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Instagram, Linkedin, ArrowRight, ChevronRight, Lock } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import Chatbot from './Chatbot';
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
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
);

// --- ATOMS ---

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  to?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}> = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled }) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 transform active:scale-95";
  
  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 border border-white",
    secondary: "bg-black text-white border border-white hover:bg-white hover:text-black",
    outline: "bg-transparent text-white border border-neutral-700 hover:border-white hover:text-white"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}`}
    >
      {children}
    </button>
  );
};

export const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  return (
    <span className={`glitch-wrapper font-bold ${className}`} data-text={text}>
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

export const Section: React.FC<{
  children: React.ReactNode;
  theme?: 'dark' | 'light';
  className?: string;
  id?: string;
}> = ({ children, theme = 'dark', className = '', id }) => {
  const themeClass = theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black';
  return (
    <section id={id} className={`py-20 px-6 md:px-12 lg:px-24 ${themeClass} ${className}`}>
      <div className="max-w-7xl mx-auto">
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <RouterNavLink to="/" className="flex items-center gap-2 group">
          <img src="logo.png" alt="404 Logo" className="w-auto h-8 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-bold text-xl tracking-tighter text-white">
            THE <span className="text-neutral-400">404</span> SOCIETY
          </span>
        </RouterNavLink>

        <nav className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <RouterNavLink
              key={link.path}
              to={link.path}
              className={`text-sm font-mono uppercase tracking-widest hover:text-white transition-colors ${isActive(link.path) ? 'text-white border-b-2 border-white' : 'text-neutral-500'}`}
            >
              {link.label}
            </RouterNavLink>
          ))}
        </nav>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black border-b border-neutral-800 absolute w-full left-0 top-16 flex flex-col p-6 gap-4">
          {NAV_LINKS.map((link) => (
            <RouterNavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-mono uppercase ${isActive(link.path) ? 'text-white pl-4 border-l-4 border-white' : 'text-neutral-500'}`}
            >
              {link.label}
            </RouterNavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-neutral-400 border-t border-neutral-900 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <img src="logo.png" alt="404 Logo" className="w-auto h-6 object-contain" />
            <span className="text-white font-bold text-lg">THE 404 SOCIETY</span>
          </div>
          <p className="text-sm">
            We are a student-driven community exploring the glitchy, messy, and beautiful world of technology.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors" title="Instagram"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white transition-colors" title="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-white transition-colors" title="Discord"><DiscordIcon size={20} /></a>
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4 font-mono uppercase">Navigate</h3>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.slice(0, 4).map(link => (
              <li key={link.path}><RouterNavLink to={link.path} className="hover:text-white transition-colors">{link.label}</RouterNavLink></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4 font-mono uppercase">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>404 Workspace 3rd Floor, B-Wing</li>
            <li>P E S Campus, Shivamogga</li>
            <li><a href="mailto:connect@the404society.in" className="hover:text-white font-mono">connect@the404society.in</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4 font-mono uppercase">Stay Updated</h3>
          <p className="text-sm mb-4">Get the latest updates on events and workshops.</p>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-neutral-900 border border-neutral-800 text-white p-3 text-sm focus:border-white outline-none transition-colors w-full placeholder:text-neutral-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="bg-white text-black font-bold uppercase text-xs py-3 hover:bg-neutral-200 transition-colors w-full">
                Subscribe
              </button>
            </form>
          ) : (
            <div className="text-white font-mono text-sm border border-neutral-800 bg-neutral-900 p-4 text-center animate-in fade-in duration-300">
              <span className="text-green-500 mr-2">✓</span> Subscribed successfully.
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-900 text-xs text-center font-mono">
        © {new Date().getFullYear()} THE 404 SOCIETY. ALL RIGHTS RESERVED. SYSTEM NORMAL.
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow mt-16 relative">
        {children || (
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

// --- CARDS ---

export const EventCard: React.FC<{ 
  id: string;
  title: string; 
  date: string; 
  category: string; 
  image?: string;
  isPast?: boolean;
  registrationStatus?: 'open' | 'locked';
}> = ({ id, title, date, category, image, isPast, registrationStatus = 'open' }) => {
  const isLocked = registrationStatus === 'locked';

  return (
    <div className={`group border ${isPast ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-700 bg-black'} overflow-hidden hover:border-white transition-all duration-300 h-full flex flex-col`}>
      {image && !isPast && (
        <div className="h-48 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 relative">
          <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
          {isLocked && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Lock className="text-white" size={32} />
            </div>
          )}
        </div>
      )}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-mono uppercase border border-neutral-600 px-2 py-1 rounded-sm">{category}</span>
          <span className="text-xs text-neutral-400 font-mono">{date}</span>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isPast ? 'text-neutral-400' : 'text-white'}`}>{title}</h3>
        {!isPast && (
          <RouterNavLink 
            to={`/register-event/${id}`}
            className="mt-auto pt-6 flex items-center text-sm font-bold uppercase tracking-wider text-white hover:text-neutral-300 group-hover:translate-x-2 transition-all"
          >
            {isLocked ? (
              <>Check Status <ArrowRight size={16} className="ml-2" /></>
            ) : (
              <>Register <ArrowRight size={16} className="ml-2" /></>
            )}
          </RouterNavLink>
        )}
      </div>
    </div>
  );
};
