import os

files_to_fix = [
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/spmi/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/tpm/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/data-mahasiswa/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/pmb/2a2-keragaman-asal/page.js',
    'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/pmb/2a3-kondisi-mahasiswa/page.js'
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

print("Quotes fixed.")
