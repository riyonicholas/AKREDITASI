const db = require('../../config/db');

/**
 * Model Tabel 3.A.1 Sarana dan Prasarana Penelitian
 * Mengelola data inventaris laboratorium per Prodi secara Live
 */
const Model3a1 = {
    // 1. Ambil data aktif berdasarkan Prodi
    findAll: async (id_prodi) => {
        const sql = `
            SELECT * FROM \`3a1_sarana_prasarana_penelitian\` 
            WHERE id_prodi = ? AND deleted_at IS NULL
            ORDER BY created_at DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi]);
        return rows;
    },

    // 2. Ambil data di tempat sampah
    findTrash: async (id_prodi) => {
        const sql = `
            SELECT * FROM \`3a1_sarana_prasarana_penelitian\` 
            WHERE id_prodi = ? AND deleted_at IS NOT NULL
            ORDER BY deleted_at DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi]);
        return rows;
    },

    // 3. Tambah Data Baru
    create: async (data) => {
        const sql = `INSERT INTO \`3a1_sarana_prasarana_penelitian\` 
            (id_prodi, nama_prasarana, daya_tampung, luas_ruang, status_milik, 
             status_lisensi, perangkat, info_tambahan, link_bukti, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return await db.execute(sql, [
            data.id_prodi, data.nama_prasarana, data.daya_tampung, data.luas_ruang, 
            data.status_milik, data.status_lisensi, data.perangkat, 
            data.info_tambahan, data.link_bukti, data.created_by
        ]);
    },

    // 4. Update Data
    update: async (id, data) => {
        const sql = `UPDATE \`3a1_sarana_prasarana_penelitian\` 
            SET nama_prasarana = ?, daya_tampung = ?, luas_ruang = ?, 
                status_milik = ?, status_lisensi = ?, perangkat = ?, 
                info_tambahan = ?, link_bukti = ?, updated_by = ? 
            WHERE id_3a1 = ?`;
        return await db.execute(sql, [
            data.nama_prasarana, data.daya_tampung, data.luas_ruang, 
            data.status_milik, data.status_lisensi, data.perangkat, 
            data.info_tambahan, data.link_bukti, data.updated_by, id
        ]);
    },

    // 5. Soft Delete
    softDelete: async (id, deleted_by) => {
        const sql = "UPDATE `3a1_sarana_prasarana_penelitian` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_3a1 = ?";
        return await db.execute(sql, [deleted_by, id]);
    },

    // 6. Restore
    restore: async (id) => {
        const sql = "UPDATE `3a1_sarana_prasarana_penelitian` SET deleted_at = NULL, deleted_by = NULL WHERE id_3a1 = ?";
        return await db.execute(sql, [id]);
    },

    // 7. Hard Delete
    hardDelete: async (id) => {
        const sql = "DELETE FROM `3a1_sarana_prasarana_penelitian` WHERE id_3a1 = ?";
        return await db.execute(sql, [id]);
    }
};

module.exports = Model3a1;