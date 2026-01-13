import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Users, Briefcase, Building2, Landmark, 
  FileText, Download, ArrowRight, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const services = {
  citizen: [
    { id: '1', name: 'Land Registration', description: 'Register your land and obtain official documentation', hasForm: true },
    { id: '2', name: 'Agricultural Permits', description: 'Apply for farming and cultivation permits', hasForm: true },
    { id: '3', name: 'Livestock Registration', description: 'Register cattle and other livestock', hasForm: true },
    { id: '4', name: 'Fishing License', description: 'Apply for fishing permits and licenses', hasForm: true },
    { id: '5', name: 'Water Connection', description: 'Apply for irrigation water connection', hasForm: false },
  ],
  employee: [
    { id: '6', name: 'Leave Application', description: 'Submit leave requests online', hasForm: true },
    { id: '7', name: 'Transfer Request', description: 'Apply for departmental transfers', hasForm: true },
    { id: '8', name: 'Training Programs', description: 'Register for professional development', hasForm: false },
  ],
  business: [
    { id: '9', name: 'Commercial Farming License', description: 'License for large-scale farming operations', hasForm: true },
    { id: '10', name: 'Export Permits', description: 'Agricultural export documentation', hasForm: true },
    { id: '11', name: 'Aquaculture License', description: 'Commercial fish farming permits', hasForm: true },
  ],
  government: [
    { id: '12', name: 'Inter-Department Requests', description: 'Coordination between departments', hasForm: false },
    { id: '13', name: 'Policy Implementation', description: 'Provincial policy guidelines', hasForm: false },
  ],
};

const categories = [
  { key: 'citizen', label: 'g2c' as const, icon: Users, color: 'bg-blue-100 text-blue-600' },
  { key: 'employee', label: 'g2e' as const, icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { key: 'business', label: 'g2b' as const, icon: Building2, color: 'bg-orange-100 text-orange-600' },
  { key: 'government', label: 'g2g' as const, icon: Landmark, color: 'bg-emerald-100 text-emerald-600' },
];

const ServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = React.useState('citizen');

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
              <span>{t.nav.services}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.services.title}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t.services.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search services..." 
                className="pl-10 h-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'bg-card border hover:border-primary/30'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{t.services[cat.label]}</span>
                  <Badge variant={isActive ? 'secondary' : 'outline'} className="ml-2">
                    {services[cat.key as keyof typeof services].length}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 max-w-4xl mx-auto">
            {services[activeCategory as keyof typeof services].map((service, index) => (
              <div 
                key={service.id}
                className="gov-card flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {service.hasForm && (
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Download className="h-4 w-4 mr-1" />
                      {t.services.downloadForm}
                    </Button>
                  )}
                  <Button size="sm" className="flex-1 sm:flex-none bg-primary hover:bg-primary/90">
                    {t.services.applyNow}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
