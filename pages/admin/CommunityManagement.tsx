import React, { useState, useEffect } from 'react';
import { getCommunityApps, updateCommunityApp, deleteCommunityApp, CommunityApp } from '../../lib/community_apps';
import toast from 'react-hot-toast';

export const CommunityManagement: React.FC = () => {
  const [apps, setApps] = useState<CommunityApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<CommunityApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<CommunityApp | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    filterApps();
  }, [apps, searchTerm, statusFilter]);

  const loadApps = async () => {
    try {
      setLoading(true);
      const data = await getCommunityApps();
      setApps(data);
    } catch (error) {
      console.error('[CommunityManagement] Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApps = () => {
    let filtered = apps;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.college.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApps(filtered);
  };

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      setLoading(true);
      await updateCommunityApp(id, { status: newStatus });
      toast.success(`Application ${newStatus}`);
      await loadApps();
      setShowModal(false);
      setSelectedApp(null);
    } catch (error) {
      toast.error('Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        setLoading(true);
        await deleteCommunityApp(id);
        toast.success('Application deleted');
        await loadApps();
      } catch (error) {
        toast.error('Failed to delete application');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === 'pending').length,
    approved: apps.filter((a) => a.status === 'approved').length,
    rejected: apps.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="adm-page">
      {/* Header */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Community Applications</h1>
          <p className="adm-page__subtitle">Review and manage membership applications</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="adm-stats-grid">
        <div className="adm-stat-card adm-stat-card--teal">
          <div className="adm-stat-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="adm-stat-card__label">Total</div>
          <div className="adm-stat-card__value">{stats.total}</div>
        </div>

        <div className="adm-stat-card adm-stat-card--yellow">
          <div className="adm-stat-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="6" x2="12" y2="12" />
              <line x1="12" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <div className="adm-stat-card__label">Pending</div>
          <div className="adm-stat-card__value">{stats.pending}</div>
        </div>

        <div className="adm-stat-card adm-stat-card--teal">
          <div className="adm-stat-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="adm-stat-card__label">Approved</div>
          <div className="adm-stat-card__value">{stats.approved}</div>
        </div>

        <div className="adm-stat-card adm-stat-card--red">
          <div className="adm-stat-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div className="adm-stat-card__label">Rejected</div>
          <div className="adm-stat-card__value">{stats.rejected}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <div className="adm-search__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or college..."
            className="adm-search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="adm-filter-group">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`adm-filter-btn ${
                statusFilter === status
                  ? status === 'pending'
                    ? 'adm-filter-btn--active-red'
                    : status === 'rejected'
                    ? 'adm-filter-btn--active-red'
                    : 'adm-filter-btn--active'
                  : ''
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      {filteredApps.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="adm-table-wrapper"
              style={{ padding: '20px' }}
            >
              {/* Status Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--adm-text)', marginBottom: '4px' }}>
                    {app.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--adm-text-muted)' }}>{app.college}</p>
                </div>
                <span
                  className={`adm-badge adm-badge--${
                    app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'
                  }`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>

              {/* Details */}
              <div style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Email
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--adm-text-secondary)' }}>{app.email}</p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Contact
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--adm-text-secondary)' }}>{app.contact}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Year
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--adm-text-secondary)' }}>{app.year}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Applied
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--adm-text-secondary)' }}>
                      {new Date(app.createdAt || 0).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {app.interest && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Interest
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--adm-text-secondary)' }}>{app.interest}</p>
                  </div>
                )}
                {app.social && (
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Social/Portfolio
                    </p>
                    <a
                      href={app.social}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '13px', color: 'var(--adm-accent)', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {app.social}
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(app.id!, 'approved')}
                      disabled={loading}
                      className="adm-btn adm-btn--primary"
                      style={{ flex: 1 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id!, 'rejected')}
                      disabled={loading}
                      className="adm-btn adm-btn--danger"
                      style={{ flex: 1 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(app.id!)}
                  className="adm-btn adm-btn--danger adm-btn--icon"
                  title="Delete"
                  style={{ marginLeft: app.status === 'pending' ? 'auto' : undefined }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="adm-empty">
          <div className="adm-empty__title">No Applications Found</div>
          <div className="adm-empty__description">Adjust your filters or search terms to find applications.</div>
        </div>
      )}

      {/* Summary */}
      {filteredApps.length > 0 && (
        <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)', marginTop: '16px', textAlign: 'right' }}>
          Showing {filteredApps.length} of {apps.length} applications
        </div>
      )}
    </div>
  );
};
