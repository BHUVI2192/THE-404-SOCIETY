import React, { useState, useEffect } from 'react';
import {
  getEmailTemplates,
  updateEmailTemplate,
  toggleEmailTemplate,
  initializeTemplates,
} from '../../lib/emailTemplates';
import { getEmailLogs } from '../../lib/emailLog';
import { EmailTemplate } from '../../types';
import { EmailLog } from '../../types';
import toast from 'react-hot-toast';

type TabType = 'templates' | 'logs';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Partial<EmailTemplate> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Initialize templates if needed
      await initializeTemplates();
      const [tmpl, emailLogs] = await Promise.all([
        getEmailTemplates(),
        getEmailLogs(),
      ]);
      setTemplates(tmpl);
      setLogs(emailLogs);
    } catch (error) {
      console.error('[AdminSettings] Error loading data:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingId(template.id);
    setEditingTemplate({ ...template });
  };

  const handleSaveTemplate = async () => {
    if (!editingId || !editingTemplate) return;

    try {
      setLoading(true);
      await updateEmailTemplate(editingId, {
        subject: editingTemplate.subject,
        body: editingTemplate.body,
      });
      toast.success('Template updated');
      setEditingId(null);
      setEditingTemplate(null);
      await loadData();
    } catch (error) {
      toast.error('Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTemplate = async (id: string) => {
    try {
      await toggleEmailTemplate(id);
      toast.success('Template updated');
      await loadData();
    } catch (error) {
      toast.error('Failed to toggle template');
    }
  };

  const getTriggerLabel = (trigger: string): string => {
    const labels: Record<string, string> = {
      applicationReceived: '📨 Application Received',
      applicationApproved: '✅ Application Approved',
      applicationRejected: '❌ Application Rejected',
      applicationWaitlisted: '⏳ Application Waitlisted',
    };
    return labels[trigger] || trigger;
  };

  const getTriggerColor = (trigger: string): string => {
    const colors: Record<string, string> = {
      applicationReceived: 'adm-badge--info',
      applicationApproved: 'adm-badge--success',
      applicationRejected: 'adm-badge--danger',
      applicationWaitlisted: 'adm-badge--warning',
    };
    return colors[trigger] || '';
  };

  return (
    <div className="adm-page">
      {/* Header */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Settings</h1>
          <p className="adm-page__subtitle">Manage email templates and view activity logs</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--adm-border)', paddingBottom: '0' }}>
        <button
          onClick={() => setActiveTab('templates')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'templates' ? '2px solid var(--adm-accent)' : 'none',
            color: activeTab === 'templates' ? 'var(--adm-accent)' : 'var(--adm-text-muted)',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
        >
          Email Templates
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'logs' ? '2px solid var(--adm-accent)' : 'none',
            color: activeTab === 'logs' ? 'var(--adm-accent)' : 'var(--adm-text-muted)',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
        >
          Email Logs
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div>
          {templates.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty__title">No Templates Found</div>
              <div className="adm-empty__description">Loading templates...</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="adm-table-wrapper"
                  style={{ padding: '24px' }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--adm-text)', marginBottom: '8px' }}>
                        {getTriggerLabel(template.trigger)}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`adm-badge ${getTriggerColor(template.trigger)}`}>
                          {template.trigger}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            background: template.enabled ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                            color: template.enabled ? 'rgb(34, 197, 94)' : 'rgb(107, 114, 128)',
                          }}
                        >
                          {template.enabled ? '✓ Enabled' : '✗ Disabled'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleTemplate(template.id)}
                      className="adm-btn adm-btn--secondary"
                      disabled={loading}
                    >
                      {template.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  {editingId === template.id ? (
                    <>
                      {/* Edit Mode */}
                      <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '16px', marginTop: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--adm-text-muted)', display: 'block', marginBottom: '8px' }}>
                            Subject
                          </label>
                          <input
                            type="text"
                            value={editingTemplate?.subject || ''}
                            onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid var(--adm-border)',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontFamily: 'inherit',
                              color: 'var(--adm-text)',
                              background: 'var(--adm-bg-secondary)',
                              boxSizing: 'border-box',
                            }}
                          />
                          <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', marginTop: '6px' }}>
                            Available variables: {template.variables.map((v) => `{{${v}}}`).join(', ')}
                          </p>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--adm-text-muted)', display: 'block', marginBottom: '8px' }}>
                            Body
                          </label>
                          <textarea
                            value={editingTemplate?.body || ''}
                            onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                            style={{
                              width: '100%',
                              minHeight: '300px',
                              padding: '12px',
                              border: '1px solid var(--adm-border)',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontFamily: 'monospace',
                              color: 'var(--adm-text)',
                              background: 'var(--adm-bg-secondary)',
                              boxSizing: 'border-box',
                              resize: 'vertical',
                            }}
                          />
                          <p style={{ fontSize: '11px', color: 'var(--adm-text-muted)', marginTop: '6px' }}>
                            Use double curly braces for variables: name, member_id, whatsapp_link, feedback, etc.
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={handleSaveTemplate}
                            className="adm-btn adm-btn--primary"
                            disabled={loading}
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingTemplate(null);
                            }}
                            className="adm-btn adm-btn--secondary"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* View Mode */}
                      <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '16px', marginTop: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--adm-text-muted)', marginBottom: '6px' }}>
                            SUBJECT
                          </p>
                          <p style={{ fontSize: '13px', color: 'var(--adm-text-secondary)', fontFamily: 'monospace', background: 'var(--adm-bg-secondary)', padding: '12px', borderRadius: '4px' }}>
                            {template.subject}
                          </p>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--adm-text-muted)', marginBottom: '6px' }}>
                            BODY
                          </p>
                          <pre
                            style={{
                              fontSize: '12px',
                              color: 'var(--adm-text-secondary)',
                              fontFamily: 'monospace',
                              background: 'var(--adm-bg-secondary)',
                              padding: '12px',
                              borderRadius: '4px',
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word',
                              maxHeight: '300px',
                              overflowY: 'auto',
                            }}
                          >
                            {template.body}
                          </pre>
                        </div>

                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="adm-btn adm-btn--primary"
                          disabled={loading}
                        >
                          Edit Template
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div>
          {logs.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty__title">No Email Logs</div>
              <div className="adm-empty__description">No emails have been sent yet.</div>
            </div>
          ) : (
            <div className="adm-table-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--adm-border)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--adm-text-muted)', textTransform: 'uppercase' }}>
                      Recipient
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--adm-text-muted)', textTransform: 'uppercase' }}>
                      Subject
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--adm-text-muted)', textTransform: 'uppercase' }}>
                      Trigger
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--adm-text-muted)', textTransform: 'uppercase' }}>
                      Status
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--adm-text-muted)', textTransform: 'uppercase' }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--adm-border)' }}>
                      <td style={{ padding: '12px', fontSize: '13px', color: 'var(--adm-text-secondary)' }}>
                        {log.recipientName}
                        <br />
                        <span style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>
                          {log.recipientEmail}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: 'var(--adm-text-secondary)', maxWidth: '300px' }}>
                        {log.subject}
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px' }}>
                        <span className={`adm-badge ${getTriggerColor(log.trigger)}`}>
                          {log.trigger}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            background: log.status === 'sent' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: log.status === 'sent' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                            display: 'inline-block',
                          }}
                        >
                          {log.status === 'sent' ? '✓ Sent' : '✗ Failed'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: 'var(--adm-text-muted)' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
