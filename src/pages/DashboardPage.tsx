import React from 'react';
import {
  Activity,
  AlertTriangle,
  Flame,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  BarChart3,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CommunityMetrics, Report, HotspotCluster, ReportCategory, ReportStatus } from '../types';
import { CategoryIcon, getCategoryBadgeStyle } from '../components/CategoryIcon';
import { getSeverityBadgeColor, getStatusBadgeColor } from '../utils/scoringEngine';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  metrics: CommunityMetrics | null;
  reports: Report[];
  hotspots: HotspotCluster[];
  onSelectReport: (report: Report) => void;
  onNavigate: (path: string) => void;
  onStatusChange: (reportId: string, status: ReportStatus) => void;
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

  const healthScore = metrics?.healthScore ?? 82;
  const criticalCount = metrics?.criticalCount ?? 8;
  const highCount = metrics?.highPriorityCount ?? 17;
  const activeCount = metrics?.activeReportsCount ?? 51;
  const resolvedCount = metrics?.resolvedCount ?? 24;

  const priorityDist = metrics?.priorityDistribution || {
    critical: 4,
    high: 5,
    moderate: 2,
    low: 1,
  };

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
      {/* Top Banner & Command Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {t.dashboard.pageTag}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            {t.dashboard.pageHeading}
          </h1>
          <p className="text-xs text-zinc-400">
            {t.dashboard.pageDesc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/map')}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 flex items-center gap-2 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            {t.common.viewOnMap}
          </button>
          <button
            onClick={() => onNavigate('/report')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-md shadow-emerald-950/50 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            {t.common.reportIssue}
          </button>
        </div>
      </div>

      {/* TOP 5 METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 1. Community Health Score */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            <span>{t.landing.metricsHealth}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
              {healthScore}
              <span className="text-xs font-normal text-zinc-400 font-sans ml-1">/100</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">{t.landing.metricsHealthSub}</p>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${healthScore}%` }}></div>
          </div>
        </div>

        {/* 2. Critical Issues */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            <span>{t.landing.metricsCritical}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-400">
              {criticalCount}
            </div>
            <p className="text-[11px] text-rose-400/80 mt-0.5">{t.landing.metricsCriticalSub}</p>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">&lt; 4 hr dispatch protocol</span>
        </div>

        {/* 3. High Priority */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            <span>{t.landing.metricsHigh}</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">
              {highCount}
            </div>
            <p className="text-[11px] text-amber-400/80 mt-0.5">{t.landing.metricsHighSub}</p>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">&lt; 24 hr dispatch window</span>
        </div>

        {/* 4. Active Reports */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            <span>{t.landing.metricsActive}</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-400">
              {activeCount}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">{t.landing.metricsActiveSub}</p>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">94% classified by AI</span>
        </div>

        {/* 5. Resolved */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            <span>{t.landing.metricsResolved}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
              {resolvedCount}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-0.5">{t.landing.metricsResolvedSub}</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">+12% vs last cycle</span>
        </div>
      </div>

      {/* AI COMMUNITY INSIGHT CARD (Explicit AI-generated card) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/30 border border-emerald-900/50 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-xs font-mono text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              {t.dashboard.aiInsightTitle}
            </div>
            <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed max-w-3xl">
              {t.dashboard.aiInsightQuote}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono pt-1">
              <span>Cluster: Sector 4 Canal Walkway (Colombo Pilot)</span>
              <span>•</span>
              <span className="text-rose-400 font-bold">Severity: High Recurrence</span>
              <span>•</span>
              <button
                onClick={() => onNavigate('/insights')}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-sans font-semibold cursor-pointer"
              >
                Inspect in VÉQALUNE Predict <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => onNavigate('/insights')}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
            >
              Generate Live AI Briefing
            </button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN GRID: Priority Distribution & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Distribution */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                {t.dashboard.priorityDistTitle}
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">0–100 Engine</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-rose-400 font-bold">{t.dashboard.distCritical} (85–100)</span>
                <span className="font-mono text-zinc-200 font-bold">{priorityDist.critical} Reports</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(priorityDist.critical / 12) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-amber-400 font-bold">{t.dashboard.distHigh} (70–84)</span>
                <span className="font-mono text-zinc-200 font-bold">{priorityDist.high} Reports</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(priorityDist.high / 12) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-yellow-400 font-bold">{t.dashboard.distModerate} (50–69)</span>
                <span className="font-mono text-zinc-200 font-bold">{priorityDist.moderate} Reports</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${(priorityDist.moderate / 12) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-emerald-400 font-bold">{t.dashboard.distLow} (&lt;50)</span>
                <span className="font-mono text-zinc-200 font-bold">{priorityDist.low} Reports</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(priorityDist.low / 12) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                {t.dashboard.categoryBreakdownTitle}
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">6 Core MVP Vectors</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {categories.map((cat) => {
              const count = metrics?.categoryBreakdown?.[cat] || 2;
              const catBadge = getCategoryBadgeStyle(cat);
              return (
                <div
                  key={cat}
                  onClick={() => onNavigate('/reports')}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <CategoryIcon category={cat} size={16} className={catBadge.text} />
                    <span className="text-base font-bold font-mono text-zinc-100">{count}</span>
                  </div>
                  <div className="text-xs font-medium text-zinc-300 truncate">{formatCategory(cat)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RECURRING HOTSPOTS & SPATIAL VULNERABILITY */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              {t.dashboard.recurringHotspotsTitle}
            </h3>
            <p className="text-xs text-zinc-400">
              {t.dashboard.recurringHotspotsDesc}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/map')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            {t.dashboard.viewMapClusters} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hotspots.map((hs) => (
            <div
              key={hs.id}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/80">
                    Risk Score: {hs.riskScore}/100
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {hs.reportCount} Incidents
                  </span>
                </div>
                <h4 className="font-bold text-zinc-100 text-xs">{hs.name}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1.5">
                  {hs.insightText}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 text-[11px]">
                <strong className="text-emerald-400 block font-semibold mb-0.5">
                  Intervention:
                </strong>
                <span className="text-zinc-300">{hs.recommendedIntervention}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT REPORTS QUEUE */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              {t.dashboard.prioritizedQueueTitle}
            </h3>
            <p className="text-xs text-zinc-400">
              {t.dashboard.prioritizedQueueDesc}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/reports')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {t.dashboard.viewFullTable} ({reports.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {reports.slice(0, 5).map((rep) => {
            const sev = getSeverityBadgeColor(rep.severity);
            const sta = getStatusBadgeColor(rep.status);
            const cat = getCategoryBadgeStyle(rep.category);

            return (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/60 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border mt-0.5 shrink-0 ${cat.bg} ${cat.text} ${cat.border}`}>
                    <CategoryIcon category={rep.category} size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-semibold text-zinc-400">
                        {rep.id}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sev.bg} ${sev.text} ${sev.border}`}>
                        {formatSeverity(rep.severity)}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sta.bg} ${sta.text} ${sta.border}`}>
                        {formatStatus(rep.status)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                      {rep.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {rep.location_label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-zinc-200">
                      Priority: <span className={rep.priority_score >= 85 ? 'text-rose-400' : 'text-emerald-400'}>{rep.priority_score}</span>/100
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      Conf: {rep.ai_confidence}%
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
