import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/contexts/AuthContext';
import { ProtectedRoute } from './auth/routes/ProtectedRoute';
import LoginPage from './auth/pages/LoginPage';

// Public Portfolio Sections
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Premium Interaction Components
import CustomCursor from './components/CustomCursor';
import PageLoader from './components/PageLoader';
import ScrollProgress from './components/ScrollProgress';
import { PublicPortfolioProvider } from './context/PublicPortfolioContext';

function PortfolioLandingPage() {
  return (
    <div className="relative min-h-screen font-sans bg-white text-slate-900 dark:bg-neutral-950 dark:text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-200 overflow-x-hidden">
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

import DashboardPage from './admin/pages/DashboardPage';
import ProjectsPage from './admin/pages/ProjectsPage';
import SkillsPage from './admin/pages/SkillsPage';
import ExperiencePage from './admin/pages/ExperiencePage';
import CertificatesPage from './admin/pages/CertificatesPage';
import ResumePage from './admin/pages/ResumePage';
import MessagesPage from './admin/pages/MessagesPage';
import AnalyticsPage from './admin/pages/AnalyticsPage';
import SettingsPage from './admin/pages/SettingsPage';
import HighlightsPage from './admin/pages/HighlightsPage';

export default function App() {
  return (
    <AuthProvider>
      <PublicPortfolioProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioLandingPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <SkillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/experience"
            element={
              <ProtectedRoute>
                <ExperiencePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute>
                <CertificatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resume"
            element={
              <ProtectedRoute>
                <ResumePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/highlights"
            element={
              <ProtectedRoute>
                <HighlightsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </PublicPortfolioProvider>
    </AuthProvider>
  );
}
