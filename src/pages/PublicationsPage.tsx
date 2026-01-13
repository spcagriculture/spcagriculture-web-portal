import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Download, Eye, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const publications = [
  {
    id: '1',
    title: 'Annual Agricultural Report 2023',
    type: 'Report',
    date: '2024-01-10',
    description: 'Comprehensive overview of agricultural development and achievements in Sabaragamuwa Province.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300',
    pages: 45,
  },
  {
    id: '2',
    title: 'Sustainable Farming Practices Guide',
    type: 'Journal',
    date: '2023-12-15',
    description: 'A practical guide for farmers on sustainable and organic farming methods.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
    pages: 32,
  },
  {
    id: '3',
    title: 'Fisheries Development Strategy 2024-2028',
    type: 'Report',
    date: '2023-11-20',
    description: 'Strategic plan for sustainable fisheries development in the province.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
    pages: 58,
  },
  {
    id: '4',
    title: 'Land Management Handbook',
    type: 'Other',
    date: '2023-10-05',
    description: 'Guidelines and procedures for land registration and management.',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300',
    pages: 28,
  },
  {
    id: '5',
    title: 'Livestock Health Bulletin Q4 2023',
    type: 'Journal',
    date: '2023-12-01',
    description: 'Quarterly bulletin on livestock health, diseases, and prevention measures.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300',
    pages: 16,
  },
  {
    id: '6',
    title: 'Irrigation Infrastructure Assessment',
    type: 'Report',
    date: '2023-09-15',
    description: 'Assessment of current irrigation systems and recommendations for improvement.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300',
    pages: 42,
  },
];

const PublicationsPage: React.FC = () => {
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
              <span>{t.nav.publications}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.publications.title}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t.publications.subtitle}
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
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="journal">Journals</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
            <p className="text-muted-foreground">{publications.length} publications found</p>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub, index) => (
              <Card 
                key={pub.id}
                className="gov-card overflow-hidden p-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-muted">
                  <img 
                    src={pub.image}
                    alt={pub.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">
                    {pub.type}
                  </Badge>
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Calendar className="h-4 w-4" />
                    {new Date(pub.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <FileText className="h-4 w-4" />
                    {pub.pages} pages
                  </div>

                  <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                    {pub.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {pub.description}
                  </p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      {t.publications.viewOnline}
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                      <Download className="h-4 w-4 mr-1" />
                      {t.publications.download}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="outline" className="bg-primary text-primary-foreground">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PublicationsPage;
