import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
    label: "Community",
  },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="adm-root">
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
            </NavLink>
          ))}
        </nav>

        <button
          className="adm-sidebar__exit"
          onClick={() => navigate("/")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Exit Admin
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
              `adm-bottomnav__item ${isActive ? "adm-bottomnav__item--active" : ""}`
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
