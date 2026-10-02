import {
  AnalysisRequestPayload,
  AnalysisResponseData,
  CommunityMetrics,
  HotspotCluster,
  PredictiveScenario,
  Report,
  ReportStatus,
  SystemHealth,
} from '../types';

const LOCAL_DEMO_REPORTS_KEY = 'veqalune-demo-reports-v1';

function usesVercelStaticApi(): boolean {
  return typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');
}

function readLocalDemoReports(): Report[] {
  if (typeof window === 'undefined') return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(LOCAL_DEMO_REPORTS_KEY) || '[]');
    return Array.isArray(value) ? value as Report[] : [];
  } catch {
    return [];
  }
}

function writeLocalDemoReports(reports: Report[]): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_DEMO_REPORTS_KEY, JSON.stringify(reports));
  }
}

function saveReportLocally(reportData: Partial<Report>): {
  report: Report;
  message: string;
  hotspots: HotspotCluster[];
  matchedHotspot: null;
  isNewHotspotFormed: false;
  isHotspotExpanded: false;
} {
  const category = reportData.category || 'Other';
  const report: Report = {
    id: `DEMO-${Date.now()}`,
    title: reportData.title || `${category} civic issue`,
    description: reportData.description || '',
    category,
    latitude: reportData.latitude ?? 6.9271,
    longitude: reportData.longitude ?? 79.8612,
    location_label: reportData.location_label || 'Colombo Pilot Community',
    image_url: reportData.image_url?.startsWith('data:') ? undefined : reportData.image_url,
    severity: reportData.severity || 'MODERATE',
    environmental_risk: reportData.environmental_risk || 'MEDIUM',
    public_risk: reportData.public_risk || 'MEDIUM',
    priority_score: reportData.priority_score ?? 55,
    ai_confidence: reportData.ai_confidence ?? 88,
    ai_analysis: reportData.ai_analysis || 'Analyzed by the VÉQALUNE browser demo engine.',
    recommended_action: reportData.recommended_action || 'Assign a field inspection.',
    hazard_tags: reportData.hazard_tags || ['Community Report'],
    detected_objects: reportData.detected_objects || [],
    scoring_breakdown: reportData.scoring_breakdown || {
      severityWeight: 14,
      environmentalWeight: 11,
      publicSafetyWeight: 11,
      locationSensitivityWeight: 10,
      recurrenceWeight: 3,
      totalScore: reportData.priority_score ?? 49,
    },
    status: reportData.status || 'Action Recommended',
    created_at: new Date().toISOString(),
    estimated_resolution_time: reportData.estimated_resolution_time || '24-48 Hours',
    reporter_type: reportData.reporter_type || 'Citizen',
    is_demo: true,
  };
  const reports = readLocalDemoReports();
  writeLocalDemoReports([report, ...reports]);
  return {
    report,
    message: 'Saved in this browser demo. Connect a database for shared, persistent reporting.',
    hotspots: [],
    matchedHotspot: null,
    isNewHotspotFormed: false,
    isHotspotExpanded: false,
  };
}

function analyzeLocally(payload: AnalysisRequestPayload): AnalysisResponseData {
  const description = (payload.description || '').toLowerCase();
  let category = payload.category || 'Other';
  let severity: AnalysisResponseData['severity'] = 'MODERATE';
  let environmentalRisk: AnalysisResponseData['environmentalRisk'] = 'MEDIUM';
  let publicRisk: AnalysisResponseData['publicRisk'] = 'MEDIUM';
  let aiExplanation = 'This civic report requires field verification to assess its precise cause and impact.';
  let recommendedAction = 'Assign a field inspector to verify the issue and determine the appropriate municipal response.';
  let hazardTags = ['Community Report', 'Field Inspection'];
  let detectedObjects = ['reported civic issue'];
  let estimatedResolutionTime = '24-48 Hours';

  if (category === 'Waste' || /dump|trash|garbage|rubbish|debris/.test(description)) {
    category = 'Waste'; severity = 'HIGH'; environmentalRisk = 'HIGH'; publicRisk = 'MEDIUM';
    aiExplanation = 'Accumulated waste can obstruct public access and contaminate nearby soil or stormwater. Arrange an inspection and prompt removal.';
    recommendedAction = 'Dispatch a waste collection crew and check nearby locations for recurring dumping.';
    hazardTags = ['Waste Accumulation', 'Sanitation', 'Environmental Risk'];
    detectedObjects = ['mixed debris', 'packaging', 'waste containers'];
    estimatedResolutionTime = '12-24 Hours';
  } else if (category === 'Road Damage' || /pothole|crack|asphalt|road surface|crosswalk/.test(description)) {
    category = 'Road Damage'; severity = 'HIGH'; environmentalRisk = 'LOW'; publicRisk = 'HIGH';
    aiExplanation = 'Road surface damage can create hazards for drivers, cyclists, and pedestrians, and may worsen if water enters the damaged area.';
    recommendedAction = 'Place temporary warning markers and schedule a road-surface repair inspection.';
    hazardTags = ['Pavement Hazard', 'Traffic Safety', 'Surface Failure'];
    detectedObjects = ['damaged road surface', 'pothole or crack', 'road markings'];
    estimatedResolutionTime = '8-12 Hours';
  } else if (category === 'Water' || /leak|burst pipe|water main/.test(description)) {
    category = 'Water'; severity = 'HIGH'; environmentalRisk = 'HIGH'; publicRisk = 'MEDIUM';
    aiExplanation = 'A water leak can waste potable water and weaken the supporting ground. Inspect the affected utility segment promptly.';
    recommendedAction = 'Dispatch a water utility crew to isolate the supply and locate the leak.';
    hazardTags = ['Water Leak', 'Utility Risk', 'Erosion Risk'];
    detectedObjects = ['standing water', 'pipe or water main'];
    estimatedResolutionTime = '6-12 Hours';
  } else if (category === 'Drainage' || /drain|flood|culvert|clog/.test(description)) {
    category = 'Drainage'; severity = 'HIGH'; environmentalRisk = 'HIGH'; publicRisk = 'HIGH';
    aiExplanation = 'Blocked drainage infrastructure can restrict stormwater flow and raise localized flood risk. Clear it before heavy rainfall.';
    recommendedAction = 'Dispatch a drainage crew to inspect and clear the intake, culvert, and nearby screens.';
    hazardTags = ['Storm Drainage', 'Flood Risk', 'Blockage'];
    detectedObjects = ['drain grate', 'sediment', 'debris'];
    estimatedResolutionTime = '6 Hours';
  } else if (category === 'Energy' || /street.?light|lighting|power outage/.test(description)) {
    category = 'Energy'; severity = 'MODERATE'; environmentalRisk = 'LOW'; publicRisk = 'HIGH';
    aiExplanation = 'A public lighting outage can reduce visibility and increase risks for people using the affected route after dark.';
    recommendedAction = 'Schedule an electrical maintenance technician to inspect and restore the lighting fixture.';
    hazardTags = ['Lighting Outage', 'Pedestrian Safety', 'Electrical Maintenance'];
    detectedObjects = ['street light', 'darkened walkway'];
    estimatedResolutionTime = '48 Hours';
  } else if (category === 'Public Safety') {
    severity = 'HIGH'; environmentalRisk = 'MEDIUM'; publicRisk = 'HIGH';
    aiExplanation = 'The reported public safety issue may expose pedestrians or nearby residents to harm. Verify the site and secure any immediate hazard.';
    recommendedAction = 'Dispatch a field inspector and establish a temporary safety perimeter if the hazard is confirmed.';
    hazardTags = ['Public Safety', 'Field Inspection', 'Hazard Verification'];
    detectedObjects = ['reported hazard', 'public infrastructure'];
    estimatedResolutionTime = '4-24 Hours';
  }

  const severityWeight = { LOW: 6, MODERATE: 14, HIGH: 22, CRITICAL: 30 }[severity];
  const riskWeight = { LOW: 4, MEDIUM: 11, HIGH: 18, CRITICAL: 25 };
  const scoringBreakdown = {
    severityWeight,
    environmentalWeight: riskWeight[environmentalRisk],
    publicSafetyWeight: riskWeight[publicRisk],
    locationSensitivityWeight: 10,
    recurrenceWeight: 3,
    totalScore: severityWeight + riskWeight[environmentalRisk] + riskWeight[publicRisk] + 13,
  };

  return {
    category,
    aiConfidence: 88,
    severity,
    environmentalRisk,
    publicRisk,
    priorityScore: scoringBreakdown.totalScore,
    scoringBreakdown,
    aiExplanation,
    recommendedAction,
    hazardTags,
    detectedObjects,
    estimatedResolutionTime,
    decisionSupportNote: 'VÉQALUNE demo analysis is advisory. Municipal staff should verify reports in the field.',
  };
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Failed to fetch system health');
  return await res.json();
}

export async function fetchReports(filters?: {
  category?: string;
  severity?: string;
  status?: string;
  search?: string;
}): Promise<Report[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.severity) params.append('severity', filters.severity);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  const staticApi = usesVercelStaticApi();
  const query = params.toString();
  const endpoint = staticApi
    ? '/api/reports.json'
    : `/api/reports${query ? `?${query}` : ''}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Failed to fetch reports');
  const data = await res.json();
    const reports: Report[] = staticApi
      ? [...readLocalDemoReports(), ...(data.reports || [])]
      : data.reports || [];
    if (!staticApi) return reports;

  return reports.filter((report) =>
    (!filters?.category || filters.category === 'ALL' || report.category === filters.category) &&
    (!filters?.severity || filters.severity === 'ALL' || report.severity === filters.severity) &&
    (!filters?.status || filters.status === 'ALL' || report.status === filters.status) &&
    (!filters?.search || [report.title, report.description, report.location_label, report.id, ...report.hazard_tags]
      .some((value) => value.toLowerCase().includes(filters.search!.toLowerCase())))
  );
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
    let res: Response;
    try {
      res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (usesVercelStaticApi()) return analyzeLocally(payload);
      throw error;
    }

  if (!res.ok) {
      if (usesVercelStaticApi()) return analyzeLocally(payload);
    const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
    const errorMessage = err.error || 'Failed to analyze report with AI';

    // Check for rate limit or quota errors
    if (errorMessage.toLowerCase().includes('resource_exhausted') ||
        errorMessage.toLowerCase().includes('quota') ||
        errorMessage.toLowerCase().includes('rate limit') ||
        res.status === 429) {
      throw new Error('AI_RATE_LIMIT');
    }

    throw new Error(errorMessage);
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
    let res: Response;
    try {
      res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
    } catch (error) {
      if (!usesVercelStaticApi()) throw error;
      return saveReportLocally(reportData);
    }

  if (!res.ok) {
      if (usesVercelStaticApi()) return saveReportLocally(reportData);
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
  let res: Response;
  try {
    res = await fetch(`/api/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    if (!usesVercelStaticApi()) throw error;
    return updateReportStatusLocally(reportId, status);
  }

  if (!res.ok) {
    if (usesVercelStaticApi()) return updateReportStatusLocally(reportId, status);
    throw new Error('Failed to update status');
  }

  return await res.json();
}

async function updateReportStatusLocally(reportId: string, status: ReportStatus): Promise<{ report: Report; message: string }> {
  const reports = readLocalDemoReports();
  let reportIndex = reports.findIndex((report) => report.id === reportId);
  if (reportIndex < 0) {
    const response = await fetch('/api/reports.json');
    if (!response.ok) throw new Error('Failed to load demo reports');
    const data = await response.json();
    const existingReport = (data.reports as Report[]).find((report) => report.id === reportId);
    if (!existingReport) throw new Error('Report not found.');
    reports.unshift(existingReport);
    reportIndex = 0;
  }
  const report = { ...reports[reportIndex], status, updated_at: new Date().toISOString() };
  reports[reportIndex] = report;
  writeLocalDemoReports(reports);
  return { report, message: 'Status updated in this browser demo.' };
}

export async function fetchCommunityInsights(): Promise<{
  metrics: CommunityMetrics;
  hotspots: HotspotCluster[];
  predictiveScenarios: PredictiveScenario[];
  topAiInsight: string;
}> {
  const endpoint = usesVercelStaticApi() ? '/api/insights.json' : '/api/insights';
  const res = await fetch(endpoint);
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
