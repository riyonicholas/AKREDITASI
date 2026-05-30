import os
import re

dir_path = 'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/master'

# Regex pattern matching the current tall stat card design
pattern = re.compile(
    r'<Card variant="default" className="relative overflow-hidden group !p-6 border-transparent shadow-sm hover:shadow-md transition-all duration-300">\s*<div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-([a-z]+)-50 group-hover:scale-110 transition-transform duration-500">\s*<([A-Za-z]+) size=\{100\} strokeWidth=\{1\} \/>\s*<\/div>\s*<div className="relative z-10 flex flex-col gap-3">\s*<div className="flex items-center justify-between">\s*<div className="p-2\.5 bg-\1-100/80 text-\1-600 rounded-xl border border-\1-200/50 backdrop-blur-sm">\s*<\2 size=\{20\} strokeWidth=\{2\.5\} \/>\s*<\/div>\s*<\/div>\s*<div>\s*<p className="text-3xl font-black text-slate-800 tracking-tight">([^<]+)<\/p>\s*<p className="text-\[0\.75rem\] font-bold text-slate-400 uppercase tracking-widest mt-1">([^<]+)<\/p>\s*<\/div>\s*<\/div>\s*<\/Card>'
)

replacement = r'''<Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-\1-50 group-hover:scale-110 transition-transform duration-500">
              <\2 size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-\1-100/80 text-\1-600 rounded-xl border border-\1-200/50 backdrop-blur-sm shrink-0">
                <\2 size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">\4</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">\3</p>
              </div>
            </div>
          </Card>'''

for folder in os.listdir(dir_path):
    page_path = os.path.join(dir_path, folder, 'page.js')
    if os.path.isfile(page_path):
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = pattern.sub(replacement, content)
        
        if new_content != content:
            with open(page_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print('Shrunk stats cards in ' + folder)
        else:
            print('No match in ' + folder)
