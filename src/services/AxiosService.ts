import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BASE_URL } from '../res/api';

// Axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET request
const getRequest = async <T = any>(endpoint: string, params?: object): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
};

// POST request
const postRequest = async <T = any>(endpoint: string, payload: object, headers?: object): Promise<T> => {
  try {
    const config: any = {};
    
    if (headers) {
      config.headers = { ...headers };
    }
    
    // For FormData, let axios set Content-Type with boundary automatically
    if (payload instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    
    const response: AxiosResponse<T> = await api.post(endpoint, payload, config);
    return response.data;
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};

// PATCH request
const patchRequest = async <T = any>(endpoint: string, payload: object): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.patch(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('PATCH request failed:', error);
    throw error;
  }
};

// PUT request
const putRequest = async <T = any>(endpoint: string, payload: object): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.put(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
};

// DELETE request
const deleteRequest = async <T = any>(endpoint: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error;
  }
};

export { getRequest, postRequest, patchRequest, putRequest, deleteRequest };

// Default export for backward compatibility
export default {
  get: getRequest,
  post: postRequest,
  patch: patchRequest,
  put: putRequest,
  delete: deleteRequest,
};
