import React, { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const departmentKeys = ['agriculture', 'land', 'animal', 'fisheries', 'irrigation'] as const;

const mockVideos = [
  { id: '1', title: 'Organic Farming Techniques', description: 'Step-by-step guide to organic farming practices.', department: 'agriculture', date: '2024-01-15', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '2', title: 'Land Registration Process', description: 'How to register your land with the Land Commissioner.', department: 'land', date: '2024-01-10', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '3', title: 'Livestock Vaccination Guide', description: 'Vaccination schedule and best practices for livestock.', department: 'animal', date: '2024-01-12', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '4', title: 'Sustainable Fishing Methods', description: 'Sustainable fishing and aquaculture practices.', department: 'fisheries', date: '2024-01-08', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '5', title: 'Irrigation System Maintenance', description: 'Maintaining small-scale irrigation systems.', department: 'irrigation', date: '2024-01-05', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
];

const VideosPage: React.FC = () => {
  const { t } = useLanguage();
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = useMemo(() => {
    let list = [...mockVideos];
    if (departmentFilter !== 'all') list = list.filter((v) => v.department === departmentFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q));
    }
    return list;
  }, [departmentFilter, searchQuery]);

  const getDepartmentLabel = (key: string) => t.departments[key as keyof typeof t.departments] ?? key;

  return (
    <Layout>
      <PageHero breadcrumb={[{ label: t.nav.videos }]} title={t.videos.title} subtitle={t.videos.subtitle} />

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t.videos.searchPlaceholder}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t.videos.filterByDepartment} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentKeys.map((key) => (
                  <SelectItem key={key} value={key}>{getDepartmentLabel(key)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="gov-card overflow-hidden p-0 group">
                <div className="relative aspect-video bg-muted">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <a
                    href={video.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                  </a>
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{getDepartmentLabel(video.department)} • {new Date(video.date).toLocaleDateString()}</p>
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  <a
                    href={video.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline"
                  >
                    {t.videos.watchVideo}
                    <Play className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VideosPage;
