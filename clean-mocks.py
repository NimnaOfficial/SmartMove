import os
import re

directory = r'frontend/smartmove-web/src/pages'

# We match `const mockXYZ = [ ... ];` and replace it with `const mockXYZ: any[] = [];`
# Regex matches up to the closing `];`
pattern = re.compile(r'(const\s+mock[a-zA-Z0-9_]+\s*)=\s*\[.*?\];', re.DOTALL)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = pattern.sub(r'\1: any[] = [];', content)

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Cleaned {file}")
