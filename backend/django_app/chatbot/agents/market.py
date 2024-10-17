import dspy
from pydantic import BaseModel, Field


def get_context():
    # todo function to get context from db
    pass


class InputSQL(BaseModel):
    question: str = Field(description="Question")
    sql_tables: list = Field(description="The SQL tables")


class SQLSignature(dspy.Signature):
    """Transform the question into SQL format based on the tables"""

    input: InputSQL = dspy.InputField()
    sql = dspy.OutputField()


class QAPricing(dspy.Signature):
    """Answer the question based on the extracted
    context from Ministry of Agriculture and Animal Resources"""

    question = dspy.InputField()
    context = dspy.InputField()
    sql = dspy.OutputField()


class SQLRAG(dspy.Module):
    def __init__(self, sql_tables):
        super().__init__()
        self.sql_tables = sql_tables
        self.generate_sql = dspy.ChainOfThought(SQLSignature, max_tokens=400)
        self.generate_answer = dspy.ChainOfThought(QAPricing, max_tokens=4000)

    def forward(self, question):
        sql = self.generate_sql(question=question, sql_tables=self.sql_tables)
        context = get_context(sql)
        prediction = self.generate_answer(question=question, context=context)
        return dspy.Prediction(context=context, answer=prediction.answer)
