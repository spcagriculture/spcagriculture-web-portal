import React, { useEffect, useMemo, useState } from 'react';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, MapPin, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchAllOfficers,
  OFFICER_SECTIONS,
  type OfficerItem,
} from '@/integrations/firebase/officers';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200';

const OfficersPage: React.FC = () => {
  const { departmentId, basePath, config } = useDepartmentRoute();
  const { t } = useLanguage();
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [officers, setOfficers] = useState<OfficerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!departmentId) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(false);
        const data = await fetchAllOfficers(departmentId);
        if (!cancelled) setOfficers(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoadError(true);
          setOfficers([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  const filteredOfficers = useMemo(() => {
    if (sectionFilter === 'all') return officers;
    return officers.filter((o) => o.section === sectionFilter);
  }, [officers, sectionFilter]);

  if (!departmentId) return null;

  const deptName = config ? (t.departments as Record<string, string>)[config.nameKey] : '';

  return (
    <DepartmentLayout>
      <PageHero
        homePath={basePath}
        breadcrumb={[{ label: deptName, path: basePath }, { label: t.nav.officers }]}
        title={t.officers.title}
        subtitle={t.officers.subtitle}
      />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder={t.officers.filterBySection} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {OFFICER_SECTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground py-8">Loading…</p>
          )}
          {loadError && !isLoading && (
            <p className="text-sm text-destructive py-8">
              Could not load officers. Please try again later.
            </p>
          )}
          {!isLoading && !loadError && filteredOfficers.length === 0 && (
            <p className="text-sm text-muted-foreground py-8">No officers to display.</p>
          )}
          {!isLoading && !loadError && filteredOfficers.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOfficers.map((officer) => (
                <Card key={officer.id} className="gov-card overflow-hidden p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-28 h-32 sm:h-auto shrink-0 bg-muted">
                      <img
                        src={officer.image?.trim() || PLACEHOLDER_IMAGE}
                        alt={officer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4 flex-1">
                      <h3 className="font-bold text-foreground">{officer.name}</h3>
                      <p className="text-primary text-sm font-medium">{officer.role}</p>
                      <p className="text-muted-foreground text-sm mb-2">{officer.section}</p>
                      <div className="space-y-1 text-sm">
                        <a href={`tel:${officer.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                          <Phone className="h-4 w-4" /> {officer.phone}
                        </a>
                        <a href={`mailto:${officer.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                          <Mail className="h-4 w-4" /> {officer.email}
                        </a>
                        {officer.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" /> {officer.location}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </DepartmentLayout>
  );
};

export default OfficersPage;
