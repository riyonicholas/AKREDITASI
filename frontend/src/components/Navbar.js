"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import { createService } from "@/lib/api";
import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import LogoStikom from "@/app/image/image.png";

// Definisi link navigasi utama
const NAV_LINKS = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
        )
    },
    {
        name: "Tabel Data",
        href: "/tabel",
        icon: (
            <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 9v12" />
            </svg>
        )
    },

    {
        name: "Panduan",
        href: "/panduan",
        icon: (
            <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        )
    }
];

// Tabel submenu definition
const GROUPED_MENUS_TABEL = [
    {
        group: "MASTER DATA",
        items: [
            { key: "master/pegawai", label: "Pegawai", icon: "👥" },
            { key: "master/dosen", label: "Dosen", icon: "👨‍🏫" },
            { key: "master/tendik", label: "Tendik", icon: "👨‍💼" },
            { key: "master/prodi", label: "Program Studi", icon: "🏢" },
            { key: "master/users", label: "Users", icon: "🔑" },
        ]
    },
    {
        group: "UPPS",
        items: [
            { key: "pimpinan", label: "1.A.1 Pimpinan & Tupoksi", icon: "👑" },
            { key: "beban", label: "1.A.4 Beban DTPR", icon: "⚖️" },
            { key: "pengembangan", label: "3.A.3 Pengembangan DTPR", icon: "📈" },
            { key: "visi-misi", label: "6 Kesesuaian Visi Misi", icon: "🎯" },
        ]
    },
    {
        group: "KEUANGAN",
        items: [
            { key: "sumber-dana", label: "1.A.2 Sumber Pendanaan", icon: "💰" },
            { key: "penggunaan-dana", label: "1.A.3 Penggunaan Dana", icon: "💸" },
        ]
    },
    {
        group: "KEPEGAWAIAN",
        items: [
            { key: "tendik-kualifikasi", label: "1.A.5 Kualifikasi Tendik", icon: "👨‍💻" },
        ]
    },
    {
        group: "SARPRAS",
        items: [
            { key: "sarpras-penelitian", label: "3.A.1 Sarpras Penelitian", icon: "🔬" },
            { key: "sarpras-pkm", label: "4.A.1 Sarpras PkM", icon: "🛠️" },
            { key: "sarpras-pendidikan", label: "5.2 Sarpras Pendidikan", icon: "🏫" },
        ]
    },
    {
        group: "TPM",
        items: [
            { key: "spmi", label: "1.B SPMI & Data TPM", icon: "🛡️" },
        ]
    },
    {
        group: "PMB",
        items: [
            { key: "data-mahasiswa", label: "2.A.1 Data Mahasiswa", icon: "👥" },
            { key: "keragaman-mahasiswa", label: "2.A.2 Asal Mahasiswa", icon: "🌍" },
        ]
    },
    {
        group: "ALA",
        items: [
            { key: "data-mahasiswa", label: "2.A.1 Data Mahasiswa", icon: "👥" },
            { key: "kondisi-mahasiswa", label: "2.A.3 Kondisi Mahasiswa", icon: "📊" },
        ]
    },
    {
        group: "PRODI",
        items: [
            { key: "isi-pembelajaran", label: "2.B.1 Isi Pembelajaran", icon: "📚" },
            { key: "pemetaan-cpl-pl", label: "2.B.2 Pemetaan CPL-PL", icon: "🗺️" },
            { key: "peta-pemenuhan-cpl", label: "2.B.3 Peta Pemenuhan CPL", icon: "🎯" },
            { key: "fleksibilitas-pembelajaran", label: "2.C Fleksibilitas Proses", icon: "🔄" },
        ]
    },
    {
        group: "KEMAHASISWAAN",
        items: [
            { key: "alumni", label: "2.B.4 Masa Tunggu", icon: "⏱️" },
            { key: "alumni", label: "2.B.5 Kesesuaian Kerja", icon: "👔" },
            { key: "accuracy", label: "2.B.6 Kepuasan Pengguna", icon: "😊" },
            { key: "recognisi", label: "2.D Rekognisi Lulusan", icon: "🏆" },
        ]
    },
    {
        group: "LPPM",
        items: [
            { key: "penelitian-dtpr", label: "3.A.2 Penelitian DTPR", icon: "🧪" },
            { key: "pkm-dtpr", label: "4.A.2 PkM DTPR", icon: "🌱" },
        ]
    },
    {
        group: "SISFO",
        items: [
            { key: "tata-kelola", label: "5.1 Sistem Tata Kelola", icon: "🏢" },
        ]
    }
];

const FLAT_MENUS_TABEL = GROUPED_MENUS_TABEL.flatMap(g => g.items);

// Berita submenu definition
const MENUS_BERITA = [
    { key: "Semua", label: "Semua" },
    { key: "Pengumuman", label: "Pengumuman" },
    { key: "Akademik", label: "Akademik" },
    { key: "Beasiswa", label: "Beasiswa" },
    { key: "Sistem", label: "Sistem" },
    { key: "Informasi Mitra", label: "Informasi Mitra" }
];

// Panduan submenu definition
const MENUS_PANDUAN = [
    { key: "Semua", label: "Semua Panduan" },
    { key: "Akun", label: "Akun" },
    { key: "Sistem", label: "Sistem" },
    { key: "Akademik", label: "Akademik" },
    { key: "Tugas", label: "Tugas" },
    { key: "Bantuan", label: "Bantuan" },
];

// Data mock untuk aktivitas terkini
const RECENT_ACTIVITIES = [
    { title: "Budi mengedit data", time: "5 menit lalu" },
    { title: "Siti Rahayu login", time: "12 menit lalu" },
    { title: "Laporan MBKM diunggah", time: "1 jam lalu" },
    { title: "Sistem diperbarui", time: "2 jam lalu" },
];


export default function Navbar() {
    return (
        <Suspense fallback={<NavbarFallback />}>
            <NavbarContent />
        </Suspense>
    );
}

function NavbarFallback() {
    return <aside className="w-[360px] h-full shrink-0 bg-[#0f172a]"></aside>;
}

function NavbarContent() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { user, logout } = useAuth();

    const [openGroups, setOpenGroups] = useState(() => {
        // Cari tau group mana yang aktif saat render pertama kali
        const activeKey = pathname.startsWith("/tabel/") ? pathname.replace("/tabel/", "") : "";
        const group = GROUPED_MENUS_TABEL.find(g => g.items.some(item => item.key === activeKey));
        return {
            [group ? group.group : "MASTER DATA"]: true,
        };
    });

    // Otomatis buka group menu ketika pathname berubah (saat navigasi dari Dashboard atau halaman lain)
    useEffect(() => {
        if (pathname.startsWith('/tabel/')) {
            const currentKey = pathname.replace("/tabel/", "");
            const group = GROUPED_MENUS_TABEL.find(g => g.items.some(item => item.key === currentKey));
            if (group) {
                setOpenGroups(prev => ({
                    ...prev,
                    [group.group]: true
                }));
            }
        }
    }, [pathname]);

    // ── Remember last visited tabel ──────────────────────────────────────────
    const DEFAULT_TABEL = '/tabel/master/pegawai';
    const [tabelHref, setTabelHref] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lastVisitedTabel') || DEFAULT_TABEL;
        }
        return DEFAULT_TABEL;
    });

    // Setiap kali user berpindah ke halaman /tabel/..., simpan ke localStorage
    useEffect(() => {
        if (pathname.startsWith('/tabel/')) {
            localStorage.setItem('lastVisitedTabel', pathname);
            setTabelHref(pathname);
        }
    }, [pathname]);
    // ─────────────────────────────────────────────────────────────────────────

    const toggleGroup = (groupName) => {
        setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    const isLogin = pathname.startsWith("/login");

    // Tentukan page mana yang sedang aktif berdasarkan kecocokan string URL
    const activeLink = NAV_LINKS.find(link => pathname.startsWith(link.href)) || NAV_LINKS[0];
    const isDashboard = pathname === "/dashboard";
    const isTabel = pathname.startsWith("/tabel");
    const isBerita = pathname.startsWith("/berita");
    const isPanduan = pathname.startsWith("/panduan");
    const isProfile = pathname.startsWith("/profile");

    // Untuk tabel & berita submenu
    const activeTabKey = pathname.startsWith("/tabel/") ? pathname.replace("/tabel/", "") : "";
    const activeKategoriBerita = searchParams?.get('kategori') || 'Semua';

    // Fetch counts untuk tabel jika di halaman tabel (memakai react-query yang mencache respon agar efisien)
    // Menggunakan useQueries (bukan useQuery di dalam loop) untuk mematuhi Rules of Hooks
    const queryResults = useQueries({
        queries: FLAT_MENUS_TABEL.map(m => ({
            queryKey: [m.key],
            queryFn: () => createService(m.key).getAll(),
            select: (res) => res.data?.length ?? (res.data ? 1 : 0),
            enabled: isTabel, // Hanya fetch jika kita sedang di page tabel
        }))
    });

    const counts = {};
    FLAT_MENUS_TABEL.forEach((m, idx) => {
        counts[m.key] = queryResults[idx].data ?? 0;
    });
    const totalSemuaData = Object.values(counts).reduce((a, n) => a + n, 0);

    // PENTING: Early return untuk halaman login HARUS diletakkan SETELAH semua deklarasi Hook (seperti useQueries di atas)
    // Jika halaman login, sembunyikan sidebar
    if (isLogin) return null;


    return (
        <>
            {/* ─── MOBILE HEADER ─── */}
            <div className="md:hidden flex-none w-full h-[65px] bg-[#1e3a8a] flex items-center justify-between px-5 shadow-md z-30 relative shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                        <img src={LogoStikom.src} alt="Logo SI-AKREDITASI" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-black text-white tracking-widest text-[1rem]">SI-AKREDITASI</span>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors border-none outline-none cursor-pointer"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* ─── MOBILE OVERLAY ─── */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed top-[65px] inset-x-0 bottom-0 bg-[#0f172a]/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                ></div>
            )}

            {/* ─── SIDEBAR / DRAWER ─── */}
            <aside
                className={`
                    fixed md:sticky right-0 md:right-auto md:left-0 top-[65px] md:top-0 h-[calc(100vh-65px)] md:h-screen shrink-0 z-50 md:z-40
                    shadow-[-4px_0_24px_rgba(15,23,42,0.15)] md:shadow-[4px_0_24px_rgba(15,23,42,0.15)] bg-[#0f172a] md:bg-transparent
                    transition-all duration-500 ease-in-out
                    ${mobileOpen ? "translate-x-0 w-[280px]" : "translate-x-full w-[280px] md:translate-x-0"}
                    ${isProfile ? "md:w-[90px]" : sidebarCollapsed ? "md:w-[90px]" : "md:w-[360px]"}
                `}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >

                {/* ─── DESKTOP VIEW (2 Columns) ─── */}
                <div className="hidden md:flex h-full w-full">
                    {/* Narrow Icon Column */}
                    <div className="w-[90px] h-full bg-[#1e3a8a] flex flex-col items-center py-6 border-r border-[#1e3a8a]/50 relative z-20 shrink-0">
                        {/* Logo */}
                        <div className="w-[55px] h-[55px] flex items-center justify-center mb-10">
                            <img
                                src={LogoStikom.src}
                                alt="Logo SI-AKREDITASI"
                                className="w-full h-full object-contain drop-shadow-md"
                            />
                        </div>

                        {/* Pill Nav */}
                        <div className="bg-[#0f172a]/50 rounded-[40px] py-4 px-2.5 flex flex-col gap-4 shadow-inner border border-white/5">
                            {NAV_LINKS.map((link) => {
                                const resolvedHref = link.name === 'Tabel Data' ? tabelHref : link.href;
                                const isActive = pathname.startsWith(link.href);
                                return (
                                    <div key={link.name} className="relative group">
                                        <Link
                                            href={resolvedHref}
                                            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                                    ? "bg-[#facc15] text-[#0f172a] shadow-md shadow-[#facc15]/20 scale-105"
                                                    : "hover:bg-white/10 text-[#94a3b8] hover:text-white"
                                                }`}
                                        >
                                            {link.icon}
                                        </Link>

                                        {/* Tooltip Pop-up */}
                                        <div className="absolute left-[120%] top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-[#0f172a] text-white text-[0.7rem] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-white/10 z-50 pointer-events-none">
                                            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-[#0f172a] rotate-45 border-l border-b border-white/10"></div>
                                            {link.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Profile & Logout Circle Bubble (Muncul Khusus di Luar Dashboard) */}
                        {!isDashboard && (
                            <div className="mt-auto relative z-50">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="w-[44px] h-[44px] rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-[0.95rem] shadow-[0_0_15px_rgba(0,0,0,0.4)] border border-white/10 outline-none cursor-pointer hover:scale-105 hover:bg-[#1e293b] transition-all"
                                >
                                    A
                                </button>

                                {/* Pop-up Profil */}
                                {profileOpen && (
                                    <>
                                        {/* Overlay penutup transparan untuk klik di luar */}
                                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>

                                        <div className="absolute left-[125%] bottom-0 w-[220px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.2)] border border-[#e2e8f0] p-1.5 flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
                                            <div className="px-4 py-3 border-b border-[#f1f5f9] mb-1.5 bg-[#f8fafc] rounded-t-[14px]">
                                                <p className="text-[0.8rem] font-black text-[#0f172a] m-0 tracking-wide uppercase">{user?.username || 'User'}</p>
                                                <p className="text-[0.65rem] text-[#64748b] font-medium m-0 mt-0.5 tracking-wide">{user?.unit || 'No Unit'}</p>
                                            </div>
                                            <Link href="/profile" onClick={() => { setProfileOpen(false); setMobileOpen(false); }} className="flex items-center gap-3 px-3.5 py-2.5 text-[0.75rem] font-bold text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] hover:indent-1 rounded-xl transition-all">
                                                <svg className="w-[18px] h-[18px] text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                Profil Saya
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    setMobileOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-3 px-3.5 py-2.5 mt-0.5 text-[0.75rem] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 hover:indent-1 rounded-xl transition-all text-left border-none outline-none cursor-pointer bg-transparent"
                                            >
                                                <svg className="w-[18px] h-[18px] text-red-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Keluar Sistem
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        {/* Toggle Collapse Button — tampil di semua halaman kecuali profile */}
                        {!isProfile && (
                            <button
                                onClick={() => setSidebarCollapsed(v => !v)}
                                className="mt-3 w-[44px] h-[44px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/15 transition-all outline-none cursor-pointer"
                                title={sidebarCollapsed ? "Buka Menu" : "Tutup Menu"}
                            >
                                <svg className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7M21 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Wide Text Column */}
                    {!isProfile && (
                        <div className={`bg-[#0f172a] relative z-10 h-full overflow-hidden transition-all duration-500 ease-in-out ${sidebarCollapsed ? "w-0 opacity-0" : "w-[270px] opacity-100"}`}>
                            <div className="w-[270px] flex flex-col h-full pt-9 px-6">
                            {/* Header dengan Icon */}
                            <div className="flex items-center gap-3 mb-8 mt-1.5">
                                <div className="text-[#facc15] bg-[#facc15]/10 p-2.5 rounded-xl border border-[#facc15]/20 shrink-0">
                                    {activeLink.icon}
                                </div>
                                <h1 className="text-[1.15rem] font-bold text-white tracking-wide transition-opacity duration-300 m-0 truncate">
                                    {activeLink.name}
                                </h1>
                            </div>

                            {/* Submenu Tabel Section - HANYA MUNCUL DI TABEL */}
                            {isTabel && (
                                <div className="flex flex-col flex-1 pl-1 overflow-y-auto pr-2 custom-scrollbar pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#38bdf8 transparent' }}>
                                    <nav className="flex flex-col gap-4">
                                        {GROUPED_MENUS_TABEL.map((group, gIdx) => {
                                            const isOpen = openGroups[group.group] ?? false;
                                            return (
                                                <div key={gIdx} className="flex flex-col gap-0.5">
                                                    <button
                                                        onClick={() => toggleGroup(group.group)}
                                                        className="w-full flex items-center justify-between px-3 py-2.5 bg-transparent hover:bg-slate-800/40 rounded-xl transition-all duration-200 border-none cursor-pointer outline-none group"
                                                    >
                                                        <span className="text-[0.65rem] font-bold text-slate-400 group-hover:text-slate-200 uppercase tracking-widest transition-colors">{group.group}</span>
                                                        <svg className={`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                                    </button>

                                                    {isOpen && (
                                                        <div className="flex flex-col gap-1 mt-1 ml-2 relative">
                                                            {/* Garis vertikal penghubung (tepat di tengah dot: px-2(8px) + setengah w-4(8px) = 16px pusatnya. w-2px letakkan di 15px) */}
                                                            <div className="absolute left-[15px] top-[20px] bottom-[20px] w-[2px] bg-slate-800"></div>
                                                            
                                                            {group.items.map(menu => {
                                                                const isTabActive = activeTabKey === menu.key;
                                                                return (
                                                                    <button
                                                                        key={menu.key}
                                                                        onClick={() => router.push(`/tabel/${menu.key}`)}
                                                                        className={`relative w-full flex items-center justify-between rounded-xl px-2 py-2.5 text-[0.8rem] font-medium cursor-pointer border-none outline-none text-left transition-all duration-200 group
                                                                    ${isTabActive
                                                                                ? "bg-blue-500/10 text-blue-400"
                                                                                : "bg-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center w-full">
                                                                            {/* Dot Indikator */}
                                                                            <div className="w-4 flex justify-center shrink-0">
                                                                                <div className={`w-1.5 h-1.5 rounded-full z-10 transition-all duration-300 ${isTabActive ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] scale-125' : 'bg-slate-600 group-hover:bg-slate-400'}`}></div>
                                                                            </div>
                                                                            
                                                                            <div className="pl-3 truncate">
                                                                                <span className={`leading-tight truncate ${isTabActive ? "font-bold text-blue-400" : ""}`}>{menu.label}</span>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </nav>

                                    <div className="mt-8 shrink-0">
                                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                                            <p className="m-0 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">Total Semua Data</p>
                                            <p className="m-0 mt-1 text-2xl font-black text-[#38bdf8]">
                                                {totalSemuaData}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submenu Berita Section - HANYA MUNCUL DI BERITA */}
                            {isBerita && (
                                <div className="flex flex-col flex-1 pl-1">
                                    <p className="text-[0.65rem] font-black text-[#94a3b8] uppercase tracking-widest mb-4">Kategori Berita</p>
                                    <nav className="flex flex-col gap-2">
                                        {MENUS_BERITA.map(menu => {
                                            const isCatActive = activeKategoriBerita === menu.key;
                                            return (
                                                <button
                                                    key={menu.key}
                                                    onClick={() => router.replace(`/berita?kategori=${menu.key}`)}
                                                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-[0.85rem] font-medium cursor-pointer border-none outline-none text-left transition-all duration-200 group
                                                ${isCatActive
                                                            ? "bg-[#1e3a8a] shadow-[inset_0_0_0_1px_rgba(56,189,248,0.3)]"
                                                            : "bg-transparent hover:bg-white/[0.04]"
                                                        }`}
                                                >
                                                    <span className={`leading-tight ${isCatActive ? "text-white font-bold" : "text-[#cbd5e1]"}`}>{menu.label}</span>
                                                    {isCatActive && (
                                                        <span className="h-2 w-2 rounded-full bg-[#facc15] shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            )}

                            {/* Submenu Panduan Section - HANYA MUNCUL DI PANDUAN */}
                            {isPanduan && (
                                <div className="flex flex-col flex-1 pl-1">
                                    <p className="text-[0.65rem] font-black text-[#94a3b8] uppercase tracking-widest mb-4">Kategori Panduan</p>
                                    <nav className="flex flex-col gap-2">
                                        {MENUS_PANDUAN.map(menu => {
                                            const isActive = (searchParams?.get('kategori') || 'Semua') === menu.key;
                                            return (
                                                <button
                                                    key={menu.key}
                                                    onClick={() => router.replace(`/panduan?kategori=${menu.key}`)}
                                                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-[0.85rem] font-medium cursor-pointer border-none outline-none text-left transition-all duration-200
                                                ${isActive
                                                            ? "bg-[#1e3a8a] shadow-[inset_0_0_0_1px_rgba(56,189,248,0.3)]"
                                                            : "bg-transparent hover:bg-white/[0.04]"
                                                        }`}
                                                >
                                                    <span className={`leading-tight ${isActive ? "text-white font-bold" : "text-[#cbd5e1]"}`}>{menu.label}</span>
                                                    {isActive && (
                                                        <span className="h-2 w-2 rounded-full bg-[#facc15] shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            )}

                            {/* Aktivitas Terkini Section - HANYA MUNCUL DI DASHBOARD */}
                            {isDashboard && (
                                <div className="flex flex-col flex-1 truncate">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[0.65rem] font-black text-[#94a3b8] uppercase tracking-widest m-0">Aktivitas Terkini</p>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#facc15] animate-pulse"></div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {RECENT_ACTIVITIES.map((activity, idx) => (
                                            <div key={idx} className="flex gap-3 relative before:absolute before:left-[3px] before:top-6 before:w-px before:h-[calc(100%+4px)] before:bg-white/10 last:before:hidden">
                                                <div className="w-2 h-2 rounded-full bg-[#38bdf8] shrink-0 mt-1.5 relative z-10 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
                                                <div className="flex flex-col gap-0.5 truncate">
                                                    <p className="text-[0.75rem] font-medium text-white m-0 leading-snug truncate">{activity.title}</p>
                                                    <span className="text-[0.6rem] font-medium text-[#64748b] truncate">{activity.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer Copy / V1.0 Area */}
                            <div className={`mt-auto mb-6 pt-6 border-t border-white/10 ${!isDashboard && !isTabel && !isBerita && !isPanduan && 'mt-[calc(100vh-200px)]'}`}>
                                <p className="text-[0.65rem] font-medium text-[#64748b] leading-relaxed text-center tracking-wide italic m-0">Platform Akademik V1.0</p>
                            </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── MOBILE VIEW (Unified 1 Column) ─── */}
                <div className="flex md:hidden flex-col h-full w-full bg-[#0f172a] overflow-y-auto pt-6 px-4 pb-10">

                    {/* User Profile Info on Mobile */}
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-12 h-12 rounded-full bg-[#facc15] flex items-center justify-center font-bold text-[#0f172a] text-lg shrink-0">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-[0.9rem] uppercase tracking-wide">{user?.username || 'User'}</span>
                            <span className="text-[#94a3b8] font-medium text-[0.7rem] uppercase">{user?.unit || 'No Unit'}</span>
                        </div>
                    </div>

                    {/* Unified Navigation Links */}
                    <div className="flex flex-col gap-2">
                        {NAV_LINKS.map(link => {
                            const resolvedHref = link.name === 'Tabel Data' ? tabelHref : link.href;
                            const isActive = pathname.startsWith(link.href);
                            return (
                                <div key={link.name}>
                                    <Link
                                        href={resolvedHref}
                                        onClick={() => { if (!link.href.startsWith("/tabel")) setMobileOpen(false); }}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive ? "bg-[#1e3a8a] text-white shadow-md font-bold" : "text-[#94a3b8] hover:bg-white/5 hover:text-white font-medium"
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-[#facc15] text-[#0f172a]' : ''}`}>
                                            {link.icon}
                                        </div>
                                        <span className="text-[0.85rem] tracking-wide">{link.name}</span>
                                    </Link>

                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-4">
                        <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[#94a3b8] hover:bg-white/5 hover:text-white font-medium transition-all mb-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <span className="text-[0.85rem] tracking-wide">Profil Saya</span>
                        </Link>
                        <button onClick={() => { setMobileOpen(false); logout(); }} className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-400 font-bold transition-all border-none outline-none cursor-pointer bg-transparent">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </div>
                            <span className="text-[0.85rem] tracking-wide">Keluar Sistem</span>
                        </button>
                    </div>

                </div>
            </aside>
        </>
    );
}
