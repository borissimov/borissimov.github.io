import os

root_dir = 'src/apps/legacy-tracker'
base_src = 'src'

def fix_file(filepath):
    rel_to_src = os.path.relpath(os.path.dirname(filepath), base_src)
    depth = len(rel_to_src.split(os.sep))
    prefix = '../' * depth
    
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    targets = ['context/', 'data/', 'utils/', 'constants/', 'supabaseClient']
    
    new_lines = []
    changed = False
    for line in lines:
        new_line = line
        if 'from \' in line or 'from "' in line:
            for target in targets:
                # Find where '../' sequences start and target follows
                if target in line and '../' in line:
                    # Reconstruct path: prefix + target + anything after target
                    # find target index in import_path
                    quote_char = "'" if "from '" in line else '"'
                    parts = line.split(quote_char)
                    if len(parts) >= 3:
                        import_path = parts[1]
                        if target in import_path:
                            idx = import_path.find(target)
                            new_path = prefix + import_path[idx:]
                            parts[1] = new_path
                            new_line = quote_char.join(parts)
                            changed = True
        new_lines.append(new_line)

    if changed:
        with open(filepath, 'w') as f:
            f.writelines(new_lines)
        print(f"Fixed {filepath} (depth {depth})")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.jsx', '.js')):
            fix_file(os.path.join(root, file))