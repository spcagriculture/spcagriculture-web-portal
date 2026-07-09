import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Mail, Key, LogIn, Lock, AlertCircle, Layers, Eye, EyeOff, Settings, Download, Upload, BarChart3, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DepartmentPicker } from '@/components/DepartmentPicker';
import { auth } from '@/integrations/firebase/client';
import { onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import { departmentAdminPath, type DepartmentId } from '@/constants/departments';
import { cn } from '@/lib/utils';
import { getSystemStats, SystemStats } from '@/integrations/firebase/systemStats';
import { getPortalSettings, PortalSettings } from '@/integrations/firebase/portalSettings';

const AdminPortalPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const [systemStats, setSystemStats] = React.useState<SystemStats | null>(null);
  const [portalSettings, setPortalSettings] = React.useState<PortalSettings | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (user) {
      getSystemStats().then(setSystemStats).catch(console.error);
      getPortalSettings().then(setPortalSettings).catch(console.error);
    }
  }, [user]);

  const maxUsage = systemStats 
    ? Math.max(...Object.values(systemStats.departmentUsage || {}), 1)
    : 1;

  const getDeptPercentage = (deptId: string) => {
    if (!systemStats) return 0;
    const usage = systemStats.departmentUsage?.[deptId] || 0;
    return Math.round((usage / maxUsage) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let the auth listener switch the UI to the tabs.
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
              <span>{t.nav.admin}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Admin Portal
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Secure access to manage public content.
            </p>
          </div>
        </div>
      </section>

      {/* Login Form */}
      {(!isAuthReady || !user) && (
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
                      This portal is for authorized administrators only. Contact IT support if you
                      need access.
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
                      <div
                        className={cn(
                          'flex h-10 w-full min-w-0 items-stretch rounded-md border border-input bg-background',
                          'ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                        )}
                      >
                        <span
                          className="flex shrink-0 items-center pl-3 text-muted-foreground"
                          aria-hidden
                        >
                          <Key className="h-4 w-4" />
                        </span>
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="h-10 min-w-0 w-0 flex-1 rounded-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-sm"
                          required
                          value={password}
                          onChange={(e) => {
                            const v = e.target.value;
                            setPassword(v);
                            if (!v) setShowPassword(false);
                          }}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center border-l border-input bg-muted/40 px-2 text-primary outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-pressed={showPassword}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <Eye className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden />
                          ) : (
                            <EyeOff className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="gov-btn-primary w-full" disabled={isLoading}>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                        >
                          Forgot your password?
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Forgot your password?</DialogTitle>
                          <DialogDescription className="text-left pt-2">
                            Administrator passwords cannot be reset from this screen. Please contact
                            IT support or your designated staff so they can verify your identity and
                            reset your password for you.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-center">
                          <DialogClose asChild>
                            <Button type="button" variant="default" className="gov-btn-primary">
                              OK
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <p className="text-center text-sm text-muted-foreground mt-6">
                <Lock className="inline h-3 w-3 mr-1" />
                Protected by secure authentication
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Department picker */}
      {isAuthReady && user && (
        <section className="gov-section bg-muted/40 border-t">
          <div className="container mx-auto px-4 max-w-4xl space-y-10">
            
            {/* MINI DASHBOARD */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Portal Activity Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="gov-card border border-primary/10 shadow-md relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Visitors</p>
                      <h3 className="text-2xl font-extrabold text-foreground mt-0.5">
                        {portalSettings?.visitorCount?.count?.toLocaleString() || '0'}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Real-time session count</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gov-card border border-primary/10 shadow-md relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                      <Download className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Downloads Tracked</p>
                      <h3 className="text-2xl font-extrabold text-foreground mt-0.5">
                        {systemStats?.downloadsCount?.toLocaleString() || '0'}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">PDF downloads count</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="gov-card border border-primary/10 shadow-md relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uploads Tracked</p>
                      <h3 className="text-2xl font-extrabold text-foreground mt-0.5">
                        {systemStats?.uploadsCount?.toLocaleString() || '0'}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Total files uploaded</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Department Wise Activity Chart */}
            <Card className="border border-primary/10 shadow-sm overflow-hidden bg-background">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Department Wise Usage Analytics
                </CardTitle>
                <CardDescription className="text-xs">Interaction stats (uploads, downloads, updates) mapped by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5 pb-5">
                {[
                  { id: 'agriculture', name: 'Agriculture Department', color: 'bg-emerald-500' },
                  { id: 'land', name: 'Land Management', color: 'bg-amber-500' },
                  { id: 'animal', name: 'Animal Production', color: 'bg-rose-500' },
                  { id: 'fisheries', name: 'Fisheries Department', color: 'bg-blue-500' },
                  { id: 'irrigation', name: 'Irrigation Department', color: 'bg-cyan-500' }
                ].map((dept) => {
                  const usage = systemStats?.departmentUsage?.[dept.id] || 0;
                  const pct = getDeptPercentage(dept.id);
                  return (
                    <div key={dept.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-foreground">{dept.name}</span>
                        <span className="text-muted-foreground font-mono">{usage} interactions ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${dept.color} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${Math.max(pct, usage > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">
                    {(t.gateway as Record<string, string>).selectDepartmentAdmin}
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">Signed in as {user.email}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                {(t.gateway as Record<string, string>).adminPickerHint}
              </p>
              <DepartmentPicker
                variant="admin"
                onSelect={(id: DepartmentId) => navigate(departmentAdminPath(id))}
              />
            </div>
            
            <div className="mt-8 border-t pt-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Global Portal Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  type="button"
                  onClick={() => navigate('/admin/portal-settings')}
                  className="gov-card text-left group animate-slide-up border-2 transition-all hover:shadow-lg"
                >
                  <div className="w-14 h-14 mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform bg-primary/10 text-primary">
                    <Settings className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    Provincial Settings
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    Manage the home page, ministry details, Sabaragamuwa province details, and department hero images.
                  </p>
                  <span className="inline-flex items-center text-primary text-sm font-medium">
                    {(t.gateway as Record<string, string>).adminSelect || 'Select'}
                    <Settings className="ml-1 h-4 w-4 group-hover:rotate-90 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default AdminPortalPage;

