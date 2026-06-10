import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchNoticeById, type NoticeItem } from '@/integrations/firebase/notices';

const NoticeDetailPage: React.FC = () => {
  const { departmentId, basePath, config } = useDepartmentRoute();
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId || !id) {
      setNotice(null);
      setIsLoading(false);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchNoticeById(departmentId, id);
        if (!cancelled) setNotice(data);
      } catch (e) {
        console.error('Failed to load notice', e);
        if (!cancelled) {
          setLoadError('Could not load this notice.');
          setNotice(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [departmentId, id]);

  if (!departmentId) return null;

  const deptName = config ? (t.departments as Record<string, string>)[config.nameKey] : '';

  if (isLoading) {
    return (
      <DepartmentLayout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </section>
      </DepartmentLayout>
    );
  }

  if (loadError || !notice) {
    return (
      <DepartmentLayout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {loadError ?? 'Notice not found.'}
            </p>
            <Link to={`${basePath}/notices`} className="text-primary hover:underline">
              {t.common.back} to Notices
            </Link>
          </div>
        </section>
      </DepartmentLayout>
    );
  }

  return (
    <DepartmentLayout>
      <PageHero
        homePath={basePath}
        breadcrumb={[
          { label: deptName, path: basePath },
          { label: t.nav.notices, path: `${basePath}/notices` },
          { label: notice.title },
        ]}
        title={notice.title}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {notice.urgency === 'high' && (
              <Badge className="gov-badge-urgent">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {t.news.urgent}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(notice.date).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden mb-8">
            <img src={notice.image} alt={notice.title} className="w-full h-64 object-cover" />
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground lead mb-6">{notice.summary}</p>
            <p className="text-foreground whitespace-pre-line">{notice.body}</p>
          </div>
          <div className="mt-8">
            <Link to={`${basePath}/notices`} className="text-primary hover:underline">
              {t.common.back} to {t.nav.notices}
            </Link>
          </div>
        </div>
      </section>
    </DepartmentLayout>
  );
};

export default NoticeDetailPage;
