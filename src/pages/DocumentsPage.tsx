import React, { useEffect, useMemo, useState } from 'react';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Download, Search, Filter } from 'lucide-react';
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
import { fetchAllDocuments, type DocumentItem } from '@/integrations/firebase/documents';
import { storage } from '@/integrations/firebase/client';
import { getBlob, ref } from 'firebase/storage';
import { toast } from '@/hooks/use-toast';

const categoryKeys = ['circulars', 'forms', 'policies', 'reports', 'guidelines'] as const;

function fileNameFromTitle(title: string): string {
  const base = title
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '-')
    .trim()
    .slice(0, 100);
  return (base || 'document') + '.pdf';
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

const DocumentsPage: React.FC = () => {
  const { departmentId, basePath, config } = useDepartmentRoute();
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchAllDocuments(departmentId);
        if (!cancelled) setDocuments(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError('Could not load documents. Please try again later.');
          setDocuments([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  const filteredDocuments = useMemo(() => {
    let list = [...documents];
    if (categoryFilter !== 'all') list = list.filter((d) => d.category === categoryFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => d.title.toLowerCase().includes(q));
    }
    return list;
  }, [documents, categoryFilter, searchQuery]);

  if (!departmentId) return null;

  const deptName = config ? (t.departments as Record<string, string>)[config.nameKey] : '';

  return (
    <DepartmentLayout>
      <PageHero
        homePath={basePath}
        breadcrumb={[{ label: deptName, path: basePath }, { label: t.nav.documents }]}
        title={t.documents.title}
        subtitle={t.documents.subtitle}
      />

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
          {loadError && (
            <p className="text-destructive text-center mb-8" role="alert">
              {loadError}
            </p>
          )}
          {isLoading && !loadError && (
            <p className="text-center text-muted-foreground py-12">{t.common.loading}</p>
          )}
          {!isLoading && !loadError && filteredDocuments.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No documents to display.</p>
          )}

          <div className="grid gap-4 max-w-4xl mx-auto">
            {!isLoading &&
              !loadError &&
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="gov-card">
                  <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(doc.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="gov-btn-primary"
                        type="button"
                        disabled={downloadingId === doc.id}
                        onClick={() => {
                          void (async () => {
                            setDownloadingId(doc.id);
                            try {
                              await triggerPdfDownload(doc.pdfUrl, doc.title);
                            } finally {
                              setDownloadingId(null);
                            }
                          })();
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer">
                          {t.documents.downloadPDF}
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

export default DocumentsPage;
