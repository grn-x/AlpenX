import os
import tkinter as tk
from tkinter import PhotoImage
from PIL import Image, ImageTk
import pyperclip

LOAD_REMINDER = False
AUTHOR = 'By Finn'

INPUT_DIR = r'\WebstormProjects\source\Tag6'#r'\files\pictures\benedikt' #r'\files\pictures\toni\toni'# r'\files\pictures\website' #
MAPPING_FILE = r'\WebstormProjects\source\transfer1.txt'#r'\files\pictures\benedikt\mapping.txt'#r'\files\pictures\website\mapping.txt' #
REMINDER_FILE = r'\WebstormProjects\source\reminder.txt'



WINDOW_WIDTH = 1800
WINDOW_HEIGHT = 900

def check_setup_file(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            lines = f.readlines()
            if lines:
                print(f'Last line in {file_path}: {lines[-1].strip()}')
    else:
        with open(file_path, 'w') as f:
            pass
def content_to_fnames(path):
    if os.path.exists(path):
        with open(path, 'r') as f:
            return {line.split(';')[0] for line in f.readlines()}
    else:
        return set()

check_setup_file(REMINDER_FILE)
check_setup_file(MAPPING_FILE)


if LOAD_REMINDER:
    image_files = content_to_fnames(REMINDER_FILE)
else:
    image_files = [f for f in os.listdir(INPUT_DIR) if (f.endswith('.jpg') or f.endswith('.jpeg'))]


mapped_images = content_to_fnames(MAPPING_FILE)

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
        clipboard_content = pyperclip.paste()  # from "{x: 4255715.686737753, y: 770508.8396607921, z: 4673202.020649479}"
        line= f'{img_name};{clipboard_content.replace("{", "").replace("}", "").replace("x: ", "").replace("y: ", "").replace("z: ", "").replace(", ", " ").strip()};{AUTHOR}\n'
        print(line)
        with open(MAPPING_FILE, 'a') as f:     # to "4300058.617744134 824002.3209398985 4626027.304016802"
            f.write(line)
        current_index += 1
        update_image()

def reminder_button():
    global current_index
    if current_index < len(image_files):
        img_name = image_files[current_index]
        print(f'Reminder: {img_name}')
        with open(REMINDER_FILE, 'a') as f:
            f.write(f'{img_name};\n')
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

reminder_button = tk.Button(root, text="Reminder", command=reminder_button)
reminder_button.pack(side=tk.RIGHT, padx=100)

skip_button = tk.Button(root, text="Skip", command=skip_button)
skip_button.pack(side=tk.BOTTOM)

update_image()

root.mainloop()