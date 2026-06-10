import { Navigate, useParams } from 'react-router-dom';
import { isDepartmentId } from '@/constants/departments';

export function LegacyStatisticsRedirect() {
  const { department } = useParams<{ department: string }>();
  if (isDepartmentId(department)) {
    return <Navigate to={`/d/${department}/statistics`} replace />;
  }
  return <Navigate to="/" replace />;
}
