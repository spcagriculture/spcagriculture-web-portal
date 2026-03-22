import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AdminTab =
  | 'services'
  | 'news'
  | 'notices'
  | 'publications'
  | 'videos'
  | 'statistics'
  | 'projects'
  | 'circulars'
  | 'documents'
  | 'officers'
  | 'exams'
  | 'vacancies'
  | 'results';

export const AdminCategoryTabs: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab: AdminTab = location.pathname.startsWith('/admin/news')
    ? 'news'
    : location.pathname.startsWith('/admin/notices')
      ? 'notices'
      : location.pathname.startsWith('/admin/publications')
        ? 'publications'
        : location.pathname.startsWith('/admin/videos')
          ? 'videos'
          : location.pathname.startsWith('/admin/statistics')
            ? 'statistics'
            : location.pathname.startsWith('/admin/projects')
              ? 'projects'
              : location.pathname.startsWith('/admin/circulars')
                ? 'circulars'
                : location.pathname.startsWith('/admin/documents')
                  ? 'documents'
                  : location.pathname.startsWith('/admin/officers')
                    ? 'officers'
                    : location.pathname.startsWith('/admin/exams')
                      ? 'exams'
                      : location.pathname.startsWith('/admin/vacancies')
                        ? 'vacancies'
                        : location.pathname.startsWith('/admin/results')
                          ? 'results'
                          : 'services';

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (value === 'news') navigate('/admin/news');
        else if (value === 'notices') navigate('/admin/notices');
        else if (value === 'publications') navigate('/admin/publications');
        else if (value === 'videos') navigate('/admin/videos');
        else if (value === 'statistics') navigate('/admin/statistics');
        else if (value === 'projects') navigate('/admin/projects');
        else if (value === 'circulars') navigate('/admin/circulars');
        else if (value === 'documents') navigate('/admin/documents');
        else if (value === 'officers') navigate('/admin/officers');
        else if (value === 'exams') navigate('/admin/exams');
        else if (value === 'vacancies') navigate('/admin/vacancies');
        else if (value === 'results') navigate('/admin/results');
        else navigate('/admin/services');
      }}
    >
      <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
        <TabsTrigger value="services">{t.nav.services}</TabsTrigger>
        <TabsTrigger value="news">{t.nav.news}</TabsTrigger>
        <TabsTrigger value="notices">{t.nav.notices}</TabsTrigger>
        <TabsTrigger value="publications">{t.nav.publications}</TabsTrigger>
        <TabsTrigger value="videos">{t.nav.videos}</TabsTrigger>
        <TabsTrigger value="statistics">{t.nav.statistics}</TabsTrigger>
        <TabsTrigger value="projects">{t.nav.projects}</TabsTrigger>
        <TabsTrigger value="circulars">{t.nav.circulars}</TabsTrigger>
        <TabsTrigger value="documents">{t.nav.documents}</TabsTrigger>
        <TabsTrigger value="officers">{t.nav.officers}</TabsTrigger>
        <TabsTrigger value="exams">{t.nav.exams}</TabsTrigger>
        <TabsTrigger value="vacancies">{t.nav.vacancies}</TabsTrigger>
        <TabsTrigger value="results">{t.nav.results}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

