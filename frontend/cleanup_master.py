import os
import re

directory = "src/app/tabel/master"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix duplicated tracking classes
    content = content.replace('tracking-widest tracking-wider', 'tracking-widest')
    
    # Increase small texts
    content = content.replace('text-[0.7rem]', 'text-[0.85rem]')
    content = content.replace('text-[0.8rem]', 'text-[0.95rem]')
    content = content.replace('text-xs font-semibold text-slate-500', 'text-sm font-semibold text-slate-700')
    content = content.replace('text-xs font-semibold text-slate-600', 'text-sm font-semibold text-slate-800')

    # Card sub-titles
    content = content.replace('text-sm tracking-tight', 'text-base font-medium tracking-tight')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.js"):
            process_file(os.path.join(root, file))

print("Master data cleanup done.")
