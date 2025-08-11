import { useEffect, useState } from 'react';
import { getInProgressQuiz, clearInProgressQuiz } from '../lib/quizProgress';
import { attemptApi, quizApi } from '../lib/api';

export function useInProgressQuiz(studentId: string) {
  const [quiz, setQuiz] = useState<any | null>(null);
  const [question, setQuestion] = useState<any | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setQuiz(null);
      setQuestion(null);
      setAttemptId(null);
      setLoading(false);
      setError(null);
      return;
    }
    
    const inProgress = getInProgressQuiz();
    console.log('In-progress quiz from localStorage:', inProgress);
    console.log('Current studentId:', studentId);
    
    if (!inProgress || inProgress.studentId !== studentId) {
      setQuiz(null);
      setQuestion(null);
      setAttemptId(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setAttemptId(inProgress.attemptId);
    console.log('Fetching current question for attempt:', inProgress.attemptId);
    // Fetch current question
    attemptApi.getCurrentQuestion(inProgress.attemptId)
      .then((q) => {
        console.log('Current question response:', q);
        setQuestion(q);
        // Fetch quiz details
        const quizId = q.quiz_id || (q.quiz && q.quiz.id);
        console.log('Extracted quiz ID:', quizId);
        if (!quizId) throw new Error('Quiz ID not found in current question');
        return quizApi.getQuiz(quizId);
      })
      .then((quizData) => {
        setQuiz(quizData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading in-progress quiz:', err);
        setQuiz(null);
        setQuestion(null);
        setAttemptId(null);
        setLoading(false);
        
        // Only clear localStorage if the quiz is actually completed
        if (err.status === 404 || (err.message && err.message.toLowerCase().includes('quiz already completed'))) {
          setError('Quiz completed or not found.');
          clearInProgressQuiz();
        } else if (err.status === 0) {
          setError('Network error. Please check your connection.');
        } else {
          setError(`Could not load in-progress quiz: ${err.message || 'Unknown error'}`);
        }
      });
  }, [studentId]);

  return { quiz, question, attemptId, loading, error };
} 