import os
import re

def process_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The broken button looks like this:
    # <button onClick={() => setActiveSubTab('3a2')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '3a2' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
    #   setActiveSubTab('3a2')}
    #                     className={`px-5 py-3 font-bold text-sm border-t border-l border-r rounded-t-xl transition-all ${activeSubTab === '3a2' ? 'bg-white text-[#1E3A8A] border-slate-200 border-b-white -mb-px z-10' : 'bg-[#e2e8f0] text-slate-600 border-transparent hover:bg-slate-300/80 -mb-px z-0'}`}
    #                   >
    #                     Tabel 3.A.2
    # </button>

    # We can fix this by finding the new correct button opening tag, and wiping everything until the closing angle bracket of the old button.
    # Actually, we can just replace everything between `<div className="flex flex-wrap items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 w-fit gap-1">` and `</div>`
    
    # Let's extract the button texts and tab ids
    if '3a2' in filepath:
        new_nav = '''<div className="flex flex-wrap items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 w-fit gap-1">
                  <button onClick={() => setActiveSubTab('3a2')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '3a2' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Tabel 3.A.2</button>
                  <button onClick={() => setActiveSubTab('3c1')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '3c1' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Tabel 3.C.1 Kerjasama</button>
                  <button onClick={() => setActiveSubTab('3c2')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '3c2' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Tabel 3.C.2 Publikasi</button>
                  <button onClick={() => setActiveSubTab('3c3')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '3c3' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Tabel 3.C.3 HKI (Granted)</button>
                </div>'''
        
        content = re.sub(r'<div className="flex flex-wrap items-center bg-slate-100/50 p-1\.5 rounded-2xl border border-slate-200 w-fit gap-1">.*?</div>', new_nav, content, flags=re.DOTALL)
    
    if '4a2' in filepath:
        new_nav = '''<div className="flex flex-wrap items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 w-fit gap-1">
                  <button onClick={() => setActiveSubTab('4a2')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '4a2' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Tabel 4.A.2</button>
                  <button onClick={() => setActiveSubTab('4c1')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '4c1' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Tabel 4.C.1 Kerjasama</button>
                  <button onClick={() => setActiveSubTab('4c2')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '4c2' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Tabel 4.C.2 Diseminasi</button>
                  <button onClick={() => setActiveSubTab('4c3')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeSubTab === '4c3' ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>Tabel 4.C.3 HKI (Granted)</button>
                </div>'''
        
        content = re.sub(r'<div className="flex flex-wrap items-center bg-slate-100/50 p-1\.5 rounded-2xl border border-slate-200 w-fit gap-1">.*?</div>', new_nav, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {filepath}")

process_file('src/app/tabel/penelitian-dtpr/page.js')
process_file('src/app/tabel/pkm-dtpr/page.js')
