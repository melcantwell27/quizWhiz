# Quiz Wizard

**Quiz Wizard** is a web application for interactive quizzes with real-time feedback. Students can select quizzes, answer multiple-choice or free-text questions, and view detailed feedback upon submission.

## Features

### 📚 Quiz Selection
- View a list of available quizzes.
- Quizzes and their questions are seeded in the database.
- [Example seed file](backend/migrations/02__seed.sql).

### 📝 Quiz Attempt
- Answer questions one at a time.
- Questions can have varying point values.
- Resume progress even after leaving the browser.

### 🎯 Feedback
- View the number of correct answers vs. total questions.
- Points earned and total possible points.
- Highlight incorrect answers with the correct ones.
- Total time taken to complete the quiz.

---

## Technologies Used

### Backend
- **Python/Django**: Robust ORM and built-in features for quick setup.
- **PostgreSQL**: Scalable and reliable database for storing quiz data.

### Frontend
- **Next.js**: For directory-based routing and optimized development.
- **Material-UI**: For accessible, consistent, and customizable components.
- **State Management**: Zustand with persistence middleware for lightweight and efficient state handling.

---

## Design Decisions and Trade-offs

1. **Database Schema**
   - **Separated Models for MCQ and FTQ**:
     - ✅ Cleaner code and type safety.
     - ❌ More complex queries.
   - **Choice Model for MCQ**:
     - ✅ Easy tracking/analytics and modification.
     - ❌ Additional database tables.

2. **Points System**
   - Points stored per question with a computed total on the quiz.
   - ✅ Flexible allocation, easy modification.
   - ❌ Requires consistency checks.

3. **Quiz Progress**
   - Local storage used for quiz progress.
   - ✅ Offline support and faster resume.
   - ❌ Security concerns and potential data loss.

4. **Frontend**
   - Zustand chosen over Redux/Context for simplicity and TypeScript support.
   - Material-UI used for rapid development with custom styling.

---

## Getting Started

### Prerequisites
- **Node.js** and **npm** for frontend development.
- **Python 3.x** and **PostgreSQL** for backend development.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/quiz-wizard.git
