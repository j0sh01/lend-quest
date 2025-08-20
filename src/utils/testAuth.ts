import { AuthService } from '@/services/authService';

/**
 * Test authentication functionality
 * This is a utility for testing the auth flow during development
 */
export class AuthTester {
  static async testAuthFlow() {
    console.log('🔐 Testing Authentication Flow...');
    
    try {
      // Test 1: Check initial auth state
      console.log('1. Checking initial auth state...');
      const initialAuth = await AuthService.checkAuth();
      console.log('Initial auth state:', initialAuth);
      
      // Test 2: Get cached auth state
      console.log('2. Getting cached auth state...');
      const cachedState = AuthService.getCachedAuthState();
      console.log('Cached state:', cachedState);
      
      // Test 3: Try to get current user (should fail if not authenticated)
      console.log('3. Attempting to get current user...');
      try {
        const user = await AuthService.getCurrentUser();
        console.log('Current user:', user);
      } catch (error) {
        console.log('No authenticated user (expected if not logged in)');
      }
      
      console.log('✅ Auth flow test completed');
      
    } catch (error) {
      console.error('❌ Auth flow test failed:', error);
    }
  }
  
  static async testLogin(username: string, password: string) {
    console.log('🔑 Testing Login...');
    
    try {
      const result = await AuthService.login({ usr: username, pwd: password });
      console.log('Login successful:', result);
      
      // Get user info after login
      const user = await AuthService.getCurrentUser();
      console.log('User info:', user);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }
  
  static async testLogout() {
    console.log('🚪 Testing Logout...');
    
    try {
      await AuthService.logout();
      console.log('Logout successful');
      
      // Verify auth state after logout
      const authState = await AuthService.checkAuth();
      console.log('Auth state after logout:', authState);
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }
}

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).AuthTester = AuthTester;
}
