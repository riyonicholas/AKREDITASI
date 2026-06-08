'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, History, RotateCcw, Monitor, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function BebanPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isTrashMode, setIsTrashMode] = useState(false);

  const [filterIdTahun, setFilterIdTahun] = useState('');
  const [filterIdProdi, setFilterIdProdi] = useState('');

  const [tahunList, setTahunList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [dosenList, setDosenList] = useState([]);

  const [formData, setFormData] = useState({
    id_dosen: '',
    id_tahun: '',
    sks_ps_sendiri: '',
    sks_ps_lain: '',
    sks_pt_lain: '',
    sks_penelitian: '',
    sks_pkm: '',
    sks_manajemen_pt_lain: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchMasterData();
    }
  }, [router]);

  const fetchMasterData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [tahunRes, prodiRes, dosenRes] = await Promise.all([
        fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/dosen', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const [tahunData, prodiData, dosenData] = await Promise.all([
        tahunRes.json(),
        prodiRes.json(),
        dosenRes.json()
      ]);

      if (tahunData.success) {
        const sortedTahun = tahunData.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
        setTahunList(sortedTahun);

        const savedTahun = localStorage.getItem('beban_filterTahun');
        if (savedTahun && sortedTahun.some(t => t.id_tahun.toString() === savedTahun)) {
          setFilterIdTahun(savedTahun);
        } else {
          const activeTahun = sortedTahun.find(t => t.is_active === 1);
          if (activeTahun) {
            setFilterIdTahun(activeTahun.id_tahun.toString());
            localStorage.setItem('beban_filterTahun', activeTahun.id_tahun.toString());
          }
        }
      }
      if (prodiData.success) {
        setProdiList(prodiData.data);

        const savedProdi = localStorage.getItem('beban_filterProdi');
        if (savedProdi && prodiData.data.some(p => p.id_prodi.toString() === savedProdi)) {
          setFilterIdProdi(savedProdi);
        } else {
          const defaultProdi = prodiData.data.find(p => p.nama_prodi.includes('Teknik Informatika'));
          if (defaultProdi) {
            setFilterIdProdi(defaultProdi.id_prodi.toString());
            localStorage.setItem('beban_filterProdi', defaultProdi.id_prodi.toString());
          }
        }
      }
      if (dosenData.success) setDosenList(dosenData.data);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  useEffect(() => {
    if (filterIdTahun) fetchData();
  }, [filterIdTahun, filterIdProdi]);

  const fetchData = async () => {
    if (!filterIdTahun) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseParams = `id_tahun=${filterIdTahun}${filterIdProdi ? `&id_prodi=${filterIdProdi}` : ''}`;
      const activeUrl = `http://localhost:5000/api/upps/1a4-beban?${baseParams}`;
      const trashUrl = `http://localhost:5000/api/upps/1a4-beban/trash?${baseParams}`;

      const [activeRes, trashRes] = await Promise.all([
        fetch(activeUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(trashUrl, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();

      if (activeResult.success) {
        setActiveData(activeResult.data || []);
        setSummary(activeResult.summary || null);
      }
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
      ? `http://localhost:5000/api/upps/1a4-beban/${editingId}`
      : 'http://localhost:5000/api/upps/1a4-beban';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          id_tahun: filterIdTahun
        }),
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal menyimpan data');
      } else {
        showSuccess(result.message);
      }
      fetchData();
      resetForm();
    } catch (err) {
      showError('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_beban_kerja);
    const dosenMatch = dosenList.find(d => d.nama_lengkap === item.nama_dtpr);
    setFormData({
      id_dosen: String(dosenMatch?.id_dosen || ''),
      id_tahun: String(filterIdTahun),
      sks_ps_sendiri: String(item.sks_ps_sendiri || 0),
      sks_ps_lain: String(item.sks_ps_lain || 0),
      sks_pt_lain: String(item.sks_pt_lain || 0),
      sks_penelitian: String(item.sks_penelitian || 0),
      sks_pkm: String(item.sks_pkm || 0),
      sks_manajemen_pt_lain: String(item.sks_manajemen_pt_lain || 0),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Yakin hapus data ini? Data akan dipindahkan ke Sampah.');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a4-beban/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal menghapus data');
      } else {
        showSuccess(result.message);
      }
      fetchData();
    } catch (err) {
      showError('Terjadi kesalahan koneksi');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a4-beban/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal memulihkan data');
      } else {
        showSuccess(result.message);
      }
      fetchData();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const handleHardDelete = async (id) => {
    const isConfirmed = await showConfirm('Hapus permanen? Data tidak dapat dikembalikan.');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a4-beban/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal menghapus permanen');
      } else {
        showSuccess(result.message);
      }
      fetchData();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      id_dosen: '',
      id_tahun: '',
      sks_ps_sendiri: '',
      sks_ps_lain: '',
      sks_pt_lain: '',
      sks_penelitian: '',
      sks_pkm: '',
      sks_manajemen_pt_lain: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/upps/1a4-beban/export?id_tahun=${filterIdTahun}&token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Beban DTPR (1.A.4)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Monitoring beban kerja dosen tetap program studi (EWMP)</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Beban'}</span>
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
                  <Monitor size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Beban (Active)</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Total</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-indigo-600 shrink-0">
                  <TrendingUp size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Rata-rata SKS</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Rata</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{summary ? parseFloat(summary.avg_total).toFixed(1) : '0'}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <div className="w-full sm:w-[280px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Prodi</label>
              <div className="relative">
                <select value={filterIdProdi} onChange={(e) => {
                  setFilterIdProdi(e.target.value);
                  localStorage.setItem('beban_filterProdi', e.target.value);
                }} className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300">
                  <option value="">Semua Prodi</option>
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
                <select value={filterIdTahun} onChange={(e) => {
                  setFilterIdTahun(e.target.value);
                  localStorage.setItem('beban_filterTahun', e.target.value);
                }} className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300">
                  <option value="">Pilih Tahun</option>
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
            <Button onClick={() => setIsTrashMode(!isTrashMode)} variant={isTrashMode ? 'primary' : 'outline'} className="h-[44px] shrink-0">
              {isTrashMode ? 'Lihat Aktif' : 'Lihat Sampah'}
            </Button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Beban Kerja' : 'Input Beban Kerja Baru'} icon={<Plus className="text-violet-500" size={20} />} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="md:col-span-2 lg:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Pilih DTPR (Dosen)</label>
                    <select value={formData.id_dosen} onChange={(e) => setFormData({ ...formData, id_dosen: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer" required>
                      <option value="">Pilih Dosen</option>
                      {dosenList.map(d => <option key={d.id_dosen} value={d.id_dosen}>{d.nama_lengkap}</option>)}
                    </select>
                  </div>
                  <div>
                    <Input type="number" step="0.01" label="SKS PS Sendiri" value={formData.sks_ps_sendiri} onChange={(e) => setFormData({ ...formData, sks_ps_sendiri: e.target.value })} placeholder="0.00" />
                  </div>
                  <div>
                    <Input type="number" step="0.01" label="SKS PS Lain" value={formData.sks_ps_lain} onChange={(e) => setFormData({ ...formData, sks_ps_lain: e.target.value })} placeholder="0.00" />
                  </div>
                  <div>
                    <Input type="number" step="0.01" label="SKS PT Lain" value={formData.sks_pt_lain} onChange={(e) => setFormData({ ...formData, sks_pt_lain: e.target.value })} placeholder="0.00" />
                  </div>
                  <div>
                    <Input type="number" step="0.01" label="SKS Penelitian" value={formData.sks_penelitian} onChange={(e) => setFormData({ ...formData, sks_penelitian: e.target.value })} placeholder="0.00" />
                  </div>
                  <div>
                    <Input type="number" step="0.01" label="SKS PkM" value={formData.sks_pkm} onChange={(e) => setFormData({ ...formData, sks_pkm: e.target.value })} placeholder="0.00" />
                  </div>
                  <div>
                    <Input type="number" step="0.01" label="SKS Manajemen PT Lain" value={formData.sks_manajemen_pt_lain} onChange={(e) => setFormData({ ...formData, sks_manajemen_pt_lain: e.target.value })} placeholder="0.00" />
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
              <p className="text-sm tracking-tight">Menyinkronkan database...</p>
            </div>
          ) : (isTrashMode ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data beban kerja</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th rowSpan="2" className="px-4 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center align-middle">No</th>
                    <th rowSpan="2" className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 align-middle">Nama DTPR</th>
                    <th colSpan="3" className="px-4 py-3 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 border-b border-white/20 text-center">SKS Pengajaran</th>
                    <th rowSpan="2" className="px-4 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center align-middle">Riset</th>
                    <th rowSpan="2" className="px-4 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center align-middle">PkM</th>
                    <th colSpan="2" className="px-4 py-3 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 border-b border-white/20 text-center">SKS Manajemen</th>
                    <th rowSpan="2" className="px-4 py-4 text-xs font-bold text-yellow-300 uppercase tracking-wider border-r border-white/20 text-center align-middle">Total</th>
                    <th rowSpan="2" className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider text-center align-middle">Aksi</th>
                  </tr>
                  <tr className="bg-[#162d6e]">
                    <th className="px-3 py-2 text-[0.65rem] font-bold text-slate-300 uppercase tracking-wider border-r border-white/20 text-center">PS Sendiri</th>
                    <th className="px-3 py-2 text-[0.65rem] font-bold text-slate-300 uppercase tracking-wider border-r border-white/20 text-center">PS Lain</th>
                    <th className="px-3 py-2 text-[0.65rem] font-bold text-slate-300 uppercase tracking-wider border-r border-white/20 text-center">PT Lain</th>
                    <th className="px-3 py-2 text-[0.65rem] font-bold text-slate-300 uppercase tracking-wider border-r border-white/20 text-center">PT Sendiri</th>
                    <th className="px-3 py-2 text-[0.65rem] font-bold text-slate-300 uppercase tracking-wider border-r border-white/20 text-center">PT Lain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(isTrashMode ? trashData : activeData).map((item, index) => (
                    <tr key={item.id_beban_kerja} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-4 py-4 border-r border-slate-100 text-center text-xs text-slate-400">{index + 1}</td>
                      <td className="px-6 py-4 border-r border-slate-100">
                        <div className="text-sm text-slate-800">{item.nama_dtpr}</div>
                        <div className="text-xs text-slate-500 uppercase mt-0.5">{item.nama_prodi}</div>
                      </td>
                      <td className="px-4 py-4 border-r border-slate-100 text-center text-sm text-slate-600">{item.sks_ps_sendiri || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-center text-sm text-slate-600">{item.sks_ps_lain || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-center text-sm text-slate-600">{item.sks_pt_lain || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-center text-sm text-emerald-600">{item.sks_penelitian || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-center text-sm text-purple-600">{item.sks_pkm || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-center text-sm text-indigo-600">{item.sks_manajemen_pt_sendiri || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-center text-sm text-slate-600">{item.sks_manajemen_pt_lain || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-100 text-center bg-blue-50/50">
                        <div className="text-sm text-blue-600">{parseFloat(item.total_sks).toFixed(1)}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          {isTrashMode ? (
                            <>
                              <button onClick={() => handleRestore(item.id_beban_kerja)} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title="Restore"><RotateCcw size={17} /></button>
                              <button onClick={() => handleHardDelete(item.id_beban_kerja)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus Permanen"><Trash2 size={17} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={17} /></button>
                              <button onClick={() => handleDelete(item.id_beban_kerja)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={17} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {summary && !isTrashMode && (
                  <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                    <tr className="text-slate-800">
                      <td colSpan="2" className="px-6 py-4 text-right text-[0.65rem] uppercase tracking-wider font-bold text-slate-500">Total Keseluruhan (Sum)</td>
                      <td className="px-4 py-4 text-center text-[0.8rem]">{parseFloat(summary.sum_ps_sendiri || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-[0.8rem]">{parseFloat(summary.sum_ps_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-[0.8rem]">{parseFloat(summary.sum_pt_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-[0.8rem] text-emerald-600">{parseFloat(summary.sum_penelitian || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-[0.8rem] text-purple-600">{parseFloat(summary.sum_pkm || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-[0.8rem] text-indigo-600">{parseFloat(summary.sum_manajemen_sendiri || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center text-[0.8rem]">{parseFloat(summary.sum_manajemen_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 text-center bg-blue-50 text-blue-600 font-bold text-[0.8rem]">{parseFloat(summary.sum_total || 0).toFixed(1)}</td>
                      <td></td>
                    </tr>
                    <tr className="text-slate-500 bg-slate-100/50 border-t border-slate-200">
                      <td colSpan="2" className="px-6 py-3 text-right text-[0.6rem] uppercase tracking-wider font-bold">Rata-rata (Avg)</td>
                      <td className="px-4 py-3 text-center text-[0.75rem]">{parseFloat(summary.avg_ps_sendiri || 0).toFixed(1)}</td>
                      <td className="px-4 py-3 text-center text-[0.75rem]">{parseFloat(summary.avg_ps_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-3 text-center text-[0.75rem]">{parseFloat(summary.avg_pt_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-3 text-center text-[0.75rem] text-emerald-500">{parseFloat(summary.avg_penelitian || 0).toFixed(1)}</td>
                      <td className="px-4 py-3 text-center text-[0.75rem] text-purple-500">{parseFloat(summary.avg_pkm || 0).toFixed(1)}</td>
                      <td className="px-4 py-3 text-center text-[0.75rem] text-indigo-500">{parseFloat(summary.avg_manajemen_sendiri || 0).toFixed(1)}</td>
                      <td className="px-4 py-3 text-center text-[0.75rem]">{parseFloat(summary.avg_manajemen_lain || 0).toFixed(1)}</td>
                      <td className="px-4 py-3 text-center bg-blue-50 text-blue-500 font-bold text-[0.75rem]">{parseFloat(summary.avg_total || 0).toFixed(1)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
