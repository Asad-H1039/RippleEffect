import os
from io import BytesIO

from django.core.files.images import ImageFile
from langchain.chat_models import ChatOpenAI

from nlp.meme_generator.utils.adding_text import add_meme_text
from nlp.meme_generator.utils.generate_image import generate_image
from nlp.meme_generator.utils.generate_text import generate_meme_text

OPENAI_MODEL = os.getenv("OPENAI_MODEL")


class MemeGenerator:
    def __init__(self, context):
        self.context = context
        self.llm = ChatOpenAI(model_name=OPENAI_MODEL, temperature=0.7)

    def generate_meme(self, filename: str) -> ImageFile:
        prompt = f"""Generate a meme image without texts for given context: {self.context}. \
        Note: Always use dark background"""

        try:
            image_url, image_description = generate_image(prompt)
            res = generate_meme_text(self.context, image_description, self.llm)
            result_image = add_meme_text(image_url, res.top_text, res.bottom_text)
            img_in_bytes = BytesIO()
            result_image.save(img_in_bytes, format=result_image.format)
            return ImageFile(BytesIO(img_in_bytes.getvalue()), name=filename)
        except Exception as e:
            print(f"An error occurred: {e}")
