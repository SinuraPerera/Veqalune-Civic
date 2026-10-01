import { Report } from '../types';

export const exportToCSV = (reports: Report[], filename:	string = 'civic-reports.csv') => {
  if (reports.length === 0) {
    alert('No reports to export');
    return;
  }

  const headers = [
    'ID',
    'Title',
    'Category',
    'Severity',
    'Status',
    'Priority Score',
    'Environmental Risk',
    'Public Risk',
    'Location',
    'Latitude',
    'Longitude',
    'Created At',
    'AI Analysis',
  ];

  const csvContent = [
    headers.join(','),
    ...reports.map((report) => {
      const row = [
        report.id,
        `"${report.title.replace(/"/g, '""')}"`,
        report.category,
        report.severity,
        report.status,
        report.priority_score,
        report.environmental_risk,
        report.public_risk,
        `"${report.location_label.replace(/"/g, '""')}"`,
        report.latitude,
        report.longitude,
        report.created_at,
        `"${report.ai_analysis.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      ];
      return row.join(',');
    }),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const exportFilteredToCSV = (
  reports: Report[],
  filters: {
    category?: string;
    severity?: string;
    status?: string;
  } = {}
) => {
  let filtered = reports;

  if (filters.category && filters.category !== 'ALL') {
    filtered = filtered.filter((r) => r.category === filters.category);
  }
  if (filters.severity && filters.severity !== 'ALL') {
    filtered = filtered.filter((r) => r.severity === filters.severity);
  }
  if (filters.status && filters.status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === filters.status);
  }

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(filtered, `civic-reports-${timestamp}.csv`);
};
