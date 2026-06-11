'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, BookOpen, UserCheck, History, ExternalLink,  } from 'lucide-react';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';
export default function PengembanganPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterIdTahun, setFilterIdTahun] = useState('');
  const [filterIdProdi, setFilterIdProdi] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});
  
  const [prodiList, setProdiList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [openDosen, setOpenDosen] = useState(false);
  const [openTahun, setOpenTahun] = useState(false);
  
  const [formData, setFormData] = useState({
    id_dosen: '',
    id_tahun: '',
    jenis_pengembangan: '',
    nama_pengembangan: '',
    link_bukti: '',
  });

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      loadInitialData();
    }
  }, [router]);

  useEffect(() => {
    if (filterIdTahun) {
      fetchData();
    }
  }, [filterIdTahun, filterIdProdi]);

  const loadInitialData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [prodiRes, tahunRes, dosenRes] = await Promise.all([
        fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/master/dosen', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      const prodiResult = await prodiRes.json();
      const tahunResult = await tahunRes.json();
      const dosenResult = await dosenRes.json();
      
      if (prodiResult.success) {
        setProdiList(prodiResult.data);
        const savedProdi = localStorage.getItem('pengembangan_filterProdi');
        if (savedProdi && prodiResult.data.some(p => p.id_prodi.toString() === savedProdi)) {
          setFilterIdProdi(savedProdi);
        } else {
          const defaultProdi = prodiResult.data.find(p => p.nama_prodi.includes('Teknik Informatika'));
          if (defaultProdi) {
            setFilterIdProdi(defaultProdi.id_prodi.toString());
            localStorage.setItem('pengembangan_filterProdi', defaultProdi.id_prodi.toString());
          }
        }
      }
      if (tahunResult.success) {
        const sortedTahun = (tahunResult.data || []).sort((a, b) => (parseInt(a.tahun) || 0) - (parseInt(b.tahun) || 0));
        setTahunList(sortedTahun);
        const savedTahun = localStorage.getItem('pengembangan_filterTahun');
        if (savedTahun && sortedTahun.some(t => t.id_tahun.toString() === savedTahun)) {
          setFilterIdTahun(savedTahun);
        } else {
          const activeTahun = sortedTahun.find(t => t.is_active === 1);
          if (activeTahun) {
            setFilterIdTahun(activeTahun.id_tahun.toString());
            localStorage.setItem('pengembangan_filterTahun', activeTahun.id_tahun.toString());
          } else if (sortedTahun.length > 0) {
            setFilterIdTahun(sortedTahun[0].id_tahun.toString());
            localStorage.setItem('pengembangan_filterTahun', sortedTahun[0].id_tahun.toString());
          }
        }
      }
      if (dosenResult.success) setDosenList(dosenResult.data);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseUrl = 'http://localhost:5000/api/upps/3a3-pengembangan';
      const params = `?id_tahun=${filterIdTahun}${filterIdProdi ? `&id_prodi=${filterIdProdi}` : ''}`;
      
      const [activeRes, trashRes] = await Promise.all([
        fetch(`${baseUrl}${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/trash${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      
      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();
      
      if (activeResult.success) {
        setActiveData(activeResult.data || []);
        const statMap = {};
        if (activeResult.stats) {
          activeResult.stats.forEach(s => statMap[s.id_tahun] = s.jumlah_dosen);
        }
        setStats(statMap);
      }
      if (trashResult.success) setTrashData(trashResult.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/api/upps/3a3-pengembangan/${editingId}`
      : 'http://localhost:5000/api/upps/3a3-pengembangan';

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
      showError('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_pengembangan);
    setFormData({
      id_dosen: item.id_dosen || '',
      id_tahun: item.id_tahun || '',
      jenis_pengembangan: item.jenis_pengembangan || '',
      nama_pengembangan: item.nama_pengembangan || '',
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    const isConfirmed = await showConfirm('Yakin hapus data ini? Data akan dipindahkan ke Sampah.');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/3a3-pengembangan/${id}`, {
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

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/3a3-pengembangan/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal memulihkan data');
      } else {
        showSuccess(result.message);
      }
      fetchData();
    } catch (err) {
      showError('Terjadi kesalahan koneksi');
    }
  };

  const handleHardDelete = async (id) => {
    const isConfirmed = await showConfirm('Hapus permanen? Data tidak dapat dikembalikan.');
    if (!isConfirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/upps/3a3-pengembangan/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success === false || res.status >= 400) {
        showError(result.message || 'Gagal menghapus permanen');
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
      id_dosen: '',
      id_tahun: filterIdTahun,
      jenis_pengembangan: '',
      nama_pengembangan: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/upps/3a3-pengembangan/export?id_tahun=${filterIdTahun}${filterIdProdi ? `&id_prodi=${filterIdProdi}` : ''}&token=${token}`, '_blank');
  };

  const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterIdTahun);
  const currentTSYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) : 0;

  const tsMinus1Obj = tahunList.find(t => parseInt(t.tahun) === currentTSYear - 1);
  const tsMinus2Obj = tahunList.find(t => parseInt(t.tahun) === currentTSYear - 2);
  
  const statTS = stats[filterIdTahun] || 0;
  const statTS1 = tsMinus1Obj ? (stats[tsMinus1Obj.id_tahun] || 0) : 0;
  const statTS2 = tsMinus2Obj ? (stats[tsMinus2Obj.id_tahun] || 0) : 0;

  const pivotedDataInfo = useMemo(() => {
    const dataToProcess = activeData || [];
    if (dataToProcess.length === 0) return { data: [], ts: currentTSYear };
    const ts = currentTSYear;
    const pivot = {};
    dataToProcess.forEach(item => {
      const lecturer = item.nama_dtpr || '-';
      const jenis = item.jenis_pengembangan || '-';
      const key = `${lecturer}_${jenis}`;
      if (!pivot[key]) {
        pivot[key] = {
          id_dosen: item.id_dosen,
          nama_dtpr: lecturer,
          jenis_pengembangan: jenis,
          ts2: 0, ts1: 0, ts: 0,
          link_bukti: item.link_bukti,
          raw: []
        };
      }
      const itemTahunObj = tahunList.find(t => t.id_tahun === item.id_tahun);
      const itemYear = itemTahunObj ? parseInt(itemTahunObj.tahun) : 0;
      if (itemYear === ts) pivot[key].ts += 1;
      else if (itemYear === ts - 1) pivot[key].ts1 += 1;
      else if (itemYear === ts - 2) pivot[key].ts2 += 1;
      pivot[key].raw.push(item);
    });
    return { data: Object.values(pivot), ts };
  }, [activeData, currentTSYear, tahunList]);

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Pengembangan DTPR (3.A.3)</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Monitoring pengembangan DTPR di bidang penelitian & pendidikan</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus size={18} />
              <span>{showForm ? 'Tutup Form' : 'Tambah Pengembangan'}</span>
            </Button>
            <Button onClick={handleExport} variant="success">
              <Download size={18} />
              <span>Export Excel</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium text-sm">
            {error}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <BookOpen size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Kegiatan</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Total</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-violet-600 shrink-0">
                  <UserCheck size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Dosen DTPR</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Dosen</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{statTS}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <div className="w-full sm:w-[280px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Prodi</label>
              <div className="relative">
                <select value={filterIdProdi} onChange={(e) => {
                  setFilterIdProdi(e.target.value);
                  localStorage.setItem('pengembangan_filterProdi', e.target.value);
                }} className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300">
                  {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                  <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-[280px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Tahun (TS)</label>
              <div className="relative">
                <select value={filterIdTahun} onChange={(e) => {
                  setFilterIdTahun(e.target.value);
                  localStorage.setItem('pengembangan_filterTahun', e.target.value);
                }} className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300">
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
            <Button onClick={() => setShowTrash(!showTrash)} variant={showTrash ? 'primary' : 'outline'} className="h-[44px] shrink-0">
              {showTrash ? 'Lihat Aktif' : 'Lihat Sampah'}
            </Button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 custom-scrollbar rounded-2xl">
              <Card title={editingId ? 'Edit Pengembangan' : 'Input Pengembangan Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0 shadow-2xl border-0 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Pilih Dosen</label>
                    <div className="relative">
                      <div 
                        onClick={() => setOpenDosen(!openDosen)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer flex justify-between items-center transition-all hover:border-violet-300"
                      >
                        <span className="truncate">{formData.id_dosen ? dosenList.find(d => String(d.id_dosen) === String(formData.id_dosen))?.nama_lengkap : '-- Pilih Dosen --'}</span>
                        <Plus size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openDosen ? 'rotate-0' : 'rotate-45'}`} />
                      </div>
                      {openDosen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                          {dosenList.map(d => (
                            <div 
                              key={d.id_dosen}
                              onClick={() => {
                                setFormData({...formData, id_dosen: String(d.id_dosen)});
                                setOpenDosen(false);
                              }}
                              className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0"
                            >
                              {d.nama_lengkap}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Tahun Akademik</label>
                    <div className="relative">
                      <div 
                        onClick={() => setOpenTahun(!openTahun)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-[0.9rem] text-slate-800 cursor-pointer flex justify-between items-center transition-all hover:border-violet-300"
                      >
                        <span className="truncate">{formData.id_tahun ? tahunList.find(t => String(t.id_tahun) === String(formData.id_tahun))?.tahun : '-- Pilih Tahun --'}</span>
                        <Plus size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openTahun ? 'rotate-0' : 'rotate-45'}`} />
                      </div>
                      {openTahun && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                          {tahunList.map(t => (
                            <div 
                              key={t.id_tahun}
                              onClick={() => {
                                setFormData({...formData, id_tahun: String(t.id_tahun)});
                                setOpenTahun(false);
                              }}
                              className="px-4 py-2.5 hover:bg-violet-50 hover:text-violet-700 transition cursor-pointer text-[0.875rem] font-medium border-b border-slate-100 last:border-0"
                            >
                              {t.tahun}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Input label="Jenis Pengembangan" value={formData.jenis_pengembangan} onChange={(e) => setFormData({...formData, jenis_pengembangan: e.target.value})} placeholder="Contoh: Tugas Belajar, Sertifikasi, Pelatihan Riset" required />
                  </div>
                  <div className="md:col-span-2">
                    <Input label="Nama Kegiatan / Instansi" value={formData.nama_pengembangan} onChange={(e) => setFormData({...formData, nama_pengembangan: e.target.value})} placeholder="Contoh: S3 Ilmu Komputer - Universitas Indonesia" required />
                  </div>
                  <div className="md:col-span-2">
                    <Input type="url" label="Link Bukti (Sertifikat / SK)" value={formData.link_bukti} onChange={(e) => setFormData({...formData, link_bukti: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
                  <Button type="submit">{editingId ? 'Update Data' : 'Simpan Data'}</Button>
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
              <p className="text-sm tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : (showTrash ? trashData : pivotedDataInfo.data).length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-lg tracking-tight">Belum ada data pengembangan DTPR</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  {showTrash ? (
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-slate-200">Dosen DTPR</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-slate-200">Pengembangan</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-slate-200 text-center">Tahun</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider text-center border-r border-white/20">Aksi</th>
                    </tr>
                  ) : (
                    <>
                      {/* Baris 1 */}
                      <tr>
                        <th colSpan="2" className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 border-b border-white/20">Tahun Akademik</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 border-b border-white/20 text-center">TS-2</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 border-b border-white/20 text-center">TS-1</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 border-b border-white/20 text-center">TS</th>
                        <th rowSpan="3" className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 text-center align-middle">Link Bukti</th>
                        <th rowSpan="3" className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider text-center align-middle">Aksi</th>
                      </tr>
                      {/* Baris 2 */}
                      <tr>
                        <th colSpan="2" className="px-6 py-4 text-xs font-bold text-slate-100 uppercase tracking-wider border-r border-white/20 border-b border-white/20">Jumlah Dosen DTPR</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-100 border-r border-white/20 border-b border-white/20 text-center">{statTS2}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-100 border-r border-white/20 border-b border-white/20 text-center">{statTS1}</th>
                        <th className="px-6 py-4 text-xs font-bold text-yellow-300 border-r border-white/20 border-b border-white/20 text-center">{statTS}</th>
                      </tr>
                      {/* Baris 3 */}
                      <tr className="bg-[#162d6e]">
                        <th className="px-6 py-4 text-xs font-bold text-slate-200 uppercase tracking-wider border-r border-white/20">Jenis Pengembangan DTPR</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-200 uppercase tracking-wider border-r border-white/20">Nama DTPR</th>
                        <th colSpan="3" className="px-6 py-4 text-xs font-bold text-slate-200 uppercase tracking-wider border-r border-white/20 text-center">Jumlah</th>
                      </tr>
                    </>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {showTrash ? (
                    trashData.map((item) => (
                      <tr key={item.id_pengembangan} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200 text-sm">
                        <td className="px-6 py-4 border-r border-slate-100 text-slate-800">{item.nama_dtpr}</td>
                        <td className="px-6 py-4 border-r border-slate-100 text-slate-600">{item.jenis_pengembangan}</td>
                        <td className="px-6 py-4 border-r border-slate-100 text-center">
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[0.65rem] uppercase tracking-wider">{item.nama_tahun || item.id_tahun}</span>
                        </td>
                        <td className="px-6 py-4 border-r border-slate-200">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleRestore(item.id_pengembangan)} className="p-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm rounded-lg transition" title="Restore"><RotateCcw size={17} /></button>
                            <button onClick={() => handleHardDelete(item.id_pengembangan)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus Permanen"><Trash size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    pivotedDataInfo.data.map((row, idx) => (
                      <tr key={idx} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200 text-sm">
                        <td className="px-6 py-4 border-r border-slate-100 text-slate-600">{row.jenis_pengembangan}</td>
                        <td className="px-6 py-4 border-r border-slate-100 text-slate-800">{row.nama_dtpr}</td>
                        <td className="px-6 py-4 border-r border-slate-100 text-center text-slate-600">{row.ts2 || '-'}</td>
                        <td className="px-6 py-4 border-r border-slate-100 text-center text-slate-600">{row.ts1 || '-'}</td>
                        <td className="px-6 py-4 border-r border-slate-100 text-center text-blue-600 bg-blue-50/20">{row.ts || '-'}</td>
                        <td className="px-6 py-4 border-r border-slate-100 text-center">
                          {(() => {
                            const tsItem = row.raw.find(ri => {
                              const tObj = tahunList.find(t => t.id_tahun === ri.id_tahun);
                              return tObj && parseInt(tObj.tahun) === currentTSYear;
                            });
                            return tsItem?.link_bukti ? (
                              <a href={tsItem.link_bukti} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 bg-blue-50 px-2 py-1.5 rounded-lg transition text-xs uppercase tracking-wider">
                                <ExternalLink size={12} /> Buka
                              </a>
                            ) : <span className="text-slate-400 italic text-xs">-</span>;
                          })()}
                        </td>
                        <td className="px-6 py-4 text-center border-r border-slate-200">
                          <div className="flex justify-center gap-2">
                            {(() => {
                              const currentYearItem = row.raw.find(ri => {
                                const tObj = tahunList.find(t => t.id_tahun === ri.id_tahun);
                                return tObj && parseInt(tObj.tahun) === currentTSYear;
                              });
                              if (currentYearItem) {
                                return (
                                  <>
                                    <button onClick={() => handleEdit(currentYearItem)} className="p-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm rounded-lg transition" title="Edit TS"><Edit size={17} /></button>
                                    <button onClick={() => handleSoftDelete(currentYearItem.id_pengembangan)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus TS"><Trash2 size={17} /></button>
                                  </>
                                );
                              } else {
                                return (
                                  <button 
                                    onClick={() => {
                                      setFormData({
                                        id_dosen: row.id_dosen || '',
                                        id_tahun: filterIdTahun || '',
                                        jenis_pengembangan: row.jenis_pengembangan || '',
                                        nama_pengembangan: '',
                                        link_bukti: row.link_bukti || '',
                                      });
                                      setEditingId(null);
                                      setShowForm(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-all text-[0.65rem] uppercase tracking-widest border border-violet-100"
                                  >
                                    <Plus size={12} /> Isi TS
                                  </button>
                                );
                              }
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <History size={14} className="text-blue-500" />
          <span>Keterangan: Pengisian data tidak berulang. Jika dosen dikirim tugas belajar di tahun TS-2, maka tidak lagi dihitung di TS-1.</span>
        </div>
      </div>
    </div>
  );
}
