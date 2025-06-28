'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  Chip,
  TextField,
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface Choice {
  id: number;
  content: string;
}

interface Question {
  question_id: number;
  question_type: 'mcq' | 'ftq';
  question_text: string;
  points: number;
  choices?: Choice[];
  question_number: number;
  total_questions: number;
}

interface QuizQuestionProps {
  question: Question;
  onSubmitAnswer: (answer: { choice_id?: number; free_text_response?: string }) => void;
  isSubmitting?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  onSubmitAnswer, 
  isSubmitting = false 
}) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [freeTextResponse, setFreeTextResponse] = useState('');

  const handleSubmit = () => {
    if (question.question_type === 'mcq' && selectedChoice) {
      onSubmitAnswer({ choice_id: selectedChoice });
    } else if (question.question_type === 'ftq' && freeTextResponse.trim()) {
      onSubmitAnswer({ free_text_response: freeTextResponse.trim() });
    }
  };

  const canSubmit = 
    (question.question_type === 'mcq' && selectedChoice !== null) ||
    (question.question_type === 'ftq' && freeTextResponse.trim() !== '');

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      {/* Question Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Question {question.question_number} of {question.total_questions}
        </Typography>
        <Chip 
          label={`${question.points} points`} 
          color="primary" 
          variant="outlined"
        />
      </Box>

      {/* Question Text */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {question.question_text}
      </Typography>

      {/* Question Content */}
      {question.question_type === 'mcq' && question.choices && (
        <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
          <RadioGroup
            value={selectedChoice || ''}
            onChange={(e) => setSelectedChoice(Number(e.target.value))}
          >
            {question.choices.map((choice) => (
              <FormControlLabel
                key={choice.id}
                value={choice.id}
                control={<Radio />}
                label={choice.content}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: selectedChoice === choice.id ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  backgroundColor: selectedChoice === choice.id ? 'primary.50' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}

      {question.question_type === 'ftq' && (
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Type your answer here..."
          value={freeTextResponse}
          onChange={(e) => setFreeTextResponse(e.target.value)}
          sx={{ mb: 3 }}
        />
      )}

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<Send />}
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          sx={{
            background: 'linear-gradient(135deg, #43b649 0%, #1ecbe1 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3aa142 0%, #1bb8cc 100%)',
            },
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
        </Button>
      </Box>
    </Paper>
  );
};

export default QuizQuestion; 