const db = require('../../config/db');

/**
 * Model Tabel 1.B Unit SPMI dan SDM
 * Dikelola oleh TPM
 * Update: Menambahkan kolom jenis_unit (VARCHAR) sesuai request Rhegysa
 */
const Model1b = {
    // 1. Ambil data aktif
    findAll: async (id_tahun) => {
        const sql = `
            SELECT 
                s.*, 
                COALESCE(u.nama_unit, CONCAT('Unit ID: ', s.unit_kerja_id_unit)) AS nama_unit, 
                COALESCE(t.tahun, CONCAT('Tahun ID: ', s.tahun_akademik_id_tahun)) AS nama_tahun
            FROM \`1b_unit_spmi_dan_sdm\` s
            LEFT JOIN unit_kerja u ON s.unit_kerja_id_unit = u.id_unit
            LEFT JOIN tahun_akademik t ON s.tahun_akademik_id_tahun = t.id_tahun
            WHERE s.tahun_akademik_id_tahun = ? AND s.deleted_at IS NULL
        `;
        const [rows] = await db.execute(sql, [id_tahun]);
        return rows;
    },

    // 2. Ambil data sampah
    findTrash: async (id_tahun) => {
        const sql = `
            SELECT 
                s.*, 
                COALESCE(u.nama_unit, CONCAT('Unit ID: ', s.unit_kerja_id_unit)) AS nama_unit
            FROM \`1b_unit_spmi_dan_sdm\` s
            LEFT JOIN unit_kerja u ON s.unit_kerja_id_unit = u.id_unit
            WHERE s.tahun_akademik_id_tahun = ? AND s.deleted_at IS NOT NULL
        `;
        const [rows] = await db.execute(sql, [id_tahun]);
        return rows;
    },

    create: async (data) => {
        const totalAuditor = (parseInt(data.auditor_certified) || 0) + (parseInt(data.auditor_non_certified) || 0);
        const sql = `
            INSERT INTO \`1b_unit_spmi_dan_sdm\` 
            (jenis_unit, dokumen_spmi, jumlah_auditor, auditor_certified, auditor_non_certified, 
             frekuensi_audit, bukti_certified_auditor, laporan_audit, 
             unit_kerja_id_unit, tahun_akademik_id_tahun, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return await db.execute(sql, [
            data.jenis_unit, 
            data.dokumen_spmi, totalAuditor, data.auditor_certified, data.auditor_non_certified,
            data.frekuensi_audit, data.bukti_certified_auditor, data.laporan_audit,
            data.id_unit, data.id_tahun, data.created_by
        ]);
    },

    update: async (id, data) => {
        const totalAuditor = (parseInt(data.auditor_certified) || 0) + (parseInt(data.auditor_non_certified) || 0);
        const sql = `
            UPDATE \`1b_unit_spmi_dan_sdm\` 
            SET jenis_unit = ?, dokumen_spmi = ?, jumlah_auditor = ?, auditor_certified = ?, 
                auditor_non_certified = ?, frekuensi_audit = ?, 
                bukti_certified_auditor = ?, laporan_audit = ?, 
                unit_kerja_id_unit = ?, updated_by = ?
            WHERE id_unit_spmi = ?
        `;
        return await db.execute(sql, [
            data.jenis_unit, data.dokumen_spmi, totalAuditor, data.auditor_certified, data.auditor_non_certified,
            data.frekuensi_audit, data.bukti_certified_auditor, data.laporan_audit,
            data.id_unit, data.updated_by, id
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