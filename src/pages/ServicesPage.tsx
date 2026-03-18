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
import {
  fetchAllServices,
  Service,
  ServiceCategory,
} from '@/integrations/firebase/services';

const categories = [
  { key: 'citizen', label: 'g2c' as const, icon: Users, color: 'bg-blue-100 text-blue-600' },
  { key: 'employee', label: 'g2e' as const, icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { key: 'business', label: 'g2b' as const, icon: Building2, color: 'bg-orange-100 text-orange-600' },
  { key: 'government', label: 'g2g' as const, icon: Landmark, color: 'bg-emerald-100 text-emerald-600' },
];

const ServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = React.useState<ServiceCategory>('citizen');
  const [allServices, setAllServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllServices();
        setAllServices(data);
      } catch (err) {
        console.error('Failed to load services', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const categoryCounts = React.useMemo(() => {
    const counts: Partial<Record<ServiceCategory, number>> = {};
    for (const service of allServices) {
      counts[service.category] = (counts[service.category] ?? 0) + 1;
    }

    return counts;
  }, [allServices]);

  const filteredServices = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allServices.filter((service) => {
      if (service.category !== activeCategory) return false;
      if (!q) return true;

      const haystack = `${service.name} ${service.description}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allServices, activeCategory, searchQuery]);

  const activeCategoryTabLabel = React.useMemo(() => {
    const tab = categories.find((c) => c.key === activeCategory);
    return (tab?.label ?? 'g2c') as 'g2c' | 'g2e' | 'g2b' | 'g2g';
  }, [activeCategory]);

  const searchPlaceholder = React.useMemo(() => {
    return `${t.common.search} ${t.services[activeCategoryTabLabel]}...`;
  }, [activeCategoryTabLabel, t]);

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
                  onClick={() => setActiveCategory(cat.key as ServiceCategory)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'bg-card border hover:border-primary/30'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{t.services[cat.label]}</span>
                  <Badge
                    variant={isActive ? 'secondary' : 'outline'}
                    className={`ml-2 ${isActive ? '' : 'bg-muted text-current'}`}
                  >
                    {categoryCounts[cat.key as ServiceCategory] ?? 0}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search (under tabs) */}
      <section className="py-6 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center">
              Loading services...
            </p>
          ) : error ? (
            <p className="text-sm text-red-600 text-center">{error}</p>
          ) : filteredServices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              No services found for this category{searchQuery.trim() ? ' and your search.' : '.'}
            </p>
          ) : (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {filteredServices.map((service, index) => (
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
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
