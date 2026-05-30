const db = require('../../config/db');

const Model2b4 = {
    findAllRange: async (id_prodi, id_tahun) => {
        const sql = `SELECT m.*, t.tahun AS nama_tahun FROM \`2b4_masa_tunggu\` m 
                     JOIN tahun_akademik t ON m.id_tahun = t.id_tahun 
                     WHERE m.id_prodi = ? AND m.id_tahun BETWEEN (? - 2) AND ? AND m.deleted_at IS NULL 
                     ORDER BY m.id_tahun DESC`;
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows;
    },

    findTrash: async (id_prodi) => {
        const [rows] = await db.execute(`SELECT m.*, t.tahun AS nama_tahun FROM \`2b4_masa_tunggu\` m 
                                         JOIN tahun_akademik t ON m.id_tahun = t.id_tahun 
                                         WHERE m.id_prodi = ? AND m.deleted_at IS NOT NULL`, [id_prodi]);
        return rows;
    },

    create: async (data) => {
        return await db.execute(`INSERT INTO \`2b4_masa_tunggu\` (id_prodi, id_tahun, jumlah_lulusan, jumlah_terlacak, rata_tunggu, created_by) VALUES (?, ?, ?, ?, ?, ?)`, 
        [data.id_prodi, data.id_tahun, data.jumlah_lulusan, data.jumlah_terlacak, data.rata_tunggu, data.created_by]);
    },

    update: async (id, data) => {
        return await db.execute(`UPDATE \`2b4_masa_tunggu\` SET jumlah_lulusan = ?, jumlah_terlacak = ?, rata_tunggu = ?, updated_by = ? WHERE id_2b4 = ?`, 
        [data.jumlah_lulusan, data.jumlah_terlacak, data.rata_tunggu, data.updated_by, id]);
    },

    // Cascading Soft Delete: Hapus 2B4 juga hapus 2B5 yang terkait
    softDelete: async (id, deleted_by) => {
        await db.execute("UPDATE `2b5_kesesuaian_kerja` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_2b4 = ?", [deleted_by, id]);
        return await db.execute("UPDATE `2b4_masa_tunggu` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_2b4 = ?", [deleted_by, id]);
    },

    restore: async (id) => {
        await db.execute("UPDATE `2b5_kesesuaian_kerja` SET deleted_at = NULL, deleted_by = NULL WHERE id_2b4 = ?", [id]);
        return await db.execute("UPDATE `2b4_masa_tunggu` SET deleted_at = NULL, deleted_by = NULL WHERE id_2b4 = ?", [id]);
    },

    hardDelete: async (id) => {
        await db.execute("DELETE FROM `2b5_kesesuaian_kerja` WHERE id_2b4 = ?", [id]);
        return await db.execute("DELETE FROM `2b4_masa_tunggu` WHERE id_2b4 = ?", [id]);
    }
};

module.exports = Model2b4;