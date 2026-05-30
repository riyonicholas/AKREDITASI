'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, BookOpen, AlertCircle, RefreshCw, ChevronRight, User, Settings, GraduationCap, FileText, HelpCircle, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Dummy database awal
const DUMMY_DB = [
  { id: 1, kategori: 'Akun', judul: 'Cara Mengubah Password', konten: 'Masuk ke menu Profil di pojok kiri bawah, lalu klik tab Keamanan. Masukkan password lama Anda lalu password baru yang diinginkan.' },
  { id: 2, kategori: 'Sistem', judul: 'Memahami Navigasi Menu', konten: 'Menu utama berada di sebelah kiri (atau bawah jika di HP). Menu dikelompokkan berdasarkan standar akreditasi seperti UPPS, LPPM, dan SISFO.' },
  { id: 3, kategori: 'Akademik', judul: 'Input Data Penelitian (LPPM)', konten: 'Buka menu LPPM > 3.A.2 Penelitian. Klik Tambah Penelitian. Anda bisa menambahkan dosen anggota dan mahasiswa yang terlibat.' }
];

const CAT_COLORS = {
  "Akun": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: User },
  "Sistem": { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200", icon: Settings },
  "Akademik": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", icon: GraduationCap },
  "Tugas": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", icon: FileText },
  "Bantuan": { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200", icon: HelpCircle },
};

export default function PanduanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk form CRUD
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    kategori: 'Sistem',
    judul: '',
    konten: ''
  });

  // Load dummy data
  useEffect(() => {
    // Simulasi loading dari API
    setTimeout(() => {
      const storedData = localStorage.getItem('dummy_panduan');
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        setData(DUMMY_DB);
        localStorage.setItem('dummy_panduan', JSON.stringify(DUMMY_DB));
      }
      setLoading(false);
    }, 500);
  }, []);

  // Save to local storage whenever data changes (Simulasi Backend)
  const saveToDB = (newData) => {
    setData(newData);
    localStorage.setItem('dummy_panduan', JSON.stringify(newData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      const updatedData = data.map(item => 
        item.id === editingId ? { ...item, ...formData } : item
      );
      saveToDB(updatedData);
      alert('Panduan berhasil diperbarui!');
    } else {
      // Create
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
      const newData = [...data, { id: newId, ...formData }];
      saveToDB(newData);
      alert('Panduan berhasil ditambahkan!');
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      kategori: item.kategori,
      judul: item.judul,
      konten: item.konten
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus panduan ini?')) {
      const filteredData = data.filter(item => item.id !== id);
      saveToDB(filteredData);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ kategori: 'Sistem', judul: '', konten: '' });
    setShowForm(false);
  };

  const filteredData = data.filter(item => 
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.konten.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-20">
      {/* Top Banner Area (Very minimal, not huge blue) */}
      <div className="w-full bg-white border-b border-slate-200 px-6 py-8 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BookOpen className="text-blue-600" size={32} />
            Pusat Panduan
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Kelola artikel panduan, dokumentasi, dan tutorial untuk pengguna sistem</p>
        </div>
        <div className="flex gap-3 mt-2 md:mt-0">
          <Button onClick={() => setShowForm(!showForm)} className="shadow-md bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold py-3">
            {showForm ? 'Batal / Tutup Form' : (
              <>
                <Plus size={18} className="mr-2" /> Buat Panduan Baru
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="w-full p-6 md:p-8">
        {/* Input Form Section */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 p-8 mb-10 animate-in fade-in slide-in-from-top-8 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Edit size={20} />
              </div>
              {editingId ? 'Edit Artikel Panduan' : 'Tulis Panduan Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-600 mb-2">Kategori Modul</label>
                  <select 
                    value={formData.kategori} 
                    onChange={(e) => setFormData({...formData, kategori: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Akun">Akun & Profil</option>
                    <option value="Sistem">Sistem & Navigasi</option>
                    <option value="Akademik">Modul Akademik</option>
                    <option value="Tugas">Manajemen Tugas</option>
                    <option value="Bantuan">Bantuan Teknis</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-600 mb-2">Judul Artikel Panduan</label>
                  <input 
                    type="text" 
                    value={formData.judul} 
                    onChange={(e) => setFormData({...formData, judul: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition font-bold text-slate-900 placeholder:font-medium" 
                    placeholder="Contoh: Cara Mengubah Password Akun..." 
                    required 
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-slate-600 mb-2">Isi Konten Lengkap</label>
                  <textarea 
                    value={formData.konten} 
                    onChange={(e) => setFormData({...formData, konten: e.target.value})} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition font-medium text-slate-700 min-h-[180px] leading-relaxed resize-y" 
                    placeholder="Tuliskan langkah-langkah atau penjelasan panduan secara detail di sini..." 
                    required 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={resetForm} className="font-bold rounded-xl px-6">Batal</Button>
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                  {editingId ? 'Simpan Perubahan' : 'Publish Panduan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar (Floating Style) */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8 flex items-center max-w-2xl mx-auto relative z-20 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400">
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="Ketik kata kunci pencarian panduan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border-none outline-none font-bold text-slate-700 placeholder-slate-400 text-base"
          />
        </div>

        {/* Card Grid Layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-500">
            <RefreshCw className="animate-spin text-blue-500" size={40} />
            <span className="font-bold text-sm uppercase tracking-widest text-slate-400">Memuat Data...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={48} className="text-slate-300" />
            </div>
            <p className="font-black text-xl text-slate-600 mb-2">Panduan Tidak Ditemukan</p>
            <p className="text-slate-500 font-medium">Coba gunakan kata kunci lain atau buat panduan baru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredData.map((item) => {
              const catData = CAT_COLORS[item.kategori] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", icon: FileQuestion };
              const Icon = catData.icon;

              return (
                <div key={item.id} className="group bg-white rounded-[2rem] border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden relative">
                  
                  {/* Card Header */}
                  <div className="p-6 md:p-8 pb-4">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-3.5 rounded-2xl ${catData.bg} ${catData.text} shadow-inner`}>
                        <Icon size={24} />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${catData.bg} ${catData.border} ${catData.text}`}>
                        {item.kategori}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                      {item.judul}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 md:px-8 pb-8 flex-grow">
                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 text-sm">
                      {item.konten}
                    </p>
                  </div>
                  
                  {/* Card Footer (Actions) */}
                  <div className="px-3 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between mt-auto">
                    <button 
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 mx-1 text-slate-500 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                    >
                      <span>Baca Lengkap</span>
                      <ChevronRight size={14} />
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="w-10 h-10 mx-1 flex items-center justify-center rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Edit Panduan"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="w-10 h-10 mx-1 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Hapus Panduan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
