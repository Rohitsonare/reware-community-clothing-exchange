#!/usr/bin/env node

import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// API base URL
const API_URL = `http://localhost:${process.env.PORT || 5001}/api`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

// Test user data
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123',
};

let authToken = '';

// Function to run tests
async function runTests() {
  console.log(`${colors.cyan}Starting API Tests${colors.reset}\n`);
  
  try {
    // Test 1: Health check
    await testHealthCheck();
    
    // Test 2: Auth test endpoint
    await testAuthEndpoint();
    
    // Test 3: Signup
    await testSignup();
    
    // Test 4: Signin
    await testSignin();
    
    // Test 5: Get current user
    await testGetCurrentUser();
    
    console.log(`\n${colors.green}✅ All tests passed successfully!${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}❌ Tests failed:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Test health check endpoint
async function testHealthCheck() {
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/health`);
    if (response.status === 200 && response.data.status === 'ok') {
      console.log(`${colors.green}✓ Health check passed${colors.reset}`);
    } else {
      throw new Error('Health check failed');
    }
  } catch (error) {
    console.error(`${colors.red}✗ Health check failed:${colors.reset}`, error.message);
    throw error;
  }
}

// Test auth endpoint
async function testAuthEndpoint() {
  try {
    const response = await axios.get(`${API_URL}/auth/test`);
    if (response.status === 200) {
      console.log(`${colors.green}✓ Auth endpoint check passed${colors.reset}`);
    } else {
      throw new Error('Auth endpoint check failed');
    }
  } catch (error) {
    console.error(`${colors.red}✗ Auth endpoint check failed:${colors.reset}`, error.message);
    throw error;
  }
}

// Test signup
async function testSignup() {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, testUser);
    if (response.status === 201 && response.data.token) {
      console.log(`${colors.green}✓ Signup test passed${colors.reset}`);
      authToken = response.data.token;
      console.log(`${colors.yellow}  User created:${colors.reset}`, response.data.user.email);
    } else {
      throw new Error('Signup failed');
    }
  } catch (error) {
    console.error(`${colors.red}✗ Signup test failed:${colors.reset}`, error.response?.data?.message || error.message);
    throw error;
  }
}

// Test signin
async function testSignin() {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, {
      email: testUser.email,
      password: testUser.password,
    });
    if (response.status === 200 && response.data.token) {
      console.log(`${colors.green}✓ Signin test passed${colors.reset}`);
      authToken = response.data.token;
    } else {
      throw new Error('Signin failed');
    }
  } catch (error) {
    console.error(`${colors.red}✗ Signin test failed:${colors.reset}`, error.response?.data?.message || error.message);
    throw error;
  }
}

// Test get current user
async function testGetCurrentUser() {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (response.status === 200 && response.data) {
      console.log(`${colors.green}✓ Get current user test passed${colors.reset}`);
      console.log(`${colors.yellow}  User data:${colors.reset}`, {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        points: response.data.points,
      });
    } else {
      throw new Error('Get current user failed');
    }
  } catch (error) {
    console.error(`${colors.red}✗ Get current user test failed:${colors.reset}`, error.response?.data?.message || error.message);
    throw error;
  }
}

// Run the tests
runTests();
