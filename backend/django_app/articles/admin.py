from django.contrib import admin
from articles.models import Article, Category, Language

admin.site.register([Language, Category,])

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    model = Article

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj)
        if obj:
            readonly_fields = readonly_fields + ("attachment",)
        return readonly_fields
