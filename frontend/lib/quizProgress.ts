export interface InProgressQuiz {
  studentId: string;
  attemptId: string;
}

const STORAGE_KEY = 'inProgressQuiz';

export function saveInProgressQuiz(data: InProgressQuiz) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getInProgressQuiz(): InProgressQuiz | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearInProgressQuiz() {
  localStorage.removeItem(STORAGE_KEY);
} 