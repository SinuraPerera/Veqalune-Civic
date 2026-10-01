import React, { useState } from 'react';
import {
  X,
  MapPin,
  Flame,
  Shield,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Report, ReportStatus } from '../types';
import { CategoryIcon, getCategoryBadgeStyle } from './CategoryIcon';
import { getSeverityBadgeColor, getStatusBadgeColor } from '../utils/scoringEngine';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  report: Report | null;
  onClose: () => void;
  onStatusChange: (reportId: string, newStatus: ReportStatus) => void;
  onViewOnMap?: (report: Report) => void;
}

export const ReportDetailModal: React.FC<Props> = ({
  report,
  onClose,
  onStatusChange,
  onViewOnMap,
}) => {
  const { t, formatCategory, formatSeverity, formatStatus } = useLanguage();
  const [updating, setUpdating] = useState(false);

  if (!report) return null;

  const severityStyle = getSeverityBadgeColor(report.severity);
  const statusStyle = getStatusBadgeColor(report.status);
  const categoryStyle = getCategoryBadgeStyle(report.category);

  const handleStatusClick = async (status: ReportStatus) => {
    setUpdating(true);
    try {
      await onStatusChange(report.id, status);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white/60">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 bg-white/60 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <div
              className={`p-2.5 rounded-2xl border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} shadow-sm`}
            >
              <CategoryIcon category={report.category} size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                  {report.id}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-bold shadow-sm ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}
                >
                  {formatSeverity(report.severity)}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-bold shadow-sm ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  {formatStatus(report.status)}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1 line-clamp-1 leading-tight">
                {report.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* Top Info Banner: Priority Score & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Priority Score Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/60 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                report.priority_score >= 85 ? 'via-rose-300/60' : report.priority_score >= 70 ? 'via-amber-300/60' : 'via-emerald-300/60'
              } to-transparent`} />
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {t.common.priorityScore}
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span
                  className={`text-5xl font-extrabold font-mono tracking-tighter ${
                    report.priority_score >= 85
                      ? 'text-rose-500'
                      : report.priority_score >= 70
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }`}
                >
                  {report.priority_score}
                </span>
                <span className="text-xs text-slate-400 font-mono font-medium">/ 100</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full ${
                    report.priority_score >= 85
                      ? 'bg-rose-500'
                      : report.priority_score >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${report.priority_score}%` }}
                ></div>
              </div>
            </div>

            {/* Environmental & Public Risk */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/60 space-y-2.5 shadow-sm">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {t.analysis.riskClass}
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  {t.analysis.envRisk}:
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  {report.environmental_risk}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  {t.analysis.pubRisk}:
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  {report.public_risk}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  {t.analysis.confidence}:
                </span>
                <span className="font-bold text-emerald-500 font-mono">
                  {report.ai_confidence}%
                </span>
              </div>
            </div>

            {/* Location & Time Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/60 flex flex-col justify-between text-xs shadow-sm">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Location & GPS
                </div>
                <p className="text-slate-800 font-bold line-clamp-2 flex items-start gap-1.5 leading-snug">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {report.location_label}
                </p>
                <p className="text-slate-500 font-mono text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100 mt-2">
                  {report.latitude.toFixed(4)}° N, {Math.abs(report.longitude).toFixed(4)}° {report.longitude >= 0 ? 'E' : 'W'}
                </p>
              </div>

              {onViewOnMap && (
                <button
                  onClick={() => {
                    onClose();
                    onViewOnMap(report);
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-1 text-[11px] font-bold glass-card text-slate-700 hover:bg-white/90 transition-colors py-2 rounded-xl border border-slate-200/60 cursor-pointer"
                >
                  <span>{t.common.viewOnMap}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Image & Description Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Visual Evidence */}
            {report.image_url ? (
              <div className="rounded-2xl overflow-hidden glass-card relative p-1.5 group h-full">
                <img
                  src={report.image_url}
                  alt={report.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full min-h-48 object-cover rounded-xl"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg glass-pill text-[10px] font-mono font-semibold text-slate-700 shadow-sm border border-slate-200/60">
                  Visual Evidence Telemetry
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/60 bg-white h-48 flex flex-col items-center justify-center text-slate-500 text-xs shadow-sm">
                <CategoryIcon category={report.category} size={40} className="text-slate-300 mb-3" />
                No photograph attached
              </div>
            )}

            {/* Description & Hazard Tags */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="p-5 rounded-2xl glass-card relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Citizen Observation
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {report.hazard_tags && report.hazard_tags.length > 0 && (
                <div className="p-5 rounded-2xl glass-card">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Hazard Markers
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {report.hazard_tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-3 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-sm font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Decision Support Box */}
          <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/60 space-y-4 relative overflow-hidden shadow-sm">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-white border border-emerald-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              {t.analysis.explanationTitle}
            </div>
            <p className="text-sm text-emerald-900 leading-relaxed bg-white/60 p-4 rounded-2xl border border-emerald-200/60">
              {report.ai_analysis}
            </p>

            <div className="pt-4 mt-2 border-t border-emerald-200/60">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
                {t.analysis.recommendedActionTitle}
              </div>
              <p className="text-sm text-emerald-800 font-bold leading-relaxed">
                {report.recommended_action}
              </p>
              <p className="text-[10px] text-emerald-600/70 mt-3 font-medium">
                * Decision-support output: Requires human inspection and municipal operator sign-off before operational dispatch.
              </p>
            </div>
          </div>

          {/* Scoring Factor Breakdown */}
          {report.scoring_breakdown && (
            <div className="p-5 rounded-3xl glass-card space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200/60">
                Priority Engine Scoring Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-1">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Severity</div>
                  <div className="font-extrabold font-mono text-slate-800 text-sm">
                    {report.scoring_breakdown.severityWeight}<span className="text-[10px] text-slate-400 font-normal">/30</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Env Risk</div>
                  <div className="font-extrabold font-mono text-slate-800 text-sm">
                    {report.scoring_breakdown.environmentalWeight}<span className="text-[10px] text-slate-400 font-normal">/25</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Pub Risk</div>
                  <div className="font-extrabold font-mono text-slate-800 text-sm">
                    {report.scoring_breakdown.publicSafetyWeight}<span className="text-[10px] text-slate-400 font-normal">/25</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Location</div>
                  <div className="font-extrabold font-mono text-slate-800 text-sm">
                    {report.scoring_breakdown.locationSensitivityWeight}<span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Repeat</div>
                  <div className="font-extrabold font-mono text-slate-800 text-sm">
                    {report.scoring_breakdown.recurrenceWeight}<span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Status Transition */}
        <div className="px-6 py-5 border-t border-slate-200/60 bg-white/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
          <div className="text-[11px] text-slate-500 font-medium">
            Estimated Resolution Window:{' '}
            <strong className="text-slate-800 font-mono bg-white px-2 py-0.5 rounded border border-slate-200 ml-1">
              {report.estimated_resolution_time || '24-48 Hours'}
            </strong>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-bold uppercase text-slate-500 mr-1">Update Status:</span>
            {(['New', 'Under Review', 'Action Recommended', 'Resolved'] as ReportStatus[]).map(
              (st) => (
                <button
                  key={st}
                  disabled={updating || report.status === st}
                  onClick={() => handleStatusClick(st)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
                    report.status === st
                      ? 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-emerald-500/30'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                  }`}
                >
                  {formatStatus(st)}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
