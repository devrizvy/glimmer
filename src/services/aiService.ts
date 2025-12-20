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
    try {
      const response = await api.post(AI_ENDPOINTS.summarize, request);
      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to summarize text:', error);
      // Return a fallback response
      return {
        success: false,
        summary: 'AI service is currently unavailable. Please try again later.',
        stats: {
          originalLength: request.text.length,
          summaryLength: 0,
          compressionRatio: '0%',
          originalWords: request.text.split(/\s+/).length,
          summaryWords: 0,
        }
      };
    }
  },

  // Check AI service status
  getServiceStatus: async (): Promise<AIServiceStatus> => {
    try {
      const response = await api.get(AI_ENDPOINTS.status);
      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        // Fallback status
        return {
          available: false,
          service: 'Unknown',
          message: 'Service status unavailable'
        };
      }
    } catch (error) {
      console.error('Failed to check AI service status:', error);
      return {
        available: false,
        service: 'Unknown',
        message: 'AI service is currently unavailable'
      };
    }
  },
};