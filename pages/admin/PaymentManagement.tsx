import React, { useState, useEffect } from 'react';
import { subscribeToPayments, exportPaymentsToCSV, getEventPaymentStats } from '../../lib/payments';
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
      await exportPaymentsToCSV(filteredPayments);
      toast.success('Exported to CSV');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      captured: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      refunded: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-bold uppercase rounded border-2 ${
          statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
        }`}
      >
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
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase text-gray-600">Total Revenue</span>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-black">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-500 mt-1">
            From {stats.capturedPayments} successful payments
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase text-gray-600">Total Payments</span>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-black">{stats.totalPayments}</div>
          <div className="text-xs text-gray-500 mt-1">All payment transactions</div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase text-gray-600">Pending</span>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-black">{stats.pendingPayments}</div>
          <div className="text-xs text-gray-500 mt-1">Awaiting confirmation</div>
        </div>

        {/* Failed Payments */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase text-gray-600">Failed</span>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-3xl font-black">{stats.failedPayments}</div>
          <div className="text-xs text-gray-500 mt-1">Unsuccessful attempts</div>
        </div>
      </div>

      {/* Filters */}
      <div className="adm-filters">
        <div className="adm-search">
          <Search className="w-5 h-5 text-gray-400" />
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
        >
          <option value="all">All Statuses</option>
          <option value="captured">Captured</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="adm-results-count">
        Showing {filteredPayments.length} of {payments.length} payments
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="adm-loading">Loading payments...</div>
      ) : filteredPayments.length === 0 ? (
        <div className="adm-empty">
          <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold mb-2">No payments found</h3>
          <p className="text-gray-600">
            {searchTerm || filterEvent !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Payments will appear here once users make event registrations'}
          </p>
        </div>
      ) : (
        <div className="adm-table-container">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Order ID</th>
                <th>Payment ID</th>
                <th>Registration ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="whitespace-nowrap">
                    {payment.createdAt ? formatDate(payment.createdAt) : '-'}
                  </td>
                  <td>
                    <div className="font-medium">{payment.userName || '-'}</div>
                    <div className="text-xs text-gray-500">{payment.userEmail || '-'}</div>
                    {payment.userPhone && (
                      <div className="text-xs text-gray-500">{payment.userPhone}</div>
                    )}
                  </td>
                  <td>
                    <div className="font-medium">
                      {events.find((e) => e.id === payment.eventId)?.title || payment.eventId}
                    </div>
                  </td>
                  <td className="font-bold">{formatAmount(payment.amount)}</td>
                  <td className="capitalize">{payment.paymentMethod || '-'}</td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {payment.razorpayOrderId || '-'}
                    </code>
                  </td>
                  <td>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {payment.razorpayPaymentId || '-'}
                    </code>
                  </td>
                  <td>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {payment.registrationId || '-'}
                    </code>
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
