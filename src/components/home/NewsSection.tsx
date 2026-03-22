import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchAllNews, type NewsItem } from '@/integrations/firebase/news';

const HOME_NEWS_LIMIT = 3;

export const NewsSection: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await fetchAllNews();
        if (!cancelled) setItems(all.slice(0, HOME_NEWS_LIMIT));
      } catch (e) {
        console.error('Failed to load news for home section', e);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'event':
        return t.news.event;
      case 'announcement':
        return t.news.announcement;
      default:
        return category;
    }
  };

  return (
    <section className="gov-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.news.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.news.subtitle}</p>
        </div>

        {isLoading && (
          <p className="text-center text-muted-foreground py-8">{t.common.loading}</p>
        )}

        {!isLoading && items.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No news to show yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!isLoading &&
            items.map((item, index) => (
              <article
                key={item.id}
                className="gov-card overflow-hidden p-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      {getCategoryLabel(item.category)}
                    </Badge>
                    {item.isUrgent && (
                      <Badge className="gov-badge-urgent">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t.news.urgent}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <Link
                    to={`/news/${item.id}`}
                    className="inline-flex items-center text-primary font-medium hover:underline"
                  >
                    {t.news.readMore}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="gov-btn-primary">
            <Link to="/news">
              {t.news.viewAll}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
