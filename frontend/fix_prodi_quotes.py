import os

files_to_fix = [
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/isi-pembelajaran/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/pemetaan-cpl-pl/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/peta-pemenuhan-cpl/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/fleksibilitas-pembelajaran/page.js'
]

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove escaping from JSX attributes
    content = content.replace("\\'", "'")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Quotes fixed for PRODI.")
