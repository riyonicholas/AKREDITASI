'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Target, MapPin, Calendar, BookOpen, CheckCircle } from 'lucide-react';

export default function PetaPemenuhanCplPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  
  const [prodiList, setProdiList] = useState([]);
  const [cplList, setCplList] = useState([]);
  const [cpmkList, setCpmkList] = useState([]);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_cpl: '',
    id_cpmk: '',
    id_tahun: '',
  });
  const [cpmkMkMapping, setCpmkMkMapping] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

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
    if (prodiList.length > 0 && (!filterProdi || filterProdi === '')) {
      const savedProdi = localStorage.getItem('petaPemenuhanCpl_filterProdi');
      if (savedProdi && prodiList.some(p => p.id_prodi.toString() === savedProdi)) {
        setFilterProdi(savedProdi);
      } else {
        const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (tiProdi) {
          setFilterProdi(tiProdi.id_prodi.toString());
          localStorage.setItem('petaPemenuhanCpl_filterProdi', tiProdi.id_prodi.toString());
        } else if (prodiList.length > 0) {
          setFilterProdi(prodiList[0].id_prodi.toString());
          localStorage.setItem('petaPemenuhanCpl_filterProdi', prodiList[0].id_prodi.toString());
        }
      }
    }
  }, [prodiList, filterProdi]);

  useEffect(() => {
    if (tahunList.length > 0 && (!filterTahun || filterTahun === '')) {
      const savedTahun = localStorage.getItem('petaPemenuhanCpl_filterTahun');
      if (savedTahun && tahunList.some(t => t.id_tahun.toString() === savedTahun)) {
        setFilterTahun(savedTahun);
      } else {
        const firstTahun = tahunList[0].id_tahun.toString();
        setFilterTahun(firstTahun);
        localStorage.setItem('petaPemenuhanCpl_filterTahun', firstTahun);
      }
    }
  }, [tahunList, filterTahun]);

  useEffect(() => {
    if (filterProdi && filterTahun) {
      fetchData();
      fetchCplList();
      fetchCpmkList();
      fetchMataKuliahList();
    }
  }, [filterProdi, filterTahun]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan?id_prodi=${filterProdi}&id_tahun=${filterTahun}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setData(result.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdiList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/prodi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setProdiList(result.data);
    } catch (err) {
      console.error('Error fetching prodi:', err);
    }
  };

  const fetchTahunList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/tahun-akademik', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        const sorted = [...result.data].sort((a, b) => a.tahun.toString().localeCompare(b.tahun.toString()));
        setTahunList(sorted);
      }
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const fetchCplList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/cpl?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setCplList(result.data || []);
    } catch (err) {
      console.error('Error fetching CPL:', err);
    }
  };

  const fetchCpmkList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/cpmk?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setCpmkList(result.data || []);
    } catch (err) {
      console.error('Error fetching CPMK:', err);
    }
  };

  const fetchMataKuliahList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/mata-kuliah?id_prodi=${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setMataKuliahList(result.data || []);
    } catch (err) {
      console.error('Error fetching mata kuliah:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_cpl || !formData.id_tahun) {
      alert("Lengkapi semua form wajib");
      return;
    }

    const cpmksToProcess = isEditMode 
        ? [formData.id_cpmk] 
        : Object.keys(cpmkMkMapping).filter(cpmkId => cpmkMkMapping[cpmkId] && cpmkMkMapping[cpmkId].length > 0);

    if (cpmksToProcess.length === 0 && !isEditMode) {
      alert("Pilih minimal 1 Mata Kuliah untuk setidaknya 1 CPMK");
      return;
    }

    const token = localStorage.getItem('token');
    let hasChanges = false;

    try {
      for (const cpmkIdStr of cpmksToProcess) {
        const id_cpmk = parseInt(cpmkIdStr);
        const selectedMksForCpmk = cpmkMkMapping[id_cpmk] || [];

        // Find all currently mapped MKs for this CPL and CPMK
        const originalMappedMks = data.filter(d => 
            parseInt(d.id_cpl) === parseInt(formData.id_cpl) && 
            parseInt(d.id_cpmk) === id_cpmk &&
            (formData.id_tahun ? parseInt(d.id_tahun) === parseInt(formData.id_tahun) : true)
        );
        const originalMkIds = originalMappedMks.map(d => parseInt(d.id_mk));
        
        const toAdd = selectedMksForCpmk.filter(id => !originalMkIds.includes(parseInt(id)));
        const toDelete = originalMappedMks.filter(d => !selectedMksForCpmk.includes(parseInt(d.id_mk)));
        
        if (toAdd.length > 0 || toDelete.length > 0) hasChanges = true;

        // Add new mappings
        for (const mkId of toAdd) {
          await fetch(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              id_cpl: formData.id_cpl,
              id_cpmk: id_cpmk,
              id_mk: mkId,
              id_tahun: formData.id_tahun
            }),
          });
        }
        
        // Delete removed mappings
        for (const item of toDelete) {
          await fetch(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan/${item.id_2b3}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      }
      
      if (!hasChanges) {
        alert('Tidak ada perubahan data');
        resetForm();
        return;
      }
      
      alert('Data pemetaan berhasil disimpan');
      fetchData();
      resetForm();
    } catch (err) {
      console.error('Error saving data:', err);
      alert('Gagal menyimpan pemetaan');
    }
  };

  const handleAddMapping = (cpl = null) => {
    setFormData({
      id_cpl: cpl ? cpl.id_cpl : '',
      id_cpmk: '',
      id_tahun: filterTahun,
    });
    setCpmkMkMapping({});
    setIsEditMode(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleEditGroup = (cpl, cpmkGroup) => {
    setFormData({
      id_cpl: cpl.id_cpl,
      id_cpmk: cpmkGroup.id_cpmk,
      id_tahun: filterTahun,
    });
    
    const existingMappings = data.filter(d => d.id_cpl === cpl.id_cpl && d.id_cpmk === cpmkGroup.id_cpmk && d.id_tahun === parseInt(filterTahun));
    const existingMks = existingMappings.map(d => parseInt(d.id_mk));
      
    setCpmkMkMapping({
      [cpmkGroup.id_cpmk]: existingMks
    });
    setIsEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleMkToggle = (id_cpmk, id_mk) => {
    setCpmkMkMapping(prev => {
      const currentMks = prev[id_cpmk] || [];
      const newMks = currentMks.includes(parseInt(id_mk))
        ? currentMks.filter(id => id !== parseInt(id_mk))
        : [...currentMks, parseInt(id_mk)];
      return { ...prev, [id_cpmk]: newMks };
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2b3-peta-pemenuhan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
    } catch (err) {
      console.error('Error deleting data:', err);
      alert('Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({
      id_cpl: '',
      id_cpmk: '',
      id_tahun: '',
    });
    setCpmkMkMapping({});
    setIsEditMode(false);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Peta Pemenuhan CPL (2.B.3)</h1>
              <p className="text-slate-500 mt-1 font-medium">Pengelolaan hubungan CPL, CPMK, dan Mata Kuliah</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {showForm && (
                <button onClick={() => setShowForm(false)} className="flex items-center gap-2 bg-slate-50/80 text-slate-500 px-5 py-2.5 rounded-xl hover:bg-slate-200 transition font-bold text-sm">
                  <span>Tutup Form</span>
                </button>
              )}

              <Button onClick={() => window.open(`http://localhost:5000/api/prodi/2b1-isi-pembelajaran/export?id_prodi=${filterProdi}&token=${localStorage.getItem('token')}`, '_blank')} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 mb-8 items-end w-full">
          <div className="w-full sm:w-[280px]">
            <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Program Studi</label>
            <div className="relative">
              <select 
                value={filterProdi} 
                onChange={(e) => {
                  setFilterProdi(e.target.value);
                  localStorage.setItem('petaPemenuhanCpl_filterProdi', e.target.value);
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
            <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Tahun Akademik</label>
            <div className="relative">
              <select 
                value={filterTahun} 
                onChange={(e) => {
                  setFilterTahun(e.target.value);
                  localStorage.setItem('petaPemenuhanCpl_filterTahun', e.target.value);
                }} 
                className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
              >
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
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <Card title={isEditMode ? 'Atur Pemetaan Mata Kuliah' : 'Input Peta Pemenuhan CPL Baru'} icon={<Plus className="text-violet-500" size={20}/>} variant="default" className="!p-0 border-blue-100 shadow-sm">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Bagian Input CPL, CPMK, Tahun */}
                <div className={`grid grid-cols-1 ${isEditMode ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">CPL</label>
                    <div className="relative">
                      <select disabled={isEditMode} value={formData.id_cpl} onChange={(e) => setFormData({...formData, id_cpl: e.target.value})} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 pr-10 text-[0.9rem] font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" required>
                        <option value="">-- Pilih CPL --</option>
                        {cplList.map(cpl => (
                          <option key={cpl.id_cpl} value={cpl.id_cpl}>
                            {cpl.kode_cpl} {cpl.deskripsi_cpl ? `- ${cpl.deskripsi_cpl.substring(0, 50)}${cpl.deskripsi_cpl.length > 50 ? '...' : ''}` : ''}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  
                  {isEditMode && (
                    <div>
                      <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">CPMK</label>
                      <div className="relative">
                        <select disabled={true} value={formData.id_cpmk} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-100 py-3 px-4 pr-10 text-[0.9rem] font-bold text-slate-500 outline-none transition-all cursor-not-allowed" required>
                          <option value="">-- Pilih CPMK --</option>
                          {cpmkList.map(cpmk => <option key={cpmk.id_cpmk} value={cpmk.id_cpmk}>{cpmk.kode_cpmk}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">Tahun Akademik</label>
                    <div className="relative">
                      <select disabled={true} value={formData.id_tahun} onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-100 py-3 px-4 pr-10 text-[0.9rem] font-bold text-slate-500 outline-none transition-all cursor-not-allowed" required>
                        <option value="">-- Pilih Tahun --</option>
                        {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deskripsi CPL Info Box */}
                {formData.id_cpl && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600 shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <div className="text-[0.75rem] font-black text-blue-700 uppercase tracking-widest mb-1">
                        Deskripsi {cplList.find(c => c.id_cpl.toString() === formData.id_cpl.toString())?.kode_cpl}
                      </div>
                      <div className="text-[0.9rem] text-blue-900 leading-relaxed font-medium">
                        {cplList.find(c => c.id_cpl.toString() === formData.id_cpl.toString())?.deskripsi_cpl}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bagian Mata Kuliah Selection */}
                {formData.id_cpl && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <label className="text-[0.9rem] font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Target size={18} className="text-violet-500" />
                      {isEditMode ? 'Atur Mata Kuliah untuk CPMK ini' : 'Pemetaan CPMK ke Mata Kuliah'}
                    </label>
                    
                    {isEditMode ? (
                      // Edit Mode: show only the selected CPMK
                      cpmkList.filter(c => c.id_cpmk.toString() === formData.id_cpmk.toString()).map(cpmk => (
                        <div key={cpmk.id_cpmk} className="bg-white p-5 rounded-xl border border-slate-200 mb-4 shadow-sm">
                          <div className="text-sm font-black text-slate-800 mb-4 border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center gap-2">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">{cpmk.kode_cpmk}</span> 
                            <span className="text-slate-600 font-medium">{cpmk.deskripsi_cpmk}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {mataKuliahList.map(mk => {
                              const isSelected = (cpmkMkMapping[cpmk.id_cpmk] || []).includes(parseInt(mk.id_mk));
                              return (
                                <label key={mk.id_mk} className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                  <div className="mt-0.5 shrink-0">
                                    <input type="checkbox" checked={isSelected} onChange={() => handleMkToggle(cpmk.id_cpmk, mk.id_mk)} className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`text-[0.85rem] font-black tracking-tight ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>{mk.kode_mk}</div>
                                    <div className={`text-[0.75rem] mt-1 font-medium leading-snug ${isSelected ? 'text-blue-700/80' : 'text-slate-500'}`}>{mk.nama_mk}</div>
                                    <div className={`inline-flex items-center mt-2.5 px-2 py-0.5 rounded-md text-[0.65rem] font-bold uppercase tracking-wider ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>Semester {mk.semester}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      // Input Baru: show all CPMKs
                      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {cpmkList.map(cpmk => (
                          <div key={cpmk.id_cpmk} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-sm font-black text-slate-800 mb-4 border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center gap-2">
                              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">{cpmk.kode_cpmk}</span> 
                              <span className="text-slate-600 font-medium">{cpmk.deskripsi_cpmk}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                              {mataKuliahList.map(mk => {
                                const isSelected = (cpmkMkMapping[cpmk.id_cpmk] || []).includes(parseInt(mk.id_mk));
                                return (
                                  <label key={mk.id_mk} className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                    <div className="mt-0.5 shrink-0">
                                      <input type="checkbox" checked={isSelected} onChange={() => handleMkToggle(cpmk.id_cpmk, mk.id_mk)} className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`text-[0.85rem] font-black tracking-tight ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>{mk.kode_mk}</div>
                                      <div className={`text-[0.75rem] mt-1 font-medium leading-snug ${isSelected ? 'text-blue-700/80' : 'text-slate-500'}`}>{mk.nama_mk}</div>
                                      <div className={`inline-flex items-center mt-2.5 px-2 py-0.5 rounded-md text-[0.65rem] font-bold uppercase tracking-wider ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>Semester {mk.semester}</div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">Batal</Button>
                  <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                    {isEditMode ? 'Update Pemetaan' : 'Simpan Pemetaan'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-slate-500 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : cplList.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-xl tracking-tight">Belum ada data CPL. Silakan atur filter atau tambah data master.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {(() => {
                const uniqueSemesters = [...new Set(mataKuliahList.map(mk => parseInt(mk.semester) || 0))]
                  .filter(sem => sem > 0)
                  .sort((a, b) => a - b);
                
                const displaySemesters = uniqueSemesters.length > 0 ? uniqueSemesters : [1, 2, 3, 4, 5, 6, 7, 8];

                return (
                  <table className="w-full min-w-max text-left border-collapse">
                    <thead className="bg-[#1E3A8A]">
                      <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                        <th className="px-6 py-5 border-r border-white/20 align-middle sticky left-0 z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.2)] bg-[#1E3A8A]">CPL</th>
                        <th className="px-6 py-5 border-r border-white/20 align-middle sticky left-[260px] z-20 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.2)] bg-[#1E3A8A]">CPMK</th>
                        {displaySemesters.map(sem => (
                          <th key={sem} className="px-6 py-5 border-r border-white/20 text-center align-middle w-[160px] min-w-[160px] max-w-[160px]">
                            Semester {sem}
                          </th>
                        ))}
                      </tr>
                    </thead>
                <tbody className="divide-y divide-slate-100">
                  {cplList.map(cpl => {
                    const mappingsForCpl = data.filter(item => item.id_cpl === cpl.id_cpl);
                    
                    // Group by CPMK
                    const cpmkMap = new Map();
                    mappingsForCpl.forEach(m => {
                      if (!cpmkMap.has(m.id_cpmk)) {
                        cpmkMap.set(m.id_cpmk, {
                          cpmkKode: m.kode_cpmk || '-',
                          cpmkDesc: m.deskripsi_cpmk || '-',
                          id_cpmk: m.id_cpmk,
                          mks: []
                        });
                      }
                      cpmkMap.get(m.id_cpmk).mks.push(m);
                    });
                    
                    const cpmkArray = Array.from(cpmkMap.values());
                    
                    if (cpmkArray.length === 0) {
                      return (
                        <tr key={cpl.id_cpl} className="hover:bg-blue-50/80 transition-colors group">
                          <td className="px-4 py-3 border-r border-slate-200 bg-white group-hover:bg-slate-50/80 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0] transition-colors">
                            <div className="font-black text-slate-900 text-sm">{cpl.kode_cpl || '-'}</div>
                            <div className="text-[10px] text-slate-500 mt-1 font-medium">{cpl.deskripsi_cpl || '-'}</div>
                          </td>
                          <td className="px-4 py-3 border-r border-slate-200 align-middle text-center bg-white group-hover:bg-slate-50/80 sticky left-[260px] z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0] transition-colors">
                            <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleAddMapping(cpl)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition shadow-sm">
                                <Plus size={14} />
                                Tambah Pemetaan
                              </button>
                            </div>
                          </td>
                          {displaySemesters.map(sem => (
                            <td key={sem} className="px-4 py-3 border-r border-slate-200 text-center w-[160px] min-w-[160px] max-w-[160px]"></td>
                          ))}
                        </tr>
                      );
                    }
                    
                    return cpmkArray.map((cpmkGroup, index) => (
                      <tr key={`${cpl.id_cpl}-${cpmkGroup.id_cpmk}`} className="hover:bg-blue-50/80 transition-colors group">
                        {index === 0 && (
                          <td rowSpan={cpmkArray.length} className="px-4 py-3 border-r border-slate-200 bg-white group-hover:bg-slate-50/80 align-top sticky left-0 z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0] transition-colors">
                            <div className="font-black text-slate-900 text-sm">{cpl.kode_cpl || '-'}</div>
                            <div className="text-[10px] text-slate-500 mt-1 font-medium">{cpl.deskripsi_cpl || '-'}</div>
                          </td>
                        )}
                        <td className="px-4 py-3 border-r border-slate-200 align-top bg-white group-hover:bg-slate-50/80 sticky left-[260px] z-10 w-[260px] min-w-[260px] max-w-[260px] shadow-[inset_-1px_0_0_0_#e2e8f0] transition-colors group">
                          <div className="font-bold text-slate-800 text-sm">{cpmkGroup.cpmkKode}</div>
                          <div className="text-[10px] text-slate-500 mt-1 mb-6">{cpmkGroup.cpmkDesc}</div>
                          
                          <div className="mt-3">
                            <button onClick={() => handleEditGroup(cpl, cpmkGroup)} className="inline-flex items-center gap-1.5 px-3 py-1.5 w-full justify-center bg-white text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-50 hover:border-blue-200 transition border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100">
                              <Edit size={12} />
                              Atur MK
                            </button>
                          </div>
                        </td>
                        {displaySemesters.map(sem => {
                          const mksInSem = cpmkGroup.mks.filter(m => parseInt(m.semester) === sem);
                          return (
                            <td key={sem} className="px-4 py-3 border-r border-slate-200 align-top w-[160px] min-w-[160px] max-w-[160px]">
                              {mksInSem.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                  {mksInSem.map(mk => (
                                    <div key={mk.id_2b3} className="bg-blue-900/80 border border-blue-800 rounded-lg p-2.5 transition-colors hover:bg-blue-900/80">
                                      <div className="text-xs font-black text-blue-200">{mk.kode_mk || '-'}</div>
                                      <div className="text-[10px] text-violet-600 leading-tight mt-0.5">{mk.nama_mk || '-'}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
              );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
