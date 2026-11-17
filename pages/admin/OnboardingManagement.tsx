import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Download, 
  RefreshCw, 
  Check, 
  Copy, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  Sparkles, 
  X, 
  User, 
  Share2, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export interface OnboardingApp {
  id: string;
  name: string;
  email: string;
  contact?: string | null;
  college?: string | null;
  year?: string | null;
  interest?: string | null;
  skills?: string | null;
  reason?: string | null;
  social?: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted' | string;
  member_id?: string | null;
  feedback_reason?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export const OnboardingManagement: React.FC = () => {
  const [apps, setApps] = useState<OnboardingApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<OnboardingApp | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch applications directly from Supabase
  const fetchApplications = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase
        .from('onboarding_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching from Supabase:', error);
        toast.error('Failed to load applications from Supabase');
      } else {
        setApps(data || []);
        if (isManual) toast.success('Applications refreshed');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Unexpected error loading applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();

    // Subscribe to live Postgres changes
    const channel = supabase
      .channel('onboarding-live-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'onboarding_applications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setApps((prev) => [payload.new as OnboardingApp, ...prev]);
            toast('New application received!', { icon: '✨' });
          } else if (payload.eventType === 'UPDATE') {
            setApps((prev) =>
              prev.map((app) => (app.id === payload.new.id ? (payload.new as OnboardingApp) : app))
            );
            if (selectedApp && selectedApp.id === payload.new.id) {
              setSelectedApp(payload.new as OnboardingApp);
            }
          } else if (payload.eventType === 'DELETE') {
            setApps((prev) => prev.filter((app) => app.id === payload.old.id));
            if (selectedApp && selectedApp.id === payload.old.id) {
              setSelectedApp(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update Status in Supabase
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const updatingToast = toast.loading(`Updating status to ${newStatus.toUpperCase()}...`);
    try {
      const { error } = await supabase
        .from('onboarding_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setApps((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }

      toast.success(`Application marked as ${newStatus}`, { id: updatingToast });
    } catch (err: any) {
      console.error('Status update failed:', err);
      toast.error(err.message || 'Failed to update status', { id: updatingToast });
    }
  };

  // Delete Application
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this applicant permanently?')) return;

    const delToast = toast.loading('Deleting application...');
    try {
      const { error } = await supabase
        .from('onboarding_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApps((prev) => prev.filter((app) => app.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
      toast.success('Application deleted', { id: delToast });
    } catch (err: any) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete application', { id: delToast });
    }
  };

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredApps.length) {
      toast.error('No applications to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Contact', 'College', 'Year', 'Skills', 'Interest', 'Reason', 'Social', 'Status', 'Applied At'];
    const rows = filteredApps.map((a) => [
      `"${a.id}"`,
      `"${(a.name || '').replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${(a.contact || '').replace(/"/g, '""')}"`,
      `"${(a.college || '').replace(/"/g, '""')}"`,
      `"${(a.year || '').replace(/"/g, '""')}"`,
      `"${(a.skills || '').replace(/"/g, '""')}"`,
      `"${(a.interest || '').replace(/"/g, '""')}"`,
      `"${(a.reason || '').replace(/"/g, '""')}"`,
      `"${(a.social || '').replace(/"/g, '""')}"`,
      `"${a.status || 'pending'}"`,
      `"${new Date(a.created_at).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_404_society_onboarding_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  // Filtering
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.name?.toLowerCase().includes(q) ||
        app.email?.toLowerCase().includes(q) ||
        app.contact?.toLowerCase().includes(q) ||
        app.college?.toLowerCase().includes(q) ||
        app.skills?.toLowerCase().includes(q) ||
        app.interest?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [apps, statusFilter, search]);

  // Metrics
  const metrics = useMemo(() => {
    const total = apps.length;
    const pending = apps.filter((a) => a.status === 'pending').length;
    const approved = apps.filter((a) => a.status === 'approved').length;
    const rejected = apps.filter((a) => a.status === 'rejected').length;
    const acceptanceRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    return { total, pending, approved, rejected, acceptanceRate };
  }, [apps]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pb-24">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />

      {/* TOP HEADER */}
      <div className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-30 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
                SUPABASE SQL // ONBOARDING DATABASE
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1 text-white flex items-center gap-2">
              Onboarding Submissions
              <span className="text-xs font-mono font-normal bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                {metrics.total} Total
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchApplications(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white text-black hover:bg-zinc-200 font-semibold rounded-lg text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* METRIC STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Total Received</p>
            <p className="text-3xl font-bold tracking-tight text-white mt-1 font-mono">{metrics.total}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-[11px] font-mono text-amber-500/80 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Under Review
            </p>
            <p className="text-3xl font-bold tracking-tight text-amber-400 mt-1 font-mono">{metrics.pending}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-[11px] font-mono text-emerald-500/80 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Approved
            </p>
            <p className="text-3xl font-bold tracking-tight text-emerald-400 mt-1 font-mono">{metrics.approved}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Acceptance Rate</p>
            <p className="text-3xl font-bold tracking-tight text-zinc-200 mt-1 font-mono">{metrics.acceptanceRate}%</p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* SEARCH */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, college, skills..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 font-sans transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* STATUS FILTER PILLS */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => {
              const count =
                tab === 'all'
                  ? apps.length
                  : apps.filter((a) => a.status === tab).length;
              const active = statusFilter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg uppercase transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-white text-black font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${active ? 'bg-zinc-200 text-black' : 'bg-zinc-900 text-zinc-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* APPLICATIONS TABLE */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-zinc-500 mb-3" />
              <p className="text-zinc-500 font-mono text-xs">Querying Supabase database...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-24 text-center px-4">
              <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-zinc-300">No applications found</h3>
              <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
                {search || statusFilter !== 'all'
                  ? 'No results match your search and filter criteria.'
                  : 'No onboarding submissions have been submitted yet. Submissions to /join will appear here automatically.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Applicant</th>
                    <th className="py-3.5 px-6">College & Year</th>
                    <th className="py-3.5 px-6">Skills & Focus</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Applied Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="hover:bg-zinc-900/50 cursor-pointer transition-colors group"
                    >
                      {/* APPLICANT */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-zinc-300 group-hover:border-zinc-500 transition-colors">
                            {(app.name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-zinc-200 flex items-center gap-2">
                              {app.name}
                              {app.member_id && (
                                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                                  {app.member_id}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {app.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* COLLEGE & YEAR */}
                      <td className="py-4 px-6 text-xs text-zinc-300">
                        <div className="font-medium text-white">{app.college || '—'}</div>
                        <div className="text-zinc-500 text-[11px] font-mono mt-0.5">{app.year || '—'}</div>
                      </td>

                      {/* SKILLS */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="text-xs text-zinc-300 truncate font-mono">
                          {app.skills || app.interest || '—'}
                        </div>
                        {app.reason && (
                          <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                            "{app.reason}"
                          </div>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${
                            app.status === 'approved'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                              : app.status === 'rejected'
                              ? 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                              : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            app.status === 'approved' ? 'bg-emerald-400' : app.status === 'rejected' ? 'bg-rose-400' : 'bg-amber-400'
                          }`} />
                          {app.status ? app.status.toUpperCase() : 'PENDING'}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="py-4 px-6 text-xs font-mono text-zinc-500">
                        {new Date(app.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, app.status === 'approved' ? 'pending' : 'approved')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              app.status === 'approved'
                                ? 'text-emerald-400 hover:bg-emerald-950/60'
                                : 'text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800'
                            }`}
                            title={app.status === 'approved' ? 'Mark Pending' : 'Approve'}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xl">
                  {(selectedApp.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedApp.name}
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Applied {new Date(selectedApp.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans">
              {/* STATUS BAR */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Current Status:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                    selectedApp.status === 'approved'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : selectedApp.status === 'rejected'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {selectedApp.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'approved')}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-xs transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900 rounded-lg text-xs transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'pending')}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg text-xs transition-colors"
                  >
                    Reset Pending
                  </button>
                </div>
              </div>

              {/* CONTACT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  <p className="text-[11px] font-mono uppercase text-zinc-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" /> Email Address
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-white font-mono break-all">{selectedApp.email}</span>
                    <button
                      onClick={() => handleCopy(selectedApp.email, 'email')}
                      className="p-1 text-zinc-500 hover:text-white"
                      title="Copy email"
                    >
                      {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  <p className="text-[11px] font-mono uppercase text-zinc-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone / Contact
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-white font-mono">{selectedApp.contact || 'Not provided'}</span>
                    {selectedApp.contact && (
                      <button
                        onClick={() => handleCopy(selectedApp.contact || '', 'phone')}
                        className="p-1 text-zinc-500 hover:text-white"
                        title="Copy phone"
                      >
                        {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ACADEMICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  <p className="text-[11px] font-mono uppercase text-zinc-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-400" /> College / Institution
                  </p>
                  <p className="text-sm text-white font-medium mt-1">{selectedApp.college || '—'}</p>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  <p className="text-[11px] font-mono uppercase text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Year of Study
                  </p>
                  <p className="text-sm text-white font-medium mt-1">{selectedApp.year || '—'}</p>
                </div>
              </div>

              {/* SKILLS & INTEREST */}
              <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-3">
                <p className="text-[11px] font-mono uppercase text-zinc-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" /> Skills & Tech Stack
                </p>
                {selectedApp.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">None specified</p>
                )}

                {selectedApp.interest && (
                  <div className="pt-2 border-t border-zinc-900">
                    <p className="text-[11px] font-mono uppercase text-zinc-500">Domain Interest</p>
                    <p className="text-sm text-zinc-300 mt-0.5">{selectedApp.interest}</p>
                  </div>
                )}
              </div>

              {/* WHY JOIN REASON */}
              <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                <p className="text-[11px] font-mono uppercase text-zinc-500 mb-2">
                  Why do you want to join The 404 Society?
                </p>
                <div className="p-3 bg-black/60 border border-zinc-900 rounded-lg text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedApp.reason || 'No statement provided.'}
                </div>
              </div>

              {/* SOCIAL / PORTFOLIO */}
              {selectedApp.social && (
                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  <p className="text-[11px] font-mono uppercase text-zinc-500 flex items-center gap-1.5 mb-1">
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" /> Links & Social Profiles
                  </p>
                  <p className="text-sm text-zinc-300 font-mono break-all">{selectedApp.social}</p>
                </div>
              )}

              {/* SYSTEM METADATA */}
              <div className="pt-2 text-[11px] font-mono text-zinc-600 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-900">
                <span>Database ID: {selectedApp.id}</span>
                <span>Created: {new Date(selectedApp.created_at).toISOString()}</span>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedApp.id)}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Application
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 font-semibold rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OnboardingManagement;

