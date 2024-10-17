import io
import textwrap

import requests
from PIL import Image, ImageDraw, ImageFont


def add_logo_watermark(main_img, logo_img_path, position=(0, 0), opacity=128):
    logo_img = Image.open(logo_img_path)

    alpha_mask = logo_img.split()[3].point(lambda p: p * opacity / 255)

    main_img_width, main_img_height = main_img.size
    logo_width, logo_height = logo_img.size
    x = main_img_width - logo_width - 20
    y = main_img_height - logo_height
    position = (x, y)

    main_img.paste(logo_img, position, alpha_mask)
    return main_img


def draw_centered_multiline_text(draw, image_size, text, position, margin, box_width, font):
    image_width, image_height = image_size
    lines = textwrap.wrap(text, width=box_width)
    y = margin if position == "top" else image_height - margin
    for line in lines:
        line_width, line_height = draw.textbbox((0, 0), line, font=font)[2:]
        x = (image_width - line_width) // 2
        draw.text((x, y), line, font=font, fill="white")
        y += line_height


def add_meme_text(image_url, top_text, bottom_text):
    response = requests.get(image_url)
    img = Image.open(io.BytesIO(response.content))
    draw = ImageDraw.Draw(img)
    image_width, image_height = img.size

    font_size = 80
    top_margin = 40
    bottom_margin = 200
    font_path = "nlp/meme_generator/TR Impact.TTF"
    text_box_width = 800
    logo_img_path = "nlp/meme_generator/can_logo_white.png"
    logo_position = (0, 0)
    logo_opacity = 128
    font = ImageFont.truetype(font_path, font_size) if font_path else ImageFont.load_default()

    draw_centered_multiline_text(draw, img.size, top_text, "top", top_margin, text_box_width, font)
    draw_centered_multiline_text(
        draw, img.size, bottom_text, "bottom", bottom_margin, text_box_width, font
    )
    add_logo_watermark(img, logo_img_path, position=logo_position, opacity=logo_opacity)

    return img
