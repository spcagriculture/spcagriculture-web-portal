import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPortalSettings, PortalSettings, HeroImage } from '@/integrations/firebase/portalSettings';

const HERO_IMAGES = [
  { src: '/images/Sabaragamuwa.jpg', alt: 'Sabaragamuwa Province landscape' },
  { src: '/images/Udawalawe-National-Park.jpg', alt: 'Udawalawe National Park' },
  { src: '/images/Adams-Peak.jpg', alt: "Adam's Peak (Sri Pada)" },
] as const;

const SLIDE_INTERVAL_MS = 6000;

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [images, setImages] = useState<readonly { src: string; alt: string }[]>(HERO_IMAGES);

  useEffect(() => {
    getPortalSettings().then((data) => {
      setSettings(data);
      if (data.heroImages && data.heroImages.length > 0) {
        setImages(data.heroImages.map((img: HeroImage) => ({ src: img.url, alt: img.alt })));
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        {images.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt=""
            className={cn(
              'absolute inset-0 h-full w-full object-cover brightness-90 transition-opacity duration-1000 ease-in-out',
              index === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/92 via-primary/88 to-primary/80"
        aria-hidden
      />
      <div className="gov-hero-pattern" />

      <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">Official Government Portal</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-slide-up">
            {t.hero.title}
          </h1>

          {settings?.visitorCount?.enabled && (
            <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 shadow-xl">
                <span className="text-white/80 font-medium uppercase tracking-wider text-sm">Visitor Count</span>
                <span className="bg-primary/80 text-primary-foreground font-bold px-3 py-1 rounded-full">{settings.visitorCount.count.toLocaleString()}</span>
              </div>
            </div>
          )}

          <p
            className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            {t.hero.subtitle}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Button asChild size="lg" className="gov-btn-hero text-lg h-14 px-8">
              <Link to="/services">
                {t.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white bg-transparent text-primary-foreground shadow-none hover:bg-white hover:text-primary text-lg h-14 px-8"
            >
              <Link to="/news">
                <Newspaper className="mr-2 h-5 w-5" />
                {t.hero.secondary}
              </Link>
            </Button>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div>
              <div className="text-4xl font-bold mb-1">5</div>
              <div className="text-sm opacity-80">Departments</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">50+</div>
              <div className="text-sm opacity-80">Services</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">2</div>
              <div className="text-sm opacity-80">Districts</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">1M+</div>
              <div className="text-sm opacity-80">Citizens Served</div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-10">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === activeIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/60',
                )}
                aria-label={`Show slide ${index + 1}: ${image.alt}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
