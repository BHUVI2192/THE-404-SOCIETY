import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, GlitchText } from '../components/UI';

const NotFound: React.FC = () => {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="relative z-10 text-center px-6">
        <h1 className="text-[120px] md:text-[200px] font-black leading-none text-white tracking-tighter mix-blend-difference">
          <GlitchText text="404" />
        </h1>
        <div className="h-1 w-24 bg-white mx-auto mb-8"></div>
        <h2 className="text-2xl md:text-3xl font-mono text-neutral-400 mb-8 uppercase tracking-widest">
          System_Error: Location Unknown
        </h2>
        <p className="text-neutral-500 max-w-md mx-auto mb-12">
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
      </div>
    </div>
  );
};

export default NotFound;