import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { fetchNewsById } from '@/integrations/firebase/news';
import type { NewsItem } from '@/integrations/firebase/news';

const NewsDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = React.useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchNewsById(id);
        setItem(data);
      } catch (err) {
        console.error('Failed to load news item', err);
        setError('Failed to load news item. Please try again later.');
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading news...</p>
        </section>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{error ?? 'News item not found.'}</p>
            <Link to="/news" className="text-primary hover:underline">
              {t.common.back} to {t.nav.news}
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const categoryLabel = item.category === 'event' ? t.news.event : t.news.announcement;

  return (
    <Layout>
      <PageHero
        breadcrumb={[{ label: t.nav.news, path: '/news' }, { label: item.title }]}
        title={item.title}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant="secondary">{categoryLabel}</Badge>
            {item.isUrgent && (
              <Badge className="gov-badge-urgent">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {t.news.urgent}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(item.date).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden mb-8">
            <img src={item.image} alt={item.title} className="w-full h-80 object-cover" />
          </div>
          <p className="text-muted-foreground lead mb-6">{item.description}</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground whitespace-pre-line">{item.body}</p>
          </div>
          <div className="mt-8">
            <Link to="/news" className="text-primary hover:underline">{t.common.back} to {t.nav.news}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetailPage;
