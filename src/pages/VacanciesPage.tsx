import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Download, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { fetchAllVacancies, type VacancyItem } from '@/integrations/firebase/vacancies';
import { storage } from '@/integrations/firebase/client';
import { getBlob, ref } from 'firebase/storage';
import { toast } from '@/hooks/use-toast';

function fileNameFromTitle(title: string): string {
  const base = title
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '-')
    .trim()
    .slice(0, 100);
  return (base || 'vacancy') + '.pdf';
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

const VacanciesPage: React.FC = () => {
  const { t } = useLanguage();
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [detailsVacancy, setDetailsVacancy] = useState<VacancyItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchAllVacancies();
        if (!cancelled) setVacancies(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError('Could not load vacancies. Please try again later.');
          setVacancies([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedVacancies = useMemo(() => {
    return [...vacancies].sort((a, b) => {
      const da = new Date(a.deadline).getTime();
      const db = new Date(b.deadline).getTime();
      return da - db;
    });
  }, [vacancies]);

  const deptLabel = (key: string) => {
    const k = key as keyof typeof t.departments;
    return t.departments[k] ?? key;
  };

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.vacancies }]} title={t.vacancies.title} subtitle={t.vacancies.subtitle} />

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
          {!isLoading && !loadError && sortedVacancies.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No vacancies to display.</p>
          )}

          <div className="grid gap-6 max-w-4xl mx-auto">
            {!isLoading &&
              !loadError &&
              sortedVacancies.map((vacancy) => {
                const hasPdf = Boolean(vacancy.pdfUrl?.trim());
                return (
                  <Card key={vacancy.id} className="gov-card">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="secondary">{deptLabel(vacancy.department)}</Badge>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
                          <Calendar className="h-4 w-4" />
                          {t.vacancies.deadline}:{' '}
                          {vacancy.deadline
                            ? new Date(vacancy.deadline).toLocaleDateString()
                            : '—'}
                        </div>
                      </div>
                      <h2 className="font-bold text-xl text-foreground mb-3">{vacancy.title}</h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{vacancy.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {hasPdf && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              disabled={downloadingId === vacancy.id}
                              onClick={() => {
                                void (async () => {
                                  setDownloadingId(vacancy.id);
                                  try {
                                    await triggerPdfDownload(vacancy.pdfUrl, vacancy.title);
                                  } finally {
                                    setDownloadingId(null);
                                  }
                                })();
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              <a
                                href={vacancy.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download PDF
                              </a>
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" className="text-primary" type="button" onClick={() => setDetailsVacancy(vacancy)}>
                          {t.vacancies.viewDetails}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      <Dialog open={!!detailsVacancy} onOpenChange={(open) => !open && setDetailsVacancy(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detailsVacancy?.title}</DialogTitle>
          </DialogHeader>
          {detailsVacancy && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{deptLabel(detailsVacancy.department)}</span>
                {' · '}
                {t.vacancies.deadline}:{' '}
                {detailsVacancy.deadline
                  ? new Date(detailsVacancy.deadline).toLocaleDateString()
                  : '—'}
              </p>
              <p className="text-foreground whitespace-pre-wrap">{detailsVacancy.description}</p>
              {detailsVacancy.pdfUrl?.trim() && (
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <a href={detailsVacancy.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default VacanciesPage;
