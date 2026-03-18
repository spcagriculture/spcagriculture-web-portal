import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Trash2, Edit2, Save } from 'lucide-react';
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
  createService,
  deleteService,
  fetchAllServices,
  Service,
  ServiceCategory,
  updateService,
} from '@/integrations/firebase/services';
import { AdminCategoryTabs } from './AdminCategoryTabs';

const AdminServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [services, setServices] = React.useState<Service[]>([]);
  const [isServicesLoading, setIsServicesLoading] = React.useState(false);

  const [editingServiceId, setEditingServiceId] = React.useState<string | null>(null);
  const [serviceForm, setServiceForm] = React.useState<{
    name: string;
    description: string;
    category: ServiceCategory;
    hasForm: boolean;
  }>({
    name: '',
    description: '',
    category: 'citizen',
    hasForm: true,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [servicePendingDelete, setServicePendingDelete] = React.useState<Service | null>(null);
  const [serviceDialogOpen, setServiceDialogOpen] = React.useState(false);

  const loadServices = async () => {
    try {
      setIsServicesLoading(true);
      const data = await fetchAllServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load services',
        description: 'Please refresh and try again.',
      });
      setServices([]);
    } finally {
      setIsServicesLoading(false);
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
      void loadServices();
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleServiceFormChange = (
    field: keyof typeof serviceForm,
    value: string | boolean
  ) => {
    setServiceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingServiceId;
    try {
      if (editingServiceId) {
        await updateService(editingServiceId, {
          name: serviceForm.name,
          description: serviceForm.description,
          category: serviceForm.category,
          hasForm: serviceForm.hasForm,
        });
      } else {
        await createService({
          name: serviceForm.name,
          description: serviceForm.description,
          category: serviceForm.category,
          hasForm: serviceForm.hasForm,
        });
      }

      setServiceForm({
        name: '',
        description: '',
        category: 'citizen',
        hasForm: true,
      });
      setEditingServiceId(null);
      await loadServices();

      setServiceDialogOpen(false);
      toast({
        title: isEditing ? 'Service updated' : 'Service created',
        description: 'Your changes were saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save service', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save service',
        description: 'Please try again.',
      });
    }
  };

  const handleEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      description: service.description,
      category: service.category,
      hasForm: service.hasForm,
    });
    setServiceDialogOpen(true);
  };

  const handleCreateService = () => {
    setEditingServiceId(null);
    setServiceForm({
      name: '',
      description: '',
      category: 'citizen',
      hasForm: true,
    });
    setServiceDialogOpen(true);
  };

  const handleCloseServiceDialog = () => {
    setServiceDialogOpen(false);
    setEditingServiceId(null);
    setServiceForm({
      name: '',
      description: '',
      category: 'citizen',
      hasForm: true,
    });
  };

  const requestDeleteService = (service: Service) => {
    setServicePendingDelete(service);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!servicePendingDelete) return;

    try {
      await deleteService(servicePendingDelete.id);
      await loadServices();

      toast({
        title: 'Service deleted',
        description: 'The service was removed successfully.',
      });
    } catch (error) {
      console.error('Failed to delete service', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete service',
        description: 'Please try again.',
      });
    } finally {
      setDeleteDialogOpen(false);
      setServicePendingDelete(null);
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
              <span>Services</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Services Management
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Manage public services shown on the Services page.
            </p>
            <div className="mt-6">
              <AdminCategoryTabs />
            </div>
          </div>
        </div>
      </section>

      {/* Services Management */}
      {user && (
        <section className="gov-section bg-muted/40 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Existing Services
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Signed in as {user.email}
                  </span>
                  <Button className="gov-btn-primary" onClick={handleCreateService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Service
                  </Button>
                </div>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Existing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  {isServicesLoading ? (
                    <p className="text-sm text-muted-foreground">Loading services...</p>
                  ) : services.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No services found. Click “Create Service” to add one.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-3 gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{service.name}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
                                {service.category}
                              </span>
                              {service.hasForm && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                  Has form
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditService(service)}
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => requestDeleteService(service)}
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
        open={serviceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseServiceDialog();
          } else {
            setServiceDialogOpen(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingServiceId ? 'Edit Service' : 'Create Service'}
            </DialogTitle>
            <DialogDescription>
              {editingServiceId
                ? 'Update the details below, then save.'
                : 'Add a new service below, then save.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  value={serviceForm.name}
                  onChange={(e) => handleServiceFormChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-category">Category</Label>
                <select
                  id="service-category"
                  className="border rounded-md px-3 py-2 w-full bg-background"
                  value={serviceForm.category}
                  onChange={(e) =>
                    handleServiceFormChange('category', e.target.value as ServiceCategory)
                  }
                >
                  <option value="citizen">Citizen (G2C)</option>
                  <option value="employee">Employee (G2E)</option>
                  <option value="business">Business (G2B)</option>
                  <option value="government">Government (G2G)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <textarea
                id="service-description"
                className="border rounded-md px-3 py-2 w-full min-h-[80px] bg-background"
                value={serviceForm.description}
                onChange={(e) =>
                  handleServiceFormChange('description', e.target.value)
                }
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="service-has-form"
                type="checkbox"
                className="h-4 w-4"
                checked={serviceForm.hasForm}
                onChange={(e) => handleServiceFormChange('hasForm', e.target.checked)}
              />
              <Label htmlFor="service-has-form" className="cursor-pointer">
                This service has a downloadable form
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseServiceDialog}>
                Cancel
              </Button>
              <Button type="submit" className="gov-btn-primary">
                <Save className="h-4 w-4 mr-2" />
                {editingServiceId ? 'Update Service' : 'Create Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. {servicePendingDelete?.name ? `“${servicePendingDelete.name}”` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDeleteService()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminServicesPage;

