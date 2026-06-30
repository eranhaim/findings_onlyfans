import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminCreateProfile, adminUpdateProfile, adminFetchProfile } from '../api';
import { FaArrowLeft, FaSave, FaInstagram, FaTwitter, FaTiktok, FaSnapchat, FaYoutube, FaTelegram, FaReddit, FaGlobe } from 'react-icons/fa';
import './Admin.css';

const EMPTY_PROFILE = {
  name: '',
  username: '',
  avatar: '',
  likes: 0,
  photos: 0,
  videos: 0,
  price: 0,
  isFree: false,
  isNewModel: true,
  isOnline: false,
  bio: { en: '', he: '', fr: '' },
  tags: '',
  category: 'popular',
  previewVideo: '',
  onlyfansLink: '',
  socialLinks: {
    instagram: '',
    twitter: '',
    tiktok: '',
    snapchat: '',
    youtube: '',
    telegram: '',
    reddit: '',
    website: '',
  },
  age: '',
  location: '',
  ethnicity: '',
  bodyType: '',
  hair: '',
  eyes: '',
  isVerified: false,
};

export default function ProfileForm() {
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin');
      return;
    }
    if (isEdit) {
      loadProfile();
    }
  }, [id, navigate]);

  const loadProfile = async () => {
    try {
      const p = await adminFetchProfile(id);
      setForm({
        ...p,
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
        age: p.age || '',
        socialLinks: { ...EMPTY_PROFILE.socialLinks, ...p.socialLinks },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setBio = (lang, value) => {
    setForm((prev) => ({ ...prev, bio: { ...prev.bio, [lang]: value } }));
  };

  const setSocial = (platform, value) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const payload = {
      ...form,
      tags: typeof form.tags === 'string'
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : form.tags,
      age: form.age ? parseInt(form.age) : null,
      price: parseFloat(form.price) || 0,
      likes: parseInt(form.likes) || 0,
      photos: parseInt(form.photos) || 0,
      videos: parseInt(form.videos) || 0,
    };

    try {
      if (isEdit) {
        await adminUpdateProfile(id, payload);
        setSuccess('Profile updated successfully!');
      } else {
        await adminCreateProfile(payload);
        setSuccess('Profile created successfully!');
        setTimeout(() => navigate('/admin/dashboard'), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page"><div className="admin-loading">Loading...</div></div>;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-logo-icon">❤</span>
          <span className="admin-logo-text">FansFinder</span>
          <span className="admin-badge">ADMIN</span>
        </div>
        <div className="admin-header-right">
          <Link to="/admin/dashboard" className="admin-btn outline small">
            <FaArrowLeft /> Back
          </Link>
        </div>
      </header>

      <main className="admin-main">
        <h1 className="admin-form-title">{isEdit ? 'Edit Model' : 'Add New Model'}</h1>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          {/* ─── Basic Info ─── */}
          <section className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Display Name *</label>
                <input type="text" className="admin-input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Username *</label>
                <input type="text" className="admin-input" value={form.username} onChange={(e) => set('username', e.target.value)} required placeholder="e.g. kaylabumssyy" />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input type="url" className="admin-input" value={form.avatar} onChange={(e) => set('avatar', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" className="admin-input" value={form.age} onChange={(e) => set('age', e.target.value)} min="18" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" className="admin-input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Los Angeles, CA" />
              </div>
              <div className="form-group">
                <label>Ethnicity</label>
                <input type="text" className="admin-input" value={form.ethnicity} onChange={(e) => set('ethnicity', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Body Type</label>
                <input type="text" className="admin-input" value={form.bodyType} onChange={(e) => set('bodyType', e.target.value)} placeholder="e.g. Athletic, Slim, Curvy" />
              </div>
              <div className="form-group">
                <label>Hair Color</label>
                <input type="text" className="admin-input" value={form.hair} onChange={(e) => set('hair', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Eye Color</label>
                <input type="text" className="admin-input" value={form.eyes} onChange={(e) => set('eyes', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ─── OnlyFans & Stats ─── */}
          <section className="form-section">
            <h3 className="form-section-title">OnlyFans Details</h3>
            <div className="form-grid">
              <div className="form-group full">
                <label>OnlyFans Link</label>
                <input type="url" className="admin-input" value={form.onlyfansLink} onChange={(e) => set('onlyfansLink', e.target.value)} placeholder="https://onlyfans.com/username" />
              </div>
              <div className="form-group full">
                <label>Preview Video URL (shown on hover)</label>
                <input type="url" className="admin-input" value={form.previewVideo} onChange={(e) => set('previewVideo', e.target.value)} placeholder="https://... or S3 key (e.g. profiles/.../media/video.mp4)" />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" className="admin-input" value={form.price} onChange={(e) => set('price', e.target.value)} min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Likes</label>
                <input type="number" className="admin-input" value={form.likes} onChange={(e) => set('likes', e.target.value)} min="0" />
              </div>
              <div className="form-group">
                <label>Photos</label>
                <input type="number" className="admin-input" value={form.photos} onChange={(e) => set('photos', e.target.value)} min="0" />
              </div>
              <div className="form-group">
                <label>Videos</label>
                <input type="number" className="admin-input" value={form.videos} onChange={(e) => set('videos', e.target.value)} min="0" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="admin-input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="top">Top</option>
                  <option value="new">New</option>
                  <option value="free">Free</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input type="text" className="admin-input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="e.g. blonde, teen, fitness" />
              </div>
            </div>
            <div className="form-checkboxes">
              <label className="form-checkbox">
                <input type="checkbox" checked={form.isFree} onChange={(e) => set('isFree', e.target.checked)} />
                <span>Free Page</span>
              </label>
              <label className="form-checkbox">
                <input type="checkbox" checked={form.isNewModel} onChange={(e) => set('isNewModel', e.target.checked)} />
                <span>New Model</span>
              </label>
              <label className="form-checkbox">
                <input type="checkbox" checked={form.isOnline} onChange={(e) => set('isOnline', e.target.checked)} />
                <span>Currently Online</span>
              </label>
              <label className="form-checkbox">
                <input type="checkbox" checked={form.isVerified} onChange={(e) => set('isVerified', e.target.checked)} />
                <span>Verified</span>
              </label>
            </div>
          </section>

          {/* ─── Bio ─── */}
          <section className="form-section">
            <h3 className="form-section-title">Bio (Multi-Language)</h3>
            <div className="form-group">
              <label>English Bio</label>
              <textarea className="admin-textarea" rows={3} value={form.bio.en} onChange={(e) => setBio('en', e.target.value)} placeholder="English bio..." />
            </div>
            <div className="form-group">
              <label>Hebrew Bio (עברית)</label>
              <textarea className="admin-textarea" rows={3} dir="rtl" value={form.bio.he} onChange={(e) => setBio('he', e.target.value)} placeholder="ביוגרפיה בעברית..." />
            </div>
            <div className="form-group">
              <label>French Bio (Français)</label>
              <textarea className="admin-textarea" rows={3} value={form.bio.fr} onChange={(e) => setBio('fr', e.target.value)} placeholder="Biographie en français..." />
            </div>
          </section>

          {/* ─── Social Links ─── */}
          <section className="form-section">
            <h3 className="form-section-title">Social Links</h3>
            <div className="form-grid">
              <div className="form-group social-field">
                <label><FaInstagram className="social-icon ig" /> Instagram</label>
                <input type="url" className="admin-input" value={form.socialLinks.instagram} onChange={(e) => setSocial('instagram', e.target.value)} placeholder="https://instagram.com/..." />
              </div>
              <div className="form-group social-field">
                <label><FaTwitter className="social-icon tw" /> Twitter / X</label>
                <input type="url" className="admin-input" value={form.socialLinks.twitter} onChange={(e) => setSocial('twitter', e.target.value)} placeholder="https://x.com/..." />
              </div>
              <div className="form-group social-field">
                <label><FaTiktok className="social-icon tt" /> TikTok</label>
                <input type="url" className="admin-input" value={form.socialLinks.tiktok} onChange={(e) => setSocial('tiktok', e.target.value)} placeholder="https://tiktok.com/@..." />
              </div>
              <div className="form-group social-field">
                <label><FaSnapchat className="social-icon sc" /> Snapchat</label>
                <input type="text" className="admin-input" value={form.socialLinks.snapchat} onChange={(e) => setSocial('snapchat', e.target.value)} placeholder="Snapchat username" />
              </div>
              <div className="form-group social-field">
                <label><FaYoutube className="social-icon yt" /> YouTube</label>
                <input type="url" className="admin-input" value={form.socialLinks.youtube} onChange={(e) => setSocial('youtube', e.target.value)} placeholder="https://youtube.com/@..." />
              </div>
              <div className="form-group social-field">
                <label><FaTelegram className="social-icon tg" /> Telegram</label>
                <input type="url" className="admin-input" value={form.socialLinks.telegram} onChange={(e) => setSocial('telegram', e.target.value)} placeholder="https://t.me/..." />
              </div>
              <div className="form-group social-field">
                <label><FaReddit className="social-icon rd" /> Reddit</label>
                <input type="url" className="admin-input" value={form.socialLinks.reddit} onChange={(e) => setSocial('reddit', e.target.value)} placeholder="https://reddit.com/u/..." />
              </div>
              <div className="form-group social-field">
                <label><FaGlobe className="social-icon wb" /> Website</label>
                <input type="url" className="admin-input" value={form.socialLinks.website} onChange={(e) => setSocial('website', e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </section>

          <div className="form-actions">
            <Link to="/admin/dashboard" className="admin-btn outline">Cancel</Link>
            <button type="submit" className="admin-btn primary" disabled={saving}>
              <FaSave /> {saving ? 'Saving...' : isEdit ? 'Update Model' : 'Create Model'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
