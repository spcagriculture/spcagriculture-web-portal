import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Download, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockResults = [
  { id: '1', examName: 'Agriculture Extension Officer Exam 2023', publishDate: '2024-01-20', attachmentUrl: '#' },
  { id: '2', examName: 'Land Survey Technical Exam 2023', publishDate: '2024-01-15', attachmentUrl: '#' },
  { id: '3', examName: 'Veterinary Assistant Training - Final Results', publishDate: '2023-12-01', attachmentUrl: '#' },
];

const ResultsPage: React.FC = () => {
  const { t } = useLanguage();
  const [examFilter, setExamFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const filteredResults = [...mockResults].filter((r) => {
    if (examFilter !== 'all' && r.examName !== examFilter) return false;
    if (dateFilter !== 'all' && r.publishDate !== dateFilter) return false;
    return true;
  });

  const dates = [...new Set(mockResults.map((r) => r.publishDate))];

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.results }]} title={t.results.title} subtitle={t.results.subtitle} />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder={t.results.filterByExam} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {mockResults.map((r) => (
                  <SelectItem key={r.id} value={r.examName}>{r.examName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t.results.filterByDate} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {dates.map((d) => (
                  <SelectItem key={d} value={d}>{new Date(d).toLocaleDateString()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 max-w-4xl mx-auto">
            {filteredResults.map((result) => (
              <Card key={result.id} className="gov-card">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{result.examName}</h3>
                    <p className="text-sm text-muted-foreground">Published: {new Date(result.publishDate).toLocaleDateString()}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={result.attachmentUrl}>
                      <Download className="h-4 w-4 mr-2" />
                      {t.results.downloadPDF}
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

export default ResultsPage;
