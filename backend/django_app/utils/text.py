import re


def clean_text(raw_text):
    text = re.sub(r"\s+", " ", raw_text)
    text = re.sub(r"[^a-zA-Z0-9\s.,;:!?()\'\"-]", "", text)

    return text.strip()
