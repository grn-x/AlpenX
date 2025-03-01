import os
from PIL import Image, ImageOps, ImageDraw, ImageFont

input_dir = r'\public\geodata\imgsource\combined'
output_dir = r'\public\geodata\imgsource\combined_downscaled'
text = "Downscaled for demo purposes. See other branches."

def add_text_to_image(image, text):
    draw = ImageDraw.Draw(image)
    width, height = image.size

    font_size = 1
    font = ImageFont.truetype("arial.ttf", font_size)
    text_width, text_height = draw.textbbox((0, 0), text, font=font)[2:]
    while text_width < width/2 - 20: #max font size that fits half the image width
        font_size += 1
        font = ImageFont.truetype("arial.ttf", font_size)
        text_width, text_height = draw.textbbox((0, 0), text, font=font)[2:]
    font_size -= 1
    font = ImageFont.truetype("arial.ttf", font_size)

    x = 10
    y = height - text_height - 10

    #black outline
    outline_range = 2
    for adj in range(-outline_range, outline_range + 1):
        if adj != 0:
            draw.text((x + adj, y), text, font=font, fill="black")
            draw.text((x, y + adj), text, font=font, fill="black")

    #white text
    draw.text((x, y), text, font=font, fill="white")

for file in os.listdir(input_dir):
    if file.endswith('.jpg') or file.endswith('.jpeg'):
        file_path = os.path.join(input_dir, file)
        with Image.open(file_path) as img:
            img = ImageOps.exif_transpose(img)
            img.thumbnail((512, 512))
            add_text_to_image(img, text)
            out = os.path.join(output_dir, f'{file}')
            print(out)
            img.save(out, quality=50, optimize=True) #the compression artifacts are going crazy