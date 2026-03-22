import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Trash2, Edit2, Save, Calendar, ImageIcon, X } from 'lucide-react';
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
  createGalleryEvent,
  deleteGalleryEvent,
  fetchAllGalleryEvents,
  updateGalleryEvent,
  type GalleryEventItem,
} from '@/integrations/firebase/gallery';
import { uploadToStorage } from '@/integrations/firebase/storageUpload';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const todayIso = () => new Date().toISOString().slice(0, 10);

const AdminGalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [items, setItems] = React.useState<GalleryEventItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formTitle, setFormTitle] = React.useState('');
  const [formDate, setFormDate] = React.useState(todayIso());
  const [formImages, setFormImages] = React.useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = React.useState('');
  const [newImageFile, setNewImageFile] = React.useState<File | null>(null);
  const [isAddingImage, setIsAddingImage] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<GalleryEventItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllGalleryEvents();
      setItems(data);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Failed to load gallery',
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
    void loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const resetForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDate(todayIso());
    setFormImages([]);
    setNewImageUrl('');
    setNewImageFile(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (item: GalleryEventItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormDate(item.date || todayIso());
    setFormImages([...item.images]);
    setNewImageUrl('');
    setNewImageFile(null);
    setDialogOpen(true);
  };

  const handleAddImage = async () => {
    try {
      setIsAddingImage(true);
      let url = newImageUrl.trim();
      if (newImageFile) {
        url = await uploadToStorage('gallery/images', newImageFile);
      }
      if (!url) {
        toast({
          variant: 'destructive',
          title: 'Add an image',
          description: 'Paste a URL or choose a file to upload.',
        });
        return;
      }
      setFormImages((prev) => [...prev, url]);
      setNewImageUrl('');
      setNewImageFile(null);
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setIsAddingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'Title required',
        description: 'Enter an album title.',
      });
      return;
    }
    if (formImages.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Add at least one image',
        description: 'Upload files or paste image URLs before saving.',
      });
      return;
    }

    const isEditing = !!editingId;
    try {
      setIsSaving(true);
      const payload = {
        title: formTitle.trim(),
        date: formDate,
        images: formImages,
      };
      if (editingId) {
        await updateGalleryEvent(editingId, payload);
      } else {
        await createGalleryEvent(payload);
      }
      handleCloseDialog();
      await loadItems();
      toast({
        title: isEditing ? 'Album updated' : 'Album created',
        description: 'Gallery changes were saved.',
      });
    } catch (err: unknown) {
      console.error(err);
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: string }).code)
          : '';
      toast({
        variant: 'destructive',
        title: 'Failed to save',
        description: code || 'Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (item: GalleryEventItem) => {
    setPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteGalleryEvent(pendingDelete.id);
      await loadItems();
      toast({ title: 'Album removed', description: 'The gallery entry was deleted.' });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Delete failed',
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
              <span>{t.nav.gallery}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Gallery management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Create photo albums for the public gallery. Images can be uploaded or linked by URL.
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
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Photo albums
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add album
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Existing albums</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading gallery...</p>
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No albums yet. Click &quot;Add album&quot; to create one with a title, date, and
                      images.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-3"
                        >
                          <div className="flex gap-3 min-w-0">
                            <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted border">
                              {item.images[0] ? (
                                <img
                                  src={item.images[0]}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {item.date
                                  ? new Date(item.date).toLocaleDateString()
                                  : '—'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.images.length} photo{item.images.length === 1 ? '' : 's'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
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
        <DialogContent className="max-w-[95vw] sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit album' : 'Add album'}</DialogTitle>
            <DialogDescription>
              Set a title and date, then add one or more images via upload or URL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery-date">Event date</Label>
              <Input
                id="gallery-date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Photos in this album</Label>
              {formImages.length === 0 ? (
                <p className="text-xs text-muted-foreground">No images yet.</p>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {formImages.map((url, idx) => (
                    <li
                      key={`${url}-${idx}`}
                      className="flex items-center gap-2 text-sm bg-muted/50 rounded px-2 py-1"
                    >
                      <span className="truncate flex-1 text-xs">{url}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() =>
                          setFormImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
              <p className="text-sm font-medium">Add another image</p>
              <div className="space-y-2">
                <Label htmlFor="gallery-new-file">Upload file</Label>
                <Input
                  key={`gallery-file-${formImages.length}`}
                  id="gallery-new-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gallery-new-url">Or image URL</Label>
                <Input
                  id="gallery-new-url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isAddingImage}
                onClick={() => void handleAddImage()}
              >
                {isAddingImage ? 'Adding…' : 'Add to album'}
              </Button>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gov-btn-primary" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving…' : editingId ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this album?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the gallery entry from the site. Uploaded files in Storage are not
              deleted automatically.{' '}
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

export default AdminGalleryPage;
