import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  Play, 
  BookOpen, 
  ChevronRight 
} from 'lucide-react';
import { CurriculumStage, CurriculumTopic, StageColor } from '../../types/curriculum';
import { TopicStatus } from '../../types/roadmap';

interface CurriculumListViewProps {
  stages: CurriculumStage[];
  onSelectTopic: (topic: CurriculumTopic) => void;
  topicStatuses: Record<string, TopicStatus>;
  searchQuery: string;
}

const STAGE_COLORS: Record<StageColor, {
  badge: string;
  dot: string;
}> = {
  amber: { badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-500' },
  blue: { badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', dot: 'bg-blue-500' },
  emerald: { badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-500' },
  purple: { badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', dot: 'bg-purple-500' },
  rose: { badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', dot: 'bg-rose-500' }
};

export const CurriculumListView: React.FC<CurriculumListViewProps> = ({
  stages,
  onSelectTopic,
  topicStatuses,
  searchQuery
}) => {
  const query = searchQuery.trim().toLowerCase();

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 font-geist text-neutral-100">
      <div className="space-y-10">
        {stages.map((stage) => {
          const colors = STAGE_COLORS[stage.color];
          const filteredTopics = stage.topics.filter(t => 
            query ? t.title.toLowerCase().includes(query) || t.tags.some(tag => tag.toLowerCase().includes(query)) : true
          );

          if (filteredTopics.length === 0) return null;

          return (
            <div key={stage.id} className="space-y-4">
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-geist-mono font-bold uppercase tracking-wider ${colors.badge}`}>
                    Phase 0{stage.phaseNumber}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {stage.title}
                  </h3>
                </div>
                <span className="text-xs font-geist-mono text-neutral-500">
                  {stage.topics.filter(t => topicStatuses[t.id] === 'completed').length}/{stage.topics.length} Completed
                </span>
              </div>

              {/* Topics List */}
              <div className="space-y-2.5">
                {filteredTopics.map((topic) => {
                  const status = topicStatuses[topic.id] || 'unvisited';
                  const videoCount = topic.resources.filter(r => r.type === 'video').length;
                  const docCount = topic.resources.filter(r => r.type === 'official' || r.type === 'article').length;

                  return (
                    <div
                      key={topic.id}
                      onClick={() => onSelectTopic(topic)}
                      className="p-4 rounded-xl border border-neutral-800 bg-[#141523] hover:bg-[#18192a] hover:border-neutral-700 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Status Icon */}
                        <div className="shrink-0">
                          {status === 'completed' ? (
                            <CheckCircle2 size={18} className="text-emerald-400" />
                          ) : status === 'in_progress' ? (
                            <Clock size={18} className="text-blue-400" />
                          ) : (
                            <Circle size={18} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-geist-mono text-neutral-500 font-semibold uppercase">
                              0{topic.order}
                            </span>
                            <span className="text-neutral-700 text-xs">•</span>
                            <span className="text-[10px] font-geist-mono text-neutral-400">
                              {topic.tags[0] || 'Core'}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors truncate">
                            {topic.title}
                          </h4>
                        </div>
                      </div>

                      {/* Badges & Arrow */}
                      <div className="flex items-center gap-3 shrink-0">
                        {videoCount > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-geist-mono bg-red-950/60 text-red-400 border border-red-800/50">
                            <Play size={10} fill="currentColor" />
                            <span>{videoCount} {videoCount === 1 ? 'Video' : 'Videos'}</span>
                          </span>
                        )}

                        {docCount > 0 && (
                          <span className="text-xs font-geist-mono text-neutral-500 hidden sm:inline">
                            {docCount} Docs
                          </span>
                        )}

                        <ChevronRight size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
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
  );
};

export default CurriculumListView;

