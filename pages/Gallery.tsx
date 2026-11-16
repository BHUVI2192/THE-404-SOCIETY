import React from 'react';
import { Section } from '../components/UI';
import { GALLERY_ITEMS } from '../constants';

const Gallery: React.FC = () => {
  return (
    <Section theme="light" className="pt-24 sm:pt-32 min-h-screen">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-12 text-center">GALLERY</h1>
      
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
        {GALLERY_ITEMS.map((item) => (
           <div key={item.id} className="break-inside-avoid relative group overflow-hidden rounded-lg sm:rounded-xl touch-manipulation">
             <img 
               src={item.src} 
               alt={item.caption} 
               className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 touch-manipulation" 
               loading="lazy"
             />
             <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <span className="text-white font-mono text-xs sm:text-sm uppercase tracking-widest border border-white px-2 sm:px-3 py-1 text-center leading-tight">
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