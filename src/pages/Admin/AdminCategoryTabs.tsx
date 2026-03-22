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
  | 'statistics';

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
      </TabsList>
    </Tabs>
  );
};

