import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

// Configure axios to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const dashboardService = {
  // Get complete dashboard data
  getDashboardData: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      throw error;
    }
  },

  // Get user's items with pagination
  getUserItems: async (userId, page = 1, limit = 10, status = 'all') => {
    try {
      const response = await axios.get(`${API_URL}/items/${userId}`, {
        params: { page, limit, status }
      });
      return response.data;
    } catch (error) {
      console.error('User items fetch error:', error);
      throw error;
    }
  },

  // Get user's swaps with pagination
  getUserSwaps: async (userId, page = 1, limit = 10, status = 'all') => {
    try {
      const response = await axios.get(`${API_URL}/swaps/${userId}`, {
        params: { page, limit, status }
      });
      return response.data;
    } catch (error) {
      console.error('User swaps fetch error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await axios.put(`${API_URL}/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Add new item
  addItem: async (itemData) => {
    try {
      const response = await axios.post(`${API_URL}/items`, itemData);
      return response.data;
    } catch (error) {
      console.error('Item creation error:', error);
      throw error;
    }
  },

  // Update item
  updateItem: async (itemId, itemData) => {
    try {
      const response = await axios.put(`${API_URL}/items/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Item update error:', error);
      throw error;
    }
  },

  // Delete item
  deleteItem: async (itemId) => {
    try {
      const response = await axios.delete(`${API_URL}/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Item deletion error:', error);
      throw error;
    }
  }
};

export default dashboardService;
