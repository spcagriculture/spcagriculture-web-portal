import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
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

const mockNotices = [
  { id: '1', title: 'Land Registration Deadline Extension', summary: 'Deadline extended to March 31, 2024 for all pending applications.', date: '2024-01-14', urgency: 'high', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' },
  { id: '2', title: 'Agricultural Subsidy Program 2024', summary: 'Applications open for the provincial agricultural subsidy program.', date: '2024-01-10', urgency: 'normal', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400' },
  { id: '3', title: 'Office Closure - Provincial Day', summary: 'All ministry offices will be closed on Provincial Day.', date: '2024-01-08', urgency: 'normal', image: 'https://images.unsplash.com/photo-1560693225-b8507d6f3aa9?w=400' },
  { id: '4', title: 'Urgent: Veterinary Services Notice', summary: 'Temporary relocation of veterinary clinic in Kegalle.', date: '2024-01-12', urgency: 'high', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400' },
];

const NoticesPage: React.FC = () => {
  const { t } = useLanguage();
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotices = useMemo(() => {
    let list = [...mockNotices];
    if (urgencyFilter === 'high') list = list.filter((n) => n.urgency === 'high');
    if (urgencyFilter === 'normal') list = list.filter((n) => n.urgency === 'normal');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
    }
    list.sort((a, b) => (sortOrder === 'latest' ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime()));
    return list;
  }, [urgencyFilter, sortOrder, searchQuery]);

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.notices }]} title={t.notices.title} subtitle={t.notices.subtitle} />

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
            <p className="text-muted-foreground">{filteredNotices.length} {t.common.view.toLowerCase()}</p>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {filteredNotices.map((notice) => (
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
                    <Link to={`/notices/${notice.id}`}>
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
    </Layout>
  );
};

export default NoticesPage;
