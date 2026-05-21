import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan paksa redirect global ke /login.
    // Public page harus tetap bisa diakses tanpa autentikasi.
    // Redirect auth ditangani spesifik di protected route (AdminRoute).
    return Promise.reject(error);
  },
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyEmail: (token) => api.post(`/auth/verify-email/${token}`),
  getUsers: () => api.get('/auth/users'),
  updateUserRole: (id, role) => api.patch(`/auth/users/${id}/role`, { role }),
};

export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  getAll: (params) => api.get('/feedback', { params }),
  markReviewed: (id) => api.patch(`/feedback/${id}/review`),
};

export const sensusAPI = {
  getStats: () => api.get('/sensus/stats'),
  getUniversities: () => api.get('/sensus/universities'),
  getSheets: () => api.get('/sensus/sheets'),
  getAllData: () => api.get('/sensus'),
  search: (query, category = 'all', field = 'all') =>
    api.get('/sensus/search', {
      params: {
        query,
        ...(category && category !== 'all' ? { category } : {}),
        ...(field && field !== 'all' ? { field } : {}),
      },
    }),
  getMembersAdmin: (params) => api.get('/sensus/members', { params }),
  createMember: (data) => api.post('/sensus/members', data),
  updateMember: (id, data) => api.patch(`/sensus/members/${id}`, data),
  deactivateMember: (id) => api.delete(`/sensus/members/${id}`),
  getMemberAudits: (id) => api.get(`/sensus/members/${id}/audits`),
};
