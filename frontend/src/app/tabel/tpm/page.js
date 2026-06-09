'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, ShieldCheck, UserCheck, History, ExternalLink, Activity } from 'lucide-react';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function TPMPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdTahun, setFilterIdTahun] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');
  const [unitList, setUnitList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    jenis_unit: 'PT',
    id_unit: '',
    dokumen_spmi: '',
    auditor_certified: 0,
    auditor_non_certified: 0,
    frekuensi_audit: 1,
    bukti_certified_auditor: '',
    laporan_audit: '',
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
      fetchMasterData();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdTahun) fetchData();
  }, [filterIdTahun]);

  const fetchMasterData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [unitRes, tahunRes] = await Promise.all([
        fetch('http://localhost:5000/api/master/unit-kerja', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const unitResult = await unitRes.json();
      const tahunResult = await tahunRes.json();
      if (unitResult.success) setUnitList(unitResult.data);
      if (tahunResult.success) {
        const sortedTahun = (tahunResult.data || []).sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
        setTahunList(sortedTahun);
        const savedTahun = localStorage.getItem('tpm_filterTahun');
        if (savedTahun && sortedTahun.some(t => t.id_tahun.toString() === savedTahun)) {
          setFilterIdTahun(savedTahun);
        } else {
          const activeTahun = sortedTahun.find(t => t.is_active === 1);
          if (activeTahun) {
            setFilterIdTahun(activeTahun.id_tahun.toString());
            localStorage.setItem('tpm_filterTahun', activeTahun.id_tahun.toString());
          }
        }
      }
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchData = async () => {
    if (!filterIdTahun) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const url = `http://localhost:5000/api/tpm/1b-spmi?id_tahun=${filterIdTahun}`;
      const [activeRes, trashRes] = await Promise.all([
        fetch(url, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${url}/trash`, { headers: { 'Authorization': `Bearer ${token}` } }),
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
      ? `http://localhost:5000/api/tpm/1b-spmi/${editingId}`
      : 'http://localhost:5000/api/tpm/1b-spmi';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, id_tahun: filterIdTahun }),
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
    setEditingId(item.id_unit_spmi);
    setFormData({
      jenis_unit: item.jenis_unit || 'PT',
      id_unit: item.id_unit || '',
      dokumen_spmi: item.dokumen_spmi || '',
      auditor_certified: item.auditor_certified || 0,
      auditor_non_certified: item.auditor_non_certified || 0,
      frekuensi_audit: item.frekuensi_audit || 1,
      bukti_certified_auditor: item.bukti_certified_auditor || '',
      laporan_audit: item.laporan_audit || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    const isConfirmed = await showConfirm('Pindahkan ke tempat sampah?');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/tpm/1b-spmi/${id}`, {
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
      showError('Gagal menghapus data');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/tpm/1b-spmi/restore/${id}`, {
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
      showError('Gagal memulihkan data');
    }
  };

  const handleHardDelete = async (id) => {
    const isConfirmed = await showConfirm('HAPUS PERMANEN?');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/tpm/1b-spmi/hard/${id}`, {
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
      showError('Gagal menghapus permanen');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      jenis_unit: 'PT',
      id_unit: '',
      dokumen_spmi: '',
      auditor_certified: 0,
      auditor_non_certified: 0,
      frekuensi_audit: 1,
      bukti_certified_auditor: '',
      laporan_audit: '',
    });
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/tpm/1b-spmi/export?id_tahun=${filterIdTahun}&token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => router.push('/tabel')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Unit SPMI & SDM (1.B)</h1>
              <p className="text-slate-500 mt-1 font-medium">Monitoring sistem penjaminan mutu internal dan sdm auditor (TPM Access)</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data Unit'}</span>
              </Button>
              <Button onClick={handleExport} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Unit SPMI</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Unit</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-indigo-600 shrink-0">
                  <UserCheck size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Auditor</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Auditor</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.reduce((acc, curr) => acc + (curr.jumlah_auditor || 0), 0)}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <div className="w-full sm:w-[280px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Tahun Akademik</label>
              <div className="relative">
                <select 
                  value={filterIdTahun} 
                  onChange={(e) => {
                    setFilterIdTahun(e.target.value);
                    localStorage.setItem('tpm_filterTahun', e.target.value);
                  }} 
                  className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
                >
                  {tahunList.map(t => (
                    <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>
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
          <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 mb-6">{editingId ? 'Edit Data SPMI' : 'Input Data SPMI Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Jenis Unit SPMI</label>
                  <div className="relative">
                    <select value={formData.jenis_unit} onChange={(e) => setFormData({...formData, jenis_unit: e.target.value})} className="w-full px-4 py-3 pr-10 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none text-slate-900" required>
                      <option value="PT">PT</option>
                      <option value="UPPS">UPPS</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Unit Kerja</label>
                  <div className="relative">
                    <select value={formData.id_unit} onChange={(e) => setFormData({...formData, id_unit: e.target.value})} className="w-full px-4 py-3 pr-10 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none text-slate-900" required>
                      <option value="">Pilih Unit Kerja</option>
                      {unitList.map(u => <option key={u.id_unit} value={u.id_unit}>{u.nama_unit}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-slate-600 mb-2">Link Dokumen SPMI</label>
                  <input type="url" value={formData.dokumen_spmi} onChange={(e) => setFormData({...formData, dokumen_spmi: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium text-slate-900" placeholder="https://..." />
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">SDM Auditor</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Certified</label>
                      <input type="number" value={formData.auditor_certified} onChange={(e) => setFormData({...formData, auditor_certified: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition font-bold text-slate-900" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Non-Cert.</label>
                      <input type="number" value={formData.auditor_non_certified} onChange={(e) => setFormData({...formData, auditor_non_certified: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition font-bold text-slate-900" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Frekuensi Audit / Tahun</label>
                  <input type="number" value={formData.frekuensi_audit} onChange={(e) => setFormData({...formData, frekuensi_audit: parseInt(e.target.value) || 1})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Link Bukti Sertifikat</label>
                  <input type="url" value={formData.bukti_certified_auditor} onChange={(e) => setFormData({...formData, bukti_certified_auditor: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium text-slate-900" placeholder="https://..." />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-bold text-slate-600 mb-2">Link Laporan Audit Mutu Internal (AMI)</label>
                  <input type="url" value={formData.laporan_audit} onChange={(e) => setFormData({...formData, laporan_audit: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium text-slate-900" placeholder="https://..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-slate-50/80 text-slate-500 rounded-2xl hover:bg-slate-200 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-violet-700 transition font-black shadow-lg shadow-violet-200/50">{editingId ? 'Update Data' : 'Simpan Data SPMI'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-slate-500 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-xl tracking-tight">Belum ada data unit SPMI</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap border-collapse">
                <thead className="bg-[#1E3A8A]">
                  {showTrash ? (
                    <tr>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Unit Kerja</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Dokumen SPMI</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Aksi</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Unit SPMI</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Nama Unit SPMI</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Dokumen SPMI</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Jumlah Auditor Mutu Internal</th>
                      <th className="px-4 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Certified</th>
                      <th className="px-4 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Non Certified</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Frekuensi audit/monev per tahun</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Bukti Certified Auditor</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center">Laporan Audit</th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-100 uppercase tracking-wider text-center border-r border-white/20">Aksi</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(showTrash ? trashData : activeData).map((row) => (
                    <tr key={row.id_unit_spmi} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      {showTrash ? (
                        <>
                          <td className="px-6 py-6 border-r border-slate-200 text-sm text-slate-900">{row.nama_unit}</td>
                          <td className="px-6 py-6 border-r border-slate-200 text-xs text-slate-500 font-medium truncate max-w-[200px]">
                            {row.dokumen_spmi || '-'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-6 border-r border-slate-200 text-center text-slate-900 text-sm">
                            {row.jenis_unit || '-'}
                          </td>
                          <td className="px-6 py-6 border-r border-slate-200 text-center font-medium text-slate-900 text-sm">
                            {row.nama_unit || '-'}
                          </td>
                          <td className="px-6 py-6 border-r border-slate-200 text-center">
                            {row.dokumen_spmi ? (
                              <a href={row.dokumen_spmi} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-300 font-black text-[10px] uppercase tracking-wider">
                                <ExternalLink size={12} /> Buka
                              </a>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-6 border-r border-slate-200 text-center text-slate-900 text-sm">
                            {row.jumlah_auditor || 0}
                          </td>
                          <td className="px-4 py-6 border-r border-slate-200 text-center text-slate-600 text-sm">
                            {row.auditor_certified || 0}
                          </td>
                          <td className="px-4 py-6 border-r border-slate-200 text-center text-slate-600 text-sm">
                            {row.auditor_non_certified || 0}
                          </td>
                          <td className="px-6 py-6 border-r border-slate-200 text-center text-slate-600 text-sm font-bold">
                            {row.frekuensi_audit || 0}x
                          </td>
                          <td className="px-6 py-6 border-r border-slate-200 text-center">
                            {row.bukti_certified_auditor ? (
                              <a href={row.bukti_certified_auditor} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                                <ExternalLink size={12} /> Buka
                              </a>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-6 border-r border-slate-200 text-center">
                            {row.laporan_audit ? (
                              <a href={row.laporan_audit} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-300 font-black text-[10px] uppercase tracking-wider">
                                <ExternalLink size={12} /> Buka
                              </a>
                            ) : '-'}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-6 border-r border-slate-200">
                        <div className="flex justify-center">
                          <div className={`inline-flex items-center bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:shadow-md ${showTrash ? 'group-hover:border-orange-800' : 'group-hover:border-blue-800'}`}>
                            {showTrash ? (
                              <>
                                <button onClick={() => handleRestore(row.id_unit_spmi)} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title="Restore"><RotateCcw size={17} /></button>
                                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                <button onClick={() => handleHardDelete(row.id_unit_spmi)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus Permanen"><Trash size={17} /></button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEdit(row)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={17} /></button>
                                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                <button onClick={() => handleSoftDelete(row.id_unit_spmi)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={17} /></button>
                              </>
                            )}
                          </div>
                        </div>
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
