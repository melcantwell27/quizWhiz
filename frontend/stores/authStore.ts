import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student } from '../types/auth';

interface AuthState {
  student: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (student: Student) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      student: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (student: Student) => {
        set({
          student,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        set({
          student: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        student: state.student, 
        isAuthenticated: state.isAuthenticated 
      }), // only persist these fields
    }
  )
); 