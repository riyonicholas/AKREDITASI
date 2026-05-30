'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Building2, Layout, Maximize, ExternalLink } from 'lucide-react';

export default function SarprasPkMPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdProdi, setFilterIdProdi] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');
  const [prodiList, setProdiList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_prodi: '',
    nama_prasarana: '',
    daya_tampung: 0,
    luas_ruang: 0,
    status_milik: 'M',
    status_lisensi: 'L',
    perangkat: '',
    info_tambahan: '',
    link_bukti: '',
  });

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchProdiList();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdProdi) {
      fetchData();
    }
  }, [filterIdProdi]);

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        const informatikaProdi = result.data.filter(p => p.nama_prodi.includes('Informatika'));
        setProdiList(informatikaProdi);
        if (informatikaProdi.length > 0 && !filterIdProdi) {
          const savedProdi = localStorage.getItem('sarprasPkm_filterProdi');
          if (savedProdi && informatikaProdi.some(p => p.id_prodi.toString() === savedProdi)) {
            setFilterIdProdi(savedProdi);
          } else {
            setFilterIdProdi(informatikaProdi[0].id_prodi.toString());
            localStorage.setItem('sarprasPkm_filterProdi', informatikaProdi[0].id_prodi.toString());
          }
        }
      }
    } catch (err) {
      console.error('Error fetching prodi list:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseUrl = 'http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm';
      const params = `?id_prodi=${filterIdProdi}`;
      
      const [activeRes, trashRes] = await Promise.all([
        fetch(`${baseUrl}${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/trash${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      
      if (activeResult.success) setActiveData(activeResult.data || []);
      if (trashResult.success) setTrashData(trashResult.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/${editingId}`
      : 'http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
      resetForm();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_4a1);
    setFormData({
      id_prodi: item.id_prodi,
      nama_prasarana: item.nama_prasarana,
      daya_tampung: item.daya_tampung,
      luas_ruang: item.luas_ruang,
      status_milik: item.status_milik,
      status_lisensi: item.status_lisensi,
      perangkat: item.perangkat || '',
      info_tambahan: item.info_tambahan || '',
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      showError('Gagal restore data');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('Yakin hapus permanen?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      showError('Gagal hapus permanen');
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterIdProdi,
      nama_prasarana: '',
      daya_tampung: 0,
      luas_ruang: 0,
      status_milik: 'M',
      status_lisensi: 'L',
      perangkat: '',
      info_tambahan: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/sarpras/4a1-sarana-prasarana-pkm/export?id_prodi=${filterIdProdi}&token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Sarpras PkM (4.A.1)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Tabel 4.A.1 Sarana dan Prasarana PkM</p>
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
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 animate-in fade-in duration-300 font-medium">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <Building2 size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Sarpras</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Total</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-violet-600 shrink-0">
                  <Maximize size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Luas</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Luas</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.reduce((acc, curr) => acc + (parseFloat(curr.luas_ruang) || 0), 0).toFixed(1)} m²</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <div className="w-full sm:w-[280px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Filter Prodi</label>
              <div className="relative">
                <select 
                  value={filterIdProdi} 
                  onChange={(e) => {
                    setFilterIdProdi(e.target.value);
                    localStorage.setItem('sarprasPkm_filterProdi', e.target.value);
                  }} 
                  className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
                >
                  {prodiList.map(prodi => (
                    <option key={prodi.id_prodi} value={prodi.id_prodi}>{prodi.nama_prodi}</option>
                  ))}
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
            <Card title={editingId ? 'Edit Data Sarpras' : 'Input Sarpras Baru'} icon={<Layout className="text-violet-500" size={20}/>} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Program Studi</label>
                    <select 
                      value={formData.id_prodi} 
                      onChange={(e) => setFormData({...formData, id_prodi: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
                      required
                    >
                      <option value="">Pilih Program Studi</option>
                      {prodiList.map(p => (
                        <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Nama Prasarana</label>
                    <input 
                      type="text" 
                      value={formData.nama_prasarana} 
                      onChange={(e) => setFormData({...formData, nama_prasarana: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" 
                      placeholder="Nama Laboratorium / Ruang"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Daya Tampung</label>
                    <input 
                      type="number" 
                      value={formData.daya_tampung} 
                      onChange={(e) => setFormData({...formData, daya_tampung: parseInt(e.target.value) || 0})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" 
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Luas Ruang (m²)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.luas_ruang} 
                      onChange={(e) => setFormData({...formData, luas_ruang: parseFloat(e.target.value) || 0})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" 
                      min="0"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Status Milik</label>
                      <select 
                        value={formData.status_milik} 
                        onChange={(e) => setFormData({...formData, status_milik: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
                      >
                        <option value="M">Milik Sendiri (M)</option>
                        <option value="W">Sewa (W)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Status Lisensi</label>
                      <select 
                        value={formData.status_lisensi} 
                        onChange={(e) => setFormData({...formData, status_lisensi: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
                      >
                        <option value="L">Berlisensi (L)</option>
                        <option value="P">Public Domain (P)</option>
                        <option value="T">Tidak Berlisensi (T)</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Detail Perangkat</label>
                    <textarea 
                      value={formData.perangkat} 
                      onChange={(e) => setFormData({...formData, perangkat: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" 
                      placeholder="Daftar Perangkat (Hard/Soft, Bandwidth, Tool, dll)"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Info Tambahan</label>
                    <input 
                      type="text" 
                      value={formData.info_tambahan} 
                      onChange={(e) => setFormData({...formData, info_tambahan: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" 
                      placeholder="Kegunaan / Informasi lainnya"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Link Bukti</label>
                    <input 
                      type="text" 
                      value={formData.link_bukti} 
                      onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" 
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  <Button type="submit">{editingId ? 'Update Data' : 'Simpan Sarpras'}</Button>
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
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Layout size={40} strokeWidth={1.5} />
              </div>
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data sarpras</p>
              <p className="text-slate-400 text-sm mt-1">Gunakan tombol "Tambah Sarpras" untuk mulai mengisi</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Nama Prasarana</th>
                    <th className="px-4 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Daya Tampung</th>
                    <th className="px-4 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Luas Ruang (m²)</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Milik Sendiri (M)/ Sewa (W)</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Berlisensi (L)/ Public Domain (P)/ Tidak Berlisensi (T)</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Perangkat</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Info Tambahan</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Link Bukti</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider text-center border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(showTrash ? trashData : activeData).map((item) => (
                    <tr key={item.id_4a1} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-6 border-r border-slate-200 whitespace-normal">
                        <div className="text-sm text-slate-800 group-hover:text-violet-600 transition-colors leading-relaxed">{item.nama_prasarana}</div>
                      </td>
                      <td className="px-4 py-6 border-r border-slate-200 text-center">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-black">{item.daya_tampung}</span>
                      </td>
                      <td className="px-4 py-6 border-r border-slate-200 text-center">
                        <div className="text-sm text-slate-800">{item.luas_ruang}</div>
                      </td>
                      <td className="px-6 py-6 border-r border-slate-200 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[0.65rem] uppercase tracking-widest border ${item.status_milik === 'M' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                          {item.status_milik}
                        </span>
                      </td>
                      <td className="px-6 py-6 border-r border-slate-200 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[0.65rem] uppercase tracking-widest border ${item.status_lisensi === 'L' ? 'bg-blue-50 text-blue-600 border-blue-100' : item.status_lisensi === 'P' ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {item.status_lisensi}
                        </span>
                      </td>
                      <td className="px-6 py-6 border-r border-slate-200 text-[0.75rem] text-slate-600 max-w-xs whitespace-normal leading-relaxed italic">{item.perangkat || '-'}</td>
                      <td className="px-6 py-6 border-r border-slate-200 text-center text-[0.75rem] text-slate-600 whitespace-normal">{item.info_tambahan || '-'}</td>
                      <td className="px-6 py-6 border-r border-slate-200 text-center">
                        {item.link_bukti ? (
                          <a href={item.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 transition-all text-[0.65rem] uppercase tracking-wider">
                            <ExternalLink size={12} /> Buka
                          </a>
                        ) : <span className="text-slate-400 text-xs italic">-</span>}
                      </td>
                      <td className="px-6 py-6 align-middle text-center border-r border-slate-200">
                        {showTrash ? (
                           <div className="flex items-center justify-center gap-2">
                             <button onClick={() => handle(item.id_4a1)} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title=""> <RotateCcw size={17} /></button>
                             <button onClick={() => handleHardDelete(item.id_4a1)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title=" "> <Trash2 size={17} /></button>
                           </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handle(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title=""><Edit size={17} /></button>
                            <button onClick={() => handleSoftDelete(item.id_4a1)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition-all duration-300 border border-transparent hover:border-red-100" title="Hapus"><Trash2 size={17} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
