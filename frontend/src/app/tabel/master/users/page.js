'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, RefreshCw, UserCheck, Shield, Key, ToggleLeft, ToggleRight } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function UsersPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [unitList, setUnitList] = useState([]);
  const [openUnit, setOpenUnit] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: 'stikom2026',
    id_unit: '',
    status: 'Aktif',
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
      fetchUnitList();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/unit-kerja', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setUnitList(result.data);
      }
    } catch (err) {
      console.error('Error fetching unit list:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/master/users/${editingId}`
      : 'http://localhost:5000/api/master/users';

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
    setEditingId(item.id_user);
    setFormData({
      username: item.username || '',
      password: '', // Hidden in edit anyway
      id_unit: item.id_unit || '',
      status: item.status || 'Aktif',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Yakin hapus user ini?');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/users/${id}`, {
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

  const toggleStatus = async (item) => {
    const token = localStorage.getItem('token');
    const newStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      const res = await fetch(`http://localhost:5000/api/master/users/${item.id_user}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          username: item.username,
          id_unit: item.id_unit,
          status: newStatus 
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchData();
      }
    } catch (err) {
      showError('Gagal mengubah status');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: 'stikom2026',
      id_unit: '',
      status: 'Aktif',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, answer: '' });
    setShowResetModal(true);
  };

  const handleResetPassword = async () => {
    if (parseInt(captcha.answer) !== (captcha.a + captcha.b)) {
      showInfo('Jawaban Captcha Salah!');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/users/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, password: 'stikom2026' }),
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal');
      } else {
        showSuccess(result.message);
      }
      setShowResetModal(false);
    } catch (err) {
      showError('Gagal mereset password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Master Users</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola hak akses dan akun pengguna sistem</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchData} variant="outline" className="px-3" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah User'}</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-violet-50 group-hover:scale-110 transition-transform duration-500">
              <UserCheck size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-violet-100/80 text-violet-600 rounded-xl border border-violet-200/50 backdrop-blur-sm shrink-0">
                <UserCheck size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 group-hover:scale-110 transition-transform duration-500">
              <Shield size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-emerald-100/80 text-emerald-600 rounded-xl border border-emerald-200/50 backdrop-blur-sm shrink-0">
                <Shield size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Unit Terdaftar</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{new Set(data.map(u => u.id_unit)).size}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 custom-scrollbar rounded-2xl">
              <Card title={editingId ? 'Edit Data User' : 'Input Data User Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0 shadow-2xl border-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input 
                        label="Username"
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        placeholder="Ex: admin_prodi" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Unit Terkait</label>
                      <div className="relative">
                        <div 
                          onClick={() => setOpenUnit(!openUnit)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer flex justify-between items-center transition-all focus:border-violet-300 outline-none"
                        >
                          <span className="truncate">{formData.id_unit ? unitList.find(u => u.id_unit == formData.id_unit)?.nama_unit : '-- Pilih Unit --'}</span>
                          <Plus size={18} className={`shrink-0 transition-transform duration-300 ${openUnit ? 'rotate-0' : 'rotate-45'}`} />
                        </div>
                        {openUnit && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                            {unitList.map(unit => (
                              <div 
                                key={unit.id_unit}
                                onClick={() => {
                                  setFormData({...formData, id_unit: unit.id_unit});
                                  setOpenUnit(false);
                                }}
                                className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0"
                              >
                                {unit.nama_unit}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Password</label>
                      {!editingId ? (
                        <div className="relative group">
                          <input 
                            type="text" 
                            value={formData.password} 
                            readOnly 
                            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-violet-600 cursor-not-allowed select-none text-[0.9rem]" 
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-200/50 px-2 py-1 rounded-md border border-slate-200">Default</div>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={generateCaptcha}
                          className="w-full py-2.5 bg-red-50 border-2 border-red-200 hover:bg-red-100 text-red-600 rounded-xl transition font-black flex items-center justify-center gap-2 group text-[0.9rem]"
                        >
                          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                          RESET PASSWORD KE DEFAULT
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                    <Button type="submit">{editingId ? 'Update Akun' : 'Buat Akun Baru'}</Button>
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
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data user</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-16 border-r border-white/20">No</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Username</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Unit</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center border-r border-white/20">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center  border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item, index) => (
                    <tr key={item.id_user} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="text-sm text-slate-600">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="text-sm text-slate-800 uppercase tracking-tight">{item.username}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                          <span className="text-sm text-slate-700 uppercase tracking-tight">{item.nama_unit || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className={`px-2.5 py-1 rounded-full px-3 text-[0.7rem] uppercase tracking-wider ${item.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => toggleStatus(item)} 
                            className={`p-2 transition rounded-lg ${item.status === 'Aktif' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                            title={item.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                          >
                            {item.status === 'Aktif' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                          <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(item.id_user)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reset Password Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 border border-red-100">
                  <Key size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Konfirmasi Reset</h3>
                <p className="text-slate-500 text-sm mb-8">Password akan dikembalikan ke default: <span className="text-violet-600 font-bold">stikom2026</span></p>
                
                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verifikasi Keamanan (Captcha)</label>
                  <div className="flex items-center justify-center gap-4 text-2xl font-black text-slate-800 mb-4">
                    <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">{captcha.a}</span>
                    <span className="text-violet-500">+</span>
                    <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">{captcha.b}</span>
                    <span className="text-violet-500">=</span>
                  </div>
                  <input 
                    type="number" 
                    value={captcha.answer}
                    onChange={(e) => setCaptcha({...captcha, answer: e.target.value})}
                    placeholder="Hasil?"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 focus:border-violet-500 rounded-xl outline-none text-center font-black text-slate-800 transition"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="ghost" onClick={() => setShowResetModal(false)}>Batal</Button>
                  <Button onClick={handleResetPassword}>Reset Sekarang</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
