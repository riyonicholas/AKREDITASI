const db = require('../../config/db');

const Model2c = {
    findMatrix: async (id_prodi, id_tahun) => {
        // 1. Ambil urutan tahun
        const [allYears] = await db.query("SELECT id_tahun, tahun FROM tahun_akademik ORDER BY tahun DESC");
        const tsIndex = allYears.findIndex(y => y.id_tahun == id_tahun);
        
        // Jika tahun tidak ditemukan, kembalikan struktur kosong yang valid
        if (tsIndex === -1) return { years: [], mhs_aktif: [], rows: [] };

        const years = allYears.slice(tsIndex, tsIndex + 3);
        const yearIds = years.map(y => y.id_tahun);

        // 2. Data Master
        const [masters] = await db.execute("SELECT id_bentuk, nama_bentuk FROM master_bentuk_pembelajaran ORDER BY id_bentuk ASC");

        // 3. Data Transaksi
        const [transactions] = await db.execute(`
            SELECT id_bentuk, id_tahun, jumlah_mhs, link_bukti 
            FROM \`2c_fleksibilitas_pembelajaran\` 
            WHERE id_prodi = ? AND id_tahun IN (${yearIds.join(',')}) AND deleted_at IS NULL
        `, [id_prodi]);

        // 4. Data Mahasiswa Aktif
        const [mhsAktif] = await db.execute(`
            SELECT tahun_akademik_id_tahun as id_tahun,
                   SUM(aktif_reg_diterima + aktif_reg_afirmasi + aktif_reg_khusus + 
                       aktif_rpl_diterima + aktif_rpl_afirmasi + aktif_rpl_khusus) as total
            FROM \`2a1_data_mahasiswa\`
            WHERE prodi_id_prodi = ? AND tahun_akademik_id_tahun IN (${yearIds.join(',')}) AND ala_deleted_at IS NULL
            GROUP BY tahun_akademik_id_tahun
        `, [id_prodi]);

        // 5. Rakit Matrix
        const matrixRows = masters.map(m => {
            const row = { id_bentuk: m.id_bentuk, nama_bentuk: m.nama_bentuk, values: {}, link_bukti: '' };
            years.forEach(y => {
                const trans = transactions.find(t => t.id_bentuk === m.id_bentuk && t.id_tahun === y.id_tahun);
                row.values[y.id_tahun] = trans ? trans.jumlah_mhs : 0;
                if (y.id_tahun == id_tahun) row.link_bukti = trans ? trans.link_bukti : '';
            });
            return row;
        });

        const mappedYears = years.map((y, idx) => ({
            ...y,
            label: idx === 0 ? "TS" : (idx === 1 ? "TS-1" : "TS-2")
        }));

        return {
            years: mappedYears.reverse(),
            mhs_aktif: mhsAktif,
            rows: matrixRows
        };
    },

    findById: async (id) => {
        const sql = `SELECT m.*, mb.nama_bentuk FROM \`2c_fleksibilitas_pembelajaran\` m 
                     JOIN master_bentuk_pembelajaran mb ON m.id_bentuk = mb.id_bentuk 
                     WHERE m.id_2c = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    findTrash: async (id_prodi) => {
        const sql = `SELECT m.*, mb.nama_bentuk FROM \`2c_fleksibilitas_pembelajaran\` m 
                     JOIN master_bentuk_pembelajaran mb ON m.id_bentuk = mb.id_bentuk 
                     WHERE m.id_prodi = ? AND m.deleted_at IS NOT NULL`;
        const [rows] = await db.execute(sql, [id_prodi]);
        return rows;
    },

    create: async (data) => {
        return await db.execute(`INSERT INTO \`2c_fleksibilitas_pembelajaran\` (id_prodi, id_tahun, id_bentuk, jumlah_mhs, link_bukti, created_by) VALUES (?, ?, ?, ?, ?, ?)`, 
        [data.id_prodi, data.id_tahun, data.id_bentuk, data.jumlah_mhs || 0, data.link_bukti || null, data.created_by]);
    },

    batchUpsert: async (id_prodi, details, userId) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // 1. Ambil data mahasiswa aktif untuk semua tahun yang ada di details
            const yearIds = [...new Set(details.map(d => d.id_tahun))];
            const [mhsAktif] = await connection.execute(`
                SELECT tahun_akademik_id_tahun as id_tahun,
                       SUM(aktif_reg_diterima + aktif_reg_afirmasi + aktif_reg_khusus + 
                           aktif_rpl_diterima + aktif_rpl_afirmasi + aktif_rpl_khusus) as total
                FROM \`2a1_data_mahasiswa\`
                WHERE prodi_id_prodi = ? AND tahun_akademik_id_tahun IN (${yearIds.join(',')}) AND ala_deleted_at IS NULL
                GROUP BY tahun_akademik_id_tahun
            `, [id_prodi]);

            for (const item of details) {
                // 2. Validasi: Tidak boleh melebihi jumlah mahasiswa aktif
                const limit = mhsAktif.find(m => m.id_tahun == item.id_tahun);
                const totalAktif = limit ? limit.total : 0;
                
                if (parseInt(item.jumlah_mhs) > totalAktif) {
                    throw new Error(`Jumlah mahasiswa (${item.jumlah_mhs}) tidak boleh melebihi total mahasiswa aktif (${totalAktif}) pada tahun tersebut.`);
                }

                // 3. Simpan dengan id_tahun yang benar (item.id_tahun)
                const sql = `
                    INSERT INTO \`2c_fleksibilitas_pembelajaran\` 
                    (id_prodi, id_tahun, id_bentuk, jumlah_mhs, link_bukti, created_by)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    jumlah_mhs = VALUES(jumlah_mhs),
                    link_bukti = VALUES(link_bukti),
                    updated_by = ?,
                    deleted_at = NULL
                `;
                await connection.execute(sql, [
                    id_prodi, item.id_tahun, item.id_bentuk, item.jumlah_mhs || 0, item.link_bukti || null, userId, userId
                ]);
            }
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    update: async (id, data) => {
        return await db.execute(`UPDATE \`2c_fleksibilitas_pembelajaran\` SET id_bentuk = ?, jumlah_mhs = ?, link_bukti = ?, updated_by = ? WHERE id_2c = ?`, 
        [data.id_bentuk, data.jumlah_mhs, data.link_bukti, data.updated_by, id]);
    },

    softDelete: async (id, deleted_by) => {
        return await db.execute("UPDATE `2c_fleksibilitas_pembelajaran` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_2c = ?", [deleted_by, id]);
    },

    restore: async (id) => {
        return await db.execute("UPDATE `2c_fleksibilitas_pembelajaran` SET deleted_at = NULL, deleted_by = NULL WHERE id_2c = ?", [id]);
    },

    hardDelete: async (id) => {
        return await db.execute("DELETE FROM `2c_fleksibilitas_pembelajaran` WHERE id_2c = ?", [id]);
    }
};

module.exports = Model2c;
