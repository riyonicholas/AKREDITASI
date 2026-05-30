'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [token, setToken]     = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Muat session dari localStorage saat pertama kali render
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser  = localStorage.getItem('user');
            if (storedToken) {
                setToken(storedToken);
                setUser(storedUser ? JSON.parse(storedUser) : null);
            }
        } catch (e) {
            console.error('AuthContext: gagal membaca localStorage', e);
        } finally {
            setLoading(false);
        }
    }, []);

    /** Login — simpan token & user ke state + localStorage */
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    /** Logout — hapus semua session */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/** Hook utama — gunakan di dalam komponen */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth harus digunakan di dalam <AuthProvider>');
    return ctx;
}
