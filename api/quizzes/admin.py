from django.contrib import admin
from .models import Quiz, Student, MCQ, Choice, FTQ, Attempt, Answer

# To make the admin interface more user-friendly, we can customize how models are displayed.

class ChoiceInline(admin.TabularInline):
    """
    Allows editing Choices directly within the MCQ admin page.
    This is more intuitive than managing them separately.
    """
    model = Choice
    extra = 3 # Show 3 empty choice forms by default

@admin.register(MCQ)
class MCQAdmin(admin.ModelAdmin):
    """Custom admin view for Multiple Choice Questions."""
    list_display = ('question', 'quiz')
    inlines = [ChoiceInline]

@admin.register(FTQ)
class FTQAdmin(admin.ModelAdmin):
    """Custom admin view for Free Text Questions."""
    list_display = ('question', 'quiz', 'points')

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    """Custom admin view for Quizzes."""
    list_display = ('name',)
    # You could add inlines for MCQs and FTQs here if you wanted to edit questions from the quiz page
    # but it can get crowded. Managing them separately is often cleaner.

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    """Custom admin view for Students."""
    list_display = ('name', 'email')
    search_fields = ('name', 'email')

# We can also register the other models with a simple registration
# if we don't need special customizations for them yet.
admin.site.register(Attempt)
admin.site.register(Answer)
