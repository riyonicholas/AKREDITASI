import os
import re

target_pages = [
    "src/app/tabel/spmi/page.js",
    "src/app/tabel/tpm/page.js",
    "src/app/tabel/data-mahasiswa/page.js",
    "src/app/tabel/keragaman-mahasiswa/page.js",
    "src/app/tabel/kondisi-mahasiswa/page.js",
]

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"  SKIP (not found): {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. THEAD background
    content = content.replace('<thead className="bg-slate-50/80 border-b border-slate-200">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<thead className="bg-slate-50 border-b border-slate-200">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<thead className="bg-slate-50 border-b-2 border-slate-200">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<thead className="bg-slate-100 border-b border-slate-200">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<thead className="bg-slate-50">', '<thead className="bg-[#1E3A8A]">')

    # Sub-header rows
    content = content.replace('<tr className="bg-slate-50">', '<tr className="bg-[#162d6e]">')
    content = content.replace('<tr className="bg-slate-100/50">', '<tr className="bg-[#162d6e]">')

    # 2. TH cells - fix colors, borders
    def fix_th(match):
        cls = match.group(1)
        # Text color -> white
        cls = re.sub(r'text-slate-\d+', 'text-slate-100', cls)
        cls = re.sub(r'text-gray-\d+', 'text-slate-100', cls)
        # Font
        cls = cls.replace('font-black', 'font-bold')
        # Size
        cls = re.sub(r'text-\[(?:11|10|0\.\d+)(?:px|rem)\]', 'text-xs', cls)
        # Border color -> white/20
        cls = re.sub(r'border-slate-\d+', 'border-white/20', cls)
        cls = re.sub(r'border-gray-\d+', 'border-white/20', cls)
        # Remove bg overrides
        cls = cls.replace('bg-slate-100/50', '')
        cls = cls.replace('bg-blue-50', '')
        # tracking
        cls = re.sub(r'tracking-\[0\.\d+em\]', 'tracking-wider', cls)
        # ensure border-r exists
        if 'border-r' not in cls:
            cls += ' border-r border-white/20'
        return f'<th className="{cls.strip()}">'

    # Apply to all th (simple ones, no rowspan/colspan)
    content = re.sub(r'<th className="([^"]*)">', fix_th, content)

    # 3. ROW hover - standardize
    content = re.sub(
        r'className="\{`hover:bg-slate-50 transition-colors group.*?`\}"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )
    content = re.sub(
        r'className=\{`hover:bg-slate-50 transition-colors group.*?`\}',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )
    content = content.replace(
        'className="hover:bg-slate-50 transition-colors group"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"'
    )
    content = content.replace(
        "className={`hover:bg-slate-50 transition-colors group ${showTrash ? 'hover:bg-orange-50' : ''}`}",
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"'
    )

    # 4. TD cells - add border-r if missing, remove excessive bold
    def fix_td(match):
        cls = match.group(1)
        if 'border-r' not in cls:
            cls += ' border-r border-slate-200'
        cls = cls.replace('font-black ', '')
        cls = cls.replace('font-extrabold ', '')
        cls = cls.replace('font-black"', '"')
        return f'<td className="{cls.strip()}">'

    content = re.sub(r'<td className="([^"]*)">', fix_td, content)

    # 5. Upgrade action buttons
    # Replace old button pill group with individual clean buttons
    content = re.sub(
        r'<div className="inline-flex items-center bg-white border border-slate-200 p-1\.5 rounded-xl shadow-sm transition-all group-hover:border-orange-800">\s*'
        r'<button onClick=\{[^}]+handleRestore[^}]+\}[^>]+title="Restore"[^>]*>(<[^/]+/>)</button>\s*'
        r'<div [^>]+></div>\s*'
        r'<button onClick=\{[^}]+handleHardDelete[^}]+\}[^>]+title="Hapus Permanen"[^>]*>(<[^/]+/>)</button>\s*'
        r'</div>',
        lambda m: f'<div className="flex gap-2"><button onClick={{() => handleRestore(item.id_unit_spmi)}} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title="Restore"><RotateCcw size={{17}} /></button><button onClick={{() => handleHardDelete(item.id_unit_spmi)}} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus Permanen"><Trash2 size={{17}} /></button></div>',
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'<div className="inline-flex items-center bg-white border border-slate-200 p-1\.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">\s*'
        r'<button onClick=\{[^}]+handleEdit[^}]+\}[^>]+title="Edit"[^>]*>(<[^/]+/>)</button>\s*'
        r'<div [^>]+></div>\s*'
        r'<button onClick=\{[^}]+handleSoftDelete[^}]+\}[^>]+title="Hapus"[^>]*>(<[^/]+/>)</button>\s*'
        r'</div>',
        lambda m: f'<div className="flex gap-2"><button onClick={{() => handleEdit(item)}} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={{17}} /></button><button onClick={{() => handleSoftDelete(item.id_unit_spmi)}} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={{17}} /></button></div>',
        content,
        flags=re.DOTALL
    )

    # General button upgrades (old p-1.5 style)
    content = content.replace('p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition',
                               'p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition')
    content = content.replace('p-1.5 text-emerald-600 hover:bg-emerald-900/20 rounded-lg transition',
                               'p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition')
    content = content.replace('p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition',
                               'p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition')
    content = content.replace('size={14}', 'size={17}')
    content = content.replace('size={16}', 'size={17}')

    # 6. Add custom-scrollbar class to overflow-x-auto divs that don't have it
    content = content.replace('<div className="overflow-x-auto">', '<div className="overflow-x-auto custom-scrollbar">')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  OK: {filepath}")

print("Applying TPM / PMB / ALA redesign...")
for page in target_pages:
    process_file(page)
print("Done!")
