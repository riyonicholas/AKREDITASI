'use client';

import { Edit, Trash2, RotateCcw,  useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ArrowLeft, Download, RefreshCw, ExternalLink, Info, Users, GraduationCap, Briefcase } from 'lucide-react';

export default function TendikKualifikasiPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    s3: 0, s2: 0, s1: 0, d4: 0, d3: 0, d2: 0, d1: 0, sma: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/kepegawaian/1a5-tendik', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        processData(result.summary);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processData = (rawSummary) => {
    let newTotals = { s3: 0, s2: 0, s1: 0, d4: 0, d3: 0, d2: 0, d1: 0, sma: 0 };
    const dataWithNo = (rawSummary || []).map((item, index) => {
      newTotals.s3 += item.s3 || 0;
      newTotals.s2 += item.s2 || 0;
      newTotals.s1 += item.s1 || 0;
      newTotals.d4 += item.d4 || 0;
      newTotals.d3 += item.d3 || 0;
      newTotals.d2 += item.d2 || 0;
      newTotals.d1 += item.d1 || 0;
      newTotals.sma += item.sma || 0;
      return { ...item, no: index + 1 };
    });
    setData(dataWithNo);
    setTotals(newTotals);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/kepegawaian/1a5-tendik/export?token=${token}`, '_blank');
  };

  return (
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
          <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative z-10 flex items-center gap-3 w-full">
              <div className="text-blue-600 shrink-0">
                <Users size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Tendik</p>
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Tendik</p>
                <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                <p className="text-sm font-black text-slate-800 tracking-tight truncate">{Object.values(totals).reduce((a, b) => a + b, 0)}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative z-10 flex items-center gap-3 w-full">
              <div className="text-emerald-600 shrink-0">
                <GraduationCap size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Kualifikasi S1-S3</p>
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">S1-S3</p>
                <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                <p className="text-sm font-black text-slate-800 tracking-tight truncate">{totals.s1 + totals.s2 + totals.s3}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative z-10 flex items-center gap-3 w-full">
              <div className="text-amber-600 shrink-0">
                <Briefcase size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Unit Kerja Aktif</p>
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Unit</p>
                <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                <p className="text-sm font-black text-slate-800 tracking-tight truncate">{data.length}</p>
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
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-violet-500" size={48} />
              <p className="text-sm tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th rowSpan="2" className="x-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-100 border-r border-white/20 text-center align-middle">No</th>
                    <th rowSpan="2" className="x-8 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 align-middle">Jenis Tenaga Kependidikan</th>
                    <th colSpan="8" className="x-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-100 border-r border-white/20 text-center ">Jumlah Berdasarkan Pendidikan Terakhir</th>
                    <th rowSpan="2" className="x-8 py-4 text-xs font-bold text-slate-100 uppercase tracking-[0.2em] align-middle border-r border-white/20">Unit Kerja</th>
                  </tr>
                  <tr className="bg-[#162d6e]">
                     {['S3', 'S2', 'S1', 'D4', 'D3', 'D2', 'D1', 'SMA'].map(edu => (
                       <th key={edu} className="px-3 py-3 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20 text-center">{edu}</th>
                     ))}
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((row) => (
                    <tr key={row.no} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-5 border-r border-slate-200 text-center text-[0.7rem] text-slate-500">{row.no}</td>
                      <td className="px-8 py-5 border-r border-slate-200 whitespace-normal">
                        <div className="text-sm text-slate-800 group-hover:text-amber-600 transition-colors leading-relaxed">{row.jenis}</div>
                      </td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm text-slate-500">{row.s3 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm text-slate-500">{row.s2 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm text-slate-500">{row.s1 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm text-slate-500">{row.d4 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm text-slate-500">{row.d3 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm text-slate-500">{row.d2 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm text-slate-500">{row.d1 || '-'}</td>
                      <td className="px-3 py-5 border-r border-slate-200 text-center text-sm text-slate-500">{row.sma || '-'}</td>
                      <td className="px-8 py-5 text-xs text-slate-500 italic whitespace-normal border-r border-slate-200">{row.unit_kerja || '-'}</td>
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
        </div>

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
