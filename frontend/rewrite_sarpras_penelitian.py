import re

file_path = 'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/sarpras-penelitian/page.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

logic_part = content.split('  return (')[0]

new_jsx = """  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Sarpras Penelitian (3.A.1)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola data sarana dan prasarana laboratorium / ruang penelitian</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Sarpras'}</span>
            </Button>
            <Button onClick={handleExport} variant="success">
              <Download size={18} />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 group-hover:scale-110 transition-transform duration-500">
                <Beaker size={80} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-blue-100/80 text-blue-600 rounded-xl border border-blue-200/50 backdrop-blur-sm shrink-0">
                  <Beaker size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Fasilitas</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{activeData.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-violet-50 group-hover:scale-110 transition-transform duration-500">
                <Maximize size={80} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-violet-100/80 text-violet-600 rounded-xl border border-violet-200/50 backdrop-blur-sm shrink-0">
                  <Maximize size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Luas Total</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{activeData.reduce((acc, curr) => acc + (parseFloat(curr.luas_ruang) || 0), 0).toFixed(2)} m²</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-orange-50 group-hover:scale-110 transition-transform duration-500">
                <Trash size={80} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-orange-100/80 text-orange-600 rounded-xl border border-orange-200/50 backdrop-blur-sm shrink-0">
                  <Trash size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Sampah</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{trashData.length}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-64">
              <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Program Studi</label>
              <select
                value={filterIdProdi}
                onChange={(e) => setFilterIdProdi(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
              >
                {prodiList.map(p => (
                  <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                ))}
              </select>
            </div>
            <Button onClick={fetchData} variant="outline" className="px-3" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button
              onClick={() => setShowTrash(!showTrash)}
              variant={showTrash ? "danger" : "outline"}
            >
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </Button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Data Sarpras' : 'Input Sarpras Penelitian Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Nama Prasarana Penelitian</label>
                    <input type="text" value={formData.nama_prasarana} onChange={(e) => setFormData({ ...formData, nama_prasarana: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" placeholder="Contoh: Laboratorium Riset AI & Data Science" required />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Daya Tampung</label>
                    <input type="number" value={formData.daya_tampung} onChange={(e) => setFormData({ ...formData, daya_tampung: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" min="0" />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Luas Ruang (m²)</label>
                    <input type="number" step="0.01" value={formData.luas_ruang} onChange={(e) => setFormData({ ...formData, luas_ruang: parseFloat(e.target.value) || 0 })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" min="0" />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Status Milik</label>
                    <select value={formData.status_milik} onChange={(e) => setFormData({ ...formData, status_milik: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer">
                      <option value="M">Milik Sendiri (M)</option>
                      <option value="W">Sewa (W)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Status Lisensi</label>
                    <select value={formData.status_lisensi} onChange={(e) => setFormData({ ...formData, status_lisensi: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer">
                      <option value="L">Berlisensi (L)</option>
                      <option value="P">Public Domain (P)</option>
                      <option value="T">Tidak Berlisensi (T)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Perangkat Riset & Spesifikasi</label>
                    <textarea value={formData.perangkat} onChange={(e) => setFormData({ ...formData, perangkat: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" rows="3" placeholder="Server, GPU, Alat Ukur, Software Riset, dll" />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Info Tambahan / Fokus Riset</label>
                    <input type="text" value={formData.info_tambahan} onChange={(e) => setFormData({ ...formData, info_tambahan: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" placeholder="Bidang fokus penelitian" />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Link Bukti Penelitian (Drive/Web)</label>
                    <input type="text" value={formData.link_bukti} onChange={(e) => setFormData({ ...formData, link_bukti: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" placeholder="https://..." />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  <Button type="submit">{editingId ? 'Update Data' : 'Simpan Data'}</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Table Section */}
        <Card variant="default" className="!p-0 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-violet-500" size={48} />
              <p className="text-sm tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight italic">Belum ada data sarpras penelitian</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider text-center">No</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider">Nama Prasarana</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider text-center">Kapasitas</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider text-center">Luas (m²)</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider text-center">Status Milik</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider text-center">Lisensi</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider">Perangkat</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider">Info Tambahan</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider text-center">Bukti</th>
                    <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {(showTrash ? trashData : activeData).map((item, index) => (
                    <tr key={item.id_3a1} className="hover:bg-slate-50/80 transition-all duration-300 group bg-white">
                      <td className="px-6 py-5 text-center font-bold text-slate-500 text-[0.75rem]">{index + 1}</td>
                      <td className="px-6 py-5 whitespace-normal">
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{item.nama_prasarana || '-'}</div>
                      </td>
                      <td className="px-6 py-5 text-center font-medium text-slate-600">{item.daya_tampung ?? '-'}</td>
                      <td className="px-6 py-5 text-center font-medium text-slate-600">{item.luas_ruang ?? '-'}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg font-bold text-[0.65rem] uppercase tracking-widest border ${item.status_milik === 'M' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                          {item.status_milik === 'M' ? 'MILIK' : 'SEWA'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg font-bold text-[0.65rem] uppercase tracking-widest border ${item.status_lisensi === 'L' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                            item.status_lisensi === 'P' ? 'bg-violet-50 border-violet-200 text-violet-600' :
                              'bg-red-50 border-red-200 text-red-600'
                          }`}>
                          {item.status_lisensi === 'L' ? 'LISENSI' : item.status_lisensi === 'P' ? 'PUBLIC' : 'TDK LISENSI'}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-600 text-[0.75rem] max-w-[200px] leading-relaxed italic whitespace-normal">{item.perangkat || '-'}</td>
                      <td className="px-6 py-5 font-medium text-slate-600 text-[0.75rem] whitespace-normal">{item.info_tambahan || '-'}</td>
                      <td className="px-6 py-5 text-center">
                        {item.link_bukti ? (
                          <a href={item.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 transition-all text-[0.65rem] uppercase tracking-wider">
                            <ExternalLink size={12} /> Buka
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {showTrash ? (
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleRestore(item.id_3a1)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition font-bold text-[0.65rem] uppercase tracking-widest border border-emerald-100 flex items-center gap-1"><RotateCcw size={12}/> Restore</button>
                            <button onClick={() => handleHardDelete(item.id_3a1)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-bold text-[0.65rem] uppercase tracking-widest border border-red-100 flex items-center gap-1"><Trash size={12}/> Hapus</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(item)} className="px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-[0.65rem] uppercase tracking-wider transition-all duration-300 border border-blue-100">Edit</button>
                            <button onClick={() => handleSoftDelete(item.id_3a1)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 border border-transparent hover:border-red-100" title="Hapus"><Trash2 size={16} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
"""

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(logic_part + '  return (\n' + new_jsx.split('  return (\n')[1])
