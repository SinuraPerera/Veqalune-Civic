import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
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
} from './types';
import {
  fetchReports,
  fetchHotspots,
  fetchPredictiveScenarios,
  fetchCommunityMetrics,
  fetchCommunityInsights,
  updateReportStatus,
} from './services/api';

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>('/');

  // Core Data States
  const [reports, setReports] = useState<Report[]>([]);
  const [hotspots, setHotspots] = useState<HotspotCluster[]>([]);
  const [scenarios, setScenarios] = useState<PredictiveScenario[]>([]);
  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      try {
        const [repData, hotData, scData, metData] = await Promise.all([
          fetchReports(),
          fetchHotspots(),
          fetchPredictiveScenarios(),
          fetchCommunityMetrics(),
        ]);
        setReports(repData);
        setHotspots(hotData);
        setScenarios(scData);
        setMetrics(metData);
      } catch (err) {
        console.error('Data initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleNavigate = (path: string) => {
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Top Navigation */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        activeReportsCount={reports.length}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
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
            selectedReportFromParent={focusReportOnMap}
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
  );
}
