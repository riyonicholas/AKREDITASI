"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Semua path yang dimulai /login = tidak perlu autentikasi
const isPublicPath = (path) => path.startsWith("/login");

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;
        // Belum login & bukan halaman publik → redirect ke /login
        if (!user && !isPublicPath(pathname)) {
            router.replace("/login");
        }
        // Sudah login & di halaman login → redirect ke /table
        if (user && isPublicPath(pathname)) {
            router.replace("/tabel");
        }
    }, [user, loading, pathname, router]);

    // Spinner saat cek auth
    if (loading) return (
        <div className="min-h-screen bg-[#09090f] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full border-4 border-violet-400 border-t-transparent animate-spin" />
                <p className="text-slate-500 text-sm">Memuat...</p>
            </div>
        </div>
    );

    // Blok render jika belum login & bukan public route
    if (!user && !isPublicPath(pathname)) return null;

    return children;
}
