from rest_framework import serializers
from .models import Quiz, MCQ, Choice, FTQ, Attempt, Answer, Student

# --- List Serializer (Simple) ---
class QuizListSerializer(serializers.ModelSerializer):
    """
    Serializes a Quiz for the list view. Only shows basic info.
    """
    class Meta:
        model = Quiz
        fields = ['id', 'name']

# --- Detail Serializers (Comprehensive) ---
class ChoiceQuizSerializer(serializers.ModelSerializer):
    """Serializes answer choices for an MCQ during the quiz (hides correct answer)."""
    class Meta:
        model = Choice
        fields = ['id', 'content']

class ChoiceResultsSerializer(serializers.ModelSerializer):
    """Serializes answer choices for an MCQ in results (shows correct answer)."""
    class Meta:
        model = Choice
        fields = ['id', 'content', 'is_correct']

class MCQQuizSerializer(serializers.ModelSerializer):
    """Serializes an MCQ for the quiz (hides correct answers)."""
    choices = ChoiceQuizSerializer(many=True, read_only=True)
    class Meta:
        model = MCQ
        fields = ['id', 'question', 'points', 'choices']

class MCQResultsSerializer(serializers.ModelSerializer):
    """Serializes an MCQ for results (shows correct answers)."""
    choices = ChoiceResultsSerializer(many=True, read_only=True)
    class Meta:
        model = MCQ
        fields = ['id', 'question', 'points', 'choices']

class FTQSerializer(serializers.ModelSerializer):
    """Serializes a Free Text Question."""
    class Meta:
        model = FTQ
        fields = ['id', 'question', 'points']

class QuizDetailSerializer(serializers.ModelSerializer):
    """
    The "master" serializer for the quiz detail view.
    It nests all related questions using their `related_name`.
    """
    mcqs = MCQQuizSerializer(many=True, read_only=True)
    ftqs = FTQSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'name', 'mcqs', 'ftqs']

class QuizWithAnswersSerializer(serializers.ModelSerializer):
    """
    Serializer for quiz with correct answers (for results view).
    This should only be used after quiz completion.
    """
    mcqs = MCQResultsSerializer(many=True, read_only=True)
    ftqs = FTQSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'name', 'mcqs', 'ftqs']

# --- Attempt and Answer Serializers ---
class StudentSerializer(serializers.ModelSerializer):
    """Serializes student information."""
    class Meta:
        model = Student
        fields = ['id', 'name', 'email']

class AnswerSerializer(serializers.ModelSerializer):
    """Serializes an answer for creating/updating answers."""
    class Meta:
        model = Answer
        fields = ['question_type', 'question_id', 'selected_choice', 'free_text_response']

class AttemptSerializer(serializers.ModelSerializer):
    """Serializes an attempt for creating new attempts."""
    student = StudentSerializer(read_only=True)
    quiz = QuizListSerializer(read_only=True)
    
    class Meta:
        model = Attempt
        fields = ['id', 'student', 'quiz', 'time_start', 'time_end', 'score', 'duration']
        read_only_fields = ['time_start', 'time_end', 'score', 'duration']

class CurrentQuestionSerializer(serializers.Serializer):
    """Serializes the current question for an attempt."""
    question_id = serializers.IntegerField()
    question_type = serializers.CharField()
    question_text = serializers.CharField()
    points = serializers.IntegerField()
    choices = ChoiceQuizSerializer(many=True, required=False)
    question_number = serializers.IntegerField()
    total_questions = serializers.IntegerField()

class AttemptResultsSerializer(serializers.ModelSerializer):
    """Serializes detailed results for a completed attempt."""
    student = StudentSerializer(read_only=True)
    quiz = QuizListSerializer(read_only=True)
    total_questions = serializers.SerializerMethodField()
    correct_answers = serializers.SerializerMethodField()
    total_points_earned = serializers.SerializerMethodField()
    total_possible_points = serializers.SerializerMethodField()
    time_taken = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()
    
    class Meta:
        model = Attempt
        fields = [
            'id', 'student', 'quiz', 'time_start', 'time_end', 'score',
            'total_questions', 'correct_answers', 'total_points_earned',
            'total_possible_points', 'time_taken', 'answers'
        ]
    
    def get_total_questions(self, obj):
        return obj.quiz.mcqs.count() + obj.quiz.ftqs.count()
    
    def get_correct_answers(self, obj):
        return obj.answers.filter(is_correct=True).count()
    
    def get_total_points_earned(self, obj):
        total = 0
        for answer in obj.answers.filter(is_correct=True):
            if answer.question_type.model == 'mcq':
                mcq = MCQ.objects.get(id=answer.question_id)
                total += mcq.points
            elif answer.question_type.model == 'ftq':
                ftq = FTQ.objects.get(id=answer.question_id)
                total += ftq.points
        return total
    
    def get_total_possible_points(self, obj):
        return obj.quiz.total_points
    
    def get_time_taken(self, obj):
        if obj.time_end and obj.time_start:
            return obj.time_end - obj.time_start
        return None
    
    def get_answers(self, obj):
        answers_data = []
        for answer in obj.answers.all():
            answer_data = {
                'question_text': str(answer.question),
                'is_correct': answer.is_correct,
                'points_earned': 0
            }
            
            # Calculate points earned for this answer
            if answer.is_correct:
                if answer.question_type.model == 'mcq':
                    mcq = MCQ.objects.get(id=answer.question_id)
                    answer_data['points_earned'] = mcq.points
                elif answer.question_type.model == 'ftq':
                    ftq = FTQ.objects.get(id=answer.question_id)
                    answer_data['points_earned'] = ftq.points
            
            # Add correct answer information
            if answer.question_type.model == 'mcq':
                mcq = MCQ.objects.get(id=answer.question_id)
                correct_choice = mcq.choices.filter(is_correct=True).first()
                answer_data['correct_answer'] = correct_choice.content if correct_choice else None
                answer_data['student_answer'] = answer.selected_choice.content if answer.selected_choice else None
            elif answer.question_type.model == 'ftq':
                answer_data['student_answer'] = answer.free_text_response
                # For FTQ, we'd need a way to store correct answers or use manual grading
            
            answers_data.append(answer_data)
        
        return answers_data 