# Postman Testing Guide - Complete Quiz Flow

## 🚀 **Prerequisites**
- PostgreSQL server running on localhost:5432
- Database `quizwiz_db` created
- User `mel_wizard` with password `MagicWithin4!` exists
- Django server running on `http://localhost:8000`

## 📋 **Complete Quiz Flow Testing**

### **Step 1: Student Registration** (New User)
**Method**: `POST`  
**URL**: `http://localhost:8000/api/students/`  
**Headers**: 
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Expected Response** (201 Created):
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

---

### **Step 1B: Student Login** (Returning User)
**Method**: `POST`  
**URL**: `http://localhost:8000/api/students/login/`  
**Headers**: 
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "email": "john@example.com"
}
```

**Expected Response** (200 OK):
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

---

### **Step 2: Browse Available Quizzes**
**Method**: `GET`  
**URL**: `http://localhost:8000/api/quizzes/`  
**Headers**: None needed

**Expected Response** (200 OK):
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

---

### **Step 3: Start Quiz Attempt**
**Method**: `POST`  
**URL**: `http://localhost:8000/api/attempts/`  
**Headers**: 
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "quiz_id": 1,
  "student_id": 1
}
```

**Expected Response** (201 Created):
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

---

### **Step 4: Get First Question**
**Method**: `GET`  
**URL**: `http://localhost:8000/api/attempts/1/current_question/`  
**Headers**: None needed

**Expected Response** (200 OK):
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

---

### **Step 5: Submit Answer (MCQ)**
**Method**: `POST`  
**URL**: `http://localhost:8000/api/attempts/1/answer/`  
**Headers**: 
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "choice_id": 2
}
```

**Expected Response** (200 OK):
```json
{
  "message": "Answer submitted successfully",
  "next_question_available": true
}
```

---

### **Step 6: Get Next Question**
**Method**: `GET`  
**URL**: `http://localhost:8000/api/attempts/1/current_question/`  
**Headers**: None needed

**Expected Response** (200 OK):
```json
{
  "question_id": 2,
  "question_type": "ftq",
  "question_text": "Explain the concept of democracy.",
  "points": 10,
  "question_number": 2,
  "total_questions": 3
}
```

---

### **Step 7: Submit Answer (FTQ)**
**Method**: `POST`  
**URL**: `http://localhost:8000/api/attempts/1/answer/`  
**Headers**: 
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "answer": "A form of government where people vote for their leaders."
}
```

**Expected Response** (200 OK):
```json
{
  "message": "Answer submitted successfully",
  "next_question_available": true
}
```

---

### **Step 8: Get Final Question**
**Method**: `GET`  
**URL**: `http://localhost:8000/api/attempts/1/current_question/`  
**Headers**: None needed

**Expected Response** (200 OK):
```json
{
  "question_id": 3,
  "question_type": "mcq",
  "question_text": "What is 2 + 2?",
  "points": 5,
  "choices": [
    {
      "id": 5,
      "content": "3"
    },
    {
      "id": 6,
      "content": "4"
    },
    {
      "id": 7,
      "content": "5"
    }
  ],
  "question_number": 3,
  "total_questions": 3
}
```

---

### **Step 9: Submit Final Answer**
**Method**: `POST`  
**URL**: `http://localhost:8000/api/attempts/1/answer/`  
**Headers**: 
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "choice_id": 6
}
```

**Expected Response** (200 OK):
```json
{
  "message": "Quiz completed!",
  "next_question_available": false
}
```

---

### **Step 10: View Results**
**Method**: `GET`  
**URL**: `http://localhost:8000/api/attempts/1/results/`  
**Headers**: None needed

**Expected Response** (200 OK):
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
    },
    {
      "question_text": "Explain the concept of democracy.",
      "is_correct": true,
      "points_earned": 10,
      "student_answer": "A form of government where people vote for their leaders."
    },
    {
      "question_text": "What is 2 + 2?",
      "is_correct": true,
      "points_earned": 5,
      "correct_answer": "4",
      "student_answer": "4"
    }
  ]
}
```

---

## 🔧 **Setup Commands**

Before testing, you'll need to:

1. **Start Django server**:
```bash
cd api
source ../.venv/bin/activate
python manage.py runserver
```

2. **Run migrations** (if needed):
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Create test data** (if needed):
```bash
python manage.py shell
```
Then create some test quizzes and questions.

## 📝 **Postman Collection Setup**

1. Create a new collection called "Lizard Quizzard Wizard API"
2. Set base URL variable: `{{base_url}}` = `http://localhost:8000`
3. Use `{{base_url}}/api/...` for all URLs
4. Save student_id and attempt_id as variables after each response

## ⚠️ **Important Notes**

- **Student ID**: Save the `student.id` from registration/login response
- **Attempt ID**: Save the `id` from the attempt creation response
- **Question Types**: 
  - `mcq` = Multiple choice (use `choice_id`)
  - `ftq` = Free text (use `answer`)
- **Security**: Correct answers are hidden during quiz, only shown in results 