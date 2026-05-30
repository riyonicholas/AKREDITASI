import os
import re

# Target the UPPS pages specifically
upps_pages = [
    "src/app/tabel/pimpinan/page.js",
    "src/app/tabel/beban/page.js",
    "src/app/tabel/pengembangan/page.js",
    "src/app/tabel/visi-misi/page.js",
]

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"SKIP (not found): {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # ─── 1. TABLE WRAPPER: Card → styled div ───────────────────────────────────
    # Replace the Card wrapper around the table with a clean div
    content = re.sub(
        r'<Card variant="default" className="!p-0 overflow-hidden">(\s*\{loading \?)',
        r'<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">\1',
        content
    )
    # Replace its closing </Card> — only if followed by </div></div>);} pattern
    content = re.sub(
        r'(</div>\s*\)}\s*)</Card>(\s*</div>\s*</div>\s*\);\s*})',
        r'\1</div>\2',
        content
    )
    # Fallback: replace any remaining </Card> at end of the table section
    content = re.sub(
        r'(</div>\s*\)}\s*)</Card>',
        r'\1</div>',
        content
    )

    # ─── 2. HEADER: bg-slate-50 → #1E3A8A with white text ────────────────────
    # Old styles
    content = content.replace(
        'className="bg-slate-50 border-b border-slate-200"',
        'className="bg-[#1E3A8A]"'
    )
    content = content.replace(
        'className="bg-slate-50 border-b-2 border-slate-200"',
        'className="bg-[#1E3A8A]"'
    )
    content = content.replace(
        'className="bg-slate-50 border-b border-slate-100"',
        'className="bg-[#1E3A8A]"'
    )

    # ─── 3. HEADER CELLS: update text color to white/light ───────────────────
    # Replace all th class variations to use consistent white text
    def upgrade_th(m):
        original = m.group(1)
        # Strip old text color
        new = re.sub(r'text-slate-\d+', 'text-slate-100', original)
        # Replace old tiny font sizes
        new = re.sub(r'text-\[0\.\d+rem\]', 'text-xs', new)
        # Ensure bold
        if 'font-bold' not in new and 'font-black' not in new:
            new = new + ' font-bold'
        # Add border-r for vertical lines
        if 'border-r' not in new:
            new = new + ' border-r border-white/20'
        return f'<th className="{new}">'

    content = re.sub(r'<th className="(px-6 py-4[^"]*)">', upgrade_th, content)
    # Remove border-r from the very last th (Aksi column)
    content = re.sub(r'(border-r border-white/20">[^<]*(?:Aksi|AKSI)[^<]*</th>)', 
                     lambda m: m.group(1).replace(' border-r border-white/20', '', 1), 
                     content)

    # ─── 4. BODY ROWS: modern hover, zebra, horizontal lines ─────────────────
    content = re.sub(
        r'className="hover:bg-slate-50 transition-colors(?: group)?"',
        'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200"',
        content
    )
    # Also catch any already-styled ones
    content = content.replace(
        'hover:bg-slate-50 transition-colors group',
        'hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200'
    )

    # ─── 5. BODY CELLS: add vertical lines, remove font bold/semibold ─────────
    # Find tbody and strip font weights within it
    tbody_match = re.search(r'(<tbody[^>]*>)(.*?)(</tbody>)', content, re.DOTALL)
    if tbody_match:
        pre = content[:tbody_match.start()]
        tbody = tbody_match.group(0)
        post = content[tbody_match.end():]

        # Add border-r to td
        tbody = re.sub(r'<td className="(px-6 py-4[^"]*)">', 
                       lambda m: f'<td className="{m.group(1)} border-r border-slate-200">' 
                                 if 'border-r' not in m.group(1) else m.group(0),
                       tbody)

        # Strip font weights from body text (not buttons)
        tbody = tbody.replace('font-black ', '')
        tbody = tbody.replace('font-bold ', '')
        tbody = tbody.replace('font-semibold ', '')
        tbody = tbody.replace('font-medium ', '')

        # Increase text sizes that are too small
        tbody = tbody.replace('text-[0.7rem]', 'text-xs')
        tbody = tbody.replace('text-[0.75rem]', 'text-xs')
        tbody = tbody.replace('text-[0.8rem]', 'text-sm')

        # Upgrade action buttons
        tbody = tbody.replace('p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg', 
                              'p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg')
        tbody = tbody.replace('p-1.5 text-red-500 hover:bg-red-50 rounded-lg', 
                              'p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg')
        tbody = tbody.replace('p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg', 
                              'p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg')
        tbody = tbody.replace('p-1.5 text-violet-500 hover:bg-violet-50 rounded-lg', 
                              'p-2 bg-white border border-slate-200 text-violet-600 hover:bg-violet-50 hover:border-violet-200 shadow-sm rounded-lg')
        tbody = tbody.replace('size={16}', 'size={17}')

        content = pre + tbody + post

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  OK: {filepath}")

print("Applying UPPS table redesign...")
for page in upps_pages:
    process_file(page)
print("Done!")
