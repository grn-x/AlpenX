import os

fullscreen_files = os.listdir(r'\WebstormProjects\3D-Route\public\geodata\imgsource\combined')
thumbnail_files = os.listdir(r'\WebstormProjects\3D-Route\public\geodata\imgsource\combined-thumbnail')



list = []
#check duplicates

for line in open(r'\files\pictures\mapping.txt', 'r'):
    path = line.split(';')[0]
    if not list.__contains__(path):
        list.append(path)
    else:
        print(f"Duplicate: {path}")

print(len(list))
"""
Duplicate: 20240709_170414-Benedikt.jpg
Duplicate: 20240712_093233-Benedikt.jpg
Duplicate: 20240712_093555-Benedikt.jpg
357
"""