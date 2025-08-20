import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService, AuthState, LoginCredentials } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // First check cached state for immediate UI update
      const cached = AuthService.getCachedAuthState();
      if (cached.isAuthenticated && cached.user) {
        setAuthState({
          isAuthenticated: true,
          user: cached.user,
          loading: true, // Still loading to verify with server
        });
      }

      // Verify with server
      const isAuthenticated = await AuthService.checkAuth();
      
      if (isAuthenticated) {
        try {
          const user = await AuthService.getCurrentUser();
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
          });
        } catch (error) {
          // If we can't get user info, clear auth state
          AuthService.clearAuthData();
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } else {
        AuthService.clearAuthData();
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      AuthService.clearAuthData();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await AuthService.login(credentials);
      
      // Get user information after successful login
      const user = await AuthService.getCurrentUser();
      
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });

      toast.success(`Welcome back, ${user.full_name}!`);
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await AuthService.logout();
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });

      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      toast.error('Logout failed, but you have been signed out locally');
    }
  };

  const refreshUser = async () => {
    try {
      const user = await AuthService.refreshSession();
      
      if (user) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user,
        }));
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for checking if user has specific role
export const useHasRole = (role: string): boolean => {
  const { user } = useAuth();
  return user?.roles?.includes(role) || false;
};

// Hook for checking if user has any of the specified roles
export const useHasAnyRole = (roles: string[]): boolean => {
  const { user } = useAuth();
  return roles.some(role => user?.roles?.includes(role)) || false;
};
