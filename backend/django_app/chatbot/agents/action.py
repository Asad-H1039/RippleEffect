import logging
import os

import dspy
from pydantic import BaseModel, Field

from chatbot.agents.course import RAG
from chatbot.agents.market import SQLRAG
from chatbot.agents.qa import QA

logger = logging.getLogger(__name__)
dspy.settings.configure(
    lm=dspy.OpenAI(model=os.getenv("OPENAI_MODEL"), api_key=os.getenv("OPENAI_API_KEY"))
)
sql_tables = ["Province", "District", "Market", "Commodity", "Average Price"]


class ActionInput(BaseModel):
    user_input: str = Field(
        ..., description="User input, it can be a question, a request, a statement"
    )
    possible_actions: list = Field(
        ..., description="Possible actions to be taken to answer the user's query"
    )


class Action(dspy.Signature):
    """Based on user input, select one of the possible action to perform"""

    input: ActionInput = dspy.InputField()
    action_to_take = dspy.OutputField()


def action_model_basic(user_message):
    model_answer = dspy.ChainOfThought(QA, max_tokens=4000)
    return model_answer(question=user_message).answer


def action_courses_database(user_message):
    uncompiled_rag = RAG()
    response = uncompiled_rag(user_message)
    return response.answer


def action_market_database(user_message):
    uncompiled_rag = SQLRAG(sql_tables)
    response = uncompiled_rag(user_message)
    return response.answer


possible_actions = {
    "Answer based on model basic": action_model_basic,
    "Answer based on agricultural course content": action_courses_database,
    "Answer based on market price information": action_market_database,
}
