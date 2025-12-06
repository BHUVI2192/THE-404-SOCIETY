import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Twitter, ArrowRight, ChevronRight, Terminal } from 'lucide-react';
import { NAV_LINKS } from '../constants';

// --- ATOMS ---

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  to?: string;
  type?: "button" | "submit" | "reset";
}> = ({ children, variant = 'primary', className = '', onClick, type = 'button' }) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 transform active:scale-95";
  
  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 border border-white",
    secondary: "bg-black text-white border border-white hover:bg-white hover:text-black",
    outline: "bg-transparent text-white border border-neutral-700 hover:border-white hover:text-white"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
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
        {/* Logo */}
        <RouterNavLink to="/" className="flex items-center gap-2 group">
          <Terminal size={24} className="text-white group-hover:text-neutral-400 transition-colors" />
          <span className="font-bold text-xl tracking-tighter text-white">
            THE <span className="text-neutral-400">404</span> SOCIETY
          </span>
        </RouterNavLink>

        {/* Desktop Nav */}
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

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
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
  return (
    <footer className="bg-black text-neutral-400 border-t border-neutral-900 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-white font-bold text-lg mb-4">THE 404 SOCIETY</h2>
          <p className="max-w-sm text-sm mb-6">
            We are a student-driven community exploring the glitchy, messy, and beautiful world of technology.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
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
            <li>Student Center, Room 404</li>
            <li>University Campus</li>
            <li><a href="mailto:hello@404society.edu" className="hover:text-white">hello@404society.edu</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-900 text-xs text-center font-mono">
        © {new Date().getFullYear()} THE 404 SOCIETY. ALL RIGHTS RESERVED. SYSTEM NORMAL.
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// --- CARDS ---

export const EventCard: React.FC<{ 
  title: string; 
  date: string; 
  category: string; 
  image?: string;
  isPast?: boolean;
}> = ({ title, date, category, image, isPast }) => {
  return (
    <div className={`group border ${isPast ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-700 bg-black'} overflow-hidden hover:border-white transition-all duration-300`}>
      {image && !isPast && (
        <div className="h-48 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
          <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-mono uppercase border border-neutral-600 px-2 py-1 rounded-sm">{category}</span>
          <span className="text-xs text-neutral-400 font-mono">{date}</span>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isPast ? 'text-neutral-400' : 'text-white'}`}>{title}</h3>
        {!isPast && (
          <div className="mt-4 flex items-center text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
            Register <ArrowRight size={16} className="ml-2" />
          </div>
        )}
      </div>
    </div>
  );
};
