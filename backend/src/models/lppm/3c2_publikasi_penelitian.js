const db = require('../../config/db');

const ModelPenelitianPublikasi = {
    findAllRange: async (id_prodi, targetTS) => {
        const sql = `
            SELECT k.*, p.judul_penelitian, d.nama_dosen, d.nidn 
            FROM \`3c2_publikasi_penelitian\` k
            JOIN \`3a2_penelitian_dtpr\` p ON k.id_3a2 = p.id_3a2
            JOIN dosen d ON p.id_dosen = d.id_dosen
            WHERE k.deleted_at IS NULL 
            AND d.id_prodi = ? 
            AND k.id_tahun <= ? 
            AND k.id_tahun >= (? - 2)
            ORDER BY k.id_tahun DESC, d.nama_dosen ASC
        `;
        const [rows] = await db.execute(sql, [id_prodi, targetTS, targetTS]);
        return rows;
    },

    findTrash: async (id_prodi, targetTS) => {
        const sql = `
            SELECT k.*, p.judul_penelitian, d.nama_dosen, d.nidn 
            FROM \`3c2_publikasi_penelitian\` k
            JOIN \`3a2_penelitian_dtpr\` p ON k.id_3a2 = p.id_3a2
            JOIN dosen d ON p.id_dosen = d.id_dosen
            WHERE k.deleted_at IS NOT NULL 
            AND d.id_prodi = ? 
            AND k.id_tahun <= ? 
            AND k.id_tahun >= (? - 2)
            ORDER BY k.deleted_at DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, targetTS, targetTS]);
        return rows;
    },



    update: async (id, data, userId) => {
        const sql = `
            UPDATE \`3c2_publikasi_penelitian\`
            SET judul_publikasi = ?, jenis_publikasi = ?, link_bukti = ?, updated_by = ?
            WHERE id_3c2 = ?
        `;
        const [result] = await db.execute(sql, [
            data.judul_publikasi, data.jenis_publikasi || null, data.link_bukti || null, userId, id
        ]);
        return result;
    },

    softDelete: async (id, userId) => {
        const sql = `UPDATE \`3c2_publikasi_penelitian\` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_3c2 = ?`;
        const [result] = await db.execute(sql, [userId, id]);
        return result;
    },

    restore: async (id) => {
        const sql = `UPDATE \`3c2_publikasi_penelitian\` SET deleted_at = NULL, deleted_by = NULL WHERE id_3c2 = ?`;
        const [result] = await db.execute(sql, [id]);
        return result;
    },

    hardDelete: async (id) => {
        const sql = `DELETE FROM \`3c2_publikasi_penelitian\` WHERE id_3c2 = ?`;
        const [result] = await db.execute(sql, [id]);
        return result;
    }
};

module.exports = ModelPenelitianPublikasi;
