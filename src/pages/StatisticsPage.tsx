import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Table2, Download, Wheat, Map, PawPrint, Fish, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const departments = [
  { id: 'agriculture', icon: Wheat, labelKey: 'agriculture' as const },
  { id: 'land', icon: Map, labelKey: 'land' as const },
  { id: 'animal', icon: PawPrint, labelKey: 'animal' as const },
  { id: 'fisheries', icon: Fish, labelKey: 'fisheries' as const },
  { id: 'irrigation', icon: Droplets, labelKey: 'irrigation' as const },
];

const StatisticsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.statistics }]} title={t.statistics.title} subtitle={t.statistics.subtitle} />

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t.statistics.selectDepartment}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {departments.map((dept) => {
              const Icon = dept.icon;
              const label = t.departments[dept.labelKey];
              return (
                <Link key={dept.id} to={`/statistics/${dept.id}`}>
                  <Card className="gov-card h-full hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground">{label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{t.statistics.table} & {t.statistics.chart}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StatisticsPage;
