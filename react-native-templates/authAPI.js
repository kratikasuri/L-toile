/**
 * Authentication API Calls
 * Place this file in: src/api/auth.js
 * 
 * This file contains all authentication-related API calls
 * matching your backend endpoints.
 */

import apiClient from './apiClient';

export const authAPI = {
  // Register new user
  register: async (phoneNumber, password, name) => {
    const response = await apiClient.post('/api/auth/register', {
      phoneNumber,
      password,
      name,
    });
    return response.data;
  },

  // Login user
  login: async (phoneNumber, password) => {
    const response = await apiClient.post('/api/auth/login', {
      phoneNumber,
      password,
    });
    return response.data;
  },

  // Request OTP
  requestOTP: async (phoneNumber) => {
    const response = await apiClient.post('/api/auth/request-otp', {
      phoneNumber,
    });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (phoneNumber, otp) => {
    const response = await apiClient.post('/api/auth/verify-otp', {
      phoneNumber,
      otp,
    });
    return response.data;
  },

  // Logout (if your backend has this endpoint)
  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/api/auth/profile', userData);
    return response.data;
  },
};

export default authAPI;




