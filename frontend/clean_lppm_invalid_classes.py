import os
import re

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def fix_invalid_classes(match):
        full_tag = match.group(0)
        class_match = re.search(r'className="([^"]+)"', full_tag)
        if class_match:
            attrs = class_match.group(1)
            # Remove invalid stray classes
            attrs = re.sub(r'\B-r\b|\B-b\b|\B-t\b|\B-l\b|\B-white/20\b|\B-slate-200/60\b|\B-slate-200\b', '', attrs)
            # Remove double spaces
            attrs = re.sub(r'\s+', ' ', attrs).strip()
            return full_tag.replace(class_match.group(1), attrs)
        return full_tag
        
    content = re.sub(r'<(?:th|td|div)[^>]*>', fix_invalid_classes, content)

    # Let's verify all thead th classes
    # Some th may have "border border-slate-200 border-r border-b border-white/20"
    content = content.replace('border border-slate-200 border-r border-b border-white/20', 'border-r border-b border-white/20')
    content = content.replace('border border-slate-200 border-r border-b border-slate-200', 'border-r border-b border-slate-200')
    content = content.replace('border-r border-b border-slate-200 border-r border-b border-white/20', 'border-r border-b border-white/20')
    content = content.replace('px-4 py-4 px-4 py-4', 'px-4 py-4')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned up: {filepath}")

process_file('src/app/tabel/penelitian-dtpr/page.js')
process_file('src/app/tabel/pkm-dtpr/page.js')
