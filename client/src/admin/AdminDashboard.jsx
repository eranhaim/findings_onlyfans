import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminFetchProfiles, adminDeleteProfile } from '../api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import './Admin.css';

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin');
      return;
    }
    loadProfiles();
  }, [navigate]);

  const loadProfiles = async (searchTerm) => {
    setLoading(true);
    try {
      const data = await adminFetchProfiles({ search: searchTerm || undefined });
      setProfiles(data.profiles);
      setTotal(data.total);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProfiles(search);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteProfile(id);
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-logo-icon">❤</span>
          <span className="admin-logo-text">FansFinder</span>
          <span className="admin-badge">ADMIN</span>
        </div>
        <div className="admin-header-right">
          <Link to="/" className="admin-link">View Site</Link>
          <button className="admin-btn outline small" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-toolbar">
          <div className="admin-toolbar-left">
            <h1>Models ({total})</h1>
          </div>
          <div className="admin-toolbar-right">
            <form className="admin-search-form" onSubmit={handleSearch}>
              <div className="admin-search-box">
                <FaSearch className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
            <Link to="/admin/profiles/new" className="admin-btn primary">
              <FaPlus /> Add Model
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : profiles.length === 0 ? (
          <div className="admin-empty">
            <p>No models found.</p>
            <Link to="/admin/profiles/new" className="admin-btn primary">
              <FaPlus /> Add Your First Model
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Likes</th>
                  <th>Status</th>
                  <th>OnlyFans</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.avatar || 'https://i.pravatar.cc/40'} alt="" className="admin-avatar" />
                    </td>
                    <td className="admin-td-name">{p.name}</td>
                    <td className="admin-td-username">@{p.username}</td>
                    <td>
                      <span className={`admin-cat-badge cat-${p.category}`}>{p.category}</span>
                    </td>
                    <td>{p.isFree ? <span className="admin-free">FREE</span> : `$${p.price.toFixed(2)}`}</td>
                    <td>{p.likes.toLocaleString()}</td>
                    <td>
                      <span className={`admin-status ${p.isOnline ? 'online' : 'offline'}`}>
                        {p.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td>
                      {p.onlyfansLink ? (
                        <a href={p.onlyfansLink} target="_blank" rel="noreferrer" className="admin-of-link">
                          Link
                        </a>
                      ) : (
                        <span className="admin-no-link">—</span>
                      )}
                    </td>
                    <td className="admin-td-actions">
                      <Link to={`/admin/profiles/${p._id}/edit`} className="admin-btn icon edit" title="Edit">
                        <FaEdit />
                      </Link>
                      <button className="admin-btn icon delete" title="Delete" onClick={() => handleDelete(p._id, p.name)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
