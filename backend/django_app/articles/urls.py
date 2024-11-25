from django.urls import path
from articles.views import ArticleListAPIView, ArticleDetailAPIView, ArticlesByCategoryAPIView, CategoryListAPIView, FeaturedArticlesView

urlpatterns = [
    path("", ArticleListAPIView.as_view(), name="articles-list"),
    path("<int:pk>/", ArticleDetailAPIView.as_view(), name="articles-detail-edit-delete"),
    path("category/<int:article_id>/", ArticlesByCategoryAPIView.as_view(), name="articles-by-category"),
    path("categories/", CategoryListAPIView.as_view(), name="categories-list"),
    path("featured/", FeaturedArticlesView.as_view(), name="featured-articles"),
]
