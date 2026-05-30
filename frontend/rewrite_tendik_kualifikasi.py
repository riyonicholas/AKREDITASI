import re

file_path = 'd:/goat/SI-AKREDITASI/frontend/src/app/tabel/tendik-kualifikasi/page.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

logic_part = content.split('  return (')[0]

new_jsx = """  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Kualifikasi Tendik (1.A.5)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Rekapitulasi kualifikasi pendidikan terakhir tenaga kependidikan</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchData} variant="outline" className="px-4">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Data</span>
            </Button>
            <Button onClick={handleExport} variant="success">
              <Download size={18} />
              <span>Export Excel LKPS</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 group-hover:scale-110 transition-transform duration-500">
              <Users size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-blue-100/80 text-blue-600 rounded-xl border border-blue-200/50 backdrop-blur-sm shrink-0">
                <Users size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tendik</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{Object.values(totals).reduce((a, b) => a + b, 0)}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-emerald-100/80 text-emerald-600 rounded-xl border border-emerald-200/50 backdrop-blur-sm shrink-0">
                <GraduationCap size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Kualifikasi S1-S3</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{totals.s1 + totals.s2 + totals.s3}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-amber-50 group-hover:scale-110 transition-transform duration-500">
              <Briefcase size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-amber-100/80 text-amber-600 rounded-xl border border-amber-200/50 backdrop-blur-sm shrink-0">
                <Briefcase size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Unit Kerja Aktif</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/20 shrink-0">
            <Info size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-blue-700 font-bold text-sm uppercase tracking-wider mb-1">Sinkronisasi Otomatis</p>
            <p className="text-blue-600 text-[0.8rem] font-medium leading-relaxed mb-3">
              Tabel ini dihasilkan secara otomatis dari data Master Tenaga Kependidikan. 
              Perubahan pada data master akan langsung tercermin di sini.
            </p>
            <Button 
              onClick={() => router.push('/tabel/master/tendik')}
              variant="outline"
              className="!py-1.5 !px-3 text-[0.65rem] !bg-white border-blue-200 hover:!bg-blue-100 text-blue-600 hover:text-blue-700 uppercase tracking-widest shadow-sm"
            >
              <ExternalLink size={12} /> Kelola Master Tendik
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <Card variant="default" className="!p-0 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-violet-500" size={48} />
              <p className="text-sm tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th rowSpan="2" className="px-6 py-4 text-[0.78rem] font-bold uppercase tracking-wider text-slate-400 border-r border-slate-200 text-center align-middle">No</th>
                    <th rowSpan="2" className="px-8 py-4 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 align-middle">Jenis Tenaga Kependidikan</th>
                    <th colSpan="8" className="px-6 py-4 text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 border-r border-slate-200 text-center bg-slate-100/50">Jumlah Berdasarkan Pendidikan Terakhir</th>
                    <th rowSpan="2" className="px-8 py-4 text-[0.7rem] font-bold text-slate-500 uppercase tracking-[0.2em] align-middle">Unit Kerja</th>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['S3', 'S2', 'S1', 'D4', 'D3', 'D2', 'D1', 'SMA'].map(edu => (
                      <th key={edu} className="px-3 py-3 text-[0.6rem] font-black text-slate-500 uppercase tracking-widest border-r border-slate-200 text-center">{edu}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((row) => (
                    <tr key={row.no} className="hover:bg-slate-50/80 transition-colors group bg-white">
                      <td className="px-6 py-5 border-r border-slate-200 text-center text-[0.7rem] font-bold text-slate-500">{row.no}</td>
                      <td className="px-8 py-5 border-r border-slate-200 whitespace-normal">
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-600 transition-colors leading-relaxed">{row.jenis}</div>
                      </td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-medium text-slate-500">{row.s3 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-medium text-slate-500">{row.s2 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-medium text-slate-500">{row.s1 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-medium text-slate-500">{row.d4 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-medium text-slate-500">{row.d3 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-medium text-slate-500">{row.d2 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-medium text-slate-500">{row.d1 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-medium text-slate-500">{row.sma || '-'}</td>
                      <td className="px-8 py-5 text-xs text-slate-500 italic font-medium whitespace-normal">{row.unit_kerja || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                  <tr className="text-slate-800">
                    <td colSpan="2" className="px-8 py-5 text-right text-[0.65rem] uppercase tracking-[0.2em] font-black text-slate-500">Total Keseluruhan</td>
                    <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-black text-blue-600">{totals.s3}</td>
                    <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-black text-blue-600">{totals.s2}</td>
                    <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-black text-blue-600">{totals.s1}</td>
                    <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-semibold text-slate-800">{totals.d4}</td>
                    <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-semibold text-slate-800">{totals.d3}</td>
                    <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-semibold text-slate-800">{totals.d2}</td>
                    <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-semibold text-slate-800">{totals.d1}</td>
                    <td className="px-3 py-5 border-r border-slate-200 text-center text-sm font-semibold text-slate-800">{totals.sma}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>

        {/* Footnote Section */}
        <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Info size={14} className="text-amber-500" strokeWidth={3} /> Keterangan Tambahan
          </p>
          <div className="space-y-2">
            <p className="text-[0.75rem] text-slate-600 font-medium leading-relaxed">
              <span className="text-amber-600 font-bold mr-1">*)</span> Pustakawan adalah staf perpustakaan yang memiliki ijazah atau sertifikat kompetensi pada bidang ilmu perpustakaan.
            </p>
            <p className="text-[0.75rem] text-slate-600 font-medium leading-relaxed">
              <span className="text-blue-600 font-bold mr-1">**)</span> Data diperbarui secara real-time berdasarkan input pada modul kepegawaian.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(logic_part + '  return (\n' + new_jsx.split('  return (\n')[1])
