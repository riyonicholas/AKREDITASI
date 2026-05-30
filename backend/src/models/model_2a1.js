const db = require('../config/db');

const Model2a1 = {
    // --- QUERY UNTUK PMB ---
    getForPMB: async (id_prodi) => {
        const query = `
            SELECT 
                t1.id_2a1, t1.prodi_id_prodi, t1.tahun_akademik_id_tahun,
                t1.daya_tampung, t1.pendaftar, t1.pendaftar_afirmasi, t1.pendaftar_khusus,
                t1.maba_reg_diterima, t1.maba_reg_afirmasi, t1.maba_reg_khusus,
                t1.maba_rpl_diterima, t1.maba_rpl_afirmasi, t1.maba_rpl_khusus,
                -- Logic: Jika ALA menghapus data ini, tampilkan 0 bagi PMB
                IF(t1.ala_deleted_at IS NULL, t1.aktif_reg_diterima, 0) AS aktif_reg_diterima,
                IF(t1.ala_deleted_at IS NULL, t1.aktif_reg_afirmasi, 0) AS aktif_reg_afirmasi,
                IF(t1.ala_deleted_at IS NULL, t1.aktif_reg_khusus, 0) AS aktif_reg_khusus,
                IF(t1.ala_deleted_at IS NULL, t1.aktif_rpl_diterima, 0) AS aktif_rpl_diterima,
                IF(t1.ala_deleted_at IS NULL, t1.aktif_rpl_afirmasi, 0) AS aktif_rpl_afirmasi,
                IF(t1.ala_deleted_at IS NULL, t1.aktif_rpl_khusus, 0) AS aktif_rpl_khusus,
                t1.pmb_deleted_at, t1.ala_deleted_at,
                t2.tahun
            FROM 2a1_data_mahasiswa t1
            JOIN tahun_akademik t2 ON t1.tahun_akademik_id_tahun = t2.id_tahun
            WHERE t1.prodi_id_prodi = ? AND t1.pmb_deleted_at IS NULL
            ORDER BY t2.tahun DESC
        `;
        return db.execute(query, [id_prodi]);
    },

    // --- QUERY DASHBOARD ALA ---
    getForALA: async (id_prodi) => {
        const query = `
            SELECT 
                t1.id_2a1, t1.prodi_id_prodi, t1.tahun_akademik_id_tahun,
                -- Logic: Jika PMB menghapus data ini, tampilkan 0 bagi ALA
                IF(t1.pmb_deleted_at IS NULL, t1.daya_tampung, 0) AS daya_tampung,
                IF(t1.pmb_deleted_at IS NULL, t1.pendaftar, 0) AS pendaftar,
                IF(t1.pmb_deleted_at IS NULL, t1.pendaftar_afirmasi, 0) AS pendaftar_afirmasi,
                IF(t1.pmb_deleted_at IS NULL, t1.pendaftar_khusus, 0) AS pendaftar_khusus,
                IF(t1.pmb_deleted_at IS NULL, t1.maba_reg_diterima, 0) AS maba_reg_diterima,
                IF(t1.pmb_deleted_at IS NULL, t1.maba_reg_afirmasi, 0) AS maba_reg_afirmasi,
                IF(t1.pmb_deleted_at IS NULL, t1.maba_reg_khusus, 0) AS maba_reg_khusus,
                IF(t1.pmb_deleted_at IS NULL, t1.maba_rpl_diterima, 0) AS maba_rpl_diterima,
                IF(t1.pmb_deleted_at IS NULL, t1.maba_rpl_afirmasi, 0) AS maba_rpl_afirmasi,
                IF(t1.pmb_deleted_at IS NULL, t1.maba_rpl_khusus, 0) AS maba_rpl_khusus,
                t1.aktif_reg_diterima, t1.aktif_reg_afirmasi, t1.aktif_reg_khusus,
                t1.aktif_rpl_diterima, t1.aktif_rpl_afirmasi, t1.aktif_rpl_khusus,
                t1.pmb_deleted_at, t1.ala_deleted_at,
                t2.tahun
            FROM 2a1_data_mahasiswa t1
            JOIN tahun_akademik t2 ON t1.tahun_akademik_id_tahun = t2.id_tahun
            WHERE t1.prodi_id_prodi = ? AND t1.ala_deleted_at IS NULL
            ORDER BY t2.tahun DESC
        `;
        return db.execute(query, [id_prodi]);
    },

    // --- FUNGSI PENGHAPUSAN ---
    getById: async (id_2a1) => {
        const [rows] = await db.execute(`SELECT * FROM 2a1_data_mahasiswa WHERE id_2a1 = ?`, [id_2a1]);
        return rows[0];
    },

    softDeletePMB: async (id_2a1, user_id) => {
        return db.execute(`UPDATE 2a1_data_mahasiswa SET pmb_deleted_at = NOW(), pmb_deleted_by = ? WHERE id_2a1 = ?`, [user_id, id_2a1]);
    },

    softDeleteALA: async (id_2a1, user_id) => {
        return db.execute(`UPDATE 2a1_data_mahasiswa SET ala_deleted_at = NOW(), ala_deleted_by = ? WHERE id_2a1 = ?`, [user_id, id_2a1]);
    },

    restorePMB: async (id_2a1) => {
        return db.execute(`UPDATE 2a1_data_mahasiswa SET pmb_deleted_at = NULL, pmb_deleted_by = NULL WHERE id_2a1 = ?`, [id_2a1]);
    },

    restoreALA: async (id_2a1) => {
        return db.execute(`UPDATE 2a1_data_mahasiswa SET ala_deleted_at = NULL, ala_deleted_by = NULL WHERE id_2a1 = ?`, [id_2a1]);
    },

    deletePhysical: async (id_2a1) => {
        return db.execute(`DELETE FROM 2a1_data_mahasiswa WHERE id_2a1 = ?`, [id_2a1]);
    },

    // --- QUERY TRASH ---
    getTrashPMB: async (id_prodi) => {
        const query = `SELECT t1.*, t2.tahun FROM 2a1_data_mahasiswa t1 JOIN tahun_akademik t2 ON t1.tahun_akademik_id_tahun = t2.id_tahun WHERE t1.prodi_id_prodi = ? AND t1.pmb_deleted_at IS NOT NULL`;
        return db.execute(query, [id_prodi]);
    },

    getTrashALA: async (id_prodi) => {
        const query = `SELECT t1.*, t2.tahun FROM 2a1_data_mahasiswa t1 JOIN tahun_akademik t2 ON t1.tahun_akademik_id_tahun = t2.id_tahun WHERE t1.prodi_id_prodi = ? AND t1.ala_deleted_at IS NOT NULL`;
        return db.execute(query, [id_prodi]);
    },

    // --- UPSERT LOGIC ---
    upsertPMB: async (data) => {
        const query = `
            INSERT INTO 2a1_data_mahasiswa 
            (prodi_id_prodi, tahun_akademik_id_tahun, daya_tampung, pendaftar, pendaftar_afirmasi, pendaftar_khusus, 
             maba_reg_diterima, maba_reg_afirmasi, maba_reg_khusus, maba_rpl_diterima, maba_rpl_afirmasi, maba_rpl_khusus, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            daya_tampung = VALUES(daya_tampung), 
            pendaftar = VALUES(pendaftar),
            pendaftar_afirmasi = VALUES(pendaftar_afirmasi),
            pendaftar_khusus = VALUES(pendaftar_khusus),
            maba_reg_diterima = VALUES(maba_reg_diterima),
            maba_reg_afirmasi = VALUES(maba_reg_afirmasi),
            maba_reg_khusus = VALUES(maba_reg_khusus),
            maba_rpl_diterima = VALUES(maba_rpl_diterima),
            maba_rpl_afirmasi = VALUES(maba_rpl_afirmasi),
            maba_rpl_khusus = VALUES(maba_rpl_khusus),
            updated_by = VALUES(created_by),
            pmb_deleted_at = NULL
        `;
        return db.execute(query, data); // Tidak perlu Object.values jika data sudah Array
    },

    upsertALA: async (data) => {
        const query = `
            INSERT INTO 2a1_data_mahasiswa 
            (prodi_id_prodi, tahun_akademik_id_tahun, aktif_reg_diterima, aktif_reg_afirmasi, aktif_reg_khusus, 
             aktif_rpl_diterima, aktif_rpl_afirmasi, aktif_rpl_khusus, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            aktif_reg_diterima = VALUES(aktif_reg_diterima),
            aktif_reg_afirmasi = VALUES(aktif_reg_afirmasi),
            aktif_reg_khusus = VALUES(aktif_reg_khusus),
            aktif_rpl_diterima = VALUES(aktif_rpl_diterima),
            aktif_rpl_afirmasi = VALUES(aktif_rpl_afirmasi),
            aktif_rpl_khusus = VALUES(aktif_rpl_khusus),
            updated_by = VALUES(created_by),
            ala_deleted_at = NULL
        `;
        return db.execute(query, data);
    },

    // Fungsi Global untuk Export
    getAllForExport: async (id_prodi) => {
        const query = `
            SELECT t1.*, t2.tahun 
            FROM 2a1_data_mahasiswa t1
            JOIN tahun_akademik t2 ON t1.tahun_akademik_id_tahun = t2.id_tahun
            WHERE t1.prodi_id_prodi = ?
            ORDER BY t2.tahun DESC
        `;
        return db.execute(query, [id_prodi]);
    }
};

module.exports = Model2a1;