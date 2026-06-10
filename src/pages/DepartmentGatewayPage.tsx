import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDepartment } from '@/contexts/DepartmentContext';
import { DepartmentPicker } from '@/components/DepartmentPicker';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import type { Language } from '@/i18n/translations';
import { departmentBasePath, type DepartmentId } from '@/constants/departments';
import { Link } from 'react-router-dom';

const DepartmentGatewayPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  const languageLabels: Record<Language, string> = {
    en: 'English',
    si: 'සිංහල',
    ta: 'தமிழ்',
  };
  const navigate = useNavigate();
  const { setDepartment } = useDepartment();
  const gatewayT = t.gateway as Record<string, string>;

  const handleSelect = (id: DepartmentId) => {
    setDepartment(id);
    navigate(departmentBasePath(id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold text-foreground text-sm md:text-base">{t.siteName}</p>
              <p className="text-xs text-muted-foreground">{t.siteSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/province"
              className="text-sm text-muted-foreground hover:text-primary hidden sm:inline"
            >
              {gatewayT.provincePortal}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t.common.selectLanguage}>
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? 'bg-accent' : ''}
                  >
                    {languageLabels[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="gov-hero py-16 md:py-24">
          <div className="gov-hero-pattern" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {gatewayT.title}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-2">
              {gatewayT.subtitle}
            </p>
            <p className="text-white/70 text-sm max-w-xl mx-auto">
              {gatewayT.hint}
            </p>
          </div>
        </section>

        <section className="gov-section -mt-8 relative z-10">
          <div className="container mx-auto px-4 max-w-5xl">
            <DepartmentPicker onSelect={handleSelect} variant="public" />
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>{t.footer.copyright}</p>
      </footer>
    </div>
  );
};

export default DepartmentGatewayPage;
