import re

files = [
    r"src/app/tabel/penelitian-dtpr/page.js",
    r"src/app/tabel/pkm-dtpr/page.js"
]

replacements = [
    # Primary Buttons
    (r'bg-blue-600 text-slate-900', r'bg-blue-600 text-white'),
    (r'bg-violet-600 text-slate-900', r'bg-violet-600 text-white'),
    
    # SubTab Active Buttons
    (r'bg-blue-600 border-blue-600 text-slate-900', r'bg-blue-600 border-blue-600 text-white'),
    (r'bg-purple-600 border-purple-600 text-slate-900', r'bg-purple-600 border-purple-600 text-white'),
    (r'bg-orange-600 border-orange-600 text-slate-900', r'bg-orange-600 border-orange-600 text-white'),
    (r'bg-emerald-600 border-emerald-600 text-slate-900', r'bg-emerald-600 border-emerald-600 text-white'),

    # Table Action Buttons Hover
    (r'hover:text-slate-900 transition', r'hover:text-white transition'),
    (r'hover:text-slate-900 transition inline-block', r'hover:text-white transition inline-block'),
    (r'hover:text-slate-900 rounded-lg', r'hover:text-white rounded-lg'),
    
    # Dashboard Node Icons (Roadmap Node)
    (r'text-slate-900 w-full', r'text-white w-full'),
    (r'<Map size=\{24\} className="text-slate-900" />', r'<Map size={24} className="text-white" />'),
]

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = re.sub(old, new, content)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Button text perfected")
