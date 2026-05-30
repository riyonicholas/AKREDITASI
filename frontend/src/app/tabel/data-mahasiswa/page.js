'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Download, RefreshCw, Edit, Trash2, Users, BookOpen, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DataMahasiswaPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('main'); // 'main' or 'trash'
  const [trashData, setTrashData] = useState([]);
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    daya_tampung: '',
    pendaftar: '',
    pendaftar_afirmasi: '',
    pendaftar_khusus: '',
    maba_reg_diterima: '',
    maba_reg_afirmasi: '',
    maba_reg_khusus: '',
    maba_rpl_diterima: '',
    maba_rpl_afirmasi: '',
    maba_rpl_khusus: '',
    aktif_reg_diterima: '',
    aktif_reg_afirmasi: '',
    aktif_reg_khusus: '',
    aktif_rpl_diterima: '',
    aktif_rpl_afirmasi: '',
    aktif_rpl_khusus: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      // Set user role based on token/user object correctly
      let detectedRole = 'pmb'; // default
      try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        if (userObj.role) {
          detectedRole = userObj.role.toLowerCase();
        } else if (userObj.username) {
          detectedRole = userObj.username.toLowerCase();
        } else {
          detectedRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
        }
      } catch (e) {
        detectedRole = 'pmb';
      }

      localStorage.setItem('userRole', detectedRole);

      fetchProdiList();
      fetchTahunList();
    }
  }, [router]);

  useEffect(() => {
    if (prodiList.length > 0 && (!filterProdi || filterProdi === '')) {
      const savedProdi = localStorage.getItem('dataMahasiswa_filterProdi');
      if (savedProdi && prodiList.some(p => p.id_prodi.toString() === savedProdi)) {
        setFilterProdi(savedProdi);
      } else {
        const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (tiProdi) {
          setFilterProdi(tiProdi.id_prodi.toString());
          localStorage.setItem('dataMahasiswa_filterProdi', tiProdi.id_prodi.toString());
        }
      }
    }
  }, [prodiList]);

  useEffect(() => {
    if (tahunList.length > 0 && (!filterTahun || filterTahun === '')) {
      const savedTahun = localStorage.getItem('dataMahasiswa_filterTahun');
      if (savedTahun && tahunList.some(t => t.id_tahun.toString() === savedTahun)) {
        setFilterTahun(savedTahun);
      } else {
        const latestTahun = tahunList.length > 0 ? tahunList[0].id_tahun.toString() : '';
        setFilterTahun(latestTahun);
        if(latestTahun) localStorage.setItem('dataMahasiswa_filterTahun', latestTahun);
      }
    }
  }, [tahunList]);

  useEffect(() => {
    if (filterProdi) {
      if (viewMode === 'main') fetchData();
      else fetchTrashData();
    }
  }, [filterProdi, viewMode]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Detect user role from localStorage or token
      const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();

      // Use appropriate endpoint based on user role
      const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/${filterProdi}`, {
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

  const fetchTrashData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
      const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/trash/${filterProdi}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setTrashData(result.data || []);
    } catch (err) {
      console.error('Error fetching trash data:', err);
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
      if (result.success) setProdiList(result.data || []);
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
      if (result.success) setTahunList(result.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun)));
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();

    // Log untuk debugging
    console.log('User Role:', userRole);
    console.log('Form Data:', formData);

    try {
      let successPmb = true;
      let successAla = true;
      let message = '';

      // Prepare PMB payload
      const pmbPayload = {
        id_prodi: formData.id_prodi || null,
        id_tahun: formData.id_tahun || null,
        daya: formData.daya_tampung || null,
        pendaftar: formData.pendaftar || null,
        p_afirmasi: formData.pendaftar_afirmasi || null,
        p_khusus: formData.pendaftar_khusus || null,
        reg_in: formData.maba_reg_diterima || null,
        reg_af: formData.maba_reg_afirmasi || null,
        reg_ks: formData.maba_reg_khusus || null,
        rpl_in: formData.maba_rpl_diterima || null,
        rpl_af: formData.maba_rpl_afirmasi || null,
        rpl_ks: formData.maba_rpl_khusus || null,
        user_id: 1, // Hardcoded for now, should come from auth
      };

      // Prepare ALA payload
      const alaPayload = {
        id_prodi: formData.id_prodi || null,
        id_tahun: formData.id_tahun || null,
        a_reg_in: formData.aktif_reg_diterima || null,
        a_reg_af: formData.aktif_reg_afirmasi || null,
        a_reg_ks: formData.aktif_reg_khusus || null,
        a_rpl_in: formData.aktif_rpl_diterima || null,
        a_rpl_af: formData.aktif_rpl_afirmasi || null,
        a_rpl_ks: formData.aktif_rpl_khusus || null,
        user_id: 1, // Hardcoded for now, should come from auth
      };

      if (userRole === 'admin' || userRole === 'pmb') {
        console.log('Sending request to PMB endpoint...');
        const resPmb = await fetch(`http://localhost:5000/api/pmb/2a1-data-mahasiswa/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(pmbPayload),
        });
        const resultPmb = await resPmb.json();
        successPmb = resultPmb.success;
        if (!message) message = resultPmb.message;
        if (!resultPmb.success) console.error('PMB Error:', resultPmb.message);
      }

      if (userRole === 'admin' || userRole === 'ala') {
        console.log('Sending request to ALA endpoint...');
        const resAla = await fetch(`http://localhost:5000/api/ala/2a1-data-mahasiswa/store`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(alaPayload),
        });
        const resultAla = await resAla.json();
        successAla = resultAla.success;
        if (!message || userRole === 'ala') message = resultAla.message;
        if (!resultAla.success) console.error('ALA Error:', resultAla.message);
      }

      if (successPmb && successAla) {
        alert(userRole === 'admin' ? 'Data berhasil disimpan' : message);
        fetchData();
        resetForm();
      } else {
        alert('Terjadi kesalahan saat menyimpan data');
      }
    } catch (err) {
      console.error('Error saving data:', err);
      console.error('Error details:', err.message);
      alert('Gagal menyimpan data: ' + err.message);
    }
  };

  const handleAddForYear = (targetYear) => {
    const tObj = tahunList.find(t => parseInt(t.tahun) === targetYear);
    if (!tObj) {
      alert(`Tahun Akademik ${targetYear} belum terdaftar di Master Data Tahun. Silakan tambah tahun tersebut terlebih dahulu.`);
      return;
    }
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: tObj.id_tahun,
      daya_tampung: '',
      pendaftar: '', pendaftar_afirmasi: '', pendaftar_khusus: '',
      maba_reg_diterima: '', maba_reg_afirmasi: '', maba_reg_khusus: '',
      maba_rpl_diterima: '', maba_rpl_afirmasi: '', maba_rpl_khusus: '',
      aktif_reg_diterima: '', aktif_reg_afirmasi: '', aktif_reg_khusus: '',
      aktif_rpl_diterima: '', aktif_rpl_afirmasi: '', aktif_rpl_khusus: '',
    });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddMain = () => {
    if (showForm) {
      setShowForm(false);
      resetForm();
      return;
    }
    const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
    const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
    const anchorTahunObj = tahunList.find(t => parseInt(t.tahun) === anchorYear);

    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: anchorTahunObj ? anchorTahunObj.id_tahun : '',
      daya_tampung: '',
      pendaftar: '', pendaftar_afirmasi: '', pendaftar_khusus: '',
      maba_reg_diterima: '', maba_reg_afirmasi: '', maba_reg_khusus: '',
      maba_rpl_diterima: '', maba_rpl_afirmasi: '', maba_rpl_khusus: '',
      aktif_reg_diterima: '', aktif_reg_afirmasi: '', aktif_reg_khusus: '',
      aktif_rpl_diterima: '', aktif_rpl_afirmasi: '', aktif_rpl_khusus: '',
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData({
      id_prodi: item.prodi_id_prodi || filterProdi || '',
      id_tahun: item.tahun_akademik_id_tahun || filterTahun || '',
      daya_tampung: item.daya_tampung || '',
      pendaftar: item.pendaftar || '',
      pendaftar_afirmasi: item.pendaftar_afirmasi || '',
      pendaftar_khusus: item.pendaftar_khusus || '',
      maba_reg_diterima: item.maba_reg_diterima || '',
      maba_reg_afirmasi: item.maba_reg_afirmasi || '',
      maba_reg_khusus: item.maba_reg_khusus || '',
      maba_rpl_diterima: item.maba_rpl_diterima || '',
      maba_rpl_afirmasi: item.maba_rpl_afirmasi || '',
      maba_rpl_khusus: item.maba_rpl_khusus || '',
      aktif_reg_diterima: item.aktif_reg_diterima || '',
      aktif_reg_afirmasi: item.aktif_reg_afirmasi || '',
      aktif_reg_khusus: item.aktif_reg_khusus || '',
      aktif_rpl_diterima: item.aktif_rpl_diterima || '',
      aktif_rpl_afirmasi: item.aktif_rpl_afirmasi || '',
      aktif_rpl_khusus: item.aktif_rpl_khusus || '',
    });
    setEditingId(item.id_2a1);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_2a1: id, user_id: 1 })
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
      fetchTrashData();
    } catch (err) {
      console.error('Error deleting data:', err);
      alert('Gagal menghapus data');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchData();
      fetchTrashData();
    } catch (err) {
      console.error('Error restoring data:', err);
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('Peringatan: Data akan dihapus PERMANEN dari database. Lanjutkan?')) return;
    
    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/hard-delete/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      fetchTrashData();
    } catch (err) {
      console.error('Error hard deleting data:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      daya_tampung: '',
      pendaftar: '',
      pendaftar_afirmasi: '',
      pendaftar_khusus: '',
      maba_reg_diterima: '',
      maba_reg_afirmasi: '',
      maba_reg_khusus: '',
      maba_rpl_diterima: '',
      maba_rpl_afirmasi: '',
      maba_rpl_khusus: '',
      aktif_reg_diterima: '',
      aktif_reg_afirmasi: '',
      aktif_reg_khusus: '',
      aktif_rpl_diterima: '',
      aktif_rpl_afirmasi: '',
      aktif_rpl_khusus: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    const userRole = (localStorage.getItem('userRole') || 'pmb').toLowerCase();
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
    window.open(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/export/${filterProdi}?token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => router.push('/tabel')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Data Mahasiswa (2.A.1)</h1>
              <p className="text-slate-500 mt-1 font-medium">Pengelolaan data mahasiswa aktif dan statistik akademik</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAddMain}>
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
              </Button>
              <Button onClick={handleExport} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-blue-600 shrink-0">
                  <Users size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Total Mahasiswa</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Total</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{data.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="text-emerald-600 shrink-0">
                  <BookOpen size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden xl:block">Tahun Aktif</p>
                  <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0 xl:hidden">Tahun</p>
                  <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">{tahunList.find(t => t.id_tahun.toString() === filterTahun?.toString())?.tahun || filterTahun || '-'}</p>
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
                    localStorage.setItem('dataMahasiswa_filterProdi', e.target.value);
                  }} 
                  className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
                >
                  <option value="">Pilih Prodi</option>
                  {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                  <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-[150px]">
              <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Anchor (TS)</label>
              <div className="relative">
                <select 
                  value={filterTahun} 
                  onChange={(e) => {
                    setFilterTahun(e.target.value);
                    localStorage.setItem('dataMahasiswa_filterTahun', e.target.value);
                  }} 
                  className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
                >
                  <option value="">Otomatis</option>
                  {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                  <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <Button onClick={viewMode === 'main' ? fetchData : fetchTrashData} variant="outline" className="h-[44px] px-4 shrink-0" title="Refresh Data">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setViewMode('main')}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase ${
              viewMode === 'main'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-500'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setViewMode('trash')}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-all uppercase flex items-center gap-2 ${
              viewMode === 'trash'
                ? 'border-b-4 border-red-600 text-red-600'
                : 'text-slate-500 hover:text-red-500'
            }`}
          >
            Trash
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-black">
              {trashData.length}
            </span>
          </button>
        </div>

        {viewMode === 'main' && (
          <>
            {/* Form Section */}
            {showForm && (
          <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 mb-6">{editingId ? 'Edit Data Mahasiswa' : 'Input Data Mahasiswa Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Program Studi</label>
                    <select value={formData.id_prodi} onChange={(e) => setFormData({ ...formData, id_prodi: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" required>
                      <option value="">Pilih Prodi</option>
                      {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Tahun Akademik</label>
                    <select value={formData.id_tahun} onChange={(e) => setFormData({ ...formData, id_tahun: e.target.value })} disabled={true} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-medium opacity-70 cursor-not-allowed appearance-none" required>
                      <option value="">Pilih Tahun</option>
                      {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Daya Tampung</label>
                    <input type="number" value={formData.daya_tampung} onChange={(e) => setFormData({ ...formData, daya_tampung: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-slate-900 mb-4">Jumlah Calon Mahasiswa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Pendaftar</label>
                      <input type="number" value={formData.pendaftar} onChange={(e) => setFormData({ ...formData, pendaftar: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Afirmasi</label>
                      <input type="number" value={formData.pendaftar_afirmasi} onChange={(e) => setFormData({ ...formData, pendaftar_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Kebutuhan Khusus</label>
                      <input type="number" value={formData.pendaftar_khusus} onChange={(e) => setFormData({ ...formData, pendaftar_khusus: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-slate-900 mb-4">Jumlah Mahasiswa Baru</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-md font-bold text-blue-600 mb-3">Reguler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Diterima</label>
                          <input type="number" value={formData.maba_reg_diterima} onChange={(e) => setFormData({ ...formData, maba_reg_diterima: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Afirmasi</label>
                          <input type="number" value={formData.maba_reg_afirmasi} onChange={(e) => setFormData({ ...formData, maba_reg_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.maba_reg_khusus} onChange={(e) => setFormData({ ...formData, maba_reg_khusus: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-blue-600 mb-3">RPL</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Diterima</label>
                          <input type="number" value={formData.maba_rpl_diterima} onChange={(e) => setFormData({ ...formData, maba_rpl_diterima: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Afirmasi</label>
                          <input type="number" value={formData.maba_rpl_afirmasi} onChange={(e) => setFormData({ ...formData, maba_rpl_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.maba_rpl_khusus} onChange={(e) => setFormData({ ...formData, maba_rpl_khusus: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] rounded-2xl outline-none transition-all font-medium appearance-none" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-black text-slate-900 mb-4">Jumlah Mahasiswa Aktif</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-md font-bold text-emerald-600 mb-3">Reguler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Diterima</label>
                          <input type="number" value={formData.aktif_reg_diterima} onChange={(e) => setFormData({ ...formData, aktif_reg_diterima: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Afirmasi</label>
                          <input type="number" value={formData.aktif_reg_afirmasi} onChange={(e) => setFormData({ ...formData, aktif_reg_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.aktif_reg_khusus} onChange={(e) => setFormData({ ...formData, aktif_reg_khusus: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-emerald-600 mb-3">RPL</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Diterima</label>
                          <input type="number" value={formData.aktif_rpl_diterima} onChange={(e) => setFormData({ ...formData, aktif_rpl_diterima: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Afirmasi</label>
                          <input type="number" value={formData.aktif_rpl_afirmasi} onChange={(e) => setFormData({ ...formData, aktif_rpl_afirmasi: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2">Kebutuhan Khusus</label>
                          <input type="number" value={formData.aktif_rpl_khusus} onChange={(e) => setFormData({ ...formData, aktif_rpl_khusus: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-50/80 text-slate-500 rounded-xl hover:bg-slate-200 transition font-medium">
                  Batal
                </button>
                <button type="submit" className="px-6 py-3 bg-blue-600 text-slate-900 rounded-xl hover:bg-violet-700 transition font-medium">
                  {editingId ? 'Update Data' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-bold text-xl tracking-tight">Belum ada data mahasiswa</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-max text-left whitespace-nowrap">
                <thead className="bg-[#1E3A8A]">
                  <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider text-center">
                    <th rowSpan="3" className="px-8 py-5 border-r border-white/20 align-middle">TS</th>
                    <th rowSpan="3" className="px-8 py-5 border-r border-white/20 align-middle">Daya Tampung</th>
                    <th colSpan="3" className="px-8 py-5 border-r border-white/20 align-middle">Jumlah Calon Mahasiswa</th>
                    <th colSpan="6" className="px-8 py-5 border-r border-white/20 align-middle">Jumlah Mahasiswa Baru</th>
                    <th colSpan="6" className="px-8 py-5 border-r border-white/20 align-middle">Jumlah Mahasiswa Aktif</th>
                    <th rowSpan="3" className="px-8 py-5 align-middle">Aksi</th>
                  </tr>
                  <tr className="bg-[#162d6e] text-xs font-bold text-slate-100 text-center">
                    <th rowSpan="2" className="px-6 py-3 border-r border-white/20 align-middle">Pendaftar</th>
                    <th rowSpan="2" className="px-6 py-3 border-r border-white/20 align-middle">Pendaftar<br/>Afirmasi</th>
                    <th rowSpan="2" className="px-6 py-3 border-r border-white/20 align-middle">Pendaftar<br/>Kebutuhan<br/>Khusus</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-white/20">Reguler</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-white/20">RPL</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-white/20">Reguler</th>
                    <th colSpan="3" className="px-6 py-3 border-r border-white/20">RPL</th>
                  </tr>
                  <tr className="bg-[#132761] text-[10px] font-bold text-slate-100 text-center">
                    <th className="px-4 py-2 border-r border-white/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-white/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-white/20">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-white/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-white/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-white/20">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-white/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-white/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-white/20">Kebutuhan Khusus</th>
                    <th className="px-4 py-2 border-r border-white/20">Diterima</th>
                    <th className="px-4 py-2 border-r border-white/20">Afirmasi</th>
                    <th className="px-4 py-2 border-r border-white/20">Kebutuhan Khusus</th>
                  </tr>
                  <tr className="bg-[#0f2152] font-bold text-[9px] text-slate-200 italic text-center">
                    <td className="px-8 py-2 border-r border-white/20">(1)</td>
                    <td className="px-8 py-2 border-r border-white/20">(2)</td>
                    <td className="px-8 py-2 border-r border-white/20">(3)</td>
                    <td className="px-8 py-2 border-r border-white/20">(4)</td>
                    <td className="px-8 py-2 border-r border-white/20">(5)</td>
                    <td className="px-8 py-2 border-r border-white/20">(6)</td>
                    <td className="px-8 py-2 border-r border-white/20">(7)</td>
                    <td className="px-8 py-2 border-r border-white/20">(8)</td>
                    <td className="px-8 py-2 border-r border-white/20">(9)</td>
                    <td className="px-8 py-2 border-r border-white/20">(10)</td>
                    <td className="px-8 py-2 border-r border-white/20">(11)</td>
                    <td className="px-8 py-2 border-r border-white/20">(12)</td>
                    <td className="px-8 py-2 border-r border-white/20">(13)</td>
                    <td className="px-8 py-2 border-r border-white/20">(14)</td>
                    <td className="px-8 py-2 border-r border-white/20">(15)</td>
                    <td className="px-8 py-2">-</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                    const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                    
                    const rows = [];
                    for(let diff = 2; diff >= 0; diff--) {
                      const targetYear = anchorYear - diff;
                      const tsLabel = diff === 0 ? "TS" : `TS-${diff}`;
                      
                      const item = data.find(d => parseInt(d.tahun) === targetYear);
                      
                      if (item) {
                        rows.push(
                          <tr key={item.id_2a1} className="hover:bg-violet-50/40 even:bg-slate-50/40 transition-colors group border-b border-slate-200 bg-white">
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-900">{tsLabel} <span className="text-[9px] text-slate-500 block font-normal">({item.tahun})</span></td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-blue-600">{item.daya_tampung || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50">{item.pendaftar || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50">{item.pendaftar_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50">{item.pendaftar_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50/30">{item.maba_reg_diterima || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50/30">{item.maba_reg_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50/30">{item.maba_reg_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50/30">{item.maba_rpl_diterima || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50/30">{item.maba_rpl_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-blue-50/30">{item.maba_rpl_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-emerald-50">{item.aktif_reg_diterima || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-emerald-50">{item.aktif_reg_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-emerald-50">{item.aktif_reg_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-emerald-50">{item.aktif_rpl_diterima || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-emerald-50">{item.aktif_rpl_afirmasi || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center bg-emerald-50">{item.aktif_rpl_khusus || 0}</td>
                            <td className="px-8 py-4 border-r border-slate-200">
                              <div className="inline-flex items-center bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm transition-all group-hover:border-blue-800 group-hover:shadow-md">
                                <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={17} /></button>
                                <div className="w-px h-4 bg-gray-700 mx-2"></div>
                                <button onClick={() => handleDelete(item.id_2a1)} className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm rounded-lg transition" title="Hapus"><Trash2 size={17} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      } else {
                        rows.push(
                          <tr key={`empty-${targetYear}`} className="bg-slate-50/50 hover:bg-slate-50/80 transition-colors group">
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">{tsLabel} <span className="text-[9px] text-slate-500 block font-normal">({targetYear})</span></td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center font-bold text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 border-r border-slate-200 text-center text-slate-500">0</td>
                            <td className="px-8 py-4 text-center border-r border-slate-200">
                              <button onClick={() => handleAddForYear(targetYear)} className="px-4 py-2 bg-blue-600 text-slate-900 rounded-lg font-bold text-[10px] hover:bg-violet-700 transition uppercase tracking-wider shadow-sm flex items-center justify-center gap-1 mx-auto">
                                <Plus size={17} /> Tambah
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    }
                    return rows;
                  })()}
                </tbody>
                <tfoot className="bg-slate-100/80">
                  <tr className="text-center font-black text-slate-800 border-t-2 border-slate-300">
                    <td className="px-8 py-5 border-r border-slate-200">Jumlah</td>
                    <td className="px-8 py-5 border-r border-slate-200">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.daya_tampung) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.pendaftar) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.pendaftar_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.pendaftar_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_reg_diterima) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_reg_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_reg_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_rpl_diterima) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_rpl_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.maba_rpl_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_reg_diterima) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_reg_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_reg_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_rpl_diterima) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_rpl_afirmasi) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-200 bg-slate-200/30">
                      {data.filter(item => {
                        const selectedTahunObj = tahunList.find(t => t.id_tahun.toString() === filterTahun.toString());
                        const anchorYear = selectedTahunObj ? parseInt(selectedTahunObj.tahun) || new Date().getFullYear() : new Date().getFullYear();
                        return parseInt(item.tahun) <= anchorYear && parseInt(item.tahun) >= anchorYear - 2;
                      }).reduce((a, b) => a + (parseInt(b.aktif_rpl_khusus) || 0), 0)}
                    </td>
                    <td className="px-8 py-5 bg-white border-r border-slate-200"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
            {/* Table Section Ends */}
          </>
        )}

        {/* Trash Section */}
        {viewMode === 'trash' && (
          <div className="bg-red-50 rounded-2xl p-8 border border-red-900/50 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-red-400 tracking-tight">Tempat Sampah</h3>
                <p className="text-sm text-red-500 font-medium">Data yang dihapus sementara dapat dikembalikan atau dihapus permanen.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm shadow-red-100/50 overflow-hidden border border-red-900/50">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/80 border-b border-red-900/50">
                    <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <th className="px-6 py-4 border-r border-white/20">Tahun Akademik</th>
                      <th className="px-6 py-4 border-r border-white/20">Waktu Penghapusan</th>
                      <th className="px-6 py-4 text-center border-r border-white/20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trashData.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center">
                          <p className="text-sm font-bold text-slate-500">Tidak ada data di tempat sampah</p>
                        </td>
                      </tr>
                    ) : (
                      trashData.map((item) => (
                        <tr key={item.id_2a1} className="hover:bg-red-950/30 transition-colors">
                          <td className="px-6 py-4 text-slate-900 border-r border-slate-200">{item.tahun}</td>
                          <td className="px-6 py-4 text-slate-500 font-medium border-r border-slate-200">{new Date().toLocaleDateString('id-ID')}</td>
                          <td className="px-6 py-4 flex items-center justify-center gap-3 border-r border-slate-200">
                            <button
                              onClick={() => handleRestore(item.id_2a1)}
                              className="px-4 py-2 bg-blue-600 text-slate-900 rounded-xl font-bold text-xs hover:bg-violet-700 transition uppercase shadow-lg shadow-violet-200/50"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handleHardDelete(item.id_2a1)}
                              className="px-4 py-2 bg-red-50 text-red-600 border border-red-900/50 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-slate-900 transition uppercase"
                            >
                              Hard Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
