'use client';
import { useState, useEffect, Suspense } from 'react';
import { BookOpen, AlertCircle, FileText, Edit, Trash2, Plus, X, Search, Users, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { showSuccess, showError, showConfirm } from '@/components/CustomAlerts';
import { GROUPED_MENUS_TABEL } from '@/components/Navbar';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function PanduanContent() {
  const searchParams = useSearchParams();
  const kategori = searchParams.get('kategori') || 'Semua';

  const [isAdmin, setIsAdmin] = useState(false);
  const [userUnit, setUserUnit] = useState('');
  const [panduanList, setPanduanList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Panduan Tabel state
  const [selectedRole, setSelectedRole] = useState(null);

  // Admin only state
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    id_panduan: null,
    id_unit: '',
    judul: '',
    konten: '',
    link_lampiran: ''
  });

  const getTablesForUnit = (unitId) => {
    if (!unitId) return [];
    const selectedUnit = unitList.find(u => u.id_unit.toString() === unitId.toString());
    if (!selectedUnit) return [];
    const group = GROUPED_MENUS_TABEL.find(g => g.group.toUpperCase() === selectedUnit.nama_unit.toUpperCase());
    return group ? group.items : [];
  };

  const availableTables = getTablesForUnit(formData.id_unit);

  useEffect(() => {
    checkRoleAndFetch();
  }, []);

  useEffect(() => {
    // Reset selected role when category changes
    setSelectedRole(null);
    if (kategori === 'Semua') {
      // Refresh the default list
      if (isAdmin) fetchAllPanduan();
      else if (userUnit) fetchPanduanByUnit(userUnit);
    }
  }, [kategori]);

  const checkRoleAndFetch = async () => {
    setLoading(true);
    const userStr = localStorage.getItem('user');
    let adminFlag = false;
    let unitId = '';

    if (userStr) {
        const user = JSON.parse(userStr);
        unitId = user.id_unit;
        const unitName = user.unit || user.nama_unit || '';
        if (unitName.trim().toUpperCase() === 'ADMIN' || unitId === 13 || unitId === '13') {
            adminFlag = true;
        }
        setUserUnit(unitId);
        setIsAdmin(adminFlag);
    }

    await fetchUnits();

    if (adminFlag) {
        await fetchAllPanduan();
    } else {
        if (unitId) await fetchPanduanByUnit(unitId);
    }
    setLoading(false);
  };

  const fetchUnits = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/unit-kerja', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setUnitList(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllPanduan = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/master/panduan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setPanduanList(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPanduanByUnit = async (id_unit) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/panduan/unit/${id_unit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setPanduanList(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPanduanForRole = async (id_unit) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/panduan/unit/${id_unit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setPanduanList(result.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_unit || !formData.judul || !formData.konten) {
      showError("Unit, Judul, dan Konten wajib diisi!");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('token');
    const url = formData.id_panduan 
      ? `http://localhost:5000/api/master/panduan/${formData.id_panduan}`
      : 'http://localhost:5000/api/master/panduan';
    const method = formData.id_panduan ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_unit: formData.id_unit,
          judul: formData.judul,
          konten: formData.konten,
          link_lampiran: formData.link_lampiran
        })
      });
      const result = await res.json();
      if (result.success) {
        showSuccess("Berhasil!", result.message);
        resetForm();
        fetchAllPanduan();
      } else {
        showError(result.message);
      }
    } catch (err) {
      console.error(err);
      showError("Terjadi kesalahan saat menyimpan panduan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm("Panduan ini akan dihapus permanen.", "Ya, Hapus");
    if (!isConfirmed) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/master/panduan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        showSuccess("Terhapus!", "Panduan berhasil dihapus.");
        fetchAllPanduan();
      } else {
        showError(result.message);
      }
    } catch (err) {
      console.error(err);
      showError("Terjadi kesalahan saat menghapus panduan.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_panduan: item.id_panduan,
      id_unit: item.id_unit,
      judul: item.judul,
      konten: item.konten,
      link_lampiran: item.link_lampiran || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      id_panduan: null,
      id_unit: '',
      judul: '',
      konten: '',
      link_lampiran: ''
    });
  };

  const handleRoleClick = (unit) => {
    setSelectedRole(unit);
    fetchPanduanForRole(unit.id_unit);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    if (isAdmin) fetchAllPanduan();
    else if (userUnit) fetchPanduanByUnit(userUnit);
  };

  // ================= PANDUAN WEBSITE VIEW =================
  if (kategori === 'Website') {
    return (
      <div className="flex flex-col w-full bg-slate-50 min-h-screen">
          <main className="flex-grow p-8 w-full max-w-7xl mx-auto">
              <div className="mb-10 text-center">
                  <h1 className="text-4xl font-black text-slate-800 flex items-center justify-center gap-3">
                      <BookOpen size={40} className="text-blue-600" />
                      Panduan Penggunaan Website
                  </h1>
                  <p className="text-slate-500 mt-3 text-lg">Pelajari cara menavigasi dan menggunakan fitur-fitur utama di Sistem Akreditasi.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Dashboard Guide */}
                  <article className="bg-white rounded-[24px] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                      <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-transparent">
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                              <span className="p-2 bg-blue-600 text-white rounded-lg shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg></span>
                              Halaman Dashboard
                          </h2>
                      </div>
                      <div className="p-8 text-slate-600 leading-relaxed text-[15px]">
                          <p className="mb-5">Halaman <strong>Dashboard</strong> adalah pusat kontrol utama Anda setelah melakukan login. Di sini Anda dapat melihat:</p>
                          <ul className="space-y-4">
                              <li className="flex gap-3"><span className="text-blue-500 font-bold">1.</span> <span><strong>Ringkasan Aktivitas:</strong> Menampilkan statistik penting dan aktivitas terbaru dari seluruh unit kerja secara langsung.</span></li>
                              <li className="flex gap-3"><span className="text-blue-500 font-bold">2.</span> <span><strong>Akses Cepat:</strong> Menyediakan jalan pintas untuk langsung menuju halaman atau tabel yang paling sering Anda butuhkan.</span></li>
                              <li className="flex gap-3"><span className="text-blue-500 font-bold">3.</span> <span><strong>Pengumuman:</strong> Area informasi untuk melihat notifikasi atau arahan terbaru dari tim Administrator.</span></li>
                          </ul>
                      </div>
                  </article>

                  {/* Tabel Data Guide */}
                  <article className="bg-white rounded-[24px] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                      <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-transparent">
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                              <span className="p-2 bg-indigo-600 text-white rounded-lg shadow-md"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" /></svg></span>
                              Halaman Tabel Data
                          </h2>
                      </div>
                      <div className="p-8 text-slate-600 leading-relaxed text-[15px]">
                          <p className="mb-5">Halaman <strong>Tabel Data</strong> berisi kumpulan seluruh instrumen akreditasi. Setiap tabel diatur berdasarkan kriteria dan wewenang unit kerja.</p>
                          <ul className="space-y-4">
                              <li className="flex gap-3"><span className="text-indigo-500 font-bold">1.</span> <span><strong>Menu Navigasi Kiri:</strong> Memudahkan Anda berpindah-pindah antar tabel spesifik yang telah dikelompokkan untuk unit Anda.</span></li>
                              <li className="flex gap-3"><span className="text-indigo-500 font-bold">2.</span> <span><strong>Manajemen Data:</strong> Anda memiliki kebebasan untuk menambah, mengubah, dan menghapus baris data jika memiliki izin akses (CRUD).</span></li>
                              <li className="flex gap-3"><span className="text-indigo-500 font-bold">3.</span> <span><strong>Pencarian Instan:</strong> Dilengkapi fitur pencarian pintar untuk menemukan baris data tertentu dengan cepat tanpa memuat ulang layar.</span></li>
                          </ul>
                      </div>
                  </article>

                  {/* Profile Guide */}
                  <article className="bg-white rounded-[24px] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                      <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-purple-50/50 to-transparent">
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                              <span className="p-2 bg-purple-600 text-white rounded-lg shadow-md"><Users className="w-5 h-5" /></span>
                              Halaman Profile
                          </h2>
                      </div>
                      <div className="p-8 text-slate-600 leading-relaxed text-[15px]">
                          <p className="mb-5">Halaman <strong>Profile</strong> memungkinkan Anda untuk mengelola detail akun pribadi dan menyesuaikan preferensi sistem Anda.</p>
                          <ul className="space-y-4">
                              <li className="flex gap-3"><span className="text-purple-500 font-bold">1.</span> <span><strong>Informasi Akun:</strong> Tampilan detail mengenai identitas Anda, peran yang Anda miliki, serta keanggotaan unit kerja Anda.</span></li>
                              <li className="flex gap-3"><span className="text-purple-500 font-bold">2.</span> <span><strong>Ubah Password:</strong> Fasilitas untuk mengganti kata sandi kapan saja demi menjaga kerahasiaan dan keamanan data akun Anda.</span></li>
                              <li className="flex gap-3"><span className="text-purple-500 font-bold">3.</span> <span><strong>Status Sesi:</strong> Menampilkan log status otentikasi Anda yang berlaku saat ini dalam sistem.</span></li>
                          </ul>
                      </div>
                  </article>

                  {/* Panduan Guide */}
                  <article className="bg-white rounded-[24px] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                      <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-teal-50/50 to-transparent">
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                              <span className="p-2 bg-teal-600 text-white rounded-lg shadow-md"><BookOpen className="w-5 h-5" /></span>
                              Halaman Panduan
                          </h2>
                      </div>
                      <div className="p-8 text-slate-600 leading-relaxed text-[15px]">
                          <p className="mb-5">Halaman <strong>Panduan</strong> ini merupakan pusat bantuan yang berisi kumpulan instruksi teknis pengisian instrumen tabel.</p>
                          <ul className="space-y-4">
                              <li className="flex gap-3"><span className="text-teal-500 font-bold">1.</span> <span><strong>Panduan Website:</strong> Halaman yang sedang Anda baca, menjelaskan fungsi inti dari masing-masing menu di sistem.</span></li>
                              <li className="flex gap-3"><span className="text-teal-500 font-bold">2.</span> <span><strong>Panduan Tabel:</strong> Berisi instruksi langkah demi langkah atau penjelasan format kolom yang dibutuhkan untuk mengisi setiap tabel.</span></li>
                              <li className="flex gap-3"><span className="text-teal-500 font-bold">3.</span> <span><strong>Manajemen Panduan:</strong> (Admin) Fitur pembuatan dan pengelolaan buku panduan khusus yang dapat dialokasikan ke suatu unit kerja.</span></li>
                          </ul>
                      </div>
                  </article>
              </div>
          </main>
      </div>
    );
  }

  // ================= PANDUAN TABEL VIEW (ROLE CARDS) =================
  if (kategori === 'Panduan Tabel') {
      if (!selectedRole) {
          return (
              <div className="flex flex-col w-full bg-slate-50 min-h-screen">
                  <main className="flex-grow p-8 w-full">
                      <div className="mb-8">
                          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                              <Users size={32} className="text-blue-600" />
                              Panduan Tabel per Role
                          </h1>
                          <p className="text-slate-500 mt-2">Pilih salah satu role untuk melihat panduan yang terkait dengan tabel-tabelnya.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {unitList.map(unit => (
                              <div 
                                  key={unit.id_unit} 
                                  onClick={() => handleRoleClick(unit)}
                                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition-all group"
                              >
                                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                      <BookOpen size={24} />
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">{unit.nama_unit}</h3>
                                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">Lihat semua panduan untuk role {unit.nama_unit}</p>
                              </div>
                          ))}
                      </div>
                  </main>
              </div>
          );
      } else {
          return (
            <div className="flex flex-col w-full bg-slate-50 min-h-screen">
              <main className="flex-grow p-8 w-full">
                <button onClick={handleBackToRoles} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-bold transition-colors">
                    <ArrowLeft size={18} /> Kembali ke Daftar Role
                </button>
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <BookOpen size={32} className="text-blue-600" />
                    Panduan Tabel: {selectedRole.nama_unit}
                    </h1>
                    <p className="text-slate-500 mt-2">Daftar panduan penggunaan sistem yang dikhususkan untuk role {selectedRole.nama_unit}.</p>
                </div>
        
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : panduanList.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                        <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">Belum Ada Panduan</h3>
                        <p className="text-slate-500 mt-2">Belum ada panduan untuk role ini.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {panduanList.map((item) => (
                            <article key={item.id_panduan} className="bg-white rounded-[20px] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                                <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-transparent">
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{item.judul}</h2>
                                    <div className="flex items-center gap-4 mt-4 text-sm font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100/50 text-blue-700 rounded-lg">
                                            <BookOpen size={14} /> Ditujukan untuk: {item.nama_unit}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span>Dipublikasikan: {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div 
                                        className="prose prose-slate max-w-none [&_*]:!text-slate-800 prose-headings:!text-slate-800 prose-p:!text-slate-800 prose-a:!text-blue-600 hover:prose-a:!text-blue-700 prose-img:rounded-2xl prose-img:shadow-md"
                                        dangerouslySetInnerHTML={{ __html: item.konten }}
                                    />
                                    
                                    {item.link_lampiran && (
                                        <div className="mt-8 pt-6 border-t border-slate-100">
                                            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                <FileText size={16} className="text-blue-600" />
                                                Lampiran Tambahan
                                            </h4>
                                            <a 
                                                href={item.link_lampiran} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-lg font-medium transition-colors text-sm"
                                            >
                                                Buka Lampiran Dokumen &rarr;
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
              </main>
            </div>
          );
      }
  }


  // ================= TAMBAH PANDUAN (ADMIN CRUD) ATAU READ ONLY UNTUK USER BIASA =================
  if (isAdmin) {
      const filteredData = panduanList.filter(item => 
        item.judul.toLowerCase().includes(search.toLowerCase()) || 
        item.nama_unit.toLowerCase().includes(search.toLowerCase())
      );

      return (
        <div className="flex flex-col w-full bg-slate-50 min-h-screen">
          <main className="flex-grow p-8 w-full">
            
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <BookOpen size={32} className="text-blue-600" />
                        Tambah Panduan Baru
                    </h1>
                    <p className="text-slate-500 mt-2">Buat, edit, dan kelola panduan penggunaan sistem untuk setiap unit.</p>
                </div>
                {formData.id_panduan && (
                    <button onClick={resetForm} className="flex items-center gap-2 bg-slate-200 text-slate-700 hover:bg-slate-300 px-4 py-2 rounded-lg font-bold transition-colors">
                        <Plus size={18} /> Buat Baru
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT PANEL: Form Editor */}
                <div className="w-full lg:w-7/12 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white p-5 font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2"><Edit size={18}/> {formData.id_panduan ? 'Edit Panduan' : 'Tulis Panduan Baru'}</span>
                        {formData.id_panduan && <button type="button" onClick={resetForm} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors"><X size={18} className="text-white" /></button>}
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 flex-grow bg-slate-50/30">
                        
                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="w-full sm:w-1/3">
                                <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider">Target Unit *</label>
                                <div className="relative">
                                    <select 
                                        value={formData.id_unit} 
                                        onChange={(e) => setFormData({...formData, id_unit: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/10 outline-none transition-all appearance-none pr-10 cursor-pointer shadow-sm"
                                        required
                                    >
                                        <option value="" className="text-slate-400">-- Pilih Unit --</option>
                                        {unitList.map(u => (
                                            <option key={u.id_unit} value={u.id_unit} className="text-slate-800">{u.nama_unit}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full sm:w-2/3">
                                <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider">Judul Panduan *</label>
                                {availableTables.length > 0 ? (
                                    <div className="relative">
                                        <select 
                                            value={formData.judul}
                                            onChange={(e) => setFormData({...formData, judul: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/10 outline-none transition-all appearance-none pr-10 cursor-pointer shadow-sm"
                                            required
                                        >
                                            <option value="" className="text-slate-400">-- Pilih Tabel --</option>
                                            {availableTables.map(t => (
                                                <option key={t.key} value={t.label} className="text-slate-800">{t.label}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                ) : (
                                    <input 
                                        type="text"
                                        value={formData.judul}
                                        onChange={(e) => setFormData({...formData, judul: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/10 outline-none transition-all shadow-sm"
                                        placeholder="Contoh: Cara Mengisi Tabel 2.A.2"
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider">Link Lampiran <span className="text-slate-400 font-medium normal-case">(Opsional)</span></label>
                            <input 
                                type="url"
                                value={formData.link_lampiran}
                                onChange={(e) => setFormData({...formData, link_lampiran: e.target.value})}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/10 outline-none transition-all"
                                placeholder="Contoh: https://drive.google.com/..."
                            />
                        </div>

                        <div className="flex-grow flex flex-col">
                            <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider">Konten Panduan *</label>
                            <div className="h-[400px] mb-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden focus-within:border-[#38bdf8] focus-within:ring-4 focus-within:ring-[#38bdf8]/10 transition-all text-slate-800 [&_.ql-editor]:text-slate-800 [&_.ql-editor.ql-blank::before]:text-slate-400 [&_.ql-editor.ql-blank::before]:font-normal [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50/80 [&_.ql-toolbar]:p-3 flex flex-col">
                                <ReactQuill 
                                    theme="snow" 
                                    value={formData.konten} 
                                    onChange={(content) => setFormData({...formData, konten: content})}
                                    className="h-full border-none"
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                            ['link', 'image'],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className={`w-full py-3.5 rounded-xl font-bold text-white uppercase tracking-widest text-sm transition-all shadow-md ${isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:shadow-lg hover:shadow-[#3b82f6]/30 hover:-translate-y-0.5'}`}
                        >
                            {isSaving ? 'Menyimpan...' : (formData.id_panduan ? 'Update Panduan' : 'Publish Panduan')}
                        </button>
                    </form>
                </div>

                {/* RIGHT PANEL: Data Table */}
                <div className="w-full lg:w-5/12 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col h-[760px]">
                    <div className="p-5 border-b border-slate-100 bg-white flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-[#38bdf8]" /> Rekap Panduan</h3>
                            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{filteredData.length} Data</span>
                        </div>
                        <div className="relative w-full">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Cari panduan..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl outline-none focus:border-[#38bdf8] focus:ring-4 focus:ring-[#38bdf8]/10 transition-all bg-slate-50"
                            />
                        </div>
                    </div>

                    <div className="flex-grow overflow-auto p-4 space-y-3 bg-slate-50/50 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="w-8 h-8 border-4 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="text-center py-10">
                                <AlertCircle size={32} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium text-sm">Data tidak ditemukan.</p>
                            </div>
                        ) : (
                            filteredData.map(item => (
                                <div key={item.id_panduan} className={`p-4 rounded-xl border transition-all duration-300 bg-white hover:shadow-md hover:border-[#38bdf8]/50 ${formData.id_panduan === item.id_panduan ? 'border-[#38bdf8] ring-2 ring-[#38bdf8]/20 shadow-sm' : 'border-slate-100'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{item.judul}</h4>
                                        <span className="text-[0.6rem] font-black uppercase bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md whitespace-nowrap ml-3 tracking-widest">
                                            {item.nama_unit}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/80">
                                        <span className="text-xs font-medium text-slate-400">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => handleEdit(item)} className="p-2 bg-slate-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors" title="Edit"><Edit size={14} /></button>
                                            <button type="button" onClick={() => handleDelete(item.id_panduan)} className="p-2 bg-slate-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Hapus"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
          </main>
        </div>
      );
  }

  // =============== TAMPILAN USER BIASA (READ ONLY) UNTUK "Tambah Panduan" ===============
  // (Meskipun judulnya "Tambah Panduan", user biasa hanya bisa baca panduan miliknya)
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <main className="flex-grow p-8 w-full">
        <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <BookOpen size={32} className="text-blue-600" />
            Panduan Unit Anda
            </h1>
            <p className="text-slate-500 mt-2">Daftar panduan penggunaan sistem yang dikhususkan untuk unit kerja Anda.</p>
        </div>

        {loading ? (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : panduanList.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700">Belum Ada Panduan</h3>
                <p className="text-slate-500 mt-2">Admin belum mempublikasikan panduan apapun untuk unit kerja Anda.</p>
            </div>
        ) : (
            <div className="space-y-8">
                {panduanList.map((item) => (
                    <article key={item.id_panduan} className="bg-white rounded-[20px] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                        <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-transparent">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{item.judul}</h2>
                            <div className="flex items-center gap-4 mt-4 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100/50 text-blue-700 rounded-lg">
                                    <BookOpen size={14} /> Ditujukan untuk: {item.nama_unit}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span>Dipublikasikan: {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div 
                                className="prose prose-slate max-w-none [&_*]:!text-slate-800 prose-headings:!text-slate-800 prose-p:!text-slate-800 prose-a:!text-blue-600 hover:prose-a:!text-blue-700 prose-img:rounded-2xl prose-img:shadow-md"
                                dangerouslySetInnerHTML={{ __html: item.konten }}
                            />
                            
                            {item.link_lampiran && (
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                        <FileText size={16} className="text-blue-600" />
                                        Lampiran Tambahan
                                    </h4>
                                    <a 
                                        href={item.link_lampiran} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-lg font-medium transition-colors text-sm"
                                    >
                                        Buka Lampiran Dokumen &rarr;
                                    </a>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}

export default function UnifiedPanduan() {
  return (
    <Suspense fallback={
        <div className="flex justify-center items-center h-screen w-full bg-slate-50">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    }>
        <PanduanContent />
    </Suspense>
  );
}
