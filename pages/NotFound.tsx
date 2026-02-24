import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, ScrollReveal } from '../components/UI';

const NotFound: React.FC = () => {
  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center relative overflow-hidden text-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <ScrollReveal className="relative z-10 text-center px-6">
        <h1 className="text-[120px] md:text-[240px] font-black leading-none tracking-tighter mix-blend-multiply opacity-90">
          <span className="text-black">404</span>
        </h1>

        <div className="h-2 w-24 bg-black mx-auto mb-8"></div>

        <h2 className="text-2xl md:text-3xl font-black text-neutral-400 mb-8 uppercase tracking-widest leading-tight">
          Page Not Found
        </h2>

        <p className="text-neutral-500 max-w-md mx-auto mb-12 font-medium text-lg">
          You've ventured into the void. This page doesn't exist, but we do.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <NavLink to="/">
            <Button variant="primary">Return Home</Button>
          </NavLink>
          <NavLink to="/events">
            <Button variant="outline">Find Events</Button>
          </NavLink>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default NotFound;