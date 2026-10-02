import { mkdir, writeFile } from 'node:fs/promises';
import { INITIAL_SAMPLE_REPORTS, PREDICTIVE_SCENARIOS, SAMPLE_HOTSPOTS } from '../src/data/sampleReports';
import { ReportCategory } from '../src/types';

const categories: ReportCategory[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety', 'Other'];
const reports = [...INITIAL_SAMPLE_REPORTS].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
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
const insights = {
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
};

await mkdir('public/api', { recursive: true });
await Promise.all([
  writeFile('public/api/reports.json', JSON.stringify({ reports, total: reports.length })),
  writeFile('public/api/insights.json', JSON.stringify(insights)),
]);
console.log(`Generated Vercel demo API snapshots (${reports.length} reports).`);
