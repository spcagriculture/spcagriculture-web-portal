import React, { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Download, Eye, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categoryKeys = ['circulars', 'forms', 'policies', 'reports', 'guidelines'] as const;

const mockDocuments = [
  { id: '1', title: 'Land Registration Application Form', category: 'forms', department: 'Land', date: '2024-01-10', pdfUrl: '#' },
  { id: '2', title: 'Agricultural Subsidy Policy 2024', category: 'policies', department: 'Agriculture', date: '2024-01-05', pdfUrl: '#' },
  { id: '3', title: 'Annual Report 2023', category: 'reports', department: 'Ministry', date: '2024-01-01', pdfUrl: '#' },
  { id: '4', title: 'Guidelines for Organic Certification', category: 'guidelines', department: 'Agriculture', date: '2023-12-15', pdfUrl: '#' },
  { id: '5', title: 'Leave Application Form', category: 'forms', department: 'Administration', date: '2023-12-01', pdfUrl: '#' },
];

const DocumentsPage: React.FC = () => {
  const { t } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = useMemo(() => {
    let list = [...mockDocuments];
    if (categoryFilter !== 'all') list = list.filter((d) => d.category === categoryFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => d.title.toLowerCase().includes(q) || d.department.toLowerCase().includes(q));
    }
    return list;
  }, [categoryFilter, searchQuery]);

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.documents }]} title={t.documents.title} subtitle={t.documents.subtitle} />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t.documents.searchPlaceholder}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder={t.documents.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categoryKeys.map((key) => (
                  <SelectItem key={key} value={key}>{t.documents.categories[key]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 max-w-4xl mx-auto">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="gov-card">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">{doc.department} • {new Date(doc.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-2" />
                        {t.documents.viewPDF}
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.pdfUrl}>
                        <Download className="h-4 w-4 mr-2" />
                        {t.documents.download}
                      </a>
                    </Button>
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

export default DocumentsPage;
