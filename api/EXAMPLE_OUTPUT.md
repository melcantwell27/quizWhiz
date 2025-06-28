# API Response Examples

## During Quiz (No Correct Answers)

### GET /api/quizzes/1/
```json
{
  "id": 1,
  "name": "Sample Quiz",
  "mcqs": [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "points": 5,
      "choices": [
        {
          "id": 1,
          "content": "London"
        },
        {
          "id": 2,
          "content": "Paris"
        },
        {
          "id": 3,
          "content": "Berlin"
        },
        {
          "id": 4,
          "content": "Madrid"
        }
      ]
    }
  ],
  "ftqs": [
    {
      "id": 1,
      "question": "Explain the concept of democracy.",
      "points": 10
    }
  ]
}
```

### GET /api/attempts/1/current_question/
```json
{
  "question_id": 1,
  "question_type": "mcq",
  "question_text": "What is the capital of France?",
  "points": 5,
  "choices": [
    {
      "id": 1,
      "content": "London"
    },
    {
      "id": 2,
      "content": "Paris"
    },
    {
      "id": 3,
      "content": "Berlin"
    },
    {
      "id": 4,
      "content": "Madrid"
    }
  ],
  "question_number": 1,
  "total_questions": 2
}
```

## After Quiz Completion (With Correct Answers)

### GET /api/quizzes/1/with_answers/
```json
{
  "id": 1,
  "name": "Sample Quiz",
  "mcqs": [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "points": 5,
      "choices": [
        {
          "id": 1,
          "content": "London",
          "is_correct": false
        },
        {
          "id": 2,
          "content": "Paris",
          "is_correct": true
        },
        {
          "id": 3,
          "content": "Berlin",
          "is_correct": false
        },
        {
          "id": 4,
          "content": "Madrid",
          "is_correct": false
        }
      ]
    }
  ],
  "ftqs": [
    {
      "id": 1,
      "question": "Explain the concept of democracy.",
      "points": 10
    }
  ]
}
```

### GET /api/attempts/1/results/
```json
{
  "id": 1,
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "quiz": {
    "id": 1,
    "name": "Sample Quiz"
  },
  "time_start": "2024-01-01T10:00:00Z",
  "time_end": "2024-01-01T10:15:00Z",
  "score": 75.0,
  "total_questions": 2,
  "correct_answers": 1,
  "total_points_earned": 5,
  "total_possible_points": 15,
  "time_taken": "00:15:00",
  "answers": [
    {
      "question_text": "What is the capital of France?",
      "is_correct": true,
      "points_earned": 5,
      "correct_answer": "Paris",
      "student_answer": "Paris"
    },
    {
      "question_text": "Explain the concept of democracy.",
      "is_correct": false,
      "points_earned": 0,
      "student_answer": "A form of government where people vote."
    }
  ]
}
```

## Key Differences

1. **During Quiz**: No `is_correct` field in choices
2. **After Completion**: `is_correct` field is visible in choices and results
3. **Security**: Frontend cannot determine correct answers during quiz
4. **Results**: Detailed feedback shows correct answers and student responses 