import React from 'react';
import { useAuth, useHasRole, useHasAnyRole } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user roles
 * 
 * @param roles - Array of roles to check
 * @param requireAll - If true, user must have ALL roles. If false, user needs ANY role (default: false)
 * @param fallback - Component to render if user doesn't have required roles
 * @param children - Content to render if user has required roles
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles = [],
  requireAll = false,
  fallback = null,
}) => {
  const { user } = useAuth();

  // If no roles specified, render children (no restriction)
  if (roles.length === 0) {
    return <>{children}</>;
  }

  // If user is not loaded yet, don't render anything
  if (!user) {
    return <>{fallback}</>;
  }

  let hasAccess = false;

  if (requireAll) {
    // User must have ALL specified roles
    hasAccess = roles.every(role => user.roles?.includes(role));
  } else {
    // User must have ANY of the specified roles
    hasAccess = roles.some(role => user.roles?.includes(role));
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default RoleGuard;

// Convenience components for common role checks
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <RoleGuard roles={['Administrator', 'System Manager']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const LoanManagerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <RoleGuard roles={['Loan Manager', 'Administrator']} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const LoanOfficerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <RoleGuard roles={['Loan Officer', 'Loan Manager', 'Administrator']} fallback={fallback}>
    {children}
  </RoleGuard>
);
