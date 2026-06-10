import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DepartmentProvider } from "@/contexts/DepartmentContext";
import DepartmentGatewayPage from "./pages/DepartmentGatewayPage";
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
import DepartmentHomePage from "./pages/department/DepartmentHomePage";
import DepartmentDetailPage from "./pages/department/DepartmentDetailPage";
import DeptContactPage from "./pages/department/DeptContactPage";
import AdminPortalPage from "./pages/Admin/AdminPortalPage";
import AdminDepartmentHubPage from "./pages/Admin/AdminDepartmentHubPage";
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
import { LegacyStatisticsRedirect } from "./components/routing/LegacyRedirects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="spc-portal-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DepartmentProvider>
              <Routes>
                {/* Department gateway (default entry) */}
                <Route path="/" element={<DepartmentGatewayPage />} />

                {/* Province-wide portal (former home) */}
                <Route path="/province" element={<Index />} />
                <Route path="/ministry" element={<MinistryPage />} />
                <Route path="/sabaragamuwa" element={<ProvincePage />} />
                <Route path="/leadership/governor" element={<GovernorPage />} />
                <Route path="/leadership/provincial-secretary" element={<ProvincialSecretaryPage />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/departments/:department" element={<DepartmentDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/bookings" element={<BookingsPage />} />

                {/* Department portals */}
                <Route path="/d/:department" element={<DepartmentHomePage />} />
                <Route path="/d/:department/news" element={<NewsPage />} />
                <Route path="/d/:department/news/:id" element={<NewsDetailPage />} />
                <Route path="/d/:department/services" element={<ServicesPage />} />
                <Route path="/d/:department/gallery" element={<GalleryPage />} />
                <Route path="/d/:department/publications" element={<PublicationsPage />} />
                <Route path="/d/:department/notices" element={<NoticesPage />} />
                <Route path="/d/:department/notices/:id" element={<NoticeDetailPage />} />
                <Route path="/d/:department/videos" element={<VideosPage />} />
                <Route path="/d/:department/statistics" element={<StatisticsDepartmentPage />} />
                <Route path="/d/:department/projects" element={<ProjectsPage />} />
                <Route path="/d/:department/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/d/:department/officers" element={<OfficersPage />} />
                <Route path="/d/:department/exams" element={<ExamsPage />} />
                <Route path="/d/:department/vacancies" element={<VacanciesPage />} />
                <Route path="/d/:department/results" element={<ResultsPage />} />
                <Route path="/d/:department/circulars" element={<CircularsPage />} />
                <Route path="/d/:department/documents" element={<DocumentsPage />} />
                <Route path="/d/:department/contact" element={<DeptContactPage />} />

                {/* Legacy routes redirect to gateway */}
                <Route path="/news" element={<Navigate to="/" replace />} />
                <Route path="/news/:id" element={<Navigate to="/" replace />} />
                <Route path="/services" element={<Navigate to="/" replace />} />
                <Route path="/gallery" element={<Navigate to="/" replace />} />
                <Route path="/publications" element={<Navigate to="/" replace />} />
                <Route path="/notices" element={<Navigate to="/" replace />} />
                <Route path="/notices/:id" element={<Navigate to="/" replace />} />
                <Route path="/videos" element={<Navigate to="/" replace />} />
                <Route path="/statistics" element={<Navigate to="/" replace />} />
                <Route path="/statistics/:department" element={<LegacyStatisticsRedirect />} />
                <Route path="/projects" element={<Navigate to="/" replace />} />
                <Route path="/projects/:id" element={<Navigate to="/" replace />} />
                <Route path="/officers" element={<Navigate to="/" replace />} />
                <Route path="/exams" element={<Navigate to="/" replace />} />
                <Route path="/vacancies" element={<Navigate to="/" replace />} />
                <Route path="/results" element={<Navigate to="/" replace />} />
                <Route path="/circulars" element={<Navigate to="/" replace />} />
                <Route path="/documents" element={<Navigate to="/" replace />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminPortalPage />} />
                <Route path="/admin/:department" element={<AdminDepartmentHubPage />} />
                <Route path="/admin/:department/services" element={<AdminServicesPage />} />
                <Route path="/admin/:department/news" element={<AdminNewsPage />} />
                <Route path="/admin/:department/notices" element={<AdminNoticesPage />} />
                <Route path="/admin/:department/publications" element={<AdminPublicationsPage />} />
                <Route path="/admin/:department/videos" element={<AdminVideosPage />} />
                <Route path="/admin/:department/gallery" element={<AdminGalleryPage />} />
                <Route path="/admin/:department/statistics" element={<AdminStatisticsPage />} />
                <Route path="/admin/:department/projects" element={<AdminProjectsPage />} />
                <Route path="/admin/:department/circulars" element={<AdminCircularsPage />} />
                <Route path="/admin/:department/documents" element={<AdminDocumentsPage />} />
                <Route path="/admin/:department/officers" element={<AdminOfficersPage />} />
                <Route path="/admin/:department/exams" element={<AdminExamsPage />} />
                <Route path="/admin/:department/vacancies" element={<AdminVacanciesPage />} />
                <Route path="/admin/:department/results" element={<AdminResultsPage />} />

                {/* Legacy admin redirects */}
                <Route path="/admin/services" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/news" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/notices" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/publications" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/videos" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/gallery" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/statistics" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/projects" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/circulars" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/documents" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/officers" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/exams" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/vacancies" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/results" element={<Navigate to="/admin" replace />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </DepartmentProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
