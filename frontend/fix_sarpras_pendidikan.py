with open('src/app/tabel/sarpras-pendidikan/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix restore button
content = content.replace(
    'handle(item.id_5_2)} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title=""> <RotateCcw size={17} /></button>',
    'handleRestore(item.id_5_2)} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title="Restore"><RotateCcw size={17} /></button>'
)

# Fix hard delete title
content = content.replace(
    'title=" "> <Trash2 size={17} /></button>',
    'title="Hapus Permanen"><Trash2 size={17} /></button>'
)

# Fix edit button
content = content.replace(
    'handle(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title=""><Edit size={17} /></button>',
    'handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={17} /></button>'
)

with open('src/app/tabel/sarpras-pendidikan/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('sarpras-pendidikan fixed')
