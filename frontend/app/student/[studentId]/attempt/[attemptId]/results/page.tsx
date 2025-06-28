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
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { ArrowBack, CheckCircle, Cancel, School, EmojiEvents, Star, AccessTime } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../../../stores/authStore';
import { attemptApi } from '../../../../../../lib/api';

interface ResultsPageProps {
  params: Promise<{
    studentId: string;
    attemptId: string;
  }>;
}

interface Answer {
  question_text: string;
  is_correct: boolean;
  points_earned: number;
  correct_answer: string;
  student_answer: string;
}

interface Results {
  id: number;
  student: {
    id: number;
    name: string;
    email: string;
  };
  quiz: {
    id: number;
    name: string;
  };
  time_start: string;
  time_end: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  total_points_earned: number;
  total_possible_points: number;
  time_taken: string;
  answers: Answer[];
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const router = useRouter();
  const { student, isAuthenticated } = useAuthStore();
  const { studentId, attemptId } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await attemptApi.getResults(attemptId);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load results');
    } finally {
      setIsLoading(false);
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

    // Fetch the results
    fetchResults();
  }, [student, isAuthenticated, studentId, router, attemptId]);

  const handleBackToDashboard = () => {
    router.push(`/student/${studentId}`);
  };

  const formatTime = (timeString: string) => {
    const seconds = parseFloat(timeString);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
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
            Quiz Results
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results Content */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : results ? (
          <Box>
            {/* Quiz Info */}
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                {results.quiz.name}
              </Typography>
              {/* Final Score Summary Cards */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card elevation={3} sx={{
                    p: 1, minWidth: 0, borderRadius: 3,
                    background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)',
                    boxShadow: 3,
                    color: 'primary.main',
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 1 }}>
                      <Box sx={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.85)',
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        boxShadow: 1,
                      }}>
                        <EmojiEvents sx={{ fontSize: 32, mb: 0.5, color: '#fbc02d' }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, color: '#1a3c34' }}>
                          {results.score.toFixed(2)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#1a3c34', fontWeight: 600 }}>
                          Final Score
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card elevation={3} sx={{
                    p: 1, minWidth: 0, borderRadius: 3,
                    background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                    boxShadow: 3,
                    color: 'success.main',
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 1 }}>
                      <CheckCircle sx={{ fontSize: 32, mb: 0.5, color: '#43a047' }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {results.correct_answers}/{results.total_questions}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Correct
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card elevation={3} sx={{
                    p: 1, minWidth: 0, borderRadius: 3,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    boxShadow: 3,
                    color: 'info.main',
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 1 }}>
                      <Star sx={{ fontSize: 32, mb: 0.5, color: '#ffd600' }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {results.total_points_earned}/{results.total_possible_points}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Points
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card elevation={3} sx={{
                    p: 1, minWidth: 0, borderRadius: 3,
                    background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                    boxShadow: 3,
                    color: 'warning.main',
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 1 }}>
                      <AccessTime sx={{ fontSize: 32, mb: 0.5, color: '#ffb300' }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {formatTime(results.time_taken)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Time
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* Detailed Results */}
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#006064' }}>
                Question Details
              </Typography>
              <List>
                {results.answers.map((answer, index) => (
                  <Box key={index} sx={{ mb: 2, borderRadius: 2, background: answer.is_correct ? 'rgba(67, 214, 112, 0.10)' : 'rgba(255, 87, 108, 0.10)', p: 2 }}>
                    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                        {answer.is_correct ? (
                          <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                        ) : (
                          <Cancel sx={{ color: 'error.main', mr: 1 }} />
                        )}
                        <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
                          {answer.question_text}
                        </Typography>
                        <Chip 
                          label={`${answer.points_earned} pts`} 
                          color={answer.is_correct ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 'bold', ml: 1 }}
                        />
                      </Box>
                      <Box sx={{ ml: 4, width: '100%' }}>
                        <Typography variant="body2" color="text.primary">
                          <strong>Your answer:</strong> {answer.student_answer}
                        </Typography>
                        {!answer.is_correct && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Correct answer:</strong> {answer.correct_answer}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Paper>
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No results available
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
} 