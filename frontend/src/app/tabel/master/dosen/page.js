'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, UserCheck, GraduationCap, Users } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function DosenPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [ptSelection, setPtSelection] = useState('STIKOM PGRI BANYUWANGI');
  
  const [pegawaiList, setPegawaiList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const jafungList = [
    { id: 1, name: 'Lektor Kepala' },
    { id: 2, name: 'Lektor' },
    { id: 3, name: 'Asisten Ahli' },
    { id: 4, name: 'Tenaga Ahli' },
  ];

  const [formData, setFormData] = useState({
    id_pegawai: '',
    nidn: '',
    nuptk: '',
    id_prodi: '',
    perguruan_tinggi: 'STIKOM PGRI BANYUWANGI',
    id_jabatan_fungsional: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
      fetchMasterData();
    }
  }, [router]);

  const fetchMasterData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [pegRes, prodiRes] = await Promise.all([
        fetch('http://localhost:5000/api/master/pegawai', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      const pegResult = await pegRes.json();
      const prodiResult = await prodiRes.json();
      if (pegResult.success) setPegawaiList(pegResult.data);
      if (prodiResult.success) setProdiList(prodiResult.data);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/dosen', {
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
      ? `http://localhost:5000/api/master/dosen/${editingId}`
      : 'http://localhost:5000/api/master/dosen';

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
      fetchData();
      resetForm();
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_dosen);
    setFormData({
      id_pegawai: item.id_pegawai || '',
      nidn: item.nidn || '',
      nuptk: item.nuptk || '',
      id_prodi: item.id_prodi || '',
      perguruan_tinggi: item.perguruan_tinggi || 'STIKOM PGRI BANYUWANGI',
      id_jabatan_fungsional: item.id_jabatan_fungsional || '',
    });
    const pt = item.perguruan_tinggi || 'STIKOM PGRI BANYUWANGI';
    setPtSelection(pt === 'STIKOM PGRI BANYUWANGI' ? pt : 'Lainnya');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data dosen ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/dosen/${id}`, {
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
      id_pegawai: '',
      nidn: '',
      nuptk: '',
      id_prodi: '',
      perguruan_tinggi: 'STIKOM PGRI BANYUWANGI',
      id_jabatan_fungsional: '',
    });
    setPtSelection('STIKOM PGRI BANYUWANGI');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Master Data - Dosen</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola database dosen universitas dengan mudah</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchData} variant="outline" className="px-3" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Dosen'}</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
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
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Dosen</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-blue-100/80 text-blue-600 rounded-xl border border-blue-200/50 backdrop-blur-sm shrink-0">
                <GraduationCap size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Lektor Kepala</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.filter(d => d.nama_jafung === 'Lektor Kepala').length}</p>
              </div>
            </div>
          </Card>
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 group-hover:scale-110 transition-transform duration-500">
              <Users size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-emerald-100/80 text-emerald-600 rounded-xl border border-emerald-200/50 backdrop-blur-sm shrink-0">
                <Users size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Dosen TI</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.filter(d => d.nama_prodi?.includes('Teknik Informatika')).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Data Dosen' : 'Input Data Dosen Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
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
                      {pegawaiList.map(p => (
                        <option key={p.id_pegawai} value={p.id_pegawai}>{p.nama_lengkap} ({p.nikp})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Pilih Prodi</label>
                    <select 
                      value={formData.id_prodi} 
                      onChange={(e) => setFormData({...formData, id_prodi: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer transition-all focus:border-violet-300 outline-none"
                      required
                    >
                      <option value="">-- Pilih Program Studi --</option>
                      {prodiList.map(p => (
                        <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Input 
                      label="NIDN"
                      value={formData.nidn} 
                      onChange={(e) => setFormData({...formData, nidn: e.target.value})} 
                      placeholder="Nomor Induk Dosen Nasional" 
                    />
                  </div>
                  <div>
                    <Input 
                      label="NUPTK"
                      value={formData.nuptk} 
                      onChange={(e) => setFormData({...formData, nuptk: e.target.value})} 
                      placeholder="NUPTK (Jika ada)" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Jabatan Fungsional</label>
                    <select 
                      value={formData.id_jabatan_fungsional} 
                      onChange={(e) => setFormData({...formData, id_jabatan_fungsional: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer transition-all focus:border-violet-300 outline-none"
                    >
                      <option value="">-- Pilih Jafung --</option>
                      {jafungList.map(j => (
                        <option key={j.id} value={j.id}>{j.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Perguruan Tinggi</label>
                    <select 
                      value={ptSelection} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setPtSelection(val);
                        if (val !== 'Lainnya') {
                          setFormData({...formData, perguruan_tinggi: val});
                        } else {
                          setFormData({...formData, perguruan_tinggi: ''});
                        }
                      }} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer transition-all focus:border-violet-300 outline-none mb-3"
                    >
                      <option value="STIKOM PGRI BANYUWANGI">STIKOM PGRI BANYUWANGI</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    
                    {ptSelection === 'Lainnya' && (
                      <Input 
                        value={formData.perguruan_tinggi} 
                        onChange={(e) => setFormData({...formData, perguruan_tinggi: e.target.value})} 
                        className="animate-in slide-in-from-top-2" 
                        placeholder="Masukkan Nama Perguruan Tinggi"
                        required
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  <Button type="submit">{editingId ? 'Update Dosen' : 'Simpan Dosen'}</Button>
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
              <p className="text-base font-medium tracking-tight">Menyinkronkan database...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data dosen</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Nama Dosen / Universitas</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Identitas (NIDN/NUPTK)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center border-r border-white/20">Program Studi</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Jabatan Fungsional</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center  border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item) => (
                    <tr key={item.id_dosen} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="text-[0.95rem] text-slate-900">{item.nama_lengkap}</div>
                        <div className="text-[0.85rem] text-slate-500 mt-1 uppercase tracking-wider font-medium">{item.perguruan_tinggi}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-slate-800">NIDN: {item.nidn || '-'}</span>
                          <span className="text-sm text-slate-700">NUPTK: {item.nuptk || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full px-3 text-[0.7rem] uppercase tracking-wider">{item.nama_prodi || '-'}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="text-[0.95rem] text-slate-700">{item.nama_jafung || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(item.id_dosen)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={18} /></button>
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
