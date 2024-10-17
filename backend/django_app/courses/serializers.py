from rest_framework import serializers

from courses.models import Course, CourseUserStatus


class CourseListSerializer(serializers.ModelSerializer):
    language = serializers.CharField(source="language.name")
    category = serializers.CharField(source="category.name")

    class Meta:
        model = Course
        fields = ("id", "name", "miniature", "language", "category")


class CourseDetailSerializer(CourseListSerializer):
    class Meta:
        model = Course
        fields = (
            "id",
            "name",
            "miniature",
            "language",
            "category",
            "description",
            "attachment",
            "attachment_extension",
        )


class CourseStartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseUserStatus
        fields = (
            "id",
            "course",
            "user",
            "installation_id",
            "start_date",
        )

    def to_representation(self, instance):
        to_representation = super().to_representation(instance)
        del to_representation["user"]
        del to_representation["installation_id"]
        return to_representation


class CourseFinishSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseUserStatus
        fields = (
            "id",
            "course",
            "finish_date",
        )


class CourseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseUserStatus
        fields = (
            "id",
            "course",
            "progress",
        )


class CourseStatusDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseUserStatus
        fields = (
            "id",
            "course",
            "start_date",
            "finish_date",
            "progress",
        )
