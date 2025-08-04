# type: ignore
from django.shortcuts import render
from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from .models import Quiz, MCQ, FTQ, Attempt, Answer, Student, Choice
from .serializers import (
    QuizListSerializer, QuizDetailSerializer, AttemptSerializer, 
    AnswerSerializer, CurrentQuestionSerializer, AttemptResultsSerializer,
    ChoiceQuizSerializer, MCQResultsSerializer, FTQSerializer, QuizWithAnswersSerializer,
    StudentSerializer
)

# Create your views here.

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    It uses a different serializer for each action.
    """
    queryset = Quiz.objects.all().order_by('name')

    def get_serializer_class(self):
        """
        Choose a serializer based on the action being performed.
        - 'list' action gets the simple serializer.
        - 'retrieve' action gets the detailed serializer.
        """
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizListSerializer
    
    @action(detail=True, methods=['get'])
    def with_answers(self, request, pk=None):
        """
        Get quiz details with correct answers (for results view).
        
        This endpoint should only be accessible after quiz completion to prevent
        cheating. The frontend should only call this when showing results.
        
        URL: /api/quizzes/{id}/with_answers/
        Returns: Quiz with correct answers visible
        """
        quiz = self.get_object()
        serializer = QuizWithAnswersSerializer(quiz)
        return Response(serializer.data)

class AttemptViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing quiz attempts.
    """
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer
    
    def create(self, request, *args, **kwargs):
        """Start a new quiz attempt."""
        quiz_id = request.data.get('quiz_id')
        student_id = request.data.get('student_id')
        
        try:
            quiz = Quiz.objects.get(id=quiz_id)
            student = Student.objects.get(id=student_id)
        except (Quiz.DoesNotExist, Student.DoesNotExist):
            return Response(
                {'error': 'Quiz or Student not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if there's already an incomplete attempt
        existing_attempt = Attempt.objects.filter(
            student=student, 
            quiz=quiz, 
            time_end__isnull=True
        ).first()
        
        if existing_attempt:
            # Resume existing attempt
            serializer = self.get_serializer(existing_attempt)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Create new attempt
        attempt = Attempt.objects.create(
            student=student,
            quiz=quiz,
            current_question_type=ContentType.objects.get_for_model(MCQ),
            current_question_id=1
        )
        
        serializer = self.get_serializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def current_question(self, request, pk=None):
        """Get the current question for an attempt."""
        attempt = self.get_object()
        
        if attempt.time_end:
            return Response(
                {'error': 'Quiz already completed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get all questions for this quiz
        mcqs = list(attempt.quiz.mcqs.all())
        ftqs = list(attempt.quiz.ftqs.all())
        all_questions = mcqs + ftqs
        
        if not all_questions:
            return Response(
                {'error': 'No questions found for this quiz'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Find current question index
        current_question = None
        question_number = 1
        
        for question in all_questions:
            if (attempt.current_question_type == ContentType.objects.get_for_model(type(question)) and 
                attempt.current_question_id == question.id):
                current_question = question
                break
            question_number += 1
        
        if not current_question:
            # Start from the first question
            current_question = all_questions[0]
            question_number = 1
            attempt.current_question_type = ContentType.objects.get_for_model(type(current_question))
            attempt.current_question_id = current_question.id
            attempt.save()
        
        # Prepare response data
        data = {
            'question_id': current_question.id,
            'question_type': current_question.__class__.__name__.lower(),
            'question_text': current_question.question,
            'points': current_question.points,
            'question_number': question_number,
            'total_questions': len(all_questions),
            'quiz_id': attempt.quiz.id
        }
        
        # Add choices for MCQ
        if isinstance(current_question, MCQ):
            choices_serializer = ChoiceQuizSerializer(current_question.choices.all(), many=True)
            data['choices'] = choices_serializer.data
        
        serializer = CurrentQuestionSerializer(data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def answer(self, request, pk=None):
        """Submit an answer for the current question."""
        attempt = self.get_object()
        
        if attempt.time_end:
            return Response(
                {'error': 'Quiz already completed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get current question
        current_question = attempt.current_question
        if not current_question:
            return Response(
                {'error': 'No current question found'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if answer already exists
        existing_answer = Answer.objects.filter(
            attempt=attempt,
            question_type=attempt.current_question_type,
            question_id=attempt.current_question_id
        ).first()
        
        # Process the answer
        is_correct = False
        selected_choice = None
        free_text_response = None
        
        if isinstance(current_question, MCQ):
            choice_id = request.data.get('choice_id')
            if choice_id:
                try:
                    selected_choice = Choice.objects.get(id=choice_id, mcq=current_question)
                    is_correct = selected_choice.is_correct
                except Choice.DoesNotExist:
                    return Response(
                        {'error': 'Invalid choice'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
        elif isinstance(current_question, FTQ):
            free_text_response = request.data.get('answer')
            # For FTQ, we'd need a way to determine correctness
            # For now, we'll mark as correct if answer is provided
            is_correct = bool(free_text_response)
        
        # Create or update answer
        if existing_answer:
            existing_answer.selected_choice = selected_choice
            existing_answer.free_text_response = free_text_response
            existing_answer.is_correct = is_correct
            existing_answer.save()
        else:
            Answer.objects.create(
                attempt=attempt,
                question_type=attempt.current_question_type,
                question_id=attempt.current_question_id,
                selected_choice=selected_choice,
                free_text_response=free_text_response,
                is_correct=is_correct
            )
        
        # Move to next question or complete quiz
        mcqs = list(attempt.quiz.mcqs.all())
        ftqs = list(attempt.quiz.ftqs.all())
        all_questions = mcqs + ftqs
        
        current_index = -1
        for i, question in enumerate(all_questions):
            if (attempt.current_question_type == ContentType.objects.get_for_model(type(question)) and 
                attempt.current_question_id == question.id):
                current_index = i
                break
        
        if current_index < len(all_questions) - 1:
            # Move to next question
            next_question = all_questions[current_index + 1]
            attempt.current_question_type = ContentType.objects.get_for_model(type(next_question))
            attempt.current_question_id = next_question.id
            attempt.save()
            
            return Response({
                'message': 'Answer submitted successfully',
                'next_question_available': True
            })
        else:
            # Quiz completed
            attempt.time_end = timezone.now()
            attempt.save()
            
            return Response({
                'message': 'Quiz completed!',
                'next_question_available': False
            })
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """Get detailed results for a completed attempt."""
        attempt = self.get_object()
        
        if not attempt.time_end:
            return Response(
                {'error': 'Quiz not yet completed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate final score
        total_points_earned = 0
        for answer in attempt.answers.filter(is_correct=True):
            if answer.question_type.model == 'mcq':
                mcq = MCQ.objects.get(id=answer.question_id)
                total_points_earned += mcq.points
            elif answer.question_type.model == 'ftq':
                ftq = FTQ.objects.get(id=answer.question_id)
                total_points_earned += ftq.points
        
        attempt.score = (total_points_earned / attempt.quiz.total_points) * 100
        attempt.save()
        
        serializer = AttemptResultsSerializer(attempt)
        return Response(serializer.data)

class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing students.
    Registration requires name+email, login requires email only.
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    def create(self, request, *args, **kwargs):
        """Register a new student (requires name + email)."""
        email = request.data.get('email')
        name = request.data.get('name')
        
        if not email or not name:
            return Response(
                {'error': 'Both email and name are required for registration'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if student already exists
        try:
            student = Student.objects.get(email=email)
            return Response(
                {'error': 'Student with this email already exists. Please login instead.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Student.DoesNotExist:
            # Create new student
            student = Student.objects.create(name=name, email=email)
            serializer = self.get_serializer(student)
            return Response({
                'message': 'Student registered successfully!',
                'student': serializer.data
            }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login existing student (requires email only)."""
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email is required for login'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            student = Student.objects.get(email=email)
            serializer = self.get_serializer(student)
            return Response({
                'message': 'Login successful',
                'student': serializer.data
            }, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student not found. Please register first.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
