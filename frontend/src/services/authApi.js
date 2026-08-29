const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function apiRequest(path, method = 'GET', payload = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('itmatch_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi kết nối máy chủ');
  }

  return data;
}

export function registerAccount(payload) {
  return apiRequest('/api/auth/register', 'POST', payload);
}

export function loginAccount(payload) {
  return apiRequest('/api/auth/login', 'POST', payload);
}

export function getProfile() {
  return apiRequest('/api/auth/profile', 'GET');
}

export function updateProfile(payload) {
  return apiRequest('/api/auth/profile', 'PUT', payload);
}
