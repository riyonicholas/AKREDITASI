const db = require('../../config/db');

const Model2b5 = {
    // FIX: Pastikan m.id_tahun dipanggil agar bisa dibaca oleh logic Excel
    findAllRange: async (id_prodi, id_tahun) => {
        const sql = `
            SELECT 
                k.*, 
                m.id_tahun, -- <--- KOLOM INI WAJIB ADA UNTUK FILTER EXCEL
                t.tahun AS nama_tahun, 
                m.jumlah_lulusan, 
                m.jumlah_terlacak 
            FROM \`2b5_kesesuaian_kerja\` k
            JOIN \`2b4_masa_tunggu\` m ON k.id_2b4 = m.id_2b4
            JOIN tahun_akademik t ON m.id_tahun = t.id_tahun
            WHERE m.id_prodi = ? 
            AND m.id_tahun BETWEEN (? - 2) AND ? 
            AND k.deleted_at IS NULL
            ORDER BY m.id_tahun DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows;
    },
    // ... (fungsi lainnya tetap sama)
    findTrash: async (id_prodi) => {
        const sql = `SELECT k.*, m.id_tahun, t.tahun AS nama_tahun FROM \`2b5_kesesuaian_kerja\` k
                     JOIN \`2b4_masa_tunggu\` m ON k.id_2b4 = m.id_2b4
                     JOIN tahun_akademik t ON m.id_tahun = t.id_tahun
                     WHERE m.id_prodi = ? AND k.deleted_at IS NOT NULL`;
        const [rows] = await db.execute(sql, [id_prodi]);
        return rows;
    },
    create: async (data) => {
        return await db.execute(`INSERT INTO \`2b5_kesesuaian_kerja\` (id_2b4, profesi_infokom, profesi_non_infokom, lingkup_multinasional, lingkup_nasional, lingkup_wirausaha, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.id_2b4, data.profesi_infokom, data.profesi_non_infokom, data.lingkup_multinasional, data.lingkup_nasional, data.lingkup_wirausaha, data.created_by]);
    },
    update: async (id, data) => {
        return await db.execute(`UPDATE \`2b5_kesesuaian_kerja\` SET profesi_infokom = ?, profesi_non_infokom = ?, lingkup_multinasional = ?, lingkup_nasional = ?, lingkup_wirausaha = ?, updated_by = ? WHERE id_2b5 = ?`,
        [data.profesi_infokom, data.profesi_non_infokom, data.lingkup_multinasional, data.lingkup_nasional, data.lingkup_wirausaha, data.updated_by, id]);
    },
    softDelete: async (id, deleted_by) => {
        return await db.execute("UPDATE `2b5_kesesuaian_kerja` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_2b5 = ?", [deleted_by, id]);
    },
    restore: async (id) => {
        return await db.execute("UPDATE `2b5_kesesuaian_kerja` SET deleted_at = NULL, deleted_by = NULL WHERE id_2b5 = ?", [id]);
    },
    hardDelete: async (id) => {
        return await db.execute("DELETE FROM `2b5_kesesuaian_kerja` WHERE id_2b5 = ?", [id]);
    }
};

module.exports = Model2b5;