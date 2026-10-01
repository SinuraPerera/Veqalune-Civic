import React, { useState } from 'react';
import { Database, X, Copy, Check, Server, ShieldCheck, Code, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'architecture' | 'ai'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSchema = `-- ==========================================================
-- VÉQALUNE CIVIC — PostgreSQL / Supabase Core Schema
-- Theme 01: Smart Cities & Sustainable Communities
-- ==========================================================

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM ('citizen', 'field_inspector', 'city_operator', 'admin');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  full_name TEXT,
  role user_role DEFAULT 'citizen',
  reputation_score INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. REPORT CATEGORIES & SEVERITY
CREATE TYPE report_category AS ENUM (
  'Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety', 'Other'
);
CREATE TYPE severity_level AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');
CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE report_status AS ENUM ('New', 'Under Review', 'Action Recommended', 'Resolved');

-- 3. REPORTS ENTITY (Main Decision Support Ingestion)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tracking_code VARCHAR(32) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category report_category NOT NULL,
  image_url TEXT,
  
  -- Spatial Geometry (PostGIS Ready)
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_label TEXT NOT NULL,
  hotspot_cluster_id UUID,

  -- AI Scoring & Prioritization Weights
  severity severity_level NOT NULL DEFAULT 'MODERATE',
  environmental_risk risk_level NOT NULL DEFAULT 'MEDIUM',
  public_risk risk_level NOT NULL DEFAULT 'MEDIUM',
  priority_score INT NOT NULL CHECK (priority_score BETWEEN 0 AND 100),
  ai_confidence INT NOT NULL CHECK (ai_confidence BETWEEN 0 AND 100),
  ai_analysis TEXT,
  recommended_action TEXT,
  hazard_tags TEXT[] DEFAULT '{}',
  detected_objects TEXT[] DEFAULT '{}',
  scoring_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Operational Workflow
  status report_status NOT NULL DEFAULT 'New',
  estimated_resolution_time VARCHAR(64),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SPATIAL HOTSPOT CLUSTERS
CREATE TABLE hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  dominant_category report_category NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius_meters INT DEFAULT 400,
  active_report_count INT DEFAULT 1,
  risk_score INT DEFAULT 80,
  ai_synthesis TEXT,
  recommended_intervention TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MUNICIPAL ACTIONS & AUDIT LOGS
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id),
  action_type VARCHAR(64) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES FOR HIGH PERFORMANCE QUERYING
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_severity ON reports(severity);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_priority ON reports(priority_score DESC);
CREATE INDEX idx_reports_spatial ON reports(latitude, longitude);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white/60">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-slate-200/60 bg-white/60 backdrop-blur-md relative z-10 gap-3">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-500 shadow-sm">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex flex-wrap items-center gap-2 leading-tight">
                Data Architecture & Schema Specification
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-600 shadow-sm">
                  MVP Layer: In-Memory / Target: PostgreSQL + PostGIS
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                CodeSplash '26 School Phase MVP • Synthetic Demonstration Data (Colombo Pilot Community)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-200/60 bg-slate-100/60 backdrop-blur-sm text-sm shadow-inner overflow-x-auto p-1.5 mx-4 mt-4 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-white shadow-sm text-emerald-700 border border-emerald-200/60'
                : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            PostgreSQL DDL
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-white shadow-sm text-emerald-700 border border-emerald-200/60'
                : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-white shadow-sm text-emerald-700 border border-emerald-200/60'
                : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            AI & Decision Pipeline
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Ready-to-deploy DDL SQL script defining <code className="text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">users</code>,{' '}
                  <code className="text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">reports</code>, <code className="text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">hotspots</code>, and{' '}
                  <code className="text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">actions</code>.
                </p>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard' : 'Copy DDL'}
                </button>
              </div>
              <pre className="p-5 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto leading-relaxed shadow-sm">
                <code>{sqlSchema}</code>
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5 text-sm text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
                  <div className="flex items-center justify-between mb-3">
                    <strong className="text-emerald-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Current MVP Data Layer
                    </strong>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Demonstration
                    </span>
                  </div>
                  <ul className="text-slate-600 text-xs space-y-2 list-disc list-inside marker:text-emerald-400">
                    <li>Type-safe in-memory state store running on Express/Node.js backend.</li>
                    <li>Synthetic demonstration dataset representing the fictionalized Colombo Pilot Community.</li>
                    <li>Deterministic 0–100 priority scoring engine with instant client-side updates.</li>
                    <li>Interactive Leaflet GIS map with density clustering and buffer zones.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
                  <div className="flex items-center justify-between mb-3">
                    <strong className="text-sky-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                      Target Production Architecture
                    </strong>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                      Roadmap Spec
                    </span>
                  </div>
                  <ul className="text-slate-600 text-xs space-y-2 list-disc list-inside marker:text-sky-400">
                    <li>Cloud-hosted PostgreSQL / Supabase with Row Level Security (RLS).</li>
                    <li>PostGIS spatial extensions (ST_DWithin, ST_ClusterDBSCAN) for live GIS indexing.</li>
                    <li>Asynchronous Gemini 2.5/Flash queue processing with human validation checkpoints.</li>
                    <li>Field workforce dispatch API integrated with municipal operations centers.</li>
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-3xl glass-card">
                <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider mb-4 border-b border-slate-200/60 pb-2">
                  VÉQALUNE Ecosystem Architecture Mapping
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="glass-card rounded-xl p-3 text-slate-700 hover:bg-white/80 transition-colors">
                    <strong className="text-emerald-600 block font-bold mb-1">VÉQALUNE CIVIC</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">Main platform hub uniting citizen intake, GIS data, and multi-factor triage.</span>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-slate-700 hover:bg-white/80 transition-colors">
                    <strong className="text-sky-600 block font-bold mb-1">VÉQALUNE AI</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">Multimodal Gemini vision pipeline extracting hazard taxonomy and computing 0–100 scores.</span>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-slate-700 hover:bg-white/80 transition-colors">
                    <strong className="text-purple-600 block font-bold mb-1">VÉQALUNE MAP</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">PostGIS spatial cartography clustering reports into 380m+ density hotspots.</span>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-slate-700 hover:bg-white/80 transition-colors">
                    <strong className="text-amber-600 block font-bold mb-1">VÉQALUNE COMMAND</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">Operations dashboard prioritizing immediate SLA queues and field crew dispatches.</span>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-slate-700 hover:bg-white/80 transition-colors">
                    <strong className="text-teal-600 block font-bold mb-1">VÉQALUNE INSIGHT</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">Historical pattern correlation and systemic intervention recommendations.</span>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-slate-700 hover:bg-white/80 transition-colors">
                    <strong className="text-indigo-600 block font-bold mb-1">VÉQALUNE PREDICT</strong>
                    <span className="text-slate-500 text-[11px] leading-relaxed">Forward weather stress testing, storm basin surge simulation, and failure risk models.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-1 uppercase tracking-wider">
                    Data Privacy & Responsible AI Framework
                  </h4>
                  <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside marker:text-emerald-300">
                    <li>Zero storage of PII (personal identifying information) in public intelligence views.</li>
                    <li>Images processed server-side with metadata scrubbed before storage.</li>
                    <li>All AI recommendations are explicitly marked as <em className="text-slate-600 font-semibold">decision support</em> requiring human sign-off.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-6 rounded-3xl glass-card space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <Server className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                    6-Stage VÉQALUNE Pipeline
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 font-bold mx-auto mb-2 flex items-center justify-center text-[10px]">1</div>
                    <div className="font-bold text-emerald-600 text-[11px]">SEE</div>
                    <div className="text-[10px] text-slate-500 mt-1">Vision Ingestion</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                    <div className="w-6 h-6 rounded-full bg-sky-50 text-sky-500 font-bold mx-auto mb-2 flex items-center justify-center text-[10px]">2</div>
                    <div className="font-bold text-sky-600 text-[11px]">UNDERSTAND</div>
                    <div className="text-[10px] text-slate-500 mt-1">Context & Risk</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                    <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-500 font-bold mx-auto mb-2 flex items-center justify-center text-[10px]">3</div>
                    <div className="font-bold text-amber-600 text-[11px]">PRIORITIZE</div>
                    <div className="text-[10px] text-slate-500 mt-1">0-100 Score</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                    <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-500 font-bold mx-auto mb-2 flex items-center justify-center text-[10px]">4</div>
                    <div className="font-bold text-purple-600 text-[11px]">CONNECT</div>
                    <div className="text-[10px] text-slate-500 mt-1">Spatial Cluster</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                    <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-500 font-bold mx-auto mb-2 flex items-center justify-center text-[10px]">5</div>
                    <div className="font-bold text-teal-600 text-[11px]">RECOMMEND</div>
                    <div className="text-[10px] text-slate-500 mt-1">Action Plan</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 font-bold mx-auto mb-2 flex items-center justify-center text-[10px]">6</div>
                    <div className="font-bold text-indigo-600 text-[11px]">PREDICT</div>
                    <div className="text-[10px] text-slate-500 mt-1">Forecast Risk</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200/60 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div className="font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            CodeSplash '26 Hackathon Demo Mode: <span className="text-emerald-600">Persistent in-memory store + Supabase/PostgreSQL schema ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors w-full sm:w-auto"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
