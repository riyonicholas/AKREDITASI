'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Wallet, TrendingUp, History, ExternalLink } from 'lucide-react';

export default function PenggunaanDanaPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    nama_penggunaan: '',
    jumlah_dana: '',
    link_bukti: '',
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
    if (prodiList.length > 0 && (!filterProdi || filterProdi === '')) {
      const savedProdi = localStorage.getItem('penggunaanDana_filterProdi');
      if (savedProdi && prodiList.some(p => p.id_prodi.toString() === savedProdi)) {
        setFilterProdi(savedProdi);
      } else {
        const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (tiProdi) {
          setFilterProdi(tiProdi.id_prodi.toString());
          localStorage.setItem('penggunaanDana_filterProdi', tiProdi.id_prodi.toString());
        } else if (prodiList.length > 0) {
          setFilterProdi(prodiList[0].id_prodi.toString());
          localStorage.setItem('penggunaanDana_filterProdi', prodiList[0].id_prodi.toString());
        }
      }
    }
  }, [prodiList, filterProdi]);

  useEffect(() => {
    if (!showTrash && (!filterTahun || filterTahun === '')) {
      const savedTahun = localStorage.getItem('penggunaanDana_filterTahun');
      if (savedTahun && tahunList.some(t => t.id_tahun.toString() === savedTahun)) {
        setFilterTahun(savedTahun);
      } else {
        const currentYear = new Date().getFullYear();
        let targetTahun = tahunList.find(t => parseInt(t.tahun) === currentYear);
        if (!targetTahun && tahunList.length > 0) targetTahun = tahunList[tahunList.length - 1];
        if (targetTahun) {
          setFilterTahun(targetTahun.id_tahun.toString());
          localStorage.setItem('penggunaanDana_filterTahun', targetTahun.id_tahun.toString());
        }
      }
    }
  }, [showTrash, tahunList, filterTahun]);

  const handleProdiChange = (e) => {
    const val = e.target.value;
    setFilterProdi(val);
    localStorage.setItem('penggunaanDana_filterProdi', val);
  };

  const handleTahunChange = (e) => {
    const val = e.target.value;
    setFilterTahun(val);
    localStorage.setItem('penggunaanDana_filterTahun', val);
  };

  useEffect(() => {
    if (filterProdi && filterTahun) fetchData();
  }, [filterProdi, filterTahun]);

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setProdiList(result.data);
    } catch (err) {
      console.error('Error fetching prodi:', err);
    }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setTahunList(result.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun)));
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseParams = `id_prodi=${filterProdi}&id_tahun=${filterTahun}`;
      const activeUrl = `http://localhost:5000/api/keuangan/1a3-penggunaan-dana?${baseParams}`;
      const trashUrl  = `http://localhost:5000/api/keuangan/1a3-penggunaan-dana/trash?${baseParams}`;
      const [activeRes, trashRes] = await Promise.all([
        fetch(activeUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(trashUrl,  { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      if (activeResult.success) setActiveData(activeResult.data || []);
      if (trashResult.success) setTrashData(trashResult.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/keuangan/1a3-penggunaan-dana/${editingId}`
      : 'http://localhost:5000/api/keuangan/1a3-penggunaan-dana';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          jumlah_dana: Number(formData.jumlah_dana) || 0
        }),
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
      resetForm();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_penggunaan);
    setFormData({
      id_prodi: item.id_prodi || '',
      id_tahun: item.id_tahun || '',
      nama_penggunaan: item.nama_penggunaan || '',
      jumlah_dana: item.jumlah_dana || '',
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/keuangan/1a3-penggunaan-dana/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/keuangan/1a3-penggunaan-dana/${id}/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('Hapus permanen?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/keuangan/1a3-penggunaan-dana/${id}/hard`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      nama_penggunaan: '',
      jumlah_dana: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const pivotedDataInfo = useMemo(() => {
    const dataToProcess = activeData || [];
    if (dataToProcess.length === 0) return { data: [], ts: new Date().getFullYear() };
    let ts;
    if (filterTahun) {
      const selectedTahun = tahunList.find(t => String(t.id_tahun) === String(filterTahun));
      ts = selectedTahun ? parseInt(selectedTahun.tahun) : new Date().getFullYear();
    } else {
      ts = Math.max(...dataToProcess.map(d => parseInt(d.nama_tahun) || 0));
    }
    const pivot = {};
    dataToProcess.forEach(item => {
      const prodi = item.nama_prodi || '-';
      const penggunaan = item.nama_penggunaan || '-';
      const key = `${prodi}_${penggunaan}`;
      if (!pivot[key]) {
        pivot[key] = { 
          nama_prodi: prodi,
          nama_penggunaan: penggunaan,
          link_bukti: item.link_bukti,
          ts2: 0, ts1: 0, ts: 0, 
          raw: [] 
        };
      }
      const itemTahun = parseInt(item.nama_tahun);
      if (itemTahun === ts) pivot[key].ts = item.jumlah_dana;
      else if (itemTahun === ts - 1) pivot[key].ts1 = item.jumlah_dana;
      else if (itemTahun === ts - 2) pivot[key].ts2 = item.jumlah_dana;
      pivot[key].raw.push(item);
    });
    return { data: Object.values(pivot), ts };
  }, [activeData, filterTahun, tahunList]);

  const formatRupiah = (angka) => {
    if (!angka) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/keuangan/1a3-penggunaan-dana/export?id_prodi=${filterProdi}&id_tahun=${filterTahun}&token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Penggunaan Dana (1.A.3)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Monitoring alokasi dan penggunaan dana program studi</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Penggunaan'}</span>
            </Button>
            <Button onClick={handleExport} variant="success">
              <Download size={18} />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <Wallet size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Dana (TS)</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Total</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate" title={formatRupiah(pivotedDataInfo.data.reduce((acc, curr) => acc + (curr.ts || 0), 0))}>{formatRupiah(pivotedDataInfo.data.reduce((acc, curr) => acc + (curr.ts || 0), 0))}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-emerald-600 shrink-0">
                  <TrendingUp size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Rata-rata</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Rata</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate" title={formatRupiah(pivotedDataInfo.data.length ? pivotedDataInfo.data.reduce((acc, curr) => acc + (curr.ts || 0), 0) / pivotedDataInfo.data.length : 0)}>{formatRupiah(pivotedDataInfo.data.length ? pivotedDataInfo.data.reduce((acc, curr) => acc + (curr.ts || 0), 0) / pivotedDataInfo.data.length : 0)}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <div className="w-full sm:w-[280px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Prodi</label>
              <div className="relative">
                <select value={filterProdi} onChange={handleProdiChange} className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300">
                  <option value="" disabled>Pilih Prodi</option>
                  {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                  <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-[280px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Tahun Akademik</label>
              <div className="relative">
                <select value={filterTahun} onChange={handleTahunChange} className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300">
                  <option value="" disabled>Pilih Tahun</option>
                  {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                  <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <Button onClick={fetchData} variant="outline" className="h-[44px] px-4 shrink-0" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button 
              onClick={() => setShowTrash(!showTrash)} 
              variant={showTrash ? "danger" : "outline"}
              className="h-[44px] shrink-0"
            >
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </Button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Penggunaan Dana' : 'Input Penggunaan Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
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
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Nama Penggunaan Dana</label>
                    <input type="text" value={formData.nama_penggunaan} onChange={(e) => setFormData({...formData, nama_penggunaan: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" placeholder="Contoh: Pembelian Alat Laboratorium" required />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Jumlah Dana (Rp)</label>
                    <input 
                      type="text" 
                      value={formData.jumlah_dana ? new Intl.NumberFormat('id-ID').format(formData.jumlah_dana) : ''} 
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, jumlah_dana: rawValue });
                      }} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" 
                      placeholder="Contoh: 1.000.000" 
                      required 
                    />
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
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-violet-500" size={48} />
              <p className="text-sm tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (showTrash ? trashData : pivotedDataInfo.data).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data penggunaan dana</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  {showTrash ? (
                    <tr>
                      <th className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Penggunaan</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Jumlah</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Tahun</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider text-center border-r border-white/20">Aksi</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Penggunaan Dana</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">TS-2 ({pivotedDataInfo.ts - 2})</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">TS-1 ({pivotedDataInfo.ts - 1})</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center text-yellow-300">TS ({pivotedDataInfo.ts})</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider text-center border-r border-white/20">Aksi</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {showTrash ? (
                    trashData.map((item) => (
                      <tr key={item.id_penggunaan} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0">
                          <div className="text-sm text-slate-800">{item.nama_penggunaan}</div>
                        </td>
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0 text-slate-600">
                          {formatRupiah(item.jumlah_dana)}
                        </td>
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0 text-center">
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[0.65rem] font-bold">{item.nama_tahun}</span>
                        </td>
                        <td className="px-8 py-6 border-r border-slate-200">
                          <div className="inline-flex items-center gap-2">
                            <button onClick={() => handle(item.id_penggunaan)} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title=""> <RotateCcw size={17} /></button>
                            <button onClick={() => handleHardDelete(item.id_penggunaan)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title=" "> <Trash2 size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    pivotedDataInfo.data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                        <td className="px-8 py-6 border-r border-slate-200 last:border-0 whitespace-normal">
                          <div className="text-sm text-slate-800 group-hover:text-violet-600 transition-colors leading-relaxed">{row.nama_penggunaan}</div>
                          {row.link_bukti && (
                            <a href={row.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-blue-500 hover:text-blue-600 text-[0.65rem] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors">
                              <ExternalLink size={12} /> Link Bukti
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-6 border-r border-slate-200 last:border-0 text-center">
                          <div className="text-sm text-slate-500">{formatRupiah(row.ts2)}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-slate-200 last:border-0 text-center">
                          <div className="text-sm text-slate-500">{formatRupiah(row.ts1)}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-slate-200 last:border-0 text-center bg-blue-50/30">
                          <div className="text-sm text-blue-600">{formatRupiah(row.ts)}</div>
                        </td>
                        <td className="px-8 py-6 align-middle text-center border-r border-slate-200">
                          <div className="flex justify-center gap-2">
                             {(() => {
                               const currentYearItem = row.raw.find(item => parseInt(item.nama_tahun) === pivotedDataInfo.ts);
                               if (currentYearItem) {
                                return (
                                  <>
                                    <button onClick={() => handleEdit(currentYearItem)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit TS"><Edit size={17} /></button>
                                    <button onClick={() => handleSoftDelete(currentYearItem.id_penggunaan)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus TS"><Trash2 size={17} /></button>
                                  </>
                                );
                              } else {
                                return (
                                  <button 
                                    onClick={() => {
                                      setFormData({
                                        id_prodi: filterProdi || '',
                                        id_tahun: filterTahun || '',
                                        nama_penggunaan: row.nama_penggunaan || '',
                                        jumlah_dana: '',
                                        link_bukti: row.link_bukti || '',
                                      });
                                      setEditingId(null);
                                      setShowForm(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-all text-[0.65rem] uppercase tracking-widest border border-violet-100"
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
        </div>
      </div>
    </div>
  );
}