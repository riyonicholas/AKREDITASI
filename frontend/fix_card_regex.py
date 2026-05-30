import re
import os

files_to_fix = [
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/spmi/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/tpm/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/data-mahasiswa/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/keragaman-mahasiswa/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/kondisi-mahasiswa/page.js'
]

pattern = re.compile(r'<Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">\s*<div className="relative z-10 flex items-center gap-4">\s*(<div.*?</div>)\s*</Card>\s*(<div>.*?</div>)\s*</div>', re.DOTALL)

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will replace the malformed Card structure with a proper Card structure.
    
    def fix_card(m):
        icon_div = m.group(1)
        text_div = m.group(2)
        return f'<Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">\n              <div className="relative z-10 flex items-center gap-4">\n                {icon_div}\n                {text_div}\n              </div>\n            </Card>'
        
    new_content = re.sub(pattern, fix_card, content)
    
    # Also I noticed bg-slate-50 pt-2 pb-10 was applied wrongly on select/input fields
    # e.g., className="w-full px-4 py-3 bg-slate-50 pt-2 pb-10 border-transparent...
    # I should revert that pt-2 pb-10 specifically on inputs/selects where it was substituted instead of bg-gray-950/50.
    # The original was bg-gray-950/50. 
    new_content = new_content.replace('bg-slate-50 pt-2 pb-10', 'bg-slate-50')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Fix applied.")
