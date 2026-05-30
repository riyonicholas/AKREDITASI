const db = require('../../config/db');

/**
 * Model Tabel 2.B.6 Kepuasan Pengguna Lulusan
 * Sinkron dengan perbaikan skema database (created_by, id_prodi, id_tahun)
 */
const Model2b6 = {
    // 1. Ambil data aktif
    findAll: async (id_prodi, id_tahun) => {
        const sql = "SELECT * FROM `2b6_kepuasan_pengguna` WHERE id_prodi = ? AND id_tahun = ? AND deleted_at IS NULL ORDER BY id_2b6 ASC";
        const [rows] = await db.execute(sql, [id_prodi, id_tahun]);
        return rows;
    },

    // 2. Ambil data Metadata
    getMetadata: async (id_prodi, id_tahun) => {
        const sql = "SELECT * FROM `2b6_metadata_lulusan` WHERE id_prodi = ? AND id_tahun = ? LIMIT 1";
        const [rows] = await db.execute(sql, [id_prodi, id_tahun]);
        return rows[0];
    },

    // 3. Auto Alumni (Melirik 2.B.4)
    calculateAutoAlumni: async (id_prodi, id_tahun) => {
        const sql = "SELECT SUM(jumlah_lulusan) as total FROM `2b4_masa_tunggu` WHERE id_prodi = ? AND id_tahun BETWEEN (? - 2) AND ? AND deleted_at IS NULL";
        const [rows] = await db.execute(sql, [id_prodi, id_tahun, id_tahun]);
        return rows[0].total || 0;
    },

    // 4. ENGINE OTOMATIS: Ambil Mahasiswa Aktif (Sinkron ke 2.A.1 Arienta)
    getAutoMhsAktif: async (id_prodi, id_tahun) => {
        try {
            // Rumus: Total Mahasiswa Aktif (Reguler + RPL) sesuai query Arienta
            const sql = `
                SELECT 
                    (aktif_reg_diterima + aktif_reg_afirmasi + aktif_reg_khusus + 
                     aktif_rpl_diterima + aktif_rpl_afirmasi + aktif_rpl_khusus) as total
                FROM \`2a1_data_mahasiswa\` 
                WHERE prodi_id_prodi = ? AND tahun_akademik_id_tahun = ? 
                AND deleted_at IS NULL LIMIT 1
            `;
            const [rows] = await db.execute(sql, [id_prodi, id_tahun]);
            return rows[0] ? rows[0].total : 0;
        } catch (e) {
            console.error("Link 2A1 Error:", e.message);
            return 0; // Return 0 jika tabel belum dibuat/diisi
        }
    },

    // 5. Simpan/Update (UPSERT)
    upsertPenilaian: async (data) => {
        const [exists] = await db.execute(
            "SELECT id_2b6 FROM `2b6_kepuasan_pengguna` WHERE id_prodi = ? AND id_tahun = ? AND jenis_kemampuan = ?",
            [data.id_prodi, data.id_tahun, data.jenis_kemampuan]
        );

        if (exists.length > 0) {
            const sql = "UPDATE `2b6_kepuasan_pengguna` SET sangat_baik = ?, baik = ?, cukup = ?, kurang = ?, rencana_tindak_lanjut = ?, updated_by = ? WHERE id_2b6 = ?";
            return await db.execute(sql, [data.sangat_baik, data.baik, data.cukup, data.kurang, data.rencana_tindak_lanjut, data.updated_by, exists[0].id_2b6]);
        } else {
            const sql = "INSERT INTO `2b6_kepuasan_pengguna` (id_prodi, id_tahun, jenis_kemampuan, sangat_baik, baik, cukup, kurang, rencana_tindak_lanjut, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return await db.execute(sql, [data.id_prodi, data.id_tahun, data.jenis_kemampuan, data.sangat_baik, data.baik, data.cukup, data.kurang, data.rencana_tindak_lanjut, data.created_by]);
        }
    },

    // 6. Upsert Metadata
    upsertMetadata: async (data) => {
        const [exists] = await db.execute("SELECT id_metadata FROM `2b6_metadata_lulusan` WHERE id_prodi = ? AND id_tahun = ?", [data.id_prodi, data.id_tahun]);
        if (exists.length > 0) {
            return await db.execute("UPDATE `2b6_metadata_lulusan` SET jml_alumni_3_tahun = ?, jml_responden = ?, jml_mhs_aktif_ts = ? WHERE id_metadata = ?", [data.jml_alumni, data.jml_responden, data.jml_mhs_aktif, exists[0].id_metadata]);
        } else {
            return await db.execute("INSERT INTO `2b6_metadata_lulusan` (id_prodi, id_tahun, jml_alumni_3_tahun, jml_responden, jml_mhs_aktif_ts) VALUES (?, ?, ?, ?, ?)", [data.id_prodi, data.id_tahun, data.jml_alumni, data.jml_responden, data.jml_mhs_aktif]);
        }
    },

    // 7. Trash & Restore
    findTrash: async (id_prodi) => {
        const [rows] = await db.execute("SELECT * FROM `2b6_kepuasan_pengguna` WHERE id_prodi = ? AND deleted_at IS NOT NULL", [id_prodi]);
        return rows;
    },

    softDelete: async (id, deleted_by) => {
        return await db.execute("UPDATE `2b6_kepuasan_pengguna` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_2b6 = ?", [deleted_by, id]);
    },

    restore: async (id) => {
        return await db.execute("UPDATE `2b6_kepuasan_pengguna` SET deleted_at = NULL, deleted_by = NULL WHERE id_2b6 = ?", [id]);
    },

    hardDelete: async (id) => {
        return await db.execute("DELETE FROM `2b6_kepuasan_pengguna` WHERE id_2b6 = ?", [id]);
    }
};

module.exports = Model2b6;