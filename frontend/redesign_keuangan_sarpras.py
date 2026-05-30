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
        print(f"SKIP (not found): {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. TABLE WRAPPER: Card -> styled div
    content = re.sub(
        r'<Card variant="default" className="!p-0 overflow-hidden">(\s*\{loading \?)',
        r'<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">\1',
        content
    )
    # Some files might just have <Card variant="default" className="!p-0">
    content = re.sub(
        r'<Card variant="default" className="!p-0">(\s*\{loading \?)',
        r'<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">\1',
        content
    )
    
    # Replace the matching </Card>
    content = re.sub(
        r'(</div>\s*\)}\s*)</Card>(\s*</div>\s*</div>\s*\);\s*})',
        r'\1</div>\2',
        content
    )
    content = re.sub(
        r'(</div>\s*\)}\s*)</Card>',
        r'\1</div>',
        content
    )

    # 2. HEADER BG
    # For standard headers
    content = content.replace('className="bg-slate-50 border-b border-slate-200"', 'className="bg-[#1E3A8A]"')
    content = content.replace('className="bg-slate-50 border-b-2 border-slate-200"', 'className="bg-[#1E3A8A]"')
    content = content.replace('className="bg-slate-50 border-b border-slate-100"', 'className="bg-[#1E3A8A]"')
    content = content.replace('<thead className="bg-slate-50">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<tr className="bg-slate-50">', '<tr className="bg-[#162d6e]">')
    content = content.replace('<tr className="bg-slate-100/50">', '<tr className="bg-[#162d6e]">')

    # 3. HEADER CELLS text color
    def upgrade_th(m):
        original = m.group(1)
        new = re.sub(r'text-slate-\d+', 'text-slate-100', original)
        new = re.sub(r'text-\[0\.\d+rem\]', 'text-xs', new)
        new = new.replace('bg-slate-100/50', '')
        new = new.replace('bg-blue-50/50', 'text-yellow-300') # for totals
        new = new.replace('bg-slate-50', '')
        if 'font-bold' not in new and 'font-black' not in new:
            new = new + ' font-bold'
        if 'border-r' not in new:
            new = new + ' border-r border-white/20'
        # ensure border color is white/20
        new = re.sub(r'border-slate-\d+', 'border-white/20', new)
        return f'<th className="{new}">'

    content = re.sub(r'<th className="(px-.*?|text-.*?)">', upgrade_th, content)
    content = re.sub(r'<th rowSpan="\d+" className="(px-.*?|text-.*?)">', lambda m: f'<th rowSpan="{m.group(0)[13:14]}" className="{upgrade_th(m)[16:]}', content)
    content = re.sub(r'<th colSpan="\d+" className="(px-.*?|text-.*?)">', lambda m: f'<th colSpan="{m.group(0)[13:14]}" className="{upgrade_th(m)[16:]}', content)

    # 4. ROW HOVER
    content = re.sub(
        r'className="hover:bg-slate-50 transition-colors(?: group)?"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )
    content = content.replace(
        'hover:bg-slate-50 transition-colors group',
        'hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200'
    )

    # 5. BODY CELLS
    tbody_match = re.search(r'(<tbody[^>]*>)(.*?)(</tbody>)', content, re.DOTALL)
    if tbody_match:
        pre = content[:tbody_match.start()]
        tbody = tbody_match.group(0)
        post = content[tbody_match.end():]

        # Add border-r to td
        tbody = re.sub(r'<td className="(px-.*?|text-.*?)">', 
                       lambda m: f'<td className="{m.group(1)} border-r border-slate-200">' 
                                 if 'border-r' not in m.group(1) else m.group(0),
                       tbody)

        # Strip font weights from body text
        tbody = tbody.replace('font-black ', '')
        tbody = tbody.replace('font-bold ', '')
        tbody = tbody.replace('font-semibold ', '')
        tbody = tbody.replace('font-medium ', '')

        # Action buttons
        tbody = tbody.replace('p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg', 
                              'p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg')
        tbody = tbody.replace('p-1.5 text-red-500 hover:bg-red-50 rounded-lg', 
                              'p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg')
        tbody = tbody.replace('p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg', 
                              'p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg')
        tbody = tbody.replace('size={16}', 'size={17}')

        content = pre + tbody + post

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  OK: {filepath}")

print("Applying Keuangan & Sarpras redesign...")
for page in target_pages:
    process_file(page)
print("Done!")
