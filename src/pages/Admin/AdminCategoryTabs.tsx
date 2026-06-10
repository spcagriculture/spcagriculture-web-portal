import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { isDepartmentId } from '@/constants/departments';
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

type Section = { tab: AdminTab; segment: string };

const TAB_SEGMENTS: Section[] = [
  { tab: 'services', segment: 'services' },
  { tab: 'news', segment: 'news' },
  { tab: 'notices', segment: 'notices' },
  { tab: 'publications', segment: 'publications' },
  { tab: 'videos', segment: 'videos' },
  { tab: 'gallery', segment: 'gallery' },
  { tab: 'statistics', segment: 'statistics' },
  { tab: 'projects', segment: 'projects' },
  { tab: 'circulars', segment: 'circulars' },
  { tab: 'documents', segment: 'documents' },
  { tab: 'officers', segment: 'officers' },
  { tab: 'exams', segment: 'exams' },
  { tab: 'vacancies', segment: 'vacancies' },
  { tab: 'results', segment: 'results' },
];

function activeTabFromPath(pathname: string): AdminTab | null {
  const deptMatch = pathname.match(/^\/admin\/[^/]+\/([^/]+)/);
  if (deptMatch) {
    const segment = deptMatch[1];
    const found = TAB_SEGMENTS.find((s) => s.segment === segment);
    return found?.tab ?? null;
  }
  return null;
}

export const AdminCategoryTabs: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { department } = useParams<{ department: string }>();

  const activeTab = useMemo(() => activeTabFromPath(location.pathname), [location.pathname]);

  const adminBase =
    department && isDepartmentId(department) ? `/admin/${department}` : '/admin';

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
      {TAB_SEGMENTS.map(({ tab, segment }) => {
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
            onClick={() => navigate(`${adminBase}/${segment}`)}
          >
            {labelFor(tab)}
          </button>
        );
      })}
    </div>
  );
};
