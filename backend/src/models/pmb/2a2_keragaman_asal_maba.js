const db = require('../../config/db');

const Model2a2 = {
    // 1. Validasi Silang ke Tabel 2.A.1
    // Memastikan angka yang diinput di 2.A.2 sama dengan data yang sudah disahkan di 2.A.1
    getValidation2a1: async (id_prodi, id_tahun) => {
        const query = `
            SELECT 
                (maba_reg_diterima + maba_rpl_diterima) as target_diterima,
                (maba_reg_afirmasi + maba_rpl_afirmasi) as target_afirmasi,
                (maba_reg_khusus + maba_rpl_khusus) as target_khusus
            FROM 2a1_data_mahasiswa 
            WHERE prodi_id_prodi = ? AND tahun_akademik_id_tahun = ? AND pmb_deleted_at IS NULL
        `;
        const [rows] = await db.execute(query, [id_prodi, id_tahun]);
        return rows[0] || null;
    },

    // 2. Ambil Data Laporan (TS, TS-1, TS-2)
    // Query ini otomatis menarik data 3 tahun ke belakang berdasarkan filter tahun yang dipilih
    getLaporan: async (id_prodi, id_tahun_ts) => {
        const query = `
            SELECT t1.*, t2.tahun 
            FROM 2a2_keragaman_asal_maba t1
            JOIN tahun_akademik t2 ON t1.tahun_akademik_id_tahun = t2.id_tahun
            WHERE t1.prodi_id_prodi = ? AND t1.pmb_deleted_at IS NULL
            AND t2.tahun <= (SELECT tahun FROM tahun_akademik WHERE id_tahun = ?)
            ORDER BY t2.tahun DESC LIMIT 3
        `;
        return db.execute(query, [id_prodi, id_tahun_ts]);
    },

    // 3. Upsert Data (Insert/Update)
    // Menangani 21 parameter: ID Prodi, ID Tahun, 6 Jml, 6 Ket, 6 Link, dan User ID
    upsert: async (d) => {
        const query = `
            INSERT INTO 2a2_keragaman_asal_maba (
                prodi_id_prodi, tahun_akademik_id_tahun, 
                jml_lokal, ket_lokal, link_lokal,
                jml_regional, ket_regional, link_regional,
                jml_nasional, ket_nasional, link_nasional,
                jml_internasional, ket_internasional, link_internasional,
                jml_afirmasi, ket_afirmasi, link_afirmasi,
                jml_khusus, ket_khusus, link_khusus,
                created_by
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE 
                jml_lokal=VALUES(jml_lokal), ket_lokal=VALUES(ket_lokal), link_lokal=VALUES(link_lokal),
                jml_regional=VALUES(jml_regional), ket_regional=VALUES(ket_regional), link_regional=VALUES(link_regional),
                jml_nasional=VALUES(jml_nasional), ket_nasional=VALUES(ket_nasional), link_nasional=VALUES(link_nasional),
                jml_internasional=VALUES(jml_internasional), ket_internasional=VALUES(ket_internasional), link_internasional=VALUES(link_internasional),
                jml_afirmasi=VALUES(jml_afirmasi), ket_afirmasi=VALUES(ket_afirmasi), link_afirmasi=VALUES(link_afirmasi),
                jml_khusus=VALUES(jml_khusus), ket_khusus=VALUES(ket_khusus), link_khusus=VALUES(link_khusus),
                updated_by=VALUES(created_by),
                pmb_deleted_at=NULL
        `;
        return db.execute(query, d);
    },

    // 4. Manajemen Data (Trash & Delete)
    getTrash: async (id_prodi) => {
        const query = `
            SELECT t1.*, t2.tahun 
            FROM 2a2_keragaman_asal_maba t1 
            JOIN tahun_akademik t2 ON t1.tahun_akademik_id_tahun = t2.id_tahun 
            WHERE t1.prodi_id_prodi = ? AND t1.pmb_deleted_at IS NOT NULL
        `;
        return db.execute(query, [id_prodi]);
    },

    softDelete: async (id_2a2, user_id) => {
        return db.execute(
            `UPDATE 2a2_keragaman_asal_maba SET pmb_deleted_at = NOW(), pmb_deleted_by = ? WHERE id_2a2 = ?`,
            [user_id, id_2a2]
        );
    },

    restore: async (id_2a2) => {
        return db.execute(
            `UPDATE 2a2_keragaman_asal_maba SET pmb_deleted_at = NULL, pmb_deleted_by = NULL WHERE id_2a2 = ?`,
            [id_2a2]
        );
    },

    hardDelete: async (id_2a2) => {
        return db.execute(`DELETE FROM 2a2_keragaman_asal_maba WHERE id_2a2 = ?`, [id_2a2]);
    }
};

module.exports = Model2a2;