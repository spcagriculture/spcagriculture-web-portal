import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockNotices: Record<string, { title: string; summary: string; body: string; date: string; urgency: string; image: string }> = {
  '1': {
    title: 'Land Registration Deadline Extension',
    summary: 'Deadline extended to March 31, 2024 for all pending applications.',
    body: 'The Ministry of Land, Agriculture & Fisheries wishes to inform all citizens that the deadline for land registration applications has been extended to March 31, 2024. All pending applications will be processed with priority. Please ensure that your documents are complete and submitted to the Land Commissioner\'s Department at your earliest convenience. For queries, contact the department office or visit our Contact page.',
    date: '2024-01-14',
    urgency: 'high',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  },
  '2': {
    title: 'Agricultural Subsidy Program 2024',
    summary: 'Applications open for the provincial agricultural subsidy program.',
    body: 'The provincial agricultural subsidy program for 2024 is now open for applications. Eligible farmers can apply for support in seeds, equipment, and training. Please collect application forms from your nearest Agriculture Department office or download from the Services page. Submission deadline: February 15, 2024.',
    date: '2024-01-10',
    urgency: 'normal',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  },
  '3': {
    title: 'Office Closure - Provincial Day',
    summary: 'All ministry offices will be closed on Provincial Day.',
    body: 'All offices under the Ministry of Land, Agriculture & Fisheries will be closed on the occasion of Provincial Day. Normal services will resume the following working day. For emergencies, please contact the designated hotline numbers published on our Contact page.',
    date: '2024-01-08',
    urgency: 'normal',
    image: 'https://images.unsplash.com/photo-1560693225-b8507d6f3aa9?w=800',
  },
  '4': {
    title: 'Urgent: Veterinary Services Notice',
    summary: 'Temporary relocation of veterinary clinic in Kegalle.',
    body: 'The veterinary clinic in Kegalle district will be temporarily relocated for renovation from [date]. During this period, services will be available at [alternative address]. For appointments and inquiries, please contact the Animal Production & Health Department. We apologize for any inconvenience.',
    date: '2024-01-12',
    urgency: 'high',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
  },
};

const NoticeDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const notice = id ? mockNotices[id] : null;

  if (!notice) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Notice not found.</p>
            <Link to="/notices" className="text-primary hover:underline">{t.common.back} to Notices</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        breadcrumb={[{ label: t.nav.notices, path: '/notices' }, { label: notice.title }]}
        title={notice.title}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {notice.urgency === 'high' && (
              <Badge className="gov-badge-urgent">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {t.news.urgent}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(notice.date).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden mb-8">
            <img src={notice.image} alt={notice.title} className="w-full h-64 object-cover" />
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground lead mb-6">{notice.summary}</p>
            <p className="text-foreground whitespace-pre-line">{notice.body}</p>
          </div>
          <div className="mt-8">
            <Link to="/notices" className="text-primary hover:underline">{t.common.back} to {t.nav.notices}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NoticeDetailPage;
