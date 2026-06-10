import React from 'react';
import {
  DEPARTMENTS,
  type DepartmentId,
  isDepartmentId,
} from '@/constants/departments';

const STORAGE_KEY = 'spc-selected-department';

interface DepartmentContextValue {
  selectedDepartment: DepartmentId | null;
  setDepartment: (id: DepartmentId) => void;
  clearDepartment: () => void;
  departmentConfig: (typeof DEPARTMENTS)[DepartmentId] | null;
}

const DepartmentContext = React.createContext<DepartmentContextValue | null>(null);

export const DepartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDepartment, setSelectedDepartment] = React.useState<DepartmentId | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return isDepartmentId(stored ?? undefined) ? stored : null;
    } catch {
      return null;
    }
  });

  const setDepartment = React.useCallback((id: DepartmentId) => {
    setSelectedDepartment(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore storage errors
    }
  }, []);

  const clearDepartment = React.useCallback(() => {
    setSelectedDepartment(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, []);

  const departmentConfig = selectedDepartment ? DEPARTMENTS[selectedDepartment] : null;

  const value = React.useMemo(
    () => ({
      selectedDepartment,
      setDepartment,
      clearDepartment,
      departmentConfig,
    }),
    [selectedDepartment, setDepartment, clearDepartment, departmentConfig]
  );

  return (
    <DepartmentContext.Provider value={value}>{children}</DepartmentContext.Provider>
  );
};

export function useDepartment() {
  const ctx = React.useContext(DepartmentContext);
  if (!ctx) {
    throw new Error('useDepartment must be used within DepartmentProvider');
  }
  return ctx;
}
