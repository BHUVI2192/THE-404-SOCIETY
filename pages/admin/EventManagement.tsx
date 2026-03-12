import React, { useState, useEffect } from 'react';
import { subscribeToEvents, addEvent, updateEvent, deleteEvent, EventData } from '../../lib/events';
import toast from 'react-hot-toast';
import { processImageFile } from '../../lib/imageUpload';

type FormMode = 'create' | 'edit' | null;

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<Omit<EventData, 'id' | 'createdAt'>>({
    title: '',
    date: '',
    year: '',
    location: '',
    img: '',
    status: 'open',
    category: '',
    description: '',
    pricing: {
      isFree: true,
      amount: 0,
      currency: 'INR',
    },
    maxRegistrations: undefined,
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToEvents((data) => {
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      year: '',
      location: '',
      img: '',
      status: 'open',
      category: '',
      description: '',
      pricing: {
        isFree: true,
        amount: 0,
        currency: 'INR',
      },
      maxRegistrations: undefined,
    });
    setImagePreview('');
    setEditingId(null);
    setFormMode(null);
  };

  const handleEdit = (event: EventData) => {
    setFormData(event);
    setImagePreview(event.img);
    setEditingId(event.id || null);
    setFormMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (formMode === 'create') {
        await addEvent(formData);
        toast.success('Event created successfully');
      } else if (formMode === 'edit' && editingId) {
        await updateEvent(editingId, formData);
        toast.success('Event updated successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true);
        await deleteEvent(id);
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error('Failed to delete event');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'locked' : 'open';
    try {
      await updateEvent(id, { status: newStatus as 'open' | 'locked' });
      toast.success(`Event status changed to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await processImageFile(file);
      if (result) {
        setFormData({ ...formData, img: result.base64 });
        setImagePreview(result.base64);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="adm-page">
      {/* Header with CTA */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Events Management</h1>
          <p className="adm-page__subtitle">Create, edit, and manage events</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setFormMode('create');
          }}
          className="adm-btn adm-btn--primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Form Modal */}
      {formMode && (
        <div className="adm-modal">
          <div className="adm-modal__content">
            <div className="adm-modal__header">
              <h3 className="adm-modal__title">
                {formMode === 'create' ? 'Create New Event' : 'Edit Event'}
              </h3>
              <button className="adm-modal__close" onClick={resetForm}>✕</button>
            </div>

            <div className="adm-modal__body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="adm-form-group">
                    <label className="adm-form-label adm-form-label--required">Title</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="Event title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Date</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g., MAR 15"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Year</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g., 2026"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label adm-form-label--required">Location</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="Event location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="Event category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Status</label>
                    <select
                      className="adm-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'open' | 'locked' })}
                    >
                      <option value="open">Open</option>
                      <option value="locked">Locked</option>
                    </select>
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Event Image</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        className="adm-input"
                        onChange={handleImageUpload}
                        style={{ cursor: 'pointer' }}
                      />
                      <small style={{ color: '#888', marginTop: '4px', display: 'block' }}>
                        Accepted: JPG, PNG, WebP, GIF (Max 5MB)
                      </small>
                    </div>
                    {imagePreview && (
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        flexShrink: 0
                      }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description</label>
                  <textarea
                    className="adm-input adm-textarea"
                    placeholder="Event description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Pricing Configuration Section */}
                <div style={{ 
                  marginTop: '20px', 
                  padding: '16px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    marginBottom: '16px',
                    color: '#333'
                  }}>💳 Pricing Configuration</h4>
                  
                  <div className="adm-form-group">
                    <label className="adm-form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.pricing?.isFree !== false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pricing: {
                            ...formData.pricing!,
                            isFree: e.target.checked,
                            amount: e.target.checked ? 0 : (formData.pricing?.amount || 0)
                          }
                        })}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>This is a FREE event</span>
                    </label>
                  </div>

                  {formData.pricing?.isFree === false && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                        <div className="adm-form-group">
                          <label className="adm-form-label adm-form-label--required">Registration Fee (₹)</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="adm-input"
                            placeholder="e.g., 500"
                            value={formData.pricing?.amount ? formData.pricing.amount / 100 : ''}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              const rupees = raw === '' ? 0 : parseInt(raw, 10);
                              setFormData({ 
                                ...formData, 
                                pricing: {
                                  ...formData.pricing!,
                                  amount: rupees * 100 // Convert to paise
                                }
                              });
                            }}
                          />
                          <small style={{ color: '#888', marginTop: '4px', display: 'block' }}>
                            Amount will be charged via Razorpay gateway
                          </small>
                        </div>

                        <div className="adm-form-group">
                          <label className="adm-form-label">Max Registrations</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="adm-input"
                            placeholder="No limit"
                            value={formData.maxRegistrations || ''}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              setFormData({ 
                                ...formData, 
                                maxRegistrations: raw ? parseInt(raw, 10) : undefined
                              });
                            }}
                          />
                        </div>
                      </div>

                      {/* Early Bird Discount Section */}
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
                        <div className="adm-form-group">
                          <label className="adm-form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.pricing?.earlyBirdDiscount?.enabled || false}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                pricing: {
                                  ...formData.pricing!,
                                  earlyBirdDiscount: e.target.checked ? {
                                    enabled: true,
                                    discountPercent: 10,
                                    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                  } : undefined
                                }
                              })}
                              style={{ width: '18px', height: '18px' }}
                            />
                            <span>🎯 Enable Early Bird Discount</span>
                          </label>
                        </div>

                        {formData.pricing?.earlyBirdDiscount?.enabled && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                            <div className="adm-form-group">
                              <label className="adm-form-label">Discount Percentage (%)</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="adm-input"
                                placeholder="e.g., 20"
                                value={formData.pricing?.earlyBirdDiscount?.discountPercent || ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  const val = raw === '' ? 0 : Math.min(100, parseInt(raw, 10));
                                  setFormData({ 
                                    ...formData, 
                                    pricing: {
                                      ...formData.pricing!,
                                      earlyBirdDiscount: {
                                        ...formData.pricing!.earlyBirdDiscount!,
                                        discountPercent: val
                                      }
                                    }
                                  });
                                }}
                              />
                              {formData.pricing?.earlyBirdDiscount?.discountPercent && formData.pricing.amount && (
                                <small style={{ color: '#10b981', marginTop: '4px', display: 'block' }}>
                                  Discounted price: ₹{((formData.pricing.amount / 100) * (1 - formData.pricing.earlyBirdDiscount.discountPercent / 100)).toFixed(2)}
                                </small>
                              )}
                            </div>

                            <div className="adm-form-group">
                              <label className="adm-form-label">Valid Until</label>
                              <input
                                type="date"
                                className="adm-input"
                                value={formData.pricing?.earlyBirdDiscount?.validUntil?.split('T')[0] || ''}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  pricing: {
                                    ...formData.pricing!,
                                    earlyBirdDiscount: {
                                      ...formData.pricing!.earlyBirdDiscount!,
                                      validUntil: e.target.value
                                    }
                                  }
                                })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={resetForm}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="adm-table-wrapper">
        {events.length > 0 ? (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="adm-table__primary">{event.title}</td>
                  <td>{event.date} {event.year}</td>
                  <td>{event.location}</td>
                  <td>
                    <span className="adm-badge adm-badge--info">
                      {event.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleStatusToggle(event.id!, event.status)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <span className={`adm-badge adm-badge--${event.status === 'open' ? 'success' : 'danger'}`}>
                        {event.status === 'open' ? 'Open' : 'Locked'}
                      </span>
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(event)}
                        className="adm-btn adm-btn--ghost adm-btn--icon"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id!)}
                        className="adm-btn adm-btn--danger adm-btn--icon"
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="adm-empty">
            <div className="adm-empty__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="adm-empty__title">No Events</div>
            <div className="adm-empty__description">
              Create your first event to get started managing your events.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
