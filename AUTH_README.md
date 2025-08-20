# LendQuest Authentication System

This document describes the authentication system implemented for the LendQuest lending management application.

## Overview

The authentication system is built using Frappe's native authentication API and provides:
- Secure login/logout functionality
- Session management with cookies
- Role-based access control
- Protected routes
- User context management

## Architecture

### Frontend Components

1. **AuthService** (`src/services/authService.ts`)
   - Handles all authentication API calls
   - Manages session state
   - Provides methods for login, logout, and user management

2. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - React context for global authentication state
   - Provides hooks for components to access auth state
   - Handles authentication initialization

3. **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`)
   - Component wrapper for protecting routes
   - Redirects unauthenticated users to login
   - Supports role-based access control

4. **RoleGuard** (`src/components/auth/RoleGuard.tsx`)
   - Component for conditional rendering based on user roles
   - Provides convenience components for common role checks

5. **Login Page** (`src/pages/Login.tsx`)
   - Beautiful, responsive login interface
   - Form validation with Zod
   - Error handling and loading states

### Backend Integration

1. **Custom API Methods** (`lending/api.py`)
   - Dashboard metrics endpoint
   - User management utilities
   - Data aggregation for frontend

2. **Frappe Authentication**
   - Uses standard Frappe login/logout endpoints
   - Session management via cookies
   - CSRF protection

## Usage

### Basic Authentication Flow

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      Welcome, {user?.full_name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```typescript
// Protect entire route
<Route path="/admin" element={
  <ProtectedRoute requiredRoles={['Administrator']}>
    <AdminPanel />
  </ProtectedRoute>
} />

// Protect component conditionally
<RoleGuard roles={['Loan Manager', 'Administrator']}>
  <SensitiveComponent />
</RoleGuard>
```

### Role-Based Access

```typescript
import { useHasRole, useHasAnyRole } from '@/contexts/AuthContext';

function AdminButton() {
  const isAdmin = useHasRole('Administrator');
  const canManageLoans = useHasAnyRole(['Loan Manager', 'Administrator']);
  
  if (!isAdmin) return null;
  
  return <button>Admin Action</button>;
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/method/login` - User login
- `GET /api/method/logout` - User logout  
- `GET /api/method/frappe.auth.get_logged_user` - Get current user

### Custom Endpoints

- `GET /api/method/lending.api.get_dashboard_metrics` - Dashboard data
- `GET /api/method/lending.api.get_recent_activities` - Recent activities
- `GET /api/method/lending.api.get_loans_summary` - Loans summary

## Configuration

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=LendQuest
VITE_APP_TITLE=Lending Management System
```

### Backend Configuration

The backend API methods are automatically whitelisted in `hooks.py`:

```python
override_whitelisted_methods = {
    "lending.api.get_dashboard_metrics": "lending.api.get_dashboard_metrics",
    # ... other methods
}
```

## Security Features

1. **CSRF Protection**: Automatic CSRF token handling
2. **Session Cookies**: Secure session management
3. **Role Validation**: Server-side role verification
4. **Route Protection**: Client-side route guards
5. **Error Handling**: Graceful error handling and user feedback

## Testing

Use the built-in auth tester for development:

```javascript
// In browser console
AuthTester.testAuthFlow();
AuthTester.testLogin('username', 'password');
AuthTester.testLogout();
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Frappe site allows frontend origin
2. **Session Issues**: Check cookie settings and domain configuration
3. **Role Access**: Verify user has required roles in Frappe
4. **API Errors**: Check Frappe logs for backend errors

### Debug Mode

Enable debug logging by setting `VITE_DEBUG=true` in `.env`

## Development

### Running the Frontend

```bash
cd apps/lending/lend-quest
npm run dev
```

### Building for Production

```bash
npm run build
```

The authentication system is now fully integrated and ready for use!
