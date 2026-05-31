'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  // ── STATE (tidak diubah) ──────────────────────────────────────────
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);   // tambahan UI saja
  const router = useRouter();

  // ── HANDLER LOGIN (tidak diubah) ─────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (result.success) {
        login(result.user || {}, result.token);
        router.push('/dashboard');
      } else {
        setError(result.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  // ── UI (redesign) ─────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ background: '#f0f4f8', fontFamily: 'var(--font-montserrat), Inter, sans-serif' }}
    >
      <div className="w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[560px]"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.10)' }}>

        {/* ── PANEL KIRI — Branding ────────────────────────────────── */}
        <div className="w-full md:w-[45%] flex flex-col relative overflow-hidden text-white p-10 md:p-12"
          style={{ background: '#08428c' }}>

          {/* Dekorasi geometri */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', filter: 'blur(32px)' }} />
          <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full"
            style={{ border: '40px solid rgba(255,255,255,0.05)', filter: 'blur(12px)' }} />
          <div className="absolute top-1/4 -right-20 w-40 h-40 rounded-full"
            style={{ border: '20px solid rgba(255,255,255,0.05)', filter: 'blur(6px)' }} />

          {/* Logo & nama institusi */}
          <div className="relative z-10 flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#0f172a] flex-shrink-0"
              style={{ background: '#facc15' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z" />
              </svg>
            </div>
            <span className="font-bold tracking-wide" style={{ fontSize: '1.05rem' }}>STIKOM PGRI</span>
          </div>

          {/* Tagline */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h1 className="font-black leading-tight m-0 mb-6"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', lineHeight: 1.15 }}>
              Sistem Informasi<br />
              <span style={{ color: '#facc15' }}>Akreditasi STIKOM</span><br />
              Banyuwangi.
            </h1>
            <p className="m-0 leading-relaxed font-medium" style={{ color: '#bfdbfe', fontSize: '0.9rem', maxWidth: '90%' }}>
              Platform terpadu pengelolaan data akreditasi program studi — LAM INFOKOM &amp; BAN-PT — berbasis data real-time.
            </p>

            {/* Badge versi */}
            <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit"
              style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.72rem', color: '#93c5fd' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
              Sistem Akreditasi v2.1
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-12 flex items-center gap-2"
            style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 500 }}>
            <span>© 2026 STIKOM PGRI Banyuwangi</span>
            <span>•</span>
            <span>Pusat Informasi</span>
          </div>
        </div>

        {/* ── PANEL KANAN — Form Login ─────────────────────────────── */}
        <div className="w-full md:w-[55%] bg-white flex flex-col justify-center p-10 md:p-14">

          {/* Heading */}
          <div className="mb-10">
            <h2 className="m-0 mb-2 font-bold" style={{ color: '#08428c', fontSize: '1.75rem' }}>
              Selamat Datang
            </h2>
            <p className="m-0 font-medium" style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Silakan masuk menggunakan akun SIAKAD Anda.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* ── Input Username ──────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginLeft: '4px' }}>
                Username atau Email
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau email"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '13px 16px 13px 42px',
                    background: '#f4f7fb',
                    border: '1.5px solid transparent',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.10)'; }}
                  onBlur={e => { e.target.style.background = '#f4f7fb'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* ── Input Password ──────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '4px' }}>
                <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Kata Sandi
                </label>
                <a href="#" style={{ fontSize: '0.68rem', fontWeight: 700, color: '#08428c', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                  Lupa Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '13px 44px 13px 42px',
                    background: '#f4f7fb',
                    border: '1.5px solid transparent',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    fontWeight: 600,
                    letterSpacing: showPw ? 'normal' : '0.2em',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.10)'; }}
                  onBlur={e => { e.target.style.background = '#f4f7fb'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }}
                />
                {/* Toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  title={showPw ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: 0,
                    color: '#94a3b8', display: 'flex', alignItems: 'center', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                >
                  {showPw ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* ── Checkbox Ingat Saya ─────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <input type="checkbox" id="remember"
                style={{ width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer', accentColor: '#08428c' }} />
              <label htmlFor="remember"
                style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* ── Pesan Error Inline (tidak diubah logikanya) ─────── */}
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '10px', padding: '11px 14px',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '0.82rem', color: '#dc2626', fontWeight: 600,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* ── Tombol Submit ───────────────────────────────────── */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '14px',
                background: loading ? '#94a3b8' : '#08428c',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(8,66,140,0.20)',
                transform: 'translateY(0)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#06336e'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(8,66,140,0.30)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = loading ? '#94a3b8' : '#08428c'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(8,66,140,0.20)'; }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    border: '2.5px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Sistem</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer form */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, margin: 0 }}>
              Belum memiliki akun?{' '}
              <a href="#" style={{ color: '#08428c', fontWeight: 700, textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                Hubungi Administrasi Kampus
              </a>
            </p>
          </div>
        </div>

      </div>

      {/* Keyframe spin untuk loading */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
