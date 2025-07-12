import axios from 'axios';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../firebase';

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

  // Google Sign In
  googleSignIn: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the Firebase ID token
      const idToken = await user.getIdToken();
      
      // Send to backend for verification and user creation
      const response = await API.post('/auth/google', {
        idToken: idToken,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  // Apple Sign In
  appleSignIn: async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      
      // Get the Firebase ID token
      const idToken = await user.getIdToken();
      
      // Send to backend for verification and user creation
      const response = await API.post('/auth/apple', {
        idToken: idToken,
        email: user.email,
        name: user.displayName || 'Apple User',
        photoURL: user.photoURL
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Apple sign in error:', error);
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
  signout: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out error:', error);
      // Still remove local storage even if Firebase signout fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;
