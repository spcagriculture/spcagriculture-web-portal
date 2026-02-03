import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, FileText, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockVacancies = [
  { id: '1', title: 'Agriculture Extension Officer', department: 'agriculture', deadline: '2024-02-28', description: 'Required: Degree in Agriculture. Experience in extension preferred.', attachment: true },
  { id: '2', title: 'Land Registry Clerk', department: 'land', deadline: '2024-02-15', description: 'Required: A/L passed, computer literacy. Training will be provided.', attachment: true },
  { id: '3', title: 'Veterinary Technical Officer', department: 'animal', deadline: '2024-03-10', description: 'Required: Diploma in Veterinary Science or equivalent.', attachment: false },
];

const VacanciesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.vacancies }]} title={t.vacancies.title} subtitle={t.vacancies.subtitle} />

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 max-w-4xl mx-auto">
            {mockVacancies.map((vacancy) => (
              <Card key={vacancy.id} className="gov-card">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary">{t.departments[vacancy.department as keyof typeof t.departments]}</Badge>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
                      <Calendar className="h-4 w-4" />
                      {t.vacancies.deadline}: {new Date(vacancy.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <h2 className="font-bold text-xl text-foreground mb-3">{vacancy.title}</h2>
                  <p className="text-muted-foreground mb-4">{vacancy.description}</p>
                  <div className="flex gap-2">
                    {vacancy.attachment && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t.vacancies.downloadAttachment}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-primary">
                      {t.vacancies.viewDetails}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VacanciesPage;
