import re
import os

files_to_fix = [
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/spmi/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/tpm/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/data-mahasiswa/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/keragaman-mahasiswa/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/kondisi-mahasiswa/page.js'
]

# We need to replace ALL select classes (including those missed before)
# The select class was: "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer"
# And in spmi/tpm: "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition cursor-pointer"

new_class = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer appearance-none'

replacements = [
    (r'w-full px-4 py-2\.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer', new_class),
    (r'w-full px-4 py-2\.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition cursor-pointer', new_class),
    (r'w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium', r'w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none'),
    (r'w-full px-4 py-3 bg-slate-50/80 border-transparent border-2 rounded-2xl outline-none font-medium opacity-70 cursor-not-allowed', r'w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-medium opacity-70 cursor-not-allowed appearance-none'),
    (r'w-full px-4 py-2\.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/40 transition font-bold', r'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all font-medium'),
    # Fix the missing external icon missing definition in keragaman-mahasiswa if any
]

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = re.sub(old, new, content)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Dropdowns updated.")
