import re

files = [
    r"src/app/tabel/penelitian-dtpr/page.js",
    r"src/app/tabel/pkm-dtpr/page.js"
]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add imports if not present
    if "import { Card }" not in content:
        content = content.replace("import { Suspense } from 'react';", "import { Suspense } from 'react';\nimport { Card } from '@/components/ui/Card';\nimport { Button } from '@/components/ui/Button';")

    # 2. Replace filters button
    content = re.sub(r'<button\s+onClick=\{fetchRoadmap\}\s+className="px-5 py-2\.5 bg-blue-600 text-slate-900 rounded-xl font-bold shadow-lg shadow-violet-200/50 hover:bg-violet-700 transition">\s*Terapkan Filter\s*</button>', r'<Button onClick={fetchRoadmap}>Terapkan Filter</Button>', content)
    
    # 3. Form cancel button
    content = re.sub(r'<button\s+type="button"\s+onClick=\{\(\) => setShowForm\(false\)\}\s+className="px-6 py-2\.5 bg-slate-50/80 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">Batal</button>', r'<Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>', content)
    
    # 4. Form submit button
    content = re.sub(r'<button\s+type="submit"\s+className="px-8 py-2\.5 bg-blue-600 text-slate-900 rounded-xl font-black shadow-lg shadow-violet-200/50 hover:bg-violet-700 transition">(\{editingId \? \'Simpan Perubahan\' : \'Simpan Data\'\})</button>', r'<Button type="submit">\1</Button>', content)
    
    # 5. Add button
    content = re.sub(r'<button\s+onClick=\{\(\) => \{\s*resetForm\(\);\s*setShowForm\(true\);\s*\}\}\s+className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-slate-900 px-5 py-2\.5 rounded-xl hover:bg-violet-700 transition font-bold text-sm shadow-md">\s*<Plus size=\{18\} /> Tambah(.*?)\s*</button>', r'<Button onClick={() => { resetForm(); setShowForm(true); }}>\n                    <Plus size={18} /> Tambah\1\n                  </Button>', content)

    # 6. Fix root container
    content = content.replace('<div className="p-6">\n      <div className="max-w-7xl mx-auto">', '<div className="min-h-screen bg-slate-50 pb-20">\n      <div className="w-full p-6 md:p-8">')

    # 7. Fix filters container
    content = content.replace('<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end mb-8">', '<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">')

    # 8. Fix input select border
    content = content.replace('className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl outline-none font-bold text-sm cursor-pointer"', 'className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"')
    
    # 9. Clean up table container layout 
    content = content.replace('<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">', '<div className="bg-white rounded-2xl shadow-lg shadow-gray-950/40 border border-slate-200 overflow-hidden mt-8">')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Done cleaning LPPM design")
