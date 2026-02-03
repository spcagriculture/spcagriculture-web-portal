import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockCirculars = [
  { id: '1', title: 'Circular 01/2024 - Leave Policy Amendment', category: 'Administrative', date: '2024-01-15', pdfUrl: '#' },
  { id: '2', title: 'Circular 02/2024 - Agricultural Subsidy Guidelines', category: 'Agriculture', date: '2024-01-10', pdfUrl: '#' },
  { id: '3', title: 'Circular 03/2024 - Land Registration Procedures', category: 'Land', date: '2024-01-08', pdfUrl: '#' },
];

const CircularsPage: React.FC = () => {
  const { t } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = categoryFilter === 'all' ? mockCirculars : mockCirculars.filter((c) => c.category === categoryFilter);
  const categories = [...new Set(mockCirculars.map((c) => c.category))];

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.circulars }]} title={t.circulars.title} subtitle={t.circulars.subtitle} />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t.circulars.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 max-w-4xl mx-auto">
            {filtered.map((circular) => (
              <Card key={circular.id} className="gov-card">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{circular.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{circular.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(circular.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={circular.pdfUrl}>
                      <Download className="h-4 w-4 mr-2" />
                      {t.circulars.downloadPDF}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CircularsPage;
