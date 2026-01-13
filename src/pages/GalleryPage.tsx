import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const galleryEvents = [
  {
    id: '1',
    title: 'Provincial Agricultural Fair 2024',
    date: '2024-01-10',
    images: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    ],
  },
  {
    id: '2',
    title: 'Irrigation Project Inauguration',
    date: '2024-01-05',
    images: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    ],
  },
  {
    id: '3',
    title: 'Livestock Health Campaign',
    date: '2023-12-20',
    images: [
      'https://images.unsplash.com/photo-1516253593875-bd7ba052f0f0?w=800',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    ],
  },
  {
    id: '4',
    title: 'Sustainable Fisheries Workshop',
    date: '2023-12-15',
    images: [
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    ],
  },
];

const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<typeof galleryEvents[0] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (event: typeof galleryEvents[0], index: number) => {
    setSelectedEvent(event);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedEvent(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedEvent) {
      setSelectedImageIndex((prev) => 
        prev < selectedEvent.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedEvent) {
      setSelectedImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedEvent.images.length - 1
      );
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
              <span>{t.nav.gallery}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.gallery.title}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t.gallery.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {galleryEvents.map((event, eventIndex) => (
              <div 
                key={event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${eventIndex * 0.1}s` }}
              >
                {/* Event Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {event.title}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-muted-foreground">
                    {event.images.length} photos
                  </span>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.images.map((image, imageIndex) => (
                    <button
                      key={imageIndex}
                      onClick={() => openLightbox(event, imageIndex)}
                      className="relative group overflow-hidden rounded-xl aspect-square focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <img
                        src={image}
                        alt={`${event.title} - Image ${imageIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedEvent} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          {selectedEvent && (
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation */}
              {selectedEvent.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Image */}
              <div className="aspect-video flex items-center justify-center p-8">
                <img
                  src={selectedEvent.images[selectedImageIndex]}
                  alt={`${selectedEvent.title} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                <p className="text-sm opacity-80">
                  {selectedImageIndex + 1} of {selectedEvent.images.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default GalleryPage;
