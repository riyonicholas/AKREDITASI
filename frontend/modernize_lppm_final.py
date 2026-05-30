import os
import re

def process_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update the navigation area (Sub-Navbar)
    # The current navigation looks like:
    # <div className="flex border-b border-slate-200 w-full overflow-x-auto gap-1 px-4">
    # ... buttons ...
    # </div>
    # We want a modern pill container:
    pill_container = '<div className="flex flex-wrap items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 w-fit gap-1">'
    content = content.replace('<div className="flex border-b border-slate-200 w-full overflow-x-auto gap-1 px-4">', pill_container)

    # 2. Update navigation buttons
    def fix_nav_button(match):
        full_button = match.group(0)
        # Find the text inside
        text_match = re.search(r'>\s*(.*?)\s*</button>', full_button, re.DOTALL)
        text = text_match.group(1).strip() if text_match else ""
        
        # Find the onClick condition
        onclick_match = re.search(r"setActiveSubTab\('([^']+)'\)", full_button)
        tab_id = onclick_match.group(1) if onclick_match else ""
        
        return (f'<button onClick={{() => setActiveSubTab(\'{tab_id}\')}} '
                f'className={{`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 '
                f'${{activeSubTab === \'{tab_id}\' ? \'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50\' : \'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50\'}}`}}>\n'
                f'  {text}\n'
                f'</button>')

    # The buttons are currently using complex template literals with rounded-t-xl
    content = re.sub(r'<button\s+onClick=\{\(\)\s*=>\s*setActiveSubTab\([^\)]+\)\}\s*className=\{`px-5 py-3 font-bold text-sm border-t border-l border-r rounded-t-xl[^`]+`\}\s*>\s*.*?\s*</button>', fix_nav_button, content, flags=re.DOTALL)


    # 3. Fix the Table Container wrappers
    # Outer padding
    content = content.replace('<div className="overflow-x-auto p-6">', '<div className="overflow-x-auto">')
    # Inner double border wrapper
    content = content.replace('<div className="overflow-x-auto rounded-2xl border border-slate-200/60 shadow-sm">', '<div className="w-full">')
    content = content.replace('<div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">', '<div className="w-full">')
    # Make table full width
    content = content.replace('<table className="w-full border-collapse text-sm">', '<table className="w-full min-w-full table-auto border-collapse text-sm">')
    
    # 4. Fix headers
    # Ensure thead has background
    content = content.replace('<thead>', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<thead className="bg-[#1E3A8A]">', '<thead className="bg-[#1E3A8A]">') # Just in case
    # Strip classes from tr inside thead
    content = re.sub(r'<tr className="bg-slate-100[^"]*">', '<tr>', content)
    
    # Fix ALL th
    def fix_th(match):
        full_tag = match.group(0)
        class_match = re.search(r'className="([^"]+)"', full_tag)
        if class_match:
            attrs = class_match.group(1)
            # Remove bad classes
            classes = attrs.split()
            new_classes = [c for c in classes if not (
                c.startswith('text-') or 
                c.startswith('font-') or 
                c.startswith('border-') or 
                c == 'border' or 
                c == 'uppercase' or 
                c.startswith('tracking-') or
                c.startswith('px-') or
                c.startswith('py-') or
                c.startswith('min-w-') or
                c.startswith('w-') or
                c.startswith('bg-')
            )]
            
            # keep widths if they existed
            width_classes = [c for c in classes if c.startswith('min-w-') or c.startswith('w-')]
            
            final_classes = "px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20 " + " ".join(new_classes + width_classes)
            return full_tag.replace(class_match.group(0), f'className="{final_classes.strip()}"')
        return full_tag
        
    content = re.sub(r'<th[^>]*>', fix_th, content)

    # 5. Fix ALL td
    def fix_td(match):
        full_tag = match.group(0)
        class_match = re.search(r'className="([^"]+)"', full_tag)
        if class_match:
            attrs = class_match.group(1)
            classes = attrs.split()
            new_classes = [c for c in classes if not (
                c.startswith('border-') or 
                c == 'border' or
                c.startswith('px-') or
                c.startswith('py-')
            )]
            
            final_classes = "px-4 py-4 border-r border-b border-slate-200 " + " ".join(new_classes)
            return full_tag.replace(class_match.group(0), f'className="{final_classes.strip()}"')
        return full_tag
        
    content = re.sub(r'<td[^>]*>', fix_td, content)

    # 6. Fix tbody tr hover
    content = re.sub(r'<tr key=\{[^\}]+\} className="hover:bg-[^"]+ transition-colors text-center text-slate-[0-9]+">', 
                     lambda m: m.group(0).split('className="')[0] + 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors text-center text-slate-700">', 
                     content)
    
    # 7. Also remove <thead className="bg-[#1E3A8A]"> duplications if they happened
    content = content.replace('<thead className="bg-[#1E3A8A]">\n                          <tr className="bg-slate-100 text-[11px] font-black text-slate-700 uppercase text-center">', '<thead className="bg-[#1E3A8A]">\n                          <tr>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Modernized: {filepath}")

process_file('src/app/tabel/penelitian-dtpr/page.js')
process_file('src/app/tabel/pkm-dtpr/page.js')
