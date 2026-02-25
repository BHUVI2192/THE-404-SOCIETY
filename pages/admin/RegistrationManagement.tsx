import React, { useState, useEffect } from 'react';
import { getRegistrations, deleteRegistration, Registration } from '../../lib/registrations';
import toast from 'react-hot-toast';

export const RegistrationManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegs, setFilteredRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    loadRegistrations();
  }, []);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchTerm, filterEvent]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getRegistrations();
      setRegistrations(data);

      // Extract unique event titles
      const uniqueEvents = [...new Set(data.map((r) => r.eventTitle))];
      setEvents(uniqueEvents);
    } catch (error) {
      console.error('[RegistrationManagement] Error loading registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = registrations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterEvent !== 'all') {
      filtered = filtered.filter((reg) => reg.eventTitle === filterEvent);
    }

    setFilteredRegs(filtered);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        setLoading(true);
        await deleteRegistration(id);
        toast.success('Registration deleted successfully');
        await loadRegistrations();
      } catch (error) {
        toast.error('Failed to delete registration');
      } finally {
        setLoading(false);
      }
    }
  };

  const exportToCSV = () => {
    if (filteredRegs.length === 0) {
      toast.error('No registrations to export');
      return;
    }

    const headers = ['Name', 'Email', 'Student ID', 'Event', 'Date'];
    const rows = filteredRegs.map((reg) => [
      reg.name,
      reg.email,
      reg.studentId || '-',
      reg.eventTitle,
      new Date(reg.createdAt || 0).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="adm-page">
      {/* Header with CTA */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Event Registrations</h1>
          <p className="adm-page__subtitle">Manage participant registrations for events</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredRegs.length === 0}
          className="adm-btn adm-btn--secondary"
          style={{ opacity: filteredRegs.length === 0 ? 0.5 : 1, cursor: filteredRegs.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Toolbar with search and filter */}
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
            placeholder="Search by name, email, or student ID..."
            className="adm-search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="adm-select"
          style={{ flex: '0 0 180px' }}
        >
          <option value="all">All Events</option>
          {events.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="adm-stats-grid">
        <div className="adm-stat-card adm-stat-card--teal">
          <div className="adm-stat-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="adm-stat-card__label">Total Registrations</div>
          <div className="adm-stat-card__value">{registrations.length}</div>
        </div>

        <div className="adm-stat-card adm-stat-card--blue">
          <div className="adm-stat-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="adm-stat-card__label">Filtered Results</div>
          <div className="adm-stat-card__value">{filteredRegs.length}</div>
        </div>

        <div className="adm-stat-card adm-stat-card--purple">
          <div className="adm-stat-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="adm-stat-card__label">Total Events</div>
          <div className="adm-stat-card__value">{events.length}</div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="adm-table-wrapper">
        {filteredRegs.length > 0 ? (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Event</th>
                <th>Registered On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegs.map((registration) => (
                <tr key={registration.id}>
                  <td className="adm-table__primary">{registration.name}</td>
                  <td>{registration.email}</td>
                  <td>
                    {registration.studentId ? (
                      <span className="adm-badge adm-badge--secondary">{registration.studentId}</span>
                    ) : (
                      <span style={{ color: 'var(--adm-text-muted)', fontStyle: 'italic' }}>-</span>
                    )}
                  </td>
                  <td>{registration.eventTitle}</td>
                  <td>{new Date(registration.createdAt || 0).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(registration.id!)}
                      className="adm-btn adm-btn--danger adm-btn--icon"
                      title="Delete registration"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="adm-empty">
            <div className="adm-empty__title">No Registrations Found</div>
            <div className="adm-empty__description">Adjust your filters or search terms to find registrations.</div>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {filteredRegs.length > 0 && (
        <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)', marginTop: '16px', textAlign: 'right' }}>
          Showing {filteredRegs.length} of {registrations.length} registrations
        </div>
      )}
    </div>
  );
};
