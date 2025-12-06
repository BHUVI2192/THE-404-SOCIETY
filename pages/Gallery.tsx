import React from 'react';
import { Section } from '../components/UI';
import { GALLERY_ITEMS } from '../constants';

const Gallery: React.FC = () => {
  return (
    <Section theme="light" className="pt-32 min-h-screen">
      <h1 className="text-5xl font-black mb-12 text-center">GALLERY</h1>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {GALLERY_ITEMS.map((item) => (
           <div key={item.id} className="break-inside-avoid relative group overflow-hidden">
             <img 
               src={item.src} 
               alt={item.caption} 
               className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" 
             />
             <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-mono text-sm uppercase tracking-widest border border-white px-3 py-1">
                  {item.caption}
                </span>
             </div>
           </div>
        ))}
      </div>
    </Section>
  );
};

export default Gallery;