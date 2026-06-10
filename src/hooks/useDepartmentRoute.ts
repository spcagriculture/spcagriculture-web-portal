import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DEPARTMENTS, isDepartmentId, type DepartmentId } from '@/constants/departments';
import { useDepartment } from '@/contexts/DepartmentContext';

export function useDepartmentRoute() {
  const { department: departmentParam } = useParams<{ department: string }>();
  const navigate = useNavigate();
  const { setDepartment } = useDepartment();

  const departmentId: DepartmentId | null = isDepartmentId(departmentParam)
    ? departmentParam
    : null;

  useEffect(() => {
    if (departmentId) {
      setDepartment(departmentId);
    }
  }, [departmentId, setDepartment]);

  useEffect(() => {
    if (departmentParam && !departmentId) {
      navigate('/', { replace: true });
    }
  }, [departmentParam, departmentId, navigate]);

  const config = departmentId ? DEPARTMENTS[departmentId] : null;
  const basePath = departmentId ? `/d/${departmentId}` : '';

  return { departmentId, config, basePath };
}
