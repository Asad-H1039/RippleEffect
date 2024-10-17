from django.urls import path

from chatbot.views import AskChatbotView

urlpatterns = [
    path("ask/", AskChatbotView.as_view(), name="ask_chatbot"),
]
