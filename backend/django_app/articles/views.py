from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from articles.models import Article
from articles.models import Category
from rest_framework.response import Response
from rest_framework import status
from articles.serializers import ArticleListSerializer, ArticleDetailSerializer, CategorySerializer, FeaturedArticleSerializer

class ArticleListAPIView(ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleListSerializer

class ArticleDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleDetailSerializer

class ArticlesByCategoryAPIView(ListAPIView):
    serializer_class = ArticleListSerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return Article.objects.filter(category__id=category_id)

    def get(self, request, *args, **kwargs):
        articles = self.get_queryset()
        if articles.exists():
            serializer = self.get_serializer(articles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "No articles found in this category."}, status=status.HTTP_404_NOT_FOUND)

class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class FeaturedArticlesView(ListAPIView):
    serializer_class = FeaturedArticleSerializer

    def get_queryset(self):
        return Article.objects.filter(featured=True)

    def get(self, request, *args, **kwargs):
        articles = self.get_queryset()
        if articles.exists():
            serializer = self.get_serializer(articles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "No featured articles found."}, status=status.HTTP_404_NOT_FOUND)
