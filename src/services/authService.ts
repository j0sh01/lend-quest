import axios, { AxiosResponse } from 'axios';

// Types for authentication
export interface LoginCredentials {
  usr: string;
  pwd: string;
}

export interface LoginResponse {
  home_page: string;
  full_name: string;
  message: string;
}

export interface User {
  name: string;
  full_name: string;
  email: string;
  user_image?: string;
  roles: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

// API Configuration for authentication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create a separate axios instance for auth to avoid circular dependencies
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export class AuthService {
  /**
   * Login user with username and password
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await authApi.post(
        '/api/method/login',
        credentials
      );
      
      if (response.status === 200) {
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        return response.data;
      }
      
      throw new Error('Login failed');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    try {
      await authApi.get('/api/method/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current logged-in user information
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<{ message: string }> = await authApi.get(
        '/api/method/frappe.auth.get_logged_user'
      );
      
      if (response.data.message && response.data.message !== 'Guest') {
        // Get detailed user information
        const userResponse = await authApi.get(
          `/api/resource/User/${response.data.message}`
        );
        
        const userData = userResponse.data.data;
        const user: User = {
          name: userData.name,
          full_name: userData.full_name || userData.name,
          email: userData.email,
          user_image: userData.user_image,
          roles: userData.roles?.map((role: any) => role.role) || [],
        };
        
        // Cache user data
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      
      throw new Error('No authenticated user');
    } catch (error: any) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      throw new Error('Failed to get user information');
    }
  }

  /**
   * Check if user is authenticated
   */
  static async checkAuth(): Promise<boolean> {
    try {
      const response = await authApi.get('/api/method/frappe.auth.get_logged_user');
      const isAuthenticated = response.data.message && response.data.message !== 'Guest';
      
      if (isAuthenticated) {
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
      
      return isAuthenticated;
    } catch (error) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      return false;
    }
  }

  /**
   * Get cached authentication state
   */
  static getCachedAuthState(): { isAuthenticated: boolean; user: User | null } {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    return { isAuthenticated, user };
  }

  /**
   * Clear all authentication data
   */
  static clearAuthData(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  }

  /**
   * Refresh user session
   */
  static async refreshSession(): Promise<User | null> {
    try {
      const isAuth = await this.checkAuth();
      if (isAuth) {
        return await this.getCurrentUser();
      }
      return null;
    } catch (error) {
      this.clearAuthData();
      return null;
    }
  }
}
