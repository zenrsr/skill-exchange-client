import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const AuthService = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  getMe: () => api.get('/auth/me'),
};

export const UserService = {
  getStats: () => api.get('/users/stats'),
  getMatches: (params) => api.get('/users/matches', { params }),
  updateProfile: (payload) => api.put('/users/profile', payload),
  getProfile: (id) => api.get(`/users/${id}`),
  getReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

export const SessionService = {
  list: () => api.get('/sessions'),
  create: (payload) => api.post('/sessions', payload),
  updateStatus: (id, status) => api.patch(`/sessions/${id}/status`, { status }),
};

export const ReviewService = {
  create: (payload) => api.post('/reviews', payload),
};

export const MessageService = {
  threads: () => api.get('/messages'),
  conversation: (participantId) => api.get(`/messages/${participantId}`),
  send: (participantId, payload) => api.post(`/messages/${participantId}`, payload),
};

export const SkillService = {
  list: () => api.get('/skills'),
};

export default api;
