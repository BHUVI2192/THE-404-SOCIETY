import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CurriculumHeader } from '../src/components/builderportal/CurriculumHeader';
import { CurriculumCanvas } from '../src/components/builderportal/CurriculumCanvas';
import { CurriculumListView } from '../src/components/builderportal/CurriculumListView';
import { CurriculumDrawer } from '../src/components/builderportal/CurriculumDrawer';
import { 
  CurriculumTrack, 
  CurriculumTopic, 
  CurriculumManifestItem 
} from '../src/types/curriculum';
import { 
  getAllTopicStatuses, 
  setTopicStatus 
} from '../src/lib/roadmapStorage';
import { Loader2, AlertCircle } from 'lucide-react';

export const BuilderPortal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const slugFromUrl = searchParams.get('track') || searchParams.get('roadmap') || 'frontend';
  const topicIdFromUrl = searchParams.get('topic');

  const [currentSlug, setCurrentSlug] = useState<string>(slugFromUrl);
  const [manifest, setManifest] = useState<CurriculumManifestItem[]>([]);
  const [trackData, setTrackData] = useState<CurriculumTrack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'canvas' | 'list'>('canvas');
  const [topicStatuses, setTopicStatuses] = useState<Record<string, any>>({});

  // 1. Fetch manifest
  useEffect(() => {
    fetch('/curricula/manifest.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load track manifest');
        return res.json();
      })
      .then((data: CurriculumManifestItem[]) => {
        setManifest(data);
      })
      .catch(err => {
        console.error('Error loading manifest:', err);
      });
  }, []);

  // 2. Load track data whenever currentSlug changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedTopic(null);

    const savedStatuses = getAllTopicStatuses(currentSlug);
    setTopicStatuses(savedStatuses);

    fetch(`/curricula/${currentSlug}.json`)
      .then(async res => {
        if (!res.ok) throw new Error(`Could not load track: ${currentSlug}`);
        return res.json();
      })
      .then((data: CurriculumTrack) => {
        setTrackData(data);
        setLoading(false);

        // Check if URL specified a topic to open
        if (topicIdFromUrl && data.stages) {
          for (const stage of data.stages) {
            const match = stage.topics.find(t => t.id === topicIdFromUrl);
            if (match) {
              setSelectedTopic(match);
              break;
            }
          }
        }
      })
      .catch(err => {
        console.error('Failed to load track data:', err);
        setError(err.message || 'Failed to load track curriculum');
        setLoading(false);
      });
  }, [currentSlug, topicIdFromUrl]);

  const updateUrlTrack = (newSlug: string) => {
    setCurrentSlug(newSlug);
    setSearchParams({ track: newSlug });
  };

  const handleSelectTopic = (topic: CurriculumTopic) => {
    setSelectedTopic(topic);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('topic', topic.id);
      return p;
    });
  };

  const handleCloseDrawer = () => {
    setSelectedTopic(null);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.delete('topic');
      return p;
    });
  };

  // Status toggle handler
  const handleStatusChange = (status: any) => {
    if (!selectedTopic) return;
    setTopicStatus(currentSlug, selectedTopic.id, status);
    setTopicStatuses(prev => {
      const next = { ...prev };
      if (status === 'unvisited') {
        delete next[selectedTopic.id];
      } else {
        next[selectedTopic.id] = status;
      }
      return next;
    });
  };

  // Flattened topic list for Next / Prev navigation
  const flatTopics = useMemo(() => {
    if (!trackData?.stages) return [];
    return trackData.stages.flatMap(s => s.topics);
  }, [trackData]);

  const currentIndex = useMemo(() => {
    if (!selectedTopic) return -1;
    return flatTopics.findIndex(t => t.id === selectedTopic.id);
  }, [selectedTopic, flatTopics]);

  const handleNextTopic = () => {
    if (currentIndex >= 0 && currentIndex < flatTopics.length - 1) {
      handleSelectTopic(flatTopics[currentIndex + 1]);
    }
  };

  const handlePrevTopic = () => {
    if (currentIndex > 0) {
      handleSelectTopic(flatTopics[currentIndex - 1]);
    }
  };

  // Completed count
  const completedCount = useMemo(() => {
    return Object.values(topicStatuses).filter(s => s === 'completed').length;
  }, [topicStatuses]);

  const totalTopics = trackData?.totalTopics || flatTopics.length;
  const trackTitle = trackData?.title || currentSlug;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0f] text-neutral-100 font-geist select-none">
      <Helmet>
        <title>{`${trackTitle} – Builder Portal | The 404 Society`}</title>
        <meta
          name="description"
          content={`Organized milestones, video tutorials, and technical guides for ${trackTitle}. Built for builders and engineers.`}
        />
      </Helmet>

      {/* Clean Top Navigation Bar */}
      <CurriculumHeader
        currentSlug={currentSlug}
        trackTitle={trackTitle}
        manifest={manifest}
        onSelectTrack={updateUrlTrack}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        completedCount={completedCount}
        totalTopics={totalTopics}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main View Area */}
      <div className="flex-1 relative overflow-hidden bg-[#0a0a0f]">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs font-geist-mono text-neutral-400">
              Loading {trackTitle} milestones...
            </p>
          </div>
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              Could not load curriculum
            </h3>
            <p className="text-xs text-neutral-400 font-geist-mono max-w-sm mb-4">
              {error}
            </p>
            <button
              onClick={() => updateUrlTrack('frontend')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 transition-colors"
            >
              Load Frontend Track
            </button>
          </div>
        ) : viewMode === 'canvas' ? (
          /* High-Contrast Interactive Flowchart Canvas */
          <CurriculumCanvas
            stages={trackData?.stages || []}
            selectedTopicId={selectedTopic?.id || null}
            onSelectTopic={handleSelectTopic}
            topicStatuses={topicStatuses}
            searchQuery={searchQuery}
          />
        ) : (
          /* Sequential Curriculum List View */
          <div className="w-full h-full overflow-y-auto">
            <CurriculumListView
              stages={trackData?.stages || []}
              onSelectTopic={handleSelectTopic}
              topicStatuses={topicStatuses}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Slide-over Topic Detail Drawer */}
        <CurriculumDrawer
          topic={selectedTopic}
          trackTitle={trackTitle}
          status={selectedTopic ? topicStatuses[selectedTopic.id] || 'unvisited' : 'unvisited'}
          onStatusChange={handleStatusChange}
          onClose={handleCloseDrawer}
          onNextTopic={handleNextTopic}
          onPrevTopic={handlePrevTopic}
          hasNext={currentIndex >= 0 && currentIndex < flatTopics.length - 1}
          hasPrev={currentIndex > 0}
        />
      </div>
    </div>
  );
};

export default BuilderPortal;
