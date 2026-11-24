
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/UI';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Join from './pages/Join';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';
import EventRegistration from './pages/EventRegistration';
import YouDecideStudio from './pages/YouDecideStudio';
import YouDecideLocal from './pages/YouDecideLocal';
import BuilderPortal from './pages/BuilderPortal';

// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { EventManagement } from './pages/admin/EventManagement';
import { BlogManagement } from './pages/admin/BlogManagement';
import { RegistrationManagement } from './pages/admin/RegistrationManagement';
import { CommunityManagement } from './pages/admin/CommunityManagement';
import { AdminSettings } from './pages/admin/Settings';
import { AdminLogin } from './pages/admin/AdminLogin';

import Lenis from 'lenis';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Smooth Scroll Wrapper
const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/builder') || pathname.startsWith('/roadmap')) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    (window as any).__lenis = lenis;
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      (window as any).__lenis = null;
      (window as any).lenis = null;
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <SmoothScrolling>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes (No standard Layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<EventManagement />} />
              <Route path="blogs" element={<BlogManagement />} />
              <Route path="registrations" element={<RegistrationManagement />} />
              <Route path="community" element={<CommunityManagement />} />
              <Route path="onboarding" element={<CommunityManagement />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Pages with standard Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/join" element={<Layout><Join /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:blogId" element={<Layout><BlogDetail /></Layout>} />
            <Route path="/register-event/:eventId" element={<Layout><EventRegistration /></Layout>} />
            <Route path="/events/:eventId/register" element={<Layout><EventRegistration /></Layout>} />

            {/* Special Pages (No Layout) */}
            <Route path="/youdecide.studio" element={<YouDecideStudio />} />
            <Route path="/youdecide.local" element={<YouDecideLocal />} />
            <Route path="/contact" element={<YouDecideLocal scrollTo="contact" />} />
            <Route path="/websites-built" element={<YouDecideLocal scrollTo="websites-built" />} />
            <Route path="/automations" element={<YouDecideLocal scrollTo="automations" />} />
            <Route path="/analytics" element={<YouDecideLocal scrollTo="analytics" />} />
            <Route path="/overview" element={<YouDecideLocal scrollTo="overview" />} />
            <Route path="/builderportal" element={<BuilderPortal />} />
            <Route path="/builder-portal" element={<BuilderPortal />} />
            <Route path="/roadmaps" element={<BuilderPortal />} />
            <Route path="/roadmap" element={<BuilderPortal />} />

            {/* 404 Page (No Layout) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SmoothScrolling>
      </Router>
    </HelmetProvider>
  );
};

export default App;
