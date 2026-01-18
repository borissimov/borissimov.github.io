import os
import sys
import re

def update_regimen(plan_file, start_line_marker, end_line_marker, new_version):
    html_path = 'public/regimen.html'
    
    with open(plan_file, 'r') as f:
        new_plan_content = f.read()

    with open(html_path, 'r') as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1
    for i, line in enumerate(lines):
        if start_line_marker in line:
            start_idx = i
        if start_idx != -1 and i > start_idx and end_line_marker in line:
            end_idx = i
            break

    if start_idx != -1 and end_idx != -1:
        lines[start_idx:end_idx+1] = [new_plan_content + '\n']
        print(f"Successfully replaced block between lines {start_idx+1} and {end_idx+1}")
    else:
        print(f"Error: Could not find markers. Start: {start_idx}, End: {end_idx}")
        sys.exit(1)

    # Increment migration version automatically
    final_lines = []
    version_pattern = re.compile(r"regimen_migration_task_22_v\d+")
    for line in lines:
        final_lines.append(version_pattern.sub(f"regimen_migration_task_22_{new_version}", line))

    with open(html_path, 'w') as f:
        f.writelines(final_lines)
    
    print(f"Regimen updated to {new_version} successfully.")

if __name__ == "__main__":
    # Example usage: python3 scripts/apply_weekly_plan.py new_plan.txt "const PLAN_JAN_18 =" "    };" v80
    if len(sys.argv) < 5:
        print("Usage: python3 apply_weekly_plan.py <plan_txt_file> <start_marker> <end_marker> <version_string>")
        sys.exit(1)
    
    update_regimen(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
