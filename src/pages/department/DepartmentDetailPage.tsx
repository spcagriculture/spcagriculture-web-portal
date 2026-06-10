import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { departmentBasePath, isDepartmentId } from '@/constants/departments';
import { useDepartment } from '@/contexts/DepartmentContext';

const DepartmentDetailPage: React.FC = () => {
  const { department } = useParams<{ department: string }>();
  const navigate = useNavigate();
  const { setDepartment } = useDepartment();

  useEffect(() => {
    if (isDepartmentId(department)) {
      setDepartment(department);
      navigate(departmentBasePath(department), { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [department, navigate, setDepartment]);

  return null;
};

export default DepartmentDetailPage;
