import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Trash2, Edit2, Save } from 'lucide-react';
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
  createOfficer,
  deleteOfficer,
  fetchAllOfficers,
  OFFICER_SECTIONS,
  updateOfficer,
  type OfficerDepartment,
  type OfficerItem,
} from '@/integrations/firebase/officers';
import { uploadToStorage } from '@/integrations/firebase/storageUpload';
import { AdminMediaUrlField } from '@/components/admin/AdminMediaUrlField';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const DEFAULT_OFFICER_IMAGE =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400';

const departments: OfficerDepartment[] = [
  'agriculture',
  'land',
  'animal',
  'fisheries',
  'irrigation',
];

const AdminOfficersPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [items, setItems] = React.useState<OfficerItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{
    name: string;
    role: string;
    department: OfficerDepartment;
    section: string;
    phone: string;
    email: string;
    location: string;
    image: string;
  }>({
    name: '',
    role: '',
    department: 'agriculture',
    section: OFFICER_SECTIONS[0],
    phone: '',
    email: '',
    location: '',
    image: '',
  });

  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<OfficerItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const loadOfficers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllOfficers();
      setItems(data);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Failed to load officers',
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
    void loadOfficers();
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
        imageUrl = await uploadToStorage('officers/images', pendingImageFile);
      }
      if (!imageUrl) imageUrl = DEFAULT_OFFICER_IMAGE;

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        department: form.department,
        section: form.section.trim() || OFFICER_SECTIONS[0],
        phone: form.phone.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        image: imageUrl,
      };

      if (editingId) {
        await updateOfficer(editingId, payload);
      } else {
        await createOfficer(payload);
      }

      setForm({
        name: '',
        role: '',
        department: 'agriculture',
        section: OFFICER_SECTIONS[0],
        phone: '',
        email: '',
        location: '',
        image: '',
      });
      setPendingImageFile(null);
      setEditingId(null);
      setDialogOpen(false);
      await loadOfficers();
      toast({
        title: isEditing ? 'Officer updated' : 'Officer created',
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

  const handleEdit = (item: OfficerItem) => {
    setEditingId(item.id);
    setPendingImageFile(null);
    setForm({
      name: item.name,
      role: item.role,
      department: item.department,
      section: item.section || OFFICER_SECTIONS[0],
      phone: item.phone,
      email: item.email,
      location: item.location,
      image: item.image,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setPendingImageFile(null);
    setForm({
      name: '',
      role: '',
      department: 'agriculture',
      section: OFFICER_SECTIONS[0],
      phone: '',
      email: '',
      location: '',
      image: '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setPendingImageFile(null);
    setForm({
      name: '',
      role: '',
      department: 'agriculture',
      section: OFFICER_SECTIONS[0],
      phone: '',
      email: '',
      location: '',
      image: '',
    });
  };

  const requestDelete = (item: OfficerItem) => {
    setPendingDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteOfficer(pendingDelete.id);
      await loadOfficers();
      toast({ title: 'Officer deleted', description: 'Removed successfully.' });
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
              <span>{t.nav.officers}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Officers management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Create and edit directory entries. Photos are stored in Firebase Storage.
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
                  Officers
                </h2>
                <Button className="gov-btn-primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add officer
                </Button>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>All officers</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No officers yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-2"
                        >
                          <div className="min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{item.role}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="secondary">
                                {t.departments[item.department]}
                              </Badge>
                              <Badge variant="outline">{item.section}</Badge>
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
            <DialogTitle>{editingId ? 'Edit officer' : 'Add officer'}</DialogTitle>
            <DialogDescription>
              Upload a photo or paste an image URL. Contact details are stored in Firestore.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="off-name">Name</Label>
              <Input
                id="off-name"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="off-role">Role / designation</Label>
              <Input
                id="off-role"
                value={form.role}
                onChange={(e) => handleFormChange('role', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="off-dept">Department</Label>
                <select
                  id="off-dept"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={form.department}
                  onChange={(e) =>
                    handleFormChange('department', e.target.value as OfficerDepartment)
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
                <Label htmlFor="off-section">Section</Label>
                <select
                  id="off-section"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={form.section}
                  onChange={(e) => handleFormChange('section', e.target.value)}
                >
                  {OFFICER_SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="off-phone">Phone</Label>
              <Input
                id="off-phone"
                value={form.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="off-email">Email</Label>
              <Input
                id="off-email"
                type="email"
                value={form.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="off-loc">{t.officers.location}</Label>
              <Input
                id="off-loc"
                value={form.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
              />
            </div>

            <AdminMediaUrlField
              id="off-image"
              label="Photo (upload or URL)"
              accept="image/*"
              url={form.image}
              onUrlChange={(v) => handleFormChange('image', v)}
              pendingFile={pendingImageFile}
              onPendingFileChange={setPendingImageFile}
              chooseFileLabel="Upload photo"
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
            <AlertDialogTitle>Delete this officer?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
              {pendingDelete?.name ? ` “${pendingDelete.name}”` : ''}
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

export default AdminOfficersPage;
