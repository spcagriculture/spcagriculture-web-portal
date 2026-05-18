import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Building2, History, Leaf, Flag, Flower2, Mountain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const importantPlaces = [
  {
    id: '1',
    name: 'Adam\'s Peak (Sri Pada)',
    description: 'Sacred mountain and famous pilgrimage site near Ratnapura, known for the Sri Pada footprint.',
    image: '/images/Adams-Peak.jpg',
  },
  {
    id: '2',
    name: 'Bopath Ella Falls',
    description: 'Popular waterfall in Kuruwita, Ratnapura, named for its shape similar to a Bo leaf.',
    image: '/images/Bopath-Ella-Falls.jpg',
  },
  {
    id: '3',
    name: 'Maduwanwela Walawwa',
    description: 'Historic manor house in Kolonna, Ratnapura District, famous for its heritage architecture.',
    image: '/images/Maduwanwela-Walawwa.jpg',
  },
  {
    id: '4',
    name: 'Pinnawala Elephant Orphanage',
    description: 'Elephant care and conservation attraction located in Pinnawala near Kegalle.',
    image: '/images/Pinnawala-Elephant-Orphanage.jpg',
  },
  {
    id: '5',
    name: 'Ratnapura Gem Mines',
    description: 'Famous gem mining area at the heart of Sri Lanka’s gemstone industry.',
    image: '/images/Ratnapura-Gem-Mines.jpg',
  },
  {
    id: '6',
    name: 'Maha Saman Devalaya',
    description: 'Sacred shrine in Ratnapura dedicated to deity Saman, the guardian deity of Sri Pada.',
    image: '/images/Saman-Dewalaya.jpg',
  },
  {
    id: '7',
    name: 'Sinharaja Rainforest',
    description: 'UNESCO World Heritage rainforest with rich biodiversity and many endemic species.',
    image: '/images/Sinharaja-Rainforest.jpg',
  },
  {
    id: '8',
    name: 'Udawalawe National Park',
    description: 'Wildlife park famous for Sri Lankan elephants, water birds, and safari experiences.',
    image: '/images/Udawalawe-National-Park.jpg',
  },
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
              src="/images/Sabaragamuwa.jpg"
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
              <img
                src="/images/ratnapura.jpg"
                alt={t.province.ratnapura}
                className="w-full h-full object-cover"
              />
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
              <img
                src="/images/kegalle.jpg"
                alt={t.province.kegalle}
                className="w-full h-full object-cover"
              />
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
              <div className="w-40 h-40 rounded-lg overflow-hidden shrink-0 bg-muted">
                <img
                  src="/images/sabaragamuwa-flag.jpg"
                  alt="Sabaragamuwa Provincial Flag"
                  className="w-full h-full object-cover"
                />
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
              <div className="w-40 h-40 rounded-lg overflow-hidden shrink-0 bg-muted">
                <img
                  src="/images/vesak-orchid.jpg"
                  alt="Vesak Orchid"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t.province.flower}</h3>
                <p className="text-muted-foreground text-sm">
                  The provincial flower of the Sabaragamuwa Province in Sri Lanka is the Vesak Orchid (Dendrobium maccarthiae).
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
