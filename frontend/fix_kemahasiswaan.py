import os

def process_file(filepath, callback):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = callback(content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated: {filepath}")

def fix_alumni(content):
    # Table 2B4 Header
    content = content.replace('<thead className="bg-slate-50/80/80">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest border-r border-slate-200"', 'className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20"')
    content = content.replace('className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest"', 'className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider"')
    
    # Hover row
    content = content.replace('className="hover:bg-blue-50/80 transition"', 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition text-slate-700"')
    content = content.replace('className="hover:bg-blue-50/80 transition-colors group"', 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group text-slate-700"')
    
    # Table 2B5 Subheaders
    content = content.replace('className="px-6 py-3 text-[10px] font-black text-blue-600 bg-blue-100 uppercase tracking-widest border-r border-slate-200 text-center"', 'className="px-6 py-3 text-[11px] font-bold text-slate-100 bg-[#1E3A8A]/90 uppercase tracking-wider border-r border-white/20 text-center"')
    content = content.replace('className="px-6 py-3 text-[10px] font-black text-purple-600 bg-purple-900/50 uppercase tracking-widest border-r border-slate-200 text-center"', 'className="px-6 py-3 text-[11px] font-bold text-slate-100 bg-[#1E3A8A]/80 uppercase tracking-wider border-r border-white/20 text-center"')
    content = content.replace('className="px-4 py-3 text-[9px] font-bold text-slate-600 uppercase bg-blue-50/80 border-r border-slate-200"', 'className="px-4 py-3 text-[11px] font-bold text-slate-100 uppercase bg-[#1E3A8A]/90 border-r border-white/20"')
    content = content.replace('className="px-4 py-3 text-[9px] font-bold text-slate-600 uppercase bg-purple-900/30 border-r border-slate-200"', 'className="px-4 py-3 text-[11px] font-bold text-slate-100 uppercase bg-[#1E3A8A]/80 border-r border-white/20"')
    
    # 2B5 Data rows
    content = content.replace('bg-blue-50/30', 'bg-transparent')
    content = content.replace('bg-purple-900/10', 'bg-transparent')
    
    # Table Trash
    content = content.replace('<thead className="bg-slate-50/80 text-[10px] text-slate-500 uppercase font-black">', '<thead className="bg-[#1E3A8A] text-[11px] text-slate-100 uppercase font-bold">')
    return content

def fix_accuracy(content):
    # Table headers
    content = content.replace('className="p-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-b-2 border-slate-200"', 'className="p-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20"')
    content = content.replace('className="p-4 text-[11px] font-black text-center text-blue-600 bg-blue-100 uppercase tracking-widest border-b-2 border-blue-900/50 rounded-tl-xl w-24"', 'className="p-4 text-[11px] font-bold text-center text-slate-100 bg-[#1E3A8A] uppercase tracking-wider border-r border-white/20 rounded-tl-xl w-24"')
    content = content.replace('className="p-4 text-[11px] font-black text-center text-emerald-600 bg-emerald-900/50 uppercase tracking-widest border-b-2 border-emerald-900/50 w-24"', 'className="p-4 text-[11px] font-bold text-center text-slate-100 bg-[#1E3A8A] uppercase tracking-wider border-r border-white/20 w-24"')
    content = content.replace('className="p-4 text-[11px] font-black text-center text-amber-600 bg-amber-950/50 uppercase tracking-widest border-b-2 border-slate-200 w-24"', 'className="p-4 text-[11px] font-bold text-center text-slate-100 bg-[#1E3A8A] uppercase tracking-wider border-r border-white/20 w-24"')
    content = content.replace('className="p-4 text-[11px] font-black text-center text-red-600 bg-red-950/50 uppercase tracking-widest border-b-2 border-red-200 rounded-tr-xl w-24"', 'className="p-4 text-[11px] font-bold text-center text-slate-100 bg-[#1E3A8A] uppercase tracking-wider border-r border-white/20 rounded-tr-xl w-24"')
    content = content.replace('className="p-4 text-[11px] font-black text-center text-slate-600 uppercase tracking-widest border-b-2 border-slate-200 w-28"', 'className="p-4 text-[11px] font-bold text-center text-slate-100 uppercase tracking-wider border-r border-white/20 w-28"')
    content = content.replace('className="p-4 text-[11px] font-black text-center text-slate-600 uppercase tracking-widest border-b-2 border-slate-200"', 'className="p-4 text-[11px] font-bold text-center text-slate-100 uppercase tracking-wider border-r border-white/20"')
    
    # Adding bg-[#1E3A8A] to thead if not there
    content = content.replace('<thead>', '<thead className="bg-[#1E3A8A]">')
    
    # Trash table header
    content = content.replace('<thead className="bg-slate-50/80 text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-red-200">', '<thead className="bg-[#1E3A8A] text-[11px] text-slate-100 uppercase font-bold tracking-wider">')
    content = content.replace('className="p-5 border-r border-slate-200"', 'className="p-5 border-r border-white/20"')
    content = content.replace('className="p-5 border-r border-slate-200 text-center"', 'className="p-5 border-r border-white/20 text-center"')
    
    # Hover rows
    content = content.replace('className="hover:bg-slate-50 transition"', 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition text-slate-700"')
    
    return content

def fix_recognisi(content):
    # Table header
    content = content.replace('<thead className="bg-slate-50/80 border-b border-slate-200">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200"', 'className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20"')
    content = content.replace('className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 text-center"', 'className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center"')
    content = content.replace('className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-0"', 'className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20"')
    content = content.replace('className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider"', 'className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider"')
    
    # Hover row
    content = content.replace('className="hover:bg-blue-50/80 transition-colors group"', 'className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group text-slate-700"')
    
    return content

if __name__ == "__main__":
    process_file('src/app/tabel/alumni/page.js', fix_alumni)
    process_file('src/app/tabel/accuracy/page.js', fix_accuracy)
    process_file('src/app/tabel/recognisi/page.js', fix_recognisi)
