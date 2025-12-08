import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/UI';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Community from './pages/Community';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    // We use 'instant' here because global CSS has 'scroll-behavior: smooth'
    // which is great for anchor links but jarring for full page navigation.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Pages with standard Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/community" element={<Layout><Community /></Layout>} />
        <Route path="/team" element={<Layout><Team /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        
        {/* 404 Page (No Layout) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;