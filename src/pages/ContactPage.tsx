import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MapPin, Phone, Mail, Printer, Clock,
  Send, MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getPortalSettings, PortalSettings } from '@/integrations/firebase/portalSettings';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = React.useState<PortalSettings | null>(null);

  React.useEffect(() => {
    getPortalSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

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
              <span>{t.nav.contact}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.footer.contact}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Get in touch with us for any inquiries or assistance
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-12 relative z-20">
            <Card className="gov-card text-center animate-slide-up">
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t.footer.address}</h3>
                <p className="text-sm text-muted-foreground">
                Ministry of Land, Agriculture and Fisheries<br />
                Block C - 1st Floor<br />
                Sabaragamuwa Provincial Council Complex<br />
                New Town Ratnapura<br />
                Sri Lanka
                </p>
              </CardContent>
            </Card>

            <Card className="gov-card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center">
                  <Phone className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t.footer.phone}</h3>
                <p className="text-sm text-muted-foreground">
                  +94452224425<br />
                  +94452222175
                </p>
              </CardContent>
            </Card>

            <Card className="gov-card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t.footer.email}</h3>
                <p className="text-sm text-muted-foreground">
                  spcagric@gmail.com<br />
                </p>
              </CardContent>
            </Card>

            <Card className="gov-card text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent flex items-center justify-center">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Office Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Mon - Fri: 8:30 AM - 4:30 PM<br />
                  Sat: 8:30 AM - 12:30 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="gov-card animate-slide-up">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+94 XX XXX XXXX" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Write your message here..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="gov-btn-primary w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            <div className="space-y-6 animate-slide-in-right">
              <Card className="gov-card overflow-hidden p-0">
                <div className="h-96">
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
              </Card>

              {/* Department Contacts */}
              <Card className="gov-card">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground mb-4">Department Hotlines</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'agriculture', name: 'Agriculture', defaultHotline: '+94 45 2222 201' },
                      { id: 'land', name: 'Land Commissioner', defaultHotline: '+94 45 2222 202' },
                      { id: 'animal', name: 'Animal Production', defaultHotline: '+94 45 2222 203' },
                      { id: 'fisheries', name: 'Fisheries', defaultHotline: '+94 45 2222 204' },
                      { id: 'irrigation', name: 'Irrigation', defaultHotline: '+94 45 2222 205' },
                    ].map(dept => (
                      <div key={dept.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="text-muted-foreground">{dept.name}</span>
                        <span className="font-medium text-foreground">{settings?.departmentHotlines?.[dept.id] || dept.defaultHotline}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
