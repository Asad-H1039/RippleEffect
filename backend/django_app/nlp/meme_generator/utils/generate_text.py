from langchain.output_parsers import PydanticOutputParser

from nlp.meme_generator.meme.models import Meme
from nlp.meme_generator.meme.templates import meme_prompt_template


def generate_meme_text(context, image_description, model):
    parser = PydanticOutputParser(pydantic_object=Meme)
    prompt = meme_prompt_template(context, image_description, parser.get_format_instructions())
    output = model(prompt.to_messages())
    return parser.parse(output.content)
