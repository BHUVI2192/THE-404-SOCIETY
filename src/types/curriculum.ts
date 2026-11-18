export type StageColor = 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';

export interface CurriculumResource {
  type: string;
  title: string;
  url: string;
  embedUrl?: string | null;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  stageId: string;
  stageName: string;
  stageColor: StageColor;
  order: number;
  tags: string[];
  resources: CurriculumResource[];
}

export interface CurriculumStage {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  color: StageColor;
  topics: CurriculumTopic[];
}

export interface CurriculumTrack {
  id: string;
  slug: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  totalTopics: number;
  stages: CurriculumStage[];
}

export interface CurriculumManifestItem {
  slug: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  totalTopics: number;
  stageCount: number;
}

