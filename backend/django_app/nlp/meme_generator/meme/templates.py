from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate


def meme_prompt_template(context, image_description, format_instruction):
    template = """
    Create top and bottom text for a funny sarcastic meme based on context and image description \
    information. Keep max 5 words for top text and 5 words for bottom text

    {format_instruction}
    Context: {context}
    Image Description: {image_description}
    """
    prompt = ChatPromptTemplate(
        messages=[HumanMessagePromptTemplate.from_template(template)],
        input_variables=["context", "image_description"],
        partial_variables={"format_instruction": format_instruction},
    )
    return prompt.format_prompt(context=context, image_description=image_description)
