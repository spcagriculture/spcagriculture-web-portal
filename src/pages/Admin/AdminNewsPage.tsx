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
  createNews,
  deleteNews,
  fetchAllNews,
  updateNews,
  type NewsCategory,
  type NewsItem,
} from '@/integrations/firebase/news';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const todayIso = () => new Date().toISOString().slice(0, 10);
const DEFAULT_NEWS_IMAGE =
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200";

const AdminNewsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = React.useState(false);

  const [editingNewsId, setEditingNewsId] = React.useState<string | null>(null);
  const [newsForm, setNewsForm] = React.useState<{
    title: string;
    description: string;
    body: string;
    category: NewsCategory;
    isUrgent: boolean;
    date: string;
    image: string;
  }>({
    title: '',
    description: '',
    body: '',
    category: 'announcement',
    isUrgent: false,
    date: todayIso(),
    image: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [newsPendingDelete, setNewsPendingDelete] = React.useState<NewsItem | null>(null);

  const [newsDialogOpen, setNewsDialogOpen] = React.useState(false);

  const loadNews = async () => {
    try {
      setIsNewsLoading(true);
      const data = await fetchAllNews();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load news',
        description: 'Please refresh and try again.',
      });
      setNews([]);
    } finally {
      setIsNewsLoading(false);
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
      void loadNews();
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (
    field: keyof typeof newsForm,
    value: string | boolean
  ) => {
    setNewsForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!editingNewsId;
    try {
      const normalizedImage =
        newsForm.image.trim().length > 0 ? newsForm.image.trim() : DEFAULT_NEWS_IMAGE;

      if (editingNewsId) {
        await updateNews(editingNewsId, {
          title: newsForm.title,
          description: newsForm.description,
          body: newsForm.body,
          category: newsForm.category,
          isUrgent: newsForm.isUrgent,
          date: newsForm.date,
          image: normalizedImage,
        });
      } else {
        await createNews({
          title: newsForm.title,
          description: newsForm.description,
          body: newsForm.body,
          category: newsForm.category,
          isUrgent: newsForm.isUrgent,
          date: newsForm.date,
          image: normalizedImage,
        });
      }

      setNewsForm({
        title: '',
        description: '',
        body: '',
        category: 'announcement',
        isUrgent: false,
        date: todayIso(),
        image: '',
      });

      setEditingNewsId(null);
      setNewsDialogOpen(false);
      await loadNews();

      toast({
        title: isEditing ? 'News updated' : 'News created',
        description: 'Your changes were saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save news', error);
      const firebaseCode =
        (error as any)?.code || (error as any)?.name || 'unknown';
      toast({
        variant: 'destructive',
        title: 'Failed to save news',
        description: `Please try again. ${firebaseCode}`,
      });
    }
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setNewsForm({
      title: item.title,
      description: item.description,
      body: item.body,
      category: item.category,
      isUrgent: item.isUrgent,
      date: item.date,
      image: item.image,
    });
    setNewsDialogOpen(true);
  };

  const handleCreateNews = () => {
    setEditingNewsId(null);
    setNewsForm({
      title: '',
      description: '',
      body: '',
      category: 'announcement',
      isUrgent: false,
      date: todayIso(),
      image: '',
    });
    setNewsDialogOpen(true);
  };

  const handleCloseNewsDialog = () => {
    setNewsDialogOpen(false);
    setEditingNewsId(null);
    setNewsForm({
      title: '',
      description: '',
      body: '',
      category: 'announcement',
      isUrgent: false,
      date: todayIso(),
      image: '',
    });
  };

  const requestDeleteNews = (item: NewsItem) => {
    setNewsPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteNews = async () => {
    if (!newsPendingDelete) return;
    try {
      await deleteNews(newsPendingDelete.id);
      await loadNews();
      toast({
        title: 'News deleted',
        description: 'The news item was removed successfully.',
      });
    } catch (error) {
      console.error('Failed to delete news', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete news',
        description: 'Please try again.',
      });
    } finally {
      setDeleteDialogOpen(false);
      setNewsPendingDelete(null);
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
      {/* Page Header */}
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
              <span>News</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              News Management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Manage the public News page.
            </p>
            <div className="mt-6">
              <AdminCategoryTabs />
            </div>
          </div>
        </div>
      </section>

      {/* News Management */}
      {user && (
        <section className="gov-section bg-muted/40 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Existing News
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreateNews}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create News
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Existing News Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {isNewsLoading ? (
                    <p className="text-sm text-muted-foreground">Loading news...</p>
                  ) : news.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No news found. Click “Create News” to add one.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {news.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-2"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium truncate">{item.title}</span>
                              <Badge variant="secondary">
                                {item.category === 'event' ? t.news.event : t.news.announcement}
                              </Badge>
                              {item.isUrgent && (
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
                              {item.description}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditNews(item)}
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => requestDeleteNews(item)}
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
        open={newsDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseNewsDialog();
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNewsId ? 'Edit News' : 'Create News'}</DialogTitle>
            <DialogDescription>
              {editingNewsId ? 'Update the details below, then save.' : 'Add a new news item below, then save.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleNewsSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news-title">Title</Label>
              <Input
                id="news-title"
                value={newsForm.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="news-category">Category</Label>
                <select
                  id="news-category"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={newsForm.category}
                  onChange={(e) =>
                    handleFormChange('category', e.target.value as NewsCategory)
                  }
                >
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="news-date">Date</Label>
                <Input
                  id="news-date"
                  type="date"
                  value={newsForm.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-description">Short Description</Label>
              <textarea
                id="news-description"
                className="border rounded-md px-3 py-2 w-full min-h-[80px] bg-background"
                value={newsForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-image">Image URL</Label>
              <Input
                id="news-image"
                value={newsForm.image}
                onChange={(e) => handleFormChange('image', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-body">Body</Label>
              <textarea
                id="news-body"
                className="border rounded-md px-3 py-2 w-full min-h-[160px] bg-background"
                value={newsForm.body}
                onChange={(e) => handleFormChange('body', e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="news-is-urgent"
                type="checkbox"
                className="h-4 w-4"
                checked={newsForm.isUrgent}
                onChange={(e) => handleFormChange('isUrgent', e.target.checked)}
              />
              <Label htmlFor="news-is-urgent" className="cursor-pointer">
                Mark as urgent
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseNewsDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gov-btn-primary">
                <Save className="h-4 w-4 mr-2" />
                {editingNewsId ? 'Update News' : 'Create News'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this news item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.{" "}
              {newsPendingDelete?.title ? `“${newsPendingDelete.title}”` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDeleteNews()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminNewsPage;

