const db = require('../../config/db');

/**
 * Model Tabel 1.B Unit SPMI dan SDM
 * Dikelola oleh TPM
 * Update: Menambahkan kolom jenis_unit (VARCHAR) sesuai request Rhegysa
 */
const Model1b = {
    findAll: async (id_tahun) => {
        const sql = `
            SELECT 
                s.*, 
                (s.auditor_certified + s.auditor_non_certified) AS jumlah_auditor,
                COALESCE(t.tahun, CONCAT('Tahun ID: ', s.id_tahun)) AS nama_tahun
            FROM \`1b_unit_spmi_dan_sdm\` s
            LEFT JOIN tahun_akademik t ON s.id_tahun = t.id_tahun
            WHERE s.id_tahun = ? AND s.deleted_at IS NULL
        `;
        const [rows] = await db.execute(sql, [id_tahun]);
        return rows;
    },

    findTrash: async (id_tahun) => {
        const sql = `
            SELECT 
                s.*,
                (s.auditor_certified + s.auditor_non_certified) AS jumlah_auditor
            FROM \`1b_unit_spmi_dan_sdm\` s
            WHERE s.id_tahun = ? AND s.deleted_at IS NOT NULL
        `;
        const [rows] = await db.execute(sql, [id_tahun]);
        return rows;
    },

    create: async (data) => {
        const sql = `
            INSERT INTO \`1b_unit_spmi_dan_sdm\` 
            (nama_unit_spmi, dokumen_spmi, auditor_certified, auditor_non_certified, 
             frekuensi_audit, bukti_certified_auditor, laporan_audit, 
             unit_spmi, id_tahun, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return await db.execute(sql, [
            data.nama_unit_spmi, 
            data.dokumen_spmi, data.auditor_certified, data.auditor_non_certified,
            data.frekuensi_audit, data.bukti_certified_auditor, data.laporan_audit,
            data.unit_spmi, data.id_tahun, data.created_by
        ]);
    },

    update: async (id, data) => {
        const sql = `
            UPDATE \`1b_unit_spmi_dan_sdm\` 
            SET nama_unit_spmi = ?, dokumen_spmi = ?, auditor_certified = ?, 
                auditor_non_certified = ?, frekuensi_audit = ?, 
                bukti_certified_auditor = ?, laporan_audit = ?, 
                unit_spmi = ?, updated_by = ?
            WHERE id_unit_spmi = ?
        `;
        return await db.execute(sql, [
            data.nama_unit_spmi, data.dokumen_spmi, data.auditor_certified, data.auditor_non_certified,
            data.frekuensi_audit, data.bukti_certified_auditor, data.laporan_audit,
            data.unit_spmi, data.updated_by, id
        ]);
    },

    softDelete: async (id, deleted_by) => {
        const sql = "UPDATE `1b_unit_spmi_dan_sdm` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_unit_spmi = ?";
        return await db.execute(sql, [deleted_by, id]);
    },

    restore: async (id) => {
        const sql = "UPDATE `1b_unit_spmi_dan_sdm` SET deleted_at = NULL, deleted_by = NULL WHERE id_unit_spmi = ?";
        return await db.execute(sql, [id]);
    },

    hardDelete: async (id) => {
        const sql = "DELETE FROM `1b_unit_spmi_dan_sdm` WHERE id_unit_spmi = ?";
        return await db.execute(sql, [id]);
    }
};

module.exports = Model1b;