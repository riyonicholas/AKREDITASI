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
            # Use negative lookbehind or simpler split
            classes = attrs.split()
            new_classes = [c for c in classes if not (
                c.startswith('text-') or 
                c.startswith('font-') or 
                c.startswith('border-') or 
                c == 'border' or 
                c == 'uppercase' or 
                c.startswith('tracking-') or
                c.startswith('px-') or
                c.startswith('py-')
            )]
            
            # Standard enterprise light mode th
            final_classes = "px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20 " + " ".join(new_classes)
            return full_tag.replace(class_match.group(0), f'className="{final_classes.strip()}"')
        return full_tag
        
    content = re.sub(r'<th[^>]*>', fix_th, content)

    # 5. Fix td borders
    def fix_td(match):
        full_tag = match.group(0)
        class_match = re.search(r'className="([^"]+)"', full_tag)
        if class_match:
            attrs = class_match.group(1)
            classes = attrs.split()
            new_classes = [c for c in classes if not (
                c.startswith('border-') or 
                c == 'border'
            )]
            
            final_classes = "border-r border-b border-slate-200 " + " ".join(new_classes)
            return full_tag.replace(class_match.group(0), f'className="{final_classes.strip()}"')
        return full_tag
        
    content = re.sub(r'<td[^>]*>', fix_td, content)

    # Update all theads
    content = re.sub(r'<thead[^>]*>', '<thead className="bg-[#1E3A8A]">', content)

    # Remove classes from nested tr in thead
    # Since we don't know which tr is in thead easily with regex, we can just replace the specific colored tr
    content = re.sub(r'<tr className="bg-(?:slate|violet|orange|emerald)-[^"]+">', '<tr>', content)
    
    # 4. Fix tbody rows hover effects
    content = re.sub(r'<tr key=\{[^\}]+\} className="hover:bg-(?:slate|violet|orange|emerald)[^"]+ transition-colors text-center text-slate-[0-9]+">', 
                     lambda m: m.group(0).split('className="')[0] + 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors text-center text-slate-700">', 
                     content)

    content = re.sub(r'<tr key=\{[^\}]+\} className="hover:bg-(?:emerald-100|orange-50):[^"]+ transition-colors text-center text-slate-600">', 
                     lambda m: m.group(0).split('className="')[0] + 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors text-center text-slate-700">', 
                     content)

    # Table wrappers border
    content = re.sub(r'className="overflow-x-auto rounded-2xl border border-(?:violet|orange|emerald)-200/60 shadow-sm"', 'className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm"', content)
    content = content.replace('border border-slate-200/60 shadow-sm', 'border border-slate-200 shadow-sm')

    # Update table class to include min-w-max (or min-w-full)
    content = content.replace('<table className="w-full table-auto border-collapse text-sm">', '<table className="w-full min-w-full table-auto border-collapse text-sm">')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated: {filepath}")

process_file('src/app/tabel/penelitian-dtpr/page.js')
process_file('src/app/tabel/pkm-dtpr/page.js')
