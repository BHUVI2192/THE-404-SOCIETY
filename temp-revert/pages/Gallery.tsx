
import React, { useState, useMemo } from 'react';
import { ScrollReveal, Section, Button } from '../components/UI';
import { GALLERY_ITEMS } from '../constants';
import { X, Maximize2, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ITEMS_PER_PAGE = 9;
const CATEGORIES = ['All', 'Workshops', 'Hackathons', 'Projects', 'Socials'];

const Gallery: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_ITEMS[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // Items currently being displayed
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate a brief load for effect
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 600);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE); // Reset visible count on filter change
  };

  return (
    <Section theme="dark" className="pt-32 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <ScrollReveal className="flex-1">
          <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">ASSET_REPOSITORY</h1>
          <p className="text-neutral-400 max-w-xl text-lg font-light leading-relaxed">
            A chronological sequence of our operational highlights. Filtering protocols enabled for specific log retrieval.
          </p>
        </ScrollReveal>

        {/* Filter Controls */}
        <ScrollReveal delay={0.2} className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                activeCategory === cat 
                  ? 'bg-white text-black border-white font-bold' 
                  : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </ScrollReveal>
      </div>

      {/* Stats Header */}
      <div className="flex items-center gap-4 mb-8 border-l-2 border-white pl-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-neutral-600 uppercase">Total_Assets</span>
          <span className="text-white font-bold">{filteredItems.length}</span>
        </div>
        <div className="w-px h-8 bg-neutral-800"></div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-neutral-600 uppercase">Viewing</span>
          <span className="text-white font-bold">{visibleItems.length}</span>
        </div>
      </div>

      {/* Responsive Grid Layout */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group relative aspect-[4/3] overflow-hidden border border-neutral-800 cursor-pointer bg-neutral-900"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image with grayscale to color transition */}
              <img 
                src={item.src} 
                alt={item.caption} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105" 
                loading="lazy"
              />
              
              {/* Category Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-neutral-700 text-[8px] font-mono text-white uppercase tracking-tighter">
                  {item.category || 'EVENT'}
                </span>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <Maximize2 size={16} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Enlarge Log</span>
                </div>
                <p className="text-white font-bold text-lg leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">{item.caption}</p>
                <p className="text-neutral-400 font-mono text-[10px] uppercase tracking-widest mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform delay-100">SEQ_REF: {item.id}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-16 flex flex-col items-center gap-4">
          <Button 
            variant="outline" 
            className="group min-w-[240px]" 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-3">
                <Loader2 size={18} className="animate-spin" /> RETRIEVING_DATA...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                LOAD_MORE_ASSETS <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
              </span>
            )}
          </Button>
          <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            {filteredItems.length - visibleCount} assets remaining in sequence
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-[110]"
              onClick={() => setSelectedItem(null)}
            >
              <X size={32} />
            </button>

            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-5xl w-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative group">
                <img 
                  src={selectedItem.src} 
                  alt={selectedItem.caption} 
                  className="w-full h-auto max-h-[70vh] object-contain shadow-2xl border border-neutral-800" 
                />
              </div>
              
              <div className="mt-8 border-l-4 border-white pl-6">
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-2 py-0.5 bg-white text-black text-[10px] font-mono font-bold uppercase">
                     {selectedItem.category || 'EVENT'}
                   </span>
                   <span className="text-[10px] font-mono text-neutral-500 uppercase">LOG_ARCHIVE_VERIFIED</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedItem.caption}</h3>
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Reference ID</span>
                    <span className="text-sm font-mono text-white">{selectedItem.id}</span>
                  </div>
                  <div className="flex flex-col border-l border-neutral-800 pl-4">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Asset_Type</span>
                    <span className="text-sm font-mono text-white uppercase">{selectedItem.type}</span>
                  </div>
                  <div className="flex flex-col border-l border-neutral-800 pl-4">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Encryption</span>
                    <span className="text-sm font-mono text-green-500 uppercase">None_Public</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Spacing / Subtle Decoration */}
      <div className="mt-24 pt-8 border-t border-neutral-900 flex justify-between items-center text-[10px] font-mono text-neutral-600 uppercase tracking-[0.2em]">
        <span>End of Gallery Sequence</span>
        <span className="hidden md:block">Registry Status: Synchronized // Port: 404</span>
      </div>
    </Section>
  );
};

export default Gallery;
