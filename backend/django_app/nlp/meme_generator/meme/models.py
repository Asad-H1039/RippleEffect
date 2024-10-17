from pydantic import BaseModel, Field


class Meme(BaseModel):
    name: str = Field(description="Meme name")
    top_text: str = Field(description="Upper text of meme")
    bottom_text: str = Field(description="Lower text of meme")
