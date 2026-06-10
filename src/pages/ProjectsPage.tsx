import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, ArrowRight } from 'lucide-react';
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
import { fetchAllProjects, type ProjectItem } from '@/integrations/firebase/projects';

const statusKeys = { planned: 'planned', ongoing: 'ongoing', completed: 'completed' } as const;

const ProjectsPage: React.FC = () => {
  const { departmentId, basePath, config } = useDepartmentRoute();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!departmentId) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchAllProjects(departmentId);
        if (!cancelled) setProjects(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError('Could not load projects. Please try again later.');
          setProjects([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  const filteredProjects = useMemo(() => {
    if (statusFilter === 'all') return projects;
    return projects.filter((p) => p.status === statusFilter);
  }, [projects, statusFilter]);

  if (!departmentId) return null;

  const deptName = config ? (t.departments as Record<string, string>)[config.nameKey] : '';

  return (
    <DepartmentLayout>
      <PageHero
        homePath={basePath}
        breadcrumb={[{ label: deptName, path: basePath }, { label: t.nav.projects }]}
        title={t.projects.title}
        subtitle={t.projects.subtitle}
      />

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
          {loadError && (
            <p className="text-destructive text-center mb-8" role="alert">
              {loadError}
            </p>
          )}
          {isLoading && !loadError && (
            <p className="text-center text-muted-foreground py-12">{t.common.loading}</p>
          )}
          {!isLoading && !loadError && filteredProjects.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No projects to display.</p>
          )}

          <div className="grid gap-8">
            {!isLoading &&
              !loadError &&
              filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="gov-card overflow-hidden p-0 flex flex-col md:flex-row"
                >
                  <div className="md:w-80 shrink-0">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge
                        variant={
                          project.status === 'completed'
                            ? 'default'
                            : project.status === 'ongoing'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {t.projects[statusKeys[project.status]]}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
                        <Calendar className="h-4 w-4" />
                        {new Date(project.startDate).toLocaleDateString()} –{' '}
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <h2 className="font-bold text-xl text-foreground mb-3">{project.title}</h2>
                    <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>
                    <Button asChild className="gov-btn-primary w-fit">
                      <Link to={`${basePath}/projects/${project.id}`}>
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
    </DepartmentLayout>
  );
};

export default ProjectsPage;
