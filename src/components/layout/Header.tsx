import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languageLabels: Record<Language, string> = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்',
};

const mainNavItems = (t: typeof import('@/i18n/translations').translations.en) => [
  { path: '/', label: t.nav.home },
  { path: '/ministry', label: t.nav.ministry },
  { path: '/province', label: t.nav.province },
  { path: '/departments', label: t.nav.departments },
  { path: '/services', label: t.nav.services },
  { path: '/news', label: t.nav.news },
  { path: '/gallery', label: t.nav.gallery },
  { path: '/contact', label: t.nav.contact },
];

const dropdownNavGroups = (t: typeof import('@/i18n/translations').translations.en) => [
  {
    label: t.nav.groupNotices,
    items: [
      { path: '/notices', label: t.nav.notices },
      { path: '/publications', label: t.nav.publications },
      { path: '/videos', label: t.nav.videos },
    ],
  },
  {
    label: t.nav.groupData,
    items: [
      { path: '/statistics', label: t.nav.statistics },
      { path: '/projects', label: t.nav.projects },
      { path: '/circulars', label: t.nav.circulars },
      { path: '/documents', label: t.nav.documents },
    ],
  },
  {
    label: t.nav.groupCareers,
    items: [
      { path: '/officers', label: t.nav.officers },
      { path: '/exams', label: t.nav.exams },
      { path: '/vacancies', label: t.nav.vacancies },
      { path: '/results', label: t.nav.results },
      { path: '/bookings', label: t.nav.bookings },
    ],
  },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const isGroupActive = (paths: string[]) => paths.some((p) => isActive(p));

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="bg-foreground/95 text-background py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">📞 +94 45 2222 123</span>
            <span className="hidden md:inline">✉️ info@sabaragamuwa.gov.lk</span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-background hover:text-background/80 hover:bg-transparent gap-2">
                  <Globe className="h-4 w-4" />
                  {languageLabels[language]}
                  <ChevronDown className="h-3 w-3" />
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
            <Link to="/admin" className="hover:underline hidden md:inline">
              {t.nav.admin}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="gov-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-3xl">🏛️</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold leading-tight">
                  {t.siteName}
                </h1>
                <p className="text-sm opacity-90">{t.siteSubtitle}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 flex-wrap">
              {mainNavItems(t).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`gov-nav-link ${isActive(item.path) ? 'gov-nav-link-active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              {dropdownNavGroups(t).map((group) => (
                <DropdownMenu key={group.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`gov-nav-link inline-flex items-center gap-1 ${isGroupActive(group.items.map((i) => i.path)) ? 'gov-nav-link-active' : ''}`}
                    >
                      {group.label}
                      <ChevronDown className="h-4 w-4 opacity-80" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px]">
                    {group.items.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className={isActive(item.path) ? 'bg-accent font-medium' : ''}
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>

            {/* Search and Mobile Menu */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/15">
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-primary-foreground hover:bg-white/15"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-white/20 animate-slide-up">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
              {mainNavItems(t).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`gov-nav-link ${isActive(item.path) ? 'gov-nav-link-active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {dropdownNavGroups(t).map((group) => (
                <div key={group.label} className="pt-2">
                  <p className="gov-nav-link text-primary-foreground/70 text-xs font-semibold uppercase tracking-wider px-2 pb-1">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-0.5 pl-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`gov-nav-link text-sm py-2 ${isActive(item.path) ? 'gov-nav-link-active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Link
                to="/admin"
                className="gov-nav-link mt-2 border-t border-white/20 pt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.admin}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
