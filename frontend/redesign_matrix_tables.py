import os
import re

directories = ["src/app/tabel/isi-pembelajaran", "src/app/tabel/pemetaan-cpl-pl", "src/app/tabel/peta-pemenuhan-cpl"]

def process_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update table
    content = content.replace('<table className="w-full text-left border-collapse">', '<table className="w-full min-w-max text-left border-collapse">')
    
    # Update thead
    content = re.sub(
        r'<thead className="bg-slate-50/80 border-b-2 border-slate-200">',
        '<thead className="bg-[#1E3A8A]">',
        content
    )
    
    # Update tr inside thead
    content = content.replace(
        '<tr>\n                    <th className="px-4 py-3 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 bg-slate-50/80 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0]">',
        '<tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">\n                    <th className="px-6 py-5 border-r border-white/20 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.2)] bg-[#1E3A8A]">'
    )
    
    # Update remaining th
    content = content.replace(
        '<th className="px-4 py-3 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 text-center min-w-[200px]">',
        '<th className="px-6 py-5 border-r border-white/20 text-center min-w-[200px]">'
    )
    content = content.replace(
        '<th className="px-4 py-3 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 text-center min-w-[80px]">',
        '<th className="px-6 py-5 border-r border-white/20 text-center min-w-[80px]">'
    )
    content = content.replace(
        '<th className="px-4 py-3 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 text-center">',
        '<th className="px-6 py-5 border-r border-white/20 text-center">'
    )

    # Update row hover
    content = content.replace(
        'className="hover:bg-blue-50/80 transition-colors"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors border-b border-slate-200"'
    )
    
    # First TD (sticky) bg-slate-50 shadow update
    content = content.replace(
        'border-slate-200 bg-slate-50 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0]',
        'border-slate-200 bg-transparent align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0] group-hover:bg-violet-50/40 group-even:bg-slate-50/40 backdrop-blur-md'
    )
    
    # Buttons
    # Tambah button
    content = content.replace(
        'className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-slate-900 text-xs font-bold rounded-lg hover:bg-green-700 transition shadow-sm"',
        'className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-emerald-50 hover:border-emerald-200 shadow-sm transition"'
    )
    # Hapus button
    content = content.replace(
        'className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-slate-900 transition-colors border border-red-200 shadow-sm"',
        'className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-white border border-slate-200 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-50 hover:border-red-200 shadow-sm transition-colors"'
    )
    # Atur button (both Atur PL / Atur CPL have similar styling)
    content = content.replace(
        'className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-slate-900 transition-colors border border-blue-900/50 shadow-sm"',
        'className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-white border border-slate-200 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-colors"'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed: {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith("page.js"):
                process_file(os.path.join(root, file))

print("Done redesigning matrix tables!")
