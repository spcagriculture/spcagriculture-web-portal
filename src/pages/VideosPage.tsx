import React, { useEffect, useMemo, useState } from 'react';
import { DepartmentLayout } from '@/components/layout/DepartmentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useDepartmentRoute } from '@/hooks/useDepartmentRoute';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  extractYoutubeVideoId,
  fetchAllVideos,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
  type VideoItem,
} from '@/integrations/firebase/videos';

const VideosPage: React.FC = () => {
  const { departmentId, basePath, config } = useDepartmentRoute();
  const { t } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!departmentId) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await fetchAllVideos(departmentId);
        if (!cancelled) setVideos(data);
      } catch (e) {
        console.error('Failed to load videos', e);
        if (!cancelled) {
          setLoadError('Could not load videos. Please try again later.');
          setVideos([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  const filteredVideos = useMemo(() => {
    let list = [...videos];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
      );
    }
    list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return list;
  }, [videos, searchQuery]);

  if (!departmentId) return null;

  const deptName = config ? (t.departments as Record<string, string>)[config.nameKey] : '';

  return (
    <DepartmentLayout>
      <PageHero
        homePath={basePath}
        breadcrumb={[{ label: deptName, path: basePath }, { label: t.nav.videos }]}
        title={t.videos.title}
        subtitle={t.videos.subtitle}
      />

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
          </div>
        </div>
      </section>

      <section className="gov-section">
        <div className="container mx-auto px-4">
          {loadError && (
            <p className="text-destructive text-center mb-8" role="alert">
              {loadError}
            </p>
          )}
          {isLoading && !loadError && (
            <p className="text-center text-muted-foreground py-12">Loading videos...</p>
          )}
          {!isLoading && !loadError && filteredVideos.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No videos to display.</p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!isLoading &&
              !loadError &&
              filteredVideos.map((video) => {
                const vid = extractYoutubeVideoId(video.youtubeUrl);
                const watchUrl = vid ? youtubeWatchUrl(vid) : video.youtubeUrl;
                const thumb = vid ? youtubeThumbnailUrl(vid) : '';

                return (
                  <Card key={video.id} className="gov-card overflow-hidden p-0 group">
                    <div className="relative aspect-video bg-muted">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
                          Invalid or missing YouTube link
                        </div>
                      )}
                      <a
                        href={watchUrl}
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
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(video.date).toLocaleDateString()}
                      </p>
                      <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline"
                      >
                        {t.videos.watchVideo}
                        <Play className="h-4 w-4" />
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>
    </DepartmentLayout>
  );
};

export default VideosPage;
