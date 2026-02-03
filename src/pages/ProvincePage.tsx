import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Building2, History, Leaf, Flag, Flower2, Mountain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const importantPlaces = [
  { id: '1', name: 'Adam\'s Peak (Sri Pada)', description: 'Sacred mountain and pilgrimage site', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400' },
  { id: '2', name: 'Sinharaja Forest Reserve', description: 'UNESCO World Heritage rainforest', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
  { id: '3', name: 'Ratnapura Gem Mines', description: 'City of gems, famous for precious stones', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' },
];

const ProvincePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <PageHero
        breadcrumb={[{ label: t.nav.province }]}
        title={t.province.title}
        subtitle={t.province.subtitle}
      />

      {/* Overview */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-6">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">{t.province.overview}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t.province.geography}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sabaragamuwa Province is one of the nine provinces of Sri Lanka, located in the south-central region.
                It comprises two districts—Ratnapura and Kegalle—and is known for its rich biodiversity, gem mining,
                and agriculture. The province plays a vital role in the country&apos;s agricultural output, including tea,
                rubber, and paddy cultivation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Provincial Council of Sabaragamuwa exercises devolved power over agriculture, land, irrigation,
                and related subjects within the province, working in coordination with the Ministry of Land,
                Agriculture & Fisheries.
              </p>
            </div>
            <div className="relative animate-slide-in-right">
              <img
                src="https://images.unsplash.com/photo-1560693225-b8507d6f3aa9?w=600"
                alt="Sabaragamuwa Province"
                className="rounded-2xl shadow-lg w-full object-cover h-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Provincial Council */}
      <section className="gov-section-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t.province.council}</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Sabaragamuwa Provincial Council is the elected body responsible for the administration of the province.
              Its mandate includes provincial planning, agriculture, land use, irrigation, and cultural affairs,
              in accordance with the Constitution of Sri Lanka.
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <History className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">{t.province.history}</h2>
          </div>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            Sabaragamuwa has a long history linked to the ancient Kingdom of Kandy and the gem trade.
            The name is derived from &quot;Sabara&quot; (forest) and &quot;Gamuwa&quot; (village). The region is historically
            significant for Buddhism (Adam&apos;s Peak) and for producing precious stones. Today it remains central to
            Sri Lanka&apos;s agriculture and natural resource sector.
          </p>
        </div>
      </section>

      {/* Districts */}
      <section className="gov-section-alt">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t.province.districts}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="gov-card overflow-hidden p-0">
              <div className="h-48 bg-muted">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" alt={t.province.ratnapura} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{t.province.ratnapura}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Capital of the province; known for gems, agriculture, and access to Sinharaja and Adam&apos;s Peak.
                </p>
                <a
                  href="https://www.google.com/maps/search/Ratnapura+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <MapPin className="h-4 w-4" /> View on map
                </a>
              </CardContent>
            </Card>
            <Card className="gov-card overflow-hidden p-0">
              <div className="h-48 bg-muted">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600" alt={t.province.kegalle} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{t.province.kegalle}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Second district; key for rubber, tea, and connectivity to central and western regions.
                </p>
                <a
                  href="https://www.google.com/maps/search/Kegalle+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <MapPin className="h-4 w-4" /> View on map
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Flag & Flower */}
      <section className="gov-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Provincial Symbols</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="gov-card">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-32 h-48 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Flag className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{t.province.flag}</h3>
                  <p className="text-muted-foreground text-sm">
                    The provincial flag of Sabaragamuwa represents the identity and heritage of the province.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="gov-card">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-32 h-48 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Flower2 className="h-16 w-16 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{t.province.flower}</h3>
                  <p className="text-muted-foreground text-sm">
                    The provincial flower symbolizes the natural beauty and flora of Sabaragamuwa.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Places */}
      <section className="gov-section-alt">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Mountain className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">{t.province.places}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {importantPlaces.map((place) => (
              <Card key={place.id} className="gov-card overflow-hidden p-0">
                <div className="h-44">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground mb-1">{place.name}</h3>
                  <p className="text-sm text-muted-foreground">{place.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProvincePage;
