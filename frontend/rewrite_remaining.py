import re
import os

files_to_rewrite = [
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/alumni/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/accuracy/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/recognisi/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/rekognisi/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/penelitian-dtpr/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/pkm-dtpr/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/tata-kelola/page.js'
]

replacements = [
    (r'bg-gray-950/50', r'bg-slate-50 pt-2 pb-10'),
    (r'bg-gray-900', r'bg-white'),
    (r'bg-gray-800', r'bg-slate-50/80'),
    (r'bg-gray-950/30', r'bg-slate-50/50'),
    (r'bg-gray-950', r'bg-slate-50'),
    (r'border-gray-700', r'border-slate-200'),
    (r'border-gray-600', r'border-slate-300'),
    (r'text-white', r'text-slate-900'),
    (r'text-gray-400', r'text-slate-500'),
    (r'text-gray-300', r'text-slate-600'),
    (r'text-gray-200', r'text-slate-800'),
    (r'shadow-gray-950/50', r'shadow-slate-200/50'),
    (r'shadow-gray-950/30', r'shadow-slate-200/50'),
    (r'bg-blue-900/50', r'bg-blue-100'),
    (r'bg-blue-900/30', r'bg-blue-50/80'),
    (r'bg-blue-900/20', r'bg-blue-50'),
    (r'bg-blue-900/10', r'bg-blue-50/30'),
    (r'bg-green-950/50', r'bg-emerald-100'),
    (r'bg-green-950/40', r'bg-emerald-50 border border-emerald-100'),
    (r'bg-green-950/30', r'bg-emerald-50/80'),
    (r'bg-green-950/20', r'bg-emerald-50'),
    (r'text-green-600', r'text-emerald-600'),
    (r'border-green-500', r'border-emerald-500'),
    (r'bg-purple-900/20', r'bg-violet-50 border border-violet-100'),
    (r'bg-amber-950/40', r'bg-slate-100/80'),
    (r'border-amber-900/50', r'border-slate-200'),
    (r'bg-amber-900/30', r'bg-slate-200/30'),
    (r'bg-amber-900/20', r'bg-amber-50'),
    (r'border-amber-800', r'border-slate-300'),
    (r'hover:bg-blue-900/30', r'hover:bg-slate-50'),
    (r'hover:bg-orange-900/30', r'hover:bg-orange-50'),
    (r'bg-red-950/40', r'bg-red-50'),
    (r'bg-red-900/30', r'bg-red-100'),
    (r'bg-red-900/20', r'bg-red-50'),
    (r'border-red-900/50', r'border-red-200'),
    (r'border-red-800', r'border-red-200'),
    (r'text-red-600', r'text-red-600'),
    (r'text-red-500', r'text-red-500'),
    (r'bg-yellow-900/20', r'bg-amber-50'),
    (r'text-yellow-600', r'text-amber-600'),
    (r'text-yellow-400', r'text-amber-600'),
    (r'bg-green-900/20', r'bg-emerald-50'),
    (r'text-emerald-400', r'text-emerald-600'),
    (r'bg-emerald-900/20', r'bg-emerald-50'),
    (r'bg-orange-900/20', r'bg-orange-50'),
    (r'text-orange-400', r'text-orange-600'),
    (r'text-blue-400', r'text-blue-600'),
    (r'max-w-7xl mx-auto p-6', r'w-full p-6 md:p-8'),
    (r'rounded-\[2\.5rem\]', r'rounded-2xl'),
    (r'rounded-\[2rem\]', r'rounded-2xl'),
    (r'rounded-3xl', r'rounded-2xl'),
    (r'shadow-xl', r'shadow-sm'),
    (r'bg-gray-800 text-gray-400', r'bg-slate-100 text-slate-500'),
    (r'hover:bg-gray-700', r'hover:bg-slate-200'),
    (r'bg-blue-600 text-white', r'bg-violet-600 text-slate-800'),
    (r'hover:bg-blue-700', r'hover:bg-violet-700'),
    (r'shadow-blue-900/20', r'shadow-violet-200/50'),
    (r'<button onClick=\{\(\) => router\.push\(\'/tabel\'\)\} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition mb-4 group">.*?Kembali ke Dashboard</span>\s*</button>', r''),
    (r'<button onClick=\{\(\) => router\.push\(\'/tabel\'\)\} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition mb-4 group">.*?Kembali ke Dashboard</span>\s*</button>', r''),
    (r'divide-gray-700/50', r'divide-slate-200'),
    (r'divide-gray-700', r'divide-slate-100'),
    (r'divide-gray-800', r'divide-slate-100'),
    (r'border-gray-800', r'border-slate-200'),
    (r'bg-gray-800/50', r'bg-slate-50'),
    (r'bg-gray-900/50', r'bg-slate-50'),
    (r'bg-gray-800/40', r'bg-white'),
    (r'border-gray-700/60', r'border-slate-200'),
    (r'border-gray-700/50', r'border-slate-200'),
    (r'bg-blue-600/20', r'bg-violet-50'),
    (r'border-blue-500/30', r'border-violet-200'),
    (r'bg-gray-800', r'bg-slate-100'),
    (r'hover:bg-gray-800', r'hover:bg-slate-50'),
    (r'text-gray-500', r'text-slate-400'),
    (r'bg-gray-900/95', r'bg-white/95'),
    (r'text-\[11px\] font-black text-gray-400 uppercase tracking-\[0\.2em\]', r'text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider'),
    (r'text-\[11px\] font-black text-slate-600 uppercase tracking-\[0\.2em\]', r'text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider'),
    (r'text-\[11px\] font-black text-gray-300 uppercase tracking-\[0\.2em\]', r'text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider'),
    (r'text-\[10px\] font-black text-gray-400 uppercase tracking-widest', r'text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider'),
]

new_class = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer appearance-none'

for file_path in files_to_rewrite:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if "import { Card }" not in content:
        content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter } from 'next/navigation';\nimport { Card } from '@/components/ui/Card';\nimport { Button } from '@/components/ui/Button';")

    for old, new in replacements:
        content = re.sub(old, new, content, flags=re.DOTALL)

    # Use Button component for standard action buttons
    content = re.sub(r'<button onClick=\{handleExport\}.*?>\s*<Download size=\{18\} />\s*<span>Export Excel</span>\s*</button>', r'<Button onClick={handleExport} variant="success">\n                <Download size={18} />\n                <span>Export Excel</span>\n              </Button>', content)
    
    # Custom export button
    content = re.sub(r'<button onClick=\{\(\) => window\.open\(.*?/export\?token=\$\{token\}\'.*?\)\}.*?>\s*<Download size=\{18\} />\s*<span>Export Excel</span>\s*</button>', r'<Button onClick={handleExport} variant="success">\n                <Download size={18} />\n                <span>Export Excel</span>\n              </Button>', content)

    # Forms Batal/Save buttons
    content = re.sub(r'<button type="button" onClick=\{resetForm\}.*?>\s*Batal\s*</button>', r'<Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>', content)
    content = re.sub(r'<button type="submit".*?>\s*(\{editingId \? \'Update.*?\' : \'Simpan.*?\'\})\s*</button>', r'<Button type="submit">\1</Button>', content)

    # Select dropdowns
    content = re.sub(r'w-full px-4 py-2\.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer', new_class, content)
    content = re.sub(r'w-full px-4 py-2\.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm text-slate-800 transition appearance-none cursor-pointer', new_class, content)

    # Fix any remaining pt-2 pb-10 where it shouldn't be (on table td)
    content = content.replace('bg-slate-50 pt-2 pb-10', 'bg-slate-50')
    content = content.replace('bg-white pt-2 pb-10', 'bg-white')
    
    # Also fix Button Add double ternary operator bugs preemptively by capturing the label properly.
    content = re.sub(r'<button onClick=\{\(\) => setShowForm\(!showForm\)\}.*?>\s*<Plus size=\{18\} />\s*<span>\{showForm \? \'Tutup Form\' : \'(.*?)\'\}</span>\s*</button>', r'<Button onClick={() => setShowForm(!showForm)}>\n                <Plus size={18} />\n                <span>{showForm ? \'Tutup Form\' : \'\1\'}</span>\n              </Button>', content)

    content = re.sub(r'<button onClick=\{handleAddMain\}.*?>\s*<Plus size=\{18\} />\s*<span>\{showForm \? \'Tutup Form\' : \'(.*?)\'\}</span>\s*</button>', r'<Button onClick={handleAddMain}>\n                <Plus size={18} />\n                <span>{showForm ? \'Tutup Form\' : \'\1\'}</span>\n              </Button>', content)

    # Card fixes
    stat_cards_pattern = re.compile(r'<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">(.*?)</div>', re.DOTALL)
    def repl_stat(m):
        inner = m.group(1)
        if '<div' in inner and '</p>' in inner:
            # We must be careful not to eat everything to the end of the file
            pass
        return m.group(0) # We will replace Cards manually or with specific non-greedy pattern
        
    stat_cards_pattern2 = re.compile(r'<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">\s*(<div.*?</div>)\s*(<div.*?</p>\s*</div>)\s*</div>', re.DOTALL)
    def repl_stat2(m):
        icon_div = m.group(1)
        text_div = m.group(2)
        return f'<Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">\n              <div className="relative z-10 flex items-center gap-4">\n                {icon_div}\n                {text_div}\n              </div>\n            </Card>'
    
    content = re.sub(stat_cards_pattern2, repl_stat2, content)

    content = content.replace('text-xs font-bold text-slate-500 uppercase tracking-wider', 'text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1')
    content = content.replace('text-2xl font-black text-slate-900', 'text-2xl font-black text-slate-800 tracking-tight leading-none')

    # Remove backslashes
    content = content.replace("\\'", "'")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Remaining files updated.")
