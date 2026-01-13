import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Wheat, Map, PawPrint, Fish, Droplets,
  ArrowRight, Users, Target, Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const departments = [
  {
    id: 'agriculture',
    icon: Wheat,
    color: 'bg-emerald-100 text-emerald-600',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600',
    officers: 45,
    services: 15,
  },
  {
    id: 'land',
    icon: Map,
    color: 'bg-amber-100 text-amber-600',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
    officers: 32,
    services: 12,
  },
  {
    id: 'animal',
    icon: PawPrint,
    color: 'bg-rose-100 text-rose-600',
    image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052f0f0?w=600',
    officers: 28,
    services: 10,
  },
  {
    id: 'fisheries',
    icon: Fish,
    color: 'bg-blue-100 text-blue-600',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    officers: 22,
    services: 8,
  },
  {
    id: 'irrigation',
    icon: Droplets,
    color: 'bg-cyan-100 text-cyan-600',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600',
    officers: 35,
    services: 11,
  },
];

const departmentDetails: Record<string, { description: string; vision: string; mission: string }> = {
  agriculture: {
    description: 'The Department of Agriculture is dedicated to promoting sustainable agricultural practices and supporting farmers across Sabaragamuwa Province.',
    vision: 'To be the leading provider of agricultural services and innovation in Sri Lanka.',
    mission: 'To enhance agricultural productivity through modern techniques, training, and support services.',
  },
  land: {
    description: 'The Land Commissioner Department manages land registration, surveys, and documentation for all citizens in the province.',
    vision: 'To ensure transparent and efficient land management for all citizens.',
    mission: 'To provide timely land registration services and maintain accurate land records.',
  },
  animal: {
    description: 'The Department of Animal Production & Health focuses on livestock development, veterinary services, and animal welfare.',
    vision: 'To promote a healthy and productive livestock sector in Sabaragamuwa.',
    mission: 'To provide comprehensive animal healthcare and support livestock farmers.',
  },
  fisheries: {
    description: 'The Fisheries Section supports sustainable fishing practices and aquaculture development in the province.',
    vision: 'To develop a sustainable and profitable fisheries sector.',
    mission: 'To promote responsible fishing and support fishing communities.',
  },
  irrigation: {
    description: 'The Irrigation Section manages water resources and irrigation infrastructure for agricultural development.',
    vision: 'To ensure water security for all agricultural activities in the province.',
    mission: 'To develop and maintain efficient irrigation systems for farmers.',
  },
};

const DepartmentsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Page Header */}
      <section className="gov-hero py-16">
        <div className="gov-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <nav className="gov-breadcrumb mb-4 text-primary-foreground/80">
              <Link to="/" className="hover:text-primary-foreground">{t.nav.home}</Link>
              <span>/</span>
              <span>{t.nav.departments}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.departments.title}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t.departments.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              const details = departmentDetails[dept.id];
              const deptKey = dept.id as keyof typeof t.departments;
              
              return (
                <Card 
                  key={dept.id}
                  className="gov-card overflow-hidden p-0 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="grid lg:grid-cols-5 gap-0">
                    {/* Image */}
                    <div className="lg:col-span-2 h-64 lg:h-auto">
                      <img 
                        src={dept.image} 
                        alt={t.departments[deptKey] as string}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-xl ${dept.color} flex items-center justify-center`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {t.departments[deptKey] as string}
                          </h2>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {dept.officers} Officers
                            </span>
                            <span>{dept.services} Services</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6">
                        {details.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-start gap-3">
                          <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-foreground">Vision</p>
                            <p className="text-sm text-muted-foreground">{details.vision}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-foreground">Mission</p>
                            <p className="text-sm text-muted-foreground">{details.mission}</p>
                          </div>
                        </div>
                      </div>

                      <Button asChild className="gov-btn-primary">
                        <Link to={`/departments/${dept.id}`}>
                          {t.departments.viewDetails}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DepartmentsPage;
