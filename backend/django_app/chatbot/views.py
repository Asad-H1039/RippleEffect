from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from chatbot.agents import get_bot_response
from chatbot.utils import save_question_to_session


# test
class AskChatbotView(APIView):
    @swagger_auto_schema(
        operation_description="Submit a question to the chatbot",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['question'],
            properties={
                'question': openapi.Schema(type=openapi.TYPE_STRING, description='The question to ask the chatbot'),
            },
        ),
        responses={200: openapi.Response('Answer to the question')}
    )
    def post(self, request, format=None):
        question = request.data.get("question")
        if not question:
            return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        print('question: ', question)
        answer = get_bot_response(question)
        print('answer: ', answer)
        save_question_to_session(request, question, answer)
        return Response(answer, status=status.HTTP_200_OK)
