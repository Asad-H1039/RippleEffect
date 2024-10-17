import os

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from utils.files import hash_file


def upload_to_course_attachments(instance: "Course", filename: str) -> str:
    hashed_file = hash_file(instance.attachment.open())
    return f"courses/{instance.name}/attachments/{hashed_file}/{filename}"


def upload_to_course_miniatures(instance: "Course", filename: str) -> str:
    hashed_file = hash_file(instance.miniature.open())
    return f"courses/{instance.name}/miniatures/{hashed_file}/{filename}"


def validate_pdf_file(value):
    if not value.name.endswith((".pdf", ".mp4", ".avi", ".mpeg-4", ".mov")):
        raise ValidationError("File type must be one of .pdf, .mp4, .avi, .mpeg-4, .mov")


class Category(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Language(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Course(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    attachment = models.FileField(
        upload_to=upload_to_course_attachments, validators=[validate_pdf_file]
    )
    miniature = models.ImageField(upload_to=upload_to_course_miniatures)

    def __str__(self):
        return self.name

    @property
    def attachment_extension(self) -> str:
        name, extension = os.path.splitext(self.attachment.name)
        return extension


class CourseUserStatus(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, blank=True)
    installation_id = models.CharField(max_length=255, null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True, editable=False)
    finish_date = models.DateTimeField(null=True, blank=True)
    progress = models.FloatField(
        default=0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
    )

    class Meta:
        unique_together = (
            (
                "installation_id",
                "course",
            ),
            ("user", "course"),
        )
        constraints = [
            models.CheckConstraint(
                check=models.Q(installation_id__isnull=False) | models.Q(user__isnull=False),
                name="installation_id_and_user_cannot_be_null",
            )
        ]
