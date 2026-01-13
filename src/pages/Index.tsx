import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickLinksSection } from '@/components/home/QuickLinksSection';
import { NewsSection } from '@/components/home/NewsSection';
import { DepartmentsSection } from '@/components/home/DepartmentsSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { GalleryPreview } from '@/components/home/GalleryPreview';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickLinksSection />
      <NewsSection />
      <DepartmentsSection />
      <ServicesSection />
      <GalleryPreview />
    </Layout>
  );
};

export default Index;
