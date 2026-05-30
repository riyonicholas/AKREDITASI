'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, BookOpen, GraduationCap, Layers, Hash, Type, Lock } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function MataKuliahPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [prodiList, setProdiList] = useState([]);
  const [openProdi, setOpenProdi] = useState(false);
  const [user, setUser] = useState(null);

  // Filters
  const [filterProdi, setFilterProdi] = useState('');
  const [openFilterProdi, setOpenFilterProdi] = useState(false);

  const [formData, setFormData] = useState({
    id_prodi: '',
    kode_mk: '',
    nama_mk: '',
    sks: '',
    semester: '',
  });

  const checkProdiRole = (currentUser) => {
    if (!currentUser) return null;
    const username = (currentUser.username || '').toUpperCase();
    const unit = (currentUser.unit || '').toUpperCase();
    
    if (username.includes('PRODI-TI') || unit.includes('PRODI-TI') || username.includes('PRODITI') || unit.includes('PRODITI') || username === 'TI' || unit === 'TI') {
      return 'TI'; // Teknik Informatika
    }
    if (username.includes('PRODI-MI') || unit.includes('PRODI-MI') || username.includes('PRODIMI') || unit.includes('PRODIMI') || username === 'MI' || unit === 'MI') {
      return 'MI'; // Manajemen Informatika
    }
    return null;
  };

  const prodiRole = checkProdiRole(user);
  const isLocked = prodiRole === 'TI' || prodiRole === 'MI';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      router.push('/login');
    } else {
      let currentUser = null;
      if (userData) {
        currentUser = JSON.parse(userData);
        setUser(currentUser);
      }
      fetchProdiList(currentUser);
    }
  }, [router]);

  useEffect(() => {
    if (filterProdi) {
      fetchData();
    } else {
      setData([]);
    }
  }, [filterProdi]);

  const fetchProdiList = async (currentUser) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setProdiList(result.data);
        if (result.data.length > 0) {
          const prodiRole = checkProdiRole(currentUser);
          if (prodiRole === 'TI') {
            const tiProdi = result.data.find(p => p.nama_prodi.toUpperCase().includes('TEKNIK INFORMATIKA') || p.nama_prodi.toUpperCase().includes('INFORMATIKA'));
            if (tiProdi) {
              setFilterProdi(tiProdi.id_prodi);
              return;
            }
          } else if (prodiRole === 'MI') {
            const miProdi = result.data.find(p => p.nama_prodi.toUpperCase().includes('MANAJEMEN INFORMATIKA') || p.nama_prodi.toUpperCase().includes('MANAJEMEN'));
            if (miProdi) {
              setFilterProdi(miProdi.id_prodi);
              return;
            }
          }
          // Default fallback
          setFilterProdi(result.data[0].id_prodi);
        }
      }
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/mata-kuliah?id_prodi=${filterProdi}`, {
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
      ? `http://localhost:5000/api/master/mata-kuliah/${editingId}`
      : 'http://localhost:5000/api/master/mata-kuliah';

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
      alert(result.message);
      if (filterProdi) fetchData();
      resetForm();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_mk);
    setFormData({
      id_prodi: item.id_prodi,
      kode_mk: item.kode_mk,
      nama_mk: item.nama_mk,
      sks: item.sks,
      semester: item.semester,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini secara permanen?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/mata-kuliah/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '',
      kode_mk: '',
      nama_mk: '',
      sks: '',
      semester: '',
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
            
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Master Mata Kuliah</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola daftar mata kuliah kurikulum Program Studi</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Mata Kuliah'}</span>
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card variant="default" className="mb-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 min-w-[300px]">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Filter Program Studi</label>
              <div className="relative">
                <div 
                  onClick={() => !isLocked && setOpenFilterProdi(!openFilterProdi)}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] flex justify-between items-center transition-all ${
                    isLocked 
                      ? 'bg-slate-100 cursor-not-allowed opacity-75 text-slate-500' 
                      : 'cursor-pointer hover:border-violet-300 text-slate-800'
                  }`}
                >
                  <span className="truncate font-medium">{filterProdi ? prodiList.find(p => p.id_prodi == filterProdi)?.nama_prodi : '-- Pilih Prodi --'}</span>
                  {isLocked ? (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 text-[0.65rem] uppercase tracking-wider">
                      <Lock size={10} />
                      Readonly
                    </div>
                  ) : (
                    <GraduationCap size={18} className="text-slate-400" />
                  )}
                </div>
                {openFilterProdi && !isLocked && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[150] max-h-60 overflow-y-auto custom-scrollbar">
                    {prodiList.map(p => (
                      <div key={p.id_prodi} onClick={() => { setFilterProdi(p.id_prodi); setOpenFilterProdi(false); }} className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0">{p.nama_prodi}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center h-full pb-2 md:pb-3">
              {loading && (
                <div className="flex items-center gap-2 text-violet-500 font-bold animate-pulse">
                  <RefreshCw size={18} className="animate-spin" />
                  <span className="text-[0.85rem] uppercase tracking-widest">Updating...</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Data Mata Kuliah' : 'Input Data Mata Kuliah Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Program Studi</label>
                    <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold flex items-center cursor-not-allowed select-none text-[0.9rem]">
                      {prodiList.find(p => p.id_prodi == formData.id_prodi)?.nama_prodi || '-- Pilih Prodi --'}
                    </div>
                    <p className="text-[0.85rem] text-slate-400 mt-2 italic font-medium">* Otomatis mengikuti filter prodi yang aktif</p>
                  </div>
                  <div>
                    <Input 
                      label="Kode Mata Kuliah"
                      icon={<Hash size={18} className="text-slate-400" />}
                      value={formData.kode_mk} 
                      onChange={(e) => setFormData({...formData, kode_mk: e.target.value})} 
                      placeholder="Contoh: MK001" 
                      required 
                    />
                  </div>
                  <div>
                    <Input 
                      label="Nama Mata Kuliah"
                      icon={<Type size={18} className="text-slate-400" />}
                      value={formData.nama_mk} 
                      onChange={(e) => setFormData({...formData, nama_mk: e.target.value})} 
                      placeholder="Nama Mata Kuliah" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input 
                        type="number"
                        label="SKS"
                        value={formData.sks} 
                        onChange={(e) => setFormData({...formData, sks: e.target.value})} 
                        placeholder="2" 
                        required 
                      />
                    </div>
                    <div>
                      <Input 
                        type="number"
                        label="Semester"
                        value={formData.semester} 
                        onChange={(e) => setFormData({...formData, semester: e.target.value})} 
                        placeholder="1" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Tambah Mata Kuliah'}</Button>
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
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <BookOpen className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data mata kuliah untuk prodi ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-16 border-r border-white/20">No</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest w-32 text-center border-r border-white/20">Kode MK</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Nama Mata Kuliah</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-24 border-r border-white/20">SKS</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-24 border-r border-white/20">Semester</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-32  border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item, index) => (
                    <tr key={item.id_mk} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="text-sm text-slate-600">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-violet-600 text-[0.95rem] tracking-wider border-r border-slate-200">{item.kode_mk}</td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="text-[0.95rem] text-slate-900">{item.nama_mk}</div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[0.75rem] text-slate-600">{item.sks} SKS</span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <div className="flex items-center justify-center gap-2">
                           <Layers size={14} className="text-slate-400" />
                           <span className="text-sm text-slate-700">Smt {item.semester}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(item.id_mk)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={18} /></button>
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
