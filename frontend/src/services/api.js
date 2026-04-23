import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
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
  search: (query, category = 'all') =>
    api.get('/sensus/search', {
      params: {
        query,
        ...(category && category !== 'all' ? { category } : {}),
      },
    }),
};
