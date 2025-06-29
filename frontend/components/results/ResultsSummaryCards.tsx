'use client';

import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { EmojiEvents, CheckCircle, Star, AccessTime } from '@mui/icons-material';
import React from 'react';

interface ResultsSummaryCardsProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  totalPointsEarned: number;
  totalPossiblePoints: number;
  timeTaken: string;
  formatTime: (timeString: string) => string;
}

const ResultsSummaryCards: React.FC<ResultsSummaryCardsProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  totalPointsEarned,
  totalPossiblePoints,
  timeTaken,
  formatTime,
}) => (
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
              {score.toFixed(2)}%
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
            {correctAnswers}/{totalQuestions}
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
            {totalPointsEarned}/{totalPossiblePoints}
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
            {formatTime(timeTaken)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Time
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default ResultsSummaryCards; 