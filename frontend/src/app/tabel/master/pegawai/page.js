'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, Briefcase, UserPlus, Users } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function PegawaiPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [jabatanList, setJabatanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openUnit, setOpenUnit] = useState(false);
  const [openJabatan, setOpenJabatan] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nikp: '',
    id_unit: '',
    id_jabatan_struktural: '',
    pendidikan_terakhir: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
      fetchUnitList();
      fetchJabatanList();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/pegawai', {
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

  const fetchJabatanList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/jabatan-struktural', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setJabatanList(result.data);
      }
    } catch (err) {
      console.error('Error fetching jabatan list:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/master/pegawai/${editingId}`
      : 'http://localhost:5000/api/master/pegawai';

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
    setEditingId(item.id_pegawai);
    setFormData({
      nama_lengkap: item.nama_lengkap || '',
      nikp: item.nikp || '',
      id_unit: item.id_unit || '',
      id_jabatan_struktural: item.id_jabatan_struktural || '',
      pendidikan_terakhir: item.pendidikan_terakhir || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus data ini?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/pegawai/${id}`, {
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
      nama_lengkap: '',
      nikp: '',
      id_unit: '',
      id_jabatan_struktural: '',
      pendidikan_terakhir: '',
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

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Master Data - Pegawai</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola database pegawai universitas dengan mudah</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchData} variant="outline" className="px-3" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Pegawai'}</span>
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
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pegawai</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="default" className="relative overflow-hidden group !p-5 border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 group-hover:scale-110 transition-transform duration-500">
              <UserPlus size={80} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-blue-100/80 text-blue-600 rounded-xl border border-blue-200/50 backdrop-blur-sm shrink-0">
                <UserPlus size={22} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Unit Kerja</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{unitList.length}</p>
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
                <p className="text-[0.85rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Aktif</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{data.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={editingId ? 'Edit Data Pegawai' : 'Input Data Pegawai Baru'} icon={<Plus className="text-violet-500" size={20} />} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Nama Lengkap"
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                      required
                      placeholder="Nama Lengkap dengan Gelar"
                    />
                  </div>
                  <div>
                    <Input
                      label="NIKP"
                      value={formData.nikp}
                      onChange={(e) => setFormData({ ...formData, nikp: e.target.value })}
                      placeholder="Nomor Induk Karyawan/Pegawai"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Unit Kerja</label>
                    <div className="relative">
                      <div
                        onClick={() => setOpenUnit(!openUnit)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer flex justify-between items-center transition-all hover:border-violet-300"
                      >
                        <span className="truncate">{formData.id_unit ? unitList.find(u => u.id_unit == formData.id_unit)?.nama_unit : 'Pilih Unit Kerja'}</span>
                        <Plus size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openUnit ? 'rotate-0' : 'rotate-45'}`} />
                      </div>
                      {openUnit && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                          {unitList.map(unit => (
                            <div
                              key={unit.id_unit}
                              onClick={() => {
                                setFormData({ ...formData, id_unit: unit.id_unit });
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
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Jabatan Struktural</label>
                    <div className="relative">
                      <div
                        onClick={() => setOpenJabatan(!openJabatan)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer flex justify-between items-center transition-all hover:border-violet-300"
                      >
                        <span className="truncate">{formData.id_jabatan_struktural ? jabatanList.find(j => j.id_jabatan_struktural == formData.id_jabatan_struktural)?.nama_jabatan : 'Pilih Jabatan Struktural'}</span>
                        <Plus size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openJabatan ? 'rotate-0' : 'rotate-45'}`} />
                      </div>
                      {openJabatan && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                          {jabatanList.map(jabatan => (
                            <div
                              key={jabatan.id_jabatan_struktural}
                              onClick={() => {
                                setFormData({ ...formData, id_jabatan_struktural: jabatan.id_jabatan_struktural });
                                setOpenJabatan(false);
                              }}
                              className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0"
                            >
                              {jabatan.nama_jabatan}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Input
                      label="Pendidikan Terakhir"
                      value={formData.pendidikan_terakhir}
                      onChange={(e) => setFormData({ ...formData, pendidikan_terakhir: e.target.value })}
                      placeholder="Contoh: S2 Teknik Informatika"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  <Button type="submit">{editingId ? 'Update Pegawai' : 'Simpan Pegawai'}</Button>
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
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data pegawai</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-16 border-r border-white/20">No</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Nama Pegawai</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">NIKP</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Unit / Jabatan</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center border-r border-white/20">Pendidikan</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center  border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item, index) => (
                    <tr key={item.id_pegawai} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="text-sm text-slate-600">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="text-[0.95rem] text-slate-900">{item.nama_lengkap || '-'}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <span className="text-sm text-slate-700">{item.nikp || '-'}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="text-sm text-slate-800 uppercase tracking-tight">{item.nama_unit || '-'}</div>
                        <div className="text-sm text-slate-800 mt-1">{item.nama_jabatan || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full px-3 text-[0.7rem] uppercase tracking-wider">{item.pendidikan_terakhir || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(item.id_pegawai)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={18} /></button>
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
