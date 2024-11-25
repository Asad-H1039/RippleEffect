from rest_framework import serializers
from articles.models import Article
from articles.models import Category
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ArticleListSerializer(serializers.ModelSerializer):
    language = serializers.CharField(source="language.name")
    category = serializers.CharField(source="category.name")
    category_id = serializers.IntegerField(source="category.id")
    
    class Meta:
        model = Article
        fields = ("id", "title", "miniature", "description", "language","category_id", "category", "featured", "attachment")

class FeaturedArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ("id", "title", "miniature", "description", "language", "category", "featured", "attachment")

class ArticleDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = (
            "id",
            "title",
            "miniature",
            "description",
            "language",
            "category",
            "attachment",
            "attachment_extension",
        )
