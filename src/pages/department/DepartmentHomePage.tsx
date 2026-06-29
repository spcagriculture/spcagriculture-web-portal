import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper, Briefcase, Users, BarChart3 } from 'lucide-react';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { NewsSection } from '@/components/home/NewsSection';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { cn } from '@/lib/utils';
import { getPortalSettings, PortalSettings } from '@/integrations/firebase/portalSettings';

const DepartmentHomePage: React.FC = () => {
  const { departmentId, config, basePath } = useDepartmentRoute();
  const { t } = useLanguage();
  const [settings, setSettings] = React.useState<PortalSettings | null>(null);

  React.useEffect(() => {
    getPortalSettings().then(setSettings).catch(console.error);
  }, []);

  if (!departmentId || !config) return null;

  const deptT = t.departments as Record<string, string>;
  const gatewayT = t.gateway as Record<string, string>;
  const deptName = deptT[config.nameKey];
  const Icon = config.icon;

  const quickLinks = [
    { icon: Newspaper, label: t.nav.news, path: `${basePath}/news` },
    { icon: Briefcase, label: t.nav.services, path: `${basePath}/services` },
    { icon: Users, label: t.nav.officers, path: `${basePath}/officers` },
    { icon: BarChart3, label: t.nav.statistics, path: `${basePath}/statistics` },
  ];

  return (
    <DepartmentLayout>
      <section className="relative min-h-[480px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${settings?.departmentHeroImages?.[departmentId] || config.theme.heroImage}), linear-gradient(135deg, ${config.theme.primary}, ${config.theme.primary})`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${config.theme.primary}e6, ${config.theme.primary}cc)`,
          }}
        />
        <div className="gov-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-3xl">
            <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6', config.theme.iconClass)}>
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{deptName}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {gatewayT[config.taglineKey] ?? deptName}
            </h1>
            <p className="text-lg text-white/90 mb-8">
              {gatewayT[config.descriptionKey]}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gov-btn-hero">
                <Link to={`${basePath}/services`}>
                  {t.hero.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Link to={`${basePath}/news`}>{t.hero.secondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="gov-section-alt">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="gov-card flex flex-col items-center text-center p-6 hover:shadow-md transition-shadow"
                >
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3', config.theme.iconClass)}>
                    <LinkIcon className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-foreground">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <NewsSection departmentId={departmentId} basePath={basePath} />
      <GalleryPreview departmentId={departmentId} basePath={basePath} />
    </DepartmentLayout>
  );
};

export default DepartmentHomePage;
