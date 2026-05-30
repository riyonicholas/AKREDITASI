import os
import re

directory = "src/app/tabel/master"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove vertical borders
    content = content.replace(' border-r border-slate-300', '')
    content = content.replace(' border-r border-slate-200', '')
    
    # 2. Upgrade the header
    content = content.replace('className="bg-slate-50 border-b-2 border-slate-300"', 'className="bg-slate-50 border-b-2 border-slate-200"')
    
    # 3. Upgrade Row hover & zebra to be more modern and less boxy
    content = content.replace('even:bg-slate-50/80', 'even:bg-slate-50/40')
    content = content.replace('hover:bg-blue-50/50', 'hover:bg-violet-50/40')
    
    # 4. Enhance badging
    content = content.replace('rounded-md text-xs', 'rounded-full px-3 text-[0.7rem]')
    
    # 5. Add avatar structure to the Name column
    # \1 is the opening div, \2 is the content inside the curly braces (e.g. item.nama_lengkap || '-')
    content = re.sub(
        r'<div className="text-\[0\.95rem\] font-black text-slate-900">\{(.*?)\}</div>',
        r'<div className="flex items-center gap-3">\n                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 border border-violet-200/50 text-violet-700 flex items-center justify-center font-black shrink-0 text-sm shadow-sm">{String(\1).charAt(0).toUpperCase()}</div>\n                          <div className="text-[0.95rem] font-black text-slate-900">{\1}</div>\n                        </div>',
        content
    )
    
    # 6. Action buttons
    content = content.replace('p-2 text-blue-500 hover:bg-blue-50 rounded-lg', 'p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg')
    content = content.replace('p-2 text-red-500 hover:bg-red-50 rounded-lg', 'p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg')
    
    # Increase row padding to make it ultra-modern
    content = content.replace('px-6 py-5', 'px-6 py-4')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.js"):
            process_file(os.path.join(root, file))

print("Master data UI made beautiful and modern.")
