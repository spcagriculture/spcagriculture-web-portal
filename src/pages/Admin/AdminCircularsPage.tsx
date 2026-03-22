import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Trash2, Edit2, Save, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { auth } from '@/integrations/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import {
  createCircular,
  deleteCircular,
  fetchAllCirculars,
  updateCircular,
  type CircularItem,
} from '@/integrations/firebase/circulars';
import { uploadToStorage } from '@/integrations/firebase/storageUpload';
import { AdminMediaUrlField } from '@/components/admin/AdminMediaUrlField';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const todayIso = () => new Date().toISOString().slice(0, 10);

const AdminCircularsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [items, setItems] = React.useState<CircularItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    title: string;
    category: string;
    date: string;
    pdfUrl: string;
  }>({
    title: '',
    category: '',
    date: todayIso(),
    pdfUrl: '',
  });

  const [pendingPdfFile, setPendingPdfFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<CircularItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const loadCirculars = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllCirculars();
      setItems(data);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Failed to load circulars',
        description: 'Please refresh and try again.',
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setIsAuthReady(true);
      if (!current) navigate('/admin', { replace: true });
    });
    return () => unsub();
  }, [navigate]);

  React.useEffect(() => {
    if (!user) return;
    void loadCirculars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!editingId;
    try {
      setIsSaving(true);
      let pdfUrl = form.pdfUrl.trim();
      if (pendingPdfFile) {
        pdfUrl = await uploadToStorage('circulars/pdfs', pendingPdfFile);
      }

      if (!pdfUrl) {
        toast({
          variant: 'destructive',
          title: 'PDF required',
          description: 'Upload a PDF or paste a direct PDF URL.',
        });
        return;
      }

      const payload = {
        title: form.title,
        category: form.category.trim() || 'General',
        date: form.date,
        pdfUrl,
      };

      if (editingId) {
        await updateCircular(editingId, payload);
      } else {
        await createCircular(payload);
      }

      setForm({
        title: '',
        category: '',
        date: todayIso(),
        pdfUrl: '',
      });
      setPendingPdfFile(null);
      setEditingId(null);
      setDialogOpen(false);
      await loadCirculars();
      toast({
        title: isEditing ? 'Circular updated' : 'Circular created',
        description: 'Saved successfully.',
      });
    } catch (err: unknown) {
      console.error(err);
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: string }).code)
          : '';
      const message = err instanceof Error ? err.message : String(err);
      toast({
        variant: 'destructive',
        title: 'Failed to save',
        description: [code, message].filter(Boolean).join(' — ') || 'Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: CircularItem) => {
    setEditingId(item.id);
    setPendingPdfFile(null);
    setForm({
      title: item.title,
      category: item.category,
      date: item.date,
      pdfUrl: item.pdfUrl,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setPendingPdfFile(null);
    setForm({
      title: '',
      category: '',
      date: todayIso(),
      pdfUrl: '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setPendingPdfFile(null);
    setForm({
      title: '',
      category: '',
      date: todayIso(),
      pdfUrl: '',
    });
  };

  const requestDelete = (item: CircularItem) => {
    setPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCircular(pendingDelete.id);
      await loadCirculars();
      toast({ title: 'Circular deleted', description: 'Removed successfully.' });
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Failed to delete',
        description: 'Please try again.',
      });
    } finally {
      setDeleteDialogOpen(false);
      setPendingDelete(null);
    }
  };

  if (!isAuthReady) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-sm text-muted-foreground">
          Checking authentication...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="gov-hero py-16">
        <div className="gov-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <nav className="gov-breadcrumb mb-4 text-primary-foreground/80">
              <Link to="/" className="hover:text-primary-foreground">
                {t.nav.home}
              </Link>
              <span>/</span>
              <Link to="/admin" className="hover:text-primary-foreground">
                {t.nav.admin}
              </Link>
              <span>/</span>
              <span>{t.nav.circulars}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Circulars management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Upload PDFs to Firebase Storage or link an existing PDF URL.
            </p>
            <div className="mt-6">
              <AdminCategoryTabs />
            </div>
          </div>
        </div>
      </section>

      {user && (
        <section className="gov-section bg-muted/40 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Circulars
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add circular
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>All circulars</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No circulars yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-2"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.category} •{' '}
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {item.date}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open PDF
                              </a>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => requestDelete(item)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit circular' : 'Add circular'}</DialogTitle>
            <DialogDescription>
              PDF is stored in Firebase Storage when you upload a file.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="circ-title">Title</Label>
              <Input
                id="circ-title"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="circ-category">{t.circulars.category}</Label>
              <Input
                id="circ-category"
                value={form.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                placeholder="e.g. Administrative, Agriculture"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="circ-date">{t.circulars.date}</Label>
              <Input
                id="circ-date"
                type="date"
                value={form.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                required
              />
            </div>

            <AdminMediaUrlField
              id="circ-pdf"
              label="PDF (upload or URL)"
              accept=".pdf,application/pdf"
              url={form.pdfUrl}
              onUrlChange={(v) => handleFormChange('pdfUrl', v)}
              pendingFile={pendingPdfFile}
              onPendingFileChange={setPendingPdfFile}
              chooseFileLabel="Upload PDF"
              urlHint="Or paste a direct link to a PDF file"
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gov-btn-primary" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this circular?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
              {pendingDelete?.title ? ` “${pendingDelete.title}”` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminCircularsPage;
