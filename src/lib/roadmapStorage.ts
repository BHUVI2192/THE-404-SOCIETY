import { TopicStatus } from '../types/roadmap';

const STORAGE_PREFIX = 'builder_portal_progress_';

export function getTopicStatus(roadmapSlug: string, nodeId: string): TopicStatus {
  try {
    const key = `${STORAGE_PREFIX}${roadmapSlug}`;
    const data = localStorage.getItem(key);
    if (!data) return 'unvisited';
    const parsed = JSON.parse(data);
    return parsed[nodeId] || 'unvisited';
  } catch (e) {
    return 'unvisited';
  }
}

export function setTopicStatus(roadmapSlug: string, nodeId: string, status: TopicStatus): void {
  try {
    const key = `${STORAGE_PREFIX}${roadmapSlug}`;
    const data = localStorage.getItem(key);
    const parsed = data ? JSON.parse(data) : {};
    if (status === 'unvisited') {
      delete parsed[nodeId];
    } else {
      parsed[nodeId] = status;
    }
    localStorage.setItem(key, JSON.stringify(parsed));
  } catch (e) {
    console.error('Failed to save topic status:', e);
  }
}

export function getAllTopicStatuses(roadmapSlug: string): Record<string, TopicStatus> {
  try {
    const key = `${STORAGE_PREFIX}${roadmapSlug}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

