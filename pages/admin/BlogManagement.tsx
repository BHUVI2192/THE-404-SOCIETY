import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { subscribeToBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost, BlogPostData } from '../../lib/blog';
import { processImageFile } from '../../lib/imageUpload';

export const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    date: '',
    colSpan: 1,
    rowSpan: 1,
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToBlogPosts((data) => {
      setBlogs(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddBlog = async () => {
    if (!formData.title.trim() || !formData.category.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields (title, category, content)');
      return;
    }

    try {
      if (editingId) {
        await updateBlogPost(editingId, formData);
        toast.success('Blog updated successfully');
      } else {
        await addBlogPost(formData);
        toast.success('Blog created successfully');
      }
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('[BlogManagement] Error saving blog:', error);
      toast.error('Failed to save blog');
    }
  };

  const handleEdit = (blog: BlogPostData) => {
    setEditingId(blog.id || null);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      content: blog.content,
      image: blog.image,
      date: blog.date,
      colSpan: blog.colSpan || 1,
      rowSpan: blog.rowSpan || 1,
    });
    setImagePreview(blog.image);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await deleteBlogPost(id);
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('[BlogManagement] Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await processImageFile(file);
      if (result) {
        setFormData({ ...formData, image: result.base64 });
        setImagePreview(result.base64);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      image: '',
      date: '',
      colSpan: 1,
      rowSpan: 1,
    });
    setImagePreview('');
    setEditingId(null);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.authorName && blog.authorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="adm-page">
      {/* Header with CTA */}
      <div className="adm-page__header">
        <div>
          <h1 className="adm-page__title">Blogs Management</h1>
          <p className="adm-page__subtitle">Create, edit, and manage blog posts</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="adm-btn adm-btn--primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Blog
        </button>
      </div>

      {/* Search Bar */}
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
            placeholder="Search by title or category..."
            className="adm-search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blog Form Modal */}
      {showModal && (
        <div className="adm-modal">
          <div className="adm-modal__content">
            <div className="adm-modal__header">
              <h3 className="adm-modal__title">{editingId ? 'Edit Blog' : 'New Blog Post'}</h3>
              <button
                className="adm-modal__close"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            <div className="adm-modal__body">
              <div className="space-y-4">
                <div className="adm-form-group">
                  <label className="adm-form-label adm-form-label--required">Title</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="Blog title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="adm-form-group">
                    <label className="adm-form-label adm-form-label--required">Category</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g., TECH, TUTORIAL"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Date</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g., FEB 10, 2026"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Featured Image</label>
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
                  <label className="adm-form-label">Excerpt</label>
                  <textarea
                    className="adm-input adm-textarea"
                    placeholder="Brief summary"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    style={{ minHeight: '60px' }}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label adm-form-label--required">Content</label>
                  <textarea
                    className="adm-input adm-textarea"
                    placeholder="Blog content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{ minHeight: '150px' }}
                  />
                </div>
              </div>
            </div>

            <div className="adm-modal__footer">
              <button
                className="adm-btn adm-btn--ghost"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button className="adm-btn adm-btn--primary" onClick={handleAddBlog}>
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blogs Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="adm-spinner"></div>
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="adm-table-wrapper">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="adm-table__primary">{blog.title}</td>
                  <td>
                    <span className="adm-badge adm-badge--info">{blog.category}</span>
                  </td>
                  <td>{blog.date}</td>
                  <td>{new Date(blog.createdAt || 0).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="adm-btn adm-btn--ghost adm-btn--icon"
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => blog.id && handleDelete(blog.id)}
                        className="adm-btn adm-btn--danger adm-btn--icon"
                        title="Delete"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="adm-empty">
          <div className="adm-empty__title">No Blogs Found</div>
          <div className="adm-empty__description">
            {searchTerm ? 'Try different search terms' : 'Create your first blog post to get started'}
          </div>
        </div>
      )}
    </div>
  );
};
