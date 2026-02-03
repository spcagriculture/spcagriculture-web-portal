import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusKeys = { planned: 'planned', ongoing: 'ongoing', completed: 'completed' } as const;

const mockProjects: Record<string, { title: string; description: string; department: string; status: string; startDate: string; endDate: string; image: string; fullDescription: string }> = {
  '1': { title: 'Provincial Irrigation Upgrade Phase II', description: 'Modernization of irrigation canals.', department: 'irrigation', status: 'ongoing', startDate: '2023-06-01', endDate: '2025-12-31', image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800', fullDescription: 'This project aims to modernize irrigation canals across Ratnapura and Kegalle districts, improving water delivery to farmers and reducing wastage. Phase II includes automation of sluice gates and rehabilitation of main canals.' },
  '2': { title: 'Organic Farming Pilot Program', description: 'Pilot program for organic farming.', department: 'agriculture', status: 'ongoing', startDate: '2024-01-01', endDate: '2025-06-30', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', fullDescription: 'A pilot program to promote organic farming in selected divisions. Includes training, input support, and market linkage for participating farmers.' },
  '3': { title: 'Land Titling Computerization', description: 'Digitization of land records.', department: 'land', status: 'planned', startDate: '2024-06-01', endDate: '2026-12-31', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', fullDescription: 'Digitization of land records and titling process to improve transparency and reduce processing time for land registration.' },
  '4': { title: 'Veterinary Clinic Network Expansion', description: 'New veterinary clinics in rural areas.', department: 'animal', status: 'completed', startDate: '2022-01-01', endDate: '2023-12-31', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', fullDescription: 'Expansion of veterinary clinic network to provide animal healthcare in rural areas. Completed in December 2023.' },
  '5': { title: 'Aquaculture Development Scheme', description: 'Support for small-scale aquaculture.', department: 'fisheries', status: 'ongoing', startDate: '2023-09-01', endDate: '2025-03-31', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', fullDescription: 'Scheme to support small-scale aquaculture farmers with training, fingerlings, and market access.' },
};

const ProjectDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const project = id ? mockProjects[id] : null;

  if (!project) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Project not found.</p>
            <Link to="/projects" className="text-primary hover:underline">{t.common.back} to Projects</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        breadcrumb={[{ label: t.nav.projects, path: '/projects' }, { label: project.title }]}
        title={project.title}
      />

      <section className="gov-section">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-xl overflow-hidden mb-8">
            <img src={project.image} alt={project.title} className="w-full h-80 object-cover" />
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant="secondary">{t.departments[project.department as keyof typeof t.departments]}</Badge>
            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>{t.projects[statusKeys[project.status as keyof typeof statusKeys]]}</Badge>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              {t.projects.startDate}: {new Date(project.startDate).toLocaleDateString()} • {t.projects.endDate}: {new Date(project.endDate).toLocaleDateString()}
            </div>
          </div>
          <p className="text-muted-foreground lead mb-6">{project.description}</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground whitespace-pre-line">{project.fullDescription}</p>
          </div>
          <div className="mt-8">
            <Link to="/projects" className="text-primary hover:underline">{t.common.back} to {t.nav.projects}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetailPage;
