import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="gov-hero min-h-[600px] flex items-center relative">
      <div className="gov-hero-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">Official Government Portal</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-slide-up">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg" className="gov-btn-hero text-lg h-14 px-8">
              <Link to="/services">
                {t.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg h-14 px-8">
              <Link to="/news">
                <Newspaper className="mr-2 h-5 w-5" />
                {t.hero.secondary}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
        </div>
      </div>
    </section>
  );
};
