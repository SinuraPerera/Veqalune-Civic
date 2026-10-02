interface ApiResponse {
  status(code: number): ApiResponse;
  json(data: unknown): void;
}

export default function handler(_request: unknown, response: ApiResponse): void {
  response.status(200).json({
    status: 'ok',
    service: 'VÉQALUNE CIVIC Intelligence Platform',
    version: '1.0.0',
    aiConfigured: false,
    geminiConfigured: false,
    pythonAiConfigured: false,
    dataMode: 'sample-demo',
  });
}
