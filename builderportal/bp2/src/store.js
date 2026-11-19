const cache = new Map();

const load = async (path) => {
  if (cache.has(path)) return cache.get(path);

  const candidates = [
    `/builderportal/data/${path}`,
    `./data/${path}`,
    `/data/${path}`,
    `/public/data/${path}`,
    `data/${path}`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      const cType = res.headers.get('content-type') || '';
      if (res.ok && !cType.includes('text/html')) {
        const data = await res.json();
        cache.set(path, data);
        return data;
      }
    } catch {
      // try next candidate
    }
  }

  throw new Error(`Failed to load data/${path}`);
};

export const getIndex = () => load('index.json');
export const getRoadmapTopics = (slug) => load(`roadmaps/${slug}.json`).then((d) => d.topics);
export const getResources = () => load('resources.json');
export const getRoadmap = (slug) => load(`roadmaps/${slug}.json`);
