import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DEPARTMENTS, type DepartmentId } from '@/constants/departments';

interface AdminDepartmentBannerProps {
  departmentId: DepartmentId;
}

export const AdminDepartmentBanner: React.FC<AdminDepartmentBannerProps> = ({
  departmentId,
}) => {
  const { t } = useLanguage();
  const config = DEPARTMENTS[departmentId];
  const deptT = t.departments as Record<string, string>;
  const gatewayT = t.gateway as Record<string, string>;
  const Icon = config.icon;

  return (
    <div
      className="rounded-lg border px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-3"
      style={{ borderColor: config.theme.primary, backgroundColor: `${config.theme.primary}12` }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.theme.iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{gatewayT.editingDepartment}</p>
          <p className="font-semibold text-foreground">{deptT[config.nameKey]}</p>
        </div>
      </div>
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
      >
        <ArrowLeftRight className="h-4 w-4" />
        {gatewayT.changeDepartment}
      </Link>
    </div>
  );
};
