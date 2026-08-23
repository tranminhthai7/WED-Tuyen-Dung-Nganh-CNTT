const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Không thể kết nối đến máy chủ');
  }

  return data;
}

export function registerAccount(payload) {
  return request('/api/auth/register', payload);
}

export function loginAccount(payload) {
  return request('/api/auth/login', payload);
}
