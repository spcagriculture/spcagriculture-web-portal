import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Trash2, Edit2, Save, Calendar, Briefcase, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  createVacancy,
  deleteVacancy,
  fetchAllVacancies,
  updateVacancy,
  type VacancyItem,
} from '@/integrations/firebase/vacancies';
import { uploadToStorage } from '@/integrations/firebase/storageUpload';
import { AdminMediaUrlField } from '@/components/admin/AdminMediaUrlField';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const DEPT_KEYS = ['agriculture', 'land', 'animal', 'fisheries', 'irrigation'] as const;

const todayIso = () => new Date().toISOString().slice(0, 10);

const AdminVacanciesPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [items, setItems] = React.useState<VacancyItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    title: string;
    department: string;
    deadline: string;
    description: string;
    pdfUrl: string;
  }>({
    title: '',
    department: 'agriculture',
    deadline: todayIso(),
    description: '',
    pdfUrl: '',
  });

  const [pendingPdfFile, setPendingPdfFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<VacancyItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const loadVacancies = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllVacancies();
      setItems(data);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Failed to load vacancies',
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
    void loadVacancies();
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
        pdfUrl = await uploadToStorage('vacancies/pdfs', pendingPdfFile);
      }

      const payload = {
        title: form.title.trim(),
        department: form.department,
        deadline: form.deadline,
        description: form.description.trim(),
        pdfUrl,
      };

      if (!payload.title) {
        toast({
          variant: 'destructive',
          title: 'Title required',
          description: 'Please enter a job title.',
        });
        return;
      }

      if (editingId) {
        await updateVacancy(editingId, payload);
      } else {
        await createVacancy(payload);
      }

      setForm({
        title: '',
        department: 'agriculture',
        deadline: todayIso(),
        description: '',
        pdfUrl: '',
      });
      setPendingPdfFile(null);
      setEditingId(null);
      setDialogOpen(false);
      await loadVacancies();
      toast({
        title: isEditing ? 'Vacancy updated' : 'Vacancy created',
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

  const handleEdit = (item: VacancyItem) => {
    setEditingId(item.id);
    setPendingPdfFile(null);
    setForm({
      title: item.title,
      department: DEPT_KEYS.includes(item.department as (typeof DEPT_KEYS)[number])
        ? item.department
        : 'agriculture',
      deadline: item.deadline || todayIso(),
      description: item.description,
      pdfUrl: item.pdfUrl,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setPendingPdfFile(null);
    setForm({
      title: '',
      department: 'agriculture',
      deadline: todayIso(),
      description: '',
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
      department: 'agriculture',
      deadline: todayIso(),
      description: '',
      pdfUrl: '',
    });
  };

  const requestDelete = (item: VacancyItem) => {
    setPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteVacancy(pendingDelete.id);
      await loadVacancies();
      toast({ title: 'Vacancy deleted', description: 'Removed successfully.' });
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
              <span>{t.nav.vacancies}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Vacancies management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Post job openings with optional PDF notices (Firebase Storage or URL).
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
                  {t.nav.vacancies}
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add vacancy
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>All vacancies</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No vacancies yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-2"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="inline-flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {t.departments[item.department as keyof typeof t.departments] ??
                                    item.department}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {item.deadline}
                                </span>
                                {item.pdfUrl?.trim() ? (
                                  <>
                                    <span>•</span>
                                    <span>PDF</span>
                                  </>
                                ) : null}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0 flex-wrap">
                            {item.pdfUrl?.trim() ? (
                              <Button variant="outline" size="sm" asChild>
                                <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                                  Download PDF
                                </a>
                              </Button>
                            ) : null}
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
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
            <DialogTitle>{editingId ? 'Edit vacancy' : 'Add vacancy'}</DialogTitle>
            <DialogDescription>
              PDF is optional. Upload to Firebase Storage or paste a direct PDF URL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vac-title">Title</Label>
              <Input
                id="vac-title"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={form.department}
                onValueChange={(v) => handleFormChange('department', v)}
              >
                <SelectTrigger id="vac-dept">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPT_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t.departments[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vac-deadline">{t.vacancies.deadline}</Label>
              <Input
                id="vac-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => handleFormChange('deadline', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vac-desc">Description</Label>
              <Textarea
                id="vac-desc"
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={5}
                placeholder="Requirements, how to apply, etc."
              />
            </div>

            <AdminMediaUrlField
              id="vac-pdf"
              label="PDF (optional — upload or URL)"
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
            <AlertDialogTitle>Delete this vacancy?</AlertDialogTitle>
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

export default AdminVacanciesPage;
