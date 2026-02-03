import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Target, Eye, Users, Phone, Mail, MapPin,
  Building, Award, History, MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const officers = [
  {
    name: 'Hon. Minister Name',
    designation: 'Provincial Minister',
    department: 'Ministry',
    phone: '+94 45 2222 100',
    email: 'minister@sabaragamuwa.gov.lk',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
  },
  {
    name: 'Secretary Name',
    designation: 'Provincial Secretary',
    department: 'Ministry',
    phone: '+94 45 2222 101',
    email: 'secretary@sabaragamuwa.gov.lk',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
  },
  {
    name: 'Director Name',
    designation: 'Director - Agriculture',
    department: 'Agriculture',
    phone: '+94 45 2222 102',
    email: 'agriculture@sabaragamuwa.gov.lk',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
  },
];

const MinistryPage: React.FC = () => {
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
              <span>{t.nav.ministry}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.nav.ministry}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-6">
                <Building className="h-4 w-4" />
                <span className="text-sm font-medium">About the Ministry</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Serving Sabaragamuwa Province
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The Ministry of Land, Provincial Irrigation, Agriculture, Animal Production, 
                Animal Health and Fisheries plays a vital role in the development of 
                Sabaragamuwa Province. We are committed to sustainable development, 
                supporting farmers and fishermen, and ensuring food security for our citizens.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our ministry oversees five key departments that work together to provide 
                comprehensive services across land management, agricultural development, 
                livestock care, fisheries, and irrigation infrastructure.
              </p>
            </div>
            <div className="relative animate-slide-in-right">
              <img 
                src="https://images.unsplash.com/photo-1560693225-b8507d6f3aa9?w=600"
                alt="Ministry Building"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-4xl font-bold">50+</div>
                <div className="text-sm opacity-90">Years of Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="gov-section-alt">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="gov-card animate-slide-up">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To establish Sabaragamuwa Province as a leading region in sustainable 
                  agriculture, land management, and fisheries development while ensuring 
                  food security and prosperity for all citizens.
                </p>
              </CardContent>
            </Card>

            <Card className="gov-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide efficient and accessible services to farmers, fishermen, 
                  and citizens through innovative programs, modern technology, and 
                  dedicated public service commitment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Messages */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-6">Leadership Messages</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="gov-card">
              <CardContent className="p-6">
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{t.nav.governor}</h3>
                <p className="text-muted-foreground text-sm mb-4">Read the Governor&apos;s message and profile.</p>
                <Button asChild variant="outline">
                  <Link to="/leadership/governor">{t.news.readMore}</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="gov-card">
              <CardContent className="p-6">
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{t.nav.provincialSecretary}</h3>
                <p className="text-muted-foreground text-sm mb-4">Read the Provincial Secretary&apos;s message and profile.</p>
                <Button asChild variant="outline">
                  <Link to="/leadership/provincial-secretary">{t.news.readMore}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Officers */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Key Officers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Meet the leadership team driving our ministry's vision forward
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officers.map((officer, index) => (
              <Card 
                key={officer.email} 
                className="gov-card overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={officer.image} 
                    alt={officer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {officer.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-1">
                    {officer.designation}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {officer.department}
                  </p>
                  <div className="space-y-2 text-sm">
                    <a 
                      href={`tel:${officer.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {officer.phone}
                    </a>
                    <a 
                      href={`mailto:${officer.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {officer.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="gov-section-alt">
        <div className="container mx-auto px-4">
          <Card className="gov-card p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Ministry Headquarters
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-muted-foreground">
                        Provincial Ministry Complex,<br />
                        Ratnapura, 70000,<br />
                        Sri Lanka
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-muted-foreground">+94 45 2222 123</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground">info@sabaragamuwa.gov.lk</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-80 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585959876!2d80.33847965820313!3d6.6927877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3bf22b3b6b509%3A0x1e5a9d63a0c3d5e5!2sRatnapura%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ministry Location"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default MinistryPage;
