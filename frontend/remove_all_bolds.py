import os
import re

directory = "src/app/tabel/master"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the tbody content and strip font weights
    # We can just globally replace these within the file, it shouldn't hurt much, 
    # except maybe for buttons/badges which the user *did* say only header should be bold.
    content = content.replace('font-black ', '')
    content = content.replace('font-bold ', '')
    content = content.replace('font-semibold ', '')
    content = content.replace('font-medium ', '')
    
    # But wait! We need the header to BE bold!
    # Let's restore the header bold classes
    # The header has `text-xs text-slate-200 uppercase tracking-widest` now because we stripped it.
    content = content.replace('text-xs text-slate-200 uppercase tracking-widest', 'text-xs font-bold text-slate-200 uppercase tracking-widest')
    
    # Let's also ensure the Card headers or Modal titles didn't get stripped.
    # Actually, it's safer to only strip inside <tbody>...</tbody>
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.js"):
            # process carefully
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                content = f.read()
                
            tbody_match = re.search(r'<tbody.*?</tbody>', content, re.DOTALL)
            if tbody_match:
                tbody_content = tbody_match.group(0)
                tbody_content = tbody_content.replace('font-black ', '')
                tbody_content = tbody_content.replace('font-bold ', '')
                tbody_content = tbody_content.replace('font-semibold ', '')
                tbody_content = tbody_content.replace('font-medium ', '')
                
                content = content[:tbody_match.start()] + tbody_content + content[tbody_match.end():]
                
            with open(os.path.join(root, file), 'w', encoding='utf-8') as f:
                f.write(content)

print("Bold text removed from all tbodys.")
