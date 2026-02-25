
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/UI';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Community from './pages/Community';


import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';
import EventRegistration from './pages/EventRegistration';

// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { EventManagement } from './pages/admin/EventManagement';
import { BlogManagement } from './pages/admin/BlogManagement';
import { RegistrationManagement } from './pages/admin/RegistrationManagement';
import { CommunityManagement } from './pages/admin/CommunityManagement';
import { AdminSettings } from './pages/admin/Settings';


// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

import Lenis from 'lenis';

// Smooth Scroll Wrapper
const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <SmoothScrolling>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes (No standard Layout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="registrations" element={<RegistrationManagement />} />
            <Route path="community" element={<CommunityManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Pages with standard Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/community" element={<Layout><Community /></Layout>} />

          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:blogId" element={<Layout><BlogDetail /></Layout>} />
          <Route path="/register-event/:eventId" element={<Layout><EventRegistration /></Layout>} />


          {/* 404 Page (No Layout) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SmoothScrolling>
    </Router>
  );
};

export default App;
