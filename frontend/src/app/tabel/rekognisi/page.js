'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft, Download, Plus, Filter, Users, Award,
  RefreshCw, Trash2, Link as LinkIcon, Edit
} from 'lucide-react';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function RekognisiPage() {
  const router = useRouter();

  // Data States
  const [data, setData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [refSources, setRefSources] = useState([]);
  const [graduatesMeta, setGraduatesMeta] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);

  // Filter States
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('main'); // 'main' | 'trash'

  // Form State
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    id_ref_sumber: '',
    nama_sumber_baru: '',
    jenis_rekognisi: '',
    link_bukti: ''
  });

  // Fetch initial lookups
  useEffect(() => {
    fetchProdiList();
    fetchTahunList();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    if (filterProdi && filterTahun) {
      fetchData();
    }
  }, [filterProdi, filterTahun]);

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setProdiList(result.data || []);
        
        if (result.data && result.data.length > 0 && !filterProdi) {
          const savedProdi = localStorage.getItem('rekognisi_filterProdi');
          if (savedProdi && result.data.some(p => p.id_prodi.toString() === savedProdi)) {
            setFilterProdi(savedProdi);
          } else {
            setFilterProdi(result.data[0].id_prodi.toString());
            localStorage.setItem('rekognisi_filterProdi', result.data[0].id_prodi.toString());
          }
        }
      }
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
      if (result.success) {
        const sortedTahun = (result.data || []).sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
        setTahunList(sortedTahun);
        
        if (sortedTahun.length > 0 && !filterTahun) {
          const savedTahun = localStorage.getItem('rekognisi_filterTahun');
          if (savedTahun && sortedTahun.some(t => t.id_tahun.toString() === savedTahun)) {
            setFilterTahun(savedTahun);
          } else {
            const lastTahun = sortedTahun[sortedTahun.length - 1].id_tahun.toString();
            setFilterTahun(lastTahun);
            localStorage.setItem('rekognisi_filterTahun', lastTahun);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const fetchData = async () => {
    if (!filterProdi || !filterTahun) return;

    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/kemahasiswaan/2d-rekognisi?id_prodi=${filterProdi}&id_tahun=${filterTahun}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();

      if (result.success) {
        setData(result.data || []);
        setRefSources(result.metadata?.ref_sources || []);
        setGraduatesMeta(result.metadata?.graduates || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashData = async () => {
    if (!filterProdi) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/kemahasiswaan/2d-rekognisi/trash?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setTrashData(result.data || []);
    } catch (err) {
      console.error('Error fetching trash data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Validation
    if (formData.id_ref_sumber === 'BARU' && !formData.nama_sumber_baru) {
      showError("Nama Sumber Baru harus diisi!");
      return;
    }

    const payload = {
      id_prodi: formData.id_prodi,
      id_tahun: formData.id_tahun,
      id_ref_sumber: formData.id_ref_sumber === 'BARU' ? null : formData.id_ref_sumber,
      nama_sumber_baru: formData.id_ref_sumber === 'BARU' ? formData.nama_sumber_baru : '',
      jenis_rekognisi: formData.jenis_rekognisi,
      link_bukti: formData.link_bukti
    };

    try {
      const url = editingId
        ? `http://localhost:5000/api/kemahasiswaan/2d-rekognisi/${editingId}`
        : `http://localhost:5000/api/kemahasiswaan/2d-rekognisi`;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        showSuccess(result.message || 'Data berhasil disimpan');
        fetchData();
        setShowForm(false);
        resetForm();
        setEditingId(null);
      } else {
        showError(result.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      console.error('Error saving data:', err);
      showError('Terjadi kesalahan sistem');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_prodi: item.id_prodi || filterProdi || '',
      id_tahun: item.id_tahun || filterTahun || '',
      id_ref_sumber: item.id_ref_sumber || '',
      nama_sumber_baru: '',
      jenis_rekognisi: item.jenis_rekognisi || '',
      link_bukti: item.link_bukti || ''
    });
    setEditingId(item.id_2d);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Anda yakin ingin memindahkan data ini ke tempat sampah?', 'Ya, Pindahkan');
    if (!isConfirmed) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/kemahasiswaan/2d-rekognisi/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        fetchData();
      } else {
        showError(result.message || 'Gagal memindahkan data');
      }
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  const handleRestore = async (id) => {
    const isConfirmed = await showConfirm('Kembalikan data ini?', 'Ya, Kembalikan');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/kemahasiswaan/2d-rekognisi/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        fetchTrashData();
        fetchData();
      }
    } catch (err) {
      console.error('Error restoring data:', err);
    }
  };

  const handleHardDelete = async (id) => {
    const isConfirmed = await showConfirm('Hapus permanen data ini? Tindakan ini tidak dapat dibatalkan!', 'Ya, Hapus Permanen');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/kemahasiswaan/2d-rekognisi/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) fetchTrashData();
    } catch (err) {
      console.error('Error hard deleting:', err);
    }
  };

  const handleAddMain = () => {
    if (showForm) {
      setShowForm(false);
      resetForm();
      return;
    }

    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      id_ref_sumber: '',
      nama_sumber_baru: '',
      jenis_rekognisi: '',
      link_bukti: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      id_ref_sumber: '',
      nama_sumber_baru: '',
      jenis_rekognisi: '',
      link_bukti: ''
    });
    setEditingId(null);
  };

  const handleAddForSource = (id_ref_sumber) => {
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      id_ref_sumber: id_ref_sumber,
      nama_sumber_baru: '',
      jenis_rekognisi: '',
      link_bukti: ''
    });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    if (!filterProdi || !filterTahun) {
      showError("Pilih Program Studi dan Tahun terlebih dahulu!");
      return;
    }
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/kemahasiswaan/2d-rekognisi/export?id_prodi=${filterProdi}&id_tahun=${filterTahun}&token=${token}`, '_blank');
  };

  // Helper to get total lulusan
  const totalLulusan = graduatesMeta.reduce((acc, curr) => acc + parseInt(curr.total || 0), 0);

  // LKPS Matrix Variables
  const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
  const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) : new Date().getFullYear();

  const idTahunTS = tahunList.find(t => parseInt(t.tahun) === anchorYear)?.id_tahun;
  const idTahunTS1 = tahunList.find(t => parseInt(t.tahun) === anchorYear - 1)?.id_tahun;
  const idTahunTS2 = tahunList.find(t => parseInt(t.tahun) === anchorYear - 2)?.id_tahun;

  const gradTS = graduatesMeta.find(g => g.id_tahun == idTahunTS)?.total || 0;
  const gradTS1 = graduatesMeta.find(g => g.id_tahun == idTahunTS1)?.total || 0;
  const gradTS2 = graduatesMeta.find(g => g.id_tahun == idTahunTS2)?.total || 0;

  const countTS = data.filter(d => d.id_tahun == idTahunTS).length;
  const countTS1 = data.filter(d => d.id_tahun == idTahunTS1).length;
  const countTS2 = data.filter(d => d.id_tahun == idTahunTS2).length;

  const percTS = gradTS ? ((countTS / gradTS) * 100).toFixed(2) : 0;
  const percTS1 = gradTS1 ? ((countTS1 / gradTS1) * 100).toFixed(2) : 0;
  const percTS2 = gradTS2 ? ((countTS2 / gradTS2) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Rekognisi Mahasiswa (2.D)</h1>
              <p className="text-slate-500 mt-1 font-medium">Pengelolaan data rekognisi dan pencapaian mahasiswa</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAddMain}>
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
              </Button>
              <Button onClick={handleExport} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-amber-600 shrink-0">
                  <Award size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Rekognisi</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Total</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{data.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-violet-600 shrink-0">
                  <Users size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Lulusan (Meta)</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Lulusan</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{totalLulusan}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <div className="w-full sm:w-[280px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Program Studi</label>
              <div className="relative">
                <select 
                  value={filterProdi} 
                  onChange={(e) => {
                    setFilterProdi(e.target.value);
                    localStorage.setItem('rekognisi_filterProdi', e.target.value);
                  }} 
                  className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
                >
                  <option value="">Pilih Prodi</option>
                  {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                  <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-[200px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Anchor (TS)</label>
              <div className="relative">
                <select 
                  value={filterTahun} 
                  onChange={(e) => {
                    setFilterTahun(e.target.value);
                    localStorage.setItem('rekognisi_filterTahun', e.target.value);
                  }} 
                  className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
                >
                  <option value="">Pilih Tahun</option>
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
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => { setViewMode('main'); fetchData(); }}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase ${viewMode === 'main'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-slate-500 hover:text-slate-500'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => { setViewMode('trash'); fetchTrashData(); }}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase flex items-center gap-2 ${viewMode === 'trash'
              ? 'border-b-4 border-red-600 text-red-600'
              : 'text-slate-500 hover:text-red-500'
              }`}
          >
            Trash
          </button>
        </div>

        {viewMode === 'main' && (
          <>
            {/* Form Section */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
                <h2 className="text-xl font-black text-slate-900 mb-6">{editingId ? 'Edit Data Rekognisi' : 'Input Data Rekognisi'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Program Studi</label>
                      <select value={formData.id_prodi} onChange={(e) => setFormData({ ...formData, id_prodi: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                        <option value="">Pilih Prodi</option>
                        {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Tahun Akademik (Terjadi Rekognisi)</label>
                      <select value={formData.id_tahun} onChange={(e) => setFormData({ ...formData, id_tahun: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                        <option value="">Pilih Tahun</option>
                        {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Sumber Rekognisi</label>
                      <select value={formData.id_ref_sumber} onChange={(e) => setFormData({ ...formData, id_ref_sumber: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                        <option value="">-- Pilih Sumber --</option>
                        {refSources.map(s => <option key={s.id_ref_sumber} value={s.id_ref_sumber}>{s.nama_sumber}</option>)}
                        <option value="BARU" className="font-bold text-blue-600">+ Tambah Sumber Baru...</option>
                      </select>
                    </div>

                    {formData.id_ref_sumber === 'BARU' && (
                      <div className="animate-in fade-in duration-300">
                        <label className="block text-sm font-bold text-blue-600 mb-2">Nama Sumber Baru</label>
                        <input type="text" value={formData.nama_sumber_baru} onChange={(e) => setFormData({ ...formData, nama_sumber_baru: e.target.value })} className="w-full px-4 py-3 bg-blue-100 border border-blue-800 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-blue-800 placeholder-blue-400" placeholder="Ketik nama sumber di sini..." required />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Kegiatan Rekognisi</label>
                    <input type="text" value={formData.jenis_rekognisi} onChange={(e) => setFormData({ ...formData, jenis_rekognisi: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="Contoh: Juara 1 Lomba Nasional..." required />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Tautan Bukti (Optional)</label>
                    <input type="url" value={formData.link_bukti} onChange={(e) => setFormData({ ...formData, link_bukti: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="https://..." />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                    <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-2.5 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs transition">
                      Batal
                    </button>
                    <button type="submit" className="bg-blue-600 hover:bg-violet-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-lg transition">
                      {editingId ? 'Simpan Perubahan' : 'Simpan Data'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-800">Daftar Rekognisi</h3>
                {!filterProdi || !filterTahun ? (
                  <span className="text-xs font-bold text-amber-600 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-300">
                    Pilih Prodi & Tahun untuk melihat data
                  </span>
                ) : null}
              </div>

              {(!filterProdi || !filterTahun) ? (
                <div className="p-20 text-center">
                  <Filter size={48} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-500 font-bold text-lg">Silakan pilih Program Studi dan Anchor (TS) terlebih dahulu</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max text-center whitespace-nowrap border-collapse">
                    <thead className="bg-[#1E3A8A]">
                      <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                        <th className="px-6 py-5 border-r border-white/20 align-middle" rowSpan="2">No</th>
                        <th className="px-6 py-5 border-r border-white/20 align-middle text-left min-w-[200px]" rowSpan="2">Sumber Rekognisi</th>
                        <th className="px-6 py-5 border-r border-white/20 align-middle text-left min-w-[250px]" rowSpan="2">Jenis Pengakuan Lulusan<br />(Rekognisi)</th>
                        <th className="px-6 py-5 border-r border-white/20 align-middle text-center" colSpan="3">Tahun Akademik</th>
                        <th className="px-6 py-5 border-r border-white/20 align-middle" rowSpan="2">Link Bukti</th>
                        <th className="px-6 py-5 align-middle" rowSpan="2">Aksi</th>
                      </tr>
                      <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                        <th className="px-4 py-3 border-r border-white/20 align-middle border-t border-white/20">TS-2<br />({anchorYear - 2})</th>
                        <th className="px-4 py-3 border-r border-white/20 align-middle border-t border-white/20">TS-1<br />({anchorYear - 1})</th>
                        <th className="px-4 py-3 border-r border-white/20 align-middle border-t border-white/20">TS<br />({anchorYear})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        let rowNumber = 1;
                        return refSources.map((source) => {
                          const sourceData = data.filter(d => d.id_ref_sumber === source.id_ref_sumber);

                          if (sourceData.length === 0) {
                            return (
                              <tr key={`empty-${source.id_ref_sumber}`} className="hover:bg-violet-50/40 even:bg-slate-50/40 border-b border-slate-200 transition-colors text-slate-700">
                                <td className="px-6 py-4 border-r border-slate-200 text-center font-bold text-slate-500">{rowNumber++}</td>
                                <td className="px-6 py-4 border-r border-slate-200 font-black text-slate-800 text-left">{source.nama_sumber}</td>
                                <td className="px-6 py-4 border-r border-slate-200 font-medium text-slate-500 italic text-left">-</td>
                                <td className="px-4 py-4 border-r border-slate-200 text-center bg-slate-50/50"></td>
                                <td className="px-4 py-4 border-r border-slate-200 text-center bg-slate-50/50"></td>
                                <td className="px-4 py-4 border-r border-slate-200 text-center bg-slate-50/50"></td>
                                <td className="px-6 py-4 border-r border-slate-200 text-center text-slate-500 italic">-</td>
                                <td className="px-6 py-4 border-r border-slate-200 text-center">
                                  <button onClick={() => handleAddForSource(source.id_ref_sumber)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs transition whitespace-nowrap">
                                    <Plus size={14} className="inline mr-1" /> Tambah
                                  </button>
                                </td>
                              </tr>
                            );
                          }

                          return sourceData.map((item, idx) => {
                            const isTS2 = parseInt(item.nama_tahun) === anchorYear - 2;
                            const isTS1 = parseInt(item.nama_tahun) === anchorYear - 1;
                            const isTS = parseInt(item.nama_tahun) === anchorYear;

                            return (
                              <tr key={item.id_2d} className="hover:bg-violet-50/40 even:bg-slate-50/40 border-b border-slate-200 transition-colors text-slate-700">
                                {idx === 0 && (
                                  <>
                                    <td className="px-6 py-4 border-r border-slate-200 text-center font-bold text-slate-500 align-top" rowSpan={sourceData.length}>{rowNumber++}</td>
                                    <td className="px-6 py-4 border-r border-slate-200 font-black text-slate-800 text-left align-top" rowSpan={sourceData.length}>{source.nama_sumber}</td>
                                  </>
                                )}
                                <td className="px-6 py-4 border-r border-slate-200 font-medium text-slate-600 text-left">{item.jenis_rekognisi}</td>
                                <td className="px-4 py-4 border-r border-slate-200 text-center font-black text-emerald-600 bg-emerald-50/50">
                                  {isTS2 ? 'V' : ''}
                                </td>
                                <td className="px-4 py-4 border-r border-slate-200 text-center font-black text-emerald-600 bg-emerald-50/50">
                                  {isTS1 ? 'V' : ''}
                                </td>
                                <td className="px-4 py-4 border-r border-slate-200 text-center font-black text-emerald-600 bg-emerald-50/50">
                                  {isTS ? 'V' : ''}
                                </td>
                                <td className="px-6 py-4 border-r border-slate-200 text-center">
                                  {isTS ? (
                                    item.link_bukti ? (
                                      <a href={item.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 font-bold text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition">
                                        <LinkIcon size={12} /> Buka
                                      </a>
                                    ) : (
                                      <span className="text-xs text-slate-500 italic">-</span>
                                    )
                                  ) : (
                                    <span className="text-xs text-slate-500 italic">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 border-r border-slate-200 text-center">
                                  {isTS ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => handleEdit(item)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs transition" title="Edit">
                                        <Edit size={14} />
                                      </button>
                                      <button onClick={() => handleDelete(item.id_2d)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition" title="Hapus">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-500 italic">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          });
                        });
                      })()}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold text-slate-800 text-center">
                      <tr>
                        <td colSpan="3" className="px-6 py-4 border-b border-r border-slate-200 text-right uppercase tracking-wider text-xs font-black text-slate-500">Jumlah Rekognisi</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-emerald-600">{countTS2}</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-emerald-600">{countTS1}</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-emerald-600">{countTS}</td>
                        <td colSpan="2" className="px-6 py-4 border-b border-slate-200 bg-slate-50"></td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="px-6 py-4 border-b border-r border-slate-200 text-right uppercase tracking-wider text-xs font-black text-slate-500">Jumlah Lulusan</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-violet-600">{gradTS2}</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-violet-600">{gradTS1}</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-violet-600">{gradTS}</td>
                        <td colSpan="2" className="px-6 py-4 border-b border-slate-200 bg-slate-50"></td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="px-6 py-4 border-b border-r border-slate-200 text-right uppercase tracking-wider text-xs font-black text-slate-500">Persentase</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-blue-600">{percTS2}%</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-blue-600">{percTS1}%</td>
                        <td className="px-4 py-4 border-b border-r border-slate-200 font-black text-blue-600">{percTS}%</td>
                        <td colSpan="2" className="px-6 py-4 border-b border-slate-200 bg-slate-50"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === 'trash' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-red-950/30 flex justify-between items-center">
              <div>
                <h3 className="font-black text-red-300 flex items-center gap-2">
                  <Trash2 size={20} /> Tempat Sampah
                </h3>
                <p className="text-sm font-bold text-red-500/70 mt-1">Data rekognisi yang telah dihapus sementara</p>
              </div>
            </div>
            {trashData.length === 0 ? (
              <div className="p-20 text-center">
                <Trash2 size={48} className="mx-auto text-slate-800 mb-4" />
                <p className="text-slate-500 font-bold text-lg">Tempat sampah kosong</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 border-b border-slate-200">
                    <tr className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-6 py-4 w-16 text-center">No</th>
                      <th className="px-6 py-4">Sumber Rekognisi</th>
                      <th className="px-6 py-4">Kegiatan</th>
                      <th className="px-6 py-4 text-center">Tahun</th>
                      <th className="px-6 py-4 text-center w-32">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trashData.map((item, index) => (
                      <tr key={item.id_2d} className="hover:bg-red-950/30 transition-colors">
                        <td className="px-6 py-4 text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="px-6 py-4 font-black text-slate-800">{item.nama_sumber}</td>
                        <td className="px-6 py-4 font-medium text-slate-500 line-through">{item.jenis_rekognisi}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold">
                            {item.nama_tahun}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleRestore(item.id_2d)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-slate-900 rounded-lg font-bold text-xs transition" title="Pulihkan">
                              Restore
                            </button>
                            <button onClick={() => handleHardDelete(item.id_2d)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-slate-900 rounded-lg transition" title="Hapus Permanen">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
