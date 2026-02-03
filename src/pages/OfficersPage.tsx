import React, { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
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

const sections = ['Administrative', 'Accounts', 'Development', 'Planning', 'Extension'];

const mockOfficers = [
  { id: '1', name: 'Mr. A. B. Perera', role: 'Director', department: 'agriculture', section: 'Administrative', phone: '+94 45 2222 201', email: 'agriculture@sabaragamuwa.gov.lk', location: 'Ratnapura', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
  { id: '2', name: 'Mrs. C. D. Silva', role: 'Deputy Director', department: 'land', section: 'Accounts', phone: '+94 45 2222 202', email: 'land@sabaragamuwa.gov.lk', location: 'Ratnapura', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { id: '3', name: 'Mr. E. F. Jayasinghe', role: 'Veterinary Surgeon', department: 'animal', section: 'Development', phone: '+94 45 2222 203', email: 'animal@sabaragamuwa.gov.lk', location: 'Kegalle', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { id: '4', name: 'Mr. G. H. Fernando', role: 'Fisheries Officer', department: 'fisheries', section: 'Extension', phone: '+94 45 2222 204', email: 'fisheries@sabaragamuwa.gov.lk', location: 'Ratnapura', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { id: '5', name: 'Mrs. I. J. Wijesinghe', role: 'Irrigation Engineer', department: 'irrigation', section: 'Planning', phone: '+94 45 2222 205', email: 'irrigation@sabaragamuwa.gov.lk', location: 'Ratnapura', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
];

const OfficersPage: React.FC = () => {
  const { t } = useLanguage();
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  const filteredOfficers = useMemo(() => {
    let list = [...mockOfficers];
    if (departmentFilter !== 'all') list = list.filter((o) => o.department === departmentFilter);
    if (sectionFilter !== 'all') list = list.filter((o) => o.section === sectionFilter);
    return list;
  }, [departmentFilter, sectionFilter]);

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.officers }]} title={t.officers.title} subtitle={t.officers.subtitle} />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t.officers.filterByDepartment} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="agriculture">{t.departments.agriculture}</SelectItem>
                <SelectItem value="land">{t.departments.land}</SelectItem>
                <SelectItem value="animal">{t.departments.animal}</SelectItem>
                <SelectItem value="fisheries">{t.departments.fisheries}</SelectItem>
                <SelectItem value="irrigation">{t.departments.irrigation}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder={t.officers.filterBySection} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOfficers.map((officer) => (
              <Card key={officer.id} className="gov-card overflow-hidden p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-28 h-32 sm:h-auto shrink-0 bg-muted">
                    <img src={officer.image} alt={officer.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <h3 className="font-bold text-foreground">{officer.name}</h3>
                    <p className="text-primary text-sm font-medium">{officer.role}</p>
                    <p className="text-muted-foreground text-sm mb-2">{t.departments[officer.department as keyof typeof t.departments]} • {officer.section}</p>
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
        </div>
      </section>
    </Layout>
  );
};

export default OfficersPage;
