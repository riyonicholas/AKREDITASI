'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Key, Save, Camera, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    unit: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || 'Admin User',
        email: user.email || 'admin@institusi.ac.id',
        unit: user.unit || 'Fakultas Teknik',
      }));
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulasi request ke backend
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);

      // Sembunyikan notifikasi setelah 3 detik
      setTimeout(() => setShowSuccess(false), 3000);

      if (activeTab === 'keamanan') {
        setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
      }
    }, 1000);
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header Minimalis */}
      <div className="w-full bg-white border-b border-slate-200 px-6 py-8 md:px-10 shadow-sm relative z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <User className="text-blue-600" size={32} />
            Pengaturan Profil
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Kelola informasi pribadi, unit kerja, dan pengaturan keamanan akun Anda.</p>
        </div>
      </div>

      <div className="w-full p-6 md:p-10">

        {/* Notifikasi Sukses Mengambang */}
        {showSuccess && (
          <div className="fixed top-8 right-8 z-50 bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl shadow-xl shadow-emerald-900/10 flex items-center gap-3 animate-in slide-in-from-top-10 fade-in duration-300">
            <CheckCircle size={24} className="text-emerald-500" />
            <div className="flex flex-col">
              <span className="font-bold">Berhasil Disimpan!</span>
              <span className="text-sm font-medium opacity-90">Perubahan pada profil Anda telah diperbarui.</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* KIRI: Kartu Profil Utama */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#1E3A8A] to-blue-500"></div>

              <div className="relative z-10 flex flex-col items-center mt-10">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl mb-4 relative">
                  <div className="w-full h-full bg-[#facc15] rounded-full flex items-center justify-center text-4xl font-black text-slate-900">
                    {getInitial(formData.username)}
                  </div>
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110" title="Ganti Foto Profil">
                    <Camera size={14} />
                  </button>
                </div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{formData.username}</h2>
                <p className="text-slate-500 font-bold mb-4">{formData.email}</p>

                <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-black text-xs uppercase tracking-widest rounded-full border border-blue-100">
                  {user?.role || 'Administrator'}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3 text-left">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold">Unit Pengelola</span>
                  <span className="text-slate-900 font-black">{formData.unit}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold">Status Akun</span>
                  <span className="text-emerald-600 font-black flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif</span>
                </div>
              </div>
            </div>

            {/* Menu Navigasi Samping */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('profil')}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profil' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <User size={20} />
                Informasi Personal
              </button>
              <button
                onClick={() => setActiveTab('keamanan')}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'keamanan' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Shield size={20} />
                Keamanan & Password
              </button>
            </div>
          </div>

          {/* KANAN: Form Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">

              {activeTab === 'profil' && (
                <div className="animate-in fade-in duration-500">
                  <div className="mb-8 pb-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900">Informasi Personal</h3>
                    <p className="text-slate-500 font-medium mt-1">Perbarui detail profil dan informasi kontak Anda.</p>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-600 mb-2">Nama Lengkap / Username</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="text-slate-400" size={18} />
                          </div>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition font-bold text-slate-900"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Alamat Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="text-slate-400" size={18} />
                          </div>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition font-bold text-slate-900"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Unit Kerja (UPPS / Prodi)</label>
                        <input
                          type="text"
                          value={formData.unit}
                          disabled
                          className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed"
                          title="Unit kerja hanya dapat diubah oleh Super Admin"
                        />
                        <p className="text-[11px] font-bold text-slate-400 mt-2">*Unit kerja dikelola oleh Administrator sistem.</p>
                      </div>
                    </div>

                    <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'keamanan' && (
                <div className="animate-in fade-in duration-500">
                  <div className="mb-8 pb-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900">Keamanan & Password</h3>
                    <p className="text-slate-500 font-medium mt-1">Pastikan akun Anda menggunakan password yang kuat dan aman.</p>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="max-w-md space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Password Saat Ini</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Key className="text-slate-400" size={18} />
                          </div>
                          <input
                            type="password"
                            value={formData.oldPassword}
                            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition font-bold text-slate-900"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>

                      <div className="w-full h-px bg-slate-100 my-2"></div>

                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Password Baru</label>
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition font-bold text-slate-900"
                          placeholder="Minimal 8 karakter"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Konfirmasi Password Baru</label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition font-bold text-slate-900"
                          placeholder="Ulangi password baru"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving || (formData.newPassword !== formData.confirmPassword)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-xl shadow-slate-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Shield size={18} />}
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
