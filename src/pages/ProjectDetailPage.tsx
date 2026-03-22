import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchProjectById, type ProjectItem } from '@/integrations/firebase/projects';

const statusKeys = { planned: 'planned', ongoing: 'ongoing', completed: 'completed' } as const;

const ProjectDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProject(null);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchProjectById(id);
        if (!cancelled) setProject(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError('Could not load this project.');
          setProject(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <p className="text-muted-foreground">{t.common.loading}</p>
        </section>
      </Layout>
    );
  }

  if (loadError || !project) {
    return (
      <Layout>
        <section className="gov-section min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {loadError ?? 'Project not found.'}
            </p>
            <Link to="/projects" className="text-primary hover:underline">
              {t.common.back} to Projects
            </Link>
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
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant="secondary">{t.departments[project.department]}</Badge>
            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
              {t.projects[statusKeys[project.status]]}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              {t.projects.startDate}: {new Date(project.startDate).toLocaleDateString()} •{' '}
              {t.projects.endDate}: {new Date(project.endDate).toLocaleDateString()}
            </div>
          </div>
          <p className="text-muted-foreground lead mb-6">{project.description}</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-foreground whitespace-pre-line">{project.fullDescription}</p>
          </div>
          <div className="mt-8">
            <Link to="/projects" className="text-primary hover:underline">
              {t.common.back} to {t.nav.projects}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetailPage;
