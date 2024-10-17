from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView, get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.viewsets import ViewSet

from courses.models import Course, CourseUserStatus
from courses.serializers import (
    CourseDetailSerializer,
    CourseFinishSerializer,
    CourseListSerializer,
    CourseProgressSerializer,
    CourseStartSerializer,
    CourseStatusDetailsSerializer,
)


class CourseListAPIView(ListAPIView):
    #permission_classes = [IsAuthenticated]
    queryset = Course.objects.all()
    serializer_class = CourseListSerializer


class CourseDetailAPIView(RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer


class CourseStatusMixin(ViewSet):
    def get_field(self, request: Request, field: str) -> str:
        if field not in request.data or isinstance(request.data, str):
            raise ValidationError({field: ["This field is required."]})
        return request.data[field]

    def get_object(self, request, course_pk: int) -> CourseUserStatus:
        try:
            if request.user.is_authenticated:
                return CourseUserStatus.objects.get(user=request.user, course__pk=course_pk)
            return get_object_or_404(
                CourseUserStatus,
                course__pk=course_pk,
                installation_id=self.get_field(request, "installation_id"),
            )
        except CourseUserStatus.DoesNotExist:
            raise NotFound()


class CourseStartAPIView(CourseStatusMixin):
    serializer_class = CourseStartSerializer

    def start_course(self, request: Request, pk: int) -> Response:
        data = {
            "course": pk,
            "user": None,
            "installation_id": request.data.get("installation_id")
            if not isinstance(request.data, str)
            else None,
        }
        if request.user.is_authenticated:
            data["user"] = request.user.pk
        else:
            data["installation_id"] = self.get_field(request, "installation_id")
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=HTTP_200_OK)


class CourseFinishAPIView(CourseStatusMixin):
    serializer_class = CourseFinishSerializer

    def finish_course(self, request: Request, pk: int) -> Response:
        data = {"course": pk, "finish_date": timezone.now()}
        serializer = self.serializer_class(data=data, instance=self.get_object(request, pk))
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=HTTP_200_OK)


class CourseUpdateProgressAPIView(CourseStatusMixin):
    serializer_class = CourseProgressSerializer

    def update_progress(self, request: Request, pk: int) -> Response:
        data = {"course": pk, "progress": self.get_field(request, "progress")}
        serializer = self.serializer_class(data=data, instance=self.get_object(request, pk))
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=HTTP_200_OK)


class CourseStatusAPIView(CourseStatusMixin):
    serializer_class = CourseStatusDetailsSerializer

    def get_course_status(self, request: Request, pk: int) -> Response:
        serializer = self.serializer_class(instance=self.get_object(request, pk))
        return Response(serializer.data, status=HTTP_200_OK)
