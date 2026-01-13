import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, ArrowRight, AlertTriangle, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockNews = [
  {
    id: '1',
    title: 'Agricultural Development Program Launched for Ratnapura District',
    description: 'New initiative aims to boost agricultural productivity and support local farmers with modern techniques and equipment. The program will provide training, seeds, and equipment to over 5,000 farmers.',
    date: '2024-01-15',
    category: 'announcement',
    isUrgent: false,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600',
  },
  {
    id: '2',
    title: 'Important Notice: Land Registration Deadline Extended',
    description: 'The deadline for land registration applications has been extended to March 31st, 2024. All pending applications will be processed with priority.',
    date: '2024-01-14',
    category: 'announcement',
    isUrgent: true,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  },
  {
    id: '3',
    title: 'Provincial Fisheries Exhibition 2024',
    description: 'Join us for the annual fisheries exhibition showcasing sustainable fishing practices and aquaculture. The event features demonstrations, workshops, and product displays.',
    date: '2024-01-20',
    category: 'event',
    isUrgent: false,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
  },
  {
    id: '4',
    title: 'New Veterinary Clinic Opens in Kegalle',
    description: 'A state-of-the-art veterinary clinic has been opened in Kegalle district to provide comprehensive animal healthcare services to farmers.',
    date: '2024-01-12',
    category: 'announcement',
    isUrgent: false,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600',
  },
  {
    id: '5',
    title: 'Irrigation Project Completed in Embilipitiya',
    description: 'The major irrigation project in Embilipitiya has been successfully completed, providing water to over 2,000 hectares of farmland.',
    date: '2024-01-10',
    category: 'announcement',
    isUrgent: false,
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600',
  },
  {
    id: '6',
    title: 'Training Workshop on Organic Farming',
    description: 'Free training workshop on organic farming practices will be conducted for interested farmers. Registration is now open.',
    date: '2024-01-25',
    category: 'event',
    isUrgent: false,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600',
  },
];

const NewsPage: React.FC = () => {
  const { t } = useLanguage();

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
              <span>{t.nav.news}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.news.title}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t.news.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="notice">Notices</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="latest">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground">{mockNews.length} items found</p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {mockNews.map((item, index) => (
              <article 
                key={item.id} 
                className="gov-card overflow-hidden p-0 flex flex-col md:flex-row animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image */}
                <div className="md:w-80 shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary">
                      {item.category === 'event' ? t.news.event : t.news.announcement}
                    </Badge>
                    {item.isUrgent && (
                      <Badge className="gov-badge-urgent">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t.news.urgent}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h2 className="font-bold text-xl text-foreground mb-3">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 flex-1">
                    {item.description}
                  </p>
                  
                  <Button asChild variant="ghost" className="w-fit p-0 h-auto text-primary hover:text-primary/80">
                    <Link to={`/news/${item.id}`}>
                      {t.news.readMore}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="outline" className="bg-primary text-primary-foreground">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
