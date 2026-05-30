import os
import re

def process_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Clean the inner wrappers
    # <div className="overflow-x-auto rounded-2xl border border-[color]-200/60 shadow-sm">
    # Replace with <div className="overflow-x-auto">
    content = re.sub(r'<div className="overflow-x-auto rounded-2xl border border-[a-z]+-200(?:/60)? shadow-sm">', '<div className="overflow-x-auto">', content)
    content = re.sub(r'<div className="overflow-x-auto rounded-2xl border border-[a-z]+-200(?:/60)?">', '<div className="overflow-x-auto">', content)

    # 2. Fix thead tag
    # Some theads have corrupted class names from previous regexes
    # We want ALL theads to just be <thead className="bg-[#1E3A8A]">
    content = re.sub(r'<thead[^>]*>', '<thead className="bg-[#1E3A8A]">', content)

    # 3. Fix tr tags inside thead
    # Find <thead className="bg-[#1E3A8A]"> and the next a few lines.
    # Actually, we can just replace any <tr> that has bg-[color]-50 and text-[color]-600.
    # Since these are only used in table headers (the body rows use hover:bg-...), we can safely strip them.
    content = re.sub(r'<tr className="bg-[a-z]+-(?:50|100).*?">', '<tr>', content)
    content = re.sub(r'<tr className="bg-slate-100[^"]*">', '<tr>', content)

    # 4. Make sure all body rows have the correct hover state
    content = re.sub(r'<tr key=\{[^\}]+\} className="hover:bg-[a-z]+-900/50:bg-[a-z]+-900/10 transition-colors text-center text-slate-700">', 
                     lambda m: m.group(0).split('className="')[0] + 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors text-center text-slate-700">', 
                     content)
    
    # 5. Fix text colors in the first table
    # The first table has <div className="font-semibold text-white leading-snug">{item.judul_penelitian}</div>
    # text-white on a white background is invisible!
    content = content.replace('className="font-semibold text-white leading-snug"', 'className="font-semibold text-slate-900 leading-snug"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {filepath}")

process_file('src/app/tabel/penelitian-dtpr/page.js')
process_file('src/app/tabel/pkm-dtpr/page.js')
