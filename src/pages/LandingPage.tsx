import React from 'react';
import {
  Activity,
  ArrowRight,
  Eye,
  BrainCircuit,
  Sliders,
  Share2,
  CheckCircle2,
  TrendingUp,
  Trash2,
  AlertTriangle,
  Droplets,
  Waves,
  Zap,
  ShieldAlert,
  Sparkles,
  MapPin,
  BarChart3,
  Layers,
  ArrowUpRight,
  Award,
  BookOpen,
  FileText,
  Workflow,
  Cpu,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { CommunityMetrics } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  metrics: CommunityMetrics | null;
  onNavigate: (path: string) => void;
  onOpenDbModal: () => void;
  onOpenTechnicalDossier?: (tab?: any) => void;
}

export const LandingPage: React.FC<Props> = ({
  metrics,
  onNavigate,
  onOpenDbModal,
  onOpenTechnicalDossier,
}) => {
  const { t } = useLanguage();

  const workflowSteps = [
    {
      step: '01',
      title: t.landing.stages.s1Title,
      subtitle: t.landing.stages.s1Sub,
      desc: t.landing.stages.s1Desc,
      icon: Eye,
      color: 'emerald',
    },
    {
      step: '02',
      title: t.landing.stages.s2Title,
      subtitle: t.landing.stages.s2Sub,
      desc: t.landing.stages.s2Desc,
      icon: BrainCircuit,
      color: 'sky',
    },
    {
      step: '03',
      title: t.landing.stages.s3Title,
      subtitle: t.landing.stages.s3Sub,
      desc: t.landing.stages.s3Desc,
      icon: Sliders,
      color: 'amber',
    },
    {
      step: '04',
      title: t.landing.stages.s4Title,
      subtitle: t.landing.stages.s4Sub,
      desc: t.landing.stages.s4Desc,
      icon: Share2,
      color: 'purple',
    },
    {
      step: '05',
      title: t.landing.stages.s5Title,
      subtitle: t.landing.stages.s5Sub,
      desc: t.landing.stages.s5Desc,
      icon: CheckCircle2,
      color: 'teal',
    },
    {
      step: '06',
      title: t.landing.stages.s6Title,
      subtitle: t.landing.stages.s6Sub,
      desc: t.landing.stages.s6Desc,
      icon: TrendingUp,
      color: 'indigo',
    },
  ];

  const focusCategories = [
    {
      name: t.landing.domains.waste.name,
      category: 'Waste',
      desc: t.landing.domains.waste.desc,
      icon: Trash2,
      color: 'emerald',
      activeCount: metrics?.categoryBreakdown?.Waste || 3,
    },
    {
      name: t.landing.domains.road.name,
      category: 'Road Damage',
      desc: t.landing.domains.road.desc,
      icon: AlertTriangle,
      color: 'amber',
      activeCount: metrics?.categoryBreakdown?.['Road Damage'] || 2,
    },
    {
      name: t.landing.domains.water.name,
      category: 'Water',
      desc: t.landing.domains.water.desc,
      icon: Droplets,
      color: 'cyan',
      activeCount: metrics?.categoryBreakdown?.Water || 2,
    },
    {
      name: t.landing.domains.drainage.name,
      category: 'Drainage',
      desc: t.landing.domains.drainage.desc,
      icon: Waves,
      color: 'blue',
      activeCount: metrics?.categoryBreakdown?.Drainage || 2,
    },
    {
      name: t.landing.domains.energy.name,
      category: 'Energy',
      desc: t.landing.domains.energy.desc,
      icon: Zap,
      color: 'purple',
      activeCount: metrics?.categoryBreakdown?.Energy || 2,
    },
    {
      name: t.landing.domains.safety.name,
      category: 'Public Safety',
      desc: t.landing.domains.safety.desc,
      icon: ShieldAlert,
      color: 'rose',
      activeCount: metrics?.categoryBreakdown?.['Public Safety'] || 2,
    },
  ];

  const proposalSections = [
    {
      id: 'overview',
      num: '01',
      title: 'Solution Overview',
      desc: 'Integrated 6-stage civic lifecycle transforming citizen intake into verified municipal work orders.',
      icon: BookOpen,
      color: 'emerald',
    },
    {
      id: 'features',
      num: '02',
      title: 'Key Features',
      desc: 'Multimodal vision parsing, 0-100 scoring, Haversine 450m clustering, and dispatcher consoles.',
      icon: CheckCircle2,
      color: 'sky',
    },
    {
      id: 'innovation',
      num: '03',
      title: 'Innovation & Relevance',
      desc: 'Shifts cities from raw ticket backlogs to proactive spatial intelligence and root-cause synthesis.',
      icon: Sparkles,
      color: 'amber',
    },
    {
      id: 'architecture',
      num: '04',
      title: 'System Architecture',
      desc: 'Multi-tier design separating React/Vite SPA, Node.js AI orchestrator, and PostgreSQL/PostGIS.',
      icon: Layers,
      color: 'purple',
    },
    {
      id: 'dataflow',
      num: '05',
      title: 'End-to-End Data Flow',
      desc: 'Detailed 5-step payload lifecycle from camera capture to GIS broadcast and dispatcher SLAs.',
      icon: Workflow,
      color: 'teal',
    },
    {
      id: 'tech_stack',
      num: '06',
      title: 'Technology Justification',
      desc: 'Engineered rationale for Gemini 2.5 Flash, React 18, Leaflet GIS, and PostGIS geodetics.',
      icon: Cpu,
      color: 'indigo',
    },
    {
      id: 'ai_security',
      num: '07',
      title: 'AI Models & Security',
      desc: 'Server-side API key proxying, EXIF telemetry scrubbing, PII shielding, and human sign-off.',
      icon: ShieldCheck,
      color: 'rose',
    },
  ];

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Tagline / Competition badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-400">{t.brand.pilotBadge}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{t.brand.syntheticDataNotice}</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            {t.landing.heroH1Part1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              {t.landing.heroH1Gradient}
            </span>{' '}
            {t.landing.heroH1Part2}
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.landing.heroDesc}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('/report')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 group cursor-pointer"
            >
              <span>{t.common.reportIssue}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/dashboard')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t.common.exploreIntelligence}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </button>

            {onOpenTechnicalDossier && (
              <button
                onClick={() => onOpenTechnicalDossier('story')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 font-bold text-sm border border-emerald-700/80 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{t.nav.proposalShort}</span>
              </button>
            )}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {t.landing.pillMultimodal}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              {t.landing.pillPostgis}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              {t.landing.pillPredictive}
            </span>
          </div>
        </div>

        {/* Live Metrics preview bar */}
        <div className="mt-14 max-w-5xl mx-auto p-4 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80">
            <div className="text-center p-2">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t.landing.metricsHealth}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {metrics?.healthScore || 82}
                <span className="text-xs font-normal text-zinc-400 ml-1">/ 100</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">{t.landing.metricsHealthSub}</div>
            </div>

            <div className="text-center p-2">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t.landing.metricsCritical}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 mt-1">
                {metrics?.criticalCount || 8}
              </div>
              <div className="text-[11px] text-rose-400/80 mt-0.5">{t.landing.metricsCriticalSub}</div>
            </div>

            <div className="text-center p-2">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t.landing.metricsHigh}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 mt-1">
                {metrics?.highPriorityCount || 17}
              </div>
              <div className="text-[11px] text-amber-400/80 mt-0.5">{t.landing.metricsHighSub}</div>
            </div>

            <div className="text-center p-2">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t.landing.metricsActive}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-400 mt-1">
                {metrics?.activeReportsCount || 51}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">{t.landing.metricsActiveSub}</div>
            </div>

            <div className="text-center p-2 col-span-2 sm:col-span-1">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t.landing.metricsResolved}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {metrics?.resolvedCount || 24}
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">{t.landing.metricsResolvedSub}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PROPOSAL STORY & OFFICIAL TECHNICAL SOLUTION SPECIFICATION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Subtle glow badge */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Award className="w-64 h-64 text-emerald-400" />
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-xs font-mono font-bold text-emerald-300">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              {t.landing.proposalTag}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 leading-tight">
              {t.landing.proposalHeading}
            </h2>
            <p className="text-base sm:text-lg text-emerald-300 font-medium italic leading-relaxed border-l-2 border-emerald-500 pl-4 py-1">
              {t.landing.proposalQuote}
            </p>
          </div>

          {/* Official 7 Proposal Technical Solution Matrix */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                {t.landing.proposalMatrixTitle}
              </span>
              {onOpenTechnicalDossier && (
                <button
                  onClick={() => onOpenTechnicalDossier('story')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{t.landing.proposalFullDossier}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {proposalSections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.id}
                    onClick={() => onOpenTechnicalDossier?.(sec.id)}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/90 hover:border-emerald-500/60 hover:bg-zinc-900 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                          SPEC {sec.num}
                        </span>
                        <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-xs font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                        {sec.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {sec.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                      <span>{t.common.inspectEvidence}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}

              {/* Database & Architecture Quick Card */}
              <div
                onClick={onOpenDbModal}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/60 hover:bg-zinc-900 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-950 text-sky-400 border border-sky-900">
                      SCHEMA DDL
                    </span>
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sky-400 group-hover:scale-110 transition-transform">
                      <Database className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-zinc-100 group-hover:text-sky-300 transition-colors">
                    PostgreSQL / PostGIS Schema
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Production DDL script defining tables, spatial indexes, RBAC, and municipal audit logs.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-sky-400">
                  <span>{t.common.viewDdlSql}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VÉQALUNE Unified Ecosystem Suite Showcase */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            {t.landing.suiteTag}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100">
            {t.landing.suiteHeading}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {t.landing.suiteDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. VÉQALUNE CIVIC */}
          <div
            onClick={() => onNavigate('/')}
            className="p-6 rounded-2xl bg-zinc-900/70 border border-emerald-900/40 hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  CORE HUB
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  VÉQALUNE CIVIC
                </h3>
                <p className="text-xs text-emerald-400/90 font-medium">{t.nav.civicSub}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The central municipal operating platform unifying citizen telemetry, spatial analytics, multi-factor prioritization, and field crew workflows.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>{t.common.exploreIntelligence}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. VÉQALUNE AI */}
          <div
            onClick={() => onNavigate('/report')}
            className="p-6 rounded-2xl bg-zinc-900/70 border border-sky-900/40 hover:border-sky-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-sky-950/60 border border-sky-800 text-sky-400 group-hover:scale-105 transition-transform">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/80">
                  REASONING
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-sky-300 transition-colors">
                  VÉQALUNE AI
                </h3>
                <p className="text-xs text-sky-400/90 font-medium">{t.nav.aiSub}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Gemini vision & reasoning model extracting physical hazard taxonomy, validating citizen imagery, and calculating the transparent 0–100 score.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-sky-400">
              <span>{t.nav.launchAi}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. VÉQALUNE MAP */}
          <div
            onClick={() => onNavigate('/map')}
            className="p-6 rounded-2xl bg-zinc-900/70 border border-purple-900/40 hover:border-purple-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-400 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/80">
                  SPATIAL GIS
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-purple-300 transition-colors">
                  VÉQALUNE MAP
                </h3>
                <p className="text-xs text-purple-400/90 font-medium">{t.nav.mapSub}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                PostGIS-ready interactive geospatial cartography plotting incidents, severity contours, and autonomous 450m proximity cluster zones.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-purple-400">
              <span>{t.common.viewOnMap}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. VÉQALUNE COMMAND */}
          <div
            onClick={() => onNavigate('/dashboard')}
            className="p-6 rounded-2xl bg-zinc-900/70 border border-amber-900/40 hover:border-amber-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-400 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80">
                  OPERATIONS
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  VÉQALUNE COMMAND
                </h3>
                <p className="text-xs text-amber-400/90 font-medium">{t.nav.commandSub}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Municipal operations dashboard managing prioritized response queues, field work orders, SLA resolution timers, and community health.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>{t.landing.commandCta1}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. VÉQALUNE INSIGHT */}
          <div
            onClick={() => onNavigate('/reports')}
            className="p-6 rounded-2xl bg-zinc-900/70 border border-teal-900/40 hover:border-teal-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-800 text-teal-400 group-hover:scale-105 transition-transform">
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/80">
                  PATTERNS
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-teal-300 transition-colors">
                  VÉQALUNE INSIGHT
                </h3>
                <p className="text-xs text-teal-400/90 font-medium">{t.nav.insightSub}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pattern recognition correlation matrix identifying chronic municipal friction zones and proposing long-term systemic fixes.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-teal-400">
              <span>{t.tablePage.heading}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. VÉQALUNE PREDICT */}
          <div
            onClick={() => onNavigate('/insights')}
            className="p-6 rounded-2xl bg-zinc-900/70 border border-indigo-900/40 hover:border-indigo-500/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800 text-indigo-400 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                  SIMULATION
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                  VÉQALUNE PREDICT
                </h3>
                <p className="text-xs text-indigo-400/90 font-medium">{t.nav.predictSub}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Forward predictive modeling simulating monsoon rainfall stress, storm runoff, and structural collapse vectors before failures occur.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>{t.landing.commandCta2}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Core Workflow Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {t.landing.workflowTag}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100">
            {t.landing.workflowHeading}
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {t.landing.workflowDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((ws) => {
            const Icon = ws.icon;
            return (
              <div
                key={ws.step}
                className="relative p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-400 px-2 py-1 rounded bg-zinc-950 border border-zinc-800">
                      STAGE {ws.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-100 mb-0.5">
                    {ws.title}
                  </h3>
                  <div className="text-xs font-medium text-emerald-400/90 mb-2.5">
                    {ws.subtitle}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {ws.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Decision Engine v1.0</span>
                  <span className="text-emerald-400">Verified Flow →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6 Core Focus Categories Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              {t.landing.domainsTag}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
              {t.landing.domainsHeading}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              {t.landing.domainsDesc}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/map')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>{t.common.viewAllOnMap}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {focusCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate('/map')}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400">
                    {cat.activeCount} {t.nav.activeIncidents}
                  </span>
                </div>
                <h3 className="font-bold text-zinc-100 text-sm group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Command Center Preview & AI Insights Callout */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12 relative overflow-hidden">
          {/* Glow backdrop */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-xs font-mono text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                {t.landing.commandTag}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 leading-snug">
                {t.landing.commandHeading}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {t.landing.commandDesc}
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.landing.commandFeature1}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.landing.commandFeature2}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.landing.commandFeature3}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/50 cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4" />
                  {t.landing.commandCta1}
                </button>
                <button
                  onClick={() => onNavigate('/insights')}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  {t.landing.commandCta2}
                </button>
              </div>
            </div>

            {/* Visual AI Hotspot Simulation Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  <span className="text-xs font-bold text-zinc-200">{t.landing.hotspotDetectedBadge}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Sector 4 Canal Corridor (Colombo Pilot)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Cluster Category:</span>
                  <span className="text-emerald-400 font-bold font-mono">{t.categories.Waste} (6 Reports)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Radius Density:</span>
                  <span className="text-zinc-200 font-mono">380m Buffer Zone</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">{t.common.priorityScore}:</span>
                  <span className="text-rose-400 font-mono font-bold">88 / 100</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.landing.hotspotAiSynthesis}
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  {t.landing.hotspotAiQuote}
                </p>
              </div>

              <button
                onClick={() => onNavigate('/map')}
                className="w-full py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {t.landing.inspectClusterMap}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/50 border border-zinc-800 max-w-3xl mx-auto space-y-5">
          <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-100">
            {t.landing.bottomHeading}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            {t.landing.bottomDesc}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('/report')}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
            >
              {t.landing.bottomCtaAnalyze}
            </button>
            {onOpenTechnicalDossier && (
              <button
                onClick={() => onOpenTechnicalDossier('story')}
                className="px-6 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-semibold text-xs border border-emerald-700 transition-all cursor-pointer"
              >
                {t.common.proposalStory}
              </button>
            )}
            <button
              onClick={onOpenDbModal}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition-all cursor-pointer"
            >
              {t.common.viewDataModel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
