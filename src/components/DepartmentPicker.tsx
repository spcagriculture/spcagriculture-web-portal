import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DEPARTMENT_IDS,
  DEPARTMENTS,
  type DepartmentId,
} from '@/constants/departments';
import { cn } from '@/lib/utils';

interface DepartmentPickerProps {
  onSelect: (id: DepartmentId) => void;
  variant?: 'public' | 'admin';
  className?: string;
}

export const DepartmentPicker: React.FC<DepartmentPickerProps> = ({
  onSelect,
  variant = 'public',
  className,
}) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {DEPARTMENT_IDS.map((id, index) => {
        const config = DEPARTMENTS[id];
        const Icon = config.icon;
        const deptT = t.departments as Record<string, string>;
        const gatewayT = t.gateway as Record<string, string>;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              'gov-card text-left group animate-slide-up border-2 transition-all',
              config.theme.cardClass,
              variant === 'admin' && 'hover:shadow-lg'
            )}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div
              className={cn(
                'w-14 h-14 mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform',
                config.theme.iconClass
              )}
            >
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-foreground text-lg mb-2">
              {deptT[config.nameKey]}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {gatewayT[config.descriptionKey] ?? deptT[config.nameKey]}
            </p>
            <span className="inline-flex items-center text-primary text-sm font-medium">
              {variant === 'admin' ? gatewayT.adminSelect : gatewayT.selectDepartment}
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        );
      })}
    </div>
  );
};
