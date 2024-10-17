import dspy


class QA(dspy.Signature):
    """Answer the question. Answer in the language
    the user asks for or in the language the user asks for"""

    question = dspy.InputField()
    answer = dspy.OutputField()
