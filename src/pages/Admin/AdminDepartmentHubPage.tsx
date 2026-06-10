import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AdminCategoryTabs } from './AdminCategoryTabs';
import { AdminDepartmentBanner } from '@/components/admin/AdminDepartmentBanner';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminDepartmentHubPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAuthReady, departmentId } = useAdminAuth();

  if (!isAuthReady || !user || !departmentId) return null;

  return (
    <Layout>
      <section className="gov-hero py-12">
        <div className="gov-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <nav className="gov-breadcrumb mb-4 text-primary-foreground/80">
            <Link to="/" className="hover:text-primary-foreground">
              {t.nav.home}
            </Link>
            <span>/</span>
            <Link to="/admin" className="hover:text-primary-foreground">
              {t.nav.admin}
            </Link>
            <span>/</span>
            <span>{(t.departments as Record<string, string>)[departmentId]}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            {(t.gateway as Record<string, string>).adminHubTitle}
          </h1>
        </div>
      </section>

      <section className="gov-section bg-muted/40 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          <AdminDepartmentBanner departmentId={departmentId} />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">{(t.gateway as Record<string, string>).manageContent}</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {(t.gateway as Record<string, string>).signedInAs} {user.email}
            </span>
          </div>

          <Card className="gov-card">
            <CardContent className="pt-6">
              <AdminCategoryTabs />
              <p className="mt-4 text-sm text-muted-foreground">
                {(t.gateway as Record<string, string>).adminHubHint}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDepartmentHubPage;
