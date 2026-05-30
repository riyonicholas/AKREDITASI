import os
import re

directory = "src/app/tabel/master"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add border-r to <th>
    # First, make sure we don't duplicate
    content = content.replace(' border-r border-white/20', '')
    content = re.sub(r'<th className="(px-6 py-4.*?)">', r'<th className="\1 border-r border-white/20">', content)

    # Add border-r to <td>
    # First, make sure we don't duplicate
    content = content.replace(' border-r border-slate-200', '')
    # The previous replace removed border-r border-slate-200 from the <tr> tag as well! 
    # Wait, my apply_user_changes.py added `border-b border-slate-200` to <tr>, NOT `border-r`.
    content = re.sub(r'<td className="(px-6 py-4.*?)">', r'<td className="\1 border-r border-slate-200">', content)

    # Note: We probably shouldn't add border-r to the last th or td.
    # To remove it from the last one (Aksi column), we can do:
    # `text-center border-r border-white/20">Aksi</th>` -> `text-center">Aksi</th>`
    content = content.replace('border-r border-white/20">Aksi</th>', '">Aksi</th>')
    
    # For td, the last one usually contains the buttons.
    # It has `<div className="flex justify-center gap-2">` inside.
    # This is slightly trickier to regex safely across multiple files.
    # But usually, it's fine if the last column has a right border (it aligns with the table's outer border).
    # Since the wrapper has `overflow-hidden border border-slate-200`, the double border might look 1px thicker.
    # We can fix that by adding `[&>th:last-child]:border-r-0` to the `<tr>` in the thead and `[&>td:last-child]:border-r-0` to the `<tr>` in the tbody.
    # Actually, the simplest way is to just let it be. A 1px thicker border on the far right is standard and often unnoticeable.
    # Let's remove it from the Aksi th explicitly just to be clean.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith("page.js"):
            process_file(os.path.join(root, file))

print("Vertical lines added.")
