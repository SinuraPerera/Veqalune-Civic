import { INITIAL_SAMPLE_REPORTS, PREDICTIVE_SCENARIOS, SAMPLE_HOTSPOTS } from '../src/data/sampleReports';
import { ReportCategory } from '../src/types';

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(data: unknown): void;
}

const categories: ReportCategory[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety', 'Other'];

export default function handler(request: ApiRequest, response: ApiResponse): void {
  if ((request.method || 'GET').toUpperCase() !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const reports = INITIAL_SAMPLE_REPORTS;
  const hotspots = SAMPLE_HOTSPOTS;
  const totalReports = reports.length;
  const criticalCount = reports.filter((report) => report.severity === 'CRITICAL' && report.status !== 'Resolved').length;
  const highPriorityCount = reports.filter((report) => report.severity === 'HIGH' && report.status !== 'Resolved').length;
  const resolvedCount = reports.filter((report) => report.status === 'Resolved').length;
  const activeReportsCount = reports.filter((report) => report.status !== 'Resolved').length;
  const categoryBreakdown = Object.fromEntries(categories.map((category) => [
    category,
    reports.filter((report) => report.category === category).length,
  ])) as Record<ReportCategory, number>;
  const priorityDistribution = {
    critical: reports.filter((report) => report.priority_score >= 85).length,
    high: reports.filter((report) => report.priority_score >= 70 && report.priority_score < 85).length,
    moderate: reports.filter((report) => report.priority_score >= 50 && report.priority_score < 70).length,
    low: reports.filter((report) => report.priority_score < 50).length,
  };
  const healthScore = Math.max(30, Math.min(98, Math.round(100 - criticalCount * 3.5 - highPriorityCount * 1.5 - activeReportsCount * 0.2 + resolvedCount * 0.5)));
  const topHotspot = hotspots[0];

  response.status(200).json({
    metrics: {
      healthScore,
      criticalCount,
      highPriorityCount,
      activeReportsCount,
      resolvedCount,
      totalReports,
      categoryBreakdown,
      priorityDistribution,
      hotspots,
    },
    hotspots,
    predictiveScenarios: PREDICTIVE_SCENARIOS,
    topAiInsight: topHotspot
      ? `${topHotspot.reportCount} similar ${topHotspot.dominantCategory.toLowerCase()} reports cluster around ${topHotspot.name}.`
      : 'No active spatial hotspots were identified.',
  });
}
