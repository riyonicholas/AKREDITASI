import os
import re

files_to_process = [
    "d:/goat/SI-AKREDITASI/frontend/src/app/tabel/sumber-dana/page.js",
    "d:/goat/SI-AKREDITASI/frontend/src/app/tabel/penggunaan-dana/page.js",
    "d:/goat/SI-AKREDITASI/frontend/src/app/tabel/tendik-kualifikasi/page.js",
    "d:/goat/SI-AKREDITASI/frontend/src/app/tabel/sarpras-penelitian/page.js",
    "d:/goat/SI-AKREDITASI/frontend/src/app/tabel/sarpras-pkm/page.js",
    "d:/goat/SI-AKREDITASI/frontend/src/app/tabel/sarpras-pendidikan/page.js"
]

def upgrade_file(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Buttons
    # Replace simple buttons with the Button component. But actually it's easier to just regex the class names.
    # We will mainly target the Stats cards and the Table wrapper.
    
    # 2. Stats cards upgrade
    # Old: <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all duration-300">
    #          <div className="p-3 bg-blue-100/80 text-blue-600 border border-blue-200/50 rounded-xl"><Icon size={24} /></div>
    
    def repl_stats(match):
        full_match = match.group(0)
        color = match.group(1) # e.g., blue
        icon_name = match.group(2) # e.g., Landmark
        
        # Color mapping for hover background
        color_map = {
            'blue': 'blue-50',
            'violet': 'violet-50',
            'emerald': 'emerald-50',
            'orange': 'orange-50',
            'amber': 'amber-50',
            'rose': 'rose-50',
            'cyan': 'cyan-50'
        }
        hover_color = color_map.get(color, 'slate-50')
        
        replacement = f"""<Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-{hover_color} group-hover:scale-110 transition-transform duration-500">
                <{icon_name} size={{80}} strokeWidth={{1.5}} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-{color}-100/80 text-{color}-600 rounded-xl border border-{color}-200/50 backdrop-blur-sm shrink-0">
                  <{icon_name} size={{22}} strokeWidth={{2}} />
                </div>"""
        return replacement
        
    pattern_stats = re.compile(
        r'<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all duration-300">\s*'
        r'<div className="p-3 bg-([a-z]+)-100/80 text-[a-z]+-600 border border-[a-z]+-200/50 rounded-xl">\s*<([A-Za-z]+)\s+size=\{24\}\s*/>\s*</div>',
        re.DOTALL
    )
    
    content = pattern_stats.sub(repl_stats, content)
    
    # Close the stats cards properly (they end with </div></div></div> usually)
    # Actually, replacing the opening wrapper with <Card> means we must close with </Card> instead of </div>.
    # The structure was: 
    # <div card wrapper>
    #   <div icon></div>
    #   <div> <p>Title</p> <p>Value</p> </div>
    # </div>
    # We replaced the wrapper and icon. The trailing </div></div> needs to become </div></Card>.
    # Wait, the inner div has two paragraphs. Then it closes its div, then closes the wrapper div.
    # So `</div>\n          </div>` at the end of the card needs to be `</div>\n            </Card>`
    
    # A safer way to replace the closing tags of stats cards:
    def repl_close_card(match):
        return match.group(1) + "</Card>"
        
    # We can just look for the pattern of the inner content closing and then the wrapper closing.
    content = re.sub(r'(<p className="text-2xl font-black text-slate-800">.*?</p>\s*</div>\s*)</div>', repl_close_card, content)

    # 3. Table and Form wrappers
    # Old Form: <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
    content = content.replace('<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">', '<Card variant="default" className="p-8 mb-8 animate-in slide-in-from-top-4 duration-500">')
    # Old Table: <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-500">
    content = content.replace('<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-500">', '<Card variant="default" className="!p-0 overflow-hidden transition-all duration-500">')
    
    # Close Card instead of div for form and table wrappers
    # This is tricky without a proper AST parser. Let's just do it manually for these specific cases if regex is too brittle, or we just leave the table wrapper as is, just changing classes.
    
    # Instead of renaming the tag to <Card>, let's just update the classNames of the existing <div> to match the new style.
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed {file_path}")

for file_path in files_to_process:
    upgrade_file(file_path)
