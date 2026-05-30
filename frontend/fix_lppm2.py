import os
import re

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to find every <th> and extract its className, then replace it.
    def fix_th(match):
        full_tag = match.group(0)
        class_match = re.search(r'className="([^"]+)"', full_tag)
        if class_match:
            attrs = class_match.group(1)
            # Remove old text/font/border classes
            attrs = re.sub(r'text-\[?\d+[a-z]*\]?|font-\w+|text-(?:slate|violet|orange|emerald)-\d+|uppercase|tracking-widest|tracking-wider|px-\d+|py-\d+|border\b|border-(?:r|b|t|l)\b|border-(?:slate|violet|orange|emerald|white)[^\s"]*', '', attrs)
            attrs = re.sub(r'\s+', ' ', attrs).strip()
            
            new_classes = f"px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20 {attrs}".strip()
            return full_tag.replace(class_match.group(0), f'className="{new_classes}"')
        return full_tag
        
    content = re.sub(r'<th[^>]*>', fix_th, content)

    # 5. Fix td borders
    # Let's replace 'border-r border-b border-white/20' or any other borders with 'border-r border-b border-slate-200' in td
    def fix_td(match):
        full_tag = match.group(0)
        class_match = re.search(r'className="([^"]+)"', full_tag)
        if class_match:
            attrs = class_match.group(1)
            # Remove old border classes
            attrs = re.sub(r'border\b|border-(?:r|b|t|l)\b|border-(?:slate|violet|orange|emerald|white)[^\s"]*', '', attrs)
            attrs = re.sub(r'\s+', ' ', attrs).strip()
            
            new_classes = f"border-r border-b border-slate-200 {attrs}".strip()
            return full_tag.replace(class_match.group(0), f'className="{new_classes}"')
        return full_tag
        
    content = re.sub(r'<td[^>]*>', fix_td, content)

    # Fix table wrapper border
    content = re.sub(r'border-r border-b border-white/20', 'border border-slate-200', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated: {filepath}")

process_file('src/app/tabel/penelitian-dtpr/page.js')
process_file('src/app/tabel/pkm-dtpr/page.js')
