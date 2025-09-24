import { fetchJson } from "./utils";

// AI Endpoints
export const aiApi = {
  // Process natural language queries about marine data
  query: async (query: string) => {
    return fetchJson<any>("/api/v1/ai/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },

  // Get AI-generated summary of marine data
  getSummary: async (dataType: string, region: string = "kerala") => {
    return fetchJson<any>(`/api/v1/ai/summary?data_type=${dataType}&region=${region}`);
  },

  // Detect anomalies in marine data using AI
  detectAnomalies: async (data: any[], dataType: string) => {
    return fetchJson<any>("/api/v1/ai/anomalies", {
      method: "POST",
      body: JSON.stringify({ data, data_type: dataType }),
    });
  },

  // Get examples of natural language queries
  getQueryExamples: async () => {
    return fetchJson<any>("/api/v1/ai/examples");
  },

  // Generate SQL for TimescaleDB from a natural question
  suggestSql: async (question: string) => {
    return fetchJson<any>(`/api/v1/ai/sql?question=${encodeURIComponent(question)}`);
  },

  // Suggest visualization spec based on question and available fields
  suggestVisualization: async (question: string, fields: string[]) => {
    return fetchJson<any>("/api/v1/ai/viz/suggest", {
      method: "POST",
      body: JSON.stringify({ question, fields }),
    });
  },
};

// Analytics Endpoints
export const analyticsApi = {
  // Correlate ocean parameter with species data
  correlate: async (parameter: string, species: string, region?: string) => {
    const queryParams = new URLSearchParams({
      parameter,
      species,
      ...(region && { region }),
    });
    return fetchJson<any>(`/api/v1/analytics/correlate?${queryParams}`);
  },
};

// Health check
export const healthApi = {
  check: async () => {
    return fetchJson<any>("/healthz");
  },
};