import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Mail, Key, LogIn, Lock, AlertCircle, Layers, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { AdminCategoryTabs } from './AdminCategoryTabs';
import { auth } from '@/integrations/firebase/client';
import { onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import { cn } from '@/lib/utils';

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

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

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

      {/* Tabs */}
      {isAuthReady && user && (
        <section className="gov-section bg-muted/40 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Manage Content</h2>
                </div>
                <span className="text-sm text-muted-foreground">Signed in as {user.email}</span>
              </div>

              <Card className="gov-card">
                <CardContent className="pt-6">
                  <AdminCategoryTabs />

                  <p className="mt-4 text-sm text-muted-foreground">
                    Select a tab above to manage Services, News, Notices, Publications, Videos,
                    Gallery, Statistics, Projects, Circulars, Documents, Officers, Exams, Vacancies,
                    or Exam Results (CRUD). Videos use YouTube links only; gallery albums store image
                    URLs (uploads go to Firebase Storage); statistics are table data in Firestore;
                    project and officer images, exam / circular / document / vacancy / exam-result PDFs
                    use Firebase Storage.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default AdminPortalPage;

