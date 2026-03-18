import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, ArrowRight, AlertTriangle, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { NewsCategory, NewsItem } from '@/integrations/firebase/news';
import { fetchAllNews } from '@/integrations/firebase/news';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NewsPage: React.FC = () => {
  const { t } = useLanguage();

  const PAGE_SIZE = 6;
  type SortOrder = 'latest' | 'oldest';

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [news, setNews] = React.useState<NewsItem[]>([]);

  const [categoryFilter, setCategoryFilter] = React.useState<'all' | NewsCategory>('all');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('latest');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllNews();
        setNews(data);
      } catch (err) {
        console.error('Failed to load news', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [categoryFilter, sortOrder]);

  const filteredAndSortedNews = React.useMemo(() => {
    const filtered =
      categoryFilter === 'all' ? news : news.filter((item) => item.category === categoryFilter);

    const getSortValue = (item: NewsItem) => {
      // Prefer Firestore createdAt (stable) but fall back to date if needed.
      if (typeof item.createdAt === 'number') return item.createdAt;
      const parsed = Date.parse(item.date);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    filtered.sort((a, b) => {
      const av = getSortValue(a);
      const bv = getSortValue(b);
      return sortOrder === 'latest' ? bv - av : av - bv;
    });

    return filtered;
  }, [categoryFilter, news, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedNews.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedNews = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedNews.slice(start, start + PAGE_SIZE);
  }, [PAGE_SIZE, currentPage, filteredAndSortedNews]);

  return (
    <Layout>
      {/* Page Header */}
      <section className="gov-hero py-16">
        <div className="gov-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <nav className="gov-breadcrumb mb-4 text-primary-foreground/80">
              <Link to="/" className="hover:text-primary-foreground">{t.nav.home}</Link>
              <span>/</span>
              <span>{t.nav.news}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.news.title}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t.news.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground">
              {filteredAndSortedNews.length} items found
            </p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-12">Loading news...</p>
          ) : error ? (
            <p className="text-sm text-red-600 text-center py-12">{error}</p>
          ) : pagedNews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              No news found for the selected filters.
            </p>
          ) : (
            <div className="grid gap-8">
              {pagedNews.map((item, index) => (
                <article
                  key={item.id}
                  className="gov-card overflow-hidden p-0 flex flex-col md:flex-row animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="md:w-80 shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="secondary">
                        {item.category === 'event' ? t.news.event : t.news.announcement}
                      </Badge>
                      {item.isUrgent && (
                        <Badge className="gov-badge-urgent">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {t.news.urgent}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>

                    <h2 className="font-bold text-xl text-foreground mb-3">{item.title}</h2>
                    <p className="text-muted-foreground mb-4 flex-1">{item.description}</p>

                    <Button
                      asChild
                      variant="ghost"
                      className="w-fit p-0 h-auto text-primary hover:text-primary/80"
                    >
                      <Link to={`/news/${item.id}`}>
                        {t.news.readMore}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && filteredAndSortedNews.length > 0 && (
            <div className="flex justify-center mt-12 gap-2">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button variant="outline" className="bg-primary text-primary-foreground">
                {currentPage}
              </Button>
              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
