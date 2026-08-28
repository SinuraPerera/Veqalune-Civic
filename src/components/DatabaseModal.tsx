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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                Data Architecture & Schema Specification
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-800/50">
                  MVP Layer: In-Memory / Target: PostgreSQL + PostGIS
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                CodeSplash '26 School Phase MVP • Synthetic Demonstration Data (Colombo Pilot Community)
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

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-zinc-800/60 bg-zinc-900/90 text-sm">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            PostgreSQL DDL Schema
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            AI & Decision Pipeline
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-zinc-950/40">
          {activeTab === 'schema' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-400">
                  Ready-to-deploy DDL SQL script defining <code className="text-emerald-400">users</code>,{' '}
                  <code className="text-emerald-400">reports</code>, <code className="text-emerald-400">hotspots</code>, and{' '}
                  <code className="text-emerald-400">actions</code>.
                </p>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard' : 'Copy DDL'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                <code>{sqlSchema}</code>
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-sm text-zinc-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
                      Current MVP Data Layer
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Active Demonstration
                    </span>
                  </div>
                  <ul className="text-zinc-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Type-safe in-memory state store running on Express/Node.js backend.</li>
                    <li>Synthetic demonstration dataset representing the fictionalized Colombo Pilot Community.</li>
                    <li>Deterministic 0–100 priority scoring engine with instant client-side updates.</li>
                    <li>Interactive Leaflet GIS map with density clustering and buffer zones.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-sky-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-sky-400 font-bold uppercase tracking-wider text-xs">
                      Target Production Architecture
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      Roadmap Spec
                    </span>
                  </div>
                  <ul className="text-zinc-300 text-xs space-y-1.5 list-disc list-inside">
                    <li>Cloud-hosted PostgreSQL / Supabase with Row Level Security (RLS).</li>
                    <li>PostGIS spatial extensions (ST_DWithin, ST_ClusterDBSCAN) for live GIS indexing.</li>
                    <li>Asynchronous Gemini 2.5/Flash queue processing with human validation checkpoints.</li>
                    <li>Field workforce dispatch API integrated with municipal operations centers.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider text-emerald-400">
                  VÉQALUNE Ecosystem Architecture Mapping
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <strong className="text-emerald-400 block font-bold">VÉQALUNE CIVIC</strong>
                    <span className="text-zinc-400 text-[11px]">Main platform hub uniting citizen intake, GIS data, and multi-factor triage.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <strong className="text-sky-400 block font-bold">VÉQALUNE AI</strong>
                    <span className="text-zinc-400 text-[11px]">Multimodal Gemini vision pipeline extracting hazard taxonomy and computing 0–100 scores.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <strong className="text-purple-400 block font-bold">VÉQALUNE MAP</strong>
                    <span className="text-zinc-400 text-[11px]">PostGIS spatial cartography clustering reports into 380m+ density hotspots.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <strong className="text-amber-400 block font-bold">VÉQALUNE COMMAND</strong>
                    <span className="text-zinc-400 text-[11px]">Operations dashboard prioritizing immediate SLA queues and field crew dispatches.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <strong className="text-teal-400 block font-bold">VÉQALUNE INSIGHT</strong>
                    <span className="text-zinc-400 text-[11px]">Historical pattern correlation and systemic intervention recommendations.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <strong className="text-indigo-400 block font-bold">VÉQALUNE PREDICT</strong>
                    <span className="text-zinc-400 text-[11px]">Forward weather stress testing, storm basin surge simulation, and failure risk models.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
                <h4 className="font-semibold text-zinc-100 text-xs mb-2 uppercase tracking-wider text-zinc-400">
                  Data Privacy & Responsible AI Framework
                </h4>
                <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                  <li>Zero storage of PII (personal identifying information) in public intelligence views.</li>
                  <li>Images processed server-side with metadata scrubbed before storage.</li>
                  <li>All AI recommendations are explicitly marked as <em>decision support</em> requiring human sign-off.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4 text-xs text-zinc-300">
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <h4 className="font-bold text-zinc-100 text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  6-Stage VÉQALUNE Pipeline
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                    <div className="font-bold text-emerald-400">SEE</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Vision Ingestion</div>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                    <div className="font-bold text-sky-400">UNDERSTAND</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Context & Risk</div>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                    <div className="font-bold text-amber-400">PRIORITIZE</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">0-100 Score</div>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                    <div className="font-bold text-purple-400">CONNECT</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Spatial Cluster</div>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                    <div className="font-bold text-teal-400">RECOMMEND</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Action Plan</div>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                    <div className="font-bold text-indigo-400">PREDICT</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Forecast Risk</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs text-zinc-400">
          <div>CodeSplash '26 Hackathon Demo Mode: Persistent in-memory store + Supabase/PostgreSQL schema ready</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
