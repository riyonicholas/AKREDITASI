'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Download, RefreshCw, Users, GraduationCap, Calendar, BarChart3 } from 'lucide-react';

export default function DataMahasiswaPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterProdi, setFilterProdi] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  
  const [prodiList, setProdiList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  
  const [formData, setFormData] = useState({
    id_prodi: '',
    id_tahun: '',
    daya_tampung: '',
    jumlah_mahasiswa_aktif_ts: '',
    jumlah_mahasiswa_aktif_ts1: '',
    jumlah_mahasiswa_aktif_ts2: '',
    jumlah_mahasiswa_baru_ts: '',
    jumlah_mahasiswa_baru_ts1: '',
    jumlah_mahasiswa_baru_ts2: '',
    jumlah_mahasiswa_asing_ts: '',
    jumlah_mahasiswa_asing_ts1: '',
    jumlah_mahasiswa_asing_ts2: '',
    jumlah_mahasiswa_transfer_masuk: '',
    jumlah_mahasiswa_transfer_keluar: '',
    ipk_rata_rata_ts: '',
    ipk_rata_rata_ts1: '',
    ipk_rata_rata_ts2: '',
    jumlah_mahasiswa_lulus_ts: '',
    jumlah_mahasiswa_lulus_ts1: '',
    jumlah_mahasiswa_lulus_ts2: '',
    jumlah_mahasiswa_lulus_berprestasi: '',
    rata_rata_masa_studi: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      // Set user role based on token (simulate role detection)
      // In real app, this should come from login response
      const userRole = localStorage.getItem('userRole') || 'pmb'; // Default to pmb
      localStorage.setItem('userRole', userRole);
      
      fetchProdiList();
      fetchTahunList();
    }
  }, [router]);

  useEffect(() => {
    if (prodiList.length > 0 && (!filterProdi || filterProdi === '')) {
      const tiProdi = prodiList.find(p => p.nama_prodi.includes('Teknik Informatika'));
      if (tiProdi) setFilterProdi(tiProdi.id_prodi.toString());
    }
  }, [prodiList, filterProdi]);

  useEffect(() => {
    if (!filterTahun || filterTahun === '') {
      const currentYear = new Date().getFullYear();
      let targetTahun = tahunList.find(t => parseInt(t.tahun) === currentYear);
      if (!targetTahun && tahunList.length > 0) targetTahun = tahunList[tahunList.length - 1];
      if (targetTahun) setFilterTahun(targetTahun.id_tahun.toString());
    }
  }, [tahunList, filterTahun]);

  useEffect(() => {
    if (filterProdi && filterTahun) fetchData();
  }, [filterProdi, filterTahun]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Detect user role from localStorage or token
      const userRole = localStorage.getItem('userRole') || 'pmb'; // Default to pmb
      
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
      if (result.success) setTahunList(result.data.sort((a, b) => parseInt(a.tahun) - parseInt(b.tahun)));
    } catch (err) {
      console.error('Error fetching tahun:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || 'pmb';
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
    
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/store`, {
        method: 'POST',
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
      console.error('Error saving data:', err);
      alert('Gagal menyimpan data');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_prodi: item.id_prodi || '',
      id_tahun: item.id_tahun || '',
      daya_tampung: item.daya_tampung || '',
      jumlah_mahasiswa_aktif_ts: item.jumlah_mahasiswa_aktif_ts || '',
      jumlah_mahasiswa_aktif_ts1: item.jumlah_mahasiswa_aktif_ts1 || '',
      jumlah_mahasiswa_aktif_ts2: item.jumlah_mahasiswa_aktif_ts2 || '',
      jumlah_mahasiswa_baru_ts: item.jumlah_mahasiswa_baru_ts || '',
      jumlah_mahasiswa_baru_ts1: item.jumlah_mahasiswa_baru_ts1 || '',
      jumlah_mahasiswa_baru_ts2: item.jumlah_mahasiswa_baru_ts2 || '',
      jumlah_mahasiswa_asing_ts: item.jumlah_mahasiswa_asing_ts || '',
      jumlah_mahasiswa_asing_ts1: item.jumlah_mahasiswa_asing_ts1 || '',
      jumlah_mahasiswa_asing_ts2: item.jumlah_mahasiswa_asing_ts2 || '',
      jumlah_mahasiswa_transfer_masuk: item.jumlah_mahasiswa_transfer_masuk || '',
      jumlah_mahasiswa_transfer_keluar: item.jumlah_mahasiswa_transfer_keluar || '',
      ipk_rata_rata_ts: item.ipk_rata_rata_ts || '',
      ipk_rata_rata_ts1: item.ipk_rata_rata_ts1 || '',
      ipk_rata_rata_ts2: item.ipk_rata_rata_ts2 || '',
      jumlah_mahasiswa_lulus_ts: item.jumlah_mahasiswa_lulus_ts || '',
      jumlah_mahasiswa_lulus_ts1: item.jumlah_mahasiswa_lulus_ts1 || '',
      jumlah_mahasiswa_lulus_ts2: item.jumlah_mahasiswa_lulus_ts2 || '',
      jumlah_mahasiswa_lulus_berprestasi: item.jumlah_mahasiswa_lulus_berprestasi || '',
      rata_rata_masa_studi: item.rata_rata_masa_studi || '',
    });
    setEditingId(item.id_2a1);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || 'pmb';
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
    } catch (err) {
      console.error('Error deleting data:', err);
      alert('Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({
      id_prodi: filterProdi || '',
      id_tahun: filterTahun || '',
      daya_tampung: '',
      jumlah_mahasiswa_aktif_ts: '',
      jumlah_mahasiswa_aktif_ts1: '',
      jumlah_mahasiswa_aktif_ts2: '',
      jumlah_mahasiswa_baru_ts: '',
      jumlah_mahasiswa_baru_ts1: '',
      jumlah_mahasiswa_baru_ts2: '',
      jumlah_mahasiswa_asing_ts: '',
      jumlah_mahasiswa_asing_ts1: '',
      jumlah_mahasiswa_asing_ts2: '',
      jumlah_mahasiswa_transfer_masuk: '',
      jumlah_mahasiswa_transfer_keluar: '',
      ipk_rata_rata_ts: '',
      ipk_rata_rata_ts1: '',
      ipk_rata_rata_ts2: '',
      jumlah_mahasiswa_lulus_ts: '',
      jumlah_mahasiswa_lulus_ts1: '',
      jumlah_mahasiswa_lulus_ts2: '',
      jumlah_mahasiswa_lulus_berprestasi: '',
      rata_rata_masa_studi: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || 'pmb';
    const endpoint = userRole === 'ala' ? 'ala' : 'pmb';
    window.open(`http://localhost:5000/api/${endpoint}/2a1-data-mahasiswa/export/${filterProdi}?token=${token}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => router.push('/tabel')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-4 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Data Mahasiswa (2.A.1)</h1>
              <p className="text-gray-500 mt-1 font-medium">Pengelolaan data mahasiswa aktif dan statistik akademik</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold text-sm">
                <Plus size={18} />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data'}</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-bold text-sm">
                <Download size={18} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-3 items-end mb-8">
          <div className="flex-1 lg:w-48">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Program Studi</label>
            <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer">
              <option value="">Pilih Prodi</option>
              {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
            </select>
          </div>
          <div className="flex-1 lg:w-32">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tahun</label>
            <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm transition appearance-none cursor-pointer">
              <option value="">Pilih Tahun</option>
              {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
            </select>
          </div>
          <button onClick={fetchData} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-400 hover:text-blue-600 shadow-sm" title="Refresh Data">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Data Mahasiswa' : 'Input Data Mahasiswa Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Program Studi</label>
                  <select value={formData.id_prodi} onChange={(e) => setFormData({...formData, id_prodi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Prodi</option>
                    {prodiList.map(p => <option key={p.id_prodi} value={p.id_prodi}>{p.nama_prodi}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Akademik</label>
                  <select value={formData.id_tahun} onChange={(e) => setFormData({...formData, id_tahun: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" required>
                    <option value="">Pilih Tahun</option>
                    {tahunList.map(t => <option key={t.id_tahun} value={t.id_tahun}>{t.tahun}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Daya Tampung</label>
                  <input type="number" value={formData.daya_tampung} onChange={(e) => setFormData({...formData, daya_tampung: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mahasiswa Aktif TS</label>
                  <input type="number" value={formData.jumlah_mahasiswa_aktif_ts} onChange={(e) => setFormData({...formData, jumlah_mahasiswa_aktif_ts: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mahasiswa Aktif TS-1</label>
                  <input type="number" value={formData.jumlah_mahasiswa_aktif_ts1} onChange={(e) => setFormData({...formData, jumlah_mahasiswa_aktif_ts1: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mahasiswa Aktif TS-2</label>
                  <input type="number" value={formData.jumlah_mahasiswa_aktif_ts2} onChange={(e) => setFormData({...formData, jumlah_mahasiswa_aktif_ts2: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">IPK Rata-rata TS</label>
                  <input type="number" step="0.01" value={formData.ipk_rata_rata_ts} onChange={(e) => setFormData({...formData, ipk_rata_rata_ts: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mahasiswa Lulus TS</label>
                  <input type="number" value={formData.jumlah_mahasiswa_lulus_ts} onChange={(e) => setFormData({...formData, jumlah_mahasiswa_lulus_ts: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mahasiswa Lulus Berprestasi</label>
                  <input type="number" value={formData.jumlah_mahasiswa_lulus_berprestasi} onChange={(e) => setFormData({...formData, jumlah_mahasiswa_lulus_berprestasi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition font-bold">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-200">{editingId ? 'Update Data' : 'Simpan Data'}</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-bold">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-lg tracking-tight">Menyinkronkan data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold text-xl tracking-tight">Belum ada data mahasiswa</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800 text-white text-[0.6rem]">
                    <th rowSpan="3" className="border-slate-700">TS</th>
                    <th rowSpan="3" className="border-slate-700">Daya Tampung</th>
                    <th colSpan="3" className="border-slate-700">Jumlah Calon Mahasiswa</th>
                    <th colSpan="6" className="border-slate-700 font-bold bg-blue-900/50 text-blue-100">Jumlah Mahasiswa Baru</th>
                    <th colSpan="6" className="border-slate-700 font-bold bg-green-900/50 text-green-100">Jumlah Mahasiswa Aktif</th>
                    <th rowSpan="3" className="border-slate-700">Aksi</th>
                  </tr>
                  <tr className="bg-slate-700 text-[0.55rem] text-slate-200">
                    <th rowSpan="2" className="border-slate-600">Pendaftar</th>
                    <th rowSpan="2" className="border-slate-600">Afirmasi</th>
                    <th rowSpan="2" className="border-slate-600">Kebutuhan Khusus</th>
                    <th colSpan="3" className="border-slate-600 bg-blue-800/40">Reguler</th>
                    <th colSpan="3" className="border-slate-600 bg-blue-800/40">RPL</th>
                    <th colSpan="3" className="border-slate-600 bg-green-800/40">Reguler</th>
                    <th colSpan="3" className="border-slate-600 bg-green-800/40">RPL</th>
                  </tr>
                  <tr className="bg-slate-600 text-[0.5rem] text-slate-300">
                    <th className="border-slate-500">Diterima</th><th className="border-slate-500">Afirmasi</th><th className="border-slate-500">Kebutuhan Khusus</th>
                    <th className="border-slate-500">Diterima</th><th className="border-slate-500">Afirmasi</th><th className="border-slate-500">Kebutuhan Khusus</th>
                    <th className="border-slate-500">Diterima</th><th className="border-slate-500">Afirmasi</th><th className="border-slate-500">Kebutuhan Khusus</th>
                    <th className="border-slate-500">Diterima</th><th className="border-slate-500">Afirmasi</th><th className="border-slate-500">Kebutuhan Khusus</th>
                  </tr>
                  <tr className="bg-slate-100 font-black text-[7px] text-slate-400 italic">
                    <td>(1)</td><td>(2)</td><td>(3)</td><td>(4)</td><td>(5)</td>
                    <td>(6)</td><td>(7)</td><td>(8)</td><td>(9)</td><td>(10)</td><td>(11)</td>
                    <td>(12)</td><td>(13)</td><td>(14)</td><td>(15)</td>
                    <td>-</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.map((item) => (
                    <tr key={item.id_2a1} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6 border-r border-gray-50 last:border-0">
                        <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.nama_prodi}</div>
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
