from PIL import Image, ExifTags, ImageOps
import os

input_dir = r'\WebstormProjects\AlpenX\geodata\imgsource'
output_dir = r'\WebstormProjects\AlpenX\geodata\imgsource'
"""
# every jpg in folder
for file in os.listdir(input_dir):
    if file.endswith('.jpg') or file.endswith('.jpeg'):
        file_path = os.path.join(input_dir, file)
        with Image.open(file_path) as img:
            img = ImageOps.exif_transpose(img)

            img.thumbnail((128, 128))
            out = os.path.join(output_dir, f'thumbnail_{file}')
            print(out)
            img.save(out)
"""



"""
filenames = [
    '20240707_101042000_iOS 2.jpg',
    '20240707_191117000_iOS.jpg',
    '20240708_082738-Benedikt.jpg',
    '20240708_132056-Benedikt.jpg',
    '20240708_195554000_iOS.jpg',
    '20240708_145905000_iOS.jpg',
    '20240709_110555-Benedikt.jpg',
    '20240709_093154610_iOS.jpg',
    '20240709_093146000_iOS.jpg',
    '20240709_100734000_iOS.jpg',
    '20240709_164623-Benedikt.jpg',
    '20240709_183857000_iOS.jpg',
    '20240710_191430000_iOS 1.jpg',
    '20240710_085919-Benedikt.jpg',
    '20240710_072631000_iOS.jpg',
    '20240710_130012000_iOS.jpg',
    '20240711_102048-Benedikt.jpg',
    '20240711_120408-Benedikt.jpg',
    '20240711_100426000_iOS.jpg',
    '20240711_121302000_iOS.jpg',
    '20240712_065157-Benedikt.jpg',
    '20240712_071405-Benedikt.jpg',
    '20240712_072239-Benedikt.jpg',
    '20240712_105708-Benedikt.jpg',
    '20240712_112410-Benedikt.jpg',
    'DSC09874.jpg',
    'DSC09884.jpg',
    'DSC09916.jpg',
    'DSC09949.jpg',
    'DSC09973.jpg',
    'DSC09986.jpg'
]
"""

filenames = [
    r'IMG-20240710-WA0011.jpg',
    r'WhatsApp-Bild-2024-07-08-um-20.27.20_16262ab6.jpg'
]
for file in filenames:
    if file.endswith('.jpg'):
        file_path = os.path.join(input_dir, file)
        with Image.open(file_path) as img:
            img = ImageOps.exif_transpose(img)
            img.thumbnail((128, 128))
            out = os.path.join(output_dir, f'thumbnail_{file}')
            print(out)
            img.save(out)
            
