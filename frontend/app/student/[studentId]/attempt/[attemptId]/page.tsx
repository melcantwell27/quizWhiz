'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../../stores/authStore';
import { QuizQuestion } from '../../../../../components/quiz';
import { attemptApi } from '../../../../../lib/api';


interface AttemptPageProps {
  params: Promise<{
    studentId: string;
    attemptId: string;
  }>;
}

interface Question {
  question_id: number;
  question_type: 'mcq' | 'ftq';
  question_text: string;
  points: number;
  choices?: Array<{ id: number; content: string }>;
  question_number: number;
  total_questions: number;
}

export default function AttemptPage({ params }: AttemptPageProps) {
  const router = useRouter();
  const { student, isAuthenticated } = useAuthStore();
  const { studentId, attemptId } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const fetchCurrentQuestion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const question = await attemptApi.getCurrentQuestion(attemptId);
      setCurrentQuestion(question);
    } catch (err: any) {
      if (err.status === 404) {
        // Quiz is completed - redirect to results page
        router.push(`/student/${studentId}/attempt/${attemptId}/results`);
        return;
      } else {
        setError(err.message || 'Failed to load question');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (answer: { choice_id?: number; free_text_response?: string }) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await attemptApi.submitAnswer(attemptId, answer);
      
      // Try to fetch the next question
      try {
        const question = await attemptApi.getCurrentQuestion(attemptId);
        setCurrentQuestion(question);
      } catch (err: any) {
        if (err.status === 404 || (err.message && err.message.toLowerCase().includes('quiz already completed'))) {
          // Quiz is completed - redirect to results page
          router.push(`/student/${studentId}/attempt/${attemptId}/results`);
          return;
        } else {
          throw err; // Re-throw other errors
        }
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('quiz already completed')) {
        router.push(`/student/${studentId}/attempt/${attemptId}/results`);
        return;
      }
      setError(err.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Check if the student ID in URL matches the logged-in student
    if (!isAuthenticated || !student) {
      router.push('/');
      return;
    }

    if (student.id.toString() !== studentId) {
      // Student ID doesn't match, redirect to home
      router.push('/');
      return;
    }

    // Fetch the current question
    fetchCurrentQuestion();
  }, [student, isAuthenticated, studentId, router, attemptId]);

  const handleBackToDashboard = () => {
    router.push(`/student/${studentId}`);
  };

  // Show loading while checking authentication
  if (!isAuthenticated || !student) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If student ID doesn't match, show nothing (will redirect)
  if (student.id.toString() !== studentId) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToDashboard}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Quiz in Progress
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Quiz Content */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : currentQuestion ? (
          <QuizQuestion
            question={currentQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            isSubmitting={isSubmitting}
          />
        ) : (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No question available
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
} 