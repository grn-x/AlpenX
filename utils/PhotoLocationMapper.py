import os
import tkinter as tk
from tkinter import PhotoImage
from PIL import Image, ImageTk
import pyperclip

# Constants
INPUT_DIR = r'\WebstormProjects\source\wetransfer_alpenuberquerung-1_2025-01-12_1817'#r'\files\pictures\benedikt' #r'\files\pictures\toni\toni'# r'\files\pictures\website' #
MAPPING_FILE = r'\WebstormProjects\source\transfer1.txt'#r'\files\pictures\benedikt\mapping.txt'#r'\files\pictures\website\mapping.txt' #


WINDOW_WIDTH = 1800
WINDOW_HEIGHT = 900

image_files = [f for f in os.listdir(INPUT_DIR) if (f.endswith('.jpg') or f.endswith('.jpeg'))]

if os.path.exists(MAPPING_FILE):
    with open(MAPPING_FILE, 'r') as f:
        mapped_images = {line.split(';')[0] for line in f.readlines()}
else:
    mapped_images = set()

image_files = [f for f in image_files if f not in mapped_images]

current_index = 0

def update_image():
    global current_index
    if 0 <= current_index < len(image_files):
        img_path = os.path.join(INPUT_DIR, image_files[current_index])
        img = Image.open(img_path)
        img.thumbnail((WINDOW_WIDTH, WINDOW_HEIGHT), Image.LANCZOS)
        img = ImageTk.PhotoImage(img)
        image_label.config(image=img)
        image_label.image = img

def left_button():
    global current_index
    if current_index > 0:
        current_index -= 1
        update_image()

def right_button():
    global current_index
    if current_index < len(image_files):
        img_name = image_files[current_index]
        clipboard_content = pyperclip.paste()
        with open(MAPPING_FILE, 'a') as f:
            f.write(f'{img_name};{clipboard_content}\n')
        current_index += 1
        update_image()

def skip_button():
    global current_index
    if current_index < len(image_files):
        current_index += 1
        update_image()

root = tk.Tk()
root.title("Image Mapper")
root.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")

image_label = tk.Label(root)
image_label.pack(expand=True)

left_button = tk.Button(root, text="Left", command=left_button)
left_button.pack(side=tk.LEFT)

right_button = tk.Button(root, text="Right", command=right_button)
right_button.pack(side=tk.RIGHT)

skip_button = tk.Button(root, text="Skip", command=skip_button)
skip_button.pack(side=tk.BOTTOM)

update_image()

root.mainloop()