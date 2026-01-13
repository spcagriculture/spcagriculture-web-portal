import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Building2, Landmark, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const serviceCategories = [
  { 
    icon: Users, 
    key: 'g2c' as const,
    path: '/services/citizen',
    description: 'Land registration, agricultural permits, livestock licenses',
    count: 15,
  },
  { 
    icon: Briefcase, 
    key: 'g2e' as const,
    path: '/services/employee',
    description: 'Leave applications, training programs, transfers',
    count: 8,
  },
  { 
    icon: Building2, 
    key: 'g2b' as const,
    path: '/services/business',
    description: 'Commercial farming licenses, export permits',
    count: 12,
  },
  { 
    icon: Landmark, 
    key: 'g2g' as const,
    path: '/services/government',
    description: 'Inter-departmental coordination, policy implementation',
    count: 6,
  },
];

export const ServicesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="gov-section">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.services.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.key}
                to={category.path}
                className="gov-card group flex items-start gap-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 shrink-0 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-foreground">
                      {t.services[category.key]}
                    </h3>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {category.count} services
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-primary font-medium">
                    {t.common.view}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="gov-btn-outline">
            <Link to="/services">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
