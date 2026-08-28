import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Shield,
  MapPin,
  Send,
  Radio,
} from 'lucide-react';
import {
  AnalysisRequestPayload,
  AnalysisResponseData,
  Report,
  HotspotCluster,
} from '../types';
import { submitReportForAnalysis, saveAnalyzedReport } from '../services/api';
import { CategoryIcon, getCategoryBadgeStyle } from '../components/CategoryIcon';
import { getSeverityBadgeColor } from '../utils/scoringEngine';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  analysisPayload: AnalysisRequestPayload | null;
  onNavigate: (path: string) => void;
  onReportSaved: (newReport: Report) => void;
}

const STAGES = [
  'Analyzing visual taxonomy & evidence...',
  'Understanding physical issue context...',
  'Assessing environmental & public risk vectors...',
  'Calculating 0–100 transparent priority score...',
  'Checking spatial proximity & similar reports...',
  'Generating municipal decision-support recommendation...',
];

export const AnalysisResultPage: React.FC<Props> = ({
  analysisPayload,
  onNavigate,
  onReportSaved,
}) => {
  const { t, formatCategory, formatSeverity } = useLanguage();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReport, setSavedReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!analysisPayload) {
      onNavigate('/report');
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setCurrentStageIndex(0);

    // Staged realistic progress ticker
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    // Trigger API call
    submitReportForAnalysis(analysisPayload)
      .then((data) => {
        if (!isMounted) return;
        setTimeout(() => {
          clearInterval(stageInterval);
          setAnalysisResult(data);
          setIsLoading(false);
        }, 1800);
      })
      .catch((err) => {
        if (!isMounted) return;
        clearInterval(stageInterval);
        console.error('Analysis error:', err);
        setError(err.message || 'Failed to complete AI analysis');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      clearInterval(stageInterval);
    };
  }, [analysisPayload]);

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMetadata, setSaveMetadata] = useState<{
    isNewHotspotFormed?: boolean;
    isHotspotExpanded?: boolean;
    matchedHotspot?: HotspotCluster | null;
    message?: string;
  } | null>(null);

  const handleSaveToCommandCenter = async () => {
    if (!analysisResult || !analysisPayload || isSaving || savedReport) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const reportToSave: Partial<Report> = {
        title: `${analysisResult.category}: ${analysisPayload.locationLabel || 'Civic Incident'}`,
        description: analysisPayload.description,
        category: analysisResult.category,
        image_url: analysisPayload.imageUrl || analysisPayload.imageBase64,
        latitude: analysisPayload.latitude || 6.9271,
        longitude: analysisPayload.longitude || 79.8612,
        location_label: analysisPayload.locationLabel || 'Sector 4 Canal Corridor, Colombo Pilot',
        severity: analysisResult.severity,
        environmental_risk: analysisResult.environmentalRisk,
        public_risk: analysisResult.publicRisk,
        priority_score: analysisResult.priorityScore,
        ai_confidence: analysisResult.aiConfidence,
        ai_analysis: analysisResult.aiExplanation,
        recommended_action: analysisResult.recommendedAction,
        hazard_tags: analysisResult.hazardTags,
        detected_objects: analysisResult.detectedObjects,
        scoring_breakdown: analysisResult.scoringBreakdown,
        estimated_resolution_time: analysisResult.estimatedResolutionTime,
        status: 'Action Recommended',
      };

      const res = await saveAnalyzedReport(reportToSave);
      setSavedReport(res.report);
      setSaveMetadata({
        isNewHotspotFormed: res.isNewHotspotFormed,
        isHotspotExpanded: res.isHotspotExpanded,
        matchedHotspot: res.matchedHotspot,
        message: res.message,
      });
      onReportSaved(res.report);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save incident report');
    } finally {
      setIsSaving(false);
    }
  };

  if (!analysisPayload) return null;

  // Staged Loading State
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 radar-ping"></div>
          <div className="w-20 h-20 rounded-full bg-zinc-900 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-2xl">
            <Sparkles className="w-9 h-9 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400">
            <Radio className="w-3 h-3 animate-spin" />
            VÉQALUNE Reasoning Engine Active
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-100">
            {t.analysis.evaluatingTelemetry}
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            {t.analysis.processingEvidence}
          </p>
        </div>

        {/* Staged checklist */}
        <div className="max-w-md mx-auto p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 text-left">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all ${
                  isDone
                    ? 'text-emerald-400 font-medium'
                    : isCurrent
                    ? 'text-zinc-100 font-bold scale-[1.02]'
                    : 'text-zinc-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isCurrent
                      ? 'bg-emerald-500 text-zinc-950 font-bold animate-pulse'
                      : 'bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span>{stage}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (error || !analysisResult) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Analysis Incomplete</h2>
        <p className="text-xs text-zinc-400">{error || 'Unknown error during analysis.'}</p>
        <button
          onClick={() => onNavigate('/report')}
          className="px-5 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
        >
          Return to Report Form
        </button>
      </div>
    );
  }

  const categoryStyle = getCategoryBadgeStyle(analysisResult.category);
  const severityStyle = getSeverityBadgeColor(analysisResult.severity);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-xs font-mono text-emerald-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.analysis.pipelineComplete}
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100">
            {t.analysis.heading}
          </h1>
          <p className="text-xs text-zinc-400">
            Geotagged to: <span className="text-zinc-200 font-medium">{analysisPayload.locationLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/report')}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 cursor-pointer"
          >
            {t.analysis.newAnalysis}
          </button>
        </div>
      </div>

      {/* Primary Intelligence Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category & Confidence */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t.tablePage.colCategory}
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
              <CategoryIcon category={analysisResult.category} size={20} />
            </div>
            <div>
              <div className="font-bold text-sm text-zinc-100">{formatCategory(analysisResult.category)}</div>
              <div className="text-[11px] font-mono text-emerald-400">
                {analysisResult.aiConfidence}% {t.analysis.confidence}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Score 0-100 Gauge */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t.common.priorityScore}
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono ${
                analysisResult.priorityScore >= 85
                  ? 'text-rose-400'
                  : analysisResult.priorityScore >= 70
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {analysisResult.priorityScore}
            </span>
            <span className="text-xs text-zinc-400 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                analysisResult.priorityScore >= 85
                  ? 'bg-rose-500'
                  : analysisResult.priorityScore >= 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${analysisResult.priorityScore}%` }}
            ></div>
          </div>
        </div>

        {/* Severity */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t.tablePage.colSeverity}
          </div>
          <div className="pt-1">
            <span
              className={`inline-block text-xs px-2.5 py-1 rounded-full border font-bold ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}
            >
              {formatSeverity(analysisResult.severity)}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400 pt-1">
            Est. Resolution: <strong className="text-zinc-200 font-mono">{analysisResult.estimatedResolutionTime}</strong>
          </div>
        </div>

        {/* Risk Classification */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1.5">
          <div className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">
            {t.analysis.riskClass}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-emerald-400" />
              {t.analysis.envRisk}:
            </span>
            <span className="font-bold text-zinc-200 font-mono">
              {analysisResult.environmentalRisk}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-sky-400" />
              {t.analysis.pubRisk}:
            </span>
            <span className="font-bold text-zinc-200 font-mono">
              {analysisResult.publicRisk}
            </span>
          </div>
        </div>
      </div>

      {/* Visual & Detailed Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Col: Image / Visual Evidence */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative">
            {analysisPayload.imageUrl || analysisPayload.imageBase64 ? (
              <img
                src={analysisPayload.imageUrl || analysisPayload.imageBase64}
                alt="Reported Issue"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-400 text-xs">
                <CategoryIcon category={analysisResult.category} size={40} className="mb-2 text-zinc-600" />
                No photograph provided
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-zinc-300">
              Visual Evidence Analyzed
            </div>
          </div>

          {/* Detected Objects / Tags */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t.analysis.detectedTaxonomy}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysisResult.detectedObjects.map((obj, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 font-mono"
                >
                  {obj}
                </span>
              ))}
              {analysisResult.hazardTags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: AI Explanation & Recommended Action */}
        <div className="md:col-span-7 space-y-4">
          {/* AI Explanation Box */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              {t.analysis.explanationTitle}
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              {analysisResult.aiExplanation}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {t.analysis.recommendedActionTitle}
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed">
              {analysisResult.recommendedAction}
            </p>
          </div>

          {/* Priority Engine Factors Breakdown */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Decision-Support Score Model</span>
              <span className="font-mono text-emerald-400">
                Total: {analysisResult.priorityScore}/100
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-400 text-[10px]">Severity</div>
                <div className="font-bold font-mono text-zinc-200">
                  {analysisResult.scoringBreakdown.severityWeight}/30
                </div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-400 text-[10px]">Env. Risk</div>
                <div className="font-bold font-mono text-zinc-200">
                  {analysisResult.scoringBreakdown.environmentalWeight}/25
                </div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-400 text-[10px]">Public Risk</div>
                <div className="font-bold font-mono text-zinc-200">
                  {analysisResult.scoringBreakdown.publicSafetyWeight}/25
                </div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-400 text-[10px]">Location</div>
                <div className="font-bold font-mono text-zinc-200">
                  {analysisResult.scoringBreakdown.locationSensitivityWeight}/10
                </div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-400 text-[10px]">Recurrence</div>
                <div className="font-bold font-mono text-zinc-200">
                  {analysisResult.scoringBreakdown.recurrenceWeight}/10
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Hotspot Discovery & Cluster Update Banner */}
      {saveMetadata?.matchedHotspot && (
        <div
          className={`p-5 rounded-2xl border transition-all ${
            saveMetadata.isNewHotspotFormed
              ? 'bg-gradient-to-r from-rose-950/80 via-zinc-900 to-rose-950/40 border-rose-600 shadow-xl shadow-rose-950/50 animate-pulse'
              : 'bg-zinc-900/90 border-amber-800/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-700 text-xs font-mono font-bold text-rose-300">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                {saveMetadata.isNewHotspotFormed
                  ? '🔥 RECURRING HOTSPOT DETECTED'
                  : '📍 SPATIAL CLUSTER LINKED'}
              </div>
              <h4 className="text-sm font-extrabold text-zinc-100 flex items-center gap-2">
                {saveMetadata.matchedHotspot.name}
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800">
                  {saveMetadata.matchedHotspot.reportCount} Incidents Clustered (Radius: {saveMetadata.matchedHotspot.radiusMeters}m)
                </span>
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                {saveMetadata.matchedHotspot.insightText}
              </p>
              <div className="text-[11px] font-mono text-zinc-400 pt-1 flex items-center gap-3">
                <span>Dominant Category: <strong className="text-emerald-400">{formatCategory(saveMetadata.matchedHotspot.dominantCategory)}</strong></span>
                <span>•</span>
                <span>Calculated Risk: <strong className="text-rose-400">{saveMetadata.matchedHotspot.riskScore}/100</strong></span>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => onNavigate('/map')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                Inspect Hotspot Buffer on Map
              </button>
            </div>
          </div>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Confirmation & Action Dispatch Footer */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-zinc-200">
            {savedReport ? 'Incident Stored in Municipal Queue' : 'Submit Intelligence to Operational Queue'}
          </div>
          <p className="text-xs text-zinc-400">
            {savedReport
              ? `Assigned Tracking ID: ${savedReport.id}`
              : 'Adds this prioritized incident to the live district command map and dispatcher table.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {savedReport ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('/map')}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                {t.analysis.viewLiveMap}
              </button>
              <button
                onClick={() => onNavigate('/dashboard')}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition-all cursor-pointer"
              >
                {t.analysis.commandCenter}
              </button>
            </div>
          ) : (
            <button
              onClick={handleSaveToCommandCenter}
              disabled={isSaving}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Storing in Intelligence Database...' : t.analysis.saveToQueue}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
