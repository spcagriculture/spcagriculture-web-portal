import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import ServicesPage from "./pages/ServicesPage";
import GalleryPage from "./pages/GalleryPage";
import MinistryPage from "./pages/MinistryPage";
import ProvincePage from "./pages/ProvincePage";
import GovernorPage from "./pages/GovernorPage";
import ProvincialSecretaryPage from "./pages/ProvincialSecretaryPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ContactPage from "./pages/ContactPage";
import PublicationsPage from "./pages/PublicationsPage";
import NoticesPage from "./pages/NoticesPage";
import NoticeDetailPage from "./pages/NoticeDetailPage";
import VideosPage from "./pages/VideosPage";
import StatisticsPage from "./pages/StatisticsPage";
import StatisticsDepartmentPage from "./pages/StatisticsDepartmentPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import OfficersPage from "./pages/OfficersPage";
import ExamsPage from "./pages/ExamsPage";
import VacanciesPage from "./pages/VacanciesPage";
import ResultsPage from "./pages/ResultsPage";
import BookingsPage from "./pages/BookingsPage";
import CircularsPage from "./pages/CircularsPage";
import DocumentsPage from "./pages/DocumentsPage";
import AdminPortalPage from "./pages/Admin/AdminPortalPage";
import AdminServicesPage from "./pages/Admin/AdminServicesPage";
import AdminNewsPage from "./pages/Admin/AdminNewsPage";
import AdminNoticesPage from "./pages/Admin/AdminNoticesPage";
import AdminPublicationsPage from "./pages/Admin/AdminPublicationsPage";
import AdminVideosPage from "./pages/Admin/AdminVideosPage";
import AdminGalleryPage from "./pages/Admin/AdminGalleryPage";
import AdminStatisticsPage from "./pages/Admin/AdminStatisticsPage";
import AdminProjectsPage from "./pages/Admin/AdminProjectsPage";
import AdminCircularsPage from "./pages/Admin/AdminCircularsPage";
import AdminDocumentsPage from "./pages/Admin/AdminDocumentsPage";
import AdminOfficersPage from "./pages/Admin/AdminOfficersPage";
import AdminExamsPage from "./pages/Admin/AdminExamsPage";
import AdminVacanciesPage from "./pages/Admin/AdminVacanciesPage";
import AdminResultsPage from "./pages/Admin/AdminResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="spc-portal-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/ministry" element={<MinistryPage />} />
              <Route path="/province" element={<ProvincePage />} />
              <Route path="/leadership/governor" element={<GovernorPage />} />
              <Route path="/leadership/provincial-secretary" element={<ProvincialSecretaryPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/notices/:id" element={<NoticeDetailPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/statistics/:department" element={<StatisticsDepartmentPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/officers" element={<OfficersPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/vacancies" element={<VacanciesPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/circulars" element={<CircularsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/admin" element={<AdminPortalPage />} />
              <Route path="/admin/services" element={<AdminServicesPage />} />
              <Route path="/admin/news" element={<AdminNewsPage />} />
              <Route path="/admin/notices" element={<AdminNoticesPage />} />
              <Route path="/admin/publications" element={<AdminPublicationsPage />} />
              <Route path="/admin/videos" element={<AdminVideosPage />} />
            <Route path="/admin/gallery" element={<AdminGalleryPage />} />
              <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
              <Route path="/admin/projects" element={<AdminProjectsPage />} />
              <Route path="/admin/circulars" element={<AdminCircularsPage />} />
              <Route path="/admin/documents" element={<AdminDocumentsPage />} />
              <Route path="/admin/officers" element={<AdminOfficersPage />} />
              <Route path="/admin/exams" element={<AdminExamsPage />} />
              <Route path="/admin/vacancies" element={<AdminVacanciesPage />} />
              <Route path="/admin/results" element={<AdminResultsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
