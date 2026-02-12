import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.data.accessToken) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('refreshToken', response.data.data.refreshToken);
  }
  return response.data.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data.data;
};

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  // Optional: Call backend logout if needed to invalidate token on server
};

const updatePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/password', { currentPassword, newPassword });
  return response.data;
};

export default {
  login,
  register,
  logout,
  updatePassword,
};
