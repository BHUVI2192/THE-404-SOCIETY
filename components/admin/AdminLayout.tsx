import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, LogOut, Check, Sparkles } from "lucide-react";
import { AnimatedLiquidBackground } from "./AnimatedLiquidBackground";
import { subscribeToCommunityApps } from "../../lib/community_apps";
import "./AdminLayout.css";

const NAV_ITEMS = [
  {
    to: "/admin",
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    label: "Dashboard",
  },
  {
    to: "/admin/events",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: "Events",
  },
  {
    to: "/admin/blogs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: "Blogs",
  },
  {
    to: "/admin/registrations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Registrations",
  },
  {
    to: "/admin/community",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="23" y1="11" x2="17" y2="11" />
        <line x1="20" y1="8" x2="20" y2="14" />
      </svg>
    ),
    label: "Onboarding",
  },
  {
    to: "/admin/settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
      </svg>
    ),
    label: "Settings",
  },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Subscribe to community pending count
  useEffect(() => {
    try {
      const unsubscribe = subscribeToCommunityApps((apps) => {
        const pending = apps.filter((a) => a.status === "pending").length;
        setPendingCount(pending);
      });
      return () => unsubscribe();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
      const authTimeStr = localStorage.getItem('adminAuthTime');

      if (!isAuthenticated || !authTimeStr) {
        navigate('/admin/login');
        return;
      }

      const authTime = parseInt(authTimeStr, 10);
      const now = Date.now();
      const FIFTEEN_MINUTES = 15 * 60 * 1000;

      if (now - authTime > FIFTEEN_MINUTES) {
        // Session expired
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTime');
        navigate('/admin/login');
      }
    };

    checkAuth();
    const intervalId = setInterval(checkAuth, 60 * 1000);

    let lastUpdate = Date.now();
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 30000) {
        localStorage.setItem('adminAuthTime', now.toString());
        lastUpdate = now;
      }
    };

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [navigate]);

  return (
    <div className="adm-root">
      {/* ── Framer Prism Animated Liquid Background ── */}
      <AnimatedLiquidBackground />

      {/* ── Sidebar (desktop) ── */}
      <aside className={`adm-sidebar ${sidebarOpen ? "adm-sidebar--open" : ""}`}>
        <div className="adm-sidebar__brand">
          <span className="adm-sidebar__logo">404</span>
          <span className="adm-sidebar__name">Admin Panel</span>
        </div>

        <nav className="adm-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `adm-sidebar__link ${isActive ? "adm-sidebar__link--active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="adm-sidebar__icon">{item.icon}</span>
              <span className="adm-sidebar__label">{item.label}</span>
              {(item.label === "Community" || item.label === "Onboarding") && pendingCount > 0 && (
                <span className="adm-sidebar__badge">{pendingCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="adm-sidebar__exit"
          onClick={() => {
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('adminAuthTime');
            navigate('/');
          }}
        >
          <LogOut className="w-4 h-4 text-white" strokeWidth={2.2} />
          <span>Exit Admin</span>
        </button>
      </aside>

      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="adm-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main area ── */}
      <div className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <button
            className="adm-topbar__hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
          <div className="adm-topbar__brand-mobile">
            <span className="adm-sidebar__logo">404</span>
          </div>
          
          <div className="adm-topbar__right">
            {/* Clean Pure-Black Notification Button with Pure-White Bell */}
            <div style={{ position: "relative" }}>
              <button
                className="adm-topbar__notif-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-white" strokeWidth={2.2} />
                {pendingCount > 0 && (
                  <span className="adm-topbar__notif-badge">{pendingCount}</span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {notifOpen && (
                <div className="adm-topbar__notif-dropdown">
                  <div className="adm-topbar__notif-header">
                    <span style={{ fontWeight: 700, fontSize: "13px" }}>Notifications</span>
                    <span style={{ fontSize: "11px", fontFamily: "var(--adm-font-mono)", opacity: 0.7 }}>
                      {pendingCount} Pending
                    </span>
                  </div>
                  <div className="adm-topbar__notif-body">
                    {pendingCount > 0 ? (
                      <div
                        className="adm-topbar__notif-item"
                        onClick={() => {
                          setNotifOpen(false);
                          navigate("/admin/community");
                        }}
                      >
                        <div className="adm-topbar__notif-dot" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "12.5px", color: "#000000" }}>
                            {pendingCount} Pending Onboarding Request{pendingCount > 1 ? "s" : ""}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#71717a" }}>
                            Click to review and approve applicant IDs
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "16px", textAlign: "center", fontSize: "12.5px", color: "#71717a" }}>
                        All caught up! No pending requests.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="adm-topbar__avatar">A</div>
            <span className="adm-topbar__admin-label">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="adm-content">
          <Outlet />
        </main>
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="adm-bottomnav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `adm-bottomnav__link ${isActive ? "adm-bottomnav__link--active" : ""}`
            }
          >
            <span className="adm-bottomnav__icon">{item.icon}</span>
            <span className="adm-bottomnav__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
