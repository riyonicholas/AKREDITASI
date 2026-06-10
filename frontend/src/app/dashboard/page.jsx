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
    label: "MASTER DATA", color: "#3b82f6",
    items: [
      { endpoint: "master/pegawai", label: "Pegawai" },
      { endpoint: "master/dosen", label: "Dosen" },
      { endpoint: "master/tendik", label: "Tendik" },
      { endpoint: "master/prodi", label: "Program Studi" },
      { endpoint: "master/users", label: "Users" },
    ]
  },
  {
    label: "UPPS", color: "#10b981",
    items: [
      { endpoint: "upps/1a1-pimpinan", label: "1.A.1 Pimpinan & Tupoksi" },
      { endpoint: "upps/1a4-beban", label: "1.A.4 Beban DTPR" },
      { endpoint: "upps/3a3-pengembangan", label: "3.A.3 Pengembangan DTPR" },
      { endpoint: "upps/6-visi-misi", label: "6 Kesesuaian Visi Misi" },
    ]
  },
  {
    label: "KEUANGAN", color: "#f59e0b",
    items: [
      { endpoint: "keuangan/1a2-sumber-pendanaan", label: "1.A.2 Sumber Pendanaan" },
      { endpoint: "keuangan/1a3-penggunaan-dana", label: "1.A.3 Penggunaan Dana" },
    ]
  },
  {
    label: "KEPEGAWAIAN", color: "#a855f7",
    items: [
      { endpoint: "kepegawaian/1a5-tendik", label: "1.A.5 Kualifikasi Tendik" },
    ]
  },
  {
    label: "SARPRAS", color: "#ef4444",
    items: [
      { endpoint: "sarpras/3a1-sarana-prasarana", label: "3.A.1 Sarpras Penelitian" },
      { endpoint: "sarpras/4a1-sarana-prasarana-pkm", label: "4.A.1 Sarpras PkM" },
      { endpoint: "sarpras/5-2-sarana-prasarana", label: "5.2 Sarpras Pendidikan" },
    ]
  },
  {
    label: "TPM", color: "#06b6d4",
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
    label: "ALA", color: "#0ea5e9",
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
  const userUnit = user?.unit ? user.unit.trim().toUpperCase() : "ADMIN";

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

  const visibleMenus = showAll ? filteredTabelMenuGroups : filteredTabelMenuGroups.slice(0, 4);

  // State Kalender
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Data Kalender Real-time
  const todayDateObj = new Date();
  const [currentMonth, setCurrentMonth] = useState(todayDateObj.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDateObj.getFullYear());
  const todayDate = todayDateObj.getDate();
  const isCurrentMonthYear = currentMonth === todayDateObj.getMonth() && currentYear === todayDateObj.getFullYear();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const fullMonthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = Array.from({ length: 11 }, (_, i) => todayDateObj.getFullYear() - 5 + i);

  const handleMonthChange = (val) => {
    setCurrentMonth(val);
    setSelectedDate(null);
    setShowMonthDropdown(false);
  };

  const handleYearChange = (val) => {
    setCurrentYear(val);
    setSelectedDate(null);
    setShowYearDropdown(false);
  };

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
    const RADIUS = 80; // Radius utama
    const STROKE = 22; // Ketebalan chart
    const CIRC = 2 * Math.PI * RADIUS;

    let currentOffset = 0;

    return (
      <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-sm">
        <g transform="rotate(-90 100 100)">
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
          {segments.map((seg, i) => {
            const pct = totalData > 0 ? (seg.count / totalData) : 0;
            const dash = pct * CIRC;
            const gap = segments.length > 1 ? 2 : 0;
            const visibleDash = Math.max(0, dash - gap);
            const strokeDasharray = `${isLoaded ? visibleDash : 0} ${CIRC}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += dash;
            return (
              <circle key={seg.label} cx="100" cy="100" r={RADIUS} fill="none" stroke={seg.color} strokeWidth={STROKE} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="butt" className="transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer" style={{ transitionDelay: `${i * 0.05}s` }} />
            );
          })}
        </g>
        <text x="100" y="96" textAnchor="middle" fontSize="36" fontWeight="900" fill="#0f172a" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {totalData.toLocaleString()}
        </text>
        <text x="100" y="118" textAnchor="middle" fontSize="9" fontWeight="800" fill="#94a3b8" letterSpacing="0.1em" className="uppercase">
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
    <div className="min-h-full flex flex-col bg-[#f8fafc] p-5 md:p-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>

      {/* ─── Header Card ─── */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-4 md:p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-black text-[#0f172a] tracking-wide mb-1 flex items-center justify-center md:justify-start gap-2">
            Hello, {name}! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500 m-0">
            Selamat datang di Panel Akreditasi STIKOM PGRI Banyuwangi
          </p>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-auto">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100/50 rounded-full text-sm font-bold transition-all outline-none cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden sm:block">Logout</span>
          </button>

          {/* Bell */}
          <button className="w-10 h-10 shrink-0 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0f172a] hover:bg-slate-50 transition-colors relative cursor-pointer outline-none shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 cursor-pointer outline-none hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              {name[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col items-start hidden sm:flex pr-2">
              <span className="font-bold text-[13px] text-[#0f172a] leading-none">{name}</span>
              <span className="text-[11px] text-blue-600 font-bold leading-none mt-1.5 tracking-wide">{user?.unit || "Super Admin"}</span>
            </div>
          </button>
        </div>
      </div>

      {/* ─── Main Content Row ─── */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">

        {/* Overview Data Akreditasi */}
        <div className="flex-[2] bg-white rounded-[20px] border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[1.2rem] font-black text-[#0f172a] m-0 tracking-wide">Overview Data Akreditasi</h2>
              <p className="text-[0.8rem] text-slate-500 mt-1 m-0">Distribusi jumlah data per kelompok</p>
            </div>
            <button
              onClick={() => setActiveGroup(null)}
              className="text-slate-400 hover:text-blue-500 transition-colors outline-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50"
              title="Reset Overview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 flex-1 w-full justify-center lg:justify-between lg:pl-8 lg:pr-6">
            <div className="shrink-0 flex items-center justify-center relative w-[200px] h-[200px]">
              <DonutChart />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-6 lg:gap-x-10 w-full flex-1 md:w-auto">
              {displayData.map((g) => (
                <button
                  key={g.label}
                  onClick={() => !g.isSub && setActiveGroup(g.label)}
                  className={`flex flex-col text-left transition-transform outline-none ${!g.isSub ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }}></div>
                    <span className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest">{g.label}</span>
                  </div>
                  <span className="text-[1.2rem] font-black text-[#0f172a]">{g.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 lg:max-w-[340px] bg-white rounded-[20px] border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-8">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <div className="flex items-center gap-1.5 text-[1.1rem] font-black text-[#0f172a] tracking-wide relative">
                {/* Month Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setShowMonthDropdown(!showMonthDropdown); setShowYearDropdown(false); }}
                    className="hover:text-blue-600 transition-colors outline-none cursor-pointer px-1 flex items-center gap-1"
                  >
                    {fullMonthNames[currentMonth]}
                    <svg className={`w-3.5 h-3.5 transition-transform ${showMonthDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showMonthDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowMonthDropdown(false)}></div>
                      <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] border border-slate-100 py-2 w-36 max-h-56 overflow-y-auto z-20 flex flex-col font-medium">
                        {fullMonthNames.map((m, i) => (
                          <button
                            key={i}
                            onClick={() => handleMonthChange(i)}
                            className={`px-4 py-2 text-sm text-left transition-colors outline-none ${currentMonth === i ? 'font-black text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Year Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setShowYearDropdown(!showYearDropdown); setShowMonthDropdown(false); }}
                    className="hover:text-blue-600 transition-colors outline-none cursor-pointer px-1 flex items-center gap-1"
                  >
                    {currentYear}
                    <svg className={`w-3.5 h-3.5 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showYearDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowYearDropdown(false)}></div>
                      <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] border border-slate-100 py-2 w-28 max-h-56 overflow-y-auto z-20 flex flex-col font-medium">
                        {years.map(y => (
                          <button
                            key={y}
                            onClick={() => handleYearChange(y)}
                            className={`px-4 py-2 text-sm text-center transition-colors outline-none ${currentYear === y ? 'font-black text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">JADWAL</span>
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-3 text-center w-full">
            {['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'].map((day, i) => (
              <div key={i} className="text-[10px] font-bold text-slate-400">{day}</div>
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
              const isSelected = selectedDate === date || (!selectedDate && isToday);

              return (
                <div
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`relative flex items-center justify-center w-8 h-8 text-[12px] rounded-full font-bold mx-auto cursor-pointer transition-all
                    ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-[#0f172a] hover:bg-slate-100'}
                    ${isHoliday && !isSelected ? '!text-red-500' : ''}`}
                >
                  {date}
                  {isEvent && <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></div>}
                  {isHoliday && <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-red-500'}`}></div>}
                </div>
              );
            })}
          </div>

          {/* Deskripsi Event Section */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex-1 flex flex-col justify-end w-full">
            {(() => {
              const targetDate = selectedDate || (isCurrentMonthYear ? todayDate : null);
              if (!targetDate) {
                return (
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center text-center min-h-[54px]">
                    <span className="text-[10px] font-medium text-slate-400">Pilih tanggal untuk melihat agenda</span>
                  </div>
                );
              }

              const ev = isCurrentMonthYear ? calendarEvents[targetDate.toString()] : null;

              if (ev) {
                const isHol = ev.type === 'holiday';
                const monthName = fullMonthNames[currentMonth];
                return (
                  <div className={`p-3 rounded-xl border flex items-start gap-2.5 min-h-[54px] ${isHol ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isHol ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
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
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center text-center min-h-[54px]">
                  <span className="text-[10px] font-medium text-slate-400">Tidak ada agenda pada tanggal {targetDate}</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ─── Akses Cepat Menu Tabel ─── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-[1.2rem] font-black text-[#0f172a] m-0 tracking-wide">Akses Cepat Menu Tabel</h2>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">{filteredTabelMenuGroups.length} Menu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleMenus.map((menu) => {
            const groupData = overviewData.find(g => g.label === menu.group);
            const count = groupData ? groupData.count : 0;

            return (
              <button
                key={menu.group}
                onClick={() => router.push(menu.href)}
                className="bg-white border border-slate-100 rounded-[20px] p-6 hover:bg-blue-50 hover:border-blue-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] transition-all text-left flex flex-col cursor-pointer outline-none min-h-[170px] group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-white flex items-center justify-center text-blue-500 mb-5 transition-all group-hover:scale-110 group-hover:shadow-sm">
                  <div className="scale-110 text-blue-500">{menu.icon}</div>
                </div>
                <h4 className="text-[14px] font-black text-[#0f172a] mb-1.5 tracking-wide group-hover:text-blue-900 transition-colors">{menu.group}</h4>
                <p className="text-[12px] text-slate-500 leading-relaxed mb-6 flex-1 line-clamp-2 group-hover:text-blue-800/70 transition-colors">{menu.desc}</p>
                <div className="flex items-center justify-between w-full mt-auto">
                  <span className="text-[10px] font-black text-slate-600 bg-slate-50 group-hover:bg-white group-hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded">
                    {count} Data
                  </span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            )
          })}
        </div>

        {filteredTabelMenuGroups.length > 4 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(v => !v)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-slate-200 text-[#0f172a] text-[13px] font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 cursor-pointer bg-white shadow-sm"
            >
              {showAll ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  Tampilkan Lebih Sedikit
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  Tampilkan Semua
                </>
              )}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
