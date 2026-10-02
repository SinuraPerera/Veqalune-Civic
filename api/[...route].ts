import { INITIAL_SAMPLE_REPORTS, PREDICTIVE_SCENARIOS } from '../src/data/sampleReports';
import { calculatePriorityScore } from '../src/utils/scoringEngine';
import { detectDynamicHotspots } from '../src/utils/hotspotDetection';
import { AnalysisRequestPayload, Report, ReportCategory, ReportStatus, RiskLevel, SeverityLevel } from '../src/types';

interface ApiRequest {
  method?: string;
  url?: string;
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(data: unknown): void;
}

// Vercel functions are stateless across cold starts; this store is demo/session
// state only. Use a persistent database for production citizen submissions.
let reportsStore: Report[] = [...INITIAL_SAMPLE_REPORTS];
const validCategories: ReportCategory[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety', 'Other'];
const validStatuses: ReportStatus[] = ['New', 'Under Review', 'Action Recommended', 'Resolved'];

function jsonError(res: ApiResponse, status: number, message: string): void {
  res.status(status).json({ error: message });
}

function readBody(body: unknown): Record<string, unknown> {
  if (body && typeof body === 'object' && !Array.isArray(body)) return body as Record<string, unknown>;
  return {};
}

function getInsights() {
  const clusterResult = detectDynamicHotspots(reportsStore);
  const hotspots = clusterResult.hotspots;
  const totalReports = reportsStore.length;
  const criticalCount = reportsStore.filter((report) => report.severity === 'CRITICAL' && report.status !== 'Resolved').length;
  const highCount = reportsStore.filter((report) => report.severity === 'HIGH' && report.status !== 'Resolved').length;
  const resolvedCount = reportsStore.filter((report) => report.status === 'Resolved').length;
  const activeCount = reportsStore.filter((report) => report.status !== 'Resolved').length;
  const healthScore = Math.max(30, Math.min(98, Math.round(100 - criticalCount * 3.5 - highCount * 1.5 - activeCount * 0.2 + resolvedCount * 0.5)));
  const categories = Object.fromEntries(validCategories.map((category) => [
    category,
    reportsStore.filter((report) => report.category === category).length,
  ])) as Record<ReportCategory, number>;
  const priorityDistribution = {
    critical: reportsStore.filter((report) => report.priority_score >= 85).length,
    high: reportsStore.filter((report) => report.priority_score >= 70 && report.priority_score < 85).length,
    moderate: reportsStore.filter((report) => report.priority_score >= 50 && report.priority_score < 70).length,
    low: reportsStore.filter((report) => report.priority_score < 50).length,
  };
  const topCluster = hotspots[0];
  return {
    metrics: {
      healthScore,
      criticalCount,
      highPriorityCount: highCount,
      activeReportsCount: activeCount,
      resolvedCount,
      totalReports,
      categoryBreakdown: categories,
      priorityDistribution,
      hotspots,
    },
    hotspots,
    predictiveScenarios: PREDICTIVE_SCENARIOS,
    topAiInsight: topCluster
      ? `${topCluster.reportCount} similar ${topCluster.dominantCategory.toLowerCase()} reports were clustered within ${topCluster.radiusMeters}m (${topCluster.name}), indicating a recurring hotspot that requires targeted municipal intervention.`
      : 'No critical spatial clusters currently active in this operational cycle.',
  };
}

function analyzeReport(payload: AnalysisRequestPayload) {
  const description = (payload.description || '').toLowerCase();
  const hintedCategory = payload.category && validCategories.includes(payload.category) ? payload.category : 'Other';
  let category = hintedCategory;
  let severity: SeverityLevel = 'MODERATE';
  let environmentalRisk: RiskLevel = 'MEDIUM';
  let publicRisk: RiskLevel = 'MEDIUM';
  let aiExplanation = 'The report describes a civic issue that requires field verification and prioritization.';
  let recommendedAction = 'Assign a field inspector to verify the issue and recommend a municipal response.';
  let hazardTags = ['Community Report', 'Field Inspection'];
  let detectedObjects = ['reported hazard'];
  let estimatedResolutionTime = '24-48 Hours';

  if (hintedCategory === 'Waste' || /dump|trash|garbage|rubbish/.test(description)) {
    category = 'Waste'; severity = 'HIGH'; environmentalRisk = 'HIGH';
    aiExplanation = 'Accumulated waste may affect public access, soil quality, or stormwater drainage. Arrange inspection and prompt removal.';
    recommendedAction = 'Dispatch a waste collection crew and inspect nearby areas for recurring dumping.';
    hazardTags = ['Sanitation', 'Waste Accumulation', 'Environmental Risk']; detectedObjects = ['mixed debris', 'packaging']; estimatedResolutionTime = '12-24 Hours';
  } else if (hintedCategory === 'Road Damage' || /pothole|crack|asphalt|road surface/.test(description)) {
    category = 'Road Damage'; severity = 'HIGH'; publicRisk = 'HIGH'; environmentalRisk = 'LOW';
    aiExplanation = 'Road surface damage may create hazards for vehicles, cyclists, and pedestrians and can worsen if water enters the damaged area.';
    recommendedAction = 'Place temporary warning markers and schedule a road-surface repair inspection.';
    hazardTags = ['Pavement Hazard', 'Traffic Safety', 'Surface Failure']; detectedObjects = ['damaged road surface', 'pothole']; estimatedResolutionTime = '8-12 Hours';
  } else if (hintedCategory === 'Drainage' || /drain|flood|culvert|clog/.test(description)) {
    category = 'Drainage'; severity = 'HIGH'; environmentalRisk = 'HIGH'; publicRisk = 'HIGH';
    aiExplanation = 'Blocked drainage infrastructure can restrict stormwater flow and raise localized flood risk. Clear and inspect it before heavy rainfall.';
    recommendedAction = 'Dispatch a drainage crew to inspect and clear the intake, culvert, and nearby screens.';
    hazardTags = ['Storm Drainage', 'Flood Risk', 'Blockage']; detectedObjects = ['drain grate', 'sediment', 'debris']; estimatedResolutionTime = '6 Hours';
  } else if (hintedCategory === 'Water' || /leak|burst pipe|water main/.test(description)) {
    category = 'Water'; severity = 'HIGH'; environmentalRisk = 'HIGH'; publicRisk = 'MEDIUM';
    aiExplanation = 'A water leak can waste potable water and weaken the supporting ground. Inspect the affected utility segment promptly.';
    recommendedAction = 'Dispatch a water utility crew to isolate the supply and locate the leak.';
    hazardTags = ['Water Leak', 'Utility Risk', 'Erosion Risk']; detectedObjects = ['standing water', 'pipe or main']; estimatedResolutionTime = '6-12 Hours';
  } else if (hintedCategory === 'Energy' || /street.?light|lighting|power outage/.test(description)) {
    category = 'Energy'; severity = 'MODERATE'; environmentalRisk = 'LOW'; publicRisk = 'HIGH';
    aiExplanation = 'A public lighting outage can reduce visibility and increase risk for people using the affected route after dark.';
    recommendedAction = 'Schedule an electrical maintenance technician to inspect and restore the lighting fixture.';
    hazardTags = ['Lighting Outage', 'Pedestrian Safety', 'Electrical Maintenance']; detectedObjects = ['street light', 'darkened walkway']; estimatedResolutionTime = '48 Hours';
  }

  const score = calculatePriorityScore({ severity, environmentalRisk, publicRisk, category, locationSensitivity: 'High' });
  return {
    category,
    aiConfidence: 88,
    severity,
    environmentalRisk,
    publicRisk,
    priorityScore: score.totalScore,
    scoringBreakdown: score,
    aiExplanation,
    recommendedAction,
    hazardTags,
    detectedObjects,
    estimatedResolutionTime,
    decisionSupportNote: 'Advisory decision-support output; authorized municipal staff should verify reports in the field.',
    modelUsed: 'VÉQALUNE deterministic serverless fallback',
  };
}

export default function handler(req: ApiRequest, res: ApiResponse): void {
  const url = new URL(req.url || '/', 'https://vercel.invalid');
  const route = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
  const method = (req.method || 'GET').toUpperCase();
  const body = readBody(req.body);

  if (route === 'health' && method === 'GET') {
    res.status(200).json({
      status: 'ok',
      service: 'VÉQALUNE CIVIC Intelligence Platform',
      version: '1.0.0',
      aiConfigured: false,
      geminiConfigured: false,
      pythonAiConfigured: false,
      reportsCount: reportsStore.length,
      dataMode: 'sample-demo',
    });
    return;
  }

  if (route === 'reports' && method === 'GET') {
    const category = url.searchParams.get('category');
    const severity = url.searchParams.get('severity');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.toLowerCase();
    const reports = reportsStore.filter((report) =>
      (!category || category === 'ALL' || report.category === category) &&
      (!severity || severity === 'ALL' || report.severity === severity) &&
      (!status || status === 'ALL' || report.status === status) &&
      (!search || [report.title, report.description, report.location_label, report.id, ...report.hazard_tags].some((value) => value.toLowerCase().includes(search)))
    ).sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at));
    res.status(200).json({ reports, total: reports.length });
    return;
  }

  if (route === 'insights' && method === 'GET') {
    res.status(200).json(getInsights());
    return;
  }

  if (route === 'hotspots' && method === 'GET') {
    const result = detectDynamicHotspots(reportsStore);
    res.status(200).json({ hotspots: result.hotspots, totalClusters: result.hotspots.length, newlyDiscoveredCount: result.newlyDiscoveredCount });
    return;
  }

  if (route === 'hotspots/scan' && method === 'POST') {
    const started = Date.now();
    const distanceThreshold = Math.max(50, Math.min(5000, Number(body.distanceThreshold) || 450));
    const result = detectDynamicHotspots(reportsStore, { distanceThresholdMeters: distanceThreshold });
    const recurring = result.hotspots.filter((hotspot) => hotspot.clusterStatus === 'recurring' || hotspot.clusterStatus === 'critical_cluster').length;
    res.status(200).json({
      status: 'success',
      scanSummary: {
        totalReportsScanned: reportsStore.length,
        clustersDiscovered: result.hotspots.length,
        recurringHotspots: recurring,
        emergingClusters: result.hotspots.length - recurring,
        distanceThresholdMeters: distanceThreshold,
        executionTimeMs: Date.now() - started,
      },
      hotspots: result.hotspots,
    });
    return;
  }

  if (route === 'analyze' && method === 'POST') {
    res.status(200).json(analyzeReport(body as unknown as AnalysisRequestPayload));
    return;
  }

  if (route === 'generate-insights' && method === 'POST') {
    const insight = getInsights();
    res.status(200).json({
      insight: {
        executiveSummary: insight.topAiInsight,
        spatialHotspotInsight: insight.hotspots[0]?.insightText || 'No active spatial hotspot is currently identified.',
        strategicInterventions: insight.hotspots.slice(0, 3).map((hotspot) => hotspot.recommendedIntervention),
        predictiveOpportunity: insight.predictiveScenarios[0]?.potentialImpact || 'Continue monitoring reports for emerging risks.',
      },
      generatedAt: new Date().toISOString(),
      source: 'VÉQALUNE serverless rules synthesis',
    });
    return;
  }

  if (route === 'reports' && method === 'POST') {
    if (typeof body.title !== 'string' || typeof body.category !== 'string' || !validCategories.includes(body.category as ReportCategory)) {
      jsonError(res, 400, 'A valid report title and category are required.');
      return;
    }
    const now = new Date().toISOString();
    const report: Report = {
      id: `REP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      title: body.title,
      description: typeof body.description === 'string' ? body.description : '',
      category: body.category as ReportCategory,
      latitude: Number(body.latitude) || 6.9271,
      longitude: Number(body.longitude) || 79.8612,
      location_label: typeof body.location_label === 'string' ? body.location_label : 'Colombo Pilot Community',
      image_url: typeof body.image_url === 'string' ? body.image_url : undefined,
      severity: (body.severity as SeverityLevel) || 'MODERATE',
      environmental_risk: (body.environmental_risk as RiskLevel) || 'MEDIUM',
      public_risk: (body.public_risk as RiskLevel) || 'MEDIUM',
      priority_score: Number(body.priority_score) || 65,
      ai_confidence: Number(body.ai_confidence) || 88,
      ai_analysis: typeof body.ai_analysis === 'string' ? body.ai_analysis : 'Analysis completed by VÉQALUNE demo service.',
      recommended_action: typeof body.recommended_action === 'string' ? body.recommended_action : 'Assign a field inspection.',
      hazard_tags: Array.isArray(body.hazard_tags) ? body.hazard_tags as string[] : ['Community Report'],
      detected_objects: Array.isArray(body.detected_objects) ? body.detected_objects as string[] : [],
      scoring_breakdown: body.scoring_breakdown as Report['scoring_breakdown'] || calculatePriorityScore({ severity: 'MODERATE', environmentalRisk: 'MEDIUM', publicRisk: 'MEDIUM', category: body.category as ReportCategory }),
      status: (body.status as ReportStatus) || 'New',
      created_at: now,
      estimated_resolution_time: typeof body.estimated_resolution_time === 'string' ? body.estimated_resolution_time : '24-48 Hours',
      reporter_type: 'Citizen',
      is_demo: false,
    };
    reportsStore = [report, ...reportsStore];
    res.status(201).json({ report, message: 'Report accepted for this serverless demo instance. Configure persistent storage for durable reports.' });
    return;
  }

  const statusMatch = route.match(/^reports\/([^/]+)\/status$/);
  if (statusMatch && method === 'PATCH') {
    const reportId = decodeURIComponent(statusMatch[1]);
    if (typeof body.status !== 'string' || !validStatuses.includes(body.status as ReportStatus)) {
      jsonError(res, 400, 'Invalid status value.');
      return;
    }
    const index = reportsStore.findIndex((report) => report.id === reportId);
    if (index < 0) {
      jsonError(res, 404, 'Report not found.');
      return;
    }
    reportsStore[index] = { ...reportsStore[index], status: body.status as ReportStatus, updated_at: new Date().toISOString() };
    res.status(200).json({ report: reportsStore[index], message: 'Status updated for this serverless demo instance.' });
    return;
  }

  jsonError(res, 404, 'API endpoint not found.');
}
