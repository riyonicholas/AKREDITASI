import os
import re

directory = "src/app/tabel/master"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # --- TABLE HEADER ACCESSIBILITY ---
    # Make headers larger and darker
    content = re.sub(r'text-\[0\.7rem\] font-bold text-slate-500 uppercase', r'text-xs font-black text-slate-700 uppercase tracking-widest', content)
    content = re.sub(r'text-\[0\.7rem\] font-bold text-slate-600 uppercase', r'text-xs font-black text-slate-700 uppercase tracking-widest', content)
    
    # Increase the border strength for the table header
    content = content.replace('border-b border-slate-200', 'border-b-2 border-slate-300')
    content = content.replace('border-r border-slate-200', 'border-r border-slate-300')
    
    # --- TABLE BODY ACCESSIBILITY ---
    # Zebra striping for better readability
    content = content.replace('hover:bg-slate-50 transition-colors group', 'hover:bg-blue-50/50 even:bg-slate-50/80 transition-colors group')
    content = content.replace('hover:bg-slate-50 transition-colors text-center group', 'hover:bg-blue-50/50 even:bg-slate-50/80 transition-colors text-center group')

    # Increase cell padding slightly
    content = content.replace('px-6 py-4', 'px-6 py-5')

    # Borders stronger
    content = content.replace('border-r border-slate-100', 'border-r border-slate-200')
    content = content.replace('divide-y divide-slate-100', 'divide-y divide-slate-200')

    # --- TEXT SIZE & CONTRAST IN ROWS ---
    # Number indexing
    content = content.replace('text-xs font-semibold text-slate-400', 'text-sm font-bold text-slate-600')
    
    # Main names
    content = content.replace('text-sm font-semibold text-slate-800', 'text-[0.95rem] font-black text-slate-900')
    
    # Secondary info (NIKP, NIDN)
    content = content.replace('text-xs font-medium text-slate-500', 'text-sm font-bold text-slate-700')
    
    # Subtext
    content = content.replace('text-[0.8rem] font-semibold text-slate-700 uppercase', 'text-sm font-bold text-slate-800 uppercase')
    content = content.replace('text-[0.7rem] text-slate-500 mt-0.5', 'text-xs font-semibold text-slate-600 mt-1')
    
    # Badges
    content = content.replace('text-[0.7rem] font-semibold uppercase', 'text-xs font-bold uppercase')
    
    # Action buttons - increase size
    content = content.replace('size={16}', 'size={18}')
    content = content.replace('p-1.5', 'p-2')
    
    # --- FORM LABELS ACCESSIBILITY ---
    content = content.replace('text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5', 'text-xs font-bold uppercase tracking-widest text-slate-600 mb-2')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.js"):
            process_file(os.path.join(root, file))

print("Master data UI made accessible.")
