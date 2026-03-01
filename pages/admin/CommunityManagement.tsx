import React, { useState, useEffect } from 'react';
import { subscribeToCommunityApps, updateCommunityApp, deleteCommunityApp, CommunityApp } from '../../lib/community_apps';
import { generateMemberId, setMemberId, validateMemberId } from '../../lib/memberIdService';
import {
  sendApplicationApprovedEmail
} from '../../lib/emailService';
import toast from 'react-hot-toast';

type ActionType = 'approve' | null;

export const CommunityManagement: React.FC = () => {
  const [apps, setApps] = useState<CommunityApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<CommunityApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Modal state
  const [selectedApp, setSelectedApp] = useState<CommunityApp | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [feedback, setFeedback] = useState('');
  const [customMemberId, setCustomMemberId] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('https://chat.whatsapp.com/');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCommunityApps((data) => {
      setApps(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterApps();
  }, [apps, searchTerm, statusFilter]);

  const filterApps = () => {
    let filtered = apps;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.memberId && app.memberId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApps(filtered);
  };

  const openActionModal = (app: CommunityApp, action: ActionType) => {
    setSelectedApp(app);
    setActionType(action);
    setFeedback('');
    setCustomMemberId(app.memberId || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
    setActionType(null);
    setFeedback('');
    setCustomMemberId('');
  };

  const handleApprove = async () => {
    if (!selectedApp) return;

    try {
      setLoading(true);

      // Generate or use custom member ID
      let memberId = customMemberId;
      if (!memberId) {
        memberId = await generateMemberId();
      } else {
        // Validate custom ID
        if (!validateMemberId(memberId)) {
          toast.error('Invalid Member ID format. Use: 404-YYYY-NNN');
          setLoading(false);
          return;
        }
        await setMemberId(memberId);
      }

      // Update application
      await updateCommunityApp(selectedApp.id!, {
        status: 'approved',
        memberId,
        emailsSent: {
          ...(selectedApp.emailsSent || {}),
          applicationApproved: true,
        },
        updatedAt: Date.now(),
      });

      // Send approval email
      await sendApplicationApprovedEmail({
        name: selectedApp.name,
        email: selectedApp.email,
        memberId,
        whatsappLink,
      });

      toast.success(`Application approved! Member ID: ${memberId}`);
      closeModal();
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
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
      } catch (error) {
        toast.error('Failed to delete application');
      } finally {
        setLoading(false);
      }
    }
  };

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === 'pending').length,
    approved: apps.filter((a) => a.status === 'approved').length,
  };

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Contact',
      'College',
      'Year',
      'Member ID',
      'Status',
      'Interest',
      'Social/Portfolio',
      'Applied Date',
    ];

    const rows = filteredApps.map((app) => [
      app.name,
      app.email,
      app.contact,
      app.college,
      app.year,
      app.memberId || '-',
      app.status,
      app.interest || '-',
      app.social || '-',
      new Date(app.createdAt || 0).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `community-apps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="adm-page">
      {/* Header */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Community Applications</h1>
          <p className="adm-page__subtitle">Review and manage membership applications</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredApps.length === 0}
          className="adm-btn adm-btn--secondary"
          style={{ opacity: filteredApps.length === 0 ? 0.5 : 1, cursor: filteredApps.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
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
            placeholder="Search by name, email, college, or Member ID..."
            className="adm-search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="adm-filter-group">
          {(['all', 'pending', 'approved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`adm-filter-btn ${statusFilter === status
                ? 'adm-filter-btn--active'
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
                  className={`adm-badge adm-badge--${app.status === 'approved' ? 'success' : 'danger'
                    }`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>

              {/* Details */}
              <div style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                {app.memberId && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Member ID
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--adm-accent)', fontFamily: 'monospace' }}>
                      {app.memberId}
                    </p>
                  </div>
                )}
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => openActionModal(app, 'approve')}
                      disabled={loading}
                      className="adm-btn adm-btn--primary"
                      style={{ flex: '1 1 100%' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Approve
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

      {/* Modal */}
      {showModal && selectedApp && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--adm-bg-primary)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--adm-text)', marginBottom: '4px' }}>
              ✅ Approve Application
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--adm-text-muted)', marginBottom: '20px' }}>
              {selectedApp.name} ({selectedApp.email})
            </p>

            {/* Approve Form */}
            {actionType === 'approve' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--adm-text-muted)', display: 'block', marginBottom: '8px' }}>
                    Member ID
                  </label>
                  <input
                    type="text"
                    placeholder="404-2026-001 (auto-generated if empty)"
                    value={customMemberId}
                    onChange={(e) => setCustomMemberId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--adm-border)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      color: 'var(--adm-text)',
                      background: 'var(--adm-bg-secondary)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', marginTop: '4px' }}>
                    Format: 404-YYYY-NNN. Leave empty to auto-generate.
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--adm-text-muted)', display: 'block', marginBottom: '8px' }}>
                    WhatsApp Group Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://chat.whatsapp.com/..."
                    value={whatsappLink}
                    onChange={(e) => setWhatsappLink(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--adm-border)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'var(--adm-text)',
                      background: 'var(--adm-bg-secondary)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="adm-btn adm-btn--primary"
                style={{ flex: 1 }}
              >
                {loading ? 'Processing...' : 'Approve & Send Email'}
              </button>
              <button
                onClick={closeModal}
                disabled={loading}
                className="adm-btn adm-btn--secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
