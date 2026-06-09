import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Konfigurasi axios dasar
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor untuk menyertakan token autentikasi jika ada
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * createService
 * Factory function untuk membuat service CRUD sederhana yang kompatibel dengan Navbar & komponen lainnya.
 */
export const createService = (endpoint) => ({
    getAll: async () => {
        try {
            const res = await api.get(`/${endpoint}`);
            return res.data;
        } catch (error) {
            // 4xx/5xx = endpoint belum siap di backend → kembalikan [] tanpa throw
            // Hanya log jika bukan error HTTP biasa (misal: server mati / network down)
            if (!error.response) {
                console.error(`[api] Network error on ${endpoint}:`, error.message);
            }
            return [];
        }
    },

    getById: async (id) => {
        const res = await api.get(`/${endpoint}/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await api.post(`/${endpoint}`, data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.put(`/${endpoint}/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/${endpoint}/${id}`);
        return res.data;
    },
});

export default api;
