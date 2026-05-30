const db = require('../../config/db');

const ModelRoadmap = {
    findAllRange: async (id_prodi, targetTS) => {
        const sql = `
            SELECT r.* 
            FROM \`roadmap_lppm\` r
            WHERE r.deleted_at IS NULL 
            AND r.id_prodi = ? 
            AND r.id_tahun <= ? 
            AND r.id_tahun >= (? - 2)
            ORDER BY r.id_tahun DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, targetTS, targetTS]);
        return rows;
    },

    findTrash: async (id_prodi, targetTS) => {
        const sql = `
            SELECT r.* 
            FROM \`roadmap_lppm\` r
            WHERE r.deleted_at IS NOT NULL 
            AND r.id_prodi = ? 
            AND r.id_tahun <= ? 
            AND r.id_tahun >= (? - 2)
            ORDER BY r.deleted_at DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, targetTS, targetTS]);
        return rows;
    },

    create: async (data, userId) => {
        const sql = `
            INSERT INTO \`roadmap_lppm\`
            (id_prodi, id_tahun, jenis_roadmap, link_dokumen, created_by)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            data.id_prodi, data.id_tahun, data.jenis_roadmap, data.link_dokumen, userId
        ]);
        return result;
    },

    update: async (id, data, userId) => {
        const sql = `
            UPDATE \`roadmap_lppm\`
            SET jenis_roadmap = ?, link_dokumen = ?, updated_by = ?
            WHERE id_roadmap = ?
        `;
        const [result] = await db.execute(sql, [
            data.jenis_roadmap, data.link_dokumen, userId, id
        ]);
        return result;
    },

    softDelete: async (id, userId) => {
        const sql = `UPDATE \`roadmap_lppm\` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_roadmap = ?`;
        const [result] = await db.execute(sql, [userId, id]);
        return result;
    },

    restore: async (id) => {
        const sql = `UPDATE \`roadmap_lppm\` SET deleted_at = NULL, deleted_by = NULL WHERE id_roadmap = ?`;
        const [result] = await db.execute(sql, [id]);
        return result;
    },

    hardDelete: async (id) => {
        const sql = `DELETE FROM \`roadmap_lppm\` WHERE id_roadmap = ?`;
        const [result] = await db.execute(sql, [id]);
        return result;
    },

    getItems: async (id_roadmap) => {
        // Ambil penelitian yang terhubung dengan roadmap ini
        const sqlPenelitian = `
            SELECT p.id_3a2, p.judul_penelitian, peg.nama_lengkap as nama_dosen, p.id_roadmap 
            FROM \`3a2_penelitian_dtpr\` p
            JOIN dosen d ON p.id_dosen = d.id_dosen
            JOIN pegawai peg ON d.id_pegawai = peg.id_pegawai
            WHERE p.deleted_at IS NULL AND p.id_roadmap = ?
            ORDER BY peg.nama_lengkap ASC
        `;
        const [penelitian] = await db.execute(sqlPenelitian, [id_roadmap]);

        // Ambil PkM yang terhubung dengan roadmap ini
        const sqlPkm = `
            SELECT p.id_4a2, p.judul_pkm, peg.nama_lengkap as nama_dosen, p.id_roadmap 
            FROM \`4a2_pkm_dtpr\` p
            JOIN dosen d ON p.id_dosen = d.id_dosen
            JOIN pegawai peg ON d.id_pegawai = peg.id_pegawai
            WHERE p.deleted_at IS NULL AND p.id_roadmap = ?
            ORDER BY peg.nama_lengkap ASC
        `;
        const [pkm] = await db.execute(sqlPkm, [id_roadmap]);

        return { penelitian, pkm };
    }
};

module.exports = ModelRoadmap;
