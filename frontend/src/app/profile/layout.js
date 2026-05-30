'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfileLayout({ children }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]"
             style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
            {/* Sidebar Navbar */}
            <Navbar />

            {/* Konten Utama */}
            <main className="flex-1 overflow-y-auto flex flex-col">
                <div className="flex-1">
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
}
