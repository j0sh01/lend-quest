import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session-based auth
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config) => {
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-Frappe-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // You can add redirect logic here
    }
    return Promise.reject(error);
  }
);

// Generic API service class
export class FrappeAPI {
  /**
   * Generic GET request for Frappe resources
   */
  static async get<T>(doctype: string, name?: string): Promise<T> {
    const url = name ? `/resource/${doctype}/${name}` : `/resource/${doctype}`;
    const response: AxiosResponse<{ data: T }> = await api.get(url);
    return response.data.data;
  }

  /**
   * Generic POST request for creating Frappe resources
   */
  static async create<T>(doctype: string, data: any): Promise<T> {
    const response: AxiosResponse<{ data: T }> = await api.post(`/resource/${doctype}`, data);
    return response.data.data;
  }

  /**
   * Generic PUT request for updating Frappe resources
   */
  static async update<T>(doctype: string, name: string, data: any): Promise<T> {
    const response: AxiosResponse<{ data: T }> = await api.put(`/resource/${doctype}/${name}`, data);
    return response.data.data;
  }

  /**
   * Generic DELETE request for Frappe resources
   */
  static async delete(doctype: string, name: string): Promise<void> {
    await api.delete(`/resource/${doctype}/${name}`);
  }

  /**
   * Call custom Frappe methods
   */
  static async callMethod<T>(method: string, args?: any): Promise<T> {
    const response: AxiosResponse<{ message: T }> = await api.post(`/method/${method}`, args);
    return response.data.message;
  }

  /**
   * Get list with filters and pagination
   */
  static async getList<T>(
    doctype: string,
    options: {
      filters?: any;
      fields?: string[];
      limit?: number;
      offset?: number;
      order_by?: string;
    } = {}
  ): Promise<T[]> {
    const params = new URLSearchParams();
    
    if (options.filters) {
      params.append('filters', JSON.stringify(options.filters));
    }
    if (options.fields) {
      params.append('fields', JSON.stringify(options.fields));
    }
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options.offset) {
      params.append('offset', options.offset.toString());
    }
    if (options.order_by) {
      params.append('order_by', options.order_by);
    }

    const response: AxiosResponse<{ data: T[] }> = await api.get(
      `/resource/${doctype}?${params.toString()}`
    );
    return response.data.data;
  }
}

export default api;