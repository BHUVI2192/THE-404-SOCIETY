import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/UI';

// Main Core Pages (Eagerly loaded for instant responsiveness)
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Join from './pages/Join';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';
import EventRegistration from './pages/EventRegistration';
import YouDecideLocal from './pages/YouDecideLocal';

// Heavy Portal & Admin Pages (Lazily loaded to minimize initial bundle payload)
const BuilderPortal = React.lazy(() => import('./pages/BuilderPortal'));
const AdminLayout = React.lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboard = React.lazy(() =>
  import('./pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard }))
);
const EventManagement = React.lazy(() =>
  import('./pages/admin/EventManagement').then((m) => ({ default: m.EventManagement }))
);
const BlogManagement = React.lazy(() =>
  import('./pages/admin/BlogManagement').then((m) => ({ default: m.BlogManagement }))
);
const RegistrationManagement = React.lazy(() =>
  import('./pages/admin/RegistrationManagement').then((m) => ({ default: m.RegistrationManagement }))
);
const CommunityManagement = React.lazy(() =>
  import('./pages/admin/CommunityManagement').then((m) => ({ default: m.CommunityManagement }))
);
const AdminSettings = React.lazy(() =>
  import('./pages/admin/Settings').then((m) => ({ default: m.AdminSettings }))
);
const AdminLogin = React.lazy(() =>
  import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);

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
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/builder') ||
      pathname.startsWith('/roadmap')
    ) {
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

/**
 * Domain-Aware Brand Detector
 * If the user visits via youdecide.studio, youdecide.local, or provides ?brand=youdecide,
 * the default root '/' route serves the YouDecide Studio experience directly.
 */
const isYouDecideDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    host.includes('youdecide') ||
    search.includes('brand=youdecide') ||
    hash.includes('youdecide')
  );
};

const FallbackLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: '#040711',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#60A5FA',
      fontFamily: '"Geist Mono", monospace',
      fontSize: '13px',
      letterSpacing: '0.12em',
    }}
  >
    INITIALIZING INTERFACE...
  </div>
);

const App: React.FC = () => {
  const isStudio = isYouDecideDomain();

  return (
    <HelmetProvider>
      <Router>
        <SmoothScrolling>
          <ScrollToTop />
          <Suspense fallback={<FallbackLoader />}>
            <Routes>
              {/* Admin Routes (Lazy Loaded) */}
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

              {/* Default Root Route: Domain-Aware Routing */}
              <Route
                path="/"
                element={
                  isStudio ? (
                    <YouDecideLocal />
                  ) : (
                    <Layout>
                      <Home />
                    </Layout>
                  )
                }
              />

              {/* The 404 Society Community Routes */}
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/events" element={<Layout><Events /></Layout>} />
              <Route path="/join" element={<Layout><Join /></Layout>} />
              <Route path="/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/blog/:blogId" element={<Layout><BlogDetail /></Layout>} />
              <Route path="/register-event/:eventId" element={<Layout><EventRegistration /></Layout>} />
              <Route path="/events/:eventId/register" element={<Layout><EventRegistration /></Layout>} />

              {/* YouDecide Studio Routes */}
              <Route path="/youdecide" element={<YouDecideLocal />} />
              <Route path="/youdecide.studio" element={<YouDecideLocal />} />
              <Route path="/youdecide.local" element={<YouDecideLocal />} />
              <Route path="/contact" element={<YouDecideLocal scrollTo="contact" />} />
              <Route path="/websites-built" element={<YouDecideLocal scrollTo="websites-built" />} />
              <Route path="/automations" element={<YouDecideLocal scrollTo="automations" />} />
              <Route path="/analytics" element={<YouDecideLocal scrollTo="analytics" />} />
              <Route path="/testimonials" element={<YouDecideLocal scrollTo="testimonials" />} />
              <Route path="/faq" element={<YouDecideLocal scrollTo="faq" />} />
              <Route path="/terms" element={<YouDecideLocal scrollTo="terms" />} />
              <Route path="/privacy" element={<YouDecideLocal scrollTo="privacy" />} />
              <Route path="/overview" element={<YouDecideLocal scrollTo="overview" />} />

              {/* Builder Portal Routes (Lazy Loaded) */}
              <Route path="/builderportal" element={<BuilderPortal />} />
              <Route path="/builder-portal" element={<BuilderPortal />} />
              <Route path="/roadmaps" element={<BuilderPortal />} />
              <Route path="/roadmap" element={<BuilderPortal />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SmoothScrolling>
      </Router>
    </HelmetProvider>
  );
};

export default App;
