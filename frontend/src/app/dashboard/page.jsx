"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { createService } from "@/lib/api";

// Sinkron dengan GROUPED_MENUS_TABEL di Navbar.js
// Setiap grup memiliki href ke item pertamanya sebagai entry point
const TABEL_MENU_GROUPS = [
  {
    group: "MASTER DATA",
    href: "/tabel/master/pegawai",
    desc: "Pegawai, Dosen, Tendik, Prodi, Users",
    color: "#1e3a8a",
    accent: "#38bdf8",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    group: "UPPS",
    href: "/tabel/pimpinan",
    desc: "Pimpinan, Beban DTPR, Pengembangan, Visi Misi",
    color: "#0f172a",
    accent: "#facc15",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    group: "KEUANGAN",
    href: "/tabel/sumber-dana",
    desc: "Sumber Dana, Penggunaan Dana",
    color: "#064e3b",
    accent: "#34d399",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    group: "KEPEGAWAIAN",
    href: "/tabel/tendik-kualifikasi",
    desc: "Kualifikasi Tendik",
    color: "#4c1d95",
    accent: "#a78bfa",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    group: "SARPRAS",
    href: "/tabel/sarpras-penelitian",
    desc: "Sarpras Penelitian, PkM, Pendidikan",
    color: "#7c2d12",
    accent: "#fb923c",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    group: "TPM",
    href: "/tabel/spmi",
    desc: "Unit SPMI & SDM, Data TPM",
    color: "#0c4a6e",
    accent: "#38bdf8",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    group: "PMB",
    href: "/tabel/data-mahasiswa",
    desc: "Data Mahasiswa, Keragaman Asal",
    color: "#581c87",
    accent: "#c084fc",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    group: "ALA",
    href: "/tabel/data-mahasiswa",
    desc: "Data & Kondisi Mahasiswa",
    color: "#164e63",
    accent: "#22d3ee",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    group: "PRODI",
    href: "/tabel/isi-pembelajaran",
    desc: "Isi, CPL, CPMK, Fleksibilitas Pembelajaran",
    color: "#134e4a",
    accent: "#2dd4bf",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    group: "KEMAHASISWAAN",
    href: "/tabel/alumni",
    desc: "Alumni, Accuracy, Rekognisi Lulusan",
    color: "#312e81",
    accent: "#818cf8",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    group: "LPPM",
    href: "/tabel/penelitian-dtpr",
    desc: "Penelitian DTPR, PkM DTPR",
    color: "#14532d",
    accent: "#4ade80",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    group: "SISFO",
    href: "/tabel/tata-kelola",
    desc: "Sistem Tata Kelola",
    color: "#1e1b4b",
    accent: "#a5b4fc",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
  },
];

// Definisi 12 kelompok menu tabel (menggunakan label persis seperti Navbar dan endpoint riil)
const CHART_GROUPS = [
  {
    label: "MASTER DATA", color: "#1e3a8a",
    items: [
      { endpoint: "master/pegawai", label: "Pegawai" },
      { endpoint: "master/dosen", label: "Dosen" },
      { endpoint: "master/tendik", label: "Tendik" },
      { endpoint: "master/prodi", label: "Program Studi" },
      { endpoint: "master/users", label: "Users" },
    ]
  },
  {
    label: "UPPS", color: "#0ea5e9",
    items: [
      { endpoint: "upps/1a1-pimpinan", label: "1.A.1 Pimpinan & Tupoksi" },
      { endpoint: "upps/1a4-beban", label: "1.A.4 Beban DTPR" },
      { endpoint: "upps/3a3-pengembangan", label: "3.A.3 Pengembangan DTPR" },
      { endpoint: "upps/6-visi-misi", label: "6 Kesesuaian Visi Misi" },
    ]
  },
  {
    label: "KEUANGAN", color: "#34d399",
    items: [
      { endpoint: "keuangan/1a2-sumber-pendanaan", label: "1.A.2 Sumber Pendanaan" },
      { endpoint: "keuangan/1a3-penggunaan-dana", label: "1.A.3 Penggunaan Dana" },
    ]
  },
  {
    label: "KEPEGAWAIAN", color: "#a78bfa",
    items: [
      { endpoint: "kepegawaian/1a5-tendik", label: "1.A.5 Kualifikasi Tendik" },
    ]
  },
  {
    label: "SARPRAS", color: "#f97316",
    items: [
      { endpoint: "sarpras/3a1-sarana-prasarana", label: "3.A.1 Sarpras Penelitian" },
      { endpoint: "sarpras/4a1-sarana-prasarana-pkm", label: "4.A.1 Sarpras PkM" },
      { endpoint: "sarpras/5-2-sarana-prasarana", label: "5.2 Sarpras Pendidikan" },
    ]
  },
  {
    label: "TPM", color: "#ef4444",
    items: [
      { endpoint: "tpm/1b-spmi", label: "1.B Unit SPMI & SDM" },
      { endpoint: "tpm/1b-tpm", label: "1.B Data TPM" },
    ]
  },
  {
    label: "PMB", color: "#8b5cf6",
    items: [
      { endpoint: "pmb/2a1-data-mahasiswa", label: "2.A.1 Data Mahasiswa" },
      { endpoint: "pmb/2a2-keragaman-asal", label: "2.A.2 Asal Mahasiswa" },
    ]
  },
  {
    label: "ALA", color: "#06b6d4",
    items: [
      { endpoint: "ala/2a1-data-mahasiswa", label: "2.A.1 Data Mahasiswa" },
      { endpoint: "ala/2a3-kondisi-mahasiswa", label: "2.A.3 Kondisi Mahasiswa" },
    ]
  },
  {
    label: "PRODI", color: "#10b981",
    items: [
      { endpoint: "prodi/2b1-isi-pembelajaran", label: "2.B.1 Isi Pembelajaran" },
      { endpoint: "prodi/2b2-pemetaan-cpl", label: "2.B.2 Pemetaan CPL-PL" },
      { endpoint: "prodi/2b3-peta-pemenuhan", label: "2.B.3 Peta Pemenuhan CPL" },
      { endpoint: "prodi/2c-fleksibilitas", label: "2.C Fleksibilitas Proses" },
    ]
  },
  {
    label: "KEMAHASISWAAN", color: "#f43f5e",
    items: [
      { endpoint: "kemahasiswaan/2b4-masa-tunggu", label: "2.B.4 Masa Tunggu" },
      { endpoint: "kemahasiswaan/2b5-kesesuaian-kerja", label: "2.B.5 Kesesuaian Kerja" },
      { endpoint: "kemahasiswaan/2b6-kepuasan", label: "2.B.6 Kepuasan Pengguna" },
      { endpoint: "kemahasiswaan/2d-rekognisi", label: "2.D Rekognisi Lulusan" },
    ]
  },
  {
    label: "LPPM", color: "#84cc16",
    items: [
      { endpoint: "lppm/3a2-penelitian-dtpr", label: "3.A.2 Penelitian DTPR" },
      { endpoint: "lppm/4a2-pkm-dtpr", label: "4.A.2 PkM DTPR" },
    ]
  },
  {
    label: "SISFO", color: "#6366f1",
    items: [
      { endpoint: "sisfo/5-1-sistem-tata-kelola", label: "5.1 Sistem Tata Kelola" },
    ]
  },
];

const UNIQUE_CHART_KEYS = Array.from(new Set(CHART_GROUPS.flatMap(g => g.items.map(i => i.endpoint))));

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const name = user?.nama ? user.nama.split(" ")[0] : user?.username || "Admin";
  const [showAll, setShowAll] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null); // State untuk detail chart

  // Saring menu & chart berdasarkan unit kerja (RBAC)
  const userUnit = user?.unit ? user.unit.trim().toUpperCase() : "";

  const filteredTabelMenuGroups = TABEL_MENU_GROUPS.filter(group => {
    const groupName = group.group.trim().toUpperCase();
    if (userUnit === 'ADMIN' || userUnit === 'ADMINISTRATOR') return true;
    return groupName === userUnit;
  });

  const filteredChartGroups = CHART_GROUPS.filter(group => {
    const groupName = group.label.trim().toUpperCase();
    if (userUnit === 'ADMIN' || userUnit === 'ADMINISTRATOR') return true;
    return groupName === userUnit;
  });

  const filteredUniqueChartKeys = Array.from(new Set(filteredChartGroups.flatMap(g => g.items.map(i => i.endpoint))));

  // ─── Whitelist endpoint yang sudah siap di backend ───────────────────────
  // Endpoint di LUAR daftar ini tidak akan di-fetch sama sekali (enabled:false)
  // → tidak ada request = tidak ada error merah di console
  // Tambahkan endpoint di sini setelah backend siap.
  const READY_ENDPOINTS = new Set([
    "master/pegawai",
    "master/dosen",
    "master/tendik",
    "master/prodi",
    "master/users",
    "upps/1a1-pimpinan",
    "kepegawaian/1a5-tendik",
    "prodi/2b1-isi-pembelajaran",
    "prodi/2b2-pemetaan-cpl",
    "prodi/2b3-peta-pemenuhan",
    "prodi/2c-fleksibilitas",
    "sisfo/5-1-sistem-tata-kelola",
  ]);

  const visibleMenus = showAll ? filteredTabelMenuGroups : filteredTabelMenuGroups.slice(0, 3);

  // State Kalender
  const [selectedDate, setSelectedDate] = useState(null);

  // Data Kalender Real-time
  const todayDateObj = new Date();
  const [currentMonth, setCurrentMonth] = useState(todayDateObj.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDateObj.getFullYear());
  const todayDate = todayDateObj.getDate();
  const isCurrentMonthYear = currentMonth === todayDateObj.getMonth() && currentYear === todayDateObj.getFullYear();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    let day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarEvents = {
    "1": { type: "holiday", title: "Hari Buruh Internasional" },
    "9": { type: "holiday", title: "Kenaikan Yesus Kristus" },
    "15": { type: "event", title: "Rapat Koordinasi Akreditasi" },
    "23": { type: "holiday", title: "Hari Raya Waisak" },
    "28": { type: "event", title: "Batas Akhir Upload Borang" },
  };

  // Fetch jumlah data tiap endpoint untuk donut chart
  // retry: 0 → tidak retry jika 404/500 (endpoint belum tersedia di backend)
  // queryFn silent-fail → return 0 jika error, tidak spam console
  const chartResults = useQueries({
    queries: filteredUniqueChartKeys.map(key => ({
      queryKey: ["dashboard-chart", key],
      queryFn: async () => {
        try {
          const res = await createService(key).getAll();
          return Array.isArray(res) ? res.length : (res?.data?.length ?? 0);
        } catch {
          return 0;
        }
      },
      enabled: READY_ENDPOINTS.has(key), // ← tidak fetch jika belum siap
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 menit — tidak re-fetch berulang
    }))
  });

  // Map hasil query ke tiap CHART_GROUP
  // Data default (Overview)
  const overviewData = filteredChartGroups.map(group => {
    const count = group.items.reduce((sum, item) => {
      const idx = filteredUniqueChartKeys.indexOf(item.endpoint);
      const actualCount = chartResults[idx]?.data;
      return sum + (actualCount ?? 0);
    }, 0);
    return { ...group, count };
  });

  // Palette warna untuk sub-menu
  const PALETTE = ["#38bdf8", "#34d399", "#facc15", "#f472b6", "#a78bfa", "#fb923c", "#60a5fa"];

  // Data yang sedang aktif ditampilkan
  let displayData = overviewData;
  let totalData = overviewData.reduce((s, g) => s + g.count, 0) || 1;
  let chartTitle = "TOTAL DATA";

  if (activeGroup) {
    const groupObj = filteredChartGroups.find(g => g.label === activeGroup);
    if (groupObj) {
      displayData = groupObj.items.map((item, i) => {
        const idx = filteredUniqueChartKeys.indexOf(item.endpoint);
        const actualCount = chartResults[idx]?.data;
        return {
          label: item.label,
          count: actualCount ?? 0,
          color: PALETTE[i % PALETTE.length],
          isSub: true
        };
      });
      totalData = displayData.reduce((s, g) => s + g.count, 0) || 1;
      chartTitle = activeGroup.toUpperCase();
    }
  }

  // True Donut Chart SVG
  function DonutChart() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoaded(true), 150);
      return () => clearTimeout(timer);
    }, []);

    const segments = [...displayData].filter(seg => seg.count > 0);
    const RADIUS = 95; // Radius utama
    const STROKE = 28; // Ketebalan chart
    const CIRC = 2 * Math.PI * RADIUS;

    let currentOffset = 0;

    return (
      <svg width="260" height="260" viewBox="0 0 260 260" className="drop-shadow-sm">
        <g transform="rotate(-90 130 130)">
          {/* Background Track (Satu ring utuh) */}
          <circle
            cx="130" cy="130" r={RADIUS}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={STROKE}
          />

          {/* Segments (Membentuk satu ring penuh) */}
          {segments.map((seg, i) => {
            const pct = totalData > 0 ? (seg.count / totalData) : 0;
            const dash = pct * CIRC;
            const gap = segments.length > 1 ? 3 : 0; // Jarak antar segmen
            const visibleDash = Math.max(0, dash - gap);

            // Animasi masuk menggunakan dasharray
            const strokeDasharray = `${isLoaded ? visibleDash : 0} ${CIRC}`;
            const strokeDashoffset = -currentOffset;

            currentOffset += dash;

            return (
              <circle
                key={seg.label}
                cx="130" cy="130" r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out hover:opacity-80 hover:stroke-[32px] cursor-pointer"
                style={{
                  transitionDelay: `${i * 0.05}s`
                }}
              />
            );
          })}
        </g>

        {/* Teks di tengah */}
        <text x="130" y="125" textAnchor="middle" fontSize="48" fontWeight="900" fill="#0f172a" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {totalData.toLocaleString()}
        </text>
        <text x="130" y="152" textAnchor="middle" fontSize={activeGroup ? "11" : "13"} fontWeight="700" fill="#94a3b8" className="uppercase tracking-[0.15em]">
          {chartTitle}
        </text>
      </svg>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };


  return (
    <div className="min-h-full flex flex-col bg-[#f8fafc] p-5 md:p-10" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 md:gap-0 mb-8 md:mb-10">
        <div>
          <h1 className="text-[1.5rem] md:text-[1.8rem] font-bold text-[#0f172a] mb-1">
            Hello, {name}! 👋
          </h1>
          <p className="text-[0.8rem] font-medium text-[#38bdf8] m-0 tracking-wide">
            Selamat datang di Panel Akreditasi STIKOM PGRI Banyuwangi
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 self-end md:self-auto">
          {/* Bell */}
          <button className="w-11 h-11 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0f172a] hover:bg-[#e0f2fe] hover:border-[#bae6fd] transition-all duration-300 cursor-pointer shadow-sm group relative outline-none">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* User Pill */}
          <button
            onClick={() => router.push("/profile")}
            className="h-11 bg-white hover:bg-slate-50 rounded-full flex items-center pl-[6px] pr-5 gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-slate-100 hover:border-[#bae6fd] outline-none cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#facc15] flex items-center justify-center font-black text-[#0f172a] text-[0.75rem] shadow-sm group-hover:rotate-12 transition-transform">
              {name[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-black text-[0.8rem] text-[#0f172a] tracking-wide">{name}</span>
              <span className="text-[0.6rem] text-[#38bdf8] font-bold uppercase tracking-widest mt-0.5">
                {user?.unit || "Administrator"}
              </span>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-11 h-11 bg-white border border-slate-100 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-100 transition-all duration-300 cursor-pointer shadow-sm group outline-none"
            title="Keluar Sistem"
          >
            <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>



      {/* ─── Stat Cards Row 2 (Full Width Donut Chart) ─── */}
      <div className="mb-5">
        {/* Donut Chart Card (Light Mode Design) */}
        <div className="w-full bg-white border-2 border-[#e2e8f0] rounded-2xl shadow-sm p-6 hover:border-[#bae6fd] transition-colors min-h-[220px] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0f172a] font-bold text-base m-0">
                {activeGroup ? `Detail Data: ${activeGroup}` : "Overview Data Akreditasi"}
              </h3>
              <p className="text-[#64748b] text-xs font-medium mt-0.5">
                {activeGroup ? "Klik tombol 'Kembali' untuk melihat semua kelompok" : "Distribusi jumlah data per kelompok"}
              </p>
            </div>
            {activeGroup ? (
              <button
                onClick={() => setActiveGroup(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Kembali
              </button>
            ) : (
              <div className="w-8 h-8 bg-[#f1f5f9] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 mt-2">
            {/* Donut */}
            <div className="shrink-0 flex justify-center md:justify-center w-full md:w-auto md:min-w-[300px] border-r-0 md:border-r border-slate-100 pr-0 md:pr-5">
              <DonutChart />
            </div>

            {/* Legend Grid / Buttons */}
            <div className="flex flex-col flex-1 w-full pl-0">
              {/* Alert Text */}
              <div className="mb-5 bg-gradient-to-r from-blue-50 to-[#f0f9ff] border border-blue-100 p-4 rounded-2xl flex items-start gap-3.5 shadow-sm">
                <div className="text-blue-500 mt-0.5 shrink-0 bg-white p-1.5 rounded-full shadow-sm border border-blue-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[0.75rem] md:text-sm text-slate-600 font-medium leading-relaxed m-0">
                  <strong className="text-blue-800 font-bold tracking-wide block mb-0.5">Panduan Visual:</strong>
                  Setiap warna merepresentasikan proporsi jumlah data riil dari masing-masing menu tabel. Anda dapat mengklik setiap item di bawah ini untuk melihat detail per-kategorinya secara terperinci.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-2">
                {displayData.map((g) => (
                  <button
                    key={g.label}
                    onClick={() => !g.isSub && setActiveGroup(g.label)}
                    className={`flex flex-col gap-0.5 p-2 rounded-lg border border-transparent transition-all text-left ${!g.isSub ? "hover:bg-slate-50 hover:border-slate-100 cursor-pointer" : "cursor-default"}`}
                    title={!g.isSub ? "Klik untuk melihat detail tabel" : ""}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
                      <span className="text-[0.7rem] text-[#64748b] font-medium truncate">{g.label}</span>
                    </div>
                    <span className="text-[0.8rem] font-bold text-[#0f172a] ml-4">{g.count.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards Row 3 ─── */}
      <div className="flex flex-col lg:flex-row gap-5 mb-8">
        {/* Info Card (Premium Dark) */}
        <div className="flex-[2] bg-[#0f172a] rounded-2xl shadow-xl p-6 lg:p-8 relative overflow-hidden group transition-transform hover:scale-[1.01] min-h-[220px] flex flex-col justify-center border border-slate-800/50">

          {/* Decorative Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          {/* Glowing Orbs */}
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#38bdf8]/10 rounded-full blur-3xl transition-transform duration-700 group-hover:translate-x-5 group-hover:bg-[#38bdf8]/20" />
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#facc15]/10 rounded-full blur-3xl transition-transform duration-700 group-hover:-translate-y-5 group-hover:bg-[#facc15]/20" />

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#facc15] to-[#eab308] rounded-2xl flex items-center justify-center text-[#0f172a] shadow-lg shadow-[#facc15]/20 rotate-3 group-hover:-rotate-3 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="px-4 py-1.5 bg-[#1e293b]/80 backdrop-blur-sm text-[#facc15] border border-slate-700/50 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              Informasi Sistem
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-white font-black text-2xl lg:text-3xl leading-tight mb-3 tracking-wide">
              FUNGSI WEB AKREDITASI
            </h3>
            <p className="text-slate-300 text-[13px] md:text-sm font-medium leading-relaxed max-w-xl">
              Sistem ini dirancang khusus untuk mempermudah civitas akademika STIKOM PGRI dalam mengelola, memantau, dan melaporkan seluruh dokumen serta data pendukung akreditasi secara terpusat, <strong className="text-white">real-time</strong>, dan terintegrasi antar program studi.
            </p>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="flex-1 lg:max-w-md w-full bg-white border border-[#e0f2fe] rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow min-h-[220px] flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <div className="flex items-center gap-1">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="bg-transparent text-[#0f172a] font-bold text-[14px] outline-none cursor-pointer hover:bg-slate-50 p-1 rounded-md transition-colors"
                >
                  {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="bg-transparent text-[#0f172a] font-bold text-[14px] outline-none cursor-pointer hover:bg-slate-50 p-1 rounded-md transition-colors"
                >
                  {[2024, 2025, 2026, 2027, 2028].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider border border-emerald-100">
              Jadwal
            </span>
          </div>

          <div className="grid grid-cols-7 gap-x-1 gap-y-1 text-center w-full mb-3">
            {['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mn'].map((day, i) => (
              <div key={i} className="text-[9px] font-black text-slate-400 uppercase">{day}</div>
            ))}

            {/* Blank spaces before 1st date */}
            {[...Array(firstDay >= 0 ? firstDay : 0)].map((_, i) => (
              <div key={`empty-${i}`} className="w-full aspect-square"></div>
            ))}

            {/* Real Dates */}
            {[...Array(daysInMonth)].map((_, i) => {
              const date = i + 1;
              const isToday = isCurrentMonthYear && date === todayDate;
              // Simulasi event hanya muncul di bulan/tahun saat ini
              const event = isCurrentMonthYear ? calendarEvents[date.toString()] : null;
              const isHoliday = event?.type === 'holiday';
              const isEvent = event?.type === 'event';
              const isSelected = selectedDate === date;

              return (
                <div
                  key={date}
                  onClick={() => setSelectedDate(isSelected ? null : date)}
                  className={`relative flex items-center justify-center w-full aspect-square text-[11px] rounded-lg font-bold transition-all cursor-pointer border border-transparent
                    ${isToday && !isSelected ? 'bg-blue-600 text-white shadow-sm scale-105 z-10' : ''}
                    ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50 text-emerald-700 scale-105 z-10' : ''}
                    ${!isToday && !isSelected ? 'hover:bg-slate-50 text-slate-700' : ''}
                    ${isHoliday && !isToday && !isSelected ? '!text-red-500' : ''}
                  `}
                  title={event?.title || ''}
                >
                  {date}
                  {isEvent && <div className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-emerald-500'}`}></div>}
                  {isHoliday && <div className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-red-500'}`}></div>}
                </div>
              );
            })}
          </div>

          {/* Deskripsi Event Section */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex-1 flex flex-col justify-end">
            {(() => {
              const targetDate = selectedDate || (isCurrentMonthYear ? todayDate : null);
              if (!targetDate) {
                return (
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center h-full text-center">
                    <span className="text-[10px] font-medium text-slate-400">Pilih tanggal untuk melihat agenda</span>
                  </div>
                );
              }

              const ev = isCurrentMonthYear ? calendarEvents[targetDate.toString()] : null;

              if (ev) {
                const isHol = ev.type === 'holiday';
                const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][currentMonth];
                return (
                  <div className={`p-2.5 rounded-xl border flex items-start gap-2 ${isHol ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isHol ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                    <div>
                      <p className={`text-[9px] font-black uppercase mb-0.5 ${isHol ? 'text-red-600' : 'text-emerald-700'}`}>
                        {targetDate} {monthName} • {isHol ? 'Tanggal Merah' : 'Agenda'}
                      </p>
                      <p className={`text-[11px] font-bold leading-tight ${isHol ? 'text-red-900' : 'text-slate-800'}`}>{ev.title}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center h-full text-center">
                  <span className="text-[10px] font-medium text-slate-400">Tidak ada agenda pada tanggal {targetDate}</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ─── Akses Cepat Menu Tabel ─── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-[#facc15] rounded-full"></div>
          <h2 className="text-[1rem] font-black text-[#0f172a] tracking-wide uppercase m-0">Akses Cepat Menu Tabel</h2>
          <span className="text-[0.65rem] font-bold text-[#94a3b8] bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
            {filteredTabelMenuGroups.length} Menu
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
          {visibleMenus.map((menu) => (
            <button
              key={menu.group}
              onClick={() => router.push(menu.href)}
              className="group relative flex flex-col items-start gap-5 p-8 rounded-3xl border border-slate-100 bg-white hover:border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left outline-none cursor-pointer overflow-hidden min-h-[180px]"
            >
              {/* Background accent on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                style={{ background: `${menu.color}` }}
              />

              {/* Icon */}
              <div
                className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${menu.color}18` }}
              >
                <div className="transition-colors duration-300 scale-125" style={{ color: menu.accent }}>
                  {menu.icon}
                </div>
              </div>

              {/* Text */}
              <div className="relative z-10 flex flex-col gap-1.5 w-full">
                <span className="text-[1rem] font-black text-[#0f172a] group-hover:text-white transition-colors duration-300 tracking-wide leading-tight">
                  {menu.group}
                </span>
                <span className="text-[0.78rem] text-[#94a3b8] group-hover:text-white/60 transition-colors duration-300 leading-relaxed line-clamp-2">
                  {menu.desc}
                </span>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Toggle Button */}
        {filteredTabelMenuGroups.length > 3 && (
          <div className="flex justify-center mt-5">
            <button
              onClick={() => setShowAll(v => !v)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full border-2 border-[#0f172a]/10 text-[#0f172a] text-[0.85rem] font-bold hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] transition-all duration-300 cursor-pointer bg-white shadow-sm"
            >
              {showAll ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  Tampilkan Lebih Sedikit
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  Tampilkan Semua ({filteredTabelMenuGroups.length} Menu)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>

  );
}
