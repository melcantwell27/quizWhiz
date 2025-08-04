from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, AttemptViewSet, StudentViewSet

# A router automatically generates the URL patterns for a viewset.
router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'attempts', AttemptViewSet, basename='attempt')
router.register(r'students', StudentViewSet, basename='student')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
] 