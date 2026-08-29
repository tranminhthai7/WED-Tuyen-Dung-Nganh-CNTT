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

// Jobs API
export async function fetchJobs() {
  const data = await apiRequest('/api/jobs');
  return data.jobs || [];
}

export async function fetchJobDetail(slug) {
  const data = await apiRequest(`/api/jobs/${slug}`);
  return data.job;
}

export async function fetchMyPostings() {
  const data = await apiRequest('/api/jobs/my/postings');
  return data.jobs || [];
}

export async function createJob(payload) {
  return apiRequest('/api/jobs', 'POST', payload);
}

export async function updateJob(id, payload) {
  return apiRequest(`/api/jobs/${id}`, 'PUT', payload);
}

export async function deleteJob(id) {
  return apiRequest(`/api/jobs/${id}`, 'DELETE');
}

// Applications API
export async function submitApplication(payload) {
  return apiRequest('/api/applications', 'POST', payload);
}

export async function fetchMyApplications() {
  const data = await apiRequest('/api/applications/my');
  return data.applications || [];
}

export async function fetchEmployerApplications() {
  const data = await apiRequest('/api/applications/employer');
  return data.applications || [];
}

export async function updateApplicationStatus(id, payload) {
  return apiRequest(`/api/applications/${id}/status`, 'PUT', payload);
}

// Skills API
export async function fetchSkills() {
  const data = await apiRequest('/api/skills');
  return data.skills || [];
}

// Dashboard stats
export async function fetchDashboardStats() {
  const data = await apiRequest('/api/dashboard/stats');
  return data.stats;
}
// Company API
export async function fetchMyCompany() {
  const data = await apiRequest('/api/companies/my');
  return data.company;
}
export async function updateMyCompany(payload) {
  return apiRequest('/api/companies/my', 'PUT', payload);
}
export async function uploadCompanyLogo(file) {
  const token = localStorage.getItem('itmatch_token');
  const fd = new FormData(); fd.append('logo', file);
  const res = await fetch(`${API_BASE_URL}/api/companies/my/logo`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
  const data = await res.json(); if (!res.ok) throw new Error(data.message); return data;
}
export async function fetchAdminCompanies() {
  const data = await apiRequest('/api/companies/admin/list'); return data.companies || [];
}
export async function verifyCompany(id, isVerified) {
  return apiRequest(`/api/companies/admin/${id}/verify`, 'PATCH', { isVerified });
}
export async function fetchPendingJobs() {
  const data = await apiRequest('/api/companies/admin/jobs/pending'); return data.jobs || [];
}
export async function moderateJob(id, status) {
  return apiRequest(`/api/companies/admin/jobs/${id}/moderate`, 'PATCH', { status });
}
export async function createSkill(payload) { return apiRequest('/api/skills', 'POST', payload); }
export async function updateSkill(id, payload) { return apiRequest(`/api/skills/${id}`, 'PUT', payload); }
export async function deleteSkill(id) { return apiRequest(`/api/skills/${id}`, 'DELETE'); }