'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, History, UserCheck, Briefcase, Calendar } from 'lucide-react';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function PimpinanPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [isTrashMode, setIsTrashMode] = useState(false);

  // Request Body API: id_pegawai, periode_mulai, periode_selesai, tupoksi
  // sks_jabatan → auto-calculated dari master (tidak dikirim)
  const [formData, setFormData] = useState({
    id_pegawai: '',
    periode_mulai: '',
    periode_selesai: '',
    tupoksi: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData(false);
      fetchPegawaiList();
    }
  }, [router]);

  const fetchData = async (trash = isTrashMode) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const url = trash 
        ? 'http://localhost:5000/api/upps/1a1-pimpinan/trash' 
        : 'http://localhost:5000/api/upps/1a1-pimpinan';
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

  const fetchPegawaiList = async () => {
    const token = localStorage.getItem('token');
    try {
      // Sesuai API docs: GET /api/master/pegawai
      const res = await fetch('http://localhost:5000/api/master/pegawai', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setPegawaiList(result.data);
      }
    } catch (err) {
      console.error('Error fetching pegawai list:', err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/upps/1a1-pimpinan/${editingId}`
      : 'http://localhost:5000/api/upps/1a1-pimpinan';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Kirim hanya field sesuai API: id_pegawai, periode_mulai, periode_selesai, tupoksi
        body: JSON.stringify({
          id_pegawai: formData.id_pegawai,
          periode_mulai: formData.periode_mulai,
          periode_selesai: formData.periode_selesai,
          tupoksi: formData.tupoksi,
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
      showError('Terjadi kesalahan koneksi ke server');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_pimpinan);
    setFormData({
      id_pegawai: String(item.id_pegawai || ''),
      periode_mulai: item.periode_mulai || '',
      periode_selesai: item.periode_selesai || '',
      tupoksi: item.tupoksi || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Yakin hapus data ini? Data akan dipindahkan ke Sampah.');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a1-pimpinan/${id}`, {
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
      showError('Terjadi kesalahan koneksi ke server');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a1-pimpinan/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal memulihkan data');
      } else {
        showSuccess(result.message);
      }
      fetchData(true);
    } catch (err) {
      showError('Terjadi kesalahan koneksi ke server');
    }
  };

  const handleHardDelete = async (id) => {
    const isConfirmed = await showConfirm('⚠️ PERHATIAN: Data akan dihapus PERMANEN dan tidak bisa dipulihkan!');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/1a1-pimpinan/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal menghapus permanen');
      } else {
        showSuccess(result.message);
      }
      fetchData(true);
    } catch (err) {
      showError('Terjadi kesalahan server');
    }
  };

  const resetForm = () => {
    setFormData({
      id_pegawai: '',
      periode_mulai: '',
      periode_selesai: '',
      tupoksi: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/upps/1a1-pimpinan/export?token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Pimpinan (1.A.1)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola data pimpinan UPPS & Tupoksi</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!isTrashMode && (
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Pimpinan'}</span>
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
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <UserCheck size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Aktif</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Total</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{isTrashMode ? '-' : data.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-violet-600 shrink-0">
                  <Briefcase size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Unit UPPS</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Unit</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{isTrashMode ? '-' : [...new Set(data.map(d => d.nama_unit_display))].length}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <Button onClick={() => fetchData(isTrashMode)} variant="outline" className="h-[44px] px-4 shrink-0" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button 
              onClick={() => {
                const newMode = !isTrashMode;
                setIsTrashMode(newMode);
                fetchData(newMode);
                if(newMode) setShowForm(false);
              }} 
              variant={isTrashMode ? 'primary' : 'outline'}
              className="h-[44px] shrink-0"
            >
              {isTrashMode ? 'Lihat Aktif' : 'Lihat Sampah'}
            </Button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Data Pimpinan' : 'Input Pimpinan Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Pilih Pegawai</label>
                    <select 
                      value={formData.id_pegawai} 
                      onChange={(e) => setFormData({ ...formData, id_pegawai: e.target.value })} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all cursor-pointer" 
                      required
                    >
                      <option value="">-- Pilih Pegawai --</option>
                      {pegawaiList.map(pegawai => (
                        <option key={pegawai.id_pegawai} value={String(pegawai.id_pegawai)}>{pegawai.nama_lengkap}</option>
                      ))}
                    </select>
                  </div>
                  {/* Periode Mulai */}
                  <div>
                    <Input 
                      type="date"
                      label="Periode Mulai"
                      value={formData.periode_mulai} 
                      onChange={(e) => setFormData({ ...formData, periode_mulai: e.target.value })} 
                    />
                  </div>
                  {/* Periode Selesai */}
                  <div>
                    <Input 
                      type="date"
                      label="Periode Selesai"
                      value={formData.periode_selesai} 
                      onChange={(e) => setFormData({ ...formData, periode_selesai: e.target.value })} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Tupoksi (Tugas Pokok & Fungsi)</label>
                    <textarea 
                      value={formData.tupoksi} 
                      onChange={(e) => setFormData({ ...formData, tupoksi: e.target.value })} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-900 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all" 
                      rows="3" 
                      placeholder="Masukkan rincian tupoksi..." 
                    />
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
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data pimpinan</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-slate-200">Unit / Jabatan</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-slate-200">Nama Pimpinan</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-slate-200 text-center">Periode</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-slate-200">Pendidikan Terakhir</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-slate-200">Tupoksi</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider text-center border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr key={item.id_pimpinan} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-4 border-r border-slate-100">
                        <div className="text-sm text-slate-800">{item.nama_unit_display || '-'}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-100">
                        <div className="text-sm text-slate-800">{item.nama_lengkap || '-'}</div>
                        <div className="text-xs text-slate-500 mt-0.5 uppercase font-medium">{item.nama_jafung || 'Non-Jafung'}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-100 text-center">
                        <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-md text-xs tracking-wider">{item.periode_mulai} - {item.periode_selesai}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-100">
                        <div className="text-xs text-slate-600 uppercase tracking-wider">{item.pendidikan_terakhir || '-'}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-100 whitespace-normal min-w-[200px]">
                        <div className="text-sm text-slate-600 line-clamp-2">{item.tupoksi || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          {isTrashMode ? (
                            <>
                              <button onClick={() => handleRestore(item.id_pimpinan)} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title="Restore"><History size={17} /></button>
                              <button onClick={() => handleHardDelete(item.id_pimpinan)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus Permanen"><Trash2 size={17} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={17} /></button>
                              <button onClick={() => handleDelete(item.id_pimpinan)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={17} /></button>
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
