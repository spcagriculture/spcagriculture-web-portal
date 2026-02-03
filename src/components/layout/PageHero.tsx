import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeroProps {
  breadcrumb: { label: string; path?: string }[];
  title: string;
  subtitle?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ breadcrumb, title, subtitle }) => {
  const { t } = useLanguage();

  return (
    <section className="gov-hero py-16">
      <div className="gov-hero-pattern" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <nav className="gov-breadcrumb mb-4 text-primary-foreground/80">
            <Link to="/" className="hover:text-primary-foreground">{t.nav.home}</Link>
            {breadcrumb.map((item, i) => (
              <React.Fragment key={i}>
                <span>/</span>
                {item.path ? (
                  <Link to={item.path} className="hover:text-primary-foreground">{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-primary-foreground/90">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
