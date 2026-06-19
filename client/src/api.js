import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const fetchProfiles = async (params = {}) => {
  const { data } = await api.get('/profiles', { params });
  return data;
};

export const fetchProfile = async (id) => {
  const { data } = await api.get(`/profiles/${id}`);
  return data;
};

export const detectLanguage = async () => {
  try {
    const { data } = await api.get('/geo/detect-language');
    return data.language;
  } catch {
    return 'en';
  }
};

// ── Admin API ──

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return { Authorization: `Bearer ${token}` };
}

export const adminLogin = async (password) => {
  const { data } = await api.post('/admin/login', { password });
  return data;
};

export const adminFetchProfiles = async (params = {}) => {
  const { data } = await api.get('/admin/profiles', { params, headers: authHeaders() });
  return data;
};

export const adminFetchProfile = async (id) => {
  const { data } = await api.get(`/admin/profiles/${id}`, { headers: authHeaders() });
  return data;
};

export const adminCreateProfile = async (profileData) => {
  const { data } = await api.post('/admin/profiles', profileData, { headers: authHeaders() });
  return data;
};

export const adminUpdateProfile = async (id, profileData) => {
  const { data } = await api.put(`/admin/profiles/${id}`, profileData, { headers: authHeaders() });
  return data;
};

export const adminDeleteProfile = async (id) => {
  const { data } = await api.delete(`/admin/profiles/${id}`, { headers: authHeaders() });
  return data;
};
