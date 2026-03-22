import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Download, Eye, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchAllExamResults, type ExamResultItem } from '@/integrations/firebase/examResults';
import { storage } from '@/integrations/firebase/client';
import { getBlob, ref } from 'firebase/storage';
import { toast } from '@/hooks/use-toast';

function fileNameFromTitle(title: string): string {
  const base = title
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '-')
    .trim()
    .slice(0, 100);
  return (base || 'exam-result') + '.pdf';
}

function isFirebaseStorageDownloadUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === 'firebasestorage.googleapis.com' ||
      u.hostname === 'storage.googleapis.com'
    );
  } catch {
    return false;
  }
}

function saveBlobAsFile(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

async function triggerPdfDownload(url: string, title: string): Promise<void> {
  const filename = fileNameFromTitle(title);
  try {
    let blob: Blob;
    if (isFirebaseStorageDownloadUrl(url)) {
      const storageRef = ref(storage, url);
      blob = await getBlob(storageRef);
    } else {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      blob = await res.blob();
    }
    saveBlobAsFile(blob, filename);
  } catch (e) {
    console.error('PDF download failed', e);
    toast({
      variant: 'destructive',
      title: 'Download failed',
      description: 'Opening the PDF in a new tab instead.',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

const ResultsPage: React.FC = () => {
  const { t } = useLanguage();
  const [results, setResults] = useState<ExamResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [examFilter, setExamFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchAllExamResults();
        if (!cancelled) setResults(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError('Could not load exam results. Please try again later.');
          setResults([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const examNames = useMemo(() => {
    const names = [...new Set(results.map((r) => r.examName).filter(Boolean))];
    return names.sort((a, b) => a.localeCompare(b));
  }, [results]);

  const publishDates = useMemo(() => {
    const dates = [...new Set(results.map((r) => r.publishDate).filter(Boolean))];
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      if (examFilter !== 'all' && r.examName !== examFilter) return false;
      if (dateFilter !== 'all' && r.publishDate !== dateFilter) return false;
      return true;
    });
  }, [results, examFilter, dateFilter]);

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.results }]} title={t.results.title} subtitle={t.results.subtitle} />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger className="w-56 min-w-[12rem]">
                <SelectValue placeholder={t.results.filterByExam} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All exams</SelectItem>
                {examNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-44 min-w-[10rem]">
                <SelectValue placeholder={t.results.filterByDate} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                {publishDates.map((d) => (
                  <SelectItem key={d} value={d}>
                    {new Date(d).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <p className="text-center text-muted-foreground py-12">{t.common.loading}</p>
          )}
          {!isLoading && !loadError && filteredResults.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No results to display.</p>
          )}

          <div className="grid gap-4 max-w-4xl mx-auto">
            {!isLoading &&
              !loadError &&
              filteredResults.map((result) => {
                const hasPdf = Boolean(result.pdfUrl?.trim());
                return (
                  <Card key={result.id} className="gov-card">
                    <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-foreground mb-1">{result.examName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Published:{' '}
                            {result.publishDate
                              ? new Date(result.publishDate).toLocaleDateString()
                              : '—'}
                          </p>
                        </div>
                      </div>
                      {hasPdf ? (
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" asChild>
                            <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-2" />
                              View PDF
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            className="gov-btn-primary"
                            type="button"
                            disabled={downloadingId === result.id}
                            onClick={() => {
                              void (async () => {
                                setDownloadingId(result.id);
                                try {
                                  await triggerPdfDownload(result.pdfUrl, result.examName);
                                } finally {
                                  setDownloadingId(null);
                                }
                              })();
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {downloadingId === result.id ? t.common.loading : t.results.downloadPDF}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground shrink-0">No PDF linked</span>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResultsPage;
