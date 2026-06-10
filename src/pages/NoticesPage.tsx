import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, AlertTriangle, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchAllNotices, type NoticeItem } from '@/integrations/firebase/notices';

const NoticesPage: React.FC = () => {
  const { departmentId, basePath, config } = useDepartmentRoute();
  const { t } = useLanguage();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!departmentId) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchAllNotices(departmentId);
        if (!cancelled) setNotices(data);
      } catch (e) {
        console.error('Failed to load notices', e);
        if (!cancelled) {
          setLoadError('Could not load notices. Please try again later.');
          setNotices([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  const filteredNotices = useMemo(() => {
    let list = [...notices];
    if (urgencyFilter === 'high') list = list.filter((n) => n.urgency === 'high');
    if (urgencyFilter === 'normal') list = list.filter((n) => n.urgency === 'normal');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) =>
      sortOrder === 'latest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return list;
  }, [notices, urgencyFilter, sortOrder, searchQuery]);

  if (!departmentId) return null;

  const deptName = config ? (t.departments as Record<string, string>)[config.nameKey] : '';

  return (
    <DepartmentLayout>
      <PageHero
        homePath={basePath}
        breadcrumb={[{ label: deptName, path: basePath }, { label: t.nav.notices }]}
        title={t.notices.title}
        subtitle={t.notices.subtitle}
      />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <Input
                placeholder={t.common.search}
                className="w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t.notices.filterByUrgency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">{t.news.urgent}</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t.notices.sortByDate} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground">
              {isLoading ? '…' : filteredNotices.length} {t.common.view.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          {loadError && (
            <p className="text-destructive text-center mb-8" role="alert">
              {loadError}
            </p>
          )}
          {isLoading && !loadError && (
            <p className="text-center text-muted-foreground py-12">Loading notices...</p>
          )}
          {!isLoading && !loadError && filteredNotices.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No notices to display.</p>
          )}
          <div className="grid gap-8">
            {!isLoading &&
              !loadError &&
              filteredNotices.map((notice) => (
              <article
                key={notice.id}
                className="gov-card overflow-hidden p-0 flex flex-col md:flex-row"
              >
                <div className="md:w-72 shrink-0">
                  <img src={notice.image} alt={notice.title} className="w-full h-48 md:h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {notice.urgency === 'high' && (
                      <Badge className="gov-badge-urgent">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t.news.urgent}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
                      <Calendar className="h-4 w-4" />
                      {new Date(notice.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h2 className="font-bold text-xl text-foreground mb-3">{notice.title}</h2>
                  <p className="text-muted-foreground mb-4 flex-1">{notice.summary}</p>
                  <Button asChild variant="ghost" className="w-fit p-0 h-auto text-primary hover:text-primary/80">
                    <Link to={`${basePath}/notices/${notice.id}`}>
                      {t.notices.readMore}
                      <span className="ml-1">→</span>
                    </Link>
                  </Button>
                </div>
              </article>
              ))}
          </div>
        </div>
      </section>
    </DepartmentLayout>
  );
};

export default NoticesPage;
