'use client';

import { useEffect } from 'react';
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
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import { useQuizStore } from '../../../stores/quizStore';
import { QuizList } from '../../../components/quiz';

interface StudentDashboardProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default function StudentDashboard({ params }: StudentDashboardProps) {
  const router = useRouter();
  const { student, isAuthenticated } = useAuthStore();
  const { studentId } = use(params);
  
  const {
    inProgressQuizzes,
    availableQuizzes,
    loading,
    error,
    fetchInProgressQuizzes,
    fetchAvailableQuizzes,
    startQuiz,
    resumeQuiz,
    clearError
  } = useQuizStore();

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
    if (isAuthenticated && student) {
      // Fetch both in-progress and available quizzes
      fetchInProgressQuizzes(student.id.toString());
      fetchAvailableQuizzes(student.id.toString());
    }
  }, [isAuthenticated, student, fetchInProgressQuizzes, fetchAvailableQuizzes]);

  const handleStartQuiz = async (quizId: number) => {
    if (!student) return;
    
    try {
      const attemptId = await startQuiz(quizId, student.id.toString());
      if (attemptId) {
        router.push(`/student/${studentId}/attempt/${attemptId}`);
      }
    } catch (err) {
      console.error('Failed to start quiz:', err);
    }
  };

  const handleResumeQuiz = (quizId: number) => {
    const attemptId = resumeQuiz(quizId);
    if (attemptId) {
      router.push(`/student/${studentId}/attempt/${attemptId}`);
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
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        {/* Dashboard Content */}
        <Grid container spacing={3}>
          {/* Available Quizzes */}
          <Grid size={{ xs: 12 }}>
            {/* In Progress Quizzes Section */}
            {(loading || (inProgressQuizzes && inProgressQuizzes.length > 0)) && (
              <Box sx={{ mb: 4 }}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                      In Progress Quizzes
                    </Typography>
                    
                    {loading && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    )}
                    
                    {inProgressQuizzes && inProgressQuizzes.length > 0 && !loading && (
                      <QuizList
                        quizzes={inProgressQuizzes}
                        studentId={studentId}
                        isLoading={false}
                        isInProgress={true}
                        onStartQuiz={handleResumeQuiz}
                      />
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
            
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                  Available Quizzes
                </Typography>
                <QuizList
                  quizzes={availableQuizzes}
                  studentId={studentId}
                  isLoading={loading}
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