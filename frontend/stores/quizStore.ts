import { create } from 'zustand';
import { attemptApi, quizApi } from '../lib/api';

interface Quiz {
  id: number;
  name: string;
  description?: string;
  total_questions?: number;
  total_points?: number;
}

interface Attempt {
  id: string;
  student: { id: number; name: string; email: string };
  quiz: { id: number; name: string };
  time_start: string;
  time_end: string | null;
  score: number | null;
}

interface QuizState {
  // State
  inProgressQuizzes: Quiz[];
  availableQuizzes: Quiz[];
  attemptIds: { [quizId: number]: string }; // Map quiz ID to attempt ID
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchInProgressQuizzes: (studentId: string) => Promise<void>;
  fetchAvailableQuizzes: (studentId: string) => Promise<void>;
  startQuiz: (quizId: number, studentId: string) => Promise<string | null>; // returns attemptId
  resumeQuiz: (quizId: number) => string | null; // returns attemptId
  clearError: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  inProgressQuizzes: [],
  availableQuizzes: [],
  attemptIds: {},
  loading: false,
  error: null,
  
  fetchInProgressQuizzes: async (studentId: string) => {
    set({ loading: true, error: null });
    try {
      const attempts = await attemptApi.getStudentAttempts(studentId);
      
      if (!attempts || attempts.length === 0) {
        set({ inProgressQuizzes: [], attemptIds: {}, loading: false });
        return;
      }
      
      const quizzes = attempts.map(attempt => attempt.quiz);
      
      // Create a map of quiz ID to attempt ID
      const attemptIds: { [quizId: number]: string } = {};
      attempts.forEach(attempt => {
        attemptIds[attempt.quiz.id] = attempt.id;
      });
      
      set({ inProgressQuizzes: quizzes, attemptIds, loading: false });
    } catch (err: any) {
      console.error('Error loading in-progress quizzes:', err);
      set({ 
        error: `Could not load in-progress quizzes: ${err.message || 'Unknown error'}`,
        loading: false 
      });
    }
  },
  
  fetchAvailableQuizzes: async (studentId: string) => {
    try {
      const allQuizzes = await quizApi.getQuizzes();
      const { inProgressQuizzes } = get();
      
      // Filter out in-progress quizzes
      const availableQuizzes = allQuizzes.filter(quiz => 
        !inProgressQuizzes.some(inProgressQuiz => inProgressQuiz.id === quiz.id)
      );
      
      set({ availableQuizzes });
    } catch (err: any) {
      console.error('Error loading available quizzes:', err);
      set({ error: `Could not load available quizzes: ${err.message || 'Unknown error'}` });
    }
  },
  
  startQuiz: async (quizId: number, studentId: string) => {
    try {
      set({ loading: true, error: null });
      const attempt = await quizApi.createAttempt(quizId, parseInt(studentId));
      
      // Refresh the quiz lists after starting
      await get().fetchInProgressQuizzes(studentId);
      await get().fetchAvailableQuizzes(studentId);
      
      set({ loading: false });
      return attempt.id;
    } catch (err: any) {
      console.error('Error starting quiz:', err);
      set({ 
        error: `Failed to start quiz: ${err.message || 'Unknown error'}`,
        loading: false 
      });
      return null;
    }
  },
  
  resumeQuiz: (quizId: number) => {
    const { attemptIds } = get();
    const attemptId = attemptIds[quizId];
    
    if (!attemptId) {
      set({ error: 'Attempt not found for this quiz' });
      return null;
    }
    
    return attemptId;
  },
  
  clearError: () => set({ error: null }),
  
  reset: () => set({
    inProgressQuizzes: [],
    availableQuizzes: [],
    attemptIds: {},
    loading: false,
    error: null,
  }),
}));
