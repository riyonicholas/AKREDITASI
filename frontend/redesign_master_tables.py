import os
import re

directory = "src/app/tabel/master"

def process_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update table wrapper and table
    content = content.replace('<table className="w-full text-left whitespace-nowrap">', '<table className="w-full min-w-max text-left whitespace-nowrap">')
    content = content.replace('<table className="w-full text-left">', '<table className="w-full min-w-max text-left whitespace-nowrap">')
    
    # 2. Update thead
    content = re.sub(
        r'<thead className="[^"]*">',
        '<thead className="bg-[#1E3A8A]">',
        content
    )
    
    # Update tr inside thead
    content = content.replace(
        '<tr className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200">',
        '<tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">'
    )
    content = content.replace(
        '<tr className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">',
        '<tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">'
    )
    # Generic replacement for th
    def fix_th(match):
        cls = match.group(1)
        cls = re.sub(r'text-slate-\d+', 'text-slate-100', cls)
        cls = re.sub(r'text-gray-\d+', 'text-slate-100', cls)
        cls = cls.replace('font-black', 'font-bold')
        cls = re.sub(r'text-\[(?:11|10|0\.\d+)(?:px|rem)\]', 'text-xs', cls)
        cls = re.sub(r'border-slate-\d+', 'border-white/20', cls)
        cls = re.sub(r'tracking-\[0\.\d+em\]', 'tracking-wider', cls)
        if 'border-r' not in cls:
            cls += ' border-r border-white/20'
        return f'<th className="{cls.strip()}">'

    content = re.sub(r'<th className="([^"]*)">', fix_th, content)

    # 3. Update tbody hover row
    content = re.sub(
        r'className="\{`hover:bg-[^"]*?`\}"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )
    content = re.sub(
        r'className="hover:bg-[^"]*transition-colors group[^"]*"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )
    
    # 4. Update td to have border-r border-slate-200
    def fix_td(match):
        cls = match.group(1)
        if 'border-r' not in cls:
            cls += ' border-r border-slate-200'
        return f'<td className="{cls.strip()}">'
    
    content = re.sub(r'<td className="([^"]*)">', fix_td, content)

    # 5. Fix action buttons layout
    content = content.replace('p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition',
                               'p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition')
    content = content.replace('p-1.5 text-emerald-600 hover:bg-emerald-900/20 rounded-lg transition',
                               'p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition')
    content = content.replace('p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition',
                               'p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition')
    
    # Handle old button styles
    content = content.replace('p-2 text-blue-500 hover:bg-blue-50 rounded-lg', 'p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition')
    content = content.replace('p-2 text-red-500 hover:bg-red-50 rounded-lg', 'p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed: {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.js"):
            process_file(os.path.join(root, file))

print("Done redesigning all master tables!")
