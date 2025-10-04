const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API client with authentication
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getRecentActivity() {
    return this.request('/dashboard/activity');
  }

  async getWeeklyTrends() {
    return this.request('/dashboard/trends/weekly');
  }

  // Upload
  async uploadFile(formData) {
    const token = this.getToken();
    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    return response.json();
  }

  async processFile(fileId) {
    return this.request(`/upload/${fileId}/process`, {
      method: 'POST',
    });
  }

  async getFileStatus(fileId) {
    return this.request(`/upload/${fileId}/status`);
  }

  // Anomalies
  async getAnomalies(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/anomalies${queryString ? `?${queryString}` : ''}`);
  }

  async getAnomaly(id) {
    return this.request(`/anomalies/${id}`);
  }

  async updateAnomaly(id, data) {
    return this.request(`/anomalies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getAnomalyStats() {
    return this.request('/anomalies/stats/summary');
  }

  // Reports
  async getReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports${queryString ? `?${queryString}` : ''}`);
  }

  async generateReport(reportData) {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async getAnalytics(timeframe = '30d') {
    return this.request(`/reports/analytics/summary?timeframe=${timeframe}`);
  }

  // Users
  async getUserStats() {
    return this.request('/users/stats');
  }

  async getUserActivity() {
    return this.request('/users/activity');
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;