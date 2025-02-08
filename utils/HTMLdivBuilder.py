import os
import pyperclip

prefix = """<div id="lightgallery">"""
suffix = """</div>"""

numFiles = 85


def entry(full, thumbnail):
    return f"""
      <a href="{full}" data-src="{full}" class="gallery-item">
        <img src="{thumbnail}" alt="Preview" loading="lazy" data-src="{full}" class="lg-lazy-thumb" />
      </a>
    """


def buildHTML(iterations, full_path, full_file_name, thumb_path, thumb_file_name, copy_to_clipboard=False):
    html = prefix
    for i in range(1, iterations + 1):
        full = f"{full_path}/{full_file_name}{i}.jpg"
        thumbnail = f"{thumb_path}/{thumb_file_name}{i}.jpg"
        html += entry(full, thumbnail)
    html += suffix

    if copy_to_clipboard:
        pyperclip.copy(html)

    return html


def custom_entry(full, thumbnail, location, alt="Preview"):
    return f"""
      <a href="{full}" data-src="{full}" class="gallery-item" data-location="{location}">
        <img src="{thumbnail}" alt="{alt}" loading="lazy" data-src="{full}" class="lg-lazy-thumb" />
      </a>
    """


def custombuildHTML(filename, full_path, full_file_name, thumb_path, thumb_file_name, copy_to_clipboard=False):
    html = prefix
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            for line in f.readlines():
                full = f"{full_path}/{full_file_name}{line.split(';')[0]}"
                thumbnail = f"{thumb_path}/{thumb_file_name}{line.split(';')[0]}"
                location = line.split(';')[1]
                html += custom_entry(full, thumbnail, location)
    html += suffix

    if copy_to_clipboard:
        pyperclip.copy(html)

    return html

def combined_entry(full, thumbnail, location, alt="Preview"):
    return f"""
      <a href="{full}" data-src="{full}" class="gallery-item" data-location="{location}">
        <img src="{thumbnail}" alt="{alt}" loading="lazy" data-src="{full}" class="lg-lazy-thumb" />
      </a>
    """

def combinedbuildHTML(filename, full_path, full_file_name, thumb_path, thumb_file_name, copy_to_clipboard=False):
    html = prefix
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            for line in f.readlines():
                full = f"{full_path}/{full_file_name}{line.split(';')[0]}"
                thumbnail = f"{thumb_path}/{thumb_file_name}{line.split(';')[0]}"
                location = line.split(';')[1]
                preview = line.split(';')[2].strip()
                html += combined_entry(full, thumbnail, location, alt=preview)
    html += suffix

    if copy_to_clipboard:
        pyperclip.copy(html)

    return html

full_path = r'\WebstormProjects\3D-Route\public\temp_pics'
thumb_path = r'\WebstormProjects\3D-Route\public\temp_pics\thumbnails'
full_path_rel = r'/temp_pics'
thumb_path_rel = r'/temp_pics/thumbnails'
#print(buildHTML(numFiles, full_path_rel, "File", thumb_path_rel, "thumbnail_File", copy_to_clipboard=False))
#print(custombuildHTML([r'\files\pictures\benedikt\mapping.txt',r'\files\pictures\toni\toni\mapping.txt'], r'geodata/imgsource/combined', "", r'geodata/imgsource/combined-thumbnail', "thumbnail_", copy_to_clipboard=True));
print(combinedbuildHTML(r'\PycharmProjects\alpenXws\files\pictures\final_sorted.txt', r'geodata/imgsource/combined', "", r'geodata/imgsource/combined-thumbnail', "thumbnail_", copy_to_clipboard=True));