import React, { useEffect, useMemo, useState } from 'react';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Download, Calendar, Filter, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchAllCirculars, type CircularItem } from '@/integrations/firebase/circulars';
import { storage } from '@/integrations/firebase/client';
import { getBlob, ref } from 'firebase/storage';
import { toast } from '@/hooks/use-toast';

function fileNameFromTitle(title: string): string {
  const base = title
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '-')
    .trim()
    .slice(0, 100);
  return (base || 'circular') + '.pdf';
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

/**
 * getBlob() uses XHR to the same Storage URL as fetch(), so the bucket must allow
 * your web origin via GCS CORS (see firebase-storage-cors.json). Without CORS, we
 * fall back to opening the URL in a new tab.
 */
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

const CircularsPage: React.FC = () => {
  const { departmentId, basePath, config } = useDepartmentRoute();
  const { t } = useLanguage();
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchAllCirculars(departmentId);
        if (!cancelled) setCirculars(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError('Could not load circulars. Please try again later.');
          setCirculars([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  const categories = useMemo(() => {
    return [...new Set(circulars.map((c) => c.category).filter(Boolean))].sort();
  }, [circulars]);

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return circulars;
    return circulars.filter((c) => c.category === categoryFilter);
  }, [circulars, categoryFilter]);

  if (!departmentId) return null;

  const deptName = config ? (t.departments as Record<string, string>)[config.nameKey] : '';

  return (
    <DepartmentLayout>
      <PageHero
        homePath={basePath}
        breadcrumb={[{ label: deptName, path: basePath }, { label: t.nav.circulars }]}
        title={t.circulars.title}
        subtitle={t.circulars.subtitle}
      />

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
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
          {!isLoading && !loadError && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No circulars to display.</p>
          )}

          <div className="grid gap-4 max-w-4xl mx-auto">
            {!isLoading &&
              !loadError &&
              filtered.map((circular) => (
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
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="gov-btn-primary"
                        type="button"
                        disabled={downloadingId === circular.id}
                        onClick={() => {
                          void (async () => {
                            setDownloadingId(circular.id);
                            try {
                              await triggerPdfDownload(circular.pdfUrl, circular.title);
                            } finally {
                              setDownloadingId(null);
                            }
                          })();
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        <a
                          href={circular.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t.circulars.downloadPDF}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </DepartmentLayout>
  );
};

export default CircularsPage;
