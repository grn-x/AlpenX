import os

from PIL import Image, ImageOps

input_files = [
    [r'\WebstormProjects\AlpenX\geodata\imgsource\combined\20240709_070928-Benedikt.jpg', 90],
    [r'\WebstormProjects\AlpenX\geodata\imgsource\combined\20240709_110820-Benedikt.jpg', 90],
]
output_dir = r'\WebstormProjects\AlpenX\geodata\imgsource'

for image, angle in input_files:
    with Image.open(image) as img:
        img = ImageOps.exif_transpose(img)
        img = img.rotate(angle, expand=True)

        out = os.path.join(output_dir, f'{os.path.basename(image)}')

        #if file exists in output dir, rename and append _r to filename (including extension)
        if os.path.exists(out):
            out = os.path.join(out, '_r')
        print(out)
        img.save(out)#, quality=95, optimize=True)