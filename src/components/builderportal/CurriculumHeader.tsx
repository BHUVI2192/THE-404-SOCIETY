import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  Layers, 
  List, 
  Network, 
  X, 
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CurriculumManifestItem } from '../../types/curriculum';

interface CurriculumHeaderProps {
  currentSlug: string;
  trackTitle: string;
  manifest: CurriculumManifestItem[];
  onSelectTrack: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  completedCount: number;
  totalTopics: number;
  viewMode: 'canvas' | 'list';
  onViewModeChange: (mode: 'canvas' | 'list') => void;
}

export const CurriculumHeader: React.FC<CurriculumHeaderProps> = ({
  currentSlug,
  trackTitle,
  manifest,
  onSelectTrack,
  searchQuery,
  onSearchChange,
  completedCount,
  totalTopics,
  viewMode,
  onViewModeChange
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const percent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <>
      <header className="h-16 px-4 md:px-6 bg-[#0e0f18] border-b border-neutral-800 flex items-center justify-between gap-4 font-geist relative z-30 shrink-0 text-white select-none">
        {/* Left: 404 Society Brand & Return */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            title="Return to The 404 Society"
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>

          {/* Clean 404 Society Builder Portal Typography (No YouDecide logo) */}
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-white text-black font-geist-mono font-bold text-xs tracking-wider">
              404
            </span>
            <span className="font-bold tracking-tight text-white text-sm md:text-base hidden sm:inline">
              BUILDER PORTAL
            </span>
          </div>

          <div className="h-4 w-[1px] bg-neutral-800 mx-1 hidden sm:block" />

          {/* Track Selector Pill Button */}
          <button
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-neutral-600 bg-[#161725] hover:bg-[#1a1b2d] transition-all text-xs font-semibold text-neutral-200 group"
          >
            <Layers size={14} className="text-blue-400" />
            <span className="max-w-[130px] md:max-w-[200px] truncate">{trackTitle}</span>
            <ChevronDown size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Center: Search Filter */}
        <div className="flex-1 max-w-xs md:max-w-md hidden md:block">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search topics (e.g. React, Docker, SQL, APIs)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#141522] border border-neutral-800 focus:border-blue-500 text-xs font-geist text-white outline-none transition-all placeholder:text-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Progress & View Controls */}
        <div className="flex items-center gap-3">
          {/* Progress Bar */}
          <div className="hidden lg:flex items-center gap-3 font-geist-mono text-xs">
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">Mastery</span>
              <div className="font-semibold text-neutral-200">
                {percent}% <span className="text-neutral-500 font-normal">({completedCount}/{totalTopics})</span>
              </div>
            </div>
            <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700/60">
              <div
                className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* View Mode Toggle: Flowchart Canvas vs List */}
          <div className="flex items-center p-1 bg-[#141522] rounded-xl border border-neutral-800">
            <button
              onClick={() => onViewModeChange('canvas')}
              title="Interactive Flowchart Canvas"
              className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'canvas'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Network size={14} />
              <span className="hidden sm:inline">Flowchart</span>
            </button>

            <button
              onClick={() => onViewModeChange('list')}
              title="Sequential Curriculum List"
              className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List size={14} />
              <span className="hidden sm:inline">Curriculum</span>
            </button>
          </div>
        </div>
      </header>

      {/* TRACK PICKER MODAL */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm font-geist">
          <div className="bg-[#12131e] w-full max-w-2xl max-h-[85vh] rounded-2xl border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-[#151624]">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Select Engineering Track
                </h3>
                <p className="text-xs text-neutral-400 font-geist-mono mt-0.5">
                  Organized by milestones, video lessons, and official documentation
                </p>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tracks Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {manifest.map((item) => {
                const isSelected = item.slug === currentSlug;
                return (
                  <button
                    key={item.slug}
                    onClick={() => {
                      onSelectTrack(item.slug);
                      setIsPickerOpen(false);
                    }}
                    className={`text-left p-4 rounded-xl border transition-all flex items-start justify-between group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/20 shadow-md ring-1 ring-blue-500/30'
                        : 'border-neutral-800 bg-[#161726] hover:border-neutral-700 hover:bg-[#191b2c]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-geist-mono uppercase tracking-wider text-blue-400 font-bold">
                          {item.badge}
                        </span>
                        <span className="text-neutral-600 text-xs">•</span>
                        <span className="text-xs font-geist-mono text-neutral-500">
                          {item.stageCount} Phases
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CurriculumHeader;

