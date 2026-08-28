import React, { useState } from 'react';
import {
  FileText,
  X,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Database,
  Lock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sliders,
  Eye,
  BrainCircuit,
  Flame,
  Scale,
  Award,
  BookOpen,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'story' | 'overview' | 'features' | 'innovation' | 'architecture' | 'dataflow' | 'tech_stack' | 'ai_security';
}

export const TechnicalDossierModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultTab = 'story',
}) => {
  const [activeTab, setActiveTab] = useState<
    'story' | 'overview' | 'features' | 'innovation' | 'architecture' | 'dataflow' | 'tech_stack' | 'ai_security'
  >(defaultTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'story', label: 'Central Story', icon: Award },
    { id: 'overview', label: '1. Solution Overview', icon: BookOpen },
    { id: 'features', label: '2. Key Features', icon: CheckCircle2 },
    { id: 'innovation', label: '3. Innovation', icon: Sparkles },
    { id: 'architecture', label: '4. System Architecture', icon: Layers },
    { id: 'dataflow', label: '5. Data Flow', icon: Workflow },
    { id: 'tech_stack', label: '6. Tech Justification', icon: Cpu },
    { id: 'ai_security', label: '7. AI & Security', icon: ShieldCheck },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-100">
                  VÉQALUNE Technical Solution & Proposal Dossier
                </h3>
                <span className="hidden sm:inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  CodeSplash '26 Specification
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Official evidence covering Innovation, Problem Relevance (60%), Architecture, and AI Security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Scrollable Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-800 bg-zinc-900/80 text-xs overflow-x-auto scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-950/40'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-zinc-950 space-y-6 text-zinc-300 text-xs sm:text-sm">
          {/* TAB 1: CENTRAL STORY (60% Innovation + Problem Relevance) */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              {/* Highlight Hero Statement */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-zinc-900 border border-emerald-600/70 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Award className="w-48 h-48 text-emerald-400" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-xs font-mono font-bold text-emerald-300 mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  CORE PROPOSAL NARRATIVE • 60% EVALUATION PILLAR
                </div>
                <h4 className="text-lg sm:text-2xl font-black text-zinc-100 leading-snug tracking-tight max-w-3xl">
                  "VÉQALUNE does not simply collect complaints. It transforms scattered community observations into structured, transparent and spatially connected intelligence that helps people identify what needs attention first."
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed max-w-3xl">
                  In modern cities, civic reporting systems fail not from a lack of complaints, but from an overwhelming deluge of unprioritized, unstructured noise. VÉQALUNE redefines municipal interaction from reactive complaint ticketing to autonomous civic intelligence.
                </p>
              </div>

              {/* The Paradigm Shift: Traditional vs. VÉQALUNE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-400 uppercase text-xs">
                      Traditional Civic Reporting (Flawed)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      Status Quo
                    </span>
                  </div>
                  <ul className="space-y-2 text-zinc-400 text-xs list-disc list-inside">
                    <li><strong className="text-zinc-200">The "Black Hole" Inbox:</strong> Citizen reports enter an opaque queue with no transparency into why an issue is delayed or ignored.</li>
                    <li><strong className="text-zinc-200">Isolated Symptom Fixing:</strong> Municipal crews fix isolated potholes or clear dumping sites repeatedly without recognizing systemic root causes.</li>
                    <li><strong className="text-zinc-200">Arbitrary Prioritization:</strong> First-come-first-served or squeaky-wheel politics dictate resource allocation rather than verified hazard urgency.</li>
                    <li><strong className="text-zinc-200">Reactive Disaster Scrambling:</strong> Drainage blockages and road washouts are addressed only after catastrophic urban flooding occurs.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-400 uppercase text-xs">
                      VÉQALUNE Civic Intelligence (Transformative)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">
                      The Innovation
                    </span>
                  </div>
                  <ul className="space-y-2 text-zinc-300 text-xs list-disc list-inside">
                    <li><strong className="text-emerald-300">Multimodal Computer Vision:</strong> Instant AI physical hazard identification, verification, and taxonomy classification upon photo capture.</li>
                    <li><strong className="text-emerald-300">Transparent 0–100 Scoring:</strong> Verifiable, explainable multi-factor scoring (severity, environmental risk, public safety, location sensitivity).</li>
                    <li><strong className="text-emerald-300">Geospatial Cluster Discovery:</strong> Automatic Haversine 450m proximity clustering uncovers recurring nocturnal dumping or structural washouts.</li>
                    <li><strong className="text-emerald-300">Proactive Failure Simulation:</strong> Weather stress-testing and predictive risk forecasting alert municipal managers before storm impacts.</li>
                  </ul>
                </div>
              </div>

              {/* Competition Criteria Alignment */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                    How VÉQALUNE Maximizes the 60% Innovation & Problem Relevance Score
                  </h5>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <strong className="text-emerald-400 block font-bold">1. Genuine Urban Relevance</strong>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Addresses the top 6 civic friction vectors (waste, road damage, water leaks, storm drainage, lighting, and public safety) targeting tangible municipal pain points.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <strong className="text-sky-400 block font-bold">2. Novel Technical Fusion</strong>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Combines Multimodal Gemini Vision, Haversine geospatial proximity math, deterministic scoring, and forward weather simulation into a unified ecosystem.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <strong className="text-purple-400 block font-bold">3. Actionable Operational Utility</strong>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Generates structured municipal work orders, crew hazard warnings, and calculated turnaround SLAs ready for immediate field worker deployment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOLUTION OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wider text-emerald-400">
                  Section 1: Solution Overview
                </h4>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  VÉQALUNE CIVIC is an intelligent decision-support platform designed for modern sustainable cities (CodeSplash '26 Theme 01). It operates across an integrated 6-stage lifecycle that takes raw citizen input and transforms it into prioritized civic action:
                </p>
              </div>

              {/* 6 Stages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-zinc-900 border border-emerald-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-mono font-bold text-xs">STAGE 01</span>
                    <Eye className="w-4 h-4 text-emerald-400" />
                  </div>
                  <strong className="text-zinc-100 block font-bold text-xs">SEE (Ingestion)</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Citizen uploads photographic evidence with automatic geotagging, GPS coordinates, and observation notes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-sky-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sky-400 font-mono font-bold text-xs">STAGE 02</span>
                    <BrainCircuit className="w-4 h-4 text-sky-400" />
                  </div>
                  <strong className="text-zinc-100 block font-bold text-xs">UNDERSTAND (Multimodal AI)</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Gemini vision models inspect physical imagery to classify hazards, verify authenticity, and identify hazardous objects.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-amber-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-mono font-bold text-xs">STAGE 03</span>
                    <Sliders className="w-4 h-4 text-amber-400" />
                  </div>
                  <strong className="text-zinc-100 block font-bold text-xs">PRIORITIZE (0–100 Engine)</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Transparent mathematical multi-factor scoring evaluates physical severity, environmental hazards, public risk, and density.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-purple-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-mono font-bold text-xs">STAGE 04</span>
                    <MapPin className="w-4 h-4 text-purple-400" />
                  </div>
                  <strong className="text-zinc-100 block font-bold text-xs">CONNECT (Spatial Hotspots)</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Geospatial algorithms cluster incidents within 450m radii to identify chronic urban failures requiring infrastructure overhauls.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-teal-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-400 font-mono font-bold text-xs">STAGE 05</span>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  </div>
                  <strong className="text-zinc-100 block font-bold text-xs">RECOMMEND (Dispatch SLAs)</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Generates structured municipal work orders, crew equipment precautions, and calculated SLA turnaround deadlines.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-indigo-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-mono font-bold text-xs">STAGE 06</span>
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <strong className="text-zinc-100 block font-bold text-xs">PREDICT (Risk Forecasting)</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Simulates weather stress testing (heavy monsoon rain, storm runoff) to forecast drainage and pavement failures before they strike.
                  </p>
                </div>
              </div>

              {/* Target Focus Domains */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <h5 className="font-bold text-zinc-100 text-xs uppercase tracking-wider text-emerald-400">
                  Core Civic Infrastructure Focus Domains
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono">1. Illegal Waste Dumping</div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono">2. Road & Pavement Damage</div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono">3. Water Leakage & Ruptures</div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono">4. Blocked Storm Drainage</div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono">5. Broken Streetlights / Dark Zones</div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono">6. Unsafe Public Infrastructure</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEY FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wider text-emerald-400">
                  Section 2: Key System Features
                </h4>
                <p className="text-zinc-400 text-xs">
                  Comprehensive breakdown of functional capabilities implemented across the VÉQALUNE application:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <strong className="text-zinc-100 font-bold text-xs">Feature 1: Multimodal Vision Ingestion & Physical Taxonomy Extraction</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Powered by server-side Gemini multimodal models. Directly processes citizen photos or camera feeds to identify visual object tags (e.g. "concrete spalling", "asphalt depression", "microbial runoff"), categorizes them into verified civic taxonomies, and provides a calculated AI confidence score (70%–98%).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <strong className="text-zinc-100 font-bold text-xs">Feature 2: Transparent 0–100 Multi-Factor Decision Support Engine</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Replaces black-box triage with an open mathematical breakdown: <code className="text-emerald-400 font-mono">Priority = (Severity * 35%) + (Environmental Risk * 25%) + (Public Safety * 20%) + (Location Sensitivity * 10%) + (Recurrence Factor * 10%)</code>. Every score includes a detailed audit trail so operators know exactly why an incident is ranked Critical vs Moderate.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <strong className="text-zinc-100 font-bold text-xs">Feature 3: Autonomous Haversine 450m Hotspot & Cluster Discovery</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Continuously scans geographical incident coordinates. When $2+$ reports occur within 450 meters, the system dynamically calculates the geometric centroid, identifies the dominant hazard category, aggregates the cumulative cluster risk score, and auto-generates municipal mitigation briefs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <strong className="text-zinc-100 font-bold text-xs">Feature 4: Operational Dispatch & Municipal SLA Work Orders</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Provides municipal dispatchers with a real-time Command Center. Generates tailored field crew precautions (e.g. PPE required, high-voltage isolators), estimated resolution turnaround SLAs (4h for Critical, 24h for High, 72h for Moderate), and real-time status transitions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <strong className="text-zinc-100 font-bold text-xs">Feature 5: Proactive Predictive Simulation & Weather Stress-Testing</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    The <strong>VÉQALUNE PREDICT</strong> engine models urban infrastructure vulnerabilities under variable precipitation regimes (Low, Moderate, Heavy Monsoon). Simulates canal surge risks, road sub-base collapse probabilities, and pre-allocates municipal pumping crews before flash floods hit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INNOVATION */}
          {activeTab === 'innovation' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wider text-emerald-400">
                  Section 3: Innovation & Differentiators
                </h4>
                <p className="text-zinc-400 text-xs">
                  Why VÉQALUNE is fundamentally different from conventional citizen complaint portals:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <strong className="text-zinc-100 text-xs font-bold">1. From "Complaint Ticketing" to "Spatial Intelligence"</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Traditional apps treat every citizen submission as an isolated ticket. VÉQALUNE treats reports as continuous spatial-temporal sensor signals that automatically aggregate into live GIS density buffers and chronic failure zones.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-sky-950 border border-sky-800 text-sky-400">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <strong className="text-zinc-100 text-xs font-bold">2. Verifiable, Explainable Decision Support</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Instead of arbitrary triage or opaque proprietary algorithms, VÉQALUNE publishes full score breakdowns with factor weightings, allowing both citizens and city council auditors to verify fairness and operational integrity.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-950 border border-purple-800 text-purple-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <strong className="text-zinc-100 text-xs font-bold">3. Automated Root-Cause Synthesis</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Rather than sending a sanitation truck to sweep trash 10 times at the same corner, the AI synthesizes recurring patterns: *"5 similar waste dumps detected within 14 days in Sector 4; recommend nocturnal CCTV deterrent rather than isolated cleanup runs."*
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-950 border border-amber-800 text-amber-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <strong className="text-zinc-100 text-xs font-bold">4. Predictive Weather Resilience Modeling</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Shifts cities from emergency disaster recovery to proactive pre-emptive prevention by simulating severe storm impacts against current unaddressed drainage clogs and compromised pavement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wider text-emerald-400">
                  Section 4: System Architecture
                </h4>
                <p className="text-zinc-400 text-xs">
                  High-level multi-tier architecture separating presentation, intelligence processing, and spatial persistence:
                </p>
              </div>

              {/* Architecture Diagram Box */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                <pre className="text-[11px] text-emerald-400">
{`+-----------------------------------------------------------------------------------+
|                           VÉQALUNE CLIENT TIER (SPA)                              |
|  React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Leaflet GIS Engine  |
|  [Citizen Intake]  <-->  [GIS Map & Hotspots]  <-->  [Command Dashboard & Ops]    |
+------------------------------------------+----------------------------------------+
                                           |  HTTPS / JSON REST API
                                           v
+-----------------------------------------------------------------------------------+
|                        APPLICATION & INTELLIGENCE SERVER                          |
|                       Node.js + Express.js API Gateway                            |
|                                                                                   |
|  +---------------------------+   +--------------------+   +--------------------+  |
|  | Multimodal Gemini Vision  |   | Multi-Factor       |   | Dynamic Haversine  |  |
|  | Reasoning & Object Tags   |   | Scoring Algorithm  |   | Spatial Clustering |  |
|  +---------------------------+   +--------------------+   +--------------------+  |
+------------------------------------------+----------------------------------------+
                                           |  ACID / PostGIS Geometry
                                           v
+-----------------------------------------------------------------------------------+
|                           PERSISTENCE & GIS TIER                                  |
|  Current MVP: In-Memory Type-Safe Fast Store (Colombo Pilot Community Dataset)    |
|  Target Production: PostgreSQL + PostGIS (ST_DWithin, ST_ClusterDBSCAN, RLS)     |
+-----------------------------------------------------------------------------------+`}
                </pre>
              </div>

              {/* Architectural Tiers Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <strong className="text-emerald-400 font-bold block">1. Presentation Tier</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Single Page Application built on React 18, Vite, and Tailwind CSS. Renders zero-latency geospatial map overlays with custom Leaflet markers, interactive hotspot boundary buffers, and responsive dispatcher consoles.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <strong className="text-sky-400 font-bold block">2. Intelligence Tier</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Server-side Express.js orchestrator protecting Gemini API keys, executing deterministic multi-factor scoring math, and calculating pairwise Haversine proximity matrixes across active reports.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <strong className="text-purple-400 font-bold block">3. Data & Spatial Tier</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Fully specified PostgreSQL DDL schema with PostGIS spatial geometry indexes (<code className="text-zinc-300">idx_reports_spatial</code>), audit trail logging (<code className="text-zinc-300">actions</code>), and user role RBAC.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DATA FLOW */}
          {activeTab === 'dataflow' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wider text-emerald-400">
                  Section 5: End-to-End Data Flow
                </h4>
                <p className="text-zinc-400 text-xs">
                  Detailed step-by-step data pipeline showing how an image upload travels through the system:
                </p>
              </div>

              {/* Data Flow Steps */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="px-2.5 py-1 rounded bg-zinc-950 font-mono font-bold text-emerald-400 text-xs">01</div>
                  <div className="space-y-1">
                    <strong className="text-zinc-100 text-xs block">Citizen Ingestion & Geolocation Capture</strong>
                    <p className="text-zinc-400 text-xs">Citizen snaps photo or selects preset scenario. Geolocation (lat/long) and district tags are attached; EXIF privacy metadata is sanitized.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="px-2.5 py-1 rounded bg-zinc-950 font-mono font-bold text-sky-400 text-xs">02</div>
                  <div className="space-y-1">
                    <strong className="text-zinc-100 text-xs block">Server-Side Multimodal AI Reasoning</strong>
                    <p className="text-zinc-400 text-xs">Backend proxies image to Gemini 2.5 with a strict JSON schema. AI outputs hazard classification, severity rating, detected objects, and confidence score.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="px-2.5 py-1 rounded bg-zinc-950 font-mono font-bold text-amber-400 text-xs">03</div>
                  <div className="space-y-1">
                    <strong className="text-zinc-100 text-xs block">Deterministic Multi-Factor Scoring</strong>
                    <p className="text-zinc-400 text-xs">Mathematical engine computes 0–100 priority score and SLA turnaround target. Full JSON weight breakdown is appended to the report record.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="px-2.5 py-1 rounded bg-zinc-950 font-mono font-bold text-purple-400 text-xs">04</div>
                  <div className="space-y-1">
                    <strong className="text-zinc-100 text-xs block">Haversine Spatial Clustering & Hotspot Tagging</strong>
                    <p className="text-zinc-400 text-xs">Pairwise geodetic distance scan identifies if report sits within 450m of other active incidents. If cluster threshold is met, a recurring hotspot is created/updated.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="px-2.5 py-1 rounded bg-zinc-950 font-mono font-bold text-teal-400 text-xs">05</div>
                  <div className="space-y-1">
                    <strong className="text-zinc-100 text-xs block">Command Center Dispatch & Live GIS Broadcasting</strong>
                    <p className="text-zinc-400 text-xs">Report is saved into database store and pushed to dispatcher consoles, Leaflet GIS cartography, and community health metrics in real time.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: TECHNOLOGY JUSTIFICATION */}
          {activeTab === 'tech_stack' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wider text-emerald-400">
                  Section 6: Technology Stack Justification
                </h4>
                <p className="text-zinc-400 text-xs">
                  Rational engineering justification for every key library, framework, and infrastructure choice:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-400 font-bold text-xs">React 18 + Vite + TypeScript</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">Frontend Tier</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    <strong>Why chosen:</strong> Delivers instantaneous client-side UI rendering, strict end-to-end type safety between data contracts and component states, and lightweight sub-second bundling without framework bloat.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-sky-400 font-bold text-xs">Gemini 2.5 Flash / Flash Lite</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">AI / Vision</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    <strong>Why chosen:</strong> Industry-leading multimodal vision benchmarks with sub-second latency and low token inference costs. Strict JSON Schema mode guarantees deterministic data payloads for enterprise civic backends.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-purple-400 font-bold text-xs">Leaflet GIS + OpenStreetMap</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">Geospatial</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    <strong>Why chosen:</strong> Open-source, lightweight cartographic renderer that avoids heavy commercial API key quotas while rendering custom SVG animated pins, 450m density buffers, and tooltips seamlessly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-400 font-bold text-xs">PostgreSQL + PostGIS (Target Spec)</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">Database</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    <strong>Why chosen:</strong> ACID transaction safety for municipal compliance, spatial indexing (<code className="text-zinc-300">ST_DWithin</code>, <code className="text-zinc-300">ST_Centroid</code>), and Row-Level Security (RLS) ensuring strict citizen privacy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AI MODELS & SECURITY */}
          {activeTab === 'ai_security' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wider text-emerald-400">
                  Section 7: AI Models, Safety & Security Framework
                </h4>
                <p className="text-zinc-400 text-xs">
                  Rigorous privacy, security controls, and responsible AI governance embedded into VÉQALUNE:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <strong className="text-zinc-100 font-bold text-xs">1. Server-Side Secret Isolation (Zero API Key Exposure)</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    All Gemini API interactions execute exclusively inside the server-side Express backend. No API keys or tokens are ever exposed to the client browser or DevTools network tab.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    <strong className="text-zinc-100 font-bold text-xs">2. Citizen PII Protection & EXIF Sanitization</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Images uploaded by citizens are scrubbed of camera serial numbers, personal metadata, and facial telemetry before analysis. No Personally Identifiable Information (PII) is published in public GIS map pins or open dashboards.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <strong className="text-zinc-100 font-bold text-xs">3. Human-in-the-Loop Decision Support Principle</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    AI analysis is strictly designed as an operational <em>decision support system</em>. Municipal field inspectors and authorized city operators retain authority to verify, override priority scores, and confirm final resolutions with complete audit trail logging.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <strong className="text-zinc-100 font-bold text-xs">4. Hallucination-Resistant Structured Schema Enforcement</strong>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Gemini prompts utilize strict JSON schema constraints and pre-calibrated severity rubrics to ensure repeatable, deterministic categorizations and prevent speculative outputs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono">CodeSplash '26 Ready • Complete 8-Section Technical Dossier</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextTabMap: Record<string, any> = {
                  story: 'overview',
                  overview: 'features',
                  features: 'innovation',
                  innovation: 'architecture',
                  architecture: 'dataflow',
                  dataflow: 'tech_stack',
                  tech_stack: 'ai_security',
                  ai_security: 'story',
                };
                setActiveTab(nextTabMap[activeTab]);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-bold border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next Dossier Section</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
