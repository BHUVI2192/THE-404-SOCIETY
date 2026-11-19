import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/flow.css';

import { renderShell } from './components/shell.js';
import { route, navigate } from './router.js';
import { dashboard } from './views/dashboard.js';
import { universe } from './views/universe.js';
import { roadmaps } from './views/roadmaps.js';
import { roadmap } from './views/roadmap.js';
import { resources, videos } from './views/resources.js';
import { insights } from './views/insights.js';
import { loginView } from './views/login.js';

const main = renderShell(document.getElementById('app'));

route('/login', loginView);
route('/', dashboard);
route('/universe', universe);
route('/roadmaps', roadmaps);
route('/roadmap/:slug', roadmap);
route('/resources', resources);
route('/videos', videos);
route('/insights', insights);

const go = () => navigate(main).catch((err) => {
  console.error(err);
  main.innerHTML = `<div class="page"><div class="empty">Something went wrong loading this page.<br>${String(err.message)}</div></div>`;
});

window.addEventListener('hashchange', go);
window.addEventListener('authchange', go);
document.fonts.load('600 14px Montserrat').finally(go);
