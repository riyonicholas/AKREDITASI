const db = require('../../config/db');

/**
 * Model Tabel 2.D Rekognisi Lulusan
 * Fitur: Dynamic Ref Source & Integrated Graduates Count
 */
const Model2d = {
    // 1. Ambil data aktif (Filter Prodi & Range 3 Tahun)
    findAllRange: async (id_prodi, id_tahun) => {
        const sql = `
            SELECT 
                d.*, 
                s.nama_sumber,
                t.tahun AS nama_tahun
            FROM \`2d_rekognisi_lulusan\` d
            JOIN \`2d_ref_sumber_rekognisi\` s ON d.id_ref_sumber = s.id_ref_sumber
            JOIN tahun_akademik t ON d.id_tahun = t.id_tahun
            WHERE d.id_prodi = ? 
            AND d.id_tahun BETWEEN (? - 2) AND ? 
            AND d.deleted_at IS NULL
            ORDER BY s.is_default DESC, s.nama_sumber ASC, d.id_tahun DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows;
    },

    // 2. Logika Pintar: Cek Sumber Berdasarkan Nama (Dynamic Source)
    findOrCreateSource: async (nama_sumber) => {
        // Cek apakah sudah ada (case-insensitive)
        const [existing] = await db.execute(
            "SELECT id_ref_sumber FROM `2d_ref_sumber_rekognisi` WHERE LOWER(nama_sumber) = LOWER(?)",
            [nama_sumber.trim()]
        );

        if (existing.length > 0) return existing[0].id_ref_sumber;

        // Jika belum ada, buat baru sebagai kategori kustom (is_default = 0)
        const [result] = await db.execute(
            "INSERT INTO `2d_ref_sumber_rekognisi` (nama_sumber, is_default) VALUES (?, 0)",
            [nama_sumber.trim()]
        );
        return result.insertId;
    },

    // 3. Integrasi 2.B.4: Ambil Jumlah Lulusan Per Tahun
    getGraduatesCount: async (id_prodi, id_tahun) => {
        const sql = `
            SELECT id_tahun, SUM(jumlah_lulusan) as total 
            FROM \`2b4_masa_tunggu\` 
            WHERE id_prodi = ? AND id_tahun BETWEEN (? - 2) AND ?
            AND deleted_at IS NULL
            GROUP BY id_tahun
        `;
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows; // Mengembalikan array berisi total lulusan per tahun
    },

    // 4. CRUD Dasar
    create: async (data) => {
        const sql = `INSERT INTO \`2d_rekognisi_lulusan\` 
            (id_prodi, id_tahun, id_ref_sumber, jenis_rekognisi, link_bukti, created_by) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        return await db.execute(sql, [
            data.id_prodi, data.id_tahun, data.id_ref_sumber, 
            data.jenis_rekognisi, data.link_bukti, data.created_by
        ]);
    },

    update: async (id, data) => {
        const sql = `UPDATE \`2d_rekognisi_lulusan\` 
            SET id_ref_sumber = ?, jenis_rekognisi = ?, link_bukti = ?, updated_by = ? 
            WHERE id_2d = ?`;
        return await db.execute(sql, [data.id_ref_sumber, data.jenis_rekognisi, data.link_bukti, data.updated_by, id]);
    },

    findTrash: async (id_prodi) => {
        const sql = `
            SELECT d.*, s.nama_sumber, t.tahun AS nama_tahun 
            FROM \`2d_rekognisi_lulusan\` d
            JOIN \`2d_ref_sumber_rekognisi\` s ON d.id_ref_sumber = s.id_ref_sumber
            JOIN tahun_akademik t ON d.id_tahun = t.id_tahun
            WHERE d.id_prodi = ? AND d.deleted_at IS NOT NULL
        `;
        const [rows] = await db.execute(sql, [id_prodi]);
        return rows;
    },

    softDelete: async (id, deleted_by) => {
        return await db.execute("UPDATE `2d_rekognisi_lulusan` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_2d = ?", [deleted_by, id]);
    },

    restore: async (id) => {
        return await db.execute("UPDATE `2d_rekognisi_lulusan` SET deleted_at = NULL, deleted_by = NULL WHERE id_2d = ?", [id]);
    },

    hardDelete: async (id) => {
        return await db.execute("DELETE FROM `2d_rekognisi_lulusan` WHERE id_2d = ?", [id]);
    },

    // Master list untuk dropdown di frontend
    getRefSources: async () => {
        const [rows] = await db.execute("SELECT * FROM `2d_ref_sumber_rekognisi` ORDER BY is_default DESC, nama_sumber ASC");
        return rows;
    }
};

module.exports = Model2d;