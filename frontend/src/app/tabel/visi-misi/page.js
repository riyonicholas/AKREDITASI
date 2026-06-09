'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Eye, Target, Compass } from 'lucide-react';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function VisiMisiPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdProdi, setFilterIdProdi] = useState('');
  const [prodiList, setProdiList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_prodi: '',
    visi_pt: '',
    misi_pt: '',
    visi_upps: '',
    misi_upps: '',
    visi_keilmuan_ps: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchProdiList();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdProdi || prodiList.length > 0) {
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
        setProdiList(result.data);
        if (result.data.length > 0 && !filterIdProdi) {
          const savedProdi = localStorage.getItem('visiMisi_filterProdi');
          if (savedProdi && result.data.some(p => p.id_prodi.toString() === savedProdi)) {
            setFilterIdProdi(savedProdi);
          } else {
            setFilterIdProdi(result.data[0].id_prodi.toString());
            localStorage.setItem('visiMisi_filterProdi', result.data[0].id_prodi.toString());
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
      const url = filterIdProdi 
        ? `http://localhost:5000/api/upps/6-visi-misi?id_prodi=${filterIdProdi}`
        : 'http://localhost:5000/api/upps/6-visi-misi';
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
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
      ? `http://localhost:5000/api/upps/6-visi-misi/${editingId}`
      : 'http://localhost:5000/api/upps/6-visi-misi';

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
    setEditingId(item.id_vm);
    setFormData({
      id_prodi: item.id_prodi || '',
      visi_pt: item.visi_pt || '',
      misi_pt: item.misi_pt || '',
      visi_upps: item.visi_upps || '',
      misi_upps: item.misi_upps || '',
      visi_keilmuan_ps: item.visi_keilmuan_ps || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Yakin hapus data ini?');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/6-visi-misi/${id}`, {
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

  const resetForm = () => {
    setFormData({
      id_prodi: filterIdProdi,
      visi_pt: '',
      misi_pt: '',
      visi_upps: '',
      misi_upps: '',
      visi_keilmuan_ps: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/upps/6-visi-misi/export?id_prodi=${filterIdProdi}&token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Visi Misi (Tabel 6)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Visi, Misi, UPPS, dan Visi Keilmuan PS</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!data.length && (
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
              </Button>
            )}
            {data.length > 0 && showForm && editingId && (
              <Button onClick={resetForm} variant="outline">
                <span>Tutup Edit</span>
              </Button>
            )}
            <Button onClick={handleExport} variant="success">
              <Download size={18} />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <Eye size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Visi PT</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">V.PT</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{data.length > 0 ? 'Tersedia' : '-'}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-violet-600 shrink-0">
                  <Target size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Visi UPPS</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">V.UPPS</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{data.length > 0 ? 'Aktif' : '-'}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-emerald-600 shrink-0">
                  <Compass size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Keilmuan PS</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">K.PS</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{data.length > 0 ? 'Terkelola' : '-'}</p>
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
                    localStorage.setItem('visiMisi_filterProdi', e.target.value);
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
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Visi Misi' : 'Input Visi Misi Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Program Studi (Sesuai Filter)</label>
                    <select 
                      value={formData.id_prodi} 
                      disabled={true}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 px-4 text-[0.9rem] text-slate-500 outline-none cursor-not-allowed appearance-none"
                    >
                      <option value="">Pilih Program Studi</option>
                      {prodiList.map(p => (
                        <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-blue-500 mt-2 font-bold uppercase tracking-wider italic">* Mengikuti prodi yang Anda pilih di filter utama</p>
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Visi PT</label>
                    <textarea value={formData.visi_pt} onChange={(e) => setFormData({...formData, visi_pt: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" rows="3" placeholder="Visi Perguruan Tinggi..." />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Misi PT</label>
                    <textarea value={formData.misi_pt} onChange={(e) => setFormData({...formData, misi_pt: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" rows="3" placeholder="Misi Perguruan Tinggi..." />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Visi UPPS</label>
                    <textarea value={formData.visi_upps} onChange={(e) => setFormData({...formData, visi_upps: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" rows="3" placeholder="Visi Unit Pengelola Program Studi..." />
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Misi UPPS</label>
                    <textarea value={formData.misi_upps} onChange={(e) => setFormData({...formData, misi_upps: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" rows="3" placeholder="Misi Unit Pengelola Program Studi..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Visi Keilmuan Program Studi</label>
                    <textarea value={formData.visi_keilmuan_ps} onChange={(e) => setFormData({...formData, visi_keilmuan_ps: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" rows="4" placeholder="Visi Keilmuan PS..." />
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
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data visi misi</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <React.Fragment key={item.id_vm}>
                      {/* Row 1: Visi Headers */}
                       <tr className="bg-[#1E3A8A] border-b border-white/20">
                         <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 w-1/3">Visi PT</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 w-1/3">Visi UPPS</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider w-1/3">Visi Keilmuan PS</th>
                       </tr>
                      {/* Row 2: Visi Content */}
                      <tr className="border-b border-slate-200 bg-white">
                        <td className="px-6 py-6 border-r border-slate-200 align-top whitespace-normal">
                          <div className="text-sm text-slate-800 leading-relaxed">{item.visi_pt || '-'}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-slate-200 align-top whitespace-normal">
                          <div className="text-sm text-slate-800 leading-relaxed">{item.visi_upps || '-'}</div>
                        </td>
                        <td className="px-6 py-6 align-top whitespace-normal">
                          <div className="text-sm text-slate-800 leading-relaxed">{item.visi_keilmuan_ps || '-'}</div>
                        </td>
                      </tr>
                      {/* Row 3: Misi Headers */}
                       <tr className="bg-[#1E3A8A] border-b border-white/20">
                         <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Misi PT</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20">Misi UPPS</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider text-center">Aksi Data</th>
                       </tr>
                      {/* Row 4: Misi Content & Actions */}
                      <tr className="bg-white">
                        <td className="px-6 py-6 border-r border-slate-200 align-top whitespace-normal">
                          <div className="text-sm text-slate-600 leading-relaxed">{item.misi_pt || '-'}</div>
                        </td>
                        <td className="px-6 py-6 border-r border-slate-200 align-top whitespace-normal">
                          <div className="text-sm text-slate-600 leading-relaxed">{item.misi_upps || '-'}</div>
                        </td>
                        <td className="px-6 py-6 align-middle text-center">
                           <div className="flex justify-center gap-2">
                             <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={17} /></button>
                             <button onClick={() => handleDelete(item.id_vm)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={17} /></button>
                           </div>
                        </td>
                      </tr>
                    </React.Fragment>
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
