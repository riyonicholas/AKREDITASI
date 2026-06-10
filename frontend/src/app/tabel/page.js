'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GROUPED_MENUS_TABEL } from '@/components/Navbar';

export default function TabelPage() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        // Jika belum ada data user (masih loading AuthContext), tunggu dulu
        if (user === undefined) return;

        const userUnit = user?.unit ? user.unit.trim().toUpperCase() : "";

        // Saring menu tabel sesuai role
        const filteredGroupedMenusTabel = GROUPED_MENUS_TABEL.filter(group => {
            const groupName = group.group.trim().toUpperCase();
            if (userUnit === 'ADMIN' || userUnit === 'ADMINISTRATOR') return true;
            if (groupName === 'KEUANGAN' && userUnit === 'WAKET 2') return true;
            return groupName === userUnit;
        });

        const flatFilteredMenus = filteredGroupedMenusTabel.flatMap(g => g.items);
        const DEFAULT_TABEL = flatFilteredMenus.length > 0 ? `/tabel/${flatFilteredMenus[0].key}` : '/tabel/master/pegawai';

        const saved = localStorage.getItem('lastVisitedTabel');
        
        // Cek apakah tabel yang tersimpan diijinkan untuk user saat ini
        const isAccessible = flatFilteredMenus.some(item => `/tabel/${item.key}` === saved);

        if (saved && isAccessible) {
            router.replace(saved);
        } else {
            localStorage.setItem('lastVisitedTabel', DEFAULT_TABEL);
            router.replace(DEFAULT_TABEL);
        }
    }, [user, router]);

    return (
        <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-sm animate-pulse">Menyiapkan Tabel Data...</p>
            </div>
        </div>
    );
}
