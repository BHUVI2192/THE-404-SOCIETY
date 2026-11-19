# builderportal

Interactive learning-path explorer: 98 roadmaps, 11,484 topics and 5,709 videos from the developer-roadmap content repository.
Vanilla JS + Vite, SVG flowcharts, canvas graphs and charts, Montserrat, light and dark themes, no UI framework.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview
```
`public/data` is committed, so no content repo is needed to run the app.

## Regenerate data
```bash
CONTENT_REPO=/path/to/developer-roadmap npm run data
```
Topics are parsed from `roadmaps/<slug>/content/*.md`. The repo has no topic hierarchy, so stages are derived automatically
(TF-IDF + k-means in `scripts/cluster.mjs`). Override any roadmap by adding `layouts/<slug>.json`:
`{ "stages": [ { "title": "Basics", "topics": ["topic-id-or-title"] } ] }` (see `layouts/_example.json`).

## What is in the app
- **Roadmaps**: sidebar with category counts, search and sort; role-based, skill-based and beginner sections; progress on each tile.
- **Roadmap page**: "What is..." summary, progress ring, and four views: spine flowchart (stages down the middle, topics fanning out, dotted links, tick to complete),
  force graph, topic list, and all resources with type filters. Related roadmaps are listed at the bottom.
- **Dashboard, Universe, Resources, Videos, Insights** as in the first release.
- Progress is stored in this browser (`localStorage`).

## Screenshots
`npm run build && npm run preview` then `npm run screenshots` writes `screenshots/pages` and `screenshots/stages/<roadmap>`.
