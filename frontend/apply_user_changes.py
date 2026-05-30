import os
import re

directory = "src/app/tabel/master"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Change Header Background
    content = content.replace('bg-[#0F172A]', 'bg-[#1E3A8A]')

    # 2. Remove Avatar Circle
    # Matches the whole avatar div and the flex container wrapper
    # We'll just remove the avatar div itself.
    avatar_regex = r'<div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 border border-violet-200/50 text-violet-700 flex items-center justify-center font-black shrink-0 text-sm shadow-sm">.*?</div>\s*'
    content = re.sub(avatar_regex, '', content)
    
    # Also remove the flex gap-3 if it's there
    content = content.replace('<div className="flex items-center gap-3">', '<div>')

    # 3. Remove Bold from Table Body Text
    # We only want to remove it from the table body, but doing a global replace of font weights 
    # might affect buttons or other things. Let's be careful.
    # Actually, we can just replace the specific classes we added earlier inside the td tags.
    # But doing a blanket replace for specific combinations is safer.
    
    # Replacing font weights
    content = content.replace('font-black text-slate-900', 'text-slate-900')
    content = content.replace('font-bold text-slate-800', 'text-slate-800')
    content = content.replace('font-bold text-slate-700', 'text-slate-700')
    content = content.replace('font-bold text-slate-600', 'text-slate-600')
    content = content.replace('font-semibold text-slate-800', 'text-slate-800')
    content = content.replace('font-semibold text-slate-700', 'text-slate-700')
    content = content.replace('font-semibold text-slate-600', 'text-slate-600')
    content = content.replace('font-medium text-slate-500', 'text-slate-500')
    
    # Remove bold from badges
    content = content.replace('font-bold uppercase tracking-wider', 'uppercase tracking-wider')

    # Make sure header stays bold (it uses font-black, which wasn't replaced above because it was font-black text-slate-200)
    # But just in case:
    # `text-xs font-black text-slate-200`

    # 4. Add Horizontal Lines
    # The user might want explicit border-b on the td elements.
    # Let's replace `px-6 py-4` with `px-6 py-4 border-b border-slate-200` in the tbody.
    # Or just add `border-b border-slate-200` to the `tr` in `tbody`.
    # Current tr: <tr key={item.id_pegawai} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group">
    content = re.sub(r'(<tr key=.*? className=".*?)(">)', r'\1 border-b border-slate-200\2', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.js"):
            process_file(os.path.join(root, file))

print("Applied user changes to master tables.")
