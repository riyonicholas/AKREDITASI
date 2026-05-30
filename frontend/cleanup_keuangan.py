import os
import re

target_pages = [
    "src/app/tabel/sumber-dana/page.js",
    "src/app/tabel/penggunaan-dana/page.js",
    "src/app/tabel/tendik-kualifikasi/page.js",
    "src/app/tabel/sarpras-penelitian/page.js",
    "src/app/tabel/sarpras-pkm/page.js",
    "src/app/tabel/sarpras-pendidikan/page.js",
]

def process_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix thead background
    content = content.replace('className="bg-slate-50/80 border-b border-slate-200"', 'className="bg-[#1E3A8A]"')
    content = content.replace('<thead className="bg-slate-50/80">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<tr className="bg-slate-50/80">', '<tr className="bg-[#162d6e]">')

    # 2. Fix hover row
    content = re.sub(
        r'className="hover:bg-slate-50/80 transition-colors group bg-white"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )
    content = re.sub(
        r'className="hover:bg-orange-50/30 transition-colors group bg-white"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )

    # 3. Fix button styles inside table
    tbody_match = re.search(r'(<tbody[^>]*>)(.*?)(</tbody>)', content, re.DOTALL)
    if tbody_match:
        pre = content[:tbody_match.start()]
        tbody = tbody_match.group(0)
        post = content[tbody_match.end():]

        # Upgrade custom styled buttons in these tables to the new standard icon buttons
        # Edit
        tbody = re.sub(
            r'<button onClick=\{\(\) => handleEdit\([^)]+\)\}.*?Edit.*?</button>',
            lambda m: re.sub(r'className=".*?"', 'className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"', m.group(0)).replace('Edit', '').replace('</button>', '<Edit size={17} /></button>').replace('<Edit size={12}/>', '').replace('<Edit size={16}/>', '').replace('<Edit size={16} />', '').replace('<Edit size={12} />', ''),
            tbody
        )
        
        # Delete / Hapus
        tbody = re.sub(
            r'<button onClick=\{\(\) => handleDelete\([^)]+\)\}.*?Hapus.*?</button>',
            lambda m: re.sub(r'className=".*?"', 'className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"', m.group(0)).replace('Hapus', '').replace('</button>', '<Trash2 size={17} /></button>').replace('<Trash2 size={12}/>', '').replace('<Trash2 size={16}/>', '').replace('<Trash2 size={16} />', '').replace('<Trash size={12}/>', ''),
            tbody
        )

        # Restore
        tbody = re.sub(
            r'<button onClick=\{\(\) => handleRestore\([^)]+\)\}.*?Restore.*?</button>',
            lambda m: re.sub(r'className=".*?"', 'className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title="Restore"', m.group(0)).replace('Restore', '').replace('</button>', '<RotateCcw size={17} /></button>').replace('<RotateCcw size={12}/>', '').replace('<RotateCcw size={16}/>', ''),
            tbody
        )

        # Hard Delete
        tbody = re.sub(
            r'<button onClick=\{\(\) => handleHardDelete\([^)]+\)\}.*?Hapus.*?</button>',
            lambda m: re.sub(r'className=".*?"', 'className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus Permanen"', m.group(0)).replace('Hapus', '').replace('Permanen', '').replace('</button>', '<Trash2 size={17} /></button>').replace('<Trash size={12}/>', ''),
            tbody
        )

        # Clean up double icons if created
        tbody = re.sub(r'<Edit size=\{17\} />\s*<Edit size=\{17\} />', '<Edit size={17} />', tbody)
        tbody = re.sub(r'<Trash2 size=\{17\} />\s*<Trash2 size=\{17\} />', '<Trash2 size={17} />', tbody)
        tbody = re.sub(r'<RotateCcw size=\{17\} />\s*<RotateCcw size=\{17\} />', '<RotateCcw size={17} />', tbody)

        content = pre + tbody + post

    # Ensure icons are imported if needed
    if 'Edit' not in content and 'lucide-react' in content:
        content = content.replace('import {', 'import { Edit, Trash2, RotateCcw, ', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for page in target_pages:
    process_file(page)
print("Cleanup done.")
