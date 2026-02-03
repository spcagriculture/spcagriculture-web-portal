import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockNews: Record<string, { title: string; description: string; body: string; date: string; category: string; isUrgent: boolean; image: string }> = {
  '1': { title: 'Agricultural Development Program Launched for Ratnapura District', description: 'New initiative aims to boost agricultural productivity.', body: 'The Ministry has launched a comprehensive Agricultural Development Program for the Ratnapura District. The program will provide training, seeds, and equipment to over 5,000 farmers. Modern techniques in paddy cultivation, vegetable farming, and soil management will be taught through extension officers. Registration is open at all Divisional Secretariat offices.', date: '2024-01-15', category: 'announcement', isUrgent: false, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' },
  '2': { title: 'Important Notice: Land Registration Deadline Extended', description: 'Deadline extended to March 31st, 2024.', body: 'The deadline for land registration applications has been extended to March 31st, 2024. All pending applications will be processed with priority. Please ensure your documents are complete and submitted to the Land Commissioner\'s Department. For queries, contact the department office.', date: '2024-01-14', category: 'announcement', isUrgent: true, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800' },
  '3': { title: 'Provincial Fisheries Exhibition 2024', description: 'Annual fisheries exhibition showcasing sustainable practices.', body: 'Join us for the annual fisheries exhibition showcasing sustainable fishing practices and aquaculture. The event features demonstrations, workshops, and product displays. Venue: Ratnapura Town Hall. Date: 2024-01-20. All are welcome.', date: '2024-01-20', category: 'event', isUrgent: false, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
  '4': { title: 'New Veterinary Clinic Opens in Kegalle', description: 'State-of-the-art veterinary clinic in Kegalle.', body: 'A state-of-the-art veterinary clinic has been opened in Kegalle district to provide comprehensive animal healthcare services to farmers. Services include vaccination, treatment, and advisory. Open Monday to Saturday. Contact the Animal Production & Health Department for appointments.', date: '2024-01-12', category: 'announcement', isUrgent: false, image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800' },
  '5': { title: 'Irrigation Project Completed in Embilipitiya', description: 'Major irrigation project completed.', body: 'The major irrigation project in Embilipitiya has been successfully completed, providing water to over 2,000 hectares of farmland. The project includes canal rehabilitation and new sluice gates. Farmers in the area can now register for water allocation.', date: '2024-01-10', category: 'announcement', isUrgent: false, image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800' },
  '6': { title: 'Training Workshop on Organic Farming', description: 'Free training workshop on organic farming.', body: 'Free training workshop on organic farming practices will be conducted for interested farmers. Registration is now open. The workshop will cover composting, pest management, and certification. Limited seats. Contact the Agriculture Department to register.', date: '2024-01-25', category: 'event', isUrgent: false, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800' },
};

const NewsDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const item = id ? mockNews[id] : null;

  if (!item) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">News item not found.</p>
            <Link to="/news" className="text-primary hover:underline">{t.common.back} to News</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const categoryLabel = item.category === 'event' ? t.news.event : t.news.announcement;

  return (
    <Layout>
      <PageHero
        breadcrumb={[{ label: t.nav.news, path: '/news' }, { label: item.title }]}
        title={item.title}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant="secondary">{categoryLabel}</Badge>
            {item.isUrgent && (
              <Badge className="gov-badge-urgent">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {t.news.urgent}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(item.date).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden mb-8">
            <img src={item.image} alt={item.title} className="w-full h-80 object-cover" />
          </div>
          <p className="text-muted-foreground lead mb-6">{item.description}</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground whitespace-pre-line">{item.body}</p>
          </div>
          <div className="mt-8">
            <Link to="/news" className="text-primary hover:underline">{t.common.back} to {t.nav.news}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetailPage;
