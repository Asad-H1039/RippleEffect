from django.urls import path

from courses.views import (
    CourseDetailAPIView,
    CourseFinishAPIView,
    CourseListAPIView,
    CourseStartAPIView,
    CourseStatusAPIView,
    CourseUpdateProgressAPIView,
)

urlpatterns = [
    path("<int:pk>/", CourseDetailAPIView.as_view(), name="courses-detail"),
    path(
        "<int:pk>/start/", CourseStartAPIView.as_view({"post": "start_course"}), name="start-course"
    ),
    path(
        "<int:pk>/progress/",
        CourseUpdateProgressAPIView.as_view({"patch": "update_progress"}),
        name="update-course-progress",
    ),
    path(
        "<int:pk>/finish/",
        CourseFinishAPIView.as_view({"patch": "finish_course"}),
        name="finish-course",
    ),
    path(
        "<int:pk>/status/",
        CourseStatusAPIView.as_view({"get": "get_course_status"}),
        name="course-status",
    ),
    path("", CourseListAPIView.as_view(), name="courses-list"),
]
