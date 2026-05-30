import re

file_path = 'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/sumber-dana/page.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

logic_part = content.split('  return (')[0]

new_jsx = """  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Sumber Dana (1.A.2)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Pengelolaan sumber pendanaan operasional & pengembangan</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Sumber'}</span>
            </Button>
            <Button onClick={handleExport} variant="success">
              <Download size={18} />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 group-hover:scale-110 transition-transform duration-500">
                <Landmark size={80} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-blue-100/80 text-blue-600 rounded-xl border border-blue-200/50 backdrop-blur-sm shrink-0">
                  <Landmark size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pendanaan</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{formatRupiah(pivotedDataInfo.data.reduce((acc, curr) => acc + (curr.ts || 0), 0))}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-violet-50 group-hover:scale-110 transition-transform duration-500">
                <PieChart size={80} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-violet-100/80 text-violet-600 rounded-xl border border-violet-200/50 backdrop-blur-sm shrink-0">
                  <PieChart size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Sumber Aktif</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{pivotedDataInfo.data.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-orange-50 group-hover:scale-110 transition-transform duration-500">
                <History size={80} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-orange-100/80 text-orange-600 rounded-xl border border-orange-200/50 backdrop-blur-sm shrink-0">
                  <History size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Mode</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{showTrash ? 'Sampah' : 'Aktif'}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 lg:w-48">
              <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Prodi</label>
              <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer">
                {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
              </select>
            </div>
            <div className="flex-1 lg:w-32">
              <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Tahun (TS)</label>
              <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer">
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
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
            <Card title={editingId ? 'Edit Sumber Dana' : 'Input Sumber Dana Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Program Studi</label>
                    <select value={formData.id_prodi} onChange={(e) => setFormData({...formData, id_prodi: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer" required>
                      <option value="">Pilih Prodi</option>
                      {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Tahun Akademik</label>
                    <select value={formData.id_tahun} onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer" required>
                      <option value="">Pilih Tahun</option>
                      {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Jenis / Sumber Pendanaan</label>
                    <input type="text" value={formData.nama_sumber} onChange={(e) => setFormData({...formData, nama_sumber: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" placeholder="Contoh: Dana Rutin Yayasan" required />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Jumlah Dana (Rp)</label>
                    <input type="number" value={formData.jumlah_dana} onChange={(e) => setFormData({...formData, jumlah_dana: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" placeholder="Masukkan angka saja" required />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Link Bukti (G-Drive / PDF)</label>
                    <input type="url" value={formData.link_bukti} onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" placeholder="https://..." />
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
          ) : (showTrash ? trashData : pivotedDataInfo.data).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data sumber dana</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  {showTrash ? (
                    <tr>
                      <th className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Sumber Dana</th>
                      <th className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Jumlah</th>
                      <th className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 text-center">Tahun</th>
                      <th className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Sumber Pendanaan</th>
                      <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 text-center">TS-2 ({pivotedDataInfo.ts - 2})</th>
                      <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 text-center">TS-1 ({pivotedDataInfo.ts - 1})</th>
                      <th className="px-6 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 text-center bg-blue-50/50">TS ({pivotedDataInfo.ts})</th>
                      <th className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Link Bukti</th>
                      <th className="px-8 py-5 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {showTrash ? (
                    trashData.map((item) => (
                      <tr key={item.id_sumber} className="hover:bg-orange-50/30 transition-colors group bg-white">
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0">
                          <div className="text-sm font-semibold text-slate-800">{item.nama_sumber}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0 font-medium text-slate-600">
                          {formatRupiah(item.jumlah_dana)}
                        </td>
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0 text-center">
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[0.65rem] font-bold">{item.nama_tahun}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center gap-2">
                            <button onClick={() => handleRestore(item.id_sumber)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition font-bold text-[0.65rem] uppercase tracking-widest border border-emerald-100 flex items-center gap-1"><RotateCcw size={12}/> Restore</button>
                            <button onClick={() => handleHardDelete(item.id_sumber)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-bold text-[0.65rem] uppercase tracking-widest border border-red-100 flex items-center gap-1"><Trash size={12}/> Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    pivotedDataInfo.data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors group bg-white">
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0 whitespace-normal">
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-violet-600 transition-colors leading-relaxed">{row.nama_sumber}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-slate-200 last:border-0 text-center">
                          <div className="text-sm font-medium text-slate-500">{formatRupiah(row.ts2)}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-slate-200 last:border-0 text-center">
                          <div className="text-sm font-medium text-slate-500">{formatRupiah(row.ts1)}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-slate-200 last:border-0 text-center bg-blue-50/30">
                          <div className="text-sm font-black text-blue-600">{formatRupiah(row.ts)}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0">
                          {row.link_bukti && (
                            <a href={row.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 font-bold text-[0.65rem] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors">
                              <ExternalLink size={12} /> Bukti
                            </a>
                          )}
                        </td>
                        <td className="px-8 py-6 align-middle text-center">
                          <div className="flex justify-center gap-2">
                            {(() => {
                              const currentYearItem = row.raw.find(item => parseInt(item.nama_tahun) === pivotedDataInfo.ts);
                              if (currentYearItem) {
                                return (
                                  <>
                                    <button onClick={() => handleEdit(currentYearItem)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit TS"><Edit size={16} /></button>
                                    <button onClick={() => handleSoftDelete(currentYearItem.id_sumber)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus TS"><Trash2 size={16} /></button>
                                  </>
                                );
                              } else {
                                return (
                                  <button 
                                    onClick={() => {
                                      setFormData({
                                        id_prodi: filterProdi || '',
                                        id_tahun: filterTahun || '',
                                        nama_sumber: row.nama_sumber || '',
                                        jumlah_dana: '',
                                        link_bukti: row.link_bukti || '',
                                      });
                                      setEditingId(null);
                                      setShowForm(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-all font-bold text-[0.65rem] uppercase tracking-widest border border-violet-100"
                                  >
                                    <Plus size={12} /> Isi TS
                                  </button>
                                );
                              }
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
