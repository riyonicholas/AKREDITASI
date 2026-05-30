import os
import re

directory = "src/app/tabel/master"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix the Card wrapper issue for tables
    # Find the specific Card that wraps the Table Section
    content = re.sub(
        r'<Card variant="default" className="!p-0 overflow-hidden">(\s*\{loading \?)',
        r'<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">\1',
        content
    )
    # Replace the matching </Card> at the end of the table section
    # Since it's usually at the bottom of the file just before the closing </div>s
    content = re.sub(
        r'</Card>(\s*</div>\s*</div>\s*\);\s*})',
        r'</div>\1',
        content
    )

    # 2. Change the table header background to #0F172A
    content = content.replace('className="bg-slate-50 border-b-2 border-slate-200"', 'className="bg-[#0F172A] text-white"')
    content = content.replace('className="bg-slate-50 border-b border-slate-200"', 'className="bg-[#0F172A] text-white"')

    # 3. Adjust the header text colors
    content = content.replace('text-xs font-black text-slate-700 uppercase tracking-widest', 'text-xs font-black text-slate-200 uppercase tracking-widest')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.js"):
            process_file(os.path.join(root, file))

print("Master data tables wrapper and header fixed.")
