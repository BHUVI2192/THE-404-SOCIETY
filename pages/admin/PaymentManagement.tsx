import React, { useState, useEffect } from 'react';
import { subscribeToPayments, exportPaymentsToCSV } from '../../lib/payments';
import { PaymentData } from '../../types';
import { subscribeToEvents, EventData } from '../../lib/events';
import toast from 'react-hot-toast';
import { Download, Search, TrendingUp, CreditCard, DollarSign, AlertCircle } from 'lucide-react';

interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  capturedPayments: number;
  pendingPayments: number;
  failedPayments: number;
}

export const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    totalPayments: 0,
    capturedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  });

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to payments
    const unsubscribePayments = subscribeToPayments((data) => {
      setPayments(data);
      calculateStats(data);
      setLoading(false);
    });

    // Subscribe to events for filter dropdown
    const unsubscribeEvents = subscribeToEvents((data) => {
      setEvents(data);
    });

    return () => {
      unsubscribePayments();
      unsubscribeEvents();
    };
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, filterEvent, filterStatus]);

  const calculateStats = (paymentData: PaymentData[]) => {
    const totalRevenue = paymentData
      .filter((p) => p.status === 'success')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const capturedPayments = paymentData.filter((p) => p.status === 'success').length;
    const pendingPayments = paymentData.filter((p) => p.status === 'pending').length;
    const failedPayments = paymentData.filter((p) => p.status === 'failed').length;

    setStats({
      totalRevenue: totalRevenue / 100, // Convert paise to rupees
      totalPayments: paymentData.length,
      capturedPayments,
      pendingPayments,
      failedPayments,
    });
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.razorpayOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.registrationId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterEvent !== 'all') {
      filtered = filtered.filter((payment) => payment.eventId === filterEvent);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((payment) => payment.status === filterStatus);
    }

    setFilteredPayments(filtered);
  };

  const handleExportCSV = async () => {
    try {
      toast.loading('Exporting payments...', { id: 'export-payments' });
      exportPaymentsToCSV(filteredPayments);
      toast.success('Payments exported successfully', { id: 'export-payments' });
    } catch (error) {
      toast.error('Failed to export payments', { id: 'export-payments' });
    }
  };

  const getStatusBadge = (status: string) => {
    let badgeType = 'adm-badge--warning';
    if (status === 'success' || status === 'captured') badgeType = 'adm-badge--success';
    if (status === 'failed') badgeType = 'adm-badge--danger';

    return (
      <span className={`adm-badge ${badgeType}`}>
        {status}
      </span>
    );
  };

  const formatAmount = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="adm-page">
      {/* Header with CTA */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Payment Management</h1>
          <p className="adm-page__subtitle">Track and manage event payments via Razorpay</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredPayments.length === 0}
          className="adm-btn adm-btn--primary"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Minimalist Stats Grid */}
      <div className="adm-stats-grid">
        <div className="adm-stat-card">
          <div className="adm-stat-card__icon">
            <DollarSign className="w-5 h-5 text-black" />
          </div>
          <div className="adm-stat-card__label">Total Revenue</div>
          <div className="adm-stat-card__value">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
          <div className="adm-stat-card__sub">{stats.capturedPayments} successful payments</div>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-card__icon">
            <CreditCard className="w-5 h-5 text-black" />
          </div>
          <div className="adm-stat-card__label">Total Payments</div>
          <div className="adm-stat-card__value">{stats.totalPayments}</div>
          <div className="adm-stat-card__sub">All recorded transactions</div>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-card__icon">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div className="adm-stat-card__label">Pending</div>
          <div className="adm-stat-card__value">{stats.pendingPayments}</div>
          <div className="adm-stat-card__sub">Awaiting confirmation</div>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-card__icon">
            <AlertCircle className="w-5 h-5 text-black" />
          </div>
          <div className="adm-stat-card__label">Failed</div>
          <div className="adm-stat-card__value">{stats.failedPayments}</div>
          <div className="adm-stat-card__sub">Unsuccessful attempts</div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <div className="adm-search__icon">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="adm-search__input"
          />
        </div>

        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="adm-select"
          style={{ flex: '0 0 200px' }}
        >
          <option value="all">All Events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="adm-select"
          style={{ flex: '0 0 160px' }}
        >
          <option value="all">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Results Count */}
      <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)', fontFamily: 'var(--adm-font-mono)', marginBottom: '14px' }}>
        Showing {filteredPayments.length} of {payments.length} payments
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="adm-loading">Loading payments...</div>
      ) : filteredPayments.length === 0 ? (
        <div className="adm-table-wrapper">
          <div className="adm-empty">
            <CreditCard className="w-12 h-12 text-zinc-300 mb-3" />
            <div className="adm-empty__title">No payments found</div>
            <div className="adm-empty__description">
              {searchTerm || filterEvent !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Payments will appear here once users make event registrations'}
            </div>
          </div>
        </div>
      ) : (
        <div className="adm-table-wrapper">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Order / Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '12px', fontFamily: 'var(--adm-font-mono)' }}>
                    {payment.createdAt ? formatDate(payment.createdAt) : '-'}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--adm-text)' }}>{payment.userName || '-'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)' }}>{payment.userEmail || '-'}</div>
                    {payment.userPhone && (
                      <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)', fontFamily: 'var(--adm-font-mono)' }}>
                        {payment.userPhone}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {events.find((e) => e.id === payment.eventId)?.title || payment.eventId}
                  </td>
                  <td style={{ fontFamily: 'var(--adm-font-mono)', fontWeight: 700, color: 'var(--adm-text)' }}>
                    {formatAmount(payment.amount)}
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: '12px' }}>
                    {payment.paymentMethod || '-'}
                  </td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span className="adm-tag" style={{ fontSize: '11px' }}>
                        {payment.razorpayOrderId || payment.razorpayPaymentId || '-'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
