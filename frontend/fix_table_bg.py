import os

dir_path = 'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/master'
for folder in os.listdir(dir_path):
    page_path = os.path.join(dir_path, folder, 'page.js')
    if os.path.isfile(page_path):
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace('bg-slate-50/50', 'bg-slate-50')
        content = content.replace('variant="glass"', 'variant="default"')
        content = content.replace('bg-white/70', 'bg-white')
        content = content.replace('bg-slate-50/80', 'bg-slate-50')
        content = content.replace('bg-slate-100/50', 'bg-slate-100')
        
        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated ' + folder)
