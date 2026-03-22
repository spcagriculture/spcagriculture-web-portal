import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Download, Eye, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchAllPublications,
  type PublicationItem,
  type PublicationKind,
} from '@/integrations/firebase/publications';

function typeBadgeLabel(type: PublicationKind): string {
  switch (type) {
    case 'journal':
      return 'Journal';
    case 'other':
      return 'Other';
    default:
      return 'Report';
  }
}

const PublicationsPage: React.FC = () => {
  const { t } = useLanguage();
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('latest');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchAllPublications();
        if (!cancelled) setPublications(data);
      } catch (e) {
        console.error('Failed to load publications', e);
        if (!cancelled) {
          setLoadError('Could not load publications. Please try again later.');
          setPublications([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPublications = useMemo(() => {
    let list = [...publications];
    if (typeFilter === 'report') list = list.filter((p) => p.type === 'report');
    if (typeFilter === 'journal') list = list.filter((p) => p.type === 'journal');
    if (typeFilter === 'other') list = list.filter((p) => p.type === 'other');
    list.sort((a, b) =>
      sortOrder === 'latest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return list;
  }, [publications, typeFilter, sortOrder]);

  return (
    <Layout>
      {/* Page Header */}
      <section className="gov-hero py-16">
        <div className="gov-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <nav className="gov-breadcrumb mb-4 text-primary-foreground/80">
              <Link to="/" className="hover:text-primary-foreground">
                {t.nav.home}
              </Link>
              <span>/</span>
              <span>{t.nav.publications}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.publications.title}
            </h1>
            <p className="text-lg text-primary-foreground/90">{t.publications.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="journal">Journals</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
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
              {isLoading ? '…' : filteredPublications.length} publications found
            </p>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          {loadError && (
            <p className="text-destructive text-center mb-8" role="alert">
              {loadError}
            </p>
          )}
          {isLoading && !loadError && (
            <p className="text-center text-muted-foreground py-12">Loading publications...</p>
          )}
          {!isLoading && !loadError && filteredPublications.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No publications to display.</p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!isLoading &&
              !loadError &&
              filteredPublications.map((pub, index) => (
                <Card
                  key={pub.id}
                  className="gov-card overflow-hidden p-0 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative h-48 bg-muted">
                    <img
                      src={pub.image}
                      alt={pub.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">
                      {typeBadgeLabel(pub.type)}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(pub.date).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      <FileText className="h-4 w-4" />
                      {pub.pages} pages
                    </div>

                    <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                      {pub.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {pub.description}
                    </p>

                    <div className="flex gap-2">
                      {pub.viewUrl.trim() ? (
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a
                            href={pub.viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {t.publications.viewOnline}
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1" disabled>
                          <Eye className="h-4 w-4 mr-1" />
                          {t.publications.viewOnline}
                        </Button>
                      )}
                      {pub.downloadUrl.trim() ? (
                        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" asChild>
                          <a
                            href={pub.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {t.publications.download}
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90"
                          disabled
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {t.publications.download}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PublicationsPage;
