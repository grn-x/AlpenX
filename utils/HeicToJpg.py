import os
from PIL import Image
from pillow_heif import register_heif_opener
import shutil

register_heif_opener()

input_dir = r'\WebstormProjects\source\Tag 6'
dispose_dir = r'\WebstormProjects\source\FinnHeic'

os.makedirs(dispose_dir, exist_ok=True)

for file in os.listdir(input_dir):
    if file.endswith('.heic'):
        file_path = os.path.join(input_dir, file)

        image = Image.open(file_path)

        output_file_path = os.path.join(input_dir, f'{os.path.splitext(file)[0]}.jpg')

        image.save(output_file_path, "JPEG")

        shutil.move(file_path, os.path.join(dispose_dir, file))