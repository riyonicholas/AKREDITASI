'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Users, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AlumniPage() {
  const router = useRouter();
  
  // Data States
  const [data2b4, setData2b4] = useState([]);
  const [data2b5, setData2b5] = useState([]);
  const [trash2b4, setTrash2b4] = useState([]);
  const [trash2b5, setTrash2b5] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('main'); // 'main' or 'trash'
  
  // Filter States
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  // Form State
  const [editingId2b4, setEditingId2b4] = useState(null);
  const [editingId2b5, setEditingId2b5] = useState(null);
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    jumlah_lulusan: '',
    jumlah_terlacak: '',
    rata_tunggu: '',
    profesi_infokom: '',
    profesi_non_infokom: '',
    lingkup_multinasional: '',
    lingkup_nasional: '',
    lingkup_wirausaha: ''
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
      const savedProdi = localStorage.getItem('alumni_filterProdi');
      if (savedProdi && prodiList.some(p => p.id_prodi.toString() === savedProdi)) {
        setFilterProdi(savedProdi);
      } else {
        const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika')) || prodiList[0];
        if (tiProdi) {
          setFilterProdi(tiProdi.id_prodi.toString());
          localStorage.setItem('alumni_filterProdi', tiProdi.id_prodi.toString());
        }
      }
    }
  }, [prodiList, filterProdi]);

  useEffect(() => {
    if (tahunList.length > 0 && !filterTahun) {
      const savedTahun = localStorage.getItem('alumni_filterTahun');
      if (savedTahun && tahunList.some(t => t.id_tahun.toString() === savedTahun)) {
        setFilterTahun(savedTahun);
      } else {
        const currentYear = new Date().getFullYear();
        let targetTahun = tahunList.find(t => parseInt(t.tahun) === currentYear);
        if (!targetTahun) targetTahun = tahunList[0];
        if (targetTahun) {
          setFilterTahun(targetTahun.id_tahun.toString());
          localStorage.setItem('alumni_filterTahun', targetTahun.id_tahun.toString());
        }
      }
    }
  }, [tahunList, filterTahun]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      if (viewMode === 'main') fetchData();
      else fetchTrashData();
    }
  }, [filterProdi, filterTahun, viewMode]);

  const API_BASE = 'http://localhost:5000/api/kemahasiswaan';

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [res4, res5] = await Promise.all([
        fetch(`${API_BASE}/2b4-masa-tunggu?id_prodi=${filterProdi}&id_tahun=${filterTahun}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/2b5-kesesuaian-kerja?id_prodi=${filterProdi}&id_tahun=${filterTahun}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const r4 = await res4.json();
      const r5 = await res5.json();
      if (r4.success) setData2b4(r4.data || []);
      if (r5.success) setData2b5(r5.data || []);
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
      const [res4, res5] = await Promise.all([
        fetch(`${API_BASE}/2b4-masa-tunggu/trash?id_prodi=${filterProdi}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/2b5-kesesuaian-kerja/trash?id_prodi=${filterProdi}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const r4 = await res4.json();
      const r5 = await res5.json();
      if (r4.success) setTrash2b4(r4.data || []);
      if (r5.success) setTrash2b5(r5.data || []);
    } catch (err) {
      console.error('Error fetching trash data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setProdiList(result.data);
    } catch (err) { console.error('Error fetching prodi:', err); }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setTahunList(result.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun)));
    } catch (err) { console.error('Error fetching tahun:', err); }
  };

  // Validation Logic
  const getNum = (val) => parseInt(val) || 0;
  const targetTerlacak = getNum(formData.jumlah_terlacak);
  const sumProfesi = getNum(formData.profesi_infokom) + getNum(formData.profesi_non_infokom);
  const sumLingkup = getNum(formData.lingkup_multinasional) + getNum(formData.lingkup_nasional) + getNum(formData.lingkup_wirausaha);
  const isBalanced = targetTerlacak > 0 && sumProfesi === targetTerlacak && sumLingkup === targetTerlacak;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isBalanced) return alert("Data belum balance! Pastikan jumlah profesi dan lingkup sama dengan target terlacak.");
    
    const token = localStorage.getItem('token');
    
    const payload2b4 = {
      id_prodi: formData.id_prodi,
      id_tahun: formData.id_tahun,
      jumlah_lulusan: formData.jumlah_lulusan,
      jumlah_terlacak: formData.jumlah_terlacak,
      rata_tunggu: formData.rata_tunggu
    };

    try {
      const res4 = await fetch(editingId2b4 ? `${API_BASE}/2b4-masa-tunggu/${editingId2b4}` : `${API_BASE}/2b4-masa-tunggu`, {
        method: editingId2b4 ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload2b4)
      });
      const result4 = await res4.json();
      
      if (result4.success) {
        const payload2b5 = {
          id_2b4: editingId2b4 || result4.id_2b4,
          profesi_infokom: formData.profesi_infokom,
          profesi_non_infokom: formData.profesi_non_infokom,
          lingkup_multinasional: formData.lingkup_multinasional,
          lingkup_nasional: formData.lingkup_nasional,
          lingkup_wirausaha: formData.lingkup_wirausaha
        };
        
        const res5 = await fetch(editingId2b5 ? `${API_BASE}/2b5-kesesuaian-kerja/${editingId2b5}` : `${API_BASE}/2b5-kesesuaian-kerja`, {
          method: editingId2b5 ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload2b5)
        });
        const result5 = await res5.json();
        
        if (result5.success) {
          alert('Data 2.B.4 & 2.B.5 berhasil disimpan!');
          fetchData();
          resetForm();
        } else {
          alert('Gagal menyimpan 2.B.5: ' + result5.message);
        }
      } else {
        alert('Gagal menyimpan 2.B.4: ' + result4.message);
      }
    } catch (err) {
      console.error('Error saving:', err);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleEdit = async (item2b4) => {
    // Find matching 2b5 data
    const token = localStorage.getItem('token');
    let d5 = null;
    try {
      const r5 = await fetch(`${API_BASE}/2b5-kesesuaian-kerja?id_prodi=${item2b4.id_prodi || filterProdi}&id_tahun=${item2b4.id_tahun || filterTahun}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json());
      d5 = (r5.data || []).find(x => x.id_2b4 === item2b4.id_2b4);
    } catch (e) {}

    setFormData({
      id_prodi: item2b4.id_prodi || filterProdi || '',
      id_tahun: item2b4.id_tahun || filterTahun || '',
      jumlah_lulusan: item2b4.jumlah_lulusan || '',
      jumlah_terlacak: item2b4.jumlah_terlacak || '',
      rata_tunggu: item2b4.rata_tunggu || '',
      profesi_infokom: d5?.profesi_infokom || '',
      profesi_non_infokom: d5?.profesi_non_infokom || '',
      lingkup_multinasional: d5?.lingkup_multinasional || '',
      lingkup_nasional: d5?.lingkup_nasional || '',
      lingkup_wirausaha: d5?.lingkup_wirausaha || '',
    });
    setEditingId2b4(item2b4.id_2b4);
    setEditingId2b5(d5?.id_2b5 || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSoftDelete = async (path, id) => {
    if (!confirm('Pindahkan ke keranjang sampah?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/${path}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchData();
  };

  const handleRestore = async (path, id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/${path}/restore/${id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    fetchTrashData();
    fetchData();
  };

  const handleHardDelete = async (path, id) => {
    if (!confirm('HAPUS PERMANEN? Data tidak bisa dikembalikan.')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/${path}/hard/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchTrashData();
  };

  const handleExport = (type) => {
    const token = localStorage.getItem('token');
    const path = type === '2b4' ? '2b4-masa-tunggu' : '2b5-kesesuaian-kerja';
    window.open(`${API_BASE}/${path}/export?id_prodi=${filterProdi}&id_tahun=${filterTahun}&token=${token}`, '_blank');
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '', id_tahun: filterTahun || '',
      jumlah_lulusan: '', jumlah_terlacak: '', rata_tunggu: '',
      profesi_infokom: '', profesi_non_infokom: '',
      lingkup_multinasional: '', lingkup_nasional: '', lingkup_wirausaha: ''
    });
    setEditingId2b4(null); setEditingId2b5(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="w-full p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Alumni Terpadu (2.B.4 & 2.B.5)</h1>
              <p className="text-slate-500 mt-1 font-medium">Pengelolaan data tracer study, masa tunggu, dan kesesuaian kerja lulusan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Input Satu Pintu'}</span>
              </Button>
              <button onClick={() => handleExport('2b4')} className="flex items-center gap-2 bg-amber-500 text-slate-900 px-5 py-2.5 rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-950/50 font-bold text-sm">
                <Download size={18} /><span>Export 2.B.4</span>
              </button>
              <button onClick={() => handleExport('2b5')} className="flex items-center gap-2 bg-amber-500 text-slate-900 px-5 py-2.5 rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-950/50 font-bold text-sm">
                <Download size={18} /><span>Export 2.B.5</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 mb-8 items-end w-full">
          <div className="w-full sm:w-[280px]">
            <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Program Studi</label>
            <div className="relative">
              <select 
                value={filterProdi} 
                onChange={(e) => {
                  setFilterProdi(e.target.value);
                  localStorage.setItem('alumni_filterProdi', e.target.value);
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
            <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Tahun Akademik</label>
            <div className="relative">
              <select 
                value={filterTahun} 
                onChange={(e) => {
                  setFilterTahun(e.target.value);
                  localStorage.setItem('alumni_filterTahun', e.target.value);
                }} 
                className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
              >
                <option value="">Semua Tahun</option>
                {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <Button onClick={viewMode === 'main' ? fetchData : fetchTrashData} variant="outline" className="h-[44px] px-4 shrink-0" title="Refresh Data">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button onClick={() => setViewMode('main')} className={`px-6 py-3 font-bold text-sm uppercase ${viewMode === 'main' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Dashboard</button>
          <button onClick={() => setViewMode('trash')} className={`px-6 py-3 font-bold text-sm uppercase flex items-center gap-2 ${viewMode === 'trash' ? 'border-b-4 border-red-600 text-red-600' : 'text-slate-500'}`}>
            Trash <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-black">{trash2b4.length + trash2b5.length}</span>
          </button>
        </div>

        {/* Main Dashboard */}
        {viewMode === 'main' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Form */}
            {showForm && (
              <div className="bg-white rounded-2xl p-8 border-2 border-blue-500/20 shadow-sm shadow-blue-900/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h2 className="text-xl font-black text-slate-900 mb-2">{editingId2b4 ? 'Edit Data Terpadu' : 'Formulir Pengisian Satu Pintu'}</h2>
                {!isBalanced ? (
                  <div className="bg-slate-100/80 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-bold text-amber-300">Perhatian: Data Belum Balance</p>
                      <p className="text-xs text-amber-400 mt-1">Pastikan total <b>Profesi ({sumProfesi})</b> dan total <b>Lingkup Kerja ({sumLingkup})</b> bernilai tepat sama dengan <b>Jumlah Terlacak ({targetTerlacak})</b>.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl mb-6 flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 mt-0.5" size={20} />
                    <p className="text-sm font-bold text-emerald-300">Validasi Sukses: Data sudah balance dan siap disimpan.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Bagian A */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase text-blue-600 tracking-wider flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-blue-50/80 flex items-center justify-center">A</span>
                        Data Populasi & Waktu Tunggu (2.B.4)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Tahun Akademik</label>
                          <select value={formData.id_tahun} onChange={e => setFormData({...formData, id_tahun: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" required>
                            <option value="">Pilih Tahun</option>
                            {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Program Studi</label>
                          <select value={formData.id_prodi} onChange={e => setFormData({...formData, id_prodi: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" required>
                            <option value="">Pilih Prodi</option>
                            {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Total Lulusan</label>
                        <input type="number" value={formData.jumlah_lulusan} onChange={e => setFormData({...formData, jumlah_lulusan: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl font-bold" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">
                          <span>Jumlah Terlacak (Target)</span>
                          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{targetTerlacak}</span>
                        </label>
                        <input type="number" value={formData.jumlah_terlacak} onChange={e => setFormData({...formData, jumlah_terlacak: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl font-bold ring-2 ring-blue-500/20" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Rata-rata Waktu Tunggu (Bulan)</label>
                        <input type="number" step="0.1" value={formData.rata_tunggu} onChange={e => setFormData({...formData, rata_tunggu: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl font-bold" required />
                      </div>
                    </div>

                    {/* Bagian B */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-black uppercase text-purple-600 tracking-wider flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-purple-900/30 flex items-center justify-center">B</span>
                        Kesesuaian & Lingkup Kerja (2.B.5)
                      </h3>
                      
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-xs font-black text-slate-600">PROFESI KERJA</label>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-full ${sumProfesi === targetTerlacak ? 'bg-emerald-900/30 text-emerald-600' : 'bg-red-100 text-red-400'}`}>{sumProfesi} / {targetTerlacak}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Infokom</label>
                            <input type="number" value={formData.profesi_infokom} onChange={e => setFormData({...formData, profesi_infokom: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold" required />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Non-Infokom</label>
                            <input type="number" value={formData.profesi_non_infokom} onChange={e => setFormData({...formData, profesi_non_infokom: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold" required />
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-xs font-black text-slate-600">LINGKUP KERJA</label>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-full ${sumLingkup === targetTerlacak ? 'bg-emerald-900/30 text-emerald-600' : 'bg-red-100 text-red-400'}`}>{sumLingkup} / {targetTerlacak}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 truncate">Multinasional</label>
                            <input type="number" value={formData.lingkup_multinasional} onChange={e => setFormData({...formData, lingkup_multinasional: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold" required />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 truncate">Nasional</label>
                            <input type="number" value={formData.lingkup_nasional} onChange={e => setFormData({...formData, lingkup_nasional: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold" required />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 truncate">Wirausaha</label>
                            <input type="number" value={formData.lingkup_wirausaha} onChange={e => setFormData({...formData, lingkup_wirausaha: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-bold" required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button type="submit" disabled={!isBalanced} className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition ${isBalanced ? 'bg-blue-600 text-slate-900 shadow-sm shadow-violet-200/50 hover:bg-violet-700' : 'bg-gray-700 text-slate-500 cursor-not-allowed'}`}>
                      {isBalanced ? 'Simpan Data Balance' : 'Simpan Data (Belum Balance)'}
                    </button>
                    <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Tabel 2.B.4 */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-950/40 border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-black text-slate-800">Tabel 2.B.4 Masa Tunggu Lulusan</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-left">
                  <thead className="bg-[#1E3A8A]">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Tahun Lulus</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Jumlah Lulusan</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Jumlah Terlacak</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Masa Tunggu (Bln)</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data2b4.map(item => (
                      <tr key={item.id_2b4} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition text-slate-700">
                        <td className="px-6 py-4 font-black text-slate-900 border-r border-slate-200">{item.nama_tahun || item.tahun}</td>
                        <td className="px-6 py-4 font-bold text-slate-500 border-r border-slate-200">{item.jumlah_lulusan}</td>
                        <td className="px-6 py-4 font-bold text-slate-500 border-r border-slate-200">{item.jumlah_terlacak}</td>
                        <td className="px-6 py-4 font-bold text-blue-600 border-r border-slate-200">{item.rata_tunggu}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 bg-slate-100/80 text-amber-600 rounded-xl hover:bg-slate-200/30 transition"><Edit size={16} /></button>
                          <button onClick={() => handleSoftDelete('2b4-masa-tunggu', item.id_2b4)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabel 2.B.5 */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-950/40 border border-slate-200 overflow-hidden mt-8">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-black text-slate-800">Tabel 2.B.5 Kesesuaian & Lingkup Kerja</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-left">
                  <thead className="bg-[#1E3A8A]">
                    <tr>
                      <th rowSpan="2" className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Tahun Lulus</th>
                      <th rowSpan="2" className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Lulusan</th>
                      <th rowSpan="2" className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Terlacak</th>
                      <th colSpan="2" className="px-6 py-3 text-[11px] font-bold text-slate-100 bg-[#1E3A8A]/90 uppercase tracking-wider border-r border-white/20 text-center">Profesi Kerja</th>
                      <th colSpan="3" className="px-6 py-3 text-[11px] font-bold text-slate-100 bg-[#1E3A8A]/80 uppercase tracking-wider border-r border-white/20 text-center">Lingkup Kerja</th>
                      <th rowSpan="2" className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider">Aksi</th>
                    </tr>
                    <tr>
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-100 uppercase bg-[#1E3A8A]/90 border-r border-white/20">Infokom</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-100 uppercase bg-[#1E3A8A]/90 border-r border-white/20">Non</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-100 uppercase bg-[#1E3A8A]/80 border-r border-white/20">Multi</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-100 uppercase bg-[#1E3A8A]/80 border-r border-white/20">Nasional</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-100 uppercase bg-[#1E3A8A]/80 border-r border-white/20">Wira</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data2b5.map(item => (
                      <tr key={item.id_2b5} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition text-slate-700">
                        <td className="px-6 py-4 font-black text-slate-900 border-r border-slate-200">{item.nama_tahun || item.tahun}</td>
                        <td className="px-6 py-4 font-bold text-slate-500 border-r border-slate-200">{item.jumlah_lulusan}</td>
                        <td className="px-6 py-4 font-bold text-slate-500 border-r border-slate-200">{item.jumlah_terlacak}</td>
                        <td className="px-4 py-4 font-bold text-slate-600 bg-transparent border-r border-slate-200 text-center">{item.profesi_infokom}</td>
                        <td className="px-4 py-4 font-bold text-slate-600 bg-transparent border-r border-slate-200 text-center">{item.profesi_non_infokom}</td>
                        <td className="px-4 py-4 font-bold text-slate-600 bg-transparent border-r border-slate-200 text-center">{item.lingkup_multinasional}</td>
                        <td className="px-4 py-4 font-bold text-slate-600 bg-transparent border-r border-slate-200 text-center">{item.lingkup_nasional}</td>
                        <td className="px-4 py-4 font-bold text-slate-600 bg-transparent border-r border-slate-200 text-center">{item.lingkup_wirausaha}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button onClick={() => handleSoftDelete('2b5-kesesuaian-kerja', item.id_2b5)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Trash View */}
        {viewMode === 'trash' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center"><Trash2 size={24} /></div>
              <div>
                <h3 className="text-xl font-black text-red-400">Keranjang Sampah</h3>
                <p className="text-sm font-medium text-red-500 mt-1">Data 2.B.4 dan 2.B.5 yang dihapus sementara</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-red-100/50 border border-red-200">
                <div className="p-5 border-b border-slate-200 bg-slate-50"><h4 className="font-black text-slate-800">Sampah 2.B.4 Masa Tunggu</h4></div>
                <table className="w-full min-w-full text-left">
                  <thead className="bg-[#1E3A8A] text-[11px] text-slate-100 uppercase font-bold">
                    <tr><th className="p-4">Tahun Akademik</th><th className="p-4 text-center">Aksi</th></tr>
                  </thead>
                  <tbody>
                    {trash2b4.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-sm font-bold text-slate-500">Kosong</td></tr>}
                    {trash2b4.map(t => (
                      <tr key={t.id_2b4} className="border-t border-slate-200">
                        <td className="p-4 font-black">{t.nama_tahun || t.tahun}</td>
                        <td className="p-4 flex justify-center gap-2">
                          <button onClick={() => handleRestore('2b4-masa-tunggu', t.id_2b4)} className="px-3 py-1.5 bg-blue-600 text-slate-900 rounded-lg text-[10px] font-bold hover:bg-violet-700 uppercase">Restore</button>
                          <button onClick={() => handleHardDelete('2b4-masa-tunggu', t.id_2b4)} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[10px] font-bold hover:bg-red-600 hover:text-slate-900 uppercase">Permanen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-red-100/50 border border-red-200">
                <div className="p-5 border-b border-slate-200 bg-slate-50"><h4 className="font-black text-slate-800">Sampah 2.B.5 Kesesuaian Kerja</h4></div>
                <table className="w-full min-w-full text-left">
                  <thead className="bg-[#1E3A8A] text-[11px] text-slate-100 uppercase font-bold">
                    <tr><th className="p-4">Tahun Akademik</th><th className="p-4 text-center">Aksi</th></tr>
                  </thead>
                  <tbody>
                    {trash2b5.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-sm font-bold text-slate-500">Kosong</td></tr>}
                    {trash2b5.map(t => (
                      <tr key={t.id_2b5} className="border-t border-slate-200">
                        <td className="p-4 font-black">{t.nama_tahun || t.tahun}</td>
                        <td className="p-4 flex justify-center gap-2">
                          <button onClick={() => handleRestore('2b5-kesesuaian-kerja', t.id_2b5)} className="px-3 py-1.5 bg-blue-600 text-slate-900 rounded-lg text-[10px] font-bold hover:bg-violet-700 uppercase">Restore</button>
                          <button onClick={() => handleHardDelete('2b5-kesesuaian-kerja', t.id_2b5)} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[10px] font-bold hover:bg-red-600 hover:text-slate-900 uppercase">Permanen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
