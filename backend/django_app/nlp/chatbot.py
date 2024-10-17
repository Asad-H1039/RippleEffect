import os

from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import StrOutputParser
from langchain.schema.messages import AIMessage, HumanMessage
from langchain.schema.runnable import RunnablePassthrough
from langchain.vectorstores import Qdrant
from qdrant_client import QdrantClient

QDRANT_HOST = os.getenv("QDRANT_HOST")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")


class Chatbot:
    """
    A chatbot class that encapsulates the functionality for processing
    questions and maintaining chat history.

    Attributes:
        client (QdrantClient): Client to interact with Qdrant vector database.
        embeddings (OpenAIEmbeddings): OpenAI embeddings for language processing.
        doc_store (Qdrant): Document store for managing and retrieving documents.
        retriever: Retrieval component for the RAG Chain.
        llm (ChatOpenAI): Language model instance for processing questions.
        chat_history (list): A list to keep track of the conversation history.
        condense_q_chain: Chain for condensing questions.
        qa_chain: Chain for processing QA tasks.
        rag_chain: Main RAG chain for the chatbot.
    """

    def __init__(self):
        self.client = self._initialize_qdrant_client()
        self.embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
        self.doc_store = self._initialize_document_store()
        self.retriever = self.doc_store.as_retriever(
            search_type="similarity", search_kwargs={"k": 4}
        )
        self.llm = ChatOpenAI(model_name=OPENAI_MODEL, temperature=0)
        # If we want to use Bedrock here
        # self.llm = Bedrock(credentials_profile_name="bedrock-admin", model_id=BEDROCK_MODEL)
        self.chat_history = []

        # Setup prompt chains
        self.condense_q_chain = self._setup_condense_q_chain()
        self.qa_chain = self._setup_qa_chain()
        self.rag_chain = self._setup_rag_chain()

    def _initialize_qdrant_client(self):
        return QdrantClient(QDRANT_HOST, port=6333, api_key=QDRANT_API_KEY)

    def _initialize_document_store(self):
        return Qdrant(
            client=self.client, embeddings=self.embeddings, collection_name="tai-collection"
        )

    def _setup_condense_q_chain(self):
        condense_q_system_prompt = """Given a chat history and the latest user question \
            which might reference the chat history, formulate a standalone question \
            which can be understood without the chat history. Do NOT answer the question, \
            just reformulate it if needed and otherwise return it as is."""
        condense_q_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", condense_q_system_prompt),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "{question}"),
            ]
        )
        return condense_q_prompt | self.llm | StrOutputParser()

    def _setup_qa_chain(self):
        qa_system_prompt = """You are an assistant specialized in explaining legal \
            and legislative concepts to the general public. Use the following pieces \
            of retrieved context to answer the question.  \
            Your task is to make complex legal language understandable using simple, clear, \
            and concise words. When providing an answer, think about how you would explain it \
            to someone without a legal background. Use the context provided to accurately \
            answer the question, but remember to keep your language straightforward and easy \
            to follow. If you don't know the answer, just say that you don't know. \
            Remember:Focus on clarity and simplicity.
            \
            {context}
            """

        qa_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", qa_system_prompt),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "{question}"),
            ]
        )
        return qa_prompt | self.llm

    def _setup_rag_chain(self):
        def condense_question(input: dict):
            if input.get("chat_history"):
                return self.condense_q_chain
            else:
                return input["question"]

        return (
            RunnablePassthrough.assign(
                context=condense_question | self.retriever | self._format_docs
            )
            | self.qa_chain
        )

    @staticmethod
    def _format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    def process_question(self, question):
        rag_input = {"question": question, "chat_history": [msg for msg in self.chat_history]}

        responses = self.rag_chain.stream(rag_input)
        response_text = ""

        for response_chunk in responses:
            if hasattr(response_chunk, "content"):
                content = response_chunk.content
            else:
                content = str(response_chunk)
            response_text += content

        self.chat_history.append(HumanMessage(content=question))
        self.chat_history.append(AIMessage(content=response_text))

        return response_text


# chatbot = Chatbot()

# chatbot.process_question("What is this petition for?")
