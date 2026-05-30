import Link from "next/link";
import * as Separator from "@radix-ui/react-separator";

const footerLinks = [
    { href: "/tabel", label: "Dashboard" },
    { href: "/table/master/pegawai", label: "Halaman Tabel" },
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/belajar", label: "Playground" },
    { href: "/profile", label: "Profil" },
];

const techStack = ["Next.js 16", "React 19", "Tailwind CSS v4", "Radix UI", "React Query"];

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-[rgba(10,8,30,0.95)] border-t border-white/[0.08] font-[system-ui] text-slate-400 pt-12">
            <div className="mx-auto max-w-[1100px] px-6 pb-10 grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-10">

                {/* Brand */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-md p-1 shadow-sm">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[1.1rem] font-semibold text-slate-200 tracking-wider">
                            SI-<strong className="font-extrabold text-blue-400">AKREDITASI</strong>
                        </span>
                    </div>
                    <p className="text-[0.85rem] text-slate-500 leading-relaxed m-0 max-w-[280px]">
                        Sistem Informasi Akreditasi Kampus.
                        Mendukung pengelolaan dan monitoring data akreditasi secara komprehensif.
                    </p>
                </div>

                {/* Navigasi */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-[0.8rem] font-bold tracking-widest uppercase text-slate-200 m-0">Navigasi</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1.5 text-[0.875rem] text-slate-500">
                        {footerLinks.map(({ href, label }) => (
                            <li key={href}>
                                <Link href={href} className="text-slate-500 no-underline hover:text-violet-400 transition-colors duration-200">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-[0.8rem] font-bold tracking-widest uppercase text-slate-200 m-0">Tech Stack</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1.5 text-[0.875rem] text-slate-500">
                        {techStack.map(t => <li key={t}>{t}</li>)}
                    </ul>
                </div>
            </div>

            <Separator.Root className="bg-white/[0.06] h-px mx-auto max-w-[1100px]" />
            <div className="mx-auto max-w-[1100px] px-6 py-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.8rem] text-slate-500 m-0">
                    © {year} MBKMApp — Dibuat untuk pembelajaran &amp; eksplorasi.
                </p>
                <div className="flex gap-2">
                    {["Next.js", "React", "OSS"].map(b => (
                        <span key={b} className="text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-400">
                            {b}
                        </span>
                    ))}
                </div>
            </div>
        </footer>
    );
}
