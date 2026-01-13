import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data - will be replaced with database data
const mockNews = [
  {
    id: '1',
    title: 'Agricultural Development Program Launched for Ratnapura District',
    description: 'New initiative aims to boost agricultural productivity and support local farmers with modern techniques and equipment.',
    date: '2024-01-15',
    category: 'announcement',
    isUrgent: false,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
  },
  {
    id: '2',
    title: 'Important Notice: Land Registration Deadline Extended',
    description: 'The deadline for land registration applications has been extended to March 31st, 2024.',
    date: '2024-01-14',
    category: 'announcement',
    isUrgent: true,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
  },
  {
    id: '3',
    title: 'Provincial Fisheries Exhibition 2024',
    description: 'Join us for the annual fisheries exhibition showcasing sustainable fishing practices and aquaculture.',
    date: '2024-01-20',
    category: 'event',
    isUrgent: false,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
  },
];

export const NewsSection: React.FC = () => {
  const { t } = useLanguage();

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'event': return t.news.event;
      case 'announcement': return t.news.announcement;
      default: return category;
    }
  };

  return (
    <section className="gov-section">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.news.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.news.subtitle}
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockNews.map((item, index) => (
            <article 
              key={item.id} 
              className="gov-card overflow-hidden p-0 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    {getCategoryLabel(item.category)}
                  </Badge>
                  {item.isUrgent && (
                    <Badge className="gov-badge-urgent">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {t.news.urgent}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Calendar className="h-4 w-4" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <Link 
                  to={`/news/${item.id}`}
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  {t.news.readMore}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="gov-btn-primary">
            <Link to="/news">
              {t.news.viewAll}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
