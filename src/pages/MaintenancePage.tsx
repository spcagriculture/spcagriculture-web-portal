import React from 'react';
import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { translations } from '@/i18n/translations';

export default function MaintenancePage() {
  const en = (translations.en as any).maintenance;
  const si = (translations.si as any).maintenance;
  const ta = (translations.ta as any).maintenance;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-destructive/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="max-w-xl w-full text-center relative z-10 animate-slide-up bg-card/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm border shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 animate-ping rounded-full" />
            <div className="relative bg-destructive/10 p-4 rounded-full border border-destructive/20">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
        </div>

        <div className="space-y-5 mb-6">
          {/* English */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {en?.title || 'Currently Unavailable'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {en?.description || 'The portal is currently down for scheduled maintenance or emergency updates. We are working hard to bring it back online shortly.'}
            </p>
          </div>

          {/* Sinhala */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {si?.title || 'දැනට ලබා ගත නොහැක'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {si?.description || 'නියමිත නඩත්තු කිරීම් හෝ හදිසි යාවත්කාලීන කිරීම් සඳහා ද්වාරය දැනට අක්‍රියයි. අපි එය කෙටි කලකින් නැවත මාර්ගගත කිරීමට වෙහෙසෙමින් සිටිමු.'}
            </p>
          </div>

          {/* Tamil */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {ta?.title || 'தற்போது கிடைக்கவில்லை'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {ta?.description || 'திட்டமிடப்பட்ட பராமரிப்பு அல்லது அவசர புதுப்பிப்புகளுக்காக போர்ட்டல் தற்போது முடக்கப்பட்டுள்ளது. இதை மீண்டும் ஆன்லைனில் கொண்டு வர நாங்கள் கடுமையாக உழைத்து வருகிறோம்.'}
            </p>
          </div>
        </div>

        <div className="inline-flex flex-col items-center gap-2 bg-muted/50 px-5 py-3 rounded-xl text-sm font-medium border mb-6 w-full sm:w-auto">
          <Clock className="h-6 w-6 animate-spin-slow text-primary mb-1" />
          <div className="flex flex-col gap-1 text-center">
            <span>{en?.checkBack || 'Please check back later'}</span>
            <span className="text-muted-foreground hidden sm:block border-t w-1/2 mx-auto my-1"></span>
            <span>{si?.checkBack || 'කරුණාකර පසුව නැවත පරීක්ෂා කරන්න'}</span>
            <span className="text-muted-foreground hidden sm:block border-t w-1/2 mx-auto my-1"></span>
            <span>{ta?.checkBack || 'தயவுசெய்து பின்னர் சரிபார்க்கவும்'}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-border/50">
          <Button asChild variant="outline" className="text-muted-foreground hover:text-foreground">
            <Link to="/admin">
              <ShieldAlert className="mr-2 h-4 w-4" />
              {en?.adminPortal || 'Admin Portal'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
