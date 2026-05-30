import re
import os

files = [
    r"src/app/tabel/penelitian-dtpr/page.js",
    r"src/app/tabel/pkm-dtpr/page.js"
]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # If already modernized, skip
    if "import { Suspense }" in content and "import { Card }" in content:
        continue

    # 0. Strip dark mode classes
    content = re.sub(r'\s*dark:[a-zA-Z0-9\-\/]+', '', content)

    # 1. Add imports
    if "import { Card }" not in content:
        content = content.replace("import { useRouter, useSearchParams } from 'next/navigation';", "import { useRouter, useSearchParams } from 'next/navigation';\nimport { Suspense } from 'react';\nimport { Card } from '@/components/ui/Card';\nimport { Button } from '@/components/ui/Button';")

    # 2. Add Suspense wrapper
    # Rename function
    if "export default function PenelitianPage() {" in content:
        content = content.replace("export default function PenelitianPage() {", "function PenelitianContent() {")
        content += "\nexport default function PenelitianPage() {\n  return (\n    <Suspense fallback={<div className=\"min-h-screen bg-slate-50 flex items-center justify-center\"><p className=\"text-slate-500 font-bold\">Memuat...</p></div>}>\n      <PenelitianContent />\n    </Suspense>\n  );\n}\n"
    elif "export default function PkmPage() {" in content:
        content = content.replace("export default function PkmPage() {", "function PkmContent() {")
        content += "\nexport default function PkmPage() {\n  return (\n    <Suspense fallback={<div className=\"min-h-screen bg-slate-50 flex items-center justify-center\"><p className=\"text-slate-500 font-bold\">Memuat...</p></div>}>\n      <PkmContent />\n    </Suspense>\n  );\n}\n"

    # 3. Replace simple buttons
    content = re.sub(r'<button\s+onClick=\{fetchRoadmap\}\s+className="px-5 py-2\.5 bg-blue-600 text-slate-900 rounded-xl font-bold shadow-lg shadow-violet-200/50 hover:bg-violet-700 transition">\s*Terapkan Filter\s*</button>', r'<Button onClick={fetchRoadmap}>Terapkan Filter</Button>', content)
    content = re.sub(r'<button\s+type="button"\s+onClick=\{\(\) => setShowForm\(false\)\}\s+className="px-6 py-2\.5 bg-slate-50/80 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">Batal</button>', r'<Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>', content)
    content = re.sub(r'<button\s+type="submit"\s+className="px-8 py-2\.5 bg-blue-600 text-slate-900 rounded-xl font-black shadow-lg shadow-violet-200/50 hover:bg-violet-700 transition">(\{editingId \? \'Simpan Perubahan\' : \'Simpan Data\'\})</button>', r'<Button type="submit">\1</Button>', content)
    content = re.sub(r'<button\s+onClick=\{\(\) => \{\s*resetForm\(\);\s*setShowForm\(true\);\s*\}\}\s+className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-slate-900 px-5 py-2\.5 rounded-xl hover:bg-violet-700 transition font-bold text-sm shadow-md">\s*<Plus size=\{18\} /> Tambah (.*?)\s*</button>', r'<Button onClick={() => { resetForm(); setShowForm(true); }}>\n                    <Plus size={18} /> Tambah \1\n                  </Button>', content)

    # 4. Containers
    content = content.replace('<div className="p-6">\n      <div className="max-w-7xl mx-auto">', '<div className="min-h-screen bg-slate-50 pb-20">\n      <div className="w-full p-6 md:p-8">')
    content = content.replace('<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end mb-8">', '<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">')
    content = content.replace('className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl outline-none font-bold text-sm cursor-pointer"', 'className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-900"')
    content = content.replace('<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">', '<div className="bg-white rounded-2xl shadow-lg shadow-gray-950/40 border border-slate-200 overflow-hidden mt-8">')

    # Convert node visualizations to use Card
    content = content.replace('<div className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-emerald-900/20 text-slate-900 w-full md:w-auto relative">', '<Card variant="success" className="flex-1 p-6 relative w-full md:w-auto overflow-hidden">')
    content = content.replace('<div className="flex-[1.5] bg-white border-2 border-dashed border-blue-800 p-5 rounded-2xl relative overflow-hidden group">', '<Card className="flex-[1.5] p-5 relative overflow-hidden border-2 border-dashed border-blue-500/50 group">')

    # Also convert some bg-white border-2 to proper Card if any
    content = content.replace('<div className="bg-white border-2 border-blue-900/50 p-6 rounded-2xl relative overflow-hidden shadow-sm">', '<Card className="p-6 relative overflow-hidden shadow-sm">')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Modernization applied to LPPM modules.")
