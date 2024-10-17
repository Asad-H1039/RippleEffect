from django.contrib import admin

from courses.models import Category, Course, CourseUserStatus, Language

admin.site.register([Language, Category, CourseUserStatus])


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    model = Course

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj)
        if obj:
            readonly_fields = readonly_fields + ("attachment",)
        return readonly_fields
