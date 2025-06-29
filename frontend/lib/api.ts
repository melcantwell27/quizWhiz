import { AuthResponse, RegisterRequest, LoginRequest, AuthError } from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error');
  }
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/students/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/students/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const quizApi = {
  getQuizzes: async (): Promise<any[]> => {
    return apiRequest<any[]>('/quizzes/');
  },

  createAttempt: async (quizId: number, studentId: number): Promise<any> => {
    return apiRequest<any>('/attempts/', {
      method: 'POST',
      body: JSON.stringify({ quiz_id: quizId, student_id: studentId }),
    });
  },

  getQuiz: async (quizId: number): Promise<any> => {
    return apiRequest<any>(`/quizzes/${quizId}/`);
  },
};

// Quiz Attempt API functions
export const attemptApi = {
  // Get current question for an attempt
  getCurrentQuestion: async (attemptId: string) => {
    return apiRequest<any>(`/attempts/${attemptId}/current_question/`);
  },

  // Submit an answer
  submitAnswer: async (attemptId: string, data: { choice_id?: number; free_text_response?: string }) => {
    return apiRequest<any>(`/attempts/${attemptId}/answer/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get attempt results
  getResults: async (attemptId: string) => {
    return apiRequest<any>(`/attempts/${attemptId}/results/`);
  },
};

export { ApiError }; 