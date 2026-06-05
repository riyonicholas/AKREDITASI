'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Download, RefreshCw, Trash2, CheckCircle, Target, Database, Globe, AlertTriangle, Edit3, X, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function KondisiMahasiswaPage() {
  const router = useRouter();
  
  // Data States
  const [data, setData] = useState({
    ts: { id_tahun: 0, tahun: 0, maba: 0, lulus: 0, do: 0, aktif: 0 },
    ts1: { id_tahun: 0, tahun: 0, maba: 0, lulus: 0, do: 0, aktif: 0 },
    ts2: { id_tahun: 0, tahun: 0, maba: 0, lulus: 0, do: 0, aktif: 0 }
  });
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [trashData, setTrashData] = useState([]);
  
  // Selection States
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('main'); // 'main' | 'trash'
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    lulus: 0,
    do: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchProdiList();
      fetchTahunList();
    }
  }, [router]);

  useEffect(() => {
    if (prodiList.length > 0 && !filterProdi) {
      const savedProdi = localStorage.getItem('kondisiMahasiswa_filterProdi');
      if (savedProdi && prodiList.some(p => p.id_prodi.toString() === savedProdi)) {
        setFilterProdi(savedProdi);
      } else {
        const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (tiProdi) {
          setFilterProdi(tiProdi.id_prodi.toString());
          localStorage.setItem('kondisiMahasiswa_filterProdi', tiProdi.id_prodi.toString());
        }
      }
    }
  }, [prodiList]);

  useEffect(() => {
    if (tahunList.length > 0 && !filterTahun) {
      const savedTahun = localStorage.getItem('kondisiMahasiswa_filterTahun');
      if (savedTahun && tahunList.some(t => t.id_tahun.toString() === savedTahun)) {
        setFilterTahun(savedTahun);
      } else {
        const sortedTahun = [...tahunList].sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
        if (sortedTahun.length > 0) {
          setFilterTahun(sortedTahun[0].id_tahun.toString());
          localStorage.setItem('kondisiMahasiswa_filterTahun', sortedTahun[0].id_tahun.toString());
        }
      }
    }
  }, [tahunList]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      if (viewMode === 'main') {
        fetchData();
      } else {
        fetchTrashData();
      }
    }
  }, [filterProdi, filterTahun, viewMode]);

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setProdiList(result.data || []);
    } catch (err) { console.error('Error fetching prodi:', err); }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) return; // endpoint belum siap, skip tanpa crash
      const result = await res.json();
      if (result.success) setTahunList(result.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun)) || []);
    } catch (err) { console.error('Error fetching tahun:', err); }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/ala/2a3-kondisi-mahasiswa/${filterProdi}/${filterTahun}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) {
        // Endpoint belum siap atau tidak ditemukan — tampilkan data kosong
        setData({ ts: {}, ts1: {}, ts2: {} });
        return;
      }
      const result = await res.json();
      if (result.success) {
        setData(result.data || { ts: {}, ts1: {}, ts2: {} });
        setFormData({
            lulus: result.data?.ts?.lulus || 0,
            do: result.data?.ts?.do || 0
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/ala/2a3-kondisi-mahasiswa/trash/${filterProdi}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setTrashData(result.data || []);
    } catch (err) { console.error('Error fetching trash:', err); } finally { setLoading(false); }
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/ala/2a3-kondisi-mahasiswa/export/${filterProdi}/${filterTahun}?token=${token}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    let userId = 1;
    try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        if (userObj.id_user || userObj.id_unit) userId = userObj.id_user || userObj.id_unit;
    } catch(e) {}

    const payload = {
      id_prodi: parseInt(filterProdi),
      id_tahun: data.ts.id_tahun || parseInt(filterTahun),
      user_id: userId,
      lulus: parseInt(formData.lulus) || 0,
      do: parseInt(formData.do) || 0
    };

    try {
      const res = await fetch(`http://localhost:5000/api/ala/2a3-kondisi-mahasiswa/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        alert("Data berhasil disimpan.");
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Gagal menyimpan: " + result.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSoftDelete = async () => {
    if (!data.ts || !data.ts.id_2a3) {
      alert("Tidak ada data aktif untuk tahun akademik terpilih yang dapat dihapus.");
      return;
    }
    if (!confirm('Apakah Anda yakin ingin memindahkan data ini ke Trash?')) return;
    
    const token = localStorage.getItem('token');
    let userId = 1;
    try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        if (userObj.id_user || userObj.id_unit) userId = userObj.id_user || userObj.id_unit;
    } catch(e) {}

    try {
      const res = await fetch(`http://localhost:5000/api/ala/2a3-kondisi-mahasiswa/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_2a3: data.ts.id_2a3, user_id: userId })
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      alert("Gagal memproses penghapusan.");
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/ala/2a3-kondisi-mahasiswa/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) fetchTrashData();
    } catch (err) {
      alert("Gagal memulihkan data.");
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm("Menghapus data secara permanen akan menghilangkan data tahun akademik ini dari sistem. Lanjutkan?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/ala/2a3-kondisi-mahasiswa/hard-delete/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) fetchTrashData();
    } catch (err) {
      alert("Gagal menghapus permanen.");
    }
  };

  const ts2 = data.ts2 || {};
  const ts1 = data.ts1 || {};
  const ts = data.ts || {};

  const rowsLayout = [
    { label: 'Mahasiswa Baru', c2: parseInt(ts2.maba)||0, c1: parseInt(ts1.maba)||0, c0: parseInt(ts.maba)||0 },
    { label: 'Mahasiswa Aktif pada saat TS', c2: parseInt(ts2.aktif)||0, c1: parseInt(ts1.aktif)||0, c0: parseInt(ts.aktif)||0 },
    { label: 'Lulus pada saat TS', c2: parseInt(ts2.lulus)||0, c1: parseInt(ts1.lulus)||0, c0: parseInt(ts.lulus)||0 },
    { label: 'Mengundurkan Diri/DO pada saat TS', c2: parseInt(ts2.do)||0, c1: parseInt(ts1.do)||0, c0: parseInt(ts.do)||0 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kondisi Jumlah Mahasiswa (2.A.3)</h1>
              <p className="text-slate-500 mt-1 font-medium">Manajemen retensi dan kondisi mahasiswa per angkatan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleExport} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-end w-full">
          <div className="w-full sm:w-[280px]">
            <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Program Studi</label>
            <div className="relative">
              <select 
                value={filterProdi} 
                onChange={(e) => {
                  setFilterProdi(e.target.value);
                  localStorage.setItem('kondisiMahasiswa_filterProdi', e.target.value);
                }} 
                className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
              >
                {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-[150px]">
            <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Tahun (TS)</label>
            <div className="relative">
              <select 
                value={filterTahun} 
                onChange={(e) => {
                  setFilterTahun(e.target.value);
                  localStorage.setItem('kondisiMahasiswa_filterTahun', e.target.value);
                }} 
                className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
              >
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}/{parseInt(t.tahun)+1}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <Button onClick={() => viewMode === 'main' ? fetchData() : fetchTrashData()} variant="outline" className="h-[44px] px-4 shrink-0" title="Refresh Data">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button onClick={() => setViewMode('main')} className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase ${viewMode === 'main' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-500'}`}>
            Dashboard & Input
          </button>
          <button onClick={() => setViewMode('trash')} className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase flex items-center gap-2 ${viewMode === 'trash' ? 'border-b-4 border-red-600 text-red-600' : 'text-slate-500 hover:text-slate-500'}`}>
            <Trash2 size={17} /> Trash Bin
          </button>
        </div>

        {viewMode === 'trash' ? (
          <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-3">
              <Trash2 className="text-red-500" /> Data Terhapus
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/80/50">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-6 py-4 border-r border-white/20">Tahun Akademik</th>
                    <th className="px-6 py-4 border-r border-white/20">Dihapus Pada</th>
                    <th className="px-6 py-4 text-center border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trashData.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400 font-bold">Trash Kosong</td></tr>
                  ) : trashData.map(item => (
                    <tr key={item.id_2a3} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-bold text-slate-800 border-r border-slate-200">{item.tahun}/{parseInt(item.tahun)+1}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm border-r border-slate-200">{new Date(item.ala_deleted_at).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleRestore(item.id_2a3)} className="px-4 py-2 bg-blue-50/80 text-violet-600 hover:bg-blue-600 hover:text-slate-900 rounded-lg font-bold text-[10px] uppercase transition border border-blue-800">Restore</button>
                          <button onClick={() => handleHardDelete(item.id_2a3)} className="px-4 py-2 bg-red-100 text-red-400 hover:bg-red-600 hover:text-slate-900 rounded-lg font-bold text-[10px] uppercase transition border border-red-200">Hapus Permanen</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* MODAL FORM */}
            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0 bg-white rounded-t-[2rem]">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Edit3 className="text-blue-500"/> Input / Edit Data Retensi</h2>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Input untuk Tahun Akademik {ts.tahun ? `${ts.tahun}/${parseInt(ts.tahun)+1}` : 'Berjalan'}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 rounded-xl transition">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      <div className="grid grid-cols-2 gap-6 p-5 bg-slate-50/80/40 border border-slate-200/60 rounded-2xl shadow-sm">
                        <div>
                          <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Mahasiswa Baru (2.A.1)</span>
                          <input type="number" value={ts.maba || 0} disabled className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-black text-center text-slate-600 cursor-not-allowed outline-none" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Mahasiswa Aktif (2.A.1)</span>
                          <input type="number" value={ts.aktif || 0} disabled className="w-full p-3 bg-emerald-50 border border-green-900/30 rounded-xl text-sm font-black text-center text-green-500 cursor-not-allowed outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 p-5 bg-slate-50/80/40 border border-slate-200/60 rounded-2xl shadow-sm">
                        <div>
                          <span className="block text-xs font-bold text-slate-800 uppercase mb-2">Jumlah Lulus</span>
                          <input type="number" min="0" value={formData.lulus} onChange={(e) => setFormData({...formData, lulus: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-black text-center text-slate-800 outline-none focus:border-blue-500 transition focus:ring-2 focus:ring-blue-500/50" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-800 uppercase mb-2">Jumlah DO / Resign</span>
                          <input type="number" min="0" value={formData.do} onChange={(e) => setFormData({...formData, do: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-black text-center text-slate-800 outline-none focus:border-blue-500 transition focus:ring-2 focus:ring-blue-500/50" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                        <button type="button" onClick={handleSoftDelete} className="px-6 py-3.5 bg-red-50 text-red-500 border border-red-200 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-red-600 hover:text-slate-900 transition shadow-sm mr-auto">
                          Hapus Data
                        </button>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 bg-slate-50/80 text-slate-600 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition">
                          Batal
                        </button>
                        <button type="submit" className="px-10 py-3.5 bg-blue-600 text-slate-900 rounded-xl font-black text-xs tracking-widest uppercase shadow-lg shadow-violet-200/50 hover:bg-violet-700 transition flex items-center justify-center gap-2">
                          <Save size={18} /> Simpan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW TABLE */}
            <div className="flex flex-col gap-6 w-full">
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                    <Globe className="text-blue-500" /> Kondisi Jumlah Mahasiswa
                  </h2>
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-violet-50 text-violet-600 border border-violet-200 px-5 py-3 rounded-xl hover:bg-blue-600 hover:text-slate-900 transition shadow-lg shadow-violet-200/50 font-black text-xs tracking-widest uppercase">
                    <Edit3 size={17} />
                    <span>Input / Edit Data</span>
                  </button>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-blue-500">
                      <RefreshCw className="animate-spin mb-4" size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">Memuat Laporan...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-slate-50/80/50 custom-scrollbar">
                      <table className="w-full min-w-max text-left whitespace-nowrap">
                        <thead className="bg-[#1E3A8A]">
                          <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                            <th rowSpan="2" className="w-[40%] px-6 py-4 border-r border-white/20 align-middle">Kondisi Retensi</th>
                            <th colSpan="3" className="px-6 py-3 border-r border-white/20 text-center border-b border-white/20">Angkatan</th>
                            <th rowSpan="2" className="w-[15%] px-6 py-4 border-r border-white/20 text-center align-middle">Jumlah</th>
                          </tr>
                          <tr className="bg-[#162d6e] text-xs font-bold text-slate-100 text-center">
                            <th className="w-[15%] px-4 py-3 border-r border-white/20">TS-2</th>
                            <th className="w-[15%] px-4 py-3 border-r border-white/20">TS-1</th>
                            <th className="w-[15%] px-4 py-3 border-r border-white/20">TS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {rowsLayout.map((r, i) => {
                            const total = r.c2 + r.c1 + r.c0;
                            return (
                              <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 text-slate-800 uppercase text-xs tracking-tight border-r border-slate-200">{r.label}</td>
                                <td className="text-center px-4 py-4 text-slate-500 font-semibold border-r border-slate-200 text-sm">{r.c2}</td>
                                <td className="text-center px-4 py-4 text-slate-500 font-semibold border-r border-slate-200 text-sm">{r.c1}</td>
                                <td className="text-center px-4 py-4 text-blue-500 bg-blue-50/30 text-sm border-r border-slate-200">{r.c0}</td>
                                <td className="text-center px-4 py-4 text-slate-800 text-sm border-r border-slate-200">{total}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
