import React, { useState, useEffect } from 'react';
import { getEvents } from '../../lib/events';
import { getRegistrations } from '../../lib/registrations';
import { getCommunityApps } from '../../lib/community_apps';
import { getBlogs } from '../../lib/blogs';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    communityApps: 0,
    pendingApps: 0,
    approvedApps: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [events, registrations, communityApps, blogs] = await Promise.all([
          getEvents(),
          getRegistrations(),
          getCommunityApps(),
          getBlogs(),
        ]);

        setStats({
          totalEvents: events.length,
          activeEvents: events.filter((e) => e.status === 'open').length,
          totalRegistrations: registrations.length,
          totalBlogs: blogs.length,
          publishedBlogs: blogs.filter((b) => b.status === 'published').length,
          communityApps: communityApps.length,
          pendingApps: communityApps.filter((a) => a.status === 'pending').length,
          approvedApps: communityApps.filter((a) => a.status === 'approved').length,
        });

        // Combine recent activity
        const activity = [
          ...events.slice(0, 2).map((e) => ({ type: 'event', data: e, createdAt: e.createdAt })),
          ...blogs.slice(0, 2).map((b) => ({ type: 'blog', data: b, createdAt: b.updatedAt || b.createdAt })),
          ...registrations.slice(0, 2).map((r) => ({ type: 'registration', data: r, createdAt: r.createdAt })),
          ...communityApps.slice(0, 2).map((c) => ({ type: 'community', data: c, createdAt: c.createdAt })),
        ].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setRecentActivity(activity.slice(0, 6));
      } catch (error) {
        console.error('[AdminDashboard] Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  // SVG icon components
  const EventIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const BlogIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );

  const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );

  const TrendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );

  return (
    <div className="adm-page">
      {/* Header */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Dashboard</h1>
          <p className="adm-page__subtitle">Welcome back! Here's your platform overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="adm-stats-grid">
        <div className="adm-stat-card adm-stat-card--teal">
          <div className="adm-stat-card__icon">
            <EventIcon />
          </div>
          <div className="adm-stat-card__label">Total Events</div>
          <div className="adm-stat-card__value">{stats.totalEvents}</div>
          <div className="adm-stat-card__sub">{stats.activeEvents} active</div>
        </div>

        <div className="adm-stat-card adm-stat-card--blue">
          <div className="adm-stat-card__icon">
            <TrendIcon />
          </div>
          <div className="adm-stat-card__label">Active Events</div>
          <div className="adm-stat-card__value">{stats.activeEvents}</div>
          <div className="adm-stat-card__sub">Open for registration</div>
        </div>

        <div className="adm-stat-card adm-stat-card--purple">
          <div className="adm-stat-card__icon">
            <BlogIcon />
          </div>
          <div className="adm-stat-card__label">Blog Posts</div>
          <div className="adm-stat-card__value">{stats.totalBlogs}</div>
          <div className="adm-stat-card__sub">{stats.publishedBlogs} published</div>
        </div>

        <div className="adm-stat-card adm-stat-card--blue">
          <div className="adm-stat-card__icon">
            <UserIcon />
          </div>
          <div className="adm-stat-card__label">Registrations</div>
          <div className="adm-stat-card__value">{stats.totalRegistrations}</div>
          <div className="adm-stat-card__sub">Total participants</div>
        </div>

        <div className="adm-stat-card adm-stat-card--yellow">
          <div className="adm-stat-card__icon">
            <UserIcon />
          </div>
          <div className="adm-stat-card__label">Community Apps</div>
          <div className="adm-stat-card__value">{stats.communityApps}</div>
          <div className="adm-stat-card__sub">{stats.pendingApps} pending</div>
        </div>

        <div className="adm-stat-card adm-stat-card--teal">
          <div className="adm-stat-card__icon">
            <UserIcon />
          </div>
          <div className="adm-stat-card__label">Approved Members</div>
          <div className="adm-stat-card__value">{stats.approvedApps}</div>
          <div className="adm-stat-card__sub">Community members</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Recent Activity</h3>
        <div className="adm-table-wrapper">
          {recentActivity.length > 0 ? (
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Item</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th style={{ textAlign: 'right' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, idx) => (
                  <tr key={idx}>
                    <td className="adm-table__primary">
                      {activity.type === 'event' && activity.data.title}
                      {activity.type === 'blog' && activity.data.title}
                      {activity.type === 'registration' && activity.data.name}
                      {activity.type === 'community' && activity.data.name}
                    </td>
                    <td>
                      <span className={`adm-badge adm-badge--${activity.type === 'event' ? 'info' : activity.type === 'community' ? 'warning' : 'success'}`}>
                        {activity.type === 'event' && 'Event'}
                        {activity.type === 'blog' && 'Blog'}
                        {activity.type === 'registration' && 'Registration'}
                        {activity.type === 'community' && 'Community'}
                      </span>
                    </td>
                    <td>
                      {activity.type === 'event' && activity.data.location}
                      {activity.type === 'blog' && activity.data.category}
                      {activity.type === 'registration' && activity.data.eventTitle}
                      {activity.type === 'community' && activity.data.status}
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '12px', color: 'var(--adm-text-muted)' }}>
                      {activity.createdAt && new Date(activity.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="adm-empty">
              <div className="adm-empty__title">No Recent Activity</div>
              <div className="adm-empty__description">Activity will appear here as items are created or updated.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
