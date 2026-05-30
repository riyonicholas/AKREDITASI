const db = require('../../config/db');

/**
 * Model Tabel 1.A.2 Sumber Pendanaan UPPS/PS
 * Mendukung filter Prodi, 3 Tahun Akademik, dan Sistem Sampah
 */
const Model1a2 = {
    // 1. Ambil data aktif (Filter Prodi & Range 3 Tahun)
    findAllRange: async (id_prodi, id_tahun) => {
        const sql = `
            SELECT s.*, t.tahun AS nama_tahun
            FROM \`1a2_sumber_pendanaan_upps\` s
            JOIN tahun_akademik t ON s.id_tahun = t.id_tahun
            WHERE s.id_prodi = ? 
            AND s.id_tahun BETWEEN (? - 2) AND ? 
            AND s.deleted_at IS NULL
            ORDER BY s.nama_sumber ASC, s.id_tahun DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows;
    },

    // 2. Ambil data di tempat sampah
    findTrash: async (id_prodi, id_tahun) => {
        const sql = `
            SELECT s.*, t.tahun AS nama_tahun
            FROM \`1a2_sumber_pendanaan_upps\` s
            JOIN tahun_akademik t ON s.id_tahun = t.id_tahun
            WHERE s.id_prodi = ? 
            AND s.id_tahun BETWEEN (? - 2) AND ? 
            AND s.deleted_at IS NOT NULL
            ORDER BY s.deleted_at DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows;
    },

    // 3. Tambah Data
    create: async (data) => {
        const sql = `INSERT INTO \`1a2_sumber_pendanaan_upps\` 
            (id_prodi, nama_sumber, jumlah_dana, link_bukti, id_tahun, created_by) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        return await db.execute(sql, [
            data.id_prodi, data.nama_sumber, data.jumlah_dana, data.link_bukti, data.id_tahun, data.created_by
        ]);
    },

    // 4. Update Data
    update: async (id, data) => {
        const sql = `UPDATE \`1a2_sumber_pendanaan_upps\` 
            SET nama_sumber = ?, jumlah_dana = ?, link_bukti = ?, updated_by = ? 
            WHERE id_sumber = ?`;
        return await db.execute(sql, [
            data.nama_sumber, data.jumlah_dana, data.link_bukti, data.updated_by, id
        ]);
    },

    // 5. Soft Delete (Pindah ke Sampah)
    softDelete: async (id, deleted_by) => {
        const sql = "UPDATE `1a2_sumber_pendanaan_upps` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_sumber = ?";
        return await db.execute(sql, [deleted_by, id]);
    },

    // 6. Restore (Pulihkan dari Sampah)
    restore: async (id) => {
        const sql = "UPDATE `1a2_sumber_pendanaan_upps` SET deleted_at = NULL, deleted_by = NULL WHERE id_sumber = ?";
        return await db.execute(sql, [id]);
    },

    // 7. Hard Delete (Hapus Permanen)
    hardDelete: async (id) => {
        const sql = "DELETE FROM `1a2_sumber_pendanaan_upps` WHERE id_sumber = ?";
        return await db.execute(sql, [id]);
    }
};

module.exports = Model1a2;