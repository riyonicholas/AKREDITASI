import re

files = [
    r"src/app/tabel/penelitian-dtpr/page.js",
    r"src/app/tabel/pkm-dtpr/page.js"
]

replacements = [
    # General table headers
    (r'bg-slate-50/80 text-\[11px\] font-black text-slate-600', r'bg-slate-100/50 text-[11px] font-black text-slate-500'),
    (r'bg-slate-50/80 text-\[10px\] font-black text-slate-600', r'bg-slate-50 text-[10px] font-black text-slate-500'),
    
    # Purple/Violet theme
    (r'bg-purple-900/50', r'bg-violet-50'),
    (r'border-purple-900/50', r'border-violet-200'),
    (r'border-purple-800', r'border-violet-200'),
    (r'bg-purple-900/20', r'bg-violet-50'),
    (r'bg-purple-900/30', r'bg-violet-100'),
    (r'text-purple-400', r'text-violet-600'),
    (r'text-purple-300', r'text-violet-500'),
    (r'text-purple-600', r'text-violet-700'),
    (r'hover:bg-purple-900/30', r'hover:bg-violet-50'),
    
    # Orange theme
    (r'bg-orange-900/50', r'bg-orange-50'),
    (r'border-orange-900/50', r'border-orange-200'),
    (r'border-orange-800', r'border-orange-200'),
    (r'bg-orange-900/20', r'bg-orange-50'),
    (r'bg-orange-900/30', r'bg-orange-100'),
    (r'text-orange-400', r'text-orange-600'),
    (r'text-orange-300', r'text-orange-500'),
    (r'hover:bg-orange-900/30', r'hover:bg-orange-50'),

    # Emerald theme
    (r'bg-emerald-900/50', r'bg-emerald-50'),
    (r'border-emerald-900/50', r'border-emerald-200'),
    (r'border-emerald-800', r'border-emerald-200'),
    (r'bg-emerald-900/20', r'bg-emerald-50'),
    (r'bg-emerald-900/30', r'bg-emerald-100'),
    (r'text-emerald-400', r'text-emerald-600'),
    (r'text-emerald-300', r'text-emerald-500'),
    (r'hover:bg-emerald-900/30', r'hover:bg-emerald-50'),

    # Blue / General Table theme
    (r'border-slate-300', r'border-slate-200'),
    (r'hover:bg-blue-100:bg-blue-50/30', r'hover:bg-slate-50'),
    (r'hover:bg-slate-100:bg-slate-50/30', r'hover:bg-slate-50'),
    (r'bg-blue-900/30', r'bg-blue-50'),
    (r'border-blue-900/50', r'border-blue-200'),
    (r'bg-blue-900/20', r'bg-blue-50'),

    # Text in tables
    (r'text-gray-300', r'text-slate-700'),
    
    # Form layout cleanups for the LPPM inputs
    (r'bg-gray-950/50', r'bg-slate-50'),
    (r'bg-gray-900', r'bg-white'),
    (r'bg-gray-800', r'bg-slate-100'),
    (r'border-gray-700', r'border-slate-200'),
    
    # Roadmap warning
    (r'bg-red-950/40', r'bg-red-50'),
    (r'border-red-800', r'border-red-200'),
    (r'text-red-300', r'text-red-600'),
    
    # Table border-collapse styling trick (makes tables look so much better)
    # Removing ALL vertical borders by replacing 'border border-xxx' with 'border-y border-xxx' on cells,
    # except we need vertical borders for colSpan/rowSpan structures. 
    # Let's keep the borders but make them very subtle.
    (r'border-slate-200', r'border-slate-200/60'),
    (r'border-violet-200', r'border-violet-200/60'),
    (r'border-orange-200', r'border-orange-200/60'),
    (r'border-emerald-200', r'border-emerald-200/60'),

    # Sub-Navbar
    (r'bg-gray-800', r'bg-slate-100'),
    (r'text-gray-400', r'text-slate-500'),
]

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = re.sub(old, new, content, flags=re.DOTALL)
        
    # Re-fix Card background if we accidentally messed it up
    content = content.replace('bg-slate-50 p-5 rounded-2xl', 'bg-white p-5 rounded-2xl')
    
    # Sub-Navbar active states
    content = content.replace("activeSubTab === '3a2' ? 'bg-white", "activeSubTab === '3a2' ? 'bg-white shadow-sm")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Tables maximized")
