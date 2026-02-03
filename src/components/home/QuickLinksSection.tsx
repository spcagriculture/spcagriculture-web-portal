import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Bell, Laptop } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const quickLinks = [
  { icon: Laptop, path: '/services', translationKey: 'services' as const },
  { icon: FileText, path: '/documents', translationKey: 'forms' as const },
  { icon: Users, path: '/officers', translationKey: 'officers' as const },
  { icon: Bell, path: '/notices', translationKey: 'notices' as const },
];

export const QuickLinksSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 relative z-20">
          {quickLinks.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="gov-card group text-center p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {t.quickLinks[item.translationKey]}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
