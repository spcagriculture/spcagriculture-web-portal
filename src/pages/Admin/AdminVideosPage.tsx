import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Trash2, Edit2, Save, Calendar, Play } from 'lucide-react';
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
  createVideo,
  deleteVideo,
  extractYoutubeVideoId,
  fetchAllVideos,
  updateVideo,
  youtubeWatchUrl,
  type VideoDepartment,
  type VideoItem,
} from '@/integrations/firebase/videos';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const todayIso = () => new Date().toISOString().slice(0, 10);

const departmentKeys: VideoDepartment[] = [
  'agriculture',
  'land',
  'animal',
  'fisheries',
  'irrigation',
];

const AdminVideosPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [items, setItems] = React.useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    title: string;
    description: string;
    department: VideoDepartment;
    date: string;
    youtubeUrl: string;
  }>({
    title: '',
    description: '',
    department: 'agriculture',
    date: todayIso(),
    youtubeUrl: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<VideoItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllVideos();
      setItems(data);
    } catch (error) {
      console.error('Failed to load videos', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load videos',
        description: 'Please refresh and try again.',
      });
      setItems([]);
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
      void loadVideos();
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

    const vid = extractYoutubeVideoId(form.youtubeUrl);
    if (!vid) {
      toast({
        variant: 'destructive',
        title: 'Invalid YouTube link',
        description:
          'Paste a valid YouTube URL (watch, Shorts, youtu.be, or the 11-character video ID).',
      });
      return;
    }

    const normalizedUrl = youtubeWatchUrl(vid);
    const isEditing = !!editingId;

    try {
      if (editingId) {
        await updateVideo(editingId, {
          title: form.title,
          description: form.description,
          department: form.department,
          date: form.date,
          youtubeUrl: normalizedUrl,
        });
      } else {
        await createVideo({
          title: form.title,
          description: form.description,
          department: form.department,
          date: form.date,
          youtubeUrl: normalizedUrl,
        });
      }

      setForm({
        title: '',
        description: '',
        department: 'agriculture',
        date: todayIso(),
        youtubeUrl: '',
      });

      setEditingId(null);
      setDialogOpen(false);
      await loadVideos();

      toast({
        title: isEditing ? 'Video updated' : 'Video added',
        description: 'Your changes were saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save video', error);
      const firebaseCode =
        (error as any)?.code || (error as any)?.name || 'unknown';
      toast({
        variant: 'destructive',
        title: 'Failed to save video',
        description: `Please try again. ${firebaseCode}`,
      });
    }
  };

  const handleEdit = (item: VideoItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      department: item.department,
      date: item.date,
      youtubeUrl: item.youtubeUrl,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      department: 'agriculture',
      date: todayIso(),
      youtubeUrl: '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      department: 'agriculture',
      date: todayIso(),
      youtubeUrl: '',
    });
  };

  const requestDelete = (item: VideoItem) => {
    setPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteVideo(pendingDelete.id);
      await loadVideos();
      toast({
        title: 'Video removed',
        description: 'The entry was deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete video', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete video',
        description: 'Please try again.',
      });
    } finally {
      setDeleteDialogOpen(false);
      setPendingDelete(null);
    }
  };

  const getDepartmentLabel = (key: VideoDepartment) =>
    t.departments[key as keyof typeof t.departments] ?? key;

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
              <span>{t.nav.videos}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Videos Management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Add YouTube links only — no video file uploads.
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
                  Video links
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add video
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Existing entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading videos...</p>
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No videos yet. Click “Add video” and paste a YouTube URL.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => {
                        const vid = extractYoutubeVideoId(item.youtubeUrl);
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-3"
                          >
                            <div className="flex gap-3 min-w-0">
                              {vid && (
                                <div className="w-28 shrink-0 aspect-video rounded overflow-hidden bg-muted">
                                  <img
                                    src={`https://img.youtube.com/vi/${vid}/mqdefault.jpg`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium truncate">{item.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {getDepartmentLabel(item.department)} •{' '}
                                  {item.date
                                    ? new Date(item.date).toLocaleDateString()
                                    : ''}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              {vid && (
                                <Button variant="outline" size="sm" asChild>
                                  <a
                                    href={youtubeWatchUrl(vid)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Open
                                  </a>
                                </Button>
                              )}
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
                        );
                      })}
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
            <DialogTitle>{editingId ? 'Edit video' : 'Add video'}</DialogTitle>
            <DialogDescription>
              Paste a YouTube link (watch page, Shorts, youtu.be, or video ID). Files are not
              uploaded.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-title">Title</Label>
              <Input
                id="video-title"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-youtube">YouTube URL</Label>
              <Input
                id="video-youtube"
                value={form.youtubeUrl}
                onChange={(e) => handleFormChange('youtubeUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="video-dept">Department</Label>
                <select
                  id="video-dept"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={form.department}
                  onChange={(e) =>
                    handleFormChange('department', e.target.value as VideoDepartment)
                  }
                >
                  {departmentKeys.map((key) => (
                    <option key={key} value={key}>
                      {getDepartmentLabel(key)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-date">Date</Label>
                <Input
                  id="video-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-desc">Description</Label>
              <textarea
                id="video-desc"
                className="border rounded-md px-3 py-2 w-full min-h-[100px] bg-background"
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gov-btn-primary">
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this video entry?</AlertDialogTitle>
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

export default AdminVideosPage;
