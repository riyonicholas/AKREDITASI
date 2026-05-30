const db = require('../../config/db');

/**
 * Model Tabel 1.A.5 - Mode Otomatis (Live)
 * Mengambil rekapitulasi langsung dari Master Tenaga Kependidikan & Pegawai
 */
const Model1a5 = {
    // Query Utama: Menghitung jumlah ijazah per kategori tendik secara Live
    findGlobalSummary: async () => {
        /**
         * Penjelasan Query:
         * 1. Ambil data dari tenaga_kependidikan (T).
         * 2. Join ke pegawai (P) untuk ambil pendidikan_terakhir.
         * 3. Join ke unit_kerja (U) untuk ambil lokasi kerjanya.
         * 4. Gunakan COUNT(CASE...) untuk memilah ijazah ke kolom-kolom (S3, S2, dsb).
         */
        const sql = `
            SELECT 
                t.jenis_tendik AS jenis,
                COUNT(CASE WHEN p.pendidikan_terakhir = 'S3' THEN 1 END) AS s3,
                COUNT(CASE WHEN p.pendidikan_terakhir = 'S2' THEN 1 END) AS s2,
                COUNT(CASE WHEN p.pendidikan_terakhir = 'S1' THEN 1 END) AS s1,
                COUNT(CASE WHEN p.pendidikan_terakhir = 'D4' THEN 1 END) AS d4,
                COUNT(CASE WHEN p.pendidikan_terakhir = 'D3' THEN 1 END) AS d3,
                COUNT(CASE WHEN p.pendidikan_terakhir = 'D2' THEN 1 END) AS d2,
                COUNT(CASE WHEN p.pendidikan_terakhir = 'D1' THEN 1 END) AS d1,
                COUNT(CASE WHEN p.pendidikan_terakhir IN ('SMA', 'SMK', 'MA', 'SMA/SMK/MA') THEN 1 END) AS sma,
                GROUP_CONCAT(DISTINCT u.nama_unit SEPARATOR ', ') AS unit_kerja
            FROM tenaga_kependidikan t
            JOIN pegawai p ON t.id_pegawai = p.id_pegawai
            LEFT JOIN unit_kerja u ON p.id_unit = u.id_unit
            GROUP BY t.jenis_tendik
            ORDER BY t.jenis_tendik ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
};

module.exports = Model1a5;