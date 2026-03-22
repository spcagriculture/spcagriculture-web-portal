import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Trash2, Edit2, Save, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  createProject,
  deleteProject,
  fetchAllProjects,
  updateProject,
  type ProjectDepartment,
  type ProjectItem,
  type ProjectStatus,
} from '@/integrations/firebase/projects';
import { uploadToStorage } from '@/integrations/firebase/storageUpload';
import { AdminMediaUrlField } from '@/components/admin/AdminMediaUrlField';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const DEFAULT_PROJECT_IMAGE =
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200';

const departments: ProjectDepartment[] = [
  'agriculture',
  'land',
  'animal',
  'fisheries',
  'irrigation',
];

const AdminProjectsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [items, setItems] = React.useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    title: string;
    description: string;
    fullDescription: string;
    department: ProjectDepartment;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    image: string;
  }>({
    title: '',
    description: '',
    fullDescription: '',
    department: 'agriculture',
    status: 'planned',
    startDate: '',
    endDate: '',
    image: '',
  });

  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<ProjectItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllProjects();
      setItems(data);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Failed to load projects',
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
    void loadProjects();
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
      let imageUrl = form.image.trim();
      if (pendingImageFile) {
        imageUrl = await uploadToStorage('projects/images', pendingImageFile);
      }
      if (!imageUrl) imageUrl = DEFAULT_PROJECT_IMAGE;

      const payload = {
        title: form.title,
        description: form.description,
        fullDescription: form.fullDescription,
        department: form.department,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
        image: imageUrl,
      };

      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }

      setForm({
        title: '',
        description: '',
        fullDescription: '',
        department: 'agriculture',
        status: 'planned',
        startDate: '',
        endDate: '',
        image: '',
      });
      setPendingImageFile(null);
      setEditingId(null);
      setDialogOpen(false);
      await loadProjects();
      toast({
        title: isEditing ? 'Project updated' : 'Project created',
        description: 'Your changes were saved.',
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

  const handleEdit = (item: ProjectItem) => {
    setEditingId(item.id);
    setPendingImageFile(null);
    setForm({
      title: item.title,
      description: item.description,
      fullDescription: item.fullDescription,
      department: item.department,
      status: item.status,
      startDate: item.startDate,
      endDate: item.endDate,
      image: item.image,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setPendingImageFile(null);
    setForm({
      title: '',
      description: '',
      fullDescription: '',
      department: 'agriculture',
      status: 'planned',
      startDate: '',
      endDate: '',
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
      description: '',
      fullDescription: '',
      department: 'agriculture',
      status: 'planned',
      startDate: '',
      endDate: '',
      image: '',
    });
  };

  const requestDelete = (item: ProjectItem) => {
    setPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteProject(pendingDelete.id);
      await loadProjects();
      toast({ title: 'Project deleted', description: 'Removed successfully.' });
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

  const statusKeys = { planned: 'planned', ongoing: 'ongoing', completed: 'completed' } as const;

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
              <span>{t.nav.projects}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Projects management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Create and edit projects. Images are stored in Firebase Storage.
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
                  Projects
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create project
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>All projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No projects yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-2"
                        >
                          <div className="min-w-0">
                            <p className="font-medium truncate">{item.title}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="secondary">
                                {t.departments[item.department]}
                              </Badge>
                              <Badge variant="outline">
                                {t.projects[statusKeys[item.status]]}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {item.startDate} → {item.endDate}
                            </div>
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
        <DialogContent className="max-w-[95vw] sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit project' : 'Create project'}</DialogTitle>
            <DialogDescription>
              Upload a cover image or paste an image URL. Other fields are saved in Firestore.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proj-title">Title</Label>
              <Input
                id="proj-title"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="proj-dept">Department</Label>
                <select
                  id="proj-dept"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={form.department}
                  onChange={(e) =>
                    handleFormChange('department', e.target.value as ProjectDepartment)
                  }
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {t.departments[d]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-status">Status</Label>
                <select
                  id="proj-status"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={form.status}
                  onChange={(e) =>
                    handleFormChange('status', e.target.value as ProjectStatus)
                  }
                >
                  <option value="planned">{t.projects.planned}</option>
                  <option value="ongoing">{t.projects.ongoing}</option>
                  <option value="completed">{t.projects.completed}</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="proj-start">{t.projects.startDate}</Label>
                <Input
                  id="proj-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleFormChange('startDate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-end">{t.projects.endDate}</Label>
                <Input
                  id="proj-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleFormChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-desc">Short description</Label>
              <textarea
                id="proj-desc"
                className="border rounded-md px-3 py-2 w-full min-h-[72px] bg-background"
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-full">Full description</Label>
              <textarea
                id="proj-full"
                className="border rounded-md px-3 py-2 w-full min-h-[120px] bg-background"
                value={form.fullDescription}
                onChange={(e) => handleFormChange('fullDescription', e.target.value)}
                required
              />
            </div>

            <AdminMediaUrlField
              id="proj-image"
              label="Cover image (upload or URL)"
              accept="image/*"
              url={form.image}
              onUrlChange={(v) => handleFormChange('image', v)}
              pendingFile={pendingImageFile}
              onPendingFileChange={setPendingImageFile}
              chooseFileLabel="Upload image"
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
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
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

export default AdminProjectsPage;
