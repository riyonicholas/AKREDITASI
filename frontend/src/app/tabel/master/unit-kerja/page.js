'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, RefreshCw, Building } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function UnitKerjaPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_unit: '',
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
      const res = await fetch('http://localhost:5000/api/master/unit-kerja', {
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
      ? `http://localhost:5000/api/master/unit-kerja/${editingId}`
      : `http://localhost:5000/api/master/unit-kerja`;

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
      showError('Terjadi kesalahan koneksi');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_unit);
    setFormData({
      nama_unit: item.nama_unit || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Hapus permanen unit kerja ini?');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/unit-kerja/${id}`, {
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
      nama_unit: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Master Data - Unit Kerja</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola daftar unit kerja dan fakultas di universitas</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchData} variant="outline" className="px-3" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Unit Kerja'}</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-violet-50 group-hover:scale-110 transition-transform duration-500">
              <Building size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-violet-100/80 text-violet-600 rounded-xl border border-violet-200/50 backdrop-blur-sm shrink-0">
                <Building size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Unit Kerja</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg animate-in zoom-in-95 duration-200">
              <Card title={editingId ? 'Edit Data Unit Kerja' : 'Input Unit Kerja Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0 shadow-2xl border-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Input 
                        label="Nama Unit Kerja / Fakultas"
                        value={formData.nama_unit} 
                        onChange={(e) => setFormData({...formData, nama_unit: e.target.value})} 
                        required 
                        placeholder="Contoh: Fakultas Teknik / Biro Administrasi Akademik" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                    <Button type="submit">{editingId ? 'Update Unit Kerja' : 'Simpan Unit Kerja'}</Button>
                  </div>
                </form>
              </Card>
            </div>
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
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data unit kerja</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                    <th className="px-6 py-5 text-center w-16 border-r border-white/20">No</th>
                    <th className="px-6 py-5 border-r border-white/20">Nama Unit Kerja</th>
                    <th className="px-6 py-5 text-center border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item, index) => (
                    <tr key={item.id_unit} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="text-sm font-bold text-slate-600">{index + 1}</span>
                      </td>
                      <td className="px-6 py-5 border-r border-slate-200">
                        <div className="text-sm font-bold text-slate-900 tracking-tight">{item.nama_unit || '-'}</div>
                      </td>
                      <td className="px-6 py-5 text-center border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(item.id_unit)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={18} /></button>
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
