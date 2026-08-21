import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Search, ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/integrations/firebase/client';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProvincialPortalFloatingButton } from '@/components/layout/ProvincialPortalFloatingButton';

const languageLabels: Record<Language, string> = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்',
};

const mainNavItems = (t: typeof import('@/i18n/translations').translations.en) => [
  { path: '/', label: t.nav.home },
  { path: '/province', label: (t.gateway as Record<string, string>).provincePortal },
  { path: '/ministry', label: t.nav.ministry },
  { path: '/sabaragamuwa', label: t.nav.province },
  { path: '/departments', label: t.nav.departments },
  { path: '/contact', label: t.nav.contact },
];

const dropdownNavGroups = (t: typeof import('@/i18n/translations').translations.en) => [
  {
    label: t.nav.groupCareers,
    items: [
      { path: '/bookings', label: t.nav.bookings },
    ],
  },
];

export interface HeaderProps {
  hideNav?: boolean;
  departmentConfig?: {
    name: string;
    primaryColor: string;
    icon: React.ElementType;
  };
}

export const Header: React.FC<HeaderProps> = ({ hideNav = false, departmentConfig }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => setUser(current));
    return () => unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const isGroupActive = (paths: string[]) => paths.some((p) => isActive(p));
  const isProvincialPortal = location.pathname === '/province';
  const navItems = mainNavItems(t).filter((item) => !(isProvincialPortal && item.path === '/'));
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  const showLogout = isAdminRoute && !!user;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const topBarBgClass = departmentConfig ? 'text-white py-2' : 'bg-foreground/95 text-background py-2';
  const topBarStyle = departmentConfig ? { backgroundColor: departmentConfig.primaryColor } : {};

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className={topBarBgClass} style={topBarStyle}>
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center text-sm gap-2">
          <div className="flex items-center gap-4">
            {departmentConfig ? (
              <div className="flex items-center gap-2">
                <departmentConfig.icon className="h-4 w-4" />
                <span className="font-medium">{departmentConfig.name}</span>
                <span className="hidden sm:inline opacity-80">| {t.siteSubtitle}</span>
              </div>
            ) : (
              <>
                <span className="hidden md:inline">📞 +94 45 2222 123</span>
                <span className="hidden md:inline">✉️ info@sabaragamuwa.gov.lk</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {departmentConfig && (
              <Link
                to="/select-department"
                className="inline-flex items-center gap-1 hover:underline text-white/90 mr-2 md:mr-4"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{(t.gateway as Record<string, string>).switchDepartment}</span>
              </Link>
            )}
            <ThemeToggle variant="topBar" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-inherit hover:text-inherit/80 hover:bg-transparent gap-2">
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
            {showLogout ? (
              <button
                type="button"
                className="hover:underline hidden md:inline text-inherit"
                onClick={() => void handleLogout()}
              >
                Logout
              </button>
            ) : (
              <Link to="/admin" className="hover:underline hidden md:inline text-inherit">
                {t.nav.admin}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      {!hideNav && (
        <div className="gov-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <Link to="/" className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 bg-white rounded-full overflow-hidden shadow-md">
                  <img
                    src="/council%20logo.jpeg"
                    alt={t.siteName}
                    className="h-full w-full object-cover object-center scale-150"
                  />
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
                {navItems.map((item) => (
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
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`gov-nav-link ${isActive(item.path) ? 'gov-nav-link-active' : ''} ${item.path === '/province' ? 'hidden md:block' : ''}`}
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
                {showLogout ? (
                  <button
                    type="button"
                    className="gov-nav-link mt-2 border-t border-white/20 pt-4 text-left"
                    onClick={() => {
                      setIsMenuOpen(false);
                      void handleLogout();
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/admin"
                    className="gov-nav-link mt-2 border-t border-white/20 pt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.nav.admin}
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      )}
      <ProvincialPortalFloatingButton />
    </header>
  );
};
