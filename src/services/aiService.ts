import api from './axios';

const CREDITS_PER_SUMMARY = 3;

export interface SummaryRequest {
  text: string;
}

export interface SummaryResponse {
  success: boolean;
  summary: string;
  creditsUsed?: number;
  remainingCredits?: number;
  model?: string;
  message?: string;
  stats?: {
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

export interface InsufficientCreditsError extends Error {
  required: number;
  current: number;
}

export function createInsufficientCreditsError(required: number, current: number): InsufficientCreditsError {
  const error = new Error(`Insufficient credits. You need ${required} credits per request. Current balance: ${current}`) as InsufficientCreditsError;
  error.name = 'InsufficientCreditsError';
  error.required = required;
  error.current = current;
  return error;
}

export function isInsufficientCreditsError(error: any): error is InsufficientCreditsError {
  return error && error.name === 'InsufficientCreditsError';
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

      if (response.data.success && response.data.data) {
        return {
          success: true,
          summary: response.data.data.summary,
          creditsUsed: response.data.data.creditsUsed,
          remainingCredits: response.data.data.remainingCredits,
          model: response.data.data.model,
          stats: {
            originalLength: request.text.length,
            summaryLength: response.data.data.summary.length,
            compressionRatio: `${Math.round((1 - response.data.data.summary.length / request.text.length) * 100)}%`,
            originalWords: request.text.split(/\s+/).filter((w: string) => w.length > 0).length,
            summaryWords: response.data.data.summary.split(/\s+/).filter((w: string) => w.length > 0).length,
          },
        };
      } else if (!response.data.success && response.data.message?.includes('Insufficient credits')) {
        // Parse the error message to extract required and current credits
        const match = response.data.message.match(/You need (\d+) credits per request\. Current balance: (\d+)/);
        if (match) {
          throw createInsufficientCreditsError(parseInt(match[1], 10), parseInt(match[2], 10));
        }
        throw createInsufficientCreditsError(CREDITS_PER_SUMMARY, 0);
      } else {
        throw new Error(response.data.message || 'Failed to generate summary');
      }
    } catch (error: any) {
      if (isInsufficientCreditsError(error)) {
        throw error;
      }
      // Return a fallback response for other errors
      return {
        success: false,
        summary: 'AI service is currently unavailable. Please try again later.',
        stats: {
          originalLength: request.text.length,
          summaryLength: 0,
          compressionRatio: '0%',
          originalWords: request.text.split(/\s+/).filter((w: string) => w.length > 0).length,
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
      return {
        available: false,
        service: 'Unknown',
        message: 'AI service is currently unavailable'
      };
    }
  },
};