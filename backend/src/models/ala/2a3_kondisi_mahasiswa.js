const db = require('../../config/db');

const Model2a3 = {
    /**
     * 1. Ambil Tahun Akademik Kronologis (TS, TS-1, TS-2)
     */
    getTahunKronologis: async (id_tahun_ts) => {
        const [tsRow] = await db.execute(`SELECT tahun FROM tahun_akademik WHERE id_tahun = ?`, [id_tahun_ts]);
        if (!tsRow.length) return null;
        const tsYear = parseInt(tsRow[0].tahun);
        
        const [rows] = await db.execute(`
            SELECT id_tahun, tahun 
            FROM tahun_akademik 
            WHERE tahun IN (?, ? - 1, ? - 2)
        `, [tsYear, tsYear, tsYear]);
        
        return {
            ts: rows.find(r => r.tahun === tsYear) || null,
            ts1: rows.find(r => r.tahun === tsYear - 1) || null,
            ts2: rows.find(r => r.tahun === tsYear - 2) || null
        };
    },

    /**
     * 2. Sinkronisasi murni dari 2.A.1
     * Mengambil data Mahasiswa Baru (maba) dan Mahasiswa Aktif (aktif) langsung dari Tabel 2.A.1
     */
    getSyncData2a1: async (id_prodi, id_tahun) => {
        const query = `
            SELECT 
                (maba_reg_diterima + maba_rpl_diterima) as sync_maba,
                (aktif_reg_diterima + aktif_rpl_diterima) as sync_aktif
            FROM 2a1_data_mahasiswa 
            WHERE prodi_id_prodi = ? AND tahun_akademik_id_tahun = ? AND ala_deleted_at IS NULL
        `;
        const [rows] = await db.execute(query, [id_prodi, id_tahun]);
        return rows[0] || { sync_maba: 0, sync_aktif: 0 };
    },

    /**
     * 3. Ambil Kondisi Retensi Terdaftar
     */
    getCohortEntry: async (id_prodi, id_tahun) => {
        const [rows] = await db.execute(`
            SELECT * FROM 2a3_kondisi_mahasiswa 
            WHERE prodi_id_prodi = ? AND id_tahun = ? AND ala_deleted_at IS NULL
        `, [id_prodi, id_tahun]);
        return rows[0] || null;
    },

    /**
     * 4. Upsert Data Retensi (Simpan atau Perbarui)
     */
    upsert: async (d) => {
        const query = `
            INSERT INTO 2a3_kondisi_mahasiswa (
                prodi_id_prodi, id_tahun, maba, lulus, \`do\`, aktif, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                maba=VALUES(maba),
                lulus=VALUES(lulus),
                \`do\`=VALUES(\`do\`),
                aktif=VALUES(aktif),
                updated_by=VALUES(created_by),
                ala_deleted_at=NULL
        `;
        return db.execute(query, d);
    },

    /**
     * 5. Trash System (Manajemen Sampah ALA)
     */
    getTrash: async (id_prodi) => {
        const query = `
            SELECT t1.*, t2.tahun 
            FROM 2a3_kondisi_mahasiswa t1
            JOIN tahun_akademik t2 ON t1.id_tahun = t2.id_tahun
            WHERE t1.prodi_id_prodi = ? AND t1.ala_deleted_at IS NOT NULL
        `;
        return db.execute(query, [id_prodi]);
    },

    softDelete: async (id_2a3, user_id) => {
        return db.execute(
            `UPDATE 2a3_kondisi_mahasiswa SET ala_deleted_at = NOW(), ala_deleted_by = ? WHERE id_2a3 = ?`,
            [user_id, id_2a3]
        );
    },

    restore: async (id_2a3) => {
        return db.execute(
            `UPDATE 2a3_kondisi_mahasiswa SET ala_deleted_at = NULL, ala_deleted_by = NULL WHERE id_2a3 = ?`,
            [id_2a3]
        );
    },

    hardDelete: async (id_2a3) => {
        return db.execute(`DELETE FROM 2a3_kondisi_mahasiswa WHERE id_2a3 = ?`, [id_2a3]);
    }
};

module.exports = Model2a3;