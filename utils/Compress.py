import os

from PIL import Image, ImageOps

input_path = r'\WebstormProjects\source\final\Vincent'
output_path = r'\WebstormProjects\source\final\compressed_vincent'

for file in os.listdir(input_path):
    if file.endswith(".jpg") or file.endswith('.jpeg'):
        file_path = os.path.join(input_path, file)
        with Image.open(file_path) as img:
            img = ImageOps.exif_transpose(img)
            out = os.path.join(output_path, f'{file}')
            print(out)
            img.save(out, quality=95, optimize=True)