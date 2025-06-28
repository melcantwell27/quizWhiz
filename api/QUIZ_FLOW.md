# Complete Quiz-Taking Flow

## 🎯 **Student Management**

### **Step 1A: Student Registration** (New Students)
```
POST /api/students/
```
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
**Response** (Success):
```json
{
  "message": "Student registered successfully!",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
**Response** (Email Already Exists):
```json
{
  "error": "Student with this email already exists. Please login instead."
}
```

### **Step 1B: Student Login** (Existing Students)
```
POST /api/students/login/
```
**Request Body**:
```json
{
  "email": "john@example.com"
}
```
**Response** (Success):
```json
{
  "message": "Login successful",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
**Response** (Student Not Found):
```json
{
  "error": "Student not found. Please register first."
}
```

### **Step 2: Browse Available Quizzes**
```
GET /api/quizzes/
```
**Response**:
```json
[
  {
    "id": 1,
    "name": "Python Basics Quiz"
  },
  {
    "id": 2,
    "name": "Django Fundamentals"
  }
]
```

### **Step 3: Start a Quiz Attempt**
```
POST /api/attempts/
```
**Request Body**:
```json
{
  "quiz_id": 1,
  "student_id": 1
}
```
**Response**:
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
    "name": "Python Basics Quiz"
  },
  "time_start": "2024-01-01T10:00:00Z",
  "time_end": null,
  "score": null
}
```

### **Step 4: Get First Question**
```
GET /api/attempts/1/current_question/
```
**Response**:
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
  "total_questions": 3
}
```

### **Step 5: Submit Answer**
```
POST /api/attempts/1/answer/
```
**Request Body** (MCQ):
```json
{
  "choice_id": 2
}
```
**Request Body** (FTQ):
```json
{
  "answer": "A form of government where people vote."
}
```
**Response**:
```json
{
  "message": "Answer submitted successfully",
  "next_question_available": true
}
```

### **Step 6: Continue with Next Questions**
Repeat Steps 4-5 until all questions are answered.

### **Step 7: Quiz Completion**
When the last answer is submitted:
```json
{
  "message": "Quiz completed!",
  "next_question_available": false
}
```

### **Step 8: View Results**
```
GET /api/attempts/1/results/
```
**Response**:
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
    "name": "Python Basics Quiz"
  },
  "time_start": "2024-01-01T10:00:00Z",
  "time_end": "2024-01-01T10:15:00Z",
  "score": 75.0,
  "total_questions": 3,
  "correct_answers": 2,
  "total_points_earned": 15,
  "total_possible_points": 20,
  "time_taken": "00:15:00",
  "answers": [
    {
      "question_text": "What is the capital of France?",
      "is_correct": true,
      "points_earned": 5,
      "correct_answer": "Paris",
      "student_answer": "Paris"
    }
  ]
}
```

## 🔑 **Key Features**

1. **Simple Student Management**: Just name + email, auto-generated student ID
2. **No Authentication**: No passwords, just email lookup
3. **Security**: Correct answers hidden during quiz, only shown in results
4. **Resume Support**: Can resume incomplete attempts
5. **Detailed Results**: Shows correct answers, points earned, time taken

## 🚀 **Frontend Flow**

1. **Student enters name/email** → Gets student ID
2. **Shows quiz list** → Student picks a quiz
3. **Starts attempt** → Gets first question
4. **Shows questions one by one** → Submits answers
5. **Shows results** → Complete feedback with correct answers

## 📝 **API Endpoints Summary**

- `POST /api/students/` - Register new student (name + email)
- `POST /api/students/login/` - Login existing student (email only)
- `GET /api/quizzes/` - List available quizzes
- `POST /api/attempts/` - Start quiz attempt
- `GET /api/attempts/{id}/current_question/` - Get current question
- `POST /api/attempts/{id}/answer/` - Submit answer
- `GET /api/attempts/{id}/results/` - Get results (after completion) 