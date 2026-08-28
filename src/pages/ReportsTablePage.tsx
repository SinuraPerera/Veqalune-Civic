import React, { useState } from 'react';
import {
  Table,
  Search,
  Download,
  Eye,
  MapPin,
} from 'lucide-react';
import { Report, ReportStatus, ReportCategory, SeverityLevel } from '../types';
import { CategoryIcon, getCategoryBadgeStyle } from '../components/CategoryIcon';
import { getSeverityBadgeColor, getStatusBadgeColor } from '../utils/scoringEngine';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onStatusChange: (reportId: string, status: ReportStatus) => void;
  onNavigate: (path: string) => void;
}

export const ReportsTablePage: React.FC<Props> = ({
  reports,
  onSelectReport,
  onStatusChange,
}) => {
  const { t, formatCategory, formatSeverity, formatStatus } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'priority_score' | 'created_at'>('priority_score');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtered and sorted reports
  const filteredReports = reports
    .filter((r) => {
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
      if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          r.title.toLowerCase().includes(q) ||
          r.location_label.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'priority_score') {
        return sortAsc
          ? a.priority_score - b.priority_score
          : b.priority_score - a.priority_score;
      } else {
        return sortAsc
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'veqalune_civic_reports.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Category', 'Title', 'Location', 'Severity', 'PriorityScore', 'AIConfidence', 'Status', 'CreatedAt'];
    const rows = reports.map(r => [
      r.id,
      r.category,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.location_label.replace(/"/g, '""')}"`,
      r.severity,
      r.priority_score,
      r.ai_confidence,
      r.status,
      r.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'veqalune_civic_reports.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const categories: ReportCategory[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety'];
  const severities: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];
  const statuses: ReportStatus[] = ['New', 'Under Review', 'Action Recommended', 'Resolved'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-zinc-900 border border-zinc-800 text-teal-400">
              <Table className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
              {t.nav.civic}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            {t.tablePage.heading}
          </h1>
          <p className="text-xs text-zinc-400">
            {t.tablePage.subheading}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.tablePage.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{formatCategory(c)}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Severities</option>
              {severities.map((s) => (
                <option key={s} value={s}>{formatSeverity(s)}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>{formatStatus(st)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs text-zinc-400">
          <div>
            Showing <strong className="text-zinc-200 font-mono">{filteredReports.length}</strong> of{' '}
            <strong className="text-zinc-200 font-mono">{reports.length}</strong> {t.mapPage.incidentsCount}
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <button
              onClick={() => {
                if (sortField === 'priority_score') setSortAsc(!sortAsc);
                else {
                  setSortField('priority_score');
                  setSortAsc(false);
                }
              }}
              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-colors cursor-pointer ${
                sortField === 'priority_score'
                  ? 'bg-zinc-800 text-emerald-400 border-zinc-700'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              {t.tablePage.colScore} {sortField === 'priority_score' ? (sortAsc ? '▲' : '▼') : ''}
            </button>
            <button
              onClick={() => {
                if (sortField === 'created_at') setSortAsc(!sortAsc);
                else {
                  setSortField('created_at');
                  setSortAsc(false);
                }
              }}
              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-colors cursor-pointer ${
                sortField === 'created_at'
                  ? 'bg-zinc-800 text-emerald-400 border-zinc-700'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              {t.tablePage.colDate} {sortField === 'created_at' ? (sortAsc ? '▲' : '▼') : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase font-mono text-zinc-400">
              <tr>
                <th className="px-4 py-3.5">{t.tablePage.colId} / {t.tablePage.colCategory}</th>
                <th className="px-4 py-3.5">{t.tablePage.colTitle} / {t.tablePage.colLocation}</th>
                <th className="px-4 py-3.5">{t.tablePage.colScore}</th>
                <th className="px-4 py-3.5">{t.tablePage.colSeverity}</th>
                <th className="px-4 py-3.5">{t.tablePage.colStatus}</th>
                <th className="px-4 py-3.5">AI Confidence</th>
                <th className="px-4 py-3.5 text-right">{t.tablePage.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    {t.mapPage.noReportsFound}
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const catStyle = getCategoryBadgeStyle(report.category);
                  const sevStyle = getSeverityBadgeColor(report.severity);
                  const staStyle = getStatusBadgeColor(report.status);

                  return (
                    <tr
                      key={report.id}
                      onClick={() => onSelectReport(report)}
                      className="hover:bg-zinc-900/80 transition-colors cursor-pointer group"
                    >
                      {/* ID & Category */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-[11px] text-zinc-400">{report.id}</div>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border mt-1 ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                        >
                          <CategoryIcon category={report.category} size={11} />
                          {formatCategory(report.category)}
                        </span>
                      </td>

                      {/* Title & Location */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors truncate">
                          {report.title}
                        </div>
                        <div className="text-zinc-400 text-[11px] truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span>{report.location_label}</span>
                        </div>
                      </td>

                      {/* Priority Score */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-sm font-extrabold ${
                              report.priority_score >= 85
                                ? 'text-rose-400'
                                : report.priority_score >= 70
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {report.priority_score}
                          </span>
                          <div className="w-12 bg-zinc-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
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
                      </td>

                      {/* Severity */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block text-[11px] px-2 py-0.5 rounded-full border font-semibold ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
                        >
                          {formatSeverity(report.severity)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={report.status}
                          onChange={(e) => onStatusChange(report.id, e.target.value as ReportStatus)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium bg-zinc-950 focus:outline-none cursor-pointer ${staStyle.text} ${staStyle.border}`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st} className="bg-zinc-900 text-zinc-200">
                              {formatStatus(st)}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* AI Confidence */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-semibold text-zinc-300">
                          {report.ai_confidence}%
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectReport(report);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-zinc-950 text-zinc-300 text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{t.tablePage.colActions}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
