import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Trash2, Edit2, Save, Calendar, AlertTriangle } from 'lucide-react';
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
import { auth } from '@/integrations/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import {
  createNotice,
  deleteNotice,
  fetchAllNotices,
  updateNotice,
  type NoticeItem,
  type NoticeUrgency,
} from '@/integrations/firebase/notices';
import { uploadToStorage } from '@/integrations/firebase/storageUpload';
import { AdminMediaUrlField } from '@/components/admin/AdminMediaUrlField';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const todayIso = () => new Date().toISOString().slice(0, 10);
const DEFAULT_NOTICE_IMAGE =
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200';

const AdminNoticesPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [notices, setNotices] = React.useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    title: string;
    summary: string;
    body: string;
    urgency: NoticeUrgency;
    date: string;
    image: string;
  }>({
    title: '',
    summary: '',
    body: '',
    urgency: 'normal',
    date: todayIso(),
    image: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<NoticeItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const loadNotices = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load notices',
        description: 'Please refresh and try again.',
      });
      setNotices([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setIsAuthReady(true);

      if (!current) {
        navigate('/admin', { replace: true });
        return;
      }
      void loadNotices();
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!editingId;
    try {
      setIsSaving(true);
      let imageUrl = form.image.trim();
      if (pendingImageFile) {
        imageUrl = await uploadToStorage('notices/images', pendingImageFile);
      }
      const normalizedImage =
        imageUrl.length > 0 ? imageUrl : DEFAULT_NOTICE_IMAGE;

      if (editingId) {
        await updateNotice(editingId, {
          title: form.title,
          summary: form.summary,
          body: form.body,
          urgency: form.urgency,
          date: form.date,
          image: normalizedImage,
        });
      } else {
        await createNotice({
          title: form.title,
          summary: form.summary,
          body: form.body,
          urgency: form.urgency,
          date: form.date,
          image: normalizedImage,
        });
      }

      setForm({
        title: '',
        summary: '',
        body: '',
        urgency: 'normal',
        date: todayIso(),
        image: '',
      });
      setPendingImageFile(null);

      setEditingId(null);
      setDialogOpen(false);
      await loadNotices();

      toast({
        title: isEditing ? 'Notice updated' : 'Notice created',
        description: 'Your changes were saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save notice', error);
      const firebaseCode =
        (error as any)?.code || (error as any)?.name || 'unknown';
      toast({
        variant: 'destructive',
        title: 'Failed to save notice',
        description: `Please try again. ${firebaseCode}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: NoticeItem) => {
    setEditingId(item.id);
    setPendingImageFile(null);
    setForm({
      title: item.title,
      summary: item.summary,
      body: item.body,
      urgency: item.urgency,
      date: item.date,
      image: item.image,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setPendingImageFile(null);
    setForm({
      title: '',
      summary: '',
      body: '',
      urgency: 'normal',
      date: todayIso(),
      image: '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setPendingImageFile(null);
    setForm({
      title: '',
      summary: '',
      body: '',
      urgency: 'normal',
      date: todayIso(),
      image: '',
    });
  };

  const requestDelete = (item: NoticeItem) => {
    setPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteNotice(pendingDelete.id);
      await loadNotices();
      toast({
        title: 'Notice deleted',
        description: 'The notice was removed successfully.',
      });
    } catch (error) {
      console.error('Failed to delete notice', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete notice',
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
              <span>{t.nav.notices}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Notices Management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Manage the public Notices page.
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
                  Existing Notices
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Notice
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Existing Notices</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading notices...</p>
                  ) : notices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No notices found. Click “Create Notice” to add one.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {notices.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-2"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium truncate">{item.title}</span>
                              {item.urgency === 'high' && (
                                <Badge className="gov-badge-urgent">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {t.news.urgent}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                              <Calendar className="h-4 w-4" />
                              {item.date ? new Date(item.date).toLocaleDateString() : ''}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.summary}
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
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Notice' : 'Create Notice'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the details below, then save.'
                : 'Add a new notice below, then save.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notice-title">Title</Label>
              <Input
                id="notice-title"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="notice-urgency">Urgency</Label>
                <select
                  id="notice-urgency"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={form.urgency}
                  onChange={(e) =>
                    handleFormChange('urgency', e.target.value as NoticeUrgency)
                  }
                >
                  <option value="normal">Normal</option>
                  <option value="high">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notice-date">Date</Label>
                <Input
                  id="notice-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice-summary">Summary</Label>
              <textarea
                id="notice-summary"
                className="border rounded-md px-3 py-2 w-full min-h-[80px] bg-background"
                value={form.summary}
                onChange={(e) => handleFormChange('summary', e.target.value)}
                required
              />
            </div>

            <AdminMediaUrlField
              id="notice-image"
              label="Cover image (upload or URL)"
              accept="image/*"
              url={form.image}
              onUrlChange={(v) => handleFormChange('image', v)}
              pendingFile={pendingImageFile}
              onPendingFileChange={setPendingImageFile}
              chooseFileLabel="Upload image"
            />

            <div className="space-y-2">
              <Label htmlFor="notice-body">Body</Label>
              <textarea
                id="notice-body"
                className="border rounded-md px-3 py-2 w-full min-h-[160px] bg-background"
                value={form.body}
                onChange={(e) => handleFormChange('body', e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gov-btn-primary" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving…' : editingId ? 'Update Notice' : 'Create Notice'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this notice?</AlertDialogTitle>
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

export default AdminNoticesPage;
