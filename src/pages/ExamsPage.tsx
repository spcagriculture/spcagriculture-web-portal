import React, { useEffect, useState } from 'react';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Download, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAllExams, type ExamItem } from '@/integrations/firebase/exams';
import { storage } from '@/integrations/firebase/client';
import { getBlob, ref } from 'firebase/storage';
import { toast } from '@/hooks/use-toast';

function fileNameFromTitle(title: string): string {
  const base = title
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '-')
    .trim()
    .slice(0, 100);
  return (base || 'application') + '.pdf';
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

function toAbsoluteRegisterUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

const ExamsPage: React.FC = () => {
  const { departmentId, basePath, config } = useDepartmentRoute();
  const { t } = useLanguage();
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(false);
        const data = await fetchAllExams(departmentId);
        if (!cancelled) setExams(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError(true);
          setExams([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  if (!departmentId) return null;

  const deptName = config ? (t.departments as Record<string, string>)[config.nameKey] : '';

  return (
    <DepartmentLayout>
      <PageHero
        homePath={basePath}
        breadcrumb={[{ label: deptName, path: basePath }, { label: t.nav.exams }]}
        title={t.exams.title}
        subtitle={t.exams.subtitle}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4">
          {isLoading && (
            <p className="text-center text-muted-foreground py-12">{t.common.loading}</p>
          )}
          {loadError && !isLoading && (
            <p className="text-center text-destructive py-12" role="alert">
              Could not load exams. Please try again later.
            </p>
          )}
          {!isLoading && !loadError && exams.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No exams or courses to display.</p>
          )}

          <div className="grid gap-6 max-w-4xl mx-auto">
            {!isLoading &&
              !loadError &&
              exams.map((exam) => {
                const pdfUrl = exam.applicationPdfUrl.trim();
                const registerHref = toAbsoluteRegisterUrl(exam.registerUrl);
                return (
                  <Card key={exam.id} className="gov-card">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {exam.type}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Calendar className="h-4 w-4" />
                          {exam.dates}
                        </div>
                      </div>
                      <h2 className="font-bold text-xl text-foreground mb-3">{exam.title}</h2>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{t.exams.eligibility}:</span>{' '}
                        {exam.eligibility}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        <span className="font-medium text-foreground">{t.exams.instructions}:</span>{' '}
                        {exam.instructions}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pdfUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            disabled={downloadingId === exam.id}
                            onClick={() => {
                              void (async () => {
                                setDownloadingId(exam.id);
                                try {
                                  await triggerPdfDownload(pdfUrl, exam.title);
                                } finally {
                                  setDownloadingId(null);
                                }
                              })();
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            <a href={exam.applicationPdfUrl} target="_blank" rel="noopener noreferrer">
                              Download PDF
                            </a>
                          </Button>
                        )}
                        {registerHref && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                            <a href={registerHref} target="_blank" rel="noopener noreferrer">
                              <ClipboardList className="h-4 w-4 mr-2" />
                              {t.exams.register}
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>
    </DepartmentLayout>
  );
};

export default ExamsPage;
