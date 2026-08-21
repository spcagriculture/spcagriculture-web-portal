import React from 'react';
import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MaintenancePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-md w-full text-center relative z-10 animate-slide-up">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 animate-ping rounded-full" />
            <div className="relative bg-destructive/10 p-6 rounded-full border border-destructive/20">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">
          Currently Unavailable
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          The portal is currently down for scheduled maintenance or emergency updates. We are working hard to bring it back online shortly.
        </p>

        <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-sm font-medium border mb-12">
          <Clock className="h-4 w-4 animate-spin-slow" />
          <span>Please check back later</span>
        </div>

        <div className="pt-8 border-t border-border/50">
          <Button asChild variant="outline" className="text-muted-foreground hover:text-foreground">
            <Link to="/admin">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Admin Portal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
