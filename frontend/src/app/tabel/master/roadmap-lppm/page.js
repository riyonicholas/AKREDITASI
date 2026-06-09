'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, RefreshCw, Map, Calendar, Link as LinkIcon, GraduationCap, Database } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';

export default function RoadmapPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [openProdi, setOpenProdi] = useState(false);
  const [openTahun, setOpenTahun] = useState(false);

  // Filters
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('all');
  const [filterJenis, setFilterJenis] = useState('all');
  const [openFilterProdi, setOpenFilterProdi] = useState(false);
  const [openFilterTahun, setOpenFilterTahun] = useState(false);
  const [openFilterJenis, setOpenFilterJenis] = useState(false);

  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    jenis_roadmap: 'Penelitian',
    link_dokumen: '',
  });

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
    if (filterProdi && filterTahun) {
      fetchData();
    } else {
      setData([]);
    }
  }, [filterProdi, filterTahun, filterJenis]);

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setProdiList(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        const sortedTahun = (result.data || []).sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
        setTahunList(sortedTahun);
      }
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const jenisParam = filterJenis === 'all' ? '' : `&jenis=${filterJenis}`;
    try {
      const res = await fetch(`http://localhost:5000/api/lppm/roadmap-lppm?id_prodi=${filterProdi}&id_tahun=${filterTahun}${jenisParam}`, {
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
      ? `http://localhost:5000/api/lppm/roadmap-lppm/${editingId}`
      : 'http://localhost:5000/api/lppm/roadmap-lppm';

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
      if (filterProdi && filterTahun) fetchData();
      resetForm();
    } catch (err) {
      showError('Terjadi kesalahan');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_roadmap);
    setFormData({
      id_prodi: item.id_prodi,
      id_tahun: item.id_tahun,
      jenis_roadmap: item.jenis_roadmap,
      link_dokumen: item.link_dokumen,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Pindahkan data ke tempat sampah?');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/lppm/roadmap-lppm/${id}`, {
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
      id_prodi: '',
      id_tahun: '',
      jenis_roadmap: 'Penelitian',
      link_dokumen: '',
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
            
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Master Roadmap LPPM</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Kelola dokumen Roadmap Penelitian dan PkM Program Studi</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Roadmap'}</span>
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card variant="default" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Filter Program Studi</label>
              <div className="relative">
                <div 
                  onClick={() => setOpenFilterProdi(!openFilterProdi)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] flex justify-between items-center transition-all cursor-pointer hover:border-violet-300 text-slate-800"
                >
                  <span className="truncate font-medium">{filterProdi ? prodiList.find(p => p.id_prodi == filterProdi)?.nama_prodi : '-- Pilih Prodi --'}</span>
                  <GraduationCap size={18} className="text-slate-400" />
                </div>
                {openFilterProdi && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[150] max-h-60 overflow-y-auto custom-scrollbar">
                    {prodiList.map(p => (
                      <div key={p.id_prodi} onClick={() => { setFilterProdi(p.id_prodi); setOpenFilterProdi(false); }} className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0">{p.nama_prodi}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Filter Tahun Akademik</label>
              <div className="relative">
                <div 
                  onClick={() => setOpenFilterTahun(!openFilterTahun)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] flex justify-between items-center transition-all cursor-pointer hover:border-violet-300 text-slate-800"
                >
                  <span className="font-medium">{filterTahun === 'all' ? 'Semua Tahun' : filterTahun ? tahunList.find(t => t.id_tahun == filterTahun)?.tahun : '-- Pilih Tahun --'}</span>
                  <Calendar size={18} className="text-slate-400" />
                </div>
                {openFilterTahun && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[150] max-h-60 overflow-y-auto custom-scrollbar">
                    <div 
                      onClick={() => { setFilterTahun('all'); setOpenFilterTahun(false); }} 
                      className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 text-violet-600"
                    >
                      Semua Tahun
                    </div>
                    {tahunList.map(t => (
                      <div key={t.id_tahun} onClick={() => { setFilterTahun(t.id_tahun); setOpenFilterTahun(false); }} className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0">{t.tahun}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-[200px] relative">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Jenis Roadmap</label>
              <div 
                onClick={() => setOpenFilterJenis(!openFilterJenis)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] flex justify-between items-center transition-all cursor-pointer hover:border-violet-300 text-slate-800"
              >
                <span className="font-medium">{filterJenis === 'all' ? 'Semua Jenis' : filterJenis}</span>
                <Database size={18} className="text-slate-400" />
              </div>
              {openFilterJenis && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[150] custom-scrollbar">
                  <div onClick={() => { setFilterJenis('all'); setOpenFilterJenis(false); }} className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 text-violet-600">Semua Jenis</div>
                  <div onClick={() => { setFilterJenis('Penelitian'); setOpenFilterJenis(false); }} className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100">Penelitian</div>
                  <div onClick={() => { setFilterJenis('PkM'); setOpenFilterJenis(false); }} className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium last:border-0">PkM</div>
                </div>
              )}
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
            <Card title={editingId ? 'Edit Data Roadmap' : 'Input Data Roadmap Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Program Studi</label>
                    <div className="relative">
                      <div 
                        onClick={() => setOpenProdi(!openProdi)}
                        className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] flex justify-between items-center transition-all cursor-pointer hover:border-violet-300 text-slate-800 ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="font-medium">{formData.id_prodi ? prodiList.find(p => p.id_prodi == formData.id_prodi)?.nama_prodi : '-- Pilih Prodi --'}</span>
                        <Plus size={18} className={`text-slate-400 transition-transform duration-300 ${openProdi ? 'rotate-0' : 'rotate-45'}`} />
                      </div>
                      {!editingId && openProdi && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar">
                          {prodiList.map(p => (
                            <div key={p.id_prodi} onClick={() => { setFormData({...formData, id_prodi: p.id_prodi}); setOpenProdi(false); }} className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0">{p.nama_prodi}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Tahun Akademik</label>
                    <div className="relative">
                      <div 
                        onClick={() => setOpenTahun(!openTahun)}
                        className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] flex justify-between items-center transition-all cursor-pointer hover:border-violet-300 text-slate-800 ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="font-medium">{formData.id_tahun ? tahunList.find(t => t.id_tahun == formData.id_tahun)?.tahun : '-- Pilih Tahun --'}</span>
                        <Plus size={18} className={`text-slate-400 transition-transform duration-300 ${openTahun ? 'rotate-0' : 'rotate-45'}`} />
                      </div>
                      {!editingId && openTahun && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar">
                          {tahunList.map(t => (
                            <div key={t.id_tahun} onClick={() => { setFormData({...formData, id_tahun: t.id_tahun}); setOpenTahun(false); }} className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0">{t.tahun}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Jenis Roadmap</label>
                    <select 
                      value={formData.jenis_roadmap} 
                      onChange={(e) => setFormData({...formData, jenis_roadmap: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 transition-all focus:border-violet-300 outline-none font-medium cursor-pointer"
                    >
                      <option value="Penelitian">Penelitian</option>
                      <option value="PkM">PkM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 block">Link Dokumen Roadmap</label>
                    <input 
                      type="text" 
                      value={formData.link_dokumen} 
                      onChange={(e) => setFormData({...formData, link_dokumen: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 transition-all focus:border-violet-300 outline-none font-medium" 
                      placeholder="Contoh: https://link-dokumen.com/roadmap.pdf" 
                      required 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Tambah Roadmap'}</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Table Section */}
        <Card variant="default" className="!p-0 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-violet-500" size={48} />
              <p className="text-base font-medium tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : !filterProdi || !filterTahun ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <Map className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-bold text-lg tracking-tight max-w-sm">Pilih Prodi dan Tahun di filter atas untuk melihat Roadmap LPPM</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data roadmap untuk kriteria ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-16 border-r border-white/20">No</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Jenis Roadmap</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center border-r border-white/20">Tahun</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest border-r border-white/20">Link Dokumen</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-widest text-center w-32  border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item, index) => (
                    <tr key={item.id_roadmap} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200">
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="text-sm text-slate-600">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg ${item.jenis_roadmap === 'Penelitian' ? 'bg-blue-50 text-blue-500' : item.jenis_roadmap === 'PkM' ? 'bg-emerald-50 text-emerald-500' : 'bg-violet-50 text-violet-500'}`}>
                            <Map size={18} />
                          </div>
                          <span className="text-[0.95rem] text-slate-700 group-hover:text-violet-600 transition-colors uppercase tracking-wide">{item.jenis_roadmap}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-200">
                        <span className="text-sm text-slate-600">{tahunList.find(t => t.id_tahun == item.id_tahun)?.tahun || item.id_tahun}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <a href={item.link_dokumen} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-500 transition-colors text-sm truncate max-w-[200px]">
                          <LinkIcon size={14} />
                          Buka Dokumen
                        </a>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="flex justify-center">
                          <div className="inline-flex items-center bg-white border border-slate-200 p-1 rounded-lg shadow-sm transition-all group-hover:border-violet-200 group-hover:shadow-md">
                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition" title="Edit"><Edit size={14} /></button>
                            <div className="w-px h-3 bg-slate-200 mx-1"></div>
                            <button onClick={() => handleDelete(item.id_roadmap)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition" title="Hapus"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
