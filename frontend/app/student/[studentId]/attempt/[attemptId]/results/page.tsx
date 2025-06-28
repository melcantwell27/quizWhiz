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
import { ArrowBack, CheckCircle, Cancel, School } from '@mui/icons-material';
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
            <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                {results.quiz.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Completed by {results.student.name}
              </Typography>

              {/* Score Summary */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card elevation={2}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {results.score}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Final Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card elevation={2}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {results.correct_answers}/{results.total_questions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Correct Answers
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card elevation={2}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                        {results.total_points_earned}/{results.total_possible_points}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Points Earned
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card elevation={2}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {formatTime(results.time_taken)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time Taken
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* Detailed Results */}
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Question Details
              </Typography>
              <List>
                {results.answers.map((answer, index) => (
                  <Box key={index}>
                    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                        {answer.is_correct ? (
                          <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                        ) : (
                          <Cancel sx={{ color: 'error.main', mr: 1 }} />
                        )}
                        <Typography variant="body1" sx={{ flex: 1 }}>
                          {answer.question_text}
                        </Typography>
                        <Chip 
                          label={`${answer.points_earned} pts`} 
                          color={answer.is_correct ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ ml: 4, width: '100%' }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Your answer:</strong> {answer.student_answer}
                        </Typography>
                        {!answer.is_correct && (
                          <Typography variant="body2" color="success.main">
                            <strong>Correct answer:</strong> {answer.correct_answer}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                    {index < results.answers.length - 1 && <Divider />}
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