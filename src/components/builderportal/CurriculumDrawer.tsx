import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Circle, 
  Play, 
  ExternalLink, 
  BookOpen, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  Check,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurriculumTopic, StageColor } from '../../types/curriculum';
import { TopicStatus } from '../../types/roadmap';

interface CurriculumDrawerProps {
  topic: CurriculumTopic | null;
  trackTitle: string;
  status: TopicStatus;
  onStatusChange: (status: TopicStatus) => void;
  onClose: () => void;
  onNextTopic?: () => void;
  onPrevTopic?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const COLOR_ACCENTS: Record<StageColor, {
  pill: string;
  badge: string;
  text: string;
  border: string;
}> = {
  amber: {
    pill: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    badge: 'bg-amber-500',
    text: 'text-amber-400',
    border: 'border-amber-500/40'
  },
  blue: {
    pill: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    badge: 'bg-blue-500',
    text: 'text-blue-400',
    border: 'border-blue-500/40'
  },
  emerald: {
    pill: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    badge: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40'
  },
  purple: {
    pill: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    badge: 'bg-purple-500',
    text: 'text-purple-400',
    border: 'border-purple-500/40'
  },
  rose: {
    pill: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    badge: 'bg-rose-500',
    text: 'text-rose-400',
    border: 'border-rose-500/40'
  }
};

export const CurriculumDrawer: React.FC<CurriculumDrawerProps> = ({
  topic,
  trackTitle,
  status,
  onStatusChange,
  onClose,
  onNextTopic,
  onPrevTopic,
  hasNext,
  hasPrev,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'docs'>('all');
  const [copied, setCopied] = useState(false);

  // Close on ESC key or Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNextTopic) onNextTopic();
      if (e.key === 'ArrowLeft' && hasPrev && onPrevTopic) onPrevTopic();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNextTopic, onPrevTopic, hasNext, hasPrev]);

  if (!topic) return null;

  const colorTheme = COLOR_ACCENTS[topic.stageColor];
  const videoResources = topic.resources.filter(r => r.type === 'video');
  const docResources = topic.resources.filter(r => r.type === 'official' || r.type === 'article');
  const primaryVideo = videoResources.find(v => v.embedUrl);

  const handleStatusClick = (newStatus: TopicStatus) => {
    onStatusChange(newStatus);
    if (newStatus === 'completed') {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6']
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex justify-end font-geist">
        {/* Soft Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs pointer-events-auto"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-xl h-full bg-[#12131e] border-l border-neutral-800 shadow-2xl pointer-events-auto flex flex-col overflow-hidden z-10 text-neutral-100"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-neutral-800 bg-[#161726]">
            <div className="flex items-center justify-between gap-4 mb-3">
              {/* Stage & Track Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-geist-mono">
                <span className="text-neutral-400 font-semibold">{trackTitle}</span>
                <span className="text-neutral-600">/</span>
                <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] ${colorTheme.pill}`}>
                  {topic.stageName}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  title="Copy link"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Topic Title */}
            <h2 className="text-2xl font-bold tracking-tight text-white leading-tight mb-4 font-geist">
              {topic.title}
            </h2>

            {/* Clean Status Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0d0e17] rounded-xl w-fit font-geist-mono text-xs border border-neutral-800">
              <button
                onClick={() => handleStatusClick('unvisited')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  status === 'unvisited'
                    ? 'bg-neutral-800 text-white font-medium shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Circle size={12} />
                <span>To Learn</span>
              </button>

              <button
                onClick={() => handleStatusClick('in_progress')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  status === 'in_progress'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Clock size={12} />
                <span>In Progress</span>
              </button>

              <button
                onClick={() => handleStatusClick('completed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  status === 'completed'
                    ? 'bg-emerald-600 text-white font-medium shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <CheckCircle2 size={12} />
                <span>Completed</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description Card */}
            <div className="p-4 rounded-xl bg-[#171827] border border-neutral-800 text-sm leading-relaxed text-neutral-300 font-geist">
              {topic.description.split('\n\n').map((para, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Featured YouTube Video Embed */}
            {primaryVideo && primaryVideo.embedUrl && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-geist-mono uppercase tracking-wider text-neutral-400 font-semibold">
                    <Play size={13} className="text-red-400" />
                    <span>Video Tutorial</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-geist-mono truncate max-w-[240px]">
                    {primaryVideo.title}
                  </span>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-xl">
                  <iframe
                    src={primaryVideo.embedUrl}
                    title={primaryVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            {/* Curated Resources */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase font-geist-mono text-neutral-400 tracking-wider">
                  Curated Resources ({topic.resources.length})
                </h3>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 text-xs font-geist-mono">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'all'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {videoResources.length > 0 && (
                    <button
                      onClick={() => setActiveTab('videos')}
                      className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                        activeTab === 'videos'
                          ? 'bg-red-600 text-white font-semibold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Play size={10} />
                      Videos ({videoResources.length})
                    </button>
                  )}
                  {docResources.length > 0 && (
                    <button
                      onClick={() => setActiveTab('docs')}
                      className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                        activeTab === 'docs'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <BookOpen size={10} />
                      Docs ({docResources.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Resources List */}
              <div className="space-y-2">
                {topic.resources
                  .filter(r => {
                    if (activeTab === 'videos') return r.type === 'video';
                    if (activeTab === 'docs') return r.type === 'official' || r.type === 'article';
                    return true;
                  })
                  .map((res, i) => {
                    const isVideo = res.type === 'video';
                    return (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-800 bg-[#161826] hover:bg-[#1a1c2e] hover:border-neutral-700 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-lg shrink-0 ${
                            isVideo ? 'bg-red-950/60 text-red-400' : 'bg-blue-950/60 text-blue-400'
                          }`}>
                            {isVideo ? <Play size={14} /> : <BookOpen size={14} />}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-geist-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                              {res.type}
                            </span>
                            <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors truncate block">
                              {res.title}
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-neutral-500 group-hover:text-white shrink-0 transition-colors" />
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Drawer Footer with Step Traversal */}
          <div className="p-4 px-6 border-t border-neutral-800 bg-[#151624] flex items-center justify-between">
            <button
              onClick={onPrevTopic}
              disabled={!hasPrev}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold font-geist-mono transition-colors ${
                hasPrev
                  ? 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  : 'text-neutral-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <button
              onClick={onNextTopic}
              disabled={!hasNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-geist-mono transition-colors ${
                hasNext
                  ? 'bg-white hover:bg-neutral-200 text-black shadow-md'
                  : 'text-neutral-600 cursor-not-allowed'
              }`}
            >
              <span>Next Topic</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CurriculumDrawer;

