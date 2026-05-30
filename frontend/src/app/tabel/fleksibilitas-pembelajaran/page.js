'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, RotateCcw, Trash, Monitor, Link as LinkIcon, ExternalLink, Activity, Info } from 'lucide-react';

export default function FleksibilitasPembelajaranPage() {
  const router = useRouter();

  // Auth & Roles States
  const [userRole, setUserRole] = useState('');
  const [prodiLock, setProdiLock] = useState(null); // 'PRODI-TI', 'PRODI-MI' or null

  // Data States
  const [masterProdi, setMasterProdi] = useState([]);
  const [masterTahun, setMasterTahun] = useState([]);
  const [masterBentuk, setMasterBentuk] = useState([]);

  const [borangHeaders, setBorangHeaders] = useState([]);
  const [borangRows, setBorangRows] = useState([]);
  const [borangMhsAktif, setBorangMhsAktif] = useState([]);

  const [activeData, setActiveData] = useState([]);
  const [trashData, setTrashData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahunTS, setFilterTahunTS] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    id_bentuk: '',
    jumlah_mhs: '',
    link_bukti: '',
  });

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  // 1. Initial Auth & Role Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUserRole(userData.unit || '');

        // Enforce role locks (using loose checks aligned with master pages)
        const username = (userData.username || '').toUpperCase();
        const unit = (userData.unit || '').toUpperCase();

        if (username.includes('PRODI-TI') || unit.includes('PRODI-TI') || username.includes('PRODITI') || unit.includes('PRODITI') || username === 'TI' || unit === 'TI') {
          setProdiLock('PRODI-TI');
          setFilterProdi('1'); // TI maps to id_prodi = 1
        } else if (username.includes('PRODI-MI') || unit.includes('PRODI-MI') || username.includes('PRODIMI') || unit.includes('PRODIMI') || username === 'MI' || unit === 'MI') {
          setProdiLock('PRODI-MI');
          setFilterProdi('2'); // MI maps to id_prodi = 2
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [router]);

  // 2. Load from localStorage if masters are loaded
  useEffect(() => {
    if (masterProdi.length > 0 && (!filterProdi || filterProdi === '')) {
      const savedProdi = localStorage.getItem('fleksibilitas_filterProdi');
      if (savedProdi && masterProdi.some(p => p.id_prodi.toString() === savedProdi)) {
        if (!prodiLock) setFilterProdi(savedProdi);
      } else {
        const tiProdi = masterProdi.find(p => p.nama_prodi.includes('Teknik Informatika'));
        if (tiProdi && !prodiLock) {
          setFilterProdi(tiProdi.id_prodi.toString());
          localStorage.setItem('fleksibilitas_filterProdi', tiProdi.id_prodi.toString());
        }
      }
    }
  }, [masterProdi, filterProdi, prodiLock]);

  useEffect(() => {
    if (masterTahun.length > 0 && (!filterTahunTS || filterTahunTS === '')) {
      const savedTahun = localStorage.getItem('fleksibilitas_filterTahunTS');
      if (savedTahun && masterTahun.some(t => t.id_tahun.toString() === savedTahun)) {
        setFilterTahunTS(savedTahun);
      } else {
        const firstTahun = masterTahun[0].id_tahun.toString();
        setFilterTahunTS(firstTahun);
        localStorage.setItem('fleksibilitas_filterTahunTS', firstTahun);
      }
    }
  }, [masterTahun, filterTahunTS]);

  // 3. Fetch Data trigger when filterProdi or filterTahunTS updates
  useEffect(() => {
    if (filterProdi || prodiLock || filterTahunTS === '') {
      fetchData();
    }
  }, [filterProdi, filterTahunTS]);

  // Fetch Data function
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const baseUrl = 'http://localhost:5000/api/prodi/2c-fleksibilitas';
      const params = `?id_prodi=${filterProdi}&id_tahun_ts=${filterTahunTS}`;

      const [activeRes, trashRes] = await Promise.all([
        fetch(`${baseUrl}${params}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/trash?id_prodi=${filterProdi}`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const activeResult = await activeRes.json();
      const trashResult = await trashRes.json();

      if (activeResult.success) {
        // Populasikan masters jika masih kosong
        if (masterProdi.length === 0) {
          const sortedYears = [...(activeResult.master?.tahun || [])].sort((a, b) => {
            const valA = String(a.tahun || '');
            const valB = String(b.tahun || '');
            return valA.localeCompare(valB);
          });
          setMasterProdi(activeResult.master?.prodi || []);
          setMasterTahun(sortedYears);
          setMasterBentuk(activeResult.master?.bentuk || []);

          // Form default values
          setFormData(prev => ({
            ...prev,
            id_prodi: filterProdi || (activeResult.master?.prodi[0]?.id_prodi?.toString() || ''),
            id_tahun: sortedYears[0]?.id_tahun?.toString() || '',
            id_bentuk: activeResult.master?.bentuk[0]?.id_bentuk?.toString() || '',
          }));
        }

        // Simpan borang dan transaksi aktif
        setBorangHeaders(activeResult.borang?.tahunHeaders || []);
        setBorangRows(activeResult.borang?.barisBentuk || []);
        setBorangMhsAktif(activeResult.borang?.mhsAktif || []);
        setActiveData(activeResult.data || []);
      }

      if (trashResult.success) {
        setTrashData(trashResult.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Gagal memuat data fleksibilitas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const jumlah_mhs = parseInt(formData.jumlah_mhs) || 0;

    // Front-end Validation Block: Check against active student limits
    const limitObj = borangMhsAktif.find(m => m.id_tahun === parseInt(formData.id_tahun));
    const totalAktif = limitObj ? limitObj.total_aktif : 0;

    if (jumlah_mhs > totalAktif) {
      showError(`Gagal! Jumlah mahasiswa (${jumlah_mhs}) melebihi total mahasiswa aktif (${totalAktif}) di Tabel 2.A.1.`);
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/prodi/2c-fleksibilitas/${editingId}`
      : 'http://localhost:5000/api/prodi/2c-fleksibilitas';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_prodi: parseInt(formData.id_prodi),
          id_tahun: parseInt(formData.id_tahun),
          id_bentuk: parseInt(formData.id_bentuk),
          jumlah_mhs: jumlah_mhs,
          link_bukti: formData.link_bukti || '',
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
        resetForm();
      } else {
        showError(result.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      showError('Terjadi kesalahan koneksi server');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id_2c);
    setFormData({
      id_prodi: item.id_prodi.toString(),
      id_tahun: item.id_tahun.toString(),
      id_bentuk: item.id_bentuk.toString(),
      jumlah_mhs: item.jumlah_mhs.toString(),
      link_bukti: item.link_bukti || '',
    });
    setShowForm(true);
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Pindahkan data fleksibilitas ini ke tempat sampah?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2c-fleksibilitas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
      } else {
        showError(result.message || 'Gagal menghapus data');
      }
    } catch (err) {
      showError('Terjadi kesalahan server');
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2c-fleksibilitas/restore/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
      } else {
        showError(result.message || 'Gagal memulihkan data');
      }
    } catch (err) {
      showError('Terjadi kesalahan server');
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('HAPUS PERMANEN? Tindakan ini tidak dapat dibatalkan.')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/prodi/2c-fleksibilitas/hard/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchData();
      } else {
        showError(result.message || 'Gagal menghapus permanen');
      }
    } catch (err) {
      showError('Terjadi kesalahan server');
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || (masterProdi[0]?.id_prodi?.toString() || ''),
      id_tahun: masterTahun[0]?.id_tahun?.toString() || '',
      id_bentuk: masterBentuk[0]?.id_bentuk?.toString() || '',
      jumlah_mhs: '',
      link_bukti: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/prodi/2c-fleksibilitas/export?id_prodi=${filterProdi}&id_tahun_ts=${filterTahunTS}&token=${token}`, '_blank');
  };

  // Perhitungan Borang Sums & Percentages
  const columnTotals = borangHeaders.map(th => {
    return borangRows.reduce((sum, row) => sum + (row.values[th.id_tahun] || 0), 0);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fleksibilitas Pembelajaran (2.C)</h1>
              <p className="text-slate-500 mt-1 font-medium">Bentuk pembelajaran yang memberikan fleksibilitas / pemenuhan SKS mahasiswa</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-slate-900 px-5 py-2.5 rounded-xl hover:bg-violet-700 transition shadow-lg shadow-violet-200/50 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
              </button>
              <Button onClick={handleExport} variant="success">
                <Download size={18} />
                <span>Export Excel</span>
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium animate-in fade-in duration-300 flex items-center gap-2">
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative z-10 flex items-center gap-3 w-full">
              <div className="text-violet-600 shrink-0">
                <Activity size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0">Total Transaksi</p>
                <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                <p className="text-sm font-black text-slate-800 tracking-tight truncate">{activeData.length}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative z-10 flex items-center gap-3 w-full">
              <div className="text-emerald-600 shrink-0">
                <Monitor size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0">Bentuk Belajar</p>
                <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                <p className="text-sm font-black text-slate-800 tracking-tight truncate">{masterBentuk.length}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="relative overflow-hidden group h-[44px] !p-0 px-4 flex items-center border-transparent shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative z-10 flex items-center gap-3 w-full">
              <div className="text-orange-600 shrink-0">
                <Trash size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest shrink-0">Sampah</p>
                <div className="h-3 w-px bg-slate-200 shrink-0"></div>
                <p className="text-sm font-black text-slate-800 tracking-tight truncate">{trashData.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 mb-8 items-end w-full">
          <div className="w-full sm:w-[280px]">
            <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Program Studi</label>
            <div className="relative">
              <select
                disabled={!!prodiLock}
                value={filterProdi}
                onChange={(e) => {
                  setFilterProdi(e.target.value);
                  localStorage.setItem('fleksibilitas_filterProdi', e.target.value);
                }}
                className={`w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium shadow-sm outline-none transition-all cursor-pointer ${prodiLock
                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                    : 'text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'
                  }`}
              >
                {prodiLock ? (
                  <option value={filterProdi}>🔒 {prodiLock === 'PRODI-TI' ? 'TEKNIK INFORMATIKA' : 'MANAJEMEN INFORMATIKA'}</option>
                ) : (
                  <>
                    <option value="">-- Pilih Prodi --</option>
                    {masterProdi.map(p => (
                      <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                    ))}
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-[150px]">
            <label className="text-[0.75rem] font-bold text-slate-500 mb-2 block uppercase tracking-wider">Tahun TS (Latest)</label>
            <div className="relative">
              <select
                value={filterTahunTS}
                onChange={(e) => {
                  setFilterTahunTS(e.target.value);
                  localStorage.setItem('fleksibilitas_filterTahunTS', e.target.value);
                }}
                className="w-full h-[44px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[0.9rem] font-medium text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:border-slate-300"
              >
                <option value="">-- Pilih Tahun --</option>
                {masterTahun.map(t => (
                  <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800 font-bold">
                <svg className="h-4 w-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <Button onClick={fetchData} variant="outline" className="h-[44px] px-4 shrink-0" title="Refresh Data">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={() => setShowTrash(!showTrash)} variant={showTrash ? 'destructive' : 'outline'} className="h-[44px] px-4 shrink-0 gap-2" title={showTrash ? "Tampilkan Data Aktif" : "Lihat Data Sampah"}>
            <Trash size={18} />
            <span className="font-bold text-sm hidden sm:inline">{showTrash ? "Lihat Aktif" : "Lihat Sampah"}</span>
          </Button>
        </div>

        {/* Input Form Section */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border-r border-slate-200 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 mb-6">{editingId ? 'Edit Data Fleksibilitas' : 'Input Data Fleksibilitas Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Program Studi</label>
                  <select
                    disabled={!!prodiLock}
                    value={formData.id_prodi}
                    onChange={(e) => setFormData({ ...formData, id_prodi: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-r border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900 cursor-pointer"
                  >
                    {masterProdi.map(p => (
                      <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Tahun Akademik</label>
                  <select
                    value={formData.id_tahun}
                    onChange={(e) => setFormData({ ...formData, id_tahun: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-r border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900 cursor-pointer"
                  >
                    {masterTahun.map(t => (
                      <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Bentuk Pembelajaran</label>
                  <select
                    value={formData.id_bentuk}
                    onChange={(e) => setFormData({ ...formData, id_bentuk: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-r border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900 cursor-pointer"
                  >
                    {masterBentuk.map(b => (
                      <option key={b.id_bentuk} value={b.id_bentuk}>{b.nama_bentuk}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Jumlah Mahasiswa</label>
                  <input
                    type="number"
                    value={formData.jumlah_mhs}
                    onChange={(e) => setFormData({ ...formData, jumlah_mhs: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-r border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900"
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-600 mb-2">Link Bukti Pembelajaran (URL)</label>
                  <input
                    type="url"
                    value={formData.link_bukti}
                    onChange={(e) => setFormData({ ...formData, link_bukti: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-r border-slate-200 focus:border-blue-500 rounded-2xl outline-none transition font-medium text-slate-900"
                    placeholder="Contoh: https://link-sertifikat-atau-bukti.com"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs transition">
                  Batal
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-violet-700 text-slate-900 px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-lg transition">
                  {editingId ? 'Simpan Perubahan' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Matrix Table (Borang style) */}
        {!showTrash && (
          <div className="bg-white rounded-2xl border-r border-slate-200 overflow-hidden shadow-2xl mb-8">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">Preview Borang Fleksibilitas Pembelajaran (2.C)</h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
                <RefreshCw className="animate-spin text-emerald-500" size={32} />
                <span className="font-bold text-sm uppercase tracking-wider">Mempersiapkan Borang...</span>
              </div>
            ) : borangHeaders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">
                Pilih Program Studi atau Tahun TS untuk memuat matriks laporan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-center whitespace-nowrap border-collapse">
                  <thead className="bg-[#1E3A8A]">
                    <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                      <th rowSpan="2" className="px-6 py-4 border-r border-white/20 text-left w-[30%] align-middle">Tahun Akademik</th>
                      {borangHeaders.map((th, idx) => {
                        const label = idx === 2 ? 'TS' : `TS-${2 - idx}`;
                        return (
                          <th key={th.id_tahun} className="px-6 py-5 border-r border-white/20 align-middle">
                            {th.tahun} ({label})
                          </th>
                        );
                      })}
                      <th rowSpan="2" className="px-6 py-5 border-r border-white/20 align-middle">Link Bukti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Baris Jumlah Mahasiswa Aktif */}
                    <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-900">
                      <td className="px-6 py-4 border-r border-slate-200 text-left font-black text-slate-700">
                        Jumlah Mahasiswa Aktif
                      </td>
                      {borangHeaders.map(th => {
                        const mhs = borangMhsAktif.find(m => m.id_tahun === th.id_tahun);
                        return (
                          <td key={th.id_tahun} className="px-4 py-4 border-r border-slate-200 font-black text-violet-600">
                            {mhs ? mhs.total_aktif : 0}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 border-r border-slate-200"></td>
                    </tr>

                    {/* Baris Judul Bentuk */}
                    <tr className="bg-slate-50/40 text-[10px] font-black uppercase text-slate-400 tracking-widest text-left">
                      <td colSpan={borangHeaders.length + 2} className="px-6 py-2.5 border-r border-slate-200 italic">
                        Bentuk Pembelajaran (Jumlah mahasiswa untuk setiap bentuk pembelajaran)
                      </td>
                    </tr>

                    {/* Baris Data Bentuk */}
                    {borangRows.map(b => {
                      let links = [];
                      return (
                        <tr key={b.id_bentuk} className="hover:bg-violet-50/40 even:bg-slate-50/40 border-b border-slate-200 transition-colors text-slate-700">
                          <td className="px-6 py-4 border-r border-slate-200 text-left font-medium pl-8 text-slate-500">
                            {b.nama_bentuk}
                          </td>
                          {borangHeaders.map(th => {
                            const val = b.values[th.id_tahun] || 0;
                            const foundTrans = activeData.find(d => d.id_bentuk === b.id_bentuk && d.id_tahun === th.id_tahun);
                            if (foundTrans && foundTrans.link_bukti && foundTrans.link_bukti !== '-') {
                              links.push(foundTrans.link_bukti);
                            }
                            return (
                              <td key={th.id_tahun} className="px-4 py-4 border-r border-slate-200 font-black">
                                {val}
                              </td>
                            );
                          })}
                          <td className="px-6 py-4 border-r border-slate-200 text-left">
                            {links.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {Array.from(new Set(links)).map((l, i) => (
                                  <a
                                    key={i}
                                    href={l}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-violet-600 hover:underline max-w-[150px] truncate"
                                  >
                                    <LinkIcon size={10} />
                                    <span>Bukti {i + 1}</span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Footer Jumlah */}
                    <tr className="bg-slate-50 font-bold border-b border-slate-200 text-slate-800">
                      <td className="px-6 py-4 border-r border-slate-200 text-left font-black uppercase text-[10px]">
                        Jumlah
                      </td>
                      {columnTotals.map((tot, idx) => (
                        <td key={idx} className="px-4 py-4 border-r border-slate-200 font-black text-emerald-400">
                          {tot}
                        </td>
                      ))}
                      <td className="px-6 py-4 border-r border-slate-200"></td>
                    </tr>

                    {/* Footer Persentase */}
                    <tr className="bg-slate-100 font-bold border-b border-slate-200 text-slate-800">
                      <td className="px-6 py-4 border-r border-slate-200 text-left font-black uppercase text-[10px]">
                        Persentase (%)
                      </td>
                      {columnTotals.map((tot, idx) => {
                        const th = borangHeaders[idx];
                        const limitObj = borangMhsAktif.find(m => m.id_tahun === th?.id_tahun);
                        const totalAktif = limitObj ? limitObj.total_aktif : 0;
                        const pct = totalAktif > 0 ? ((tot / totalAktif) * 100).toFixed(2) : '0.00';
                        return (
                          <td key={idx} className="px-4 py-4 border-r border-slate-200 font-black text-violet-600">
                            {pct}%
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 border-r border-slate-200"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* History Table (Active List or Trash List) */}
        <div className="bg-white rounded-2xl border-r border-slate-200 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
              {showTrash ? 'Tempat Sampah Data Fleksibilitas (2.C)' : 'Riwayat Input Pengisian Data (2.C)'}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
              <RefreshCw className="animate-spin text-blue-500" size={32} />
              <span className="font-bold text-sm uppercase tracking-wider">Memuat Riwayat...</span>
            </div>
          ) : (showTrash ? trashData : activeData).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Monitor size={48} className="mb-4 text-gray-700" />
              <p className="font-bold text-lg text-slate-500 uppercase tracking-widest">Tidak Ada Data</p>
              <p className="text-slate-400 text-sm mt-1">{showTrash ? 'Tempat sampah kosong.' : 'Belum ada riwayat transaksi pengisian.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-center whitespace-nowrap border-collapse">
                <thead className="bg-[#1E3A8A]">
                  <tr className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                    <th className="px-6 py-4 border-r border-white/20">No</th>
                    <th className="px-6 py-4 border-r border-white/20 text-left min-w-[200px]">Program Studi</th>
                    <th className="px-6 py-4 border-r border-white/20">Tahun Akademik</th>
                    <th className="px-6 py-4 border-r border-white/20 text-left">Bentuk Pembelajaran</th>
                    <th className="px-6 py-4 border-r border-white/20">Jumlah Mahasiswa</th>
                    <th className="px-6 py-4 border-r border-white/20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(showTrash ? trashData : activeData).map((item, idx) => (
                    <tr key={item.id_2c} className="hover:bg-violet-50/40 even:bg-slate-50/40 border-b border-slate-200 transition-colors group text-slate-700">
                      <td className="px-4 py-4 border-r border-slate-200 font-black">{idx + 1}</td>
                      <td className="px-6 py-4 border-r border-slate-200 text-left font-black text-slate-900">{item.nama_prodi || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-200 font-black text-violet-600 text-xs tracking-wider">{item.tahun || '-'}</td>
                      <td className="px-6 py-4 border-r border-slate-200 text-left font-bold text-slate-500">{item.nama_bentuk || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-200 font-black text-slate-900">{item.jumlah_mhs || 0}</td>
                      <td className="px-4 py-4 border-r border-slate-200">
                        <div className="flex items-center justify-center gap-3">
                          {!showTrash ? (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-1.5 bg-slate-50/80 hover:bg-blue-900/40 border-r border-slate-200 hover:border-blue-900/60 rounded-lg text-slate-500 hover:text-violet-600 transition"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleSoftDelete(item.id_2c)}
                                className="p-1.5 bg-slate-50/80 hover:bg-red-900/40 border-r border-slate-200 hover:border-red-900/60 rounded-lg text-slate-500 hover:text-red-400 transition"
                                title="Hapus ke Sampah"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(item.id_2c)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-slate-50/80 hover:bg-emerald-900/40 border-r border-slate-200 hover:border-emerald-900/60 rounded-lg text-slate-500 hover:text-emerald-400 text-xs font-bold transition"
                                title="Restore"
                              >
                                <RotateCcw size={12} />
                                <span>Pulihkan</span>
                              </button>
                              <button
                                onClick={() => handleHardDelete(item.id_2c)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-slate-50/80 hover:bg-red-900/40 border-r border-slate-200 hover:border-red-900/60 rounded-lg text-slate-500 hover:text-red-400 text-xs font-bold transition"
                                title="Hapus Permanen"
                              >
                                <Trash size={12} />
                                <span>Hapus</span>
                              </button>
                            </>
                          )}
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
