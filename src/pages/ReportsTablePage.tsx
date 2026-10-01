import React, { useState } from 'react';
import {
  Table,
  Search,
  Download,
  Eye,
  MapPin,
  FileText,
} from 'lucide-react';
import { Report, ReportStatus, ReportCategory, SeverityLevel } from '../types';
import { CategoryIcon, getCategoryBadgeStyle } from '../components/CategoryIcon';
import { getSeverityBadgeColor, getStatusBadgeColor } from '../utils/scoringEngine';
import { useLanguage } from '../context/LanguageContext';
import { exportToCSV, exportFilteredToCSV } from '../utils/exportUtils';

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

  const handleExportAll = () => {
    exportToCSV(reports);
  };

  const handleExportFiltered = () => {
    exportFilteredToCSV(reports, {
      category: categoryFilter,
      severity: severityFilter,
      status: statusFilter,
    });
  };

  const categories: ReportCategory[] = ['Waste', 'Road Damage', 'Water', 'Drainage', 'Energy', 'Public Safety'];
  const severities: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];
  const statuses: ReportStatus[] = ['New', 'Under Review', 'Action Recommended', 'Resolved'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-teal-50 border border-teal-200 text-teal-600">
              <Table className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold text-teal-600 uppercase tracking-wider">
              {t.nav.civic}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.tablePage.heading}
          </h1>
          <p className="text-xs text-slate-500">
            {t.tablePage.subheading}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAll}
            className="px-3.5 py-2 rounded-xl bg-white/70 hover:bg-white text-slate-600 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm backdrop-blur-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export All
          </button>
          <button
            onClick={handleExportFiltered}
            className="px-3.5 py-2 rounded-xl bg-white/70 hover:bg-white text-slate-600 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm backdrop-blur-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Export Filtered
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl glass-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.tablePage.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-400"
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
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-400"
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
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-400"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>{formatStatus(st)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800 font-mono">{filteredReports.length}</strong> of{' '}
            <strong className="text-slate-800 font-mono">{reports.length}</strong> {t.mapPage.incidentsCount}
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
                  ? 'bg-slate-100 text-emerald-600 border-slate-200'
                  : 'bg-white text-slate-500 border-slate-200'
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
                  ? 'bg-slate-100 text-emerald-600 border-slate-200'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {t.tablePage.colDate} {sortField === 'created_at' ? (sortAsc ? '▲' : '▼') : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase font-mono text-slate-500">
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
            <tbody className="divide-y divide-slate-200/60">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
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
                      className="hover:bg-white/80 transition-colors cursor-pointer group"
                    >
                      {/* ID & Category */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-[11px] text-slate-400">{report.id}</div>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border mt-1 ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                        >
                          <CategoryIcon category={report.category} size={11} />
                          {formatCategory(report.category)}
                        </span>
                      </td>

                      {/* Title & Location */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
                          {report.title}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{report.location_label}</span>
                        </div>
                      </td>

                      {/* Priority Score */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-sm font-extrabold ${
                              report.priority_score >= 85
                                ? 'text-rose-500'
                                : report.priority_score >= 70
                                ? 'text-amber-500'
                                : 'text-emerald-500'
                            }`}
                          >
                            {report.priority_score}
                          </span>
                          <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
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
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium bg-white focus:outline-none cursor-pointer ${staStyle.text} ${staStyle.border}`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st} className="bg-white text-slate-700">
                              {formatStatus(st)}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* AI Confidence */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-semibold text-slate-600">
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
                          className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-emerald-500 group-hover:text-white text-slate-600 text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
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
