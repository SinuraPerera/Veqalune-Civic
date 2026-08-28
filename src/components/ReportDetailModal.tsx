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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
            >
              <CategoryIcon category={report.category} size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-400 font-semibold">
                  {report.id}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}
                >
                  {formatSeverity(report.severity)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  {formatStatus(report.status)}
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-100 mt-0.5 line-clamp-1">
                {report.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-zinc-950/30">
          {/* Top Info Banner: Priority Score & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority Score Card */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t.common.priorityScore}
              </div>
              <div className="flex items-baseline gap-2 my-1">
                <span
                  className={`text-4xl font-extrabold font-mono ${
                    report.priority_score >= 85
                      ? 'text-rose-400'
                      : report.priority_score >= 70
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {report.priority_score}
                </span>
                <span className="text-xs text-zinc-400 font-mono">/ 100</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
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
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t.analysis.riskClass}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  {t.analysis.envRisk}:
                </span>
                <span className="font-bold text-zinc-200 font-mono">
                  {report.environmental_risk}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  {t.analysis.pubRisk}:
                </span>
                <span className="font-bold text-zinc-200 font-mono">
                  {report.public_risk}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  {t.analysis.confidence}:
                </span>
                <span className="font-bold text-emerald-400 font-mono">
                  {report.ai_confidence}%
                </span>
              </div>
            </div>

            {/* Location & Time Card */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between text-xs">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Location & GPS
                </div>
                <p className="text-zinc-200 font-medium line-clamp-2 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  {report.location_label}
                </p>
                <p className="text-zinc-400 font-mono text-[11px]">
                  {report.latitude.toFixed(4)}° N, {Math.abs(report.longitude).toFixed(4)}° {report.longitude >= 0 ? 'E' : 'W'}
                </p>
              </div>

              {onViewOnMap && (
                <button
                  onClick={() => {
                    onClose();
                    onViewOnMap(report);
                  }}
                  className="mt-2 flex items-center justify-between text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors pt-2 border-t border-zinc-800/80 cursor-pointer"
                >
                  <span>{t.common.viewOnMap}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Image & Description Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visual Evidence */}
            {report.image_url ? (
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 relative group">
                <img
                  src={report.image_url}
                  alt={report.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-zinc-300">
                  Visual Evidence Telemetry
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 h-48 flex flex-col items-center justify-center text-zinc-400 text-xs">
                <CategoryIcon category={report.category} size={32} className="text-zinc-600 mb-2" />
                No photograph attached
              </div>
            )}

            {/* Description & Hazard Tags */}
            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Citizen Observation
                </h4>
                <p className="text-xs text-zinc-200 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80">
                  {report.description}
                </p>
              </div>

              {report.hazard_tags && report.hazard_tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Hazard Markers
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {report.hazard_tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60"
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
          <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 border border-emerald-900/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              {t.analysis.explanationTitle}
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed">
              {report.ai_analysis}
            </p>

            <div className="pt-3 border-t border-zinc-800/80">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                {t.analysis.recommendedActionTitle}
              </div>
              <p className="text-xs text-emerald-300 font-medium leading-relaxed bg-zinc-950/60 p-2.5 rounded-lg border border-emerald-900/30">
                {report.recommended_action}
              </p>
              <p className="text-[10px] text-zinc-400 mt-2 italic">
                * Decision-support output: Requires human inspection and municipal operator sign-off before operational dispatch.
              </p>
            </div>
          </div>

          {/* Scoring Factor Breakdown */}
          {report.scoring_breakdown && (
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Priority Engine Scoring Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-zinc-400 text-[10px]">Severity (30)</div>
                  <div className="font-bold font-mono text-zinc-100 text-sm">
                    {report.scoring_breakdown.severityWeight}
                  </div>
                </div>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-zinc-400 text-[10px]">Environmental (25)</div>
                  <div className="font-bold font-mono text-zinc-100 text-sm">
                    {report.scoring_breakdown.environmentalWeight}
                  </div>
                </div>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-zinc-400 text-[10px]">Public Safety (25)</div>
                  <div className="font-bold font-mono text-zinc-100 text-sm">
                    {report.scoring_breakdown.publicSafetyWeight}
                  </div>
                </div>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-zinc-400 text-[10px]">Location (10)</div>
                  <div className="font-bold font-mono text-zinc-100 text-sm">
                    {report.scoring_breakdown.locationSensitivityWeight}
                  </div>
                </div>
                <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-zinc-400 text-[10px]">Recurrence (10)</div>
                  <div className="font-bold font-mono text-zinc-100 text-sm">
                    {report.scoring_breakdown.recurrenceWeight}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Status Transition */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            Estimated Resolution Window:{' '}
            <strong className="text-zinc-200 font-mono">
              {report.estimated_resolution_time || '24-48 Hours'}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-zinc-400 mr-2">Update Status:</span>
            {(['New', 'Under Review', 'Action Recommended', 'Resolved'] as ReportStatus[]).map(
              (st) => (
                <button
                  key={st}
                  disabled={updating || report.status === st}
                  onClick={() => handleStatusClick(st)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    report.status === st
                      ? 'bg-zinc-800 text-emerald-400 border-emerald-600/50 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
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
