import os
import re

target_pages = [
    "src/app/tabel/sarpras-penelitian/page.js",
    "src/app/tabel/sarpras-pkm/page.js",
    "src/app/tabel/sarpras-pendidikan/page.js",
]

def process_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clean up any missed hover styles
    content = re.sub(
        r'className="hover:bg-slate-50/80 transition-all duration-300 group bg-white"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )
    content = re.sub(
        r'className="hover:bg-slate-50/80 transition-colors group bg-white"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for page in target_pages:
    process_file(page)
print("Sarpras hover cleanup done.")
