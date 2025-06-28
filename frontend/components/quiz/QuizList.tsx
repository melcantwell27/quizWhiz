'use client';

import React from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import QuizCard from './QuizCard';

interface Quiz {
  id: number;
  name: string;
  total_questions?: number;
  total_points?: number;
}

interface QuizListProps {
  quizzes: Quiz[];
  studentId: string;
  isLoading?: boolean;
  onStartQuiz?: (quizId: number) => void;
}

const QuizList: React.FC<QuizListProps> = ({ 
  quizzes, 
  studentId, 
  isLoading = false,
  onStartQuiz 
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No quizzes available yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later for new quizzes!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          studentId={studentId}
          onStartQuiz={onStartQuiz}
        />
      ))}
    </Box>
  );
};

export default QuizList; 