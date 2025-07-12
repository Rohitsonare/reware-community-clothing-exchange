import axios from 'axios';

// Create axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include auth token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Authentication services
const AuthService = {
  // Test API connection
  testConnection: async () => {
    try {
      const response = await API.get('/auth/test');
      return response.data;
    } catch (error) {
      console.error('API Connection test failed:', error);
      throw error;
    }
  },

  // Sign up a new user
  signup: async (userData) => {
    try {
      const response = await API.post('/auth/signup', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      throw error;
    }
  },
  
  // Sign in existing user
  signin: async (credentials) => {
    try {
      const response = await API.post('/auth/signin', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Signin error:', error.response?.data?.message || error.message);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error.response?.data?.message || error.message);
      throw error;
    }
  },
  
  // Log out user
  signout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;
