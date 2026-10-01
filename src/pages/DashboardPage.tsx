import React, { memo } from 'react';
import { Activity, AlertTriangle, CheckCircle2, BarChart3, MapPin, ChevronRight, ArrowRight, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Report, HotspotCluster, CommunityMetrics, ReportCategory, ReportStatus } from '../types';
import { CategoryIcon, getCategoryBadgeStyle } from '../components/CategoryIcon';
import { getSeverityBadgeColor, getStatusBadgeColor } from '../utils/scoringEngine';
import { MetricCardSkeleton, CardSkeleton } from '../components/Skeleton';
import { EmptyDashboard } from '../components/EmptyState';
import { useToast } from '../components/Toast';
import { INITIAL_SAMPLE_REPORTS } from '../data/sampleReports';

interface Props {
  metrics: CommunityMetrics | null;
  reports: Report[];
  hotspots: HotspotCluster[];
  onSelectReport: (report: Report) => void;
  onNavigate: (path: string) => void;
  onStatusChange: (reportId: string, newStatus: ReportStatus) => void;
}

export const DashboardPage: React.FC<Props> = ({
  metrics,
  reports,
  hotspots,
  onSelectReport,
  onNavigate,
  onStatusChange,
}) => {
  const { t, formatCategory, formatSeverity, formatStatus } = useLanguage();
  const { showToast } = useToast();

  const handleSimulateReport = () => {
    const randomReport = INITIAL_SAMPLE_REPORTS[Math.floor(Math.random() * INITIAL_SAMPLE_REPORTS.length)];
    showToast('success', 'New report simulated', `${randomReport.title} has been added to the dashboard`);
  };

  const healthScore = metrics?.healthScore ?? 82;
  const recentReports = reports.slice(0, 8);

  const categories: ReportCategory[] = [
    'Waste',
    'Road Damage',
    'Water',
    'Drainage',
    'Energy',
    'Public Safety',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Community metrics and analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateReport}
            className="px-4 py-2.5 rounded-xl glass-card text-slate-700 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
            aria-label="Simulate a new incoming report"
            title="Demo: Simulate incoming report"
          >
            <Play className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            Simulate Report
          </button>
          <button
            onClick={() => onNavigate('/map')}
            className="px-5 py-2.5 rounded-xl glass-card text-slate-700 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
            aria-label="View the interactive map"
          >
            <MapPin className="w-4 h-4 text-rose-500" aria-hidden="true" />
            View Map
          </button>
          <button
            onClick={() => onNavigate('/report')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
            aria-label="Submit a new report"
          >
            Report Issue
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {!metrics ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            {/* Health Score */}
            <div className="p-6 rounded-3xl glass-card relative overflow-hidden group hover:-translate-y-1 transition-all">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                {t.landing.metricsHealth}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-500 group-hover:scale-105 transition-transform">
                {healthScore}
                <span className="text-sm font-normal text-slate-400 ml-1">/100</span>
              </div>
            </div>

            {/* Critical */}
            <div className="p-6 rounded-3xl glass-card relative overflow-hidden group hover:-translate-y-1 transition-all">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent" />
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                {t.landing.metricsCritical}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-500 group-hover:scale-105 transition-transform">
                {metrics?.criticalCount ?? 0}
              </div>
            </div>

            {/* High Priority */}
            <div className="p-6 rounded-3xl glass-card relative overflow-hidden group hover:-translate-y-1 transition-all">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                {t.landing.metricsHigh}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-500 group-hover:scale-105 transition-transform">
                {metrics?.highPriorityCount ?? 0}
              </div>
            </div>

            {/* Active */}
            <div className="p-6 rounded-3xl glass-card relative overflow-hidden group hover:-translate-y-1 transition-all">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                {t.landing.metricsActive}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-500 group-hover:scale-105 transition-transform">
                {metrics?.activeReportsCount ?? 0}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="p-8 rounded-3xl glass-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
              Category Breakdown
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const count = metrics?.categoryBreakdown?.[cat] || 2;
            const catBadge = getCategoryBadgeStyle(cat);
            return (
              <div
                key={cat}
                onClick={() => onNavigate('/reports')}
                className="p-5 rounded-2xl glass hover:bg-white/80 border border-white/60 cursor-pointer transition-all group hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${catBadge.bg} ${catBadge.text} ${catBadge.border} group-hover:scale-110 transition-transform`}>
                    <CategoryIcon category={cat} size={18} />
                  </div>
                  <span className="text-xl font-bold font-mono text-slate-800 group-hover:scale-105 transition-transform">{count}</span>
                </div>
                <div className="text-sm font-medium text-slate-600 truncate">{formatCategory(cat)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="p-8 rounded-3xl glass-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
              {t.dashboardPage.recentReports}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('/reports')}
            className="text-sm text-slate-400 hover:text-emerald-500 font-semibold flex items-center gap-1 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg px-2 py-1"
          >
            {t.dashboardPage.viewAll}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {!reports || reports.length === 0 ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : recentReports.length === 0 ? (
            <EmptyDashboard onReport={() => onNavigate('/report')} />
          ) : (
            recentReports.map((report) => {
              const catStyle = getCategoryBadgeStyle(report.category);
              const sevStyle = getSeverityBadgeColor(report.severity);
              const statusStyle = getStatusBadgeColor(report.status);

              return (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="p-4 rounded-2xl glass hover:bg-white/80 cursor-pointer transition-all space-y-3 group hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                        <CategoryIcon category={report.category} size={14} />
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-semibold">
                        {report.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded font-mono font-bold border ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}>
                        {formatSeverity(report.severity)}
                      </span>
                      <span className="text-sm font-mono font-extrabold text-emerald-500">
                        {report.priority_score}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {report.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {report.location_label}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-500">
                      {t.common.status}:{' '}
                      <span className={`font-semibold ${statusStyle.text}`}>
                        {formatStatus(report.status)}
                      </span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(report.id, 'Resolved');
                      }}
                      className="text-emerald-500 hover:text-emerald-600 font-semibold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded px-2 py-1"
                    >
                      {t.dashboardPage.markResolved}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
