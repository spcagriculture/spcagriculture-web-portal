import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, FileText, Download, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockExams = [
  { id: '1', title: 'Agriculture Extension Officer Exam 2024', type: 'Exam', dates: '2024-03-15', eligibility: 'Degree in Agriculture or related field', instructions: 'Apply online or submit form to Department office. Bring NIC and originals on exam day.', hasForm: true },
  { id: '2', title: 'Veterinary Assistant Training Course', type: 'Course', dates: '2024-02-01 to 2024-05-31', eligibility: 'A/L passed, interest in animal husbandry', instructions: 'Register at Animal Production & Health Department. Limited seats.', hasForm: true },
  { id: '3', title: 'Land Survey Technical Training', type: 'Course', dates: '2024-04-01', eligibility: 'O/L passed', instructions: 'Download form from website and submit before deadline.', hasForm: true },
];

const ExamsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.exams }]} title={t.exams.title} subtitle={t.exams.subtitle} />

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 max-w-4xl mx-auto">
            {mockExams.map((exam) => (
              <Card key={exam.id} className="gov-card">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{exam.type}</span>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4" />
                      {exam.dates}
                    </div>
                  </div>
                  <h2 className="font-bold text-xl text-foreground mb-3">{exam.title}</h2>
                  <p className="text-sm text-muted-foreground mb-2"><span className="font-medium text-foreground">{t.exams.eligibility}:</span> {exam.eligibility}</p>
                  <p className="text-sm text-muted-foreground mb-4"><span className="font-medium text-foreground">{t.exams.instructions}:</span> {exam.instructions}</p>
                  <div className="flex gap-2">
                    {exam.hasForm && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t.exams.downloadForm}
                      </Button>
                    )}
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        {t.exams.register}
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

export default ExamsPage;
