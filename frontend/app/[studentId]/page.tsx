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
} from '@mui/material';
import { School, Quiz, Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';

interface StudentDashboardProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default function StudentDashboard({ params }: StudentDashboardProps) {
  const router = useRouter();
  const { student, isAuthenticated } = useAuthStore();
  const { studentId } = use(params);

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
                Welcome back, {student.name}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Ready to continue your learning journey?
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Dashboard Content */}
        <Grid container spacing={3}>
          {/* Quizzes Completed */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  0
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quizzes Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Available Quizzes */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Available Quizzes
                </Typography>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Quiz sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No quizzes available yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for new quizzes!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 