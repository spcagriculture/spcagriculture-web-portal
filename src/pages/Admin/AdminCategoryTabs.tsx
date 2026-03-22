import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type AdminTab =
  | 'services'
  | 'news'
  | 'notices'
  | 'publications'
  | 'videos'
  | 'gallery'
  | 'statistics'
  | 'projects'
  | 'circulars'
  | 'documents'
  | 'officers'
  | 'exams'
  | 'vacancies'
  | 'results';

type Section = { tab: AdminTab; path: string };

/**
 * Derive which admin section is active from the URL only.
 * `/admin` alone matches nothing so no tab looks selected until the user navigates.
 */
function activeTabFromPath(pathname: string): AdminTab | null {
  if (pathname.startsWith('/admin/news')) return 'news';
  if (pathname.startsWith('/admin/notices')) return 'notices';
  if (pathname.startsWith('/admin/publications')) return 'publications';
  if (pathname.startsWith('/admin/videos')) return 'videos';
  if (pathname.startsWith('/admin/gallery')) return 'gallery';
  if (pathname.startsWith('/admin/statistics')) return 'statistics';
  if (pathname.startsWith('/admin/projects')) return 'projects';
  if (pathname.startsWith('/admin/circulars')) return 'circulars';
  if (pathname.startsWith('/admin/documents')) return 'documents';
  if (pathname.startsWith('/admin/officers')) return 'officers';
  if (pathname.startsWith('/admin/exams')) return 'exams';
  if (pathname.startsWith('/admin/vacancies')) return 'vacancies';
  if (pathname.startsWith('/admin/results')) return 'results';
  if (pathname.startsWith('/admin/services')) return 'services';
  return null;
}

export const AdminCategoryTabs: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = useMemo(() => activeTabFromPath(location.pathname), [location.pathname]);

  const sections: Section[] = useMemo(
    () => [
      { tab: 'services', path: '/admin/services' },
      { tab: 'news', path: '/admin/news' },
      { tab: 'notices', path: '/admin/notices' },
      { tab: 'publications', path: '/admin/publications' },
      { tab: 'videos', path: '/admin/videos' },
      { tab: 'gallery', path: '/admin/gallery' },
      { tab: 'statistics', path: '/admin/statistics' },
      { tab: 'projects', path: '/admin/projects' },
      { tab: 'circulars', path: '/admin/circulars' },
      { tab: 'documents', path: '/admin/documents' },
      { tab: 'officers', path: '/admin/officers' },
      { tab: 'exams', path: '/admin/exams' },
      { tab: 'vacancies', path: '/admin/vacancies' },
      { tab: 'results', path: '/admin/results' },
    ],
    []
  );

  const labelFor = (tab: AdminTab): string => {
    switch (tab) {
      case 'services':
        return t.nav.services;
      case 'news':
        return t.nav.news;
      case 'notices':
        return t.nav.notices;
      case 'publications':
        return t.nav.publications;
      case 'videos':
        return t.nav.videos;
      case 'gallery':
        return t.nav.gallery;
      case 'statistics':
        return t.nav.statistics;
      case 'projects':
        return t.nav.projects;
      case 'circulars':
        return t.nav.circulars;
      case 'documents':
        return t.nav.documents;
      case 'officers':
        return t.nav.officers;
      case 'exams':
        return t.nav.exams;
      case 'vacancies':
        return t.nav.vacancies;
      case 'results':
        return t.nav.results;
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Admin sections"
      className="inline-flex w-full flex-wrap items-center justify-start gap-1 rounded-md bg-muted p-1 text-muted-foreground"
    >
      {sections.map(({ tab, path }) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => navigate(path)}
          >
            {labelFor(tab)}
          </button>
        );
      })}
    </div>
  );
};
