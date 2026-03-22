import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  fetchAllGalleryEvents,
  type GalleryEventItem,
} from '@/integrations/firebase/gallery';

const PREVIEW_MAX = 6;

function buildPreviewTiles(events: GalleryEventItem[]) {
  const out: { key: string; url: string; title: string; subtitle: string }[] = [];
  for (const e of events) {
    if (!e.images.length) continue;
    const subtitle = e.date ? new Date(e.date).toLocaleDateString() : '';
    for (let i = 0; i < e.images.length; i++) {
      if (out.length >= PREVIEW_MAX) return out;
      out.push({
        key: `${e.id}-${i}`,
        url: e.images[i],
        title: e.title,
        subtitle,
      });
    }
  }
  return out;
}

export const GalleryPreview: React.FC = () => {
  const { t } = useLanguage();
  const [tiles, setTiles] = useState<
    { key: string; url: string; title: string; subtitle: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const events = await fetchAllGalleryEvents();
        if (!cancelled) setTiles(buildPreviewTiles(events));
      } catch (e) {
        console.error('Gallery preview load failed', e);
        if (!cancelled) setTiles([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="gov-section-alt">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.gallery.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        {isLoading && (
          <p className="text-center text-muted-foreground py-8">{t.common.loading}</p>
        )}
        {!isLoading && tiles.length === 0 && (
          <p className="text-center text-muted-foreground py-8 max-w-md mx-auto">
            New photos will appear here once albums are published in the admin gallery.
          </p>
        )}
        {!isLoading && tiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tiles.map((image, index) => (
              <Link
                key={image.key}
                to="/gallery"
                className="relative group overflow-hidden rounded-xl aspect-square animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-semibold">{image.title}</p>
                    {image.subtitle ? (
                      <p className="text-sm opacity-80">{image.subtitle}</p>
                    ) : null}
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="gov-btn-primary">
            <Link to="/gallery">
              {t.gallery.viewAll}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
