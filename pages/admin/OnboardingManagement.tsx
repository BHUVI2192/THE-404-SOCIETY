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
  FileText
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { generateMemberId } from '../../lib/memberIdService';
import { saveApprovedMember } from '../../lib/members';

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
      const targetApp = apps.find((a) => a.id === id);
      let memberId = targetApp?.member_id;

      if (newStatus === 'approved' && !memberId) {
        memberId = await generateMemberId();
      }

      const updatePayload: Record<string, any> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (memberId) {
        updatePayload.member_id = memberId;
      }

      const { error } = await supabase
        .from('onboarding_applications')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;

      if (newStatus === 'approved' && targetApp) {
        await saveApprovedMember({
          memberId: memberId || '404-2026-001',
          name: targetApp.name,
          email: targetApp.email,
          contact: targetApp.contact,
          college: targetApp.college,
          year: targetApp.year,
          interest: targetApp.interest,
          skills: targetApp.skills,
          social: targetApp.social,
          reason: targetApp.reason,
        });
      }

      setApps((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus, member_id: memberId || app.member_id } : app))
      );
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus, member_id: memberId || selectedApp.member_id });
      }

      toast.success(`Application marked as ${newStatus}${memberId ? ` (${memberId})` : ''}`, { id: updatingToast });
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
    <div className="min-h-screen text-black font-sans pb-24 relative z-10 selection:bg-black selection:text-white">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#000', color: '#fff', border: '1px solid #222', borderRadius: '10px' } }} />

      {/* TOP HEADER */}
      <div className="border-b border-black/10 bg-white/70 backdrop-blur-xl sticky top-0 z-30 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-500 font-bold">
                SUPABASE SQL // ONBOARDING DATABASE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-black flex items-center gap-2.5">
              Onboarding Submissions
              <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5 rounded-full">
                {metrics.total}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchApplications(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-zinc-50 border border-black/10 rounded-xl text-xs font-mono font-bold text-zinc-800 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-zinc-800 font-bold rounded-xl text-xs transition-all shadow-sm"
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
          <div className="bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-5 shadow-sm hover:border-black/20 transition-all">
            <p className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Total Received</p>
            <p className="text-3xl font-extrabold tracking-tight text-black mt-1 font-mono">{metrics.total}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-5 shadow-sm hover:border-black/20 transition-all">
            <p className="text-[11px] font-mono font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Under Review
            </p>
            <p className="text-3xl font-extrabold tracking-tight text-black mt-1 font-mono">{metrics.pending}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-5 shadow-sm hover:border-black/20 transition-all">
            <p className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Approved
            </p>
            <p className="text-3xl font-extrabold tracking-tight text-black mt-1 font-mono">{metrics.approved}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-5 shadow-sm hover:border-black/20 transition-all">
            <p className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Acceptance Rate</p>
            <p className="text-3xl font-extrabold tracking-tight text-black mt-1 font-mono">{metrics.acceptanceRate}%</p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* SEARCH */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, college, skills..."
              className="w-full bg-white/90 backdrop-blur-md border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all shadow-sm font-sans"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* STATUS FILTER PILLS */}
          <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-md border border-black/10 rounded-xl text-xs font-mono shadow-sm">
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
                  className={`px-3 py-1.5 rounded-lg uppercase transition-all flex items-center gap-1.5 font-bold ${
                    active
                      ? 'bg-black text-white'
                      : 'text-zinc-600 hover:text-black hover:bg-black/5'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* APPLICATIONS TABLE */}
        <div className="bg-white/90 backdrop-blur-xl border border-black/10 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-zinc-400 mb-3" />
              <p className="text-zinc-500 font-mono text-xs">Querying Supabase database...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-24 text-center px-4">
              <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-black">No applications found</h3>
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
                  <tr className="border-b border-black/10 bg-zinc-50/80 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="py-4 px-6 font-bold">Applicant</th>
                    <th className="py-4 px-6 font-bold">College & Year</th>
                    <th className="py-4 px-6 font-bold">Skills & Focus</th>
                    <th className="py-4 px-6 font-bold">Status</th>
                    <th className="py-4 px-6 font-bold">Applied Date</th>
                    <th className="py-4 px-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="hover:bg-black/[0.02] cursor-pointer transition-colors group"
                    >
                      {/* APPLICANT */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-mono font-bold text-sm">
                            {(app.name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-black group-hover:text-zinc-700 flex items-center gap-2">
                              {app.name}
                              {app.member_id && (
                                <span className="text-[10px] font-mono bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-black/10">
                                  {app.member_id}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3 text-zinc-400" />
                              {app.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* COLLEGE & YEAR */}
                      <td className="py-4 px-6 text-xs text-zinc-700">
                        <div className="font-semibold text-black">{app.college || '—'}</div>
                        <div className="text-zinc-500 text-[11px] font-mono mt-0.5">{app.year || '—'}</div>
                      </td>

                      {/* SKILLS */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="text-xs text-black font-semibold truncate font-mono">
                          {app.skills || app.interest || '—'}
                        </div>
                        {app.reason && (
                          <div className="text-[11px] text-zinc-500 truncate mt-0.5 italic">
                            "{app.reason}"
                          </div>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${
                            app.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            app.status === 'approved' ? 'bg-emerald-500' : app.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
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
                            className="p-1.5 text-zinc-500 hover:text-black hover:bg-black/5 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, app.status === 'approved' ? 'pending' : 'approved')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              app.status === 'approved'
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={app.status === 'approved' ? 'Mark Pending' : 'Approve'}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white border border-black/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg font-mono">
                  {(selectedApp.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-black flex items-center gap-2">
                    {selectedApp.name}
                  </h2>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">
                    Applied {new Date(selectedApp.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-zinc-400 hover:text-black rounded-lg hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans">
              {/* STATUS BAR */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-black/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-500 uppercase">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    selectedApp.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedApp.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedApp.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'approved')}
                    className="px-3.5 py-1.5 bg-black text-white hover:bg-zinc-800 font-bold rounded-lg text-xs transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                    className="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'pending')}
                    className="px-3.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-black/10 rounded-lg text-xs font-bold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* CONTACT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 border border-black/5 rounded-xl">
                  <p className="text-[11px] font-mono font-bold uppercase text-zinc-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" /> Email Address
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-black font-mono font-medium break-all">{selectedApp.email}</span>
                    <button
                      onClick={() => handleCopy(selectedApp.email, 'email')}
                      className="p-1 text-zinc-400 hover:text-black"
                      title="Copy email"
                    >
                      {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 border border-black/5 rounded-xl">
                  <p className="text-[11px] font-mono font-bold uppercase text-zinc-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone / Contact
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-black font-mono font-medium">{selectedApp.contact || 'Not provided'}</span>
                    {selectedApp.contact && (
                      <button
                        onClick={() => handleCopy(selectedApp.contact || '', 'phone')}
                        className="p-1 text-zinc-400 hover:text-black"
                        title="Copy phone"
                      >
                        {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ACADEMICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 border border-black/5 rounded-xl">
                  <p className="text-[11px] font-mono font-bold uppercase text-zinc-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-400" /> College / Institution
                  </p>
                  <p className="text-sm text-black font-semibold mt-1">{selectedApp.college || '—'}</p>
                </div>

                <div className="p-4 bg-zinc-50 border border-black/5 rounded-xl">
                  <p className="text-[11px] font-mono font-bold uppercase text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Year of Study
                  </p>
                  <p className="text-sm text-black font-semibold mt-1">{selectedApp.year || '—'}</p>
                </div>
              </div>

              {/* SKILLS & INTEREST */}
              <div className="p-4 bg-zinc-50 border border-black/5 rounded-xl space-y-3">
                <p className="text-[11px] font-mono font-bold uppercase text-zinc-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" /> Skills & Tech Stack
                </p>
                {selectedApp.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white border border-black/10 rounded-lg text-xs font-mono font-bold text-black shadow-2xs"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">None specified</p>
                )}

                {selectedApp.interest && (
                  <div className="pt-2 border-t border-black/5">
                    <p className="text-[11px] font-mono font-bold uppercase text-zinc-500">Domain Interest</p>
                    <p className="text-sm text-zinc-800 font-medium mt-0.5">{selectedApp.interest}</p>
                  </div>
                )}
              </div>

              {/* WHY JOIN REASON */}
              <div className="p-4 bg-zinc-50 border border-black/5 rounded-xl">
                <p className="text-[11px] font-mono font-bold uppercase text-zinc-500 mb-2">
                  Why do you want to join The 404 Society?
                </p>
                <div className="p-3.5 bg-white border border-black/5 rounded-lg text-zinc-800 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedApp.reason || 'No statement provided.'}
                </div>
              </div>

              {/* SOCIAL / PORTFOLIO */}
              {selectedApp.social && (
                <div className="p-4 bg-zinc-50 border border-black/5 rounded-xl">
                  <p className="text-[11px] font-mono font-bold uppercase text-zinc-500 flex items-center gap-1.5 mb-1">
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" /> Links & Social Profiles
                  </p>
                  <p className="text-sm text-black font-mono break-all font-medium">{selectedApp.social}</p>
                </div>
              )}

              {/* SYSTEM METADATA */}
              <div className="pt-2 text-[11px] font-mono text-zinc-400 flex flex-wrap items-center justify-between gap-2 border-t border-black/5">
                <span>Database ID: {selectedApp.id}</span>
                <span>Created: {new Date(selectedApp.created_at).toISOString()}</span>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-4 border-t border-black/10 bg-zinc-50 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedApp.id)}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Application
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-black text-white hover:bg-zinc-800 font-bold rounded-xl text-xs transition-colors"
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
