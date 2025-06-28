'use client';

import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { School, Quiz, Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';

export default function Home() {
  const router = useRouter();
  const { student, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // If user is authenticated, redirect to their dashboard
    if (isAuthenticated && student) {
      router.push(`/student/${student.id}`);
    }
  }, [isAuthenticated, student, router]);

  const handleLogout = () => {
    logout();
  };

  // Show loading while checking authentication
  if (isAuthenticated && student) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Redirecting to dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <School sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome to Lizard Quizzard Wizard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Master your subjects with interactive quizzes and real-time feedback
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            <Grid size="auto">
              <Button
                variant="contained"
                size="large"
                href="/auth/login"
                sx={{ px: 4, py: 1.5 }}
              >
                Sign In
              </Button>
            </Grid>
            <Grid size="auto">
              <Button
                variant="outlined"
                size="large"
                href="/auth/register"
                sx={{ px: 4, py: 1.5 }}
              >
                Create Account
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
