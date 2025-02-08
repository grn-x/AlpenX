import os

# Example line: 20240708_111118-Benedikt.jpg;{x: 4262614.333262001, y: 776147.8380451842, z: 4667048.371763908}
# Output line: 20240708_111118-Benedikt.jpg;4262614.333262001 776147.8380451842 4667048.371763908;By Benedikt
path_author_tuples = [
    #[r'\files\pictures\benedikt\mapping.txt', 'By Benedikt'],
    #[r'\files\pictures\toni\toni\mapping.txt', 'By Toni'],
    #[r'\files\pictures\website\mapping.txt', 'from Website']
    [r'\WebstormProjects\source\mappingVomikzent.txt', 'By Vincent']
]
output_path = r'\WebstormProjects\source\mappingVincent.txt'

with open(output_path, 'w') as output:
    for path, author in path_author_tuples:
        with open(path, 'r') as f:
            for line in f:
                line = line.strip()
                parts = line.split(';')
                image_name = parts[0]
                coordinates = parts[1].replace("{", "").replace("}", "").replace("x: ", "").replace("y: ", "").replace("z: ", "").replace(", ", " ").strip()
                output.write(f'{image_name};{coordinates};{author}\n')