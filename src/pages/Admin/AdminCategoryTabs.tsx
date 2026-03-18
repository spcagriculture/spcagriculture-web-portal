import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AdminTab = 'services' | 'news';

export const AdminCategoryTabs: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab: AdminTab = location.pathname.startsWith('/admin/news') ? 'news' : 'services';

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const next = value === 'news' ? '/admin/news' : '/admin/services';
        navigate(next);
      }}
    >
      <TabsList className="w-full justify-start">
        <TabsTrigger value="services">{t.nav.services}</TabsTrigger>
        <TabsTrigger value="news">{t.nav.news}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

