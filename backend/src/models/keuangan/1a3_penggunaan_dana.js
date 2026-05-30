const db = require('../../config/db');

/**
 * Model Tabel 1.A.3 Penggunaan Dana UPPS/PS
 */
const Model1a3 = {
    // 1. Ambil data aktif (Filter Prodi & Range 3 Tahun)
    findAllRange: async (id_prodi, id_tahun) => {
        const sql = `
            SELECT s.*, t.tahun AS nama_tahun
            FROM \`1a3_penggunaan_dana_upps\` s
            JOIN tahun_akademik t ON s.id_tahun = t.id_tahun
            WHERE s.id_prodi = ? 
            AND s.id_tahun BETWEEN (? - 2) AND ? 
            AND s.deleted_at IS NULL
            ORDER BY s.nama_penggunaan ASC, s.id_tahun DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows;
    },

    // 2. Ambil data di tempat sampah
    findTrash: async (id_prodi, id_tahun) => {
        const sql = `
            SELECT s.*, t.tahun AS nama_tahun
            FROM \`1a3_penggunaan_dana_upps\` s
            JOIN tahun_akademik t ON s.id_tahun = t.id_tahun
            WHERE s.id_prodi = ? 
            AND s.id_tahun BETWEEN (? - 2) AND ? 
            AND s.deleted_at IS NOT NULL
        `;
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows;
    },

    create: async (data) => {
        const sql = `INSERT INTO \`1a3_penggunaan_dana_upps\` 
            (id_prodi, nama_penggunaan, jumlah_dana, link_bukti, id_tahun, created_by) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        return await db.execute(sql, [
            data.id_prodi, data.nama_penggunaan, data.jumlah_dana, data.link_bukti, data.id_tahun, data.created_by
        ]);
    },

    update: async (id, data) => {
        const sql = `UPDATE \`1a3_penggunaan_dana_upps\` 
            SET nama_penggunaan = ?, jumlah_dana = ?, link_bukti = ?, updated_by = ? 
            WHERE id_penggunaan = ?`;
        return await db.execute(sql, [
            data.nama_penggunaan, data.jumlah_dana, data.link_bukti, data.updated_by, id
        ]);
    },

    softDelete: async (id, deleted_by) => {
        const sql = "UPDATE `1a3_penggunaan_dana_upps` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_penggunaan = ?";
        return await db.execute(sql, [deleted_by, id]);
    },

    restore: async (id) => {
        const sql = "UPDATE `1a3_penggunaan_dana_upps` SET deleted_at = NULL, deleted_by = NULL WHERE id_penggunaan = ?";
        return await db.execute(sql, [id]);
    },

    hardDelete: async (id) => {
        const sql = "DELETE FROM `1a3_penggunaan_dana_upps` WHERE id_penggunaan = ?";
        return await db.execute(sql, [id]);
    }
};

module.exports = Model1a3;