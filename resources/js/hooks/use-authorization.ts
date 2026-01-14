import { usePage } from '@inertiajs/react';

interface AuthProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
    roles: string[];
    permissions: string[];
  } | null;
}

export function useAuthorization() {
  const { auth } = usePage<AuthProps>().props;
  // console.log(auth.roles);
  const isSuperAdmin = auth?.roles?.includes('super admin');

  const can = (permission?: string) => {
    if (!permission) return true;
    if (isSuperAdmin) return true;
    return auth?.permissions?.includes(permission);
  };

  const canAny = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    if (isSuperAdmin) return true;
    return permissions.some(p => auth?.permissions?.includes(p));
  };

  const hasRole = (roles: string | string[]) => {
    if (!auth?.roles) return false;
    if (Array.isArray(roles)) {
      return roles.some(r => auth.roles.includes(r));
    }
    return auth.roles.includes(roles);
  };
  
  const hasRoles = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true;
    if (isSuperAdmin) return true;
    return roles.some(p => auth?.roles?.includes(p));
  };

  return { can, canAny, hasRole,hasRoles };
}
