import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wheat, Map, PawPrint, Fish, Droplets } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const departments = [
  { 
    icon: Wheat, 
    key: 'agriculture' as const,
    path: '/departments/agriculture',
    color: 'bg-emerald-100 text-emerald-600',
  },
  { 
    icon: Map, 
    key: 'land' as const,
    path: '/departments/land',
    color: 'bg-amber-100 text-amber-600',
  },
  { 
    icon: PawPrint, 
    key: 'animal' as const,
    path: '/departments/animal',
    color: 'bg-rose-100 text-rose-600',
  },
  { 
    icon: Fish, 
    key: 'fisheries' as const,
    path: '/departments/fisheries',
    color: 'bg-blue-100 text-blue-600',
  },
  { 
    icon: Droplets, 
    key: 'irrigation' as const,
    path: '/departments/irrigation',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

export const DepartmentsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="gov-section-alt">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.departments.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.departments.subtitle}
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <Link
                key={dept.key}
                to={dept.path}
                className="gov-card text-center group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${dept.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-3">
                  {t.departments[dept.key]}
                </h3>
                <span className="inline-flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.departments.viewDetails}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
