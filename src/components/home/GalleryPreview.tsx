import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

// Mock gallery data
const galleryImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600',
    title: 'Agricultural Fair 2024',
    event: 'Provincial Agricultural Exhibition',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600',
    title: 'Rice Field Development',
    event: 'Irrigation Project Launch',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1516253593875-bd7ba052f0f0?w=600',
    title: 'Livestock Program',
    event: 'Animal Health Campaign',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600',
    title: 'Fisheries Development',
    event: 'Sustainable Fishing Workshop',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600',
    title: 'Organic Farming',
    event: 'Green Agriculture Initiative',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600',
    title: 'Community Meeting',
    event: 'Rural Development Program',
  },
];

export const GalleryPreview: React.FC = () => {
  const { t } = useLanguage();

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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <Link
              key={image.id}
              to={`/gallery?image=${image.id}`}
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
                  <p className="text-sm opacity-80">{image.event}</p>
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
