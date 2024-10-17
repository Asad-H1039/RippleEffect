import os
from tempfile import NamedTemporaryFile

from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Qdrant
from langchain_community.document_loaders import PyPDFLoader

from django.db.models.signals import post_save
from django.dispatch import receiver
from articles.models import Article
from utils.text import clean_text

@receiver(post_save, sender=Article)
def fix_order(sender, instance: Article, created: bool, **kwargs):
    if created and instance.attachment_extension == ".pdf":
        with NamedTemporaryFile(delete=False) as tmp_file:
            tmp_file.write(instance.attachment.read())
            tmp_file_path = tmp_file.name

        try:
            loader = PyPDFLoader(file_path=tmp_file_path)
            documents = loader.load()
            [setattr(doc, "page_content", clean_text(doc.page_content)) for doc in documents]
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
            docs = text_splitter.split_documents(documents)
            #print("articles docs:", docs)

            embeddings = OpenAIEmbeddings(model=os.getenv("OPENAI_EMBEDDING_MODEL"))
            #print("articles embeddings", embeddings)
            Qdrant.from_documents(
                documents=docs,
                embedding=embeddings,
                url=os.getenv("QDRANT_HOST"),
                api_key=os.getenv("QDRANT_API_KEY"),
                prefer_grpc=True,
                collection_name=os.getenv("QDRANT_COLLECTION"),
            )
        finally:
            os.remove(tmp_file_path)