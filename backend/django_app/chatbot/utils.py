from rest_framework.request import Request


def save_question_to_session(request: Request, question: str, answer: str) -> None:
    if request.session.get("chatbot"):
        request.session["chatbot"][str(hash(question))] = {"question": question, "answer": answer}
    else:
        request.session["chatbot"] = {str(hash(question)): {"question": question, "answer": answer}}
    request.session.modified = True
