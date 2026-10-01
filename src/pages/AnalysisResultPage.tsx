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
  ChevronRight,
} from 'lucide-react';
import {
  AnalysisRequestPayload,
  AnalysisResponseData,
  Report,
  HotspotCluster,
  SeverityLevel,
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
  const [isRateLimit, setIsRateLimit] = useState(false);
  const [manualSeverity, setManualSeverity] = useState<SeverityLevel>('MODERATE');

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

        // Check for rate limit error
        if (err.message === 'AI_RATE_LIMIT') {
          setIsRateLimit(true);
          setError('AI service temporarily unavailable due to rate limits. Please use manual mode.');
        } else {
          setError(err.message || 'Failed to complete AI analysis');
        }
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
          <div className="absolute inset-0 rounded-full glass-card"></div>
          <div className="w-20 h-20 rounded-full bg-white border-4 border-emerald-100 border-t-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg animate-spin" style={{ animationDuration: '3s' }}>
            <Sparkles className="w-8 h-8 animate-pulse text-emerald-400" style={{ animationDuration: '1s' }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-slate-200/60 text-xs font-mono text-emerald-600 shadow-sm">
            <Radio className="w-3 h-3 animate-pulse text-emerald-500" />
            VÉQALUNE Reasoning Engine Active
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {t.analysis.evaluatingTelemetry}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t.analysis.processingEvidence}
          </p>
        </div>

        {/* Staged checklist */}
        <div className="max-w-md mx-auto p-5 rounded-2xl glass-card space-y-3 text-left shadow-sm">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all ${
                  isDone
                    ? 'text-emerald-600 font-medium'
                    : isCurrent
                    ? 'text-slate-800 font-bold scale-[1.02]'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                      : isCurrent
                      ? 'bg-emerald-500 text-white font-bold animate-pulse shadow-sm shadow-emerald-200'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
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
    // Rate limit fallback: manual mode
    if (isRateLimit) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl glass-card border border-amber-200 flex items-center justify-center mx-auto text-amber-500 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">AI Service Temporarily Unavailable</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The AI analysis engine has reached rate limits. You can manually classify this incident to proceed.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Manual Classification</h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Select Severity Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as SeverityLevel[]).map((sev) => {
                  const style = getSeverityBadgeColor(sev);
                  return (
                    <button
                      key={sev}
                      onClick={() => setManualSeverity(sev)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        manualSeverity === sev
                          ? `${style.bg} ${style.text} ${style.border} shadow-md scale-105`
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{formatSeverity(sev)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  // Create manual analysis result
                  const severityWeight = manualSeverity === 'CRITICAL' ? 25 : manualSeverity === 'HIGH' ? 20 : manualSeverity === 'MODERATE' ? 15 : 10;
                  const environmentalWeight = manualSeverity === 'CRITICAL' ? 20 : manualSeverity === 'HIGH' ? 15 : manualSeverity === 'MODERATE' ? 10 : 5;
                  const publicSafetyWeight = manualSeverity === 'CRITICAL' ? 20 : manualSeverity === 'HIGH' ? 15 : manualSeverity === 'MODERATE' ? 10 : 5;
                  const locationSensitivityWeight = 5;
                  const recurrenceWeight = 5;
                  const totalScore = severityWeight + environmentalWeight + publicSafetyWeight + locationSensitivityWeight + recurrenceWeight;

                  const manualResult: AnalysisResponseData = {
                    category: analysisPayload?.category || 'Waste',
                    severity: manualSeverity,
                    environmentalRisk: manualSeverity === 'CRITICAL' ? 'HIGH' : manualSeverity === 'HIGH' ? 'MEDIUM' : 'LOW',
                    publicRisk: manualSeverity === 'CRITICAL' ? 'HIGH' : manualSeverity === 'HIGH' ? 'MEDIUM' : 'LOW',
                    priorityScore: manualSeverity === 'CRITICAL' ? 85 : manualSeverity === 'HIGH' ? 70 : manualSeverity === 'MODERATE' ? 50 : 30,
                    aiConfidence: 50,
                    aiExplanation: 'Manual classification - AI analysis unavailable due to rate limits.',
                    recommendedAction: 'Review manually and assign appropriate municipal response based on field inspection.',
                    hazardTags: ['Manual Review'],
                    detectedObjects: ['Unknown'],
                    scoringBreakdown: {
                      severityWeight,
                      environmentalWeight,
                      publicSafetyWeight,
                      locationSensitivityWeight,
                      recurrenceWeight,
                      totalScore,
                    },
                    estimatedResolutionTime: manualSeverity === 'CRITICAL' ? '24-48 hours' : manualSeverity === 'HIGH' ? '3-5 days' : manualSeverity === 'MODERATE' ? '1-2 weeks' : '2-4 weeks',
                    decisionSupportNote: 'This report was manually classified due to AI service unavailability. Field inspection recommended to verify severity and determine appropriate municipal response.',
                  };
                  setAnalysisResult(manualResult);
                  setIsRateLimit(false);
                  setError(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-400 cursor-pointer shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Continue with Manual Classification
              </button>
              <button
                onClick={() => onNavigate('/report')}
                className="px-6 py-3 rounded-xl glass-card text-slate-700 text-sm font-semibold hover:bg-white cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Regular error state
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl glass-card border border-rose-200 flex items-center justify-center mx-auto text-rose-500 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Analysis Incomplete</h2>
        <p className="text-xs text-slate-500">{error || 'Unknown error during analysis.'}</p>
        <button
          onClick={() => onNavigate('/report')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-400 cursor-pointer shadow-md shadow-emerald-500/20 transition-all"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-emerald-200/60 text-xs font-mono text-emerald-600 mb-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {t.analysis.pipelineComplete}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {t.analysis.heading}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Geotagged to: <span className="text-slate-800 font-medium">{analysisPayload.locationLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/report')}
            className="px-4 py-2 rounded-xl glass-card hover:bg-white text-slate-700 text-xs font-semibold cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            {t.analysis.newAnalysis}
          </button>
        </div>
      </div>

      {/* Primary Intelligence Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category & Confidence */}
        <div className="p-5 rounded-3xl glass-card space-y-3 relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.tablePage.colCategory}
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} shadow-sm group-hover:scale-110 transition-transform`}>
              <CategoryIcon category={analysisResult.category} size={22} />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800 leading-tight">{formatCategory(analysisResult.category)}</div>
              <div className="text-[11px] font-mono text-emerald-600 mt-0.5 font-medium">
                {analysisResult.aiConfidence}% {t.analysis.confidence}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Score 0-100 Gauge */}
        <div className="p-5 rounded-3xl glass-card flex flex-col justify-between relative overflow-hidden group">
          <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
            analysisResult.priorityScore >= 85 ? 'via-rose-300/60' : analysisResult.priorityScore >= 70 ? 'via-amber-300/60' : 'via-emerald-300/60'
          } to-transparent`} />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.common.priorityScore}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-4xl font-extrabold font-mono tracking-tighter group-hover:scale-105 transition-transform ${
                analysisResult.priorityScore >= 85
                  ? 'text-rose-500'
                  : analysisResult.priorityScore >= 70
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}
            >
              {analysisResult.priorityScore}
            </span>
            <span className="text-xs text-slate-400 font-mono font-medium">/ 100</span>
          </div>
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mt-3 shadow-inner">
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
        <div className="p-5 rounded-3xl glass-card space-y-2 relative overflow-hidden">
          <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
            analysisResult.severity === 'CRITICAL' ? 'via-rose-300/60' : analysisResult.severity === 'HIGH' ? 'via-amber-300/60' : 'via-emerald-300/60'
          } to-transparent`} />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.tablePage.colSeverity}
          </div>
          <div className="pt-1">
            <span
              className={`inline-block text-xs px-3 py-1 rounded-lg border font-bold shadow-sm ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}
            >
              {formatSeverity(analysisResult.severity)}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 mt-2">
            Est. Resolution: <strong className="text-slate-800 font-mono block mt-0.5">{analysisResult.estimatedResolutionTime}</strong>
          </div>
        </div>

        {/* Risk Classification */}
        <div className="p-5 rounded-3xl glass-card space-y-2.5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.analysis.riskClass}
          </div>
          <div className="flex items-center justify-between bg-white/50 p-2 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 flex items-center gap-1.5 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              {t.analysis.envRisk}:
            </span>
            <span className="font-bold text-slate-800 font-mono text-xs">
              {analysisResult.environmentalRisk}
            </span>
          </div>
          <div className="flex items-center justify-between bg-white/50 p-2 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 flex items-center gap-1.5 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              {t.analysis.pubRisk}:
            </span>
            <span className="font-bold text-slate-800 font-mono text-xs">
              {analysisResult.publicRisk}
            </span>
          </div>
        </div>
      </div>

      {/* Visual & Detailed Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Col: Image / Visual Evidence */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-3xl overflow-hidden glass-card relative p-1.5">
            {analysisPayload.imageUrl || analysisPayload.imageBase64 ? (
              <img
                src={analysisPayload.imageUrl || analysisPayload.imageBase64}
                alt="Reported Issue"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover rounded-2xl shadow-sm"
              />
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center text-slate-500 text-xs bg-slate-50 rounded-2xl">
                <CategoryIcon category={analysisResult.category} size={48} className="mb-3 text-slate-300" />
                No photograph provided
              </div>
            )}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg glass-pill text-[10px] font-mono font-semibold text-slate-700 shadow-sm border border-slate-200/60">
              Visual Evidence Analyzed
            </div>
          </div>

          {/* Detected Objects / Tags */}
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.analysis.detectedTaxonomy}
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisResult.detectedObjects.map((obj, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-mono shadow-sm"
                >
                  {obj}
                </span>
              ))}
              {analysisResult.hazardTags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold shadow-sm"
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
          <div className="p-6 rounded-3xl glass-card space-y-3 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
              {t.analysis.explanationTitle}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-white/50 p-4 rounded-2xl border border-slate-200/60">
              {analysisResult.aiExplanation}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-6 rounded-3xl bg-emerald-50/80 border border-emerald-200/60 space-y-3 relative overflow-hidden shadow-sm backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-white border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              {t.analysis.recommendedActionTitle}
            </div>
            <p className="text-sm text-emerald-900 font-medium leading-relaxed bg-white/60 p-4 rounded-2xl border border-emerald-200/60">
              {analysisResult.recommendedAction}
            </p>
          </div>

          {/* Priority Engine Factors Breakdown */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-200/60">
              <span>Decision-Support Score Model</span>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Total: {analysisResult.priorityScore}/100
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:-translate-y-0.5 transition-transform">
                <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Severity</div>
                <div className="font-extrabold font-mono text-slate-800 text-sm">
                  {analysisResult.scoringBreakdown.severityWeight}<span className="text-[10px] text-slate-400 font-normal">/30</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:-translate-y-0.5 transition-transform">
                <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Env. Risk</div>
                <div className="font-extrabold font-mono text-slate-800 text-sm">
                  {analysisResult.scoringBreakdown.environmentalWeight}<span className="text-[10px] text-slate-400 font-normal">/25</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:-translate-y-0.5 transition-transform">
                <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Pub. Risk</div>
                <div className="font-extrabold font-mono text-slate-800 text-sm">
                  {analysisResult.scoringBreakdown.publicSafetyWeight}<span className="text-[10px] text-slate-400 font-normal">/25</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:-translate-y-0.5 transition-transform">
                <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Location</div>
                <div className="font-extrabold font-mono text-slate-800 text-sm">
                  {analysisResult.scoringBreakdown.locationSensitivityWeight}<span className="text-[10px] text-slate-400 font-normal">/10</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:-translate-y-0.5 transition-transform">
                <div className="text-slate-500 text-[10px] font-semibold mb-1 uppercase">Repeat</div>
                <div className="font-extrabold font-mono text-slate-800 text-sm">
                  {analysisResult.scoringBreakdown.recurrenceWeight}<span className="text-[10px] text-slate-400 font-normal">/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Hotspot Discovery & Cluster Update Banner */}
      {saveMetadata?.matchedHotspot && (
        <div
          className={`p-6 rounded-3xl border transition-all ${
            saveMetadata.isNewHotspotFormed
              ? 'bg-gradient-to-r from-rose-50 via-white to-rose-50/80 border-rose-300 shadow-xl shadow-rose-200/50'
              : 'bg-amber-50/80 border-amber-200 shadow-md backdrop-blur-sm'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold ${
                saveMetadata.isNewHotspotFormed ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-amber-100 border-amber-300 text-amber-700'
              }`}>
                <Flame className={`w-4 h-4 ${saveMetadata.isNewHotspotFormed ? 'text-rose-500' : 'text-amber-500'}`} />
                {saveMetadata.isNewHotspotFormed
                  ? '🔥 RECURRING HOTSPOT DETECTED'
                  : '📍 SPATIAL CLUSTER LINKED'}
              </div>
              <h4 className="text-base font-extrabold text-slate-900 flex flex-wrap items-center gap-2">
                {saveMetadata.matchedHotspot.name}
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200 shadow-sm">
                  {saveMetadata.matchedHotspot.reportCount} Incidents Clustered (Radius: {saveMetadata.matchedHotspot.radiusMeters}m)
                </span>
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed max-w-2xl bg-white/50 p-3 rounded-xl border border-white/60">
                {saveMetadata.matchedHotspot.insightText}
              </p>
              <div className="text-xs font-mono text-slate-600 pt-1 flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200">Cat: <strong className="text-emerald-600">{formatCategory(saveMetadata.matchedHotspot.dominantCategory)}</strong></span>
                <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200">Risk: <strong className="text-rose-500">{saveMetadata.matchedHotspot.riskScore}/100</strong></span>
              </div>
            </div>

            <div className="shrink-0 mt-2 sm:mt-0">
              <button
                onClick={() => onNavigate('/map')}
                className={`px-5 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer w-full sm:w-auto ${
                  saveMetadata.isNewHotspotFormed
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 shadow-rose-200'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Inspect Hotspot
              </button>
            </div>
          </div>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span className="font-medium">{saveError}</span>
        </div>
      )}

      {/* Confirmation & Action Dispatch Footer */}
      <div className="p-6 rounded-3xl glass-card flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        <div>
          <div className="text-sm font-extrabold text-slate-900 mb-1">
            {savedReport ? 'Incident Stored in Municipal Queue' : 'Submit Intelligence to Operational Queue'}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {savedReport
              ? `Assigned Tracking ID: ${savedReport.id}`
              : 'Adds this prioritized incident to the live district command map and dispatcher table.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {savedReport ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm transition-all cursor-pointer text-center"
              >
                {t.analysis.commandCenter}
              </button>
              <button
                onClick={() => onNavigate('/map')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                {t.analysis.viewLiveMap}
              </button>
            </div>
          ) : (
            <button
              onClick={handleSaveToCommandCenter}
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
            >
              <Send className="w-4 h-4" />
              <span>{isSaving ? 'Storing in Database...' : t.analysis.saveToQueue}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
