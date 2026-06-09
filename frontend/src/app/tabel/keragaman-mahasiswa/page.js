'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Download, RefreshCw, Trash2, CheckCircle, Target, Database, Globe, AlertTriangle, Edit3, X, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function KeragamanAsalPage() {
  const router = useRouter();
  
  // Data States
  const [data, setData] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [trashData, setTrashData] = useState([]);
  
  // Selection States
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('main'); // 'main' | 'trash'
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Targets from 2A1
  const [targets, setTargets] = useState({ maba: 0, afirmasi: 0, khusus: 0 });

  const initialFormData = {
    lokal: { link: '', rows: [{ jml: 0, ket: 'Banyuwangi' }] },
    regional: { link: '', rows: [{ jml: 0, ket: '' }] },
    nasional: { link: '', rows: [{ jml: 0, ket: '' }] },
    internasional: { link: '', rows: [{ jml: 0, ket: '' }] },
    afirmasi: { link: '', rows: [{ jml: 0, ket: '' }] },
    khusus: { link: '', rows: [{ jml: 0, ket: '' }] }
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const categoriesConfig = [
    { id: 'lokal', label: 'Kota/Kabupaten Sama dengan PS', allowMultiple: false },
    { id: 'regional', label: 'Kota/Kabupaten Lain', allowMultiple: true },
    { id: 'nasional', label: 'Provinsi Lain', allowMultiple: true },
    { id: 'internasional', label: 'Negara Lain', allowMultiple: true },
    { id: 'afirmasi', label: 'Jalur Afirmasi', allowMultiple: false },
    { id: 'khusus', label: 'Berkebutuhan Khusus', allowMultiple: false }
  ];

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
    if (prodiList.length > 0 && !filterProdi) {
      const savedProdi = localStorage.getItem('keragamanMahasiswa_filterProdi');
      if (savedProdi && prodiList.some(p => p.id_prodi.toString() === savedProdi)) {
        setFilterProdi(savedProdi);
      } else {
        const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (tiProdi) {
          setFilterProdi(tiProdi.id_prodi.toString());
          localStorage.setItem('keragamanMahasiswa_filterProdi', tiProdi.id_prodi.toString());
        }
      }
    }
  }, [prodiList]);

  useEffect(() => {
    if (tahunList.length > 0 && !filterTahun) {
      const savedTahun = localStorage.getItem('keragamanMahasiswa_filterTahun');
      if (savedTahun && tahunList.some(t => t.id_tahun.toString() === savedTahun)) {
        setFilterTahun(savedTahun);
      } else {
        const sortedTahun = [...tahunList].sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun));
        if (sortedTahun.length > 0) {
          setFilterTahun(sortedTahun[0].id_tahun.toString());
          localStorage.setItem('keragamanMahasiswa_filterTahun', sortedTahun[0].id_tahun.toString());
        }
      }
    }
  }, [tahunList]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      if (viewMode === 'main') {
        fetchTarget2A1();
        fetchData();
      } else {
        fetchTrashData();
      }
    }
  }, [filterProdi, filterTahun, viewMode]);

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setProdiList(result.data || []);
    } catch (err) { console.error('Error fetching prodi:', err); }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setTahunList(result.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun)) || []);
    } catch (err) { console.error('Error fetching tahun:', err); }
  };

  const fetchTarget2A1 = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/pmb/2a1-data-mahasiswa/${filterProdi}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success && result.data) {
        const currentSync = result.data.find(d => d.tahun_akademik_id_tahun == filterTahun);
        if (currentSync) {
          setTargets({
            maba: (parseInt(currentSync.maba_reg_diterima) || 0) + (parseInt(currentSync.maba_rpl_diterima) || 0),
            afirmasi: (parseInt(currentSync.maba_reg_afirmasi) || 0) + (parseInt(currentSync.maba_rpl_afirmasi) || 0),
            khusus: (parseInt(currentSync.maba_reg_khusus) || 0) + (parseInt(currentSync.maba_rpl_khusus) || 0)
          });
        } else {
          setTargets({ maba: 0, afirmasi: 0, khusus: 0 });
        }
      }
    } catch (err) { console.error('Error fetching 2a1 targets:', err); }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/pmb/2a2-keragaman-asal/${filterProdi}/${filterTahun}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      
      if (result.success) {
        setData(result.data || []);
        
        const selectedTahunObj = tahunList.find(t => t.id_tahun == filterTahun);
        const selectedTahunStr = selectedTahunObj ? selectedTahunObj.tahun : '';
        const tsData = result.data ? result.data.find(d => d.tahun.toString() === selectedTahunStr.toString()) : null;
        
        if (tsData) {
          setCurrentRecordId(tsData.id_2a2);
          const ts = tsData.raw;
          const newForm = JSON.parse(JSON.stringify(initialFormData));
          
          categoriesConfig.forEach(cat => {
            if (ts && ts[cat.id]) {
              newForm[cat.id].link = ts[cat.id].link || '';
              newForm[cat.id].rows = ts[cat.id].rows || [{ jml: 0, ket: cat.id === 'lokal' ? 'Banyuwangi' : '' }];
            }
          });
          
          setFormData(newForm);
        } else {
          setCurrentRecordId(null);
          setFormData(initialFormData);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/pmb/2a2-keragaman-asal/trash/${filterProdi}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setTrashData(result.data || []);
    } catch (err) { console.error('Error fetching trash:', err); } finally { setLoading(false); }
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/pmb/2a2-keragaman-asal/export/${filterProdi}/${filterTahun}?token=${token}`, '_blank');
  };

  const handleAddRow = (catId) => {
    const newForm = { ...formData };
    newForm[catId].rows.push({ jml: 0, ket: '' });
    setFormData(newForm);
  };

  const handleRemoveRow = (catId, idx) => {
    const newForm = { ...formData };
    newForm[catId].rows.splice(idx, 1);
    setFormData(newForm);
  };

  const handleRowChange = (catId, idx, field, value) => {
    const newForm = { ...formData };
    newForm[catId].rows[idx][field] = field === 'jml' ? (parseInt(value) || 0) : value;
    setFormData(newForm);
  };

  const handleLinkChange = (catId, value) => {
    const newForm = { ...formData };
    newForm[catId].link = value;
    setFormData(newForm);
  };

  const getSum = (catId) => {
    return formData[catId].rows.reduce((a, b) => a + (parseInt(b.jml) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const totalIn = getSum('lokal') + getSum('regional') + getSum('nasional') + getSum('internasional');
    const totalAfirmasi = getSum('afirmasi');
    const totalKhusus = getSum('khusus');

    if (totalIn !== targets.maba) {
      alert(`Gagal Sinkronisasi: Total maba wilayah (${totalIn}) tidak sama dengan data 'Diterima' di Tabel 2.A.1 (${targets.maba}).`);
      return;
    }
    if (totalAfirmasi !== targets.afirmasi) {
      alert(`Gagal Sinkronisasi: Total afirmasi (${totalAfirmasi}) tidak sama dengan data di Tabel 2.A.1 (${targets.afirmasi}).`);
      return;
    }
    if (totalKhusus !== targets.khusus) {
      alert(`Gagal Sinkronisasi: Total berkebutuhan khusus (${totalKhusus}) tidak sama dengan data di Tabel 2.A.1 (${targets.khusus}).`);
      return;
    }

    // Default user ID if none in localstorage
    let userId = 1;
    try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        if (userObj.id_user || userObj.id_unit) userId = userObj.id_user || userObj.id_unit;
    } catch(e) {}

    const payload = {
      id_prodi: parseInt(filterProdi),
      id_tahun: parseInt(filterTahun),
      user_id: userId,
      jml_lokal: getSum('lokal'), ket_lokal: JSON.stringify(formData.lokal.rows), link_lokal: formData.lokal.link,
      jml_regional: getSum('regional'), ket_regional: JSON.stringify(formData.regional.rows), link_regional: formData.regional.link,
      jml_nasional: getSum('nasional'), ket_nasional: JSON.stringify(formData.nasional.rows), link_nasional: formData.nasional.link,
      jml_internasional: getSum('internasional'), ket_internasional: JSON.stringify(formData.internasional.rows), link_internasional: formData.internasional.link,
      jml_afirmasi: getSum('afirmasi'), ket_afirmasi: JSON.stringify(formData.afirmasi.rows), link_afirmasi: formData.afirmasi.link,
      jml_khusus: getSum('khusus'), ket_khusus: JSON.stringify(formData.khusus.rows), link_khusus: formData.khusus.link
    };

    try {
      const res = await fetch(`http://localhost:5000/api/pmb/2a2-keragaman-asal/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        alert("Data berhasil disimpan dan disinkronkan.");
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Gagal menyimpan: " + result.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSoftDelete = async () => {
    if (!currentRecordId) {
      alert("Tidak ada data aktif untuk tahun akademik terpilih yang dapat dihapus.");
      return;
    }
    if (!confirm('Apakah Anda yakin ingin memindahkan data ini ke Trash?')) return;
    
    const token = localStorage.getItem('token');
    let userId = 1;
    try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        if (userObj.id_user || userObj.id_unit) userId = userObj.id_user || userObj.id_unit;
    } catch(e) {}

    try {
      const res = await fetch(`http://localhost:5000/api/pmb/2a2-keragaman-asal/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_2a2: currentRecordId, user_id: userId })
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      alert("Gagal memproses penghapusan.");
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/pmb/2a2-keragaman-asal/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) fetchTrashData();
    } catch (err) {
      alert("Gagal memulihkan data.");
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm("Menghapus data secara permanen akan menghilangkan data tahun akademik ini dari sistem. Lanjutkan?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/pmb/2a2-keragaman-asal/hard-delete/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) fetchTrashData();
    } catch (err) {
      alert("Gagal menghapus permanen.");
    }
  };

  // Rendering Helpers for Table
  const selectedTahunObj = tahunList.find(t => t.id_tahun == filterTahun);
  const selectedTahunStr = selectedTahunObj ? selectedTahunObj.tahun : '';
  
  const rTS = data.find(d => d.tahun.toString() === selectedTahunStr.toString()) || null;
  const rTS1 = data.find(d => d.tahun.toString() === (parseInt(selectedTahunStr) - 1).toString()) || null;
  const rTS2 = data.find(d => d.tahun.toString() === (parseInt(selectedTahunStr) - 2).toString()) || null;

  const getUniqueKeys = (field) => {
    const keys = new Set();
    [rTS, rTS1, rTS2].forEach(r => {
        if (r && r.raw && r.raw[field]) {
            r.raw[field].rows.forEach(x => {
                if (x.ket) keys.add(x.ket.trim());
            });
        }
    });
    return Array.from(keys);
  };

  const getValueForKey = (yearObj, field, key) => {
      if (!yearObj || !yearObj.raw || !yearObj.raw[field]) return 0;
      const found = yearObj.raw[field].rows.find(x => x.ket && x.ket.trim() === key);
      return found ? (parseInt(found.jml) || 0) : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 pb-10">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Keragaman Asal Mahasiswa (2.A.2)</h1>
              <p className="text-slate-500 mt-1 font-medium">Manajemen penyebaran wilayah dan jalur masuk mahasiswa baru</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleExport} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats & Filters (from 2.A.1) */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <Database size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Target Maba</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Maba</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{targets.maba}</p>
                </div>
              </div>
            </Card>
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-amber-600 shrink-0">
                  <Target size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Target Afirmasi</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Afirmasi</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{targets.afirmasi}</p>
                </div>
              </div>
            </Card>
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-emerald-600 shrink-0">
                  <CheckCircle size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Target Khusus</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Khusus</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{targets.khusus}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap gap-3 items-end w-full lg:w-auto">
            <div className="w-full sm:w-[220px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Program Studi</label>
              <div className="relative">
                <select 
                  value={filterProdi} 
                  onChange={(e) => {
                    setFilterProdi(e.target.value);
                    localStorage.setItem('keragamanMahasiswa_filterProdi', e.target.value);
                  }} 
                  className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
                >
                  {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                  <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-[150px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Tahun (TS)</label>
              <div className="relative">
                <select 
                  value={filterTahun} 
                  onChange={(e) => {
                    setFilterTahun(e.target.value);
                    localStorage.setItem('keragamanMahasiswa_filterTahun', e.target.value);
                  }} 
                  className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
                >
                  {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}/{parseInt(t.tahun)+1}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                  <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <Button onClick={() => viewMode === 'main' ? fetchData() : fetchTrashData()} variant="outline" className="h-[44px] px-4 shrink-0" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button onClick={() => setViewMode('main')} className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase ${viewMode === 'main' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-500'}`}>
            Dashboard & Input
          </button>
          <button onClick={() => setViewMode('trash')} className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase flex items-center gap-2 ${viewMode === 'trash' ? 'border-b-4 border-red-600 text-red-600' : 'text-slate-500 hover:text-slate-500'}`}>
            <Trash2 size={17} /> Trash Bin
          </button>
        </div>

        {viewMode === 'trash' ? (
          <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-3">
              <Trash2 className="text-red-500" /> Data Terhapus
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/80/50">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-6 py-4 border-r border-white/20">Tahun Akademik</th>
                    <th className="px-6 py-4 border-r border-white/20">Dihapus Pada</th>
                    <th className="px-6 py-4 text-center border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trashData.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400 font-bold">Trash Kosong</td></tr>
                  ) : trashData.map(item => (
                    <tr key={item.id_2a2} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-bold text-slate-800 border-r border-slate-200">{item.tahun}/{parseInt(item.tahun)+1}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm border-r border-slate-200">{new Date(item.pmb_deleted_at).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 border-r border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleRestore(item.id_2a2)} className="px-4 py-2 bg-blue-50/80 text-violet-600 hover:bg-blue-600 hover:text-slate-900 rounded-lg font-bold text-[10px] uppercase transition border border-blue-800">Restore</button>
                          <button onClick={() => handleHardDelete(item.id_2a2)} className="px-4 py-2 bg-red-100 text-red-400 hover:bg-red-600 hover:text-slate-900 rounded-lg font-bold text-[10px] uppercase transition border border-red-200">Hapus Permanen</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* MODAL FORM */}
            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0 bg-white rounded-t-[2rem]">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Edit3 className="text-blue-500"/> Input / Edit Data Keragaman</h2>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Lengkapi data sebaran asal mahasiswa baru</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 rounded-xl transition">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {categoriesConfig.map(cat => {
                          const isLokal = cat.id === 'lokal';
                          const rows = formData[cat.id]?.rows || [];
                          const link = formData[cat.id]?.link || '';
                          
                          return (
                            <div key={cat.id} className="bg-slate-50/80/40 rounded-2xl p-6 border border-slate-200/60 transition-all hover:border-gray-600 flex flex-col shadow-sm">
                              <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-200/50">
                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{cat.label}</span>
                                {cat.allowMultiple && (
                                  <button type="button" onClick={() => handleAddRow(cat.id)} className="bg-blue-50/80 text-violet-600 hover:bg-blue-600 hover:text-slate-900 px-4 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 border border-blue-800/50 shadow-sm">
                                    <Plus size={17} /> Wilayah
                                  </button>
                                )}
                              </div>

                              <div className="space-y-4 mb-5 flex-1">
                                {rows.map((row, idx) => (
                                  <div key={idx} className="flex gap-3 items-center">
                                    <div className="w-24">
                                      <span className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Angka</span>
                                      <input type="number" min="0" value={row.jml} onChange={(e) => handleRowChange(cat.id, idx, 'jml', e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-black text-center text-slate-800 outline-none focus:border-blue-500 transition focus:ring-2 focus:ring-blue-500/50" />
                                    </div>
                                    <div className="flex-1">
                                      <span className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Wilayah</span>
                                      <input type="text" value={row.ket} onChange={(e) => handleRowChange(cat.id, idx, 'ket', e.target.value)} readOnly={isLokal} className={`w-full p-3 border rounded-xl text-sm font-bold text-slate-800 outline-none transition ${isLokal ? 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed' : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'}`} placeholder={isLokal ? '' : 'Contoh: Jember'} />
                                    </div>
                                    {cat.allowMultiple && idx > 0 && (
                                      <div className="w-10 pt-6 flex justify-end">
                                        <button type="button" onClick={() => handleRemoveRow(cat.id, idx)} className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-200 rounded-xl transition"><Trash2 size={18}/></button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="mt-auto pt-3">
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Link Bukti Dokumen</span>
                                <input type="url" value={link} onChange={(e) => handleLinkChange(cat.id, e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition" placeholder="https://drive.google.com/..." />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm pt-5 mt-8 flex justify-end gap-4 pb-4 border-t border-slate-200 z-10">
                        <button type="button" onClick={handleSoftDelete} className="px-6 py-3.5 bg-red-50 text-red-500 border border-red-200 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-red-600 hover:text-slate-900 transition shadow-sm mr-auto">
                          Hapus Data
                        </button>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 bg-slate-50/80 text-slate-600 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition">
                          Batal
                        </button>
                        <button type="submit" className="px-10 py-3.5 bg-blue-600 text-slate-900 rounded-xl font-black text-xs tracking-widest uppercase shadow-lg shadow-violet-200/50 hover:bg-violet-700 transition flex items-center justify-center gap-2">
                          <Save size={18} /> Simpan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW TABLE */}
            <div className="flex flex-col gap-6 w-full">
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                    <Globe className="text-blue-500" /> Laporan Waterfall
                  </h2>
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-violet-50 text-violet-600 border border-violet-200 px-5 py-3 rounded-xl hover:bg-blue-600 hover:text-slate-900 transition shadow-lg shadow-violet-200/50 font-black text-xs tracking-widest uppercase">
                    <Edit3 size={17} />
                    <span>Input / Edit Data</span>
                  </button>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-blue-500">
                      <RefreshCw className="animate-spin mb-4" size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">Memuat Laporan...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-slate-50/80/50 custom-scrollbar">
                      <table className="w-full min-w-max text-left whitespace-nowrap">
                        <thead className="bg-[#1E3A8A]">
                          <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                            <th rowSpan="2" className="w-[45%] px-6 py-4 border-r border-white/20 align-middle">Asal Mahasiswa</th>
                            <th colSpan="3" className="px-6 py-3 border-r border-white/20 text-center border-b border-white/20">Jumlah Mahasiswa Baru</th>
                            <th rowSpan="2" className="w-[15%] px-6 py-4 border-r border-white/20 text-center align-middle">Link Bukti</th>
                          </tr>
                          <tr className="bg-[#162d6e] text-xs font-bold text-slate-100 text-center">
                            <th className="w-[12%] px-4 py-3 border-r border-white/20">TS-2</th>
                            <th className="w-[12%] px-4 py-3 border-r border-white/20">TS-1</th>
                            <th className="w-[12%] px-4 py-3 border-r border-white/20">TS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          
                          {/* Helper to render rows */}
                          {(() => {
                            const renderParent = (key, label, ts2, ts1, ts, link) => (
                              <tr key={key} className="bg-white/50 font-bold border-y border-slate-200">
                                <td className="px-6 py-3 text-slate-800 uppercase text-[10px] tracking-tight border-r border-slate-200">{label}</td>
                                <td className="text-center px-4 py-3 text-slate-500 border-r border-slate-200 text-xs">{ts2}</td>
                                <td className="text-center px-4 py-3 text-slate-500 border-r border-slate-200 text-xs">{ts1}</td>
                                <td className="text-center px-4 py-3 text-blue-500 bg-blue-50/30 text-xs border-r border-slate-200">{ts}</td>
                                <td className="text-center px-4 py-3 border-r border-slate-200">
                                  {link ? <a href={link} target="_blank" rel="noreferrer" className="bg-blue-50/80 text-violet-600 hover:bg-blue-600 hover:text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-bold inline-block transition border border-blue-800/50">Drive</a> : <span className="text-[8px] text-slate-500 font-bold uppercase">N/A</span>}
                                </td>
                              </tr>
                            );

                            const renderChild = (key, label, ts2, ts1, ts) => (
                              <tr key={key} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-10 py-2.5 text-slate-500 font-bold text-[10px] italic border-r border-slate-200/50 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div> {label}
                                </td>
                                <td className="text-center px-4 py-2.5 text-slate-600 text-[10px] font-semibold border-r border-slate-200/50">{ts2}</td>
                                <td className="text-center px-4 py-2.5 text-slate-600 text-[10px] font-semibold border-r border-slate-200/50">{ts1}</td>
                                <td className="text-center px-4 py-2.5 text-slate-600 text-[10px] border-r border-slate-200/50">{ts}</td>
                                <td className="text-center px-4 py-2.5 border-r border-slate-200"></td>
                              </tr>
                            );

                            const rows = [];
                            
                            // 1. Lokal
                            rows.push(renderParent('parent-lokal', 'Kota/Kab sama dengan PS', rTS2 ? rTS2.raw.lokal.jml : 0, rTS1 ? rTS1.raw.lokal.jml : 0, getSum('lokal'), formData.lokal.link));

                            // 2. Regional
                            const regTS2 = rTS2 ? (parseInt(rTS2.raw.regional.jml)||0) + (parseInt(rTS2.raw.nasional.jml)||0) + (parseInt(rTS2.raw.internasional.jml)||0) : 0;
                            const regTS1 = rTS1 ? (parseInt(rTS1.raw.regional.jml)||0) + (parseInt(rTS1.raw.nasional.jml)||0) + (parseInt(rTS1.raw.internasional.jml)||0) : 0;
                            const regTS = getSum('regional') + getSum('nasional') + getSum('internasional');
                            rows.push(renderParent('parent-regional', 'Kota/Kabupaten Lain', regTS2, regTS1, regTS, formData.regional.link));
                            getUniqueKeys('regional').forEach((key, i) => {
                                rows.push(renderChild(`child-regional-${i}-${key}`, key, getValueForKey(rTS2, 'regional', key), getValueForKey(rTS1, 'regional', key), formData.regional.rows.find(x => x.ket.trim() === key)?.jml || 0));
                            });

                            // 3. Nasional
                            const nasTS2 = rTS2 ? (parseInt(rTS2.raw.nasional.jml)||0) + (parseInt(rTS2.raw.internasional.jml)||0) : 0;
                            const nasTS1 = rTS1 ? (parseInt(rTS1.raw.nasional.jml)||0) + (parseInt(rTS1.raw.internasional.jml)||0) : 0;
                            const nasTS = getSum('nasional') + getSum('internasional');
                            rows.push(renderParent('parent-nasional', 'Provinsi Lain', nasTS2, nasTS1, nasTS, formData.nasional.link));
                            getUniqueKeys('nasional').forEach((key, i) => {
                                rows.push(renderChild(`child-nasional-${i}-${key}`, key, getValueForKey(rTS2, 'nasional', key), getValueForKey(rTS1, 'nasional', key), formData.nasional.rows.find(x => x.ket.trim() === key)?.jml || 0));
                            });

                            // 4. Internasional
                            const intTS2 = rTS2 ? rTS2.raw.internasional.jml : 0;
                            const intTS1 = rTS1 ? rTS1.raw.internasional.jml : 0;
                            const intTS = getSum('internasional');
                            rows.push(renderParent('parent-internasional', 'Negara Lain', intTS2, intTS1, intTS, formData.internasional.link));
                            getUniqueKeys('internasional').forEach((key, i) => {
                                rows.push(renderChild(`child-internasional-${i}-${key}`, key, getValueForKey(rTS2, 'internasional', key), getValueForKey(rTS1, 'internasional', key), formData.internasional.rows.find(x => x.ket.trim() === key)?.jml || 0));
                            });

                            // 5. Afirmasi
                            rows.push(renderParent('parent-afirmasi', 'Afirmasi', rTS2 ? rTS2.raw.afirmasi.jml : 0, rTS1 ? rTS1.raw.afirmasi.jml : 0, getSum('afirmasi'), formData.afirmasi.link));
                            getUniqueKeys('afirmasi').forEach((key, i) => {
                                rows.push(renderChild(`child-afirmasi-${i}-${key}`, key, getValueForKey(rTS2, 'afirmasi', key), getValueForKey(rTS1, 'afirmasi', key), formData.afirmasi.rows.find(x => x.ket.trim() === key)?.jml || 0));
                            });

                            // 6. Khusus
                            rows.push(renderParent('parent-khusus', 'Berkebutuhan Khusus', rTS2 ? rTS2.raw.khusus.jml : 0, rTS1 ? rTS1.raw.khusus.jml : 0, getSum('khusus'), formData.khusus.link));
                            getUniqueKeys('khusus').forEach((key, i) => {
                                rows.push(renderChild(`child-khusus-${i}-${key}`, key, getValueForKey(rTS2, 'khusus', key), getValueForKey(rTS1, 'khusus', key), formData.khusus.rows.find(x => x.ket.trim() === key)?.jml || 0));
                            });

                            return <>{rows}</>;
                          })()}
                        </tbody>
                        <tfoot>
                          <tr className="bg-yellow-500/10 text-yellow-500 font-black border-t-2 border-yellow-500/30">
                            <td className="px-6 py-4 uppercase text-[10px] tracking-widest italic border-r border-yellow-500/30">Jumlah Total Maba</td>
                            <td className="text-center px-4 py-4 text-sm border-r border-yellow-500/30">
                              {rTS2 ? ((parseInt(rTS2.raw.lokal.jml)||0) + (parseInt(rTS2.raw.regional.jml)||0) + (parseInt(rTS2.raw.nasional.jml)||0) + (parseInt(rTS2.raw.internasional.jml)||0)) : 0}
                            </td>
                            <td className="text-center px-4 py-4 text-sm border-r border-yellow-500/30">
                              {rTS1 ? ((parseInt(rTS1.raw.lokal.jml)||0) + (parseInt(rTS1.raw.regional.jml)||0) + (parseInt(rTS1.raw.nasional.jml)||0) + (parseInt(rTS1.raw.internasional.jml)||0)) : 0}
                            </td>
                            <td className="text-center px-4 py-4 text-lg border-r border-yellow-500/30 bg-yellow-500/20">
                              {getSum('lokal') + getSum('regional') + getSum('nasional') + getSum('internasional')}
                            </td>
                            <td className="bg-yellow-500/5 border-r border-slate-200"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
