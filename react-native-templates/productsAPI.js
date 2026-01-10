/**
 * Products API Calls
 * Place this file in: src/api/products.js
 * 
 * This file contains all product-related API calls
 * matching your backend endpoints.
 */

import apiClient from './apiClient';

export const productsAPI = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const response = await apiClient.get('/api/products', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId) => {
    const response = await apiClient.get(`/api/products/${productId}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, params = {}) => {
    const response = await apiClient.get(`/api/products/category/${categoryId}`, { params });
    return response.data;
  },

  // Search products
  searchProducts: async (searchQuery, params = {}) => {
    const response = await apiClient.get('/api/products/search', {
      params: { q: searchQuery, ...params },
    });
    return response.data;
  },

  // Create product (admin only - if applicable)
  createProduct: async (productData) => {
    const response = await apiClient.post('/api/products', productData);
    return response.data;
  },

  // Update product (admin only - if applicable)
  updateProduct: async (productId, productData) => {
    const response = await apiClient.put(`/api/products/${productId}`, productData);
    return response.data;
  },

  // Delete product (admin only - if applicable)
  deleteProduct: async (productId) => {
    const response = await apiClient.delete(`/api/products/${productId}`);
    return response.data;
  },
};

export default productsAPI;




