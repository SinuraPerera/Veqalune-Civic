import { INITIAL_SAMPLE_REPORTS } from '../src/data/sampleReports';

interface ApiRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(data: unknown): void;
}

export default function handler(request: ApiRequest, response: ApiResponse): void {
  if ((request.method || 'GET').toUpperCase() !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const query = request.query || {};
  const category = typeof query.category === 'string' ? query.category : undefined;
  const severity = typeof query.severity === 'string' ? query.severity : undefined;
  const status = typeof query.status === 'string' ? query.status : undefined;
  const search = typeof query.search === 'string' ? query.search.toLowerCase() : undefined;
  const reports = INITIAL_SAMPLE_REPORTS.filter((report) =>
    (!category || category === 'ALL' || report.category === category) &&
    (!severity || severity === 'ALL' || report.severity === severity) &&
    (!status || status === 'ALL' || report.status === status) &&
    (!search || [report.title, report.description, report.location_label, report.id, ...report.hazard_tags]
      .some((value) => value.toLowerCase().includes(search)))
  ).sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at));

  response.status(200).json({ reports, total: reports.length });
}
