'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { School, Quiz, Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import { QuizList } from '../../../components/quiz';
import { quizApi } from '../../../lib/api';

interface StudentDashboardProps {
  params: Promise<{
    studentId: string;
  }>;
}

interface Quiz {
  id: number;
  name: string;
  total_questions?: number;
  total_points?: number;
}

export default function StudentDashboard({ params }: StudentDashboardProps) {
  const router = useRouter();
  const { student, isAuthenticated } = useAuthStore();
  const { studentId } = use(params);
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the student ID in URL matches the logged-in student
    if (!isAuthenticated || !student) {
      router.push('/');
      return;
    }

    if (student.id.toString() !== studentId) {
      // Student ID doesn't match, redirect to home
      router.push('/');
    }
  }, [student, isAuthenticated, studentId, router]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const quizData = await quizApi.getQuizzes();
        setQuizzes(quizData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quizzes');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && student) {
      fetchQuizzes();
    }
  }, [isAuthenticated, student]);

  const handleStartQuiz = async (quizId: number) => {
    if (!student) return;
    
    try {
      setIsLoading(true);
      const attempt = await quizApi.createAttempt(quizId, student.id);
      router.push(`/student/${studentId}/attempt/${attempt.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start quiz');
      setIsLoading(false);
    }
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
      <Container maxWidth="lg">
        {/* Welcome Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(135deg, #43b649 0%, #1ecbe1 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 56,
                height: 56,
              }}
            >
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Welcome, {student.name}! 
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Ready to scale your lizard knowledge?
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Dashboard Content */}
        <Grid container spacing={3}>
          {/* Available Quizzes */}
          <Grid size={{ xs: 12 }}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                  Available Quizzes
                </Typography>
                <QuizList
                  quizzes={quizzes}
                  studentId={studentId}
                  isLoading={isLoading}
                  onStartQuiz={handleStartQuiz}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 