import logging
import os

import dspy
import openai
from qdrant_client import QdrantClient

logger = logging.getLogger(__name__)

openai_client = openai.Client(api_key=os.getenv("OPENAI_API_KEY"))
client = QdrantClient(url=os.getenv("QDRANT_HOST"), api_key=os.getenv("QDRANT_API_KEY"))


def get_embeddings(question):
    try:
        response = (
            openai_client.embeddings.create(
                input=[question],
                model=os.getenv("OPENAI_EMBEDDING_MODEL"),
            )
            .data[0]
            .embedding
        )
        return response
    except Exception as e:
        logger.error(f"Error creating embeddings: {e}")
        raise


def search_context(embedding):
    try:
        return client.search(collection_name=os.getenv("QDRANT_COLLECTION"), query_vector=embedding)
    except Exception as e:
        logger.error(f"Error searching context in Qdrant: {e}")
        raise


def extract_context(question):
    embedding = get_embeddings(question)
    context = search_context(embedding)
    return context


class QCA(dspy.Signature):
    """Answer the question based on the course context. Answer in the language the user
    asks for or in the language the user asks for"""

    question = dspy.InputField()
    context = dspy.InputField()
    answer = dspy.OutputField()


class RAG(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate_answer = dspy.ChainOfThought(QCA, max_tokens=4000)

    def forward(self, question):
        context = extract_context(question)
        prediction = self.generate_answer(context=context, question=question)
        return dspy.Prediction(context=context, answer=prediction.answer)
