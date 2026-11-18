export type TopicStatus = 'unvisited' | 'in_progress' | 'completed';

export interface RoadmapResource {
  type: string;
  title: string;
  url: string;
  embedUrl?: string | null;
}

export interface RoadmapTopicContent {
  title: string;
  description: string;
  resources: RoadmapResource[];
}

export interface RoadmapNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  width?: number;
  height?: number;
  measured?: {
    width: number;
    height: number;
  };
  style?: Record<string, any>;
  data?: {
    label?: string;
    style?: Record<string, any>;
    legend?: {
      id?: string;
      color?: string;
      label?: string;
      position?: string;
    };
    [key: string]: any;
  };
  content?: RoadmapTopicContent;
  zIndex?: number;
  [key: string]: any;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  style?: Record<string, any>;
  data?: {
    edgeStyle?: string;
    [key: string]: any;
  };
}

export interface RoadmapData {
  _id?: string;
  slug: string;
  title: {
    card: string;
    page: string;
  };
  description: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  enrichedTopicsCount?: number;
  totalTopicsLocal?: number;
}

export interface RoadmapManifestItem {
  slug: string;
  title: string;
  topicsCount: number;
  isPrebundled?: boolean;
}

