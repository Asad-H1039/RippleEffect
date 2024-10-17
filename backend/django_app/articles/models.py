import os
from django.core.exceptions import ValidationError
from django.db import models
from utils.files import hash_file

def upload_to_article_attachments(instance: "Article", filename: str) -> str:
    return f"articles/{instance.title}/attachments/{filename}"

def upload_to_article_miniatures(instance: "Article", filename: str) -> str:
    hashed_file = hash_file(instance.miniature.open())
    return f"articles/{instance.title}/miniatures/{hashed_file}/{filename}"

def validate_pdf_file(value):
    if not value.name.endswith(".pdf"):
        raise ValidationError("File type must be a .pdf")

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

class Article(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    attachment = models.FileField(
        upload_to=upload_to_article_attachments, validators=[validate_pdf_file]
    )
    miniature = models.ImageField(upload_to=upload_to_article_miniatures,null=True, blank=True)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    @property
    def attachment_extension(self) -> str:
        name, extension = os.path.splitext(self.attachment.name)
        return extension
