import os
import shutil



def copy_files_1():
    path = r'\WebstormProjects\source\done\Alex\transfer1.txt'
    output_path = r'\WebstormProjects\source\done\uncompressed_alex'
    input_dir = r'\WebstormProjects\source\done\Alex'

    for line in open(path, "r"):
        if line == '\n':
            continue
        if line.startswith('//'):
            continue
        name = line.strip().split(';')[0]
        print(f"Copying {name} from {input_dir} to {output_path}")
        shutil.copy(os.path.join(input_dir, name), output_path)

def copy_files_2():
    folders = [r'\WebstormProjects\source\done\Finn\Tag6', r'\WebstormProjects\source\done\Finn\Tag5', r'\WebstormProjects\source\done\Finn\Tag4', r'\WebstormProjects\source\done\Finn\Tag3', r'\WebstormProjects\source\done\Finn\Tag2', r'\WebstormProjects\source\done\Finn\Tag1']
    mapping_file_name = 'transfer1.txt'
    reminder_file_name = 'reminder.txt'
    output_path = r'\WebstormProjects\source\done\uncompressed_finn'
    combined_mapping_content = []
    for folder in folders:
        for line in open(os.path.join(folder, mapping_file_name), "r"):
            if line == '\n':
                continue
            if line.startswith('//'):
                continue
            f_path = os.path.join(folder, line.strip().split(';')[0])
            print(f"Copying {f_path} from {f_path} to {output_path}")
            shutil.copy(f_path, output_path)
            combined_mapping_content.append(line)

    for folder in folders:
        if not os.path.exists(os.path.join(folder, reminder_file_name)):
            continue
        for line in open(os.path.join(folder, reminder_file_name), "r"):
            if line == '\n':
                continue
            if line.startswith('//'):
                continue
            f_path = os.path.join(folder, line.strip())
            print(f"Reminder: {line.strip()} from {f_path} to {output_path}")
            shutil.copy(f_path, output_path)

    with open(os.path.join(output_path, mapping_file_name), 'w') as f:
        for line in combined_mapping_content:
            f.write(line)


def copy_files_3():
    output_path = r'\WebstormProjects\source\final\Vincent'
    input_path = r'\WebstormProjects\source\final\combined'
    filename_dict = r'\files\pictures\final_sorted.txt'
    look_for = 'By Vincent'

    for line in open(filename_dict, 'r'):
        if line == '\n':
            continue
        if line.startswith('//'):
            continue
        if not line.strip().endswith(look_for):
            continue
        name = line.strip().split(';')[0]
        print(f"Copying {name} from {input_path} to {output_path}")
        shutil.copy(os.path.join(input_path, name), output_path)



copy_files_3()