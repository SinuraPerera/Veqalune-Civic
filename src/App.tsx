import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { ReportPage } from './pages/ReportPage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { MapPage } from './pages/MapPage';
import { DashboardPage } from './pages/DashboardPage';
import { InsightsPage } from './pages/InsightsPage';
import { ReportsTablePage } from './pages/ReportsTablePage';
import { ReportDetailModal } from './components/ReportDetailModal';
import { DatabaseModal } from './components/DatabaseModal';
import {
  Report,
  HotspotCluster,
  PredictiveScenario,
  CommunityMetrics,
  AnalysisRequestPayload,
  ReportStatus,
  SystemHealth,
} from './types';
import {
  fetchReports,
  fetchCommunityInsights,
  updateReportStatus,
  fetchSystemHealth,
} from './services/api';

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    return path === '/' || ['/report', '/analysis', '/map', '/dashboard', '/insights', '/reports'].includes(path)
      ? path
      : '/';
  });

  // Core Data States
  const [reports, setReports] = useState<Report[]>([]);
  const [hotspots, setHotspots] = useState<HotspotCluster[]>([]);
  const [scenarios, setScenarios] = useState<PredictiveScenario[]>([]);
  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  // Analysis Pipeline State
  const [analysisPayload, setAnalysisPayload] = useState<AnalysisRequestPayload | null>(null);

  // Modals & Inspection State
  const [selectedReportForModal, setSelectedReportForModal] = useState<Report | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [focusReportOnMap, setFocusReportOnMap] = useState<Report | null>(null);

  // Load initial data from backend (with demo fallback)
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [repData, insights] = await Promise.all([
          fetchReports(),
          fetchCommunityInsights(),
        ]);
        setReports(repData);
        setHotspots(insights.hotspots);
        setScenarios(insights.predictiveScenarios);
        setMetrics(insights.metrics);
      } catch (err) {
        console.error('Data initialization error:', err);
        setError('Failed to load data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const refreshHealth = () => {
      fetchSystemHealth()
        .then((health) => {
          if (isMounted) setSystemHealth(health);
        })
        .catch(() => {
          if (isMounted) setSystemHealth(null);
        });
    };
    refreshHealth();
    const interval = window.setInterval(refreshHealth, 30_000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(['/report', '/analysis', '/map', '/dashboard', '/insights', '/reports'].includes(path) ? path : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (path !== window.location.pathname) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAnalysis = (payload: AnalysisRequestPayload) => {
    setAnalysisPayload(payload);
    setCurrentPath('/analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportSaved = (newReport: Report) => {
    setReports((prev) => [newReport, ...prev]);
    // Refresh community metrics and dynamic hotspots from backend
    fetchCommunityInsights()
      .then((data) => {
        setMetrics(data.metrics);
        setHotspots(data.hotspots);
      })
      .catch(console.error);
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const updated = await updateReportStatus(reportId, newStatus);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      if (selectedReportForModal && selectedReportForModal.id === reportId) {
        setSelectedReportForModal((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      fetchCommunityInsights()
        .then((data) => {
          setMetrics(data.metrics);
          setHotspots(data.hotspots);
        })
        .catch(console.error);
    } catch (err) {
      console.error('Status update failed:', err);
      // Fallback local optimistic update if server is unreachable
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
    }
  };

  const handleViewReportOnMap = (report: Report) => {
    setFocusReportOnMap(report);
    setCurrentPath('/map');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* Top Navigation */}
        <Header
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onOpenDbModal={() => setIsDbModalOpen(true)}
          activeReportsCount={reports.length}
          systemHealth={systemHealth}
        />

        {/* Main Routed Content */}
        <main className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-5">
                {/* Liquid glass loading ring */}
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full glass-card" />
                  <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="text-slate-500 text-sm font-medium">Loading VÉQALUNE CIVIC...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4 max-w-md p-8 rounded-3xl glass-card">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-orange-50 border border-rose-200 flex items-center justify-center mx-auto shadow-lg">
                  <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Unable to Load Data</h3>
                <p className="text-slate-500 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentPath === '/' && (
                <LandingPage
                  metrics={metrics}
                  onNavigate={handleNavigate}
                  onOpenDbModal={() => setIsDbModalOpen(true)}
                />
              )}

              {currentPath === '/report' && (
                <ReportPage onStartAnalysis={handleStartAnalysis} />
              )}

              {currentPath === '/analysis' && (
                <AnalysisResultPage
                  analysisPayload={analysisPayload}
                  onNavigate={handleNavigate}
                  onReportSaved={handleReportSaved}
                />
              )}

              {currentPath === '/map' && (
                <MapPage
                  reports={reports}
                  hotspots={hotspots}
                  onSelectReport={(report) => setSelectedReportForModal(report)}
                  onHotspotsUpdated={(updatedHs) => setHotspots(updatedHs)}
                />
              )}

              {currentPath === '/dashboard' && (
                <DashboardPage
                  metrics={metrics}
                  reports={reports}
                  hotspots={hotspots}
                  onSelectReport={(report) => setSelectedReportForModal(report)}
                  onNavigate={handleNavigate}
                  onStatusChange={handleStatusChange}
                />
              )}

              {currentPath === '/insights' && (
                <InsightsPage
                  hotspots={hotspots}
                  scenarios={scenarios}
                  onNavigate={handleNavigate}
                  onHotspotsUpdated={(updatedHs) => setHotspots(updatedHs)}
                />
              )}

              {currentPath === '/reports' && (
                <ReportsTablePage
                  reports={reports}
                  onSelectReport={(report) => setSelectedReportForModal(report)}
                  onStatusChange={handleStatusChange}
                  onNavigate={handleNavigate}
                />
              )}
            </>
          )}
        </main>

        {/* Global Footer (Hidden in full-height map page for ergonomics) */}
        {currentPath !== '/map' && (
          <Footer
            onNavigate={handleNavigate}
            onOpenDbModal={() => setIsDbModalOpen(true)}
          />
        )}

        {/* Report Detailed Intelligence Modal */}
        <ReportDetailModal
          report={selectedReportForModal}
          onClose={() => setSelectedReportForModal(null)}
          onStatusChange={handleStatusChange}
          onViewOnMap={handleViewReportOnMap}
        />

        {/* CodeSplash '26 Supabase / PostgreSQL Architecture Modal */}
        <DatabaseModal
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}
