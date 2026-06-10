'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Monitor, Link as LinkIcon, ExternalLink, ShieldCheck, Globe, Shield } from 'lucide-react';
import { showSuccess, showError as alertError, showConfirm } from '@/components/CustomAlerts';

export default function SistemTataKelolaPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  
  const [formData, setFormData] = useState({
    jenis_tata_kelola: '',
    nama_sistem: '',
    akses: 'Internet',
    unit_pengelola: '',
    link_bukti: '',
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
      const baseUrl = 'http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola';
      
      const [activeRes, trashRes, unitsRes] = await Promise.all([
        fetch(baseUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/trash`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/unit-kerja', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      const unitsResult = await unitsRes.json();
      
      if (activeResult.success) {
        setActiveData(activeResult.data || []);
      }
      if (trashResult.success) {
        setTrashData(trashResult.data || []);
      }
      if (unitsResult.success) {
        setUnits(unitsResult.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      alertError('Gagal memuat data dari server');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/${editingId}`
      : 'http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          unit_pengelola: formData.unit_pengelola || null
        }),
      });
      const result = await res.json();
      if (result.success) {
        showSuccess(result.message);
        fetchData();
        resetForm();
      } else {
        alertError(result.message || 'Terjadi kesalahan saat menyimpan data');
      }
    } catch (err) {
      alertError('Terjadi kesalahan koneksi server');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_5_1);
    setFormData({
      jenis_tata_kelola: item.jenis_tata_kelola || '',
      nama_sistem: item.nama_sistem || '',
      akses: item.akses || 'Internet',
      unit_pengelola: item.unit_pengelola || '',
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!(await showConfirm('Pindahkan data tata kelola ini ke tempat sampah?', 'Ya, Pindahkan'))) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        showSuccess(result.message);
        fetchData();
      } else {
        alertError(result.message || 'Gagal menghapus data');
      }
    } catch (err) {
      alertError('Terjadi kesalahan server');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        showSuccess(result.message);
        fetchData();
      } else {
        alertError(result.message || 'Gagal memulihkan data');
      }
    } catch (err) {
      alertError('Terjadi kesalahan server');
    }
  };

  const handleHardDelete = async (id) => {
    if (!(await showConfirm('HAPUS PERMANEN? Tindakan ini tidak dapat dibatalkan.', 'Ya, Hapus Permanen'))) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        showSuccess(result.message);
        fetchData();
      } else {
        alertError(result.message || 'Gagal menghapus permanen');
      }
    } catch (err) {
      alertError('Terjadi kesalahan server');
    }
  };

  const resetForm = () => {
    setFormData({
      jenis_tata_kelola: '',
      nama_sistem: '',
      akses: 'Internet',
      unit_pengelola: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/sisfo/5-1-sistem-tata-kelola/export?token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sistem Tata Kelola (5.1)</h1>
              <p className="text-slate-500 mt-1 font-medium">Kelola sistem informasi pendukung operasional & tata kelola institusi</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Tata Kelola'}</span>
              </Button>
              <Button onClick={handleExport} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats & Controls */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Sistem</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Sistem</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.length}</p>
                </div>
              </div>
            </Card>
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-emerald-600 shrink-0">
                  <Globe size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Akses Internet</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Internet</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.filter(d => d.akses === 'Internet').length}</p>
                </div>
              </div>
            </Card>
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-amber-500 shrink-0">
                  <Shield size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Akses Lokal</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Lokal</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.filter(d => d.akses === 'Lokal').length}</p>
                </div>
              </div>
            </Card>
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-orange-600 shrink-0">
                  <Trash size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Sampah</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Sampah</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{trashData.length}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <Button onClick={fetchData} variant="outline" className="h-[44px] px-4 shrink-0" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <button 
              onClick={() => setShowTrash(!showTrash)} 
              className={`h-[44px] px-5 rounded-xl font-bold text-sm transition border shadow-sm flex items-center justify-center shrink-0 ${showTrash ? 'bg-orange-50 border-orange-800 text-orange-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </button>
          </div>
        </div>

        {/* Input Form Section */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 mb-6">{editingId ? 'Edit Data Tata Kelola' : 'Input Sistem Tata Kelola Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Jenis Tata Kelola</label>
                  <input 
                    type="text" 
                    value={formData.jenis_tata_kelola} 
                    onChange={(e) => setFormData({...formData, jenis_tata_kelola: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900" 
                    placeholder="Contoh: Sistem Informasi Akademik" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Nama Sistem Informasi</label>
                  <input 
                    type="text" 
                    value={formData.nama_sistem} 
                    onChange={(e) => setFormData({...formData, nama_sistem: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900" 
                    placeholder="Contoh: SIAKAD" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Akses</label>
                  <select 
                    value={formData.akses} 
                    onChange={(e) => setFormData({...formData, akses: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="Internet">Internet</option>
                    <option value="Lokal">Lokal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Unit Pengelola</label>
                  <input 
                    type="text" 
                    value={formData.unit_pengelola} 
                    onChange={(e) => setFormData({...formData, unit_pengelola: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900" 
                    placeholder="Contoh: Biro Administrasi Umum" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-600 mb-2">Link Bukti Dokumen/Sistem</label>
                  <input 
                    type="url" 
                    value={formData.link_bukti} 
                    onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900" 
                    placeholder="Contoh: https://siakad.stikompgri-bwy.ac.id" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                <button type="submit" className="bg-blue-600 hover:bg-violet-700 text-slate-900 px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-lg transition">
                  {editingId ? 'Simpan Perubahan' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
              <RefreshCw className="animate-spin text-blue-500" size={32} />
              <span className="font-bold text-sm uppercase tracking-wider">Memuat Data...</span>
            </div>
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Monitor size={48} className="mb-4 text-gray-700" />
              <p className="font-bold text-lg text-slate-500 uppercase tracking-widest">Tidak Ada Data</p>
              <p className="text-slate-400 text-sm mt-1">{showTrash ? 'Tempat sampah kosong.' : 'Belum ada data sistem tata kelola.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full table-auto border-collapse text-sm">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20">No</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20 text-left min-w-[200px]">Jenis Tata Kelola</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20 text-left min-w-[200px]">Nama Sistem Informasi</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20">Akses</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20 text-left">Unit Pengelola</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20">Bukti</th>
                    <th className="px-4 py-4 text-[11px] font-bold text-slate-100 uppercase tracking-wider border-r border-b border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(showTrash ? trashData : activeData).map((item, idx) => (
                    <tr key={item.id_5_1} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors text-center text-slate-700">
                      <td className="px-4 py-4 border-r border-b border-slate-200 font-bold">{idx + 1}</td>
                      <td className="px-6 py-4 border-r border-b border-slate-200 text-left font-black text-slate-900">{item.jenis_tata_kelola || '-'}</td>
                      <td className="px-6 py-4 border-r border-b border-slate-200 text-left font-black text-blue-600">{item.nama_sistem || '-'}</td>
                      <td className="px-4 py-4 border-r border-b border-slate-200">
                        <span 
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            item.akses === 'Internet' 
                              ? 'bg-emerald-100 border-emerald-200 text-emerald-600' 
                              : 'bg-amber-100 border-amber-200 text-amber-600'
                          }`}
                        >
                          {item.akses}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200 text-left font-bold text-slate-500">
                        {(() => {
                          if (!item.unit_pengelola) return '-';
                          const unitId = parseInt(item.unit_pengelola);
                          if (!isNaN(unitId)) {
                            const foundUnit = units.find(u => parseInt(u.id_unit) === unitId);
                            if (foundUnit) return foundUnit.nama_unit;
                          }
                          return item.unit_pengelola;
                        })()}
                      </td>
                      <td className="px-4 py-4 border-r border-b border-slate-200">
                        {item.link_bukti ? (
                          <a 
                            href={item.link_bukti} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-1.5 bg-slate-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition inline-flex items-center justify-center"
                            title="Buka Link Bukti"
                          >
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs font-bold">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 border-r border-b border-slate-200">
                        <div className="flex items-center justify-center gap-1">
                          {!showTrash ? (
                            <>
                              <button 
                                onClick={() => handleEdit(item)} 
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={() => handleSoftDelete(item.id_5_1)} 
                                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                                title="Hapus ke Sampah"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleRestore(item.id_5_1)} 
                                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition font-bold text-xs"
                                title="Restore"
                              >
                                <RotateCcw size={12} />
                                <span>Pulihkan</span>
                              </button>
                              <button 
                                onClick={() => handleHardDelete(item.id_5_1)} 
                                className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition font-bold text-xs"
                                title="Hapus Permanen"
                              >
                                <Trash size={12} />
                                <span>Hapus</span>
                              </button>
                            </>
                          )}
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
