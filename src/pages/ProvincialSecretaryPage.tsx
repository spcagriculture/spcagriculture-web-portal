import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const ProvincialSecretaryPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <PageHero
        breadcrumb={[{ label: t.nav.provincialSecretary }]}
        title={t.leadership.secretaryMessage}
        subtitle={t.leadership.aboutSecretary}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <Card className="gov-card overflow-hidden p-0">
                <div className="aspect-[3/4] bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
                    alt="Provincial Secretary"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground">Mr. Provincial Secretary Name</h3>
                  <p className="text-primary font-medium text-sm">Provincial Secretary, Sabaragamuwa Province</p>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{t.leadership.secretaryMessage}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  As the Provincial Secretary, I am committed to ensuring that the Ministry of Land, Agriculture
                  & Fisheries delivers efficient and accessible services to every citizen of Sabaragamuwa. Our
                  departments work in harmony to support farmers, manage land and irrigation, and promote animal
                  husbandry and fisheries.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This portal is your gateway to information, forms, and contact details. We welcome your feedback
                  and strive to improve our services continuously.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{t.leadership.aboutSecretary}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Provincial Secretary heads the provincial administration and coordinates with all provincial
                  ministries and departments. The role involves policy implementation, resource management, and
                  ensuring that devolved subjects are delivered effectively to the people of Sabaragamuwa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProvincialSecretaryPage;
