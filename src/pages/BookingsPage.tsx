import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const roomTypes = ['Single Room', 'Double Room', 'Dormitory', 'Conference Room'];

const BookingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <PageHero breadcrumb={[{ label: t.nav.bookings }]} title={t.bookings.title} />
        <section className="gov-section">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <Card className="gov-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Thank you</h2>
                <p className="text-muted-foreground">{t.bookings.confirmation}</p>
                <Button className="mt-6" onClick={() => setSubmitted(false)} variant="outline">
                  {t.common.back}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.bookings }]} title={t.bookings.title} subtitle={t.bookings.subtitle} />

      <section className="gov-section">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="gov-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">{t.bookings.applicantName}</Label>
                    <Input id="applicantName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nicPassport">{t.bookings.nicPassport}</Label>
                    <Input id="nicPassport" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">{t.bookings.contact}</Label>
                  <Input id="contact" type="tel" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType">{t.bookings.roomType}</Label>
                  <Select required>
                    <SelectTrigger id="roomType">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((rt) => (
                        <SelectItem key={rt} value={rt}>{rt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom">From</Label>
                    <Input id="dateFrom" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTo">To</Label>
                    <Input id="dateTo" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">{t.bookings.purpose}</Label>
                  <Input id="purpose" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t.bookings.notes}</Label>
                  <Textarea id="notes" rows={3} />
                </div>
                <Button type="submit" className="gov-btn-primary w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {t.bookings.submitRequest}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default BookingsPage;
