import {
  AnalysisRequestPayload,
  AnalysisResponseData,
  CommunityMetrics,
  HotspotCluster,
  PredictiveScenario,
  Report,
  ReportStatus,
} from '../types';

export async function fetchReports(filters?: {
  category?: string;
  severity?: string;
  status?: string;
  search?: string;
}): Promise<Report[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`/api/reports?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    const data = await res.json();
    return data.reports || [];
  } catch (error) {
    console.error('Error fetching reports from server:', error);
    return [];
  }
}

export async function fetchHotspots(): Promise<HotspotCluster[]> {
  try {
    const data = await fetchCommunityInsights();
    return data.hotspots || [];
  } catch {
    return [];
  }
}

export async function fetchPredictiveScenarios(): Promise<PredictiveScenario[]> {
  try {
    const data = await fetchCommunityInsights();
    return data.predictiveScenarios || [];
  } catch {
    return [];
  }
}

export async function fetchCommunityMetrics(): Promise<CommunityMetrics | null> {
  try {
    const data = await fetchCommunityInsights();
    return data.metrics || null;
  } catch {
    return null;
  }
}

export async function generateAIInsights(districtContext?: string): Promise<{ insightsText: string }> {
  try {
    const res = await generateLiveAIInsight();
    const formatted = `${res.insight.executiveSummary}\n\n• Spatial Hotspots: ${res.insight.spatialHotspotInsight}\n\n• Strategic Actions:\n${res.insight.strategicInterventions.map(s => '  - ' + s).join('\n')}\n\n• Proactive Forecast: ${res.insight.predictiveOpportunity}`;
    return { insightsText: formatted };
  } catch (err: any) {
    throw new Error(err.message || 'Failed to generate AI insights');
  }
}

export async function submitReportForAnalysis(
  payload: AnalysisRequestPayload
): Promise<AnalysisResponseData> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(err.error || 'Failed to analyze report with AI');
  }

  return await res.json();
}

export async function saveAnalyzedReport(
  reportData: Partial<Report>
): Promise<{
  report: Report;
  message: string;
  hotspots?: HotspotCluster[];
  matchedHotspot?: HotspotCluster | null;
  isNewHotspotFormed?: boolean;
  isHotspotExpanded?: boolean;
}> {
  const res = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to save report' }));
    throw new Error(err.error || 'Failed to save report');
  }

  return await res.json();
}

export async function triggerDynamicHotspotScan(distanceThresholdMeters: number = 450): Promise<{
  status: string;
  scanSummary: {
    totalReportsScanned: number;
    clustersDiscovered: number;
    recurringHotspots: number;
    emergingClusters: number;
    distanceThresholdMeters: number;
    executionTimeMs: number;
  };
  hotspots: HotspotCluster[];
}> {
  const res = await fetch('/api/hotspots/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ distanceThreshold: distanceThresholdMeters }),
  });

  if (!res.ok) {
    throw new Error('Failed to run geospatial hotspot scan');
  }

  return await res.json();
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus
): Promise<{ report: Report; message: string }> {
  const res = await fetch(`/api/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error('Failed to update status');
  }

  return await res.json();
}

export async function fetchCommunityInsights(): Promise<{
  metrics: CommunityMetrics;
  hotspots: HotspotCluster[];
  predictiveScenarios: PredictiveScenario[];
  topAiInsight: string;
}> {
  const res = await fetch('/api/insights');
  if (!res.ok) throw new Error('Failed to fetch insights');
  return await res.json();
}

export async function generateLiveAIInsight(): Promise<{
  insight: {
    executiveSummary: string;
    spatialHotspotInsight: string;
    strategicInterventions: string[];
    predictiveOpportunity: string;
  };
  generatedAt: string;
  source: string;
}> {
  const res = await fetch('/api/generate-insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('Failed to generate insights');
  return await res.json();
}
