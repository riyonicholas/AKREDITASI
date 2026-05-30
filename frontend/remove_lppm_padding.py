import os

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove p-6 from the outer table container
    content = content.replace('<div className="overflow-x-auto p-6">', '<div>')
    
    # Remove the double border/shadow/rounded corners from the inner container
    content = content.replace('<div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">', '<div className="overflow-x-auto">')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Removed padding and double borders: {filepath}")

process_file('src/app/tabel/penelitian-dtpr/page.js')
process_file('src/app/tabel/pkm-dtpr/page.js')
