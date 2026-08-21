import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Target, Eye, Users, Phone, Mail, MapPin,
  Building, Award, History, MessageSquare,
  Printer
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPortalSettings, PortalSettings } from '@/integrations/firebase/portalSettings';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const defaultMessages = [
  {
    id: 'governor',
    name: 'Hon. Governor Name',
    title: 'Governor of Sabaragamuwa Province',
    message: 'It is with great pleasure that I welcome you to the official portal of the Ministry of Land, Provincial Irrigation, Agriculture, Animal Production and Animal Health and Fisheries of Sabaragamuwa Province. Our province is the heartland of Sri Lanka\'s agriculture and natural heritage. This ministry plays a crucial role in supporting our farmers, managing land resources, and promoting sustainable development.\n\nI encourage all citizens to use this platform to access services, stay informed about programs, and engage with the provincial administration. Together we can build a prosperous Sabaragamuwa.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  },
  {
    id: 'secretary',
    name: 'Secretary Name',
    title: 'Provincial Secretary',
    message: 'Welcome to our provincial web portal. As the Provincial Secretary, I am proud to lead the administrative machinery of this Ministry. We are dedicated to providing efficient, transparent, and citizens-centric services to the people of Sabaragamuwa Province.\n\nThrough this digital portal, we aim to bridge the gap between governance and citizens, offering easy access to official documents, forms, application guidelines, and real-time updates of our programs.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  }
];

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
  const [settings, setSettings] = React.useState<PortalSettings | null>(null);
  const [yearsOfService, setYearsOfService] = React.useState<number>(50);

  React.useEffect(() => {
    getPortalSettings().then(data => {
      setSettings(data);
      if (data.ministry.startDate) {
        const start = new Date(data.ministry.startDate);
        const now = new Date();
        const years = now.getFullYear() - start.getFullYear();
        setYearsOfService(years > 0 ? years : 0);
      }
    }).catch(console.error);
  }, []);

  const displayOfficers = settings?.ministry.keyOfficers?.length ? settings.ministry.keyOfficers : officers;
  const displayMessages = settings?.ministry.leadershipMessages?.length 
    ? settings.ministry.leadershipMessages 
    : defaultMessages;

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
              <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-line">
                {settings?.ministry.description || "The Ministry of Land, Provincial Irrigation, Agriculture, Animal Production, Animal Health and Fisheries plays a vital role in the development of Sabaragamuwa Province. We are committed to sustainable development, supporting farmers and fishermen, and ensuring food security for our citizens.\n\nOur ministry oversees five key departments that work together to provide comprehensive services across land management, agricultural development, livestock care, fisheries, and irrigation infrastructure."}
              </p>
            </div>
            <div className="relative animate-slide-in-right">
              <img 
                src={settings?.ministry.imageUrl || '/images/Sabaragamuwa.jpg'}
                alt="Sabaragamuwa Province"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-4xl font-bold">{yearsOfService}+</div>
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
                <h3 className="text-2xl font-bold text-foreground mb-4">{t.ministry.visionTitle}</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {settings?.ministry.vision || t.ministry.visionText}
                </p>
              </CardContent>
            </Card>

            <Card className="gov-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t.ministry.missionTitle}</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {settings?.ministry.mission || t.ministry.missionText}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Messages */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Leadership Messages</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {displayMessages.map((leader: any, index: number) => (
              <Card key={leader.id || index} className="gov-card flex flex-col md:flex-row overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <div className="md:w-1/3 aspect-[3/4] md:aspect-auto bg-muted min-h-[220px]">
                  <img
                    src={leader.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div className="mb-4">
                    <span className="text-primary font-semibold text-xs tracking-wider uppercase block mb-1">
                      {leader.title}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-2">{leader.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed">
                      {leader.message}
                    </p>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-fit border-primary/20 hover:border-primary hover:bg-primary/5">
                        Read Full Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-bold text-foreground border-b pb-4">
                          Message from {leader.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid md:grid-cols-3 gap-6 pt-4">
                        <div className="md:col-span-1">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-md">
                            <img
                              src={leader.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                              alt={leader.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="mt-3 text-center md:text-left">
                            <h4 className="font-bold text-foreground">{leader.name}</h4>
                            <p className="text-xs text-primary font-medium">{leader.title}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                            {leader.message}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
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
            {displayOfficers.map((officer: any, index: number) => (
              <Card 
                key={officer.email || officer.id} 
                className="gov-card overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={officer.photoUrl || officer.image} 
                    alt={officer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {officer.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-1">
                    {officer.position || officer.designation}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {officer.department || 'Ministry'}
                  </p>
                  <div className="space-y-2 text-sm">
                    <a 
                      href={`tel:${officer.contact || officer.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {officer.contact || officer.phone}
                    </a>
                    {officer.email && (
                    <a 
                      href={`mailto:${officer.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {officer.email}
                    </a>
                    )}
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
                      <p className="text-muted-foreground whitespace-pre-line">
                      {settings?.ministry.headquarters.address || "Ministry of Land, Provincial Irrigation, Agriculture,Animal Production, Animal Health and Fisheries,\nBlock C - 1st Floor,\nSabaragamuwa Provincial Council Complex,\nNew Town Ratnapura,\nSri Lanka"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Telephone</p>
                      <p className="text-muted-foreground whitespace-pre-line">{settings?.ministry.headquarters.phone || "+94452224425\n+94452222175"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Printer className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Fax</p>
                      <p className="text-muted-foreground whitespace-pre-line">{settings?.ministry.headquarters.fax || "+94452228090"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground whitespace-pre-line">{settings?.ministry.headquarters.email || "spcagric@gmail.com"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-80 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=Sabaragamuwa%20Provincial%20Council%20Complex&output=embed"
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
