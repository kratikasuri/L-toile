/**
 * Categories API Calls
 * Place this file in: src/api/categories.js
 * 
 * This file contains all category-related API calls
 * matching your backend endpoints.
 */

import apiClient from './apiClient';

export const categoriesAPI = {
  // Get all categories
  getAllCategories: async () => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    const response = await apiClient.get(`/api/categories/${categoryId}`);
    return response.data;
  },

  // Get products in a category
  getCategoryProducts: async (categoryId, params = {}) => {
    const response = await apiClient.get(`/api/categories/${categoryId}/products`, { params });
    return response.data;
  },
};

export default categoriesAPI;




