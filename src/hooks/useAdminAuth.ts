import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/integrations/firebase/client';
import { isDepartmentId, type DepartmentId } from '@/constants/departments';

interface UseAdminAuthOptions {
  requireDepartment?: boolean;
}

export function useAdminAuth(options: UseAdminAuthOptions = { requireDepartment: true }) {
  const navigate = useNavigate();
  const { department: departmentParam } = useParams<{ department?: string }>();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const departmentId: DepartmentId | null = isDepartmentId(departmentParam)
    ? departmentParam
    : null;

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!isAuthReady) return;

    if (!user) {
      navigate('/admin', { replace: true });
      return;
    }

    if (options.requireDepartment && departmentParam && !departmentId) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthReady, user, departmentParam, departmentId, navigate, options.requireDepartment]);

  return { user, isAuthReady, departmentId, isAuthenticated: !!user };
}
