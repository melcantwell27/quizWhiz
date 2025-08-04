'use client';

import { CardContent, Grid, Typography, Box } from '@mui/material';
import { EmojiEvents, CheckCircle, Star, AccessTime } from '@mui/icons-material';
import React from 'react';
import { ResultCard, ResultLabel } from './ResultsSummaryCards.styled';

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
      <ResultCard bgcolor="linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)">
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <ResultLabel variant="h5" sx={{ mb: 1 }}>Final Score</ResultLabel>
            <EmojiEvents sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {score.toFixed(2)}%
            </Typography>
          </Box>
        </CardContent>
      </ResultCard>
    </Grid>
    <Grid size={{ xs: 6, sm: 3 }}>
      <ResultCard bgcolor="linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)">
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <ResultLabel variant="h5" sx={{ mb: 1 }}>Correct</ResultLabel>
            <CheckCircle sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {correctAnswers}/{totalQuestions}
            </Typography>
          </Box>
        </CardContent>
      </ResultCard>
    </Grid>
    <Grid size={{ xs: 6, sm: 3 }}>
      <ResultCard bgcolor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <ResultLabel variant="h5" sx={{ mb: 1 }}>Points</ResultLabel>
            <Star sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {totalPointsEarned}/{totalPossiblePoints}
            </Typography>
          </Box>
        </CardContent>
      </ResultCard>
    </Grid>
    <Grid size={{ xs: 6, sm: 3 }}>
      <ResultCard bgcolor="linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)">
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <ResultLabel variant="h5" sx={{ mb: 1 }}>Time</ResultLabel>
            <AccessTime sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {formatTime(timeTaken)}
            </Typography>
          </Box>
        </CardContent>
      </ResultCard>
    </Grid>
  </Grid>
);

export default ResultsSummaryCards; 