'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Target, Map, Calendar, Award, Trash } from 'lucide-react';

export default function PemetaanCplPlPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingCpl, setEditingCpl] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [isTrashView, setIsTrashView] = useState(false);
  
  const [prodiList, setProdiList] = useState([]);
  const [cplList, setCplList] = useState([]);
  const [profilLulusanList, setProfilLulusanList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_cpl: '',
    id_pl: '',
    id_tahun: '',
  });
  const [selectedPls, setSelectedPls] = useState([]);

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
      const savedProdi = localStorage.getItem('pemetaanCplPl_filterProdi');
      if (savedProdi && prodiList.some(p => p.id_prodi.toString() === savedProdi)) {
        setFilterProdi(savedProdi);
      } else {
        const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (tiProdi) {
          setFilterProdi(tiProdi.id_prodi.toString());
          localStorage.setItem('pemetaanCplPl_filterProdi', tiProdi.id_prodi.toString());
        } else if (prodiList.length > 0) {
          setFilterProdi(prodiList[0].id_prodi.toString());
          localStorage.setItem('pemetaanCplPl_filterProdi', prodiList[0].id_prodi.toString());
        }
      }
    }
  }, [prodiList, filterProdi]);

  useEffect(() => {
    if (tahunList.length > 0 && (!filterTahun || filterTahun === '')) {
      const savedTahun = localStorage.getItem('pemetaanCplPl_filterTahun');
      if (savedTahun && tahunList.some(t => t.id_tahun.toString() === savedTahun)) {
        setFilterTahun(savedTahun);
      } else {
        setFilterTahun(tahunList[0].id_tahun.toString());
        localStorage.setItem('pemetaanCplPl_filterTahun', tahunList[0].id_tahun.toString());
      }
    }
  }, [tahunList, filterTahun]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      fetchData();
      fetchCplList();
      fetchProfilLulusanList();
    }
  }, [filterProdi, filterTahun, isTrashView]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl?id_prodi=${filterProdi}&id_tahun=${filterTahun}&is_trash=${isTrashView}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setData(result.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

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
      if (result.success) {
        const sortedTahun = result.data.sort((a, b) => a.tahun - b.tahun);
        setTahunList(sortedTahun);
      }
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const fetchCplList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/cpl?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setCplList(result.data || []);
    } catch (err) {
      console.error('Error fetching CPL:', err);
    }
  };

  const fetchProfilLulusanList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/profil-lulusan?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setProfilLulusanList(result.data || []);
    } catch (err) {
      console.error('Error fetching profil lulusan:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editingCpl) {
      showError('Kolom CPL wajib diisi');
      return;
    }
    
    if (!filterTahun) {
      showError('Kolom Tahun Akademik wajib diisi');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      const originalMappedPls = data.filter(d => d.id_cpl === editingCpl.id_cpl);
      const originalPlIds = originalMappedPls.map(d => d.id_pl);
      
      const toAdd = selectedPls.filter(id => !originalPlIds.includes(id));
      const toDelete = originalMappedPls.filter(d => !selectedPls.includes(d.id_pl));
      
      // Save added PLs
      for (const plId of toAdd) {
        const res = await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id_cpl: editingCpl.id_cpl,
            id_pl: plId,
            id_tahun: parseInt(filterTahun)
          }),
        });
        
        const result = await res.json();
        if (!result.success) {
          showError(result.message || 'Gagal menyimpan data');
          return;
        }
      }
      
      // Delete removed PLs
      for (const item of toDelete) {
        await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl/${item.id_2b2}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      showSuccess('Data berhasil disimpan');
      fetchData();
      resetForm();
    } catch (err) {
      console.error('Error saving data:', err);
      showError('Gagal menyimpan data');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_cpl: item.id_cpl || '',
      id_pl: item.id_pl || '',
      id_tahun: item.id_tahun || '',
    });
    setEditingId(item.id_2b2);
    setShowForm(true);
  };

  const handleEditCpl = (cpl) => {
    setEditingCpl(cpl);
    const existingPls = data
      .filter(item => item.id_cpl === cpl.id_cpl)
      .map(item => item.id_pl);
    setSelectedPls(existingPls);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Apakah Anda yakin ingin menghapus data ini?', 'Ya, Hapus');
    if (!isConfirmed) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success !== false) showSuccess(result.message); else showError(result.message);
      fetchData();
    } catch (err) {
      console.error('Error deleting data:', err);
      showError('Gagal menghapus data');
    }
  };

  const handleHardDeleteGroup = async (cpl) => {
    const isConfirmed = await showConfirm('Apakah Anda yakin ingin menghapus permanen semua pemetaan untuk CPL ini? Data tidak dapat dikembalikan!', 'Ya, Hapus Permanen');
    if (!isConfirmed) return;
    
    const itemsToDelete = data.filter(item => item.id_cpl === cpl.id_cpl);
    const token = localStorage.getItem('token');
    
    try {
      for (const item of itemsToDelete) {
        await fetch(`http://localhost:5000/api/prodi/2b2-pemetaan-cpl/${item.id_2b2}?hard=true`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      showSuccess('Data berhasil dihapus permanen');
      fetchData();
    } catch (err) {
      console.error('Error hard deleting data:', err);
      showError('Gagal menghapus data secara permanen');
    }
  };

  const resetForm = () => {
    setFormData({
      id_cpl: '',
      id_pl: '',
      id_tahun: '',
    });
    setEditingCpl(null);
    setSelectedPls([]);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pemetaan CPL dan PL (2.B.2)</h1>
              <p className="text-slate-500 mt-1 font-medium">Pengelolaan hubungan CPL dengan Profil Lulusan</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => window.open(`http://localhost:5000/api/prodi/2b1-isi-pembelajaran/export?id_prodi=${filterProdi}&token=${localStorage.getItem('token')}`, '_blank')} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
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
                  localStorage.setItem('pemetaanCplPl_filterProdi', e.target.value);
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
                  localStorage.setItem('pemetaanCplPl_filterTahun', e.target.value);
                }} 
                className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
              >
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
          <Button onClick={() => setIsTrashView(!isTrashView)} variant={isTrashView ? 'destructive' : 'outline'} className="h-[44px] px-4 shrink-0 gap-2" title={isTrashView ? "Tampilkan Data Aktif" : "Lihat Data Sampah"}>
            <Trash size={18} />
            <span className="font-bold text-sm hidden sm:inline">{isTrashView ? "Data Aktif" : "Lihat Sampah"}</span>
          </Button>
        </div>

        {/* Form Section */}
        {editingCpl && (
          <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 mb-6">
              {editingId ? 'Edit Pemetaan CPL dan PL' : 'Input Pemetaan CPL dan PL Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">CPL</label>
                  <div className="border border-slate-200 rounded-xl bg-white max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/80 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-slate-600">Kode</th>
                          <th className="px-4 py-2 text-left font-medium text-slate-600">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {editingCpl ? (
                          <tr 
                            key={editingCpl.id_cpl} 
                            className="bg-blue-50/80"
                          >
                            <td className="px-4 py-2 font-mono text-xs font-bold text-slate-800">{editingCpl.kode_cpl}</td>
                            <td className="px-4 py-2 text-slate-500">{editingCpl.deskripsi_cpl}</td>
                          </tr>
                        ) : (
                          cplList.map(cpl => (
                          <tr 
                            key={cpl.id_cpl} 
                            className={`hover:bg-blue-50 cursor-pointer ${editingCpl?.id_cpl === cpl.id_cpl ? 'bg-blue-50/80' : ''}`}
                            onClick={() => {
                              setEditingCpl(cpl);
                              setSelectedPls([]); // Reset selected PLs when CPL changes
                            }}
                          >
                            <td className="px-4 py-2 font-mono text-xs font-bold text-slate-800">{cpl.kode_cpl}</td>
                            <td className="px-4 py-2 text-slate-500">{cpl.deskripsi_cpl}</td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Profil Lulusan</label>
                  <div className="border border-slate-200 rounded-xl bg-white max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/80 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-slate-600">Kode</th>
                          <th className="px-4 py-2 text-left font-medium text-slate-600">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {profilLulusanList.map(pl => {
                          const isMapped = selectedPls.includes(pl.id_pl);
                          return (
                            <tr key={pl.id_pl} className="hover:bg-blue-50 cursor-pointer">
                              <td className="px-4 py-2 font-mono text-xs font-bold text-slate-800">{pl.kode_pl}</td>
                              <td className="px-4 py-2 text-slate-500">
                                <div className="flex items-center justify-between">
                                  <span>{pl.deskripsi_pl}</span>
                                  <input
                                    type="checkbox"
                                    checked={isMapped}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedPls(prev => [...prev, pl.id_pl]);
                                      } else {
                                        setSelectedPls(prev => prev.filter(id => id !== pl.id_pl));
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-slate-50/80 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Tahun Akademik</label>
                    <input
                      type="text"
                      value={filterTahun ? tahunList.find(t => t.id_tahun === parseInt(filterTahun))?.tahun : ''}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-50/80 border-transparent border-2 border-slate-300 rounded-2xl outline-none transition font-medium text-slate-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-slate-50/80 text-slate-500 rounded-2xl hover:bg-slate-200 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-slate-900 rounded-2xl hover:bg-violet-700 transition font-black shadow-lg shadow-violet-200/50">{editingId ? 'Update Data' : 'Simpan Data'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section - Matrix View */}
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-slate-500 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : cplList.length === 0 || profilLulusanList.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-xl tracking-tight">Data CPL atau Profil Lulusan belum tersedia</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left border-collapse">
                <thead className="bg-[#1E3A8A]">
                  <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                    <th className="px-6 py-5 border-r border-white/20 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.2)] bg-[#1E3A8A]">
                      CPL
                    </th>
                    <th className="px-6 py-5 border-r border-white/20 text-center min-w-[200px]">
                      PL
                    </th>
                    <th className="px-6 py-5 border-r border-white/20 text-center min-w-[80px]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cplList.map((cpl) => {
                    const mappedPls = profilLulusanList.filter(pl => 
                      data.some(item => item.id_cpl === cpl.id_cpl && item.id_pl === pl.id_pl)
                    );
                    
                    if (mappedPls.length === 0) {
                      if (isTrashView) return null; // Sembunyikan CPL kosong di tampilan sampah
                      // CPL dengan PL kosong
                      return (
                        <tr key={cpl.id_cpl} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors border-b border-slate-200">
                          <td className="px-4 py-3 border-r border-slate-200 bg-transparent align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0] group-hover:bg-violet-50/40 group-even:bg-slate-50/40 backdrop-blur-md">
                            <div className="font-black text-slate-900 text-sm">{cpl.kode_cpl || '-'}</div>
                            <div className="text-[10px] text-slate-500 mt-1 font-medium">{cpl.deskripsi_cpl || '-'}</div>
                          </td>
                          <td className="px-4 py-3 border-r border-slate-200">
                            <div className="font-mono text-xs font-bold text-slate-800">-</div>
                            <div className="text-[10px] text-slate-500 mt-1">-</div>
                          </td>
                          <td className="px-4 py-3 border-r border-slate-200 text-center">
                            <button 
                              onClick={() => handleEditCpl(cpl)} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-emerald-50 hover:border-emerald-200 shadow-sm transition"
                            >
                              <Plus size={14} />
                              Tambah
                            </button>
                          </td>
                        </tr>
                      );
                    }
                    
                    return (
                      <tr key={cpl.id_cpl} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors border-b border-slate-200">
                        <td className="px-4 py-3 border-r border-slate-200 bg-transparent align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0] group-hover:bg-violet-50/40 group-even:bg-slate-50/40 backdrop-blur-md">
                          <div className="font-black text-slate-900 text-sm">{cpl.kode_cpl || '-'}</div>
                          <div className="text-[10px] text-slate-500 mt-1 font-medium">{cpl.deskripsi_cpl || '-'}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 align-top">
                          <div className="flex flex-wrap gap-3">
                            {mappedPls.map(pl => (
                              <div key={pl.id_pl} className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-[280px] shadow-sm">
                                <div className="font-black text-violet-600 text-xs mb-1">{pl.kode_pl}</div>
                                <div className="text-[10px] text-slate-600 leading-relaxed font-medium">{pl.deskripsi_pl}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 text-center align-top w-[140px] min-w-[140px] max-w-[140px] bg-white">
                          {isTrashView ? (
                            <button 
                              onClick={() => handleHardDeleteGroup(cpl)} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-white border border-slate-200 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-red-50 hover:border-red-200 shadow-sm transition-colors"
                            >
                              <Trash2 size={12} />
                              Hapus
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleEditCpl(cpl)} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-white border border-slate-200 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-colors"
                            >
                              <Edit size={12} />
                              Atur PL
                            </button>
                          )}
                        </td>
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
  );
}
