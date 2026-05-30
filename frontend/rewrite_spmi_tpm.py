import re
import os

files_to_rewrite = [
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/spmi/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/tpm/page.js'
]

# We will apply a series of regex replacements to convert the Dark Mode classes to Light Mode.

replacements = [
    (r'bg-gray-950/50', r'bg-slate-50 pt-2 pb-10'),
    (r'bg-gray-900', r'bg-white'),
    (r'bg-gray-800', r'bg-slate-50/80'),
    (r'bg-gray-950/30', r'bg-slate-50/50'),
    (r'border-gray-700', r'border-slate-200'),
    (r'text-white', r'text-slate-900'),
    (r'text-gray-400', r'text-slate-500'),
    (r'text-gray-300', r'text-slate-600'),
    (r'text-gray-200', r'text-slate-800'),
    (r'shadow-gray-950/50', r'shadow-slate-200/50'),
    (r'shadow-gray-950/30', r'shadow-slate-200/50'),
    (r'bg-blue-900/20', r'bg-blue-50 border border-blue-100'),
    (r'bg-indigo-900/20', r'bg-indigo-50 border border-indigo-100'),
    (r'bg-orange-900/20', r'bg-orange-50 border border-orange-100'),
    (r'bg-purple-900/20', r'bg-violet-50 border border-violet-100'),
    (r'hover:bg-blue-900/30', r'hover:bg-slate-50'),
    (r'hover:bg-orange-900/30', r'hover:bg-orange-50'),
    (r'bg-red-950/40', r'bg-red-50'),
    (r'border-red-800', r'border-red-200'),
    (r'text-red-600', r'text-red-600'),
    (r'max-w-7xl mx-auto p-6', r'w-full p-6 md:p-8'),
    (r'rounded-\[2\.5rem\]', r'rounded-2xl'),
    (r'rounded-3xl', r'rounded-2xl'),
    (r'shadow-xl', r'shadow-sm'),
    (r'bg-gray-800 text-gray-400', r'bg-slate-100 text-slate-500'),
    (r'hover:bg-gray-700', r'hover:bg-slate-200'),
    (r'bg-blue-600 text-white', r'bg-violet-600 text-slate-800'),
    (r'hover:bg-blue-700', r'hover:bg-violet-700'),
    (r'shadow-blue-900/20', r'shadow-violet-200/50'),
    (r'border-transparent border-2 focus:border-blue-500 focus:bg-gray-900', r'border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] border'),
    (r'<button onClick=\{\(\) => router\.push\(\'/tabel\'\)\} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition mb-4 group">.*?Kembali ke Dashboard</span>\s*</button>', r''),
    (r'divide-gray-800', r'divide-slate-100'),
    (r'text-\[11px\] font-black text-gray-300 uppercase tracking-\[0\.2em\]', r'text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider'),
    (r'px-4 py-2\.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition appearance-none cursor-pointer', r'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer'),
    (r'px-4 py-2\.5 bg-gray-900 border border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-900/40 outline-none font-bold text-sm transition cursor-pointer', r'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer'),
    (r'px-4 py-2\.5 bg-gray-900 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/40 transition font-bold', r'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all'),
]

for file_path in files_to_rewrite:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Import Card and Button if not present
    if "import { Card }" not in content:
        content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter } from 'next/navigation';\nimport { Card } from '@/components/ui/Card';\nimport { Button } from '@/components/ui/Button';")

    for old, new in replacements:
        content = re.sub(old, new, content, flags=re.DOTALL)

    # Use Button component for action buttons
    content = re.sub(r'<button onClick=\{handleExport\}.*?>\s*<Download size=\{18\} />\s*<span>Export Excel</span>\s*</button>', r'<Button onClick={handleExport} variant="success">\n                <Download size={18} />\n                <span>Export Excel</span>\n              </Button>', content)
    
    content = re.sub(r'<button onClick=\{\(\) => setShowForm\(!showForm\)\}.*?>\s*<Plus size=\{18\} />\s*<span>(.*?)</span>\s*</button>', r'<Button onClick={() => setShowForm(!showForm)}>\n                <Plus size={18} />\n                <span>{showForm ? \'Tutup Form\' : \'\1\'}</span>\n              </Button>', content)
    
    content = re.sub(r'<button onClick=\{fetchData\}.*?>\s*<RefreshCw size=\{20\} className=\{loading \? \'animate-spin\' : \'\'\} />\s*</button>', r'<Button onClick={fetchData} variant="outline" className="px-3" title="Refresh Data">\n              <RefreshCw size={18} className={loading ? \'animate-spin\' : \'\'} />\n            </Button>', content)

    content = re.sub(r'<button \s*onClick=\{\(\) => setShowTrash\(!showTrash\)\}\s*className=\{`.*?`\}\s*>\s*\{showTrash \? \'Lihat Aktif\' : \'Lihat Sampah\'\}\s*</button>', r'<Button \n              onClick={() => setShowTrash(!showTrash)} \n              variant={showTrash ? "danger" : "outline"}\n            >\n              {showTrash ? \'Lihat Aktif\' : \'Lihat Sampah\'}\n            </Button>', content)
    
    # Form Cancel/Save buttons
    content = re.sub(r'<button type="button" onClick=\{resetForm\} className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition font-bold">Batal</button>', r'<Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>', content)
    content = re.sub(r'<button type="submit" className="px-10 py-3 bg-violet-600 text-slate-800 rounded-2xl hover:bg-violet-700 transition font-black shadow-sm shadow-violet-200/50">(\{editingId \? \'Update Data\' : \'.*?\'\})</button>', r'<Button type="submit">\1</Button>', content)

    # Card layout replacement for Stats
    stat_cards_pattern = re.compile(r'<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">(.*?)</div>', re.DOTALL)
    
    def repl_stat(m):
        inner = m.group(1)
        return f'<Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">\n              <div className="relative z-10 flex items-center gap-4">\n                {inner}\n              </div>\n            </Card>'
    
    content = re.sub(stat_cards_pattern, repl_stat, content)
    
    # Replace the stat texts
    content = content.replace('text-xs font-bold text-slate-500 uppercase tracking-wider', 'text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1')
    content = content.replace('text-2xl font-black text-slate-900', 'text-2xl font-black text-slate-800 tracking-tight leading-none')

    # Remove w-px h-4 bg-gray-700 lines
    content = re.sub(r'<div className="w-px h-4 bg-slate-200 mx-2"></div>', r'', content)

    # Button sizes
    content = content.replace('size={16}', 'size={14}')
    content = content.replace('text-[10px] uppercase tracking-widest', 'text-[0.78rem] font-semibold uppercase tracking-wider')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("SPMI and TPM files updated.")
