import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Clock, 
  Circle, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CurriculumStage, CurriculumTopic, StageColor } from '../../types/curriculum';
import { TopicStatus } from '../../types/roadmap';

interface CurriculumCanvasProps {
  stages: CurriculumStage[];
  selectedTopicId: string | null;
  onSelectTopic: (topic: CurriculumTopic) => void;
  topicStatuses: Record<string, TopicStatus>;
  searchQuery: string;
}

const STAGE_THEMES: Record<StageColor, {
  badge: string;
  pill: string;
  accent: string;
  bar: string;
  cardBorder: string;
  cardActive: string;
  glow: string;
  stroke: string;
}> = {
  amber: {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    pill: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    accent: '#D97706',
    bar: 'bg-amber-500',
    cardBorder: 'border-amber-200/80 dark:border-amber-900/40 hover:border-amber-500/80',
    cardActive: 'border-amber-500 ring-4 ring-amber-500/15 dark:ring-amber-500/25',
    glow: 'rgba(217, 119, 6, 0.15)',
    stroke: '#D97706'
  },
  blue: {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    pill: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    accent: '#2563EB',
    bar: 'bg-blue-600',
    cardBorder: 'border-blue-200/80 dark:border-blue-900/40 hover:border-blue-500/80',
    cardActive: 'border-blue-600 ring-4 ring-blue-600/15 dark:ring-blue-600/25',
    glow: 'rgba(37, 99, 235, 0.15)',
    stroke: '#2563EB'
  },
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    pill: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    accent: '#059669',
    bar: 'bg-emerald-600',
    cardBorder: 'border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-500/80',
    cardActive: 'border-emerald-600 ring-4 ring-emerald-600/15 dark:ring-emerald-600/25',
    glow: 'rgba(5, 150, 105, 0.15)',
    stroke: '#059669'
  },
  purple: {
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30',
    pill: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    accent: '#7C3AED',
    bar: 'bg-purple-600',
    cardBorder: 'border-purple-200/80 dark:border-purple-900/40 hover:border-purple-500/80',
    cardActive: 'border-purple-600 ring-4 ring-purple-600/15 dark:ring-purple-600/25',
    glow: 'rgba(124, 58, 237, 0.15)',
    stroke: '#7C3AED'
  },
  rose: {
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30',
    pill: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
    accent: '#E11D48',
    bar: 'bg-rose-600',
    cardBorder: 'border-rose-200/80 dark:border-rose-900/40 hover:border-rose-500/80',
    cardActive: 'border-rose-600 ring-4 ring-rose-600/15 dark:ring-rose-600/25',
    glow: 'rgba(225, 29, 72, 0.15)',
    stroke: '#E11D48'
  }
};

export const CurriculumCanvas: React.FC<CurriculumCanvasProps> = ({
  stages,
  selectedTopicId,
  onSelectTopic,
  topicStatuses,
  searchQuery
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas Viewport Pan & Zoom
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 60, y: 80 });
  const [zoom, setZoom] = useState<number>(0.9);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 60, y: 80 });

  // Stage dimensions & layout
  const STAGE_WIDTH = 340;
  const STAGE_GAP = 90;

  // Zoom controls
  const handleZoom = (factor: number, clientX?: number, clientY?: number) => {
    setZoom(prevZoom => {
      const nextZoom = Math.min(Math.max(prevZoom * factor, 0.35), 1.8);
      if (containerRef.current && clientX !== undefined && clientY !== undefined) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        setPan(prevPan => ({
          x: mouseX - (mouseX - prevPan.x) * (nextZoom / prevZoom),
          y: mouseY - (mouseY - prevPan.y) * (nextZoom / prevZoom)
        }));
      }
      return nextZoom;
    });
  };

  // Wheel zoom and pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      handleZoom(factor, e.clientX, e.clientY);
    } else {
      setPan(p => ({
        x: p.x - e.deltaX,
        y: p.y - e.deltaY
      }));
    }
  };

  // Drag Panning
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-topic-card')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Reset to initial stage
  const resetToStart = () => {
    setZoom(0.9);
    setPan({ x: 60, y: 80 });
  };

  // Jump to specific stage
  const jumpToStage = (stageIndex: number) => {
    if (!containerRef.current) return;
    const stageX = stageIndex * (STAGE_WIDTH + STAGE_GAP);
    const containerW = containerRef.current.clientWidth;
    setPan({
      x: containerW / 2 - (stageX + STAGE_WIDTH / 2) * zoom,
      y: 80
    });
  };

  // Fit all stages to view
  const fitToView = () => {
    if (!containerRef.current || stages.length === 0) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const totalW = stages.length * STAGE_WIDTH + (stages.length - 1) * STAGE_GAP;
    const scale = Math.min(Math.max((clientWidth - 120) / totalW, 0.4), 1.0);
    setZoom(scale);
    setPan({
      x: (clientWidth - totalW * scale) / 2,
      y: 80
    });
  };

  const query = searchQuery.trim().toLowerCase();

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full h-full overflow-hidden select-none bg-[#0a0a0f] text-neutral-100 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)`,
        backgroundSize: '28px 28px',
        backgroundPosition: `${pan.x % 28}px ${pan.y % 28}px`
      }}
    >
      {/* Top Floating Stage Jumper Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-[#12131d]/90 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-2xl font-geist-mono text-xs">
        <span className="text-[10px] uppercase font-bold text-neutral-400 px-2 tracking-wider">
          Milestones
        </span>
        <div className="w-[1px] h-4 bg-neutral-800 mx-0.5" />
        {stages.map((stage, idx) => {
          const theme = STAGE_THEMES[stage.color];
          const completedCount = stage.topics.filter(t => topicStatuses[t.id] === 'completed').length;
          const isAllDone = completedCount === stage.topics.length && stage.topics.length > 0;

          return (
            <button
              key={stage.id}
              onClick={() => jumpToStage(idx)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 text-xs hover:bg-neutral-800 ${
                isAllDone ? 'text-emerald-400' : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              <span>Phase {stage.phaseNumber}</span>
              <span className="text-[10px] text-neutral-500">
                ({completedCount}/{stage.topics.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating Canvas Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 p-1.5 bg-[#12131d]/90 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-2xl font-geist-mono text-xs">
        <button
          onClick={() => handleZoom(1.2)}
          title="Zoom In"
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <ZoomIn size={16} />
        </button>

        <span className="px-2 text-neutral-400 select-none text-[11px] font-medium min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => handleZoom(0.83)}
          title="Zoom Out"
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <ZoomOut size={16} />
        </button>

        <div className="w-[1px] h-4 bg-neutral-800 mx-0.5" />

        <button
          onClick={resetToStart}
          title="Reset to Start"
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw size={15} />
        </button>

        <button
          onClick={fitToView}
          title="Fit All Stages"
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Canvas Viewport Transformer */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {/* SVG Connecting Bridges between Stages */}
        <svg
          className="absolute overflow-visible pointer-events-none"
          style={{ left: 0, top: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <marker
              id="clean-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#404040" />
            </marker>
          </defs>

          {stages.map((stage, idx) => {
            if (idx === stages.length - 1) return null;
            const startX = idx * (STAGE_WIDTH + STAGE_GAP) + STAGE_WIDTH;
            const endX = (idx + 1) * (STAGE_WIDTH + STAGE_GAP);
            const startY = 180;
            const endY = 180;

            return (
              <g key={`bridge-${idx}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX - 8}
                  y2={endY}
                  stroke="#262626"
                  strokeWidth="2.5"
                  strokeDasharray="6,6"
                  markerEnd="url(#clean-arrow)"
                />
              </g>
            );
          })}
        </svg>

        {/* Stages Columns Layout */}
        <div className="absolute top-0 left-0 flex items-start pointer-events-none" style={{ gap: `${STAGE_GAP}px` }}>
          {stages.map((stage, stageIdx) => {
            const theme = STAGE_THEMES[stage.color];
            const completedInStage = stage.topics.filter(t => topicStatuses[t.id] === 'completed').length;
            const percentStage = stage.topics.length > 0 ? Math.round((completedInStage / stage.topics.length) * 100) : 0;

            return (
              <div
                key={stage.id}
                style={{ width: `${STAGE_WIDTH}px` }}
                className="flex flex-col shrink-0 pointer-events-auto select-none"
              >
                {/* Stage Pillar Header Card */}
                <div className="p-5 rounded-2xl bg-[#12131d] border border-neutral-800 shadow-xl relative overflow-hidden mb-5">
                  {/* Top Color Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.bar}`} />

                  {/* Stage Badge & Number */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-geist-mono font-bold tracking-wider uppercase ${theme.badge}`}>
                      Phase 0{stage.phaseNumber}
                    </span>
                    <span className="text-xs font-geist-mono text-neutral-400">
                      {completedInStage}/{stage.topics.length} Done ({percentStage}%)
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight mb-1 font-geist">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-geist line-clamp-2 leading-relaxed">
                    {stage.subtitle}
                  </p>

                  {/* Stage Progress Bar */}
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-3.5">
                    <div
                      className={`h-full ${theme.bar} transition-all duration-300 rounded-full`}
                      style={{ width: `${percentStage}%` }}
                    />
                  </div>
                </div>

                {/* Topics Stack Inside Stage */}
                <div className="flex flex-col gap-3.5">
                  {stage.topics.map((topic, topicIdx) => {
                    const isSelected = selectedTopicId === topic.id;
                    const status = topicStatuses[topic.id] || 'unvisited';
                    const videoCount = topic.resources.filter(r => r.type === 'video').length;
                    const docCount = topic.resources.filter(r => r.type === 'official' || r.type === 'article').length;

                    // Search filter matching
                    const isMatch = query
                      ? topic.title.toLowerCase().includes(query) ||
                        topic.tags.some(t => t.toLowerCase().includes(query))
                      : true;
                    const opacity = query && !isMatch ? 0.25 : 1;

                    return (
                      <div
                        key={topic.id}
                        onClick={() => onSelectTopic(topic)}
                        style={{ opacity }}
                        className={`interactive-topic-card cursor-pointer rounded-2xl p-4.5 transition-all duration-200 border relative overflow-hidden group bg-[#151622] ${
                          isSelected
                            ? theme.cardActive + ' shadow-xl -translate-y-0.5'
                            : query && isMatch
                            ? 'border-white ring-2 ring-white/20'
                            : theme.cardBorder + ' hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#181928]'
                        }`}
                      >
                        {/* Left Stage Accent Edge */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 opacity-70 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: theme.accent }}
                        />

                        {/* Card Header: Step & Status */}
                        <div className="flex items-center justify-between gap-2 mb-2 pl-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-geist-mono font-bold text-neutral-500 uppercase tracking-wider">
                              0{topic.order}
                            </span>
                            <span className="text-neutral-700">•</span>
                            <span className="text-[10px] font-geist-mono text-neutral-400">
                              {topic.tags[0] || 'Core'}
                            </span>
                          </div>

                          {/* Status Pill */}
                          <div className="flex items-center gap-1">
                            {status === 'completed' && (
                              <span className="flex items-center gap-1 text-[11px] font-geist-mono font-semibold text-emerald-400">
                                <CheckCircle2 size={13} className="text-emerald-400" />
                                <span>Done</span>
                              </span>
                            )}
                            {status === 'in_progress' && (
                              <span className="flex items-center gap-1 text-[11px] font-geist-mono font-semibold text-blue-400">
                                <Clock size={13} className="text-blue-400" />
                                <span>Doing</span>
                              </span>
                            )}
                            {status === 'unvisited' && (
                              <Circle size={12} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                            )}
                          </div>
                        </div>

                        {/* Topic Title */}
                        <h4 className="text-sm font-semibold text-white tracking-tight leading-snug pl-1 mb-2 group-hover:text-white transition-colors font-geist">
                          {topic.title}
                        </h4>

                        {/* Short Excerpt */}
                        <p className="text-xs text-neutral-400 font-geist line-clamp-2 pl-1 mb-3 leading-relaxed">
                          {topic.description}
                        </p>

                        {/* Card Footer: Badges & Open Action */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 pl-1">
                          <div className="flex items-center gap-1.5">
                            {videoCount > 0 && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-geist-mono font-medium bg-red-950/60 text-red-400 border border-red-800/50">
                                <Play size={10} fill="currentColor" />
                                <span>{videoCount} {videoCount === 1 ? 'Video' : 'Videos'}</span>
                              </span>
                            )}
                            {docCount > 0 && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-geist-mono text-neutral-400 bg-neutral-800/80 border border-neutral-700/50">
                                <BookOpen size={10} />
                                <span>{docCount} Docs</span>
                              </span>
                            )}
                          </div>

                          <ChevronRight size={14} className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurriculumCanvas;

