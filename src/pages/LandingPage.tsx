import React, { lazy, memo, Suspense } from 'react';
import {
  ArrowRight,
  Activity,
  MapPin,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { CommunityMetrics } from '../types';
import { useLanguage } from '../context/LanguageContext';

const CivicSignalScene = lazy(() => import('../components/CivicSignalScene').then((module) => ({ default: module.CivicSignalScene })));

interface Props {
  metrics: CommunityMetrics | null;
  onNavigate: (path: string) => void;
  onOpenDbModal: () => void;
  onOpenTechnicalDossier?: (tab?: any) => void;
}

export const LandingPage: React.FC<Props> = memo(({
  metrics,
  onNavigate,
  onOpenDbModal,
  onOpenTechnicalDossier,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="hero-signal-shell relative min-h-[720px] pt-14 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Soft luminous background tints */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-transparent to-sky-100/30 opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-90">
          <Suspense fallback={null}>
            <CivicSignalScene />
          </Suspense>
        </div>
        <div className="hero-signal-vignette absolute inset-0 pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-8 relative z-10">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-white/70 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600 shadow-sm shadow-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" aria-hidden="true" />
            Live community intelligence
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {t.landing.heroH1Part1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 animate-gradient">
              {t.landing.heroH1Gradient}
            </span>{' '}
            {t.landing.heroH1Part2}
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl text-slate-500 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.landing.heroDesc}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/report')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 group cursor-pointer hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-white min-h-[52px]"
              aria-label="Submit a new report"
            >
              <span>{t.common.reportIssue}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>

            <button
              onClick={() => onNavigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-slate-700 font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-white min-h-[52px]"
              aria-label="Explore the dashboard"
            >
              <span>{t.common.exploreIntelligence}</span>
              <ArrowRight className="w-5 h-5 text-slate-400" aria-hidden="true" />
            </button>
          </div>

          {/* Demo CTA */}
          <div className="mt-8 pt-6 border-t border-slate-200/60">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg px-3 py-2"
              aria-label="Try the interactive demo"
            >
              <span className="font-medium">Try the demo</span>
              <span className="text-slate-300">—</span>
              <span>See AI-powered civic intelligence in action with sample data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Metrics preview bar */}
        <div className="relative z-10 mt-16 max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl glass-card">
          {/* Subtle shimmer border highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent rounded-t-3xl" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/50">
            <div className="text-center p-3 group hover:bg-white/60 rounded-xl transition-all">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t.landing.metricsHealth}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-500 group-hover:scale-110 transition-transform">
                {metrics?.healthScore ?? 82}
                <span className="text-sm font-normal text-slate-400 ml-1">/100</span>
              </div>
            </div>

            <div className="text-center p-3 group hover:bg-white/60 rounded-xl transition-all">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t.landing.metricsCritical}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-500 group-hover:scale-110 transition-transform">
                {metrics?.criticalCount ?? 8}
              </div>
            </div>

            <div className="text-center p-3 group hover:bg-white/60 rounded-xl transition-all">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t.landing.metricsHigh}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-500 group-hover:scale-110 transition-transform">
                {metrics?.highPriorityCount ?? 17}
              </div>
            </div>

            <div className="text-center p-3 group hover:bg-white/60 rounded-xl transition-all">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t.landing.metricsActive}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-500 group-hover:scale-110 transition-transform">
                {metrics?.activeReportsCount ?? 51}
              </div>
            </div>

            <div className="text-center p-3 col-span-2 sm:col-span-1 group hover:bg-white/60 rounded-xl transition-all">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t.landing.metricsResolved}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-500 group-hover:scale-110 transition-transform">
                {metrics?.resolvedCount ?? 24}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
            Quick Actions
          </h2>
          <p className="text-slate-500">
            Get started with these essential features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Report Issue */}
          <button
            onClick={() => onNavigate('/report')}
            className="p-8 rounded-3xl glass-card hover:border-emerald-300/70 transition-all cursor-pointer group hover:-translate-y-1.5 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50 relative overflow-hidden"
            aria-label="Navigate to Report Issue page"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200/70 text-emerald-600 group-hover:scale-110 transition-transform shadow-sm w-fit">
                <Activity className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                Report Issue
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Submit a civic issue with AI-powered analysis
              </p>
            </div>
          </button>

          {/* View Map */}
          <button
            onClick={() => onNavigate('/map')}
            className="p-8 rounded-3xl glass-card hover:border-violet-300/70 transition-all cursor-pointer group hover:-translate-y-1.5 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50 relative overflow-hidden"
            aria-label="Navigate to Map page"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/70 border border-violet-200/70 text-violet-600 group-hover:scale-110 transition-transform shadow-sm w-fit">
                <MapPin className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
                View Map
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Explore incidents on the interactive map
              </p>
            </div>
          </button>

          {/* Dashboard */}
          <button
            onClick={() => onNavigate('/dashboard')}
            className="p-8 rounded-3xl glass-card hover:border-amber-300/70 transition-all cursor-pointer group hover:-translate-y-1.5 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50 relative overflow-hidden"
            aria-label="Navigate to Dashboard page"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200/70 text-amber-600 group-hover:scale-110 transition-transform shadow-sm w-fit">
                <BarChart3 className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                Dashboard
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                View community metrics and analytics
              </p>
            </div>
          </button>

          {/* Insights */}
          <button
            onClick={() => onNavigate('/insights')}
            className="p-8 rounded-3xl glass-card hover:border-indigo-300/70 transition-all cursor-pointer group hover:-translate-y-1.5 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50 relative overflow-hidden"
            aria-label="Navigate to Insights page"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/70 border border-indigo-200/70 text-indigo-600 group-hover:scale-110 transition-transform shadow-sm w-fit">
                <TrendingUp className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Insights
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                AI-powered predictive analytics
              </p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
});
