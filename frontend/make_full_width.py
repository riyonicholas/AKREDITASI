import os

dir_path = 'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/master'
for folder in os.listdir(dir_path):
    page_path = os.path.join(dir_path, folder, 'page.js')
    if os.path.isfile(page_path):
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Ganti max-w-7xl mx-auto menjadi w-full
        content = content.replace('className="max-w-7xl mx-auto', 'className="w-full')
        
        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Made full width: ' + folder)
