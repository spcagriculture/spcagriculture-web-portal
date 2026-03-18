import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Lock, Mail, Key, LogIn,
  Shield, AlertCircle, Plus, Trash2, Edit2, Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth } from '@/integrations/firebase/client';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import {
  createService,
  deleteService,
  fetchAllServices,
  Service,
  ServiceCategory,
  updateService,
} from '@/integrations/firebase/services';

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [services, setServices] = React.useState<Service[]>([]);
  const [isServicesLoading, setIsServicesLoading] = React.useState(false);
  const [servicesError, setServicesError] = React.useState<string | null>(null);
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

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      if (current) {
        void loadServices();
      } else {
        setServices([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadServices = async () => {
    try {
      setIsServicesLoading(true);
      setServicesError(null);
      const data = await fetchAllServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services', error);
      setServicesError('Failed to load services. Please try again.');
    } finally {
      setIsServicesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/services');
    } catch (error: any) {
      console.error('Admin login failed', error);
      let message = 'Login failed. Please check your credentials.';
      if (error?.code === 'auth/user-not-found') {
        message = 'No admin user found with this email.';
      } else if (error?.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

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
    setServicesError(null);
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
    } catch (error) {
      console.error('Failed to save service', error);
      setServicesError('Failed to save service. Please try again.');
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
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setServicesError(null);
    try {
      await deleteService(id);
      await loadServices();
    } catch (error) {
      console.error('Failed to delete service', error);
      setServicesError('Failed to delete service. Please try again.');
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="gov-hero py-16">
        <div className="gov-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <nav className="gov-breadcrumb mb-4 text-primary-foreground/80">
              <Link to="/" className="hover:text-primary-foreground">{t.nav.home}</Link>
              <span>/</span>
              <span>{t.nav.admin}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Admin Portal
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Secure access to the content management system
            </p>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="gov-card">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Administrator Login</CardTitle>
              </CardHeader>
              <CardContent>
                {authError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                <Alert className="mb-6 border-primary/20 bg-primary/5">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm">
                    This portal is for authorized administrators only. 
                    Contact IT support if you need access.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@sabaragamuwa.gov.lk"
                        className="pl-10"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="gov-btn-primary w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <Lock className="inline h-3 w-3 mr-1" />
              Protected by secure authentication
            </p>
          </div>
        </div>

      {false && (
        <section
          id="services-management"
          className="gov-section bg-muted/40 border-t"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Services Management
                </h2>
                <span className="text-sm text-muted-foreground">
                  Signed in as {user.email}
                </span>
              </div>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingServiceId ? 'Edit Service' : 'Add New Service'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {servicesError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{servicesError}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="service-name">Service Name</Label>
                        <Input
                          id="service-name"
                          value={serviceForm.name}
                          onChange={(e) =>
                            handleServiceFormChange('name', e.target.value)
                          }
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
                            handleServiceFormChange(
                              'category',
                              e.target.value as ServiceCategory
                            )
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
                        onChange={(e) =>
                          handleServiceFormChange('hasForm', e.target.checked)
                        }
                      />
                      <Label htmlFor="service-has-form" className="cursor-pointer">
                        This service has a downloadable form
                      </Label>
                    </div>
                    <div className="flex gap-2 justify-end">
                      {editingServiceId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingServiceId(null);
                            setServiceForm({
                              name: '',
                              description: '',
                              category: 'citizen',
                              hasForm: true,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button type="submit" className="gov-btn-primary">
                        <Save className="h-4 w-4 mr-2" />
                        {editingServiceId ? 'Update Service' : 'Create Service'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="gov-card">
                <CardHeader>
                  <CardTitle>Existing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  {isServicesLoading ? (
                    <p className="text-sm text-muted-foreground">Loading services...</p>
                  ) : services.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No services found. Add a service using the form above.
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
                              onClick={() => handleDeleteService(service.id)}
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
    </section>
    </Layout>
  );
};

export default AdminPage;
