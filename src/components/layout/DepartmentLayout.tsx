import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftRight, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DepartmentLayoutProps {
  children: React.ReactNode;
}

export const DepartmentLayout: React.FC<DepartmentLayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const { departmentId, config, basePath } = useDepartmentRoute();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  if (!departmentId || !config) return null;

  const deptT = t.departments as Record<string, string>;
  const deptName = deptT[config.nameKey];
  const Icon = config.icon;

  const navItems = [
    { path: basePath, label: t.nav.home, exact: true },
    { path: `${basePath}/news`, label: t.nav.news },
    { path: `${basePath}/notices`, label: t.nav.notices },
    { path: `${basePath}/services`, label: t.nav.services },
    { path: `${basePath}/publications`, label: t.nav.publications },
    { path: `${basePath}/gallery`, label: t.nav.gallery },
    { path: `${basePath}/videos`, label: t.nav.videos },
    { path: `${basePath}/statistics`, label: t.nav.statistics },
    { path: `${basePath}/projects`, label: t.nav.projects },
    { path: `${basePath}/officers`, label: t.nav.officers },
    { path: `${basePath}/exams`, label: t.nav.exams },
    { path: `${basePath}/vacancies`, label: t.nav.vacancies },
    { path: `${basePath}/results`, label: t.nav.results },
    { path: `${basePath}/circulars`, label: t.nav.circulars },
    { path: `${basePath}/documents`, label: t.nav.documents },
    { path: `${basePath}/contact`, label: t.nav.contact },
  ];

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={
        {
          '--dept-primary': config.theme.primary,
          '--dept-accent': config.theme.accent,
        } as React.CSSProperties
      }
    >
      <div
        className="text-white py-2 text-sm"
        style={{ backgroundColor: config.theme.primary }}
      >
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="font-medium">{deptName}</span>
            <span className="hidden sm:inline opacity-80">| {t.siteSubtitle}</span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:underline text-white/90"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            {(t.gateway as Record<string, string>).switchDepartment}
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to={basePath} className="flex items-center gap-2 font-semibold text-foreground">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', config.theme.iconClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">{deptName}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-wrap justify-end">
            {navItems.slice(0, 8).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-2.5 py-1.5 rounded-md text-sm transition-colors',
                  isActive(item.path, item.exact)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/province"
              className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {(t.gateway as Record<string, string>).provincePortal}
            </Link>
            <ThemeToggle />
          </nav>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm',
                  isActive(item.path, item.exact) ? 'bg-primary/10 text-primary' : 'text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">{deptName} — {t.siteSubtitle}</p>
          <p>{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
};
