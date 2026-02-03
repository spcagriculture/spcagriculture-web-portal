import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const GovernorPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <PageHero
        breadcrumb={[{ label: t.nav.governor }]}
        title={t.leadership.governorMessage}
        subtitle={t.leadership.aboutGovernor}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <Card className="gov-card overflow-hidden p-0">
                <div className="aspect-[3/4] bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                    alt="Governor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground">Hon. Governor Name</h3>
                  <p className="text-primary font-medium text-sm">Governor of Sabaragamuwa Province</p>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{t.leadership.governorMessage}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  It is with great pleasure that I welcome you to the official portal of the Ministry of Land,
                  Agriculture & Fisheries of Sabaragamuwa Province. Our province is the heartland of Sri Lanka&apos;s
                  agriculture and natural heritage. This ministry plays a crucial role in supporting our farmers,
                  managing land resources, and promoting sustainable development.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  I encourage all citizens to use this platform to access services, stay informed about programs,
                  and engage with the provincial administration. Together we can build a prosperous Sabaragamuwa.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{t.leadership.aboutGovernor}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Governor serves as the representative of the President in the province and works with the
                  Provincial Council and the Chief Minister to ensure good governance. The current Governor has
                  been in office since [tenure dates], with a focus on rural development, agriculture, and
                  community welfare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GovernorPage;
