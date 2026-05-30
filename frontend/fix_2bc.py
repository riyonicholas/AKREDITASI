import os
import re

def fix_2b3():
    filepath = 'src/app/tabel/peta-pemenuhan-cpl/page.js'
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
    
    # Header replacement
    content = content.replace(
        '<thead className="bg-[#1E3A8A]">' + '\n' +
        '                      <tr>' + '\n' +
        '                        <th className="px-4 py-3 text-[11px] font-black text-slate-600 uppercase tracking-widest border-r border-slate-200 bg-slate-50/80 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0]">CPL</th>',
        '<thead className="bg-[#1E3A8A]">' + '\n' +
        '                      <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">' + '\n' +
        '                        <th className="px-6 py-5 border-r border-white/20 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.2)] bg-[#1E3A8A]">CPL</th>'
    )
    
    content = content.replace(
        '<th className="px-4 py-3 text-[11px] font-black text-slate-600 uppercase tracking-widest border-r border-slate-200 bg-slate-50/80 align-middle sticky left-[260px] z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0]">CPMK</th>',
        '<th className="px-6 py-5 border-r border-white/20 align-middle sticky left-[260px] z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.2)] bg-[#1E3A8A]">CPMK</th>'
    )
    
    content = content.replace(
        '<th key={sem} className="px-4 py-3 text-[11px] font-black text-slate-600 uppercase tracking-widest border-r border-slate-200 text-center bg-slate-50 align-middle w-[160px] min-w-[160px] max-w-[160px]">',
        '<th key={sem} className="px-6 py-5 border-r border-white/20 text-center align-middle w-[160px] min-w-[160px] max-w-[160px]">'
    )
    
    # Action buttons
    content = content.replace('inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-slate-900 transition-colors border border-blue-900/50 shadow-sm', 'inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition shadow-sm')
    content = content.replace('inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-slate-900 transition-colors border border-blue-900/50 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100', 'inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-white text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-50 hover:border-blue-200 transition border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100')
    
    with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

def fix_2c():
    filepath = 'src/app/tabel/fleksibilitas-pembelajaran/page.js'
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

    # Matrix Table
    content = content.replace('<table className="w-full text-center border-collapse">', '<table className="w-full min-w-max text-center whitespace-nowrap border-collapse">')
    
    # Replace Borang header row
    content = content.replace('<thead className="bg-slate-50/80 border-b border-slate-200 font-black text-[11px] text-slate-600 uppercase tracking-wider">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<tr className="bg-slate-50/80 border-b border-slate-200 font-black text-[11px] text-slate-600 uppercase tracking-wider">', '<tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">')
    
    content = content.replace('<th rowSpan="2" className="px-6 py-4 border border-slate-200 text-left w-[30%]">Tahun Akademik</th>', '<th rowSpan="2" className="px-6 py-4 border-r border-white/20 text-left w-[30%] align-middle">Tahun Akademik</th>')
    content = content.replace('<th key={th.id_tahun} className="px-4 py-3 border border-slate-200">', '<th key={th.id_tahun} className="px-6 py-5 border-r border-white/20 align-middle">')
    content = content.replace('<th rowSpan="2" className="px-6 py-4 border border-slate-200 w-[20%]">Link Bukti</th>', '<th rowSpan="2" className="px-6 py-5 border-r border-white/20 align-middle">Link Bukti</th>')
    
    # Fix history table
    content = content.replace('<thead className="bg-slate-50/80 border-b border-slate-200">', '<thead className="bg-[#1E3A8A]">')
    content = content.replace('<tr className="text-[11px] font-black text-slate-600 uppercase tracking-widest">', '<tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">')
    content = content.replace('border border-slate-200', 'border-r border-slate-200')
    content = content.replace('<th className="px-4 py-4 border-r border-slate-200">', '<th className="px-6 py-4 border-r border-white/20">')
    content = content.replace('<th className="px-6 py-4 border-r border-slate-200 text-left', '<th className="px-6 py-4 border-r border-white/20 text-left')
    content = content.replace('<th className="px-6 py-4 border-r border-slate-200', '<th className="px-6 py-4 border-r border-white/20')

    # Fix buttons
    content = content.replace('p-1.5 bg-slate-50/80 hover:bg-blue-900/40 border border-slate-200 hover:border-blue-900/60 rounded-lg text-slate-500 hover:text-violet-600', 'p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg')
    content = content.replace('p-1.5 bg-slate-50/80 hover:bg-red-900/40 border border-slate-200 hover:border-red-900/60 rounded-lg text-slate-500 hover:text-red-400', 'p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg')
    
    content = content.replace('flex items-center gap-1 px-2.5 py-1 bg-slate-50/80 hover:bg-emerald-900/40 border border-slate-200 hover:border-emerald-900/60 rounded-lg text-slate-500 hover:text-emerald-400', 'flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg')
    content = content.replace('flex items-center gap-1 px-2.5 py-1 bg-slate-50/80 hover:bg-red-900/40 border border-slate-200 hover:border-red-900/60 rounded-lg text-slate-500 hover:text-red-400', 'flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg')

    with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

fix_2b3()
fix_2c()
print("Fixed 2b3 and 2c")
