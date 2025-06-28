'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { PlayArrow, School, Timer } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Quiz {
  id: number;
  name: string;
  total_questions?: number;
  total_points?: number;
}

interface QuizCardProps {
  quiz: Quiz;
  studentId: string;
  onStartQuiz?: (quizId: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, studentId, onStartQuiz }) => {
  const router = useRouter();

  const handleStartQuiz = async () => {
    if (onStartQuiz) {
      onStartQuiz(quiz.id);
    } else {
      // Navigate to quiz start page
      router.push(`/student/${studentId}/quiz/${quiz.id}`);
    }
  };

  return (
    <Card 
      elevation={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        mb: 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 3,
          transform: 'translateY(-1px)',
          boxShadow: 2,
        },
        cursor: 'pointer',
      }}
      onClick={handleStartQuiz}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <School sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {quiz.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {quiz.total_questions && (
              <Chip
                icon={<School />}
                label={`${quiz.total_questions} questions`}
                variant="outlined"
                size="small"
              />
            )}
            {quiz.total_points && (
              <Chip
                icon={<Timer />}
                label={`${quiz.total_points} points`}
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        startIcon={<PlayArrow />}
        size="medium"
        sx={{
          background: 'linear-gradient(135deg, #43b649 0%, #1ecbe1 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3aa142 0%, #1bb8cc 100%)',
          },
        }}
      >
        Start
      </Button>
    </Card>
  );
};

export default QuizCard; 