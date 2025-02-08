import os
from os import listdir
from os.path import isfile, join

toDelete = listdir(r'\files\pictures\deleted\toni\restore')
print(toDelete)

sourcePath = r'\files\pictures\toni\toni'
for file in listdir(sourcePath):
    if file in toDelete:
        print(file)
        os.remove(join(sourcePath, file))