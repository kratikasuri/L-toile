/**
 * API Client Configuration
 * Place this file in: src/api/apiClient.js
 * 
 * This file sets up Axios with interceptors for authentication
 * and error handling.
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Update these URLs based on your environment
// - iOS Simulator: http://localhost:5050
// - Android Emulator: http://10.0.2.2:5050
// - Physical Device: http://YOUR_COMPUTER_IP:5050 (find with: ifconfig | grep "inet ")
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5050'  // Development - update for physical devices
  : 'https://your-production-api.com';  // Production

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired/invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Clear stored auth data
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
        
        // You can add navigation logic here if needed
        // For example, using a navigation ref
        console.log('Session expired. Please login again.');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;




