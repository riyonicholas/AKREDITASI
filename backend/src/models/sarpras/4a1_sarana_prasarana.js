const db = require('../../config/db');

/**
 * Model Tabel 4.A.1 Sarana dan Prasarana PkM
 */
const Model4a1 = {
    findAll: async (id_prodi) => {
        const sql = `SELECT * FROM \`4a1_sarana_prasarana_pkm\` 
                     WHERE id_prodi = ? AND deleted_at IS NULL ORDER BY created_at DESC`;
        const [rows] = await db.execute(sql, [id_prodi]);
        return rows;
    },

    findTrash: async (id_prodi) => {
        const sql = `SELECT * FROM \`4a1_sarana_prasarana_pkm\` 
                     WHERE id_prodi = ? AND deleted_at IS NOT NULL ORDER BY deleted_at DESC`;
        const [rows] = await db.execute(sql, [id_prodi]);
        return rows;
    },

    create: async (data) => {
        const sql = `INSERT INTO \`4a1_sarana_prasarana_pkm\` 
            (id_prodi, nama_prasarana, daya_tampung, luas_ruang, status_milik, status_lisensi, perangkat, info_tambahan, link_bukti, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return await db.execute(sql, [
            data.id_prodi, data.nama_prasarana, data.daya_tampung, data.luas_ruang, 
            data.status_milik, data.status_lisensi, data.perangkat, data.info_tambahan, data.link_bukti, data.created_by
        ]);
    },

    update: async (id, data) => {
        const sql = `UPDATE \`4a1_sarana_prasarana_pkm\` 
            SET nama_prasarana = ?, daya_tampung = ?, luas_ruang = ?, status_milik = ?, 
                status_lisensi = ?, perangkat = ?, info_tambahan = ?, link_bukti = ?, updated_by = ? 
            WHERE id_4a1 = ?`;
        return await db.execute(sql, [
            data.nama_prasarana, data.daya_tampung, data.luas_ruang, data.status_milik, 
            data.status_lisensi, data.perangkat, data.info_tambahan, data.link_bukti, data.updated_by, id
        ]);
    },

    softDelete: async (id, deleted_by) => {
        return await db.execute("UPDATE `4a1_sarana_prasarana_pkm` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_4a1 = ?", [deleted_by, id]);
    },

    restore: async (id) => {
        return await db.execute("UPDATE `4a1_sarana_prasarana_pkm` SET deleted_at = NULL, deleted_by = NULL WHERE id_4a1 = ?", [id]);
    },

    hardDelete: async (id) => {
        return await db.execute("DELETE FROM `4a1_sarana_prasarana_pkm` WHERE id_4a1 = ?", [id]);
    }
};

module.exports = Model4a1;