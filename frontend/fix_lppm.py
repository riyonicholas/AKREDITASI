import os
import re

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update the table wrappers (remove color-specific borders like border-violet-200/60)
    content = re.sub(r'className="overflow-x-auto rounded-2xl border border-(?:violet|orange|emerald)-200/60 shadow-sm"', 'className="overflow-x-auto rounded-2xl border border-slate-200/60 shadow-sm"', content)
    
    # Also update table class to include min-w-max (or min-w-full)
    content = content.replace('<table className="w-full table-auto border-collapse text-sm">', '<table className="w-full min-w-full table-auto border-collapse text-sm">')

    # 2. Update all theads
    # Remove old tr classes inside thead
    content = re.sub(r'<tr className="bg-(?:slate|violet|orange|emerald)-[^"]+">', '<tr>', content)
    
    # Ensure thead has bg-[#1E3A8A]
    content = content.replace('<thead>', '<thead className="bg-[#1E3A8A]">')

    # Update th inside thead to have standard Enterprise Light Mode styling
    # First, find all th tags inside the file (we'll assume all th are in thead because there are no th in tbody here)
    # Actually, let's just replace the specific class fragments
    
    # Replace borders in th
    content = re.sub(r'border border-(?:slate|violet|orange|emerald)-200(?:/60)?', 'border-r border-b border-white/20', content)
    # Remove border-r border-b border-white/20 from tbody tds later by fixing td borders

    # 3. Update all th classes to standard
    # Instead of complex regex, let's just do a clean replace for the th class contents.
    # The current th looks like: className="px-4 py-4 border border-slate-200/60 text-left min-w-[150px]"
    
    # We want to add text-[11px] font-bold text-slate-100 uppercase tracking-wider
    
    def fix_th(match):
        attrs = match.group(1)
        # Remove old text/font classes
        attrs = re.sub(r'text-\[?\d+[a-z]*\]?|font-\w+|text-(?:slate|violet|orange|emerald)-\d+|uppercase|tracking-widest|tracking-wider', '', attrs)
        # Add new standard classes
        # Keep things like px-4 py-4, text-left, min-w-*, w-*
        attrs = attrs.replace('border-r border-b border-white/20', '').strip()
        attrs = re.sub(r'\s+', ' ', attrs) # collapse spaces
        
        return f'<th className="px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20 {attrs}"'
        
    content = re.sub(r'<th className="([^"]+)"', fix_th, content)

    # Clean up empty classes or double spaces
    content = content.replace('className="px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20 px-4 py-4', 'className="px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20')
    content = content.replace('px-2 py-3', '') # remove old padding if it duplicated

    # 4. Fix tbody rows hover effects
    # <tr key={idx} className="hover:bg-slate-50 transition-colors text-center text-slate-600">
    content = re.sub(r'<tr key=\{[^\}]+\} className="hover:bg-(?:slate|violet|orange|emerald)[^"]+ transition-colors text-center text-slate-600">', 
                     lambda m: m.group(0).replace(m.group(0).split('className="')[1].split(' transition-colors')[0], 'hover:bg-violet-50/40 even:bg-slate-50/40').replace('text-slate-600', 'text-slate-700'), 
                     content)

    content = re.sub(r'<tr key=\{[^\}]+\} className="hover:bg-(?:emerald-100|orange-50):[^"]+ transition-colors text-center text-slate-600">', 
                     lambda m: m.group(0).split('className="')[0] + 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors text-center text-slate-700">', 
                     content)

    # 5. Fix td borders
    # td border border-white/20 is wrong because they should be slate-200.
    # Let's replace 'border-r border-b border-white/20' with 'border-r border-b border-slate-200' ONLY in td
    def fix_td(match):
        td_content = match.group(1).replace('border-r border-b border-white/20', 'border-r border-b border-slate-200/60')
        return f'<td className="{td_content}"'
        
    content = re.sub(r'<td className="([^"]+)"', fix_td, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated: {filepath}")

process_file('src/app/tabel/penelitian-dtpr/page.js')
process_file('src/app/tabel/pkm-dtpr/page.js')
