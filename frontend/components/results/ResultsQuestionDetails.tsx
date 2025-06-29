'use client';

import { Paper, Typography, List, Box, ListItem, Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import React from 'react';

interface Answer {
  question_text: string;
  is_correct: boolean;
  points_earned: number;
  correct_answer: string;
  student_answer: string;
}

interface ResultsQuestionDetailsProps {
  answers: Answer[];
}

const ResultsQuestionDetails: React.FC<ResultsQuestionDetailsProps> = ({ answers }) => (
  <Paper elevation={2} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)' }}>
    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#006064' }}>
      Question Details
    </Typography>
    <List>
      {answers.map((answer, index) => (
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
);

export default ResultsQuestionDetails; 