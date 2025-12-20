import api from './axios';

export interface SummaryRequest {
  text: string;
  length: 'short' | 'medium' | 'long';
  style: 'concise' | 'bullet';
}

export interface SummaryResponse {
  success: boolean;
  summary: string;
  stats: {
    originalLength: number;
    summaryLength: number;
    compressionRatio: string;
    originalWords: number;
    summaryWords: number;
  };
}

export interface AIServiceStatus {
  available: boolean;
  service: string;
  message: string;
}

const AI_ENDPOINTS = {
  summarize: '/api/ai/summarize',
  status: '/api/ai/status',
} as const;

export const aiApi = {
  // Summarize text
  summarizeText: async (request: SummaryRequest): Promise<SummaryResponse> => {
    const response = await api.post(AI_ENDPOINTS.summarize, request);
    return response.data.data; // Extract data from backend response format
  },

  // Check AI service status
  getServiceStatus: async (): Promise<AIServiceStatus> => {
    const response = await api.get(AI_ENDPOINTS.status);
    return response.data.data; // Extract data from backend response format
  },
};