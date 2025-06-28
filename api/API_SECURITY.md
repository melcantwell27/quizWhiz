# Quiz API Security - Hiding Correct Answers

## Overview
The quiz system has been designed to prevent students from seeing correct answers during the quiz. Correct answers are only revealed after the quiz is completed.

## API Endpoints

### During Quiz (No Correct Answers)
- **GET** `/api/quizzes/{id}/` - Get quiz details without correct answers
- **GET** `/api/attempts/{id}/current_question/` - Get current question without correct answers
- **POST** `/api/attempts/{id}/answer/` - Submit an answer

### After Quiz Completion (With Correct Answers)
- **GET** `/api/attempts/{id}/results/` - Get detailed results with correct answers
- **GET** `/api/quizzes/{id}/with_answers/` - Get quiz with correct answers for review

## Security Implementation

### Serializers
- `ChoiceQuizSerializer`: Only includes `id` and `content` (no `is_correct`)
- `ChoiceResultsSerializer`: Includes `id`, `content`, and `is_correct`
- `MCQQuizSerializer`: Uses `ChoiceQuizSerializer` for choices
- `MCQResultsSerializer`: Uses `ChoiceResultsSerializer` for choices

### Frontend Usage
1. **During Quiz**: Use `/api/quizzes/{id}/` and `/api/attempts/{id}/current_question/`
2. **For Results**: Use `/api/attempts/{id}/results/` and `/api/quizzes/{id}/with_answers/`

## Example Usage

### Getting a question during quiz:
```javascript
// This will NOT include is_correct field
fetch('/api/attempts/1/current_question/')
  .then(response => response.json())
  .then(data => {
    // data.choices will only have {id, content}
    // No is_correct field visible
  });
```

### Getting results after completion:
```javascript
// This WILL include is_correct field
fetch('/api/attempts/1/results/')
  .then(response => response.json())
  .then(data => {
    // data.answers will show correct answers
  });
```

## Security Notes
- The `with_answers` endpoint should only be called after quiz completion
- Frontend should implement proper state management to prevent premature access
- Consider adding authentication/authorization if needed for additional security 