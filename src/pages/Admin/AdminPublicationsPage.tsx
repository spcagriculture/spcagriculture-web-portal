import React from 'react';
import { Link } from 'react-router-dom';
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
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminDepartmentBanner } from '@/components/admin/AdminDepartmentBanner';
import {
  createPublication,
  deletePublication,
  fetchAllPublications,
  updatePublication,
  type PublicationItem,
  type PublicationKind,
} from '@/integrations/firebase/publications';
import { uploadToStorage } from '@/integrations/firebase/storageUpload';
import { AdminMediaUrlField } from '@/components/admin/AdminMediaUrlField';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const todayIso = () => new Date().toISOString().slice(0, 10);
const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800';

function typeBadgeLabel(type: PublicationKind): string {
  switch (type) {
    case 'journal':
      return 'Journal';
    case 'other':
      return 'Other';
    default:
      return 'Report';
  }
}

const AdminPublicationsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAuthReady, departmentId } = useAdminAuth();

  const [items, setItems] = React.useState<PublicationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    title: string;
    description: string;
    type: PublicationKind;
    date: string;
    image: string;
    pages: string;
    viewUrl: string;
    downloadUrl: string;
  }>({
    title: '',
    description: '',
    type: 'report',
    date: todayIso(),
    image: '',
    pages: '0',
    viewUrl: '',
    downloadUrl: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<PublicationItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [pendingCoverFile, setPendingCoverFile] = React.useState<File | null>(null);
  const [pendingPdfFile, setPendingPdfFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const loadPublications = async () => {
    if (!departmentId) return;
    try {
      setIsLoading(true);
      const data = await fetchAllPublications(departmentId);
      setItems(data);
    } catch (error) {
      console.error('Failed to load publications', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load publications',
        description: 'Please refresh and try again.',
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isAuthReady || !user || !departmentId) return;
    void loadPublications();
  }, [isAuthReady, user, departmentId]);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!editingId;
    const pagesParsed = Math.max(0, Math.floor(Number(form.pages) || 0));

    try {
      setIsSaving(true);
      let imageUrl = form.image.trim();
      if (pendingCoverFile) {
        imageUrl = await uploadToStorage(departmentId!, 'publications/covers', pendingCoverFile);
      }
      const normalizedImage =
        imageUrl.length > 0 ? imageUrl : DEFAULT_COVER_IMAGE;

      let downloadUrl = form.downloadUrl.trim();
      if (pendingPdfFile) {
        downloadUrl = await uploadToStorage(departmentId!, 'publications/files', pendingPdfFile);
      }

      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        date: form.date,
        image: normalizedImage,
        pages: pagesParsed,
        viewUrl: form.viewUrl.trim(),
        downloadUrl,
      };

      if (editingId) {
        await updatePublication(departmentId!, editingId, payload);
      } else {
        await createPublication(departmentId!, payload);
      }

      setForm({
        title: '',
        description: '',
        type: 'report',
        date: todayIso(),
        image: '',
        pages: '0',
        viewUrl: '',
        downloadUrl: '',
      });
      setPendingCoverFile(null);
      setPendingPdfFile(null);

      setEditingId(null);
      setDialogOpen(false);
      await loadPublications();

      toast({
        title: isEditing ? 'Publication updated' : 'Publication created',
        description: 'Your changes were saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save publication', error);
      const firebaseCode =
        (error as any)?.code || (error as any)?.name || 'unknown';
      toast({
        variant: 'destructive',
        title: 'Failed to save publication',
        description: `Please try again. ${firebaseCode}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: PublicationItem) => {
    setEditingId(item.id);
    setPendingCoverFile(null);
    setPendingPdfFile(null);
    setForm({
      title: item.title,
      description: item.description,
      type: item.type,
      date: item.date,
      image: item.image,
      pages: String(item.pages),
      viewUrl: item.viewUrl,
      downloadUrl: item.downloadUrl,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setPendingCoverFile(null);
    setPendingPdfFile(null);
    setForm({
      title: '',
      description: '',
      type: 'report',
      date: todayIso(),
      image: '',
      pages: '0',
      viewUrl: '',
      downloadUrl: '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setPendingCoverFile(null);
    setPendingPdfFile(null);
    setForm({
      title: '',
      description: '',
      type: 'report',
      date: todayIso(),
      image: '',
      pages: '0',
      viewUrl: '',
      downloadUrl: '',
    });
  };

  const requestDelete = (item: PublicationItem) => {
    setPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePublication(departmentId!, pendingDelete.id);
      await loadPublications();
      toast({
        title: 'Publication deleted',
        description: 'The publication was removed successfully.',
      });
    } catch (error) {
      console.error('Failed to delete publication', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete publication',
        description: 'Please try again.',
      });
    } finally {
      setDeleteDialogOpen(false);
      setPendingDelete(null);
    }
  };

  if (!isAuthReady || !user || !departmentId) return null;

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
              <span>{t.nav.publications}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Publications Management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Manage the public Publications page.
            </p>
            <div className="mt-6">
              <AdminCategoryTabs />
            </div>
          </div>
        </div>
      </section>

      <section className="gov-section bg-muted/40 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <AdminDepartmentBanner departmentId={departmentId} />
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Existing Publications
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Publication
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Existing Publications</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading publications...</p>
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No publications found. Click “Create Publication” to add one.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-2"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium truncate">{item.title}</span>
                              <Badge variant="secondary">{typeBadgeLabel(item.type)}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                              <Calendar className="h-4 w-4" />
                              {item.date ? new Date(item.date).toLocaleDateString() : ''}
                              <span className="mx-1">•</span>
                              <FileText className="h-4 w-4" />
                              {item.pages} pages
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex gap-2">
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Publication' : 'Create Publication'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the details below, then save.'
                : 'Add a new publication below, then save.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pub-title">Title</Label>
              <Input
                id="pub-title"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pub-type">Type</Label>
                <select
                  id="pub-type"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={form.type}
                  onChange={(e) =>
                    handleFormChange('type', e.target.value as PublicationKind)
                  }
                >
                  <option value="report">Report</option>
                  <option value="journal">Journal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pub-date">Date</Label>
                <Input
                  id="pub-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-pages">Pages</Label>
              <Input
                id="pub-pages"
                type="number"
                min={0}
                step={1}
                value={form.pages}
                onChange={(e) => handleFormChange('pages', e.target.value)}
                required
              />
            </div>

            <AdminMediaUrlField
              id="pub-cover"
              label="Cover image (upload or URL)"
              accept="image/*"
              url={form.image}
              onUrlChange={(v) => handleFormChange('image', v)}
              pendingFile={pendingCoverFile}
              onPendingFileChange={setPendingCoverFile}
              chooseFileLabel="Upload cover"
            />

            <div className="space-y-2">
              <Label htmlFor="pub-description">Description</Label>
              <textarea
                id="pub-description"
                className="border rounded-md px-3 py-2 w-full min-h-[80px] bg-background"
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-view-url">View online URL (optional)</Label>
              <Input
                id="pub-view-url"
                value={form.viewUrl}
                onChange={(e) => handleFormChange('viewUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <AdminMediaUrlField
              id="pub-pdf"
              label="PDF / file for download (upload or URL)"
              accept=".pdf,application/pdf"
              url={form.downloadUrl}
              onUrlChange={(v) => handleFormChange('downloadUrl', v)}
              pendingFile={pendingPdfFile}
              onPendingFileChange={setPendingPdfFile}
              chooseFileLabel="Upload PDF"
              urlHint="Or paste a direct file URL"
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gov-btn-primary" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving…' : editingId ? 'Update Publication' : 'Create Publication'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this publication?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.{' '}
              {pendingDelete?.title ? `“${pendingDelete.title}”` : ''}
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

export default AdminPublicationsPage;
