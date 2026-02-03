import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { FolderOpen, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusKeys = { planned: 'planned', ongoing: 'ongoing', completed: 'completed' } as const;

const mockProjects = [
  { id: '1', title: 'Provincial Irrigation Upgrade Phase II', description: 'Modernization of irrigation canals in Ratnapura and Kegalle.', department: 'irrigation', status: 'ongoing', startDate: '2023-06-01', endDate: '2025-12-31', image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400' },
  { id: '2', title: 'Organic Farming Pilot Program', description: 'Pilot program for organic farming in selected divisions.', department: 'agriculture', status: 'ongoing', startDate: '2024-01-01', endDate: '2025-06-30', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400' },
  { id: '3', title: 'Land Titling Computerization', description: 'Digitization of land records and titling process.', department: 'land', status: 'planned', startDate: '2024-06-01', endDate: '2026-12-31', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' },
  { id: '4', title: 'Veterinary Clinic Network Expansion', description: 'New veterinary clinics in rural areas.', department: 'animal', status: 'completed', startDate: '2022-01-01', endDate: '2023-12-31', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400' },
  { id: '5', title: 'Aquaculture Development Scheme', description: 'Support for small-scale aquaculture farmers.', department: 'fisheries', status: 'ongoing', startDate: '2023-09-01', endDate: '2025-03-31', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
];

const ProjectsPage: React.FC = () => {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = statusFilter === 'all'
    ? mockProjects
    : mockProjects.filter((p) => p.status === statusFilter);

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.projects }]} title={t.projects.title} subtitle={t.projects.subtitle} />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t.projects.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="planned">{t.projects.planned}</SelectItem>
                <SelectItem value="ongoing">{t.projects.ongoing}</SelectItem>
                <SelectItem value="completed">{t.projects.completed}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="gov-card overflow-hidden p-0 flex flex-col md:flex-row">
                <div className="md:w-80 shrink-0">
                  <img src={project.image} alt={project.title} className="w-full h-48 md:h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary">{t.departments[project.department as keyof typeof t.departments]}</Badge>
                    <Badge variant={project.status === 'completed' ? 'default' : project.status === 'ongoing' ? 'secondary' : 'outline'}>
                      {t.projects[statusKeys[project.status as keyof typeof statusKeys]]}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.startDate).toLocaleDateString()} – {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <h2 className="font-bold text-xl text-foreground mb-3">{project.title}</h2>
                  <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>
                  <Button asChild className="gov-btn-primary w-fit">
                    <Link to={`/projects/${project.id}`}>
                      {t.projects.viewDetails}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectsPage;
