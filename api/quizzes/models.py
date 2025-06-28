from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# --- Quiz Model ---
class Quiz(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    @property
    def total_points(self):
        """Calculates the total points for all questions in the quiz."""
        mcq_points = self.mcqs.aggregate(total=models.Sum('points'))['total'] or 0
        ftq_points = self.ftqs.aggregate(total=models.Sum('points'))['total'] or 0
        return mcq_points + ftq_points

# --- Student Model ---
class Student(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

# --- Free Text Question (FTQ) Model ---
class FTQ(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='ftqs', on_delete=models.CASCADE, null=True)
    question = models.TextField()
    points = models.PositiveIntegerField()

    def __str__(self):
        return self.question

# --- Multiple Choice Question (MCQ) Model ---
class MCQ(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='mcqs', on_delete=models.CASCADE, null=True)
    question = models.TextField()
    points = models.PositiveIntegerField(default=5)

    def __str__(self):
        return self.question

# --- Choice Model (for MCQ) ---
class Choice(models.Model):
    content = models.CharField(max_length=255)
    mcq = models.ForeignKey(MCQ, related_name='choices', on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.content

# --- Attempt Model ---
class Attempt(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    time_start = models.DateTimeField(auto_now_add=True)
    time_end = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    # Polymorphic current_question (can be MCQ or FTQ)
    current_question_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
    current_question_id = models.PositiveIntegerField(null=True, blank=True)
    current_question = GenericForeignKey('current_question_type', 'current_question_id')
    # Optional: duration (pre-calculated)
    duration = models.DurationField(null=True, blank=True)

    def __str__(self):
        return f"Attempt by {self.student} on {self.quiz}"

# --- Answer Model ---
class Answer(models.Model):
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE)
    # Polymorphic question (can be MCQ or FTQ)
    question_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    question_id = models.PositiveIntegerField()
    question = GenericForeignKey('question_type', 'question_id')
    selected_choice = models.ForeignKey(Choice, null=True, blank=True, on_delete=models.SET_NULL)
    free_text_response = models.TextField(null=True, blank=True)
    is_correct = models.BooleanField()

    def __str__(self):
        return f"Answer to {self.question} in {self.attempt}"
