'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, Briefcase, UserCheck, Settings } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function TendikPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [jenisSelection, setJenisSelection] = useState('Administrasi');
  
  const [formData, setFormData] = useState({
    id_pegawai: '',
    jenis_tendik: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
      fetchPegawaiList();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tendik', {
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
      ? `http://localhost:5000/api/master/tendik/${editingId}`
      : 'http://localhost:5000/api/master/tendik';

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
        showError(result.message || 'Gagal');
      } else {
        showSuccess(result.message);
      }
      fetchData();
      resetForm();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_tendik);
    setFormData({
      id_pegawai: item.id_pegawai || '',
      jenis_tendik: item.jenis_tendik || '',
    });
    const defaults = ['Pustakawan', 'Laboran/Teknisi', 'Administrasi'];
    setJenisSelection(defaults.includes(item.jenis_tendik) ? item.jenis_tendik : 'Lainnya');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Yakin hapus data ini?');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/tendik/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal');
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
      id_pegawai: '',
      jenis_tendik: '',
    });
    setJenisSelection('Administrasi');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Master Data - Tendik</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola database tenaga kependidikan</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchData} variant="outline" className="px-3" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Tendik'}</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-violet-50 group-hover:scale-110 transition-transform duration-500">
              <Briefcase size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-violet-100/80 text-violet-600 rounded-xl border border-violet-200/50 backdrop-blur-sm shrink-0">
                <Briefcase size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tendik</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 group-hover:scale-110 transition-transform duration-500">
              <UserCheck size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-blue-100/80 text-blue-600 rounded-xl border border-blue-200/50 backdrop-blur-sm shrink-0">
                <UserCheck size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">Aktif</p>
              </div>
            </div>
          </Card>
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 group-hover:scale-110 transition-transform duration-500">
              <Settings size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-emerald-100/80 text-emerald-600 rounded-xl border border-emerald-200/50 backdrop-blur-sm shrink-0">
                <Settings size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Sistem</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">Stabil</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Data Tendik' : 'Input Tendik Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Pilih Pegawai</label>
                    <select 
                      value={formData.id_pegawai} 
                      onChange={(e) => setFormData({...formData, id_pegawai: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer transition-all focus:border-violet-300 outline-none" 
                      required
                    >
                      <option value="">-- Pilih Pegawai --</option>
                      {pegawaiList.map(pegawai => (
                        <option key={pegawai.id_pegawai} value={pegawai.id_pegawai}>{pegawai.nama_lengkap} - {pegawai.nikp}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Jenis Tenaga Kependidikan</label>
                    <select 
                      value={jenisSelection} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setJenisSelection(val);
                        if (val !== 'Lainnya') {
                          setFormData({...formData, jenis_tendik: val});
                        } else {
                          setFormData({...formData, jenis_tendik: ''});
                        }
                      }} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer transition-all focus:border-violet-300 outline-none mb-3"
                    >
                      <option value="Administrasi">Administrasi</option>
                      <option value="Pustakawan">Pustakawan</option>
                      <option value="Laboran/Teknisi">Laboran/Teknisi</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    
                    {jenisSelection === 'Lainnya' && (
                      <Input 
                        value={formData.jenis_tendik} 
                        onChange={(e) => setFormData({...formData, jenis_tendik: e.target.value})} 
                        className="animate-in slide-in-from-top-2" 
                        placeholder="Masukkan Jenis Tendik"
                        required
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  <Button type="submit">{editingId ? 'Update Tendik' : 'Simpan Tendik'}</Button>
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
              <p className="text-base font-medium tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data tendik</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-16 border-r border-white/20">No</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Nama Tenaga Kependidikan</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center border-r border-white/20">Jenis Tendik</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center  border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item, index) => (
                    <tr key={item.id_tendik} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="text-sm text-slate-600">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="text-[0.95rem] text-slate-900">{item.nama_lengkap || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full px-3 text-[0.7rem] uppercase tracking-wider">{item.jenis_tendik || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(item.id_tendik)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={18} /></button>
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
