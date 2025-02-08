import os

original_dict = {}
sorted_dict = {}
#DSC09995.jpg;4301844.389107781 848100.91753462 4616899.235973232;By Toni
for line in open(r'\files\pictures\combined_unsorted.txt', 'r'):
    if line == '\n':
        continue
    if line.startswith('//'):
        continue
    print(line.split(';'))
    original_dict.update({line.split(';')[0]: [line.split(';')[1], line.split(';')[2]]})


#DSC09994.jpg;(4301528.407017243, 847793.286021134, 4617237.594938937)
for line in open(r'\files\pictures\final_sorted', 'r'):
    if line == '\n':
        continue
    if line.startswith('//'):
        continue
    filename = line.split(';')[0]
    pos_string = line.split(';')[1]
    new_pos_string = pos_string.replace('(', '').replace(')', '').replace(',', '')
    sorted_dict.update({filename: new_pos_string})

print("Original dict first + last entry: " + str(list(original_dict.items())[0]) + " " + str(list(original_dict.items())[-1]))
print("Sorted dict first + last entry: " + str(list(sorted_dict.items())[0]) + " " + str(list(sorted_dict.items())[-1]))


#build new mapping as String and write to file
string_out = ""
for key, value in sorted_dict.items():

    if key in original_dict:# and original_dict[key][0].strip()==value.strip():
        if not original_dict[key][0].strip()==value.strip():
            print(f"Key {key} found in original dict but values ('{value.strip()}' and '{original_dict[key][0].strip()}') are not equal")
        string_out += f"{key.strip()};{value.strip()};{original_dict[key][1].strip()}\n"
    else:
        print(f"Key {key} not found in original dict")

with open(r'\files\pictures\final_sorted.txt', 'w') as f:
    f.write(string_out)
