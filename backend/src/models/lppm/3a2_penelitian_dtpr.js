const db = require('../../config/db');

const ModelPenelitian = {
    findAllRange: async (id_prodi, targetTS) => {
        const sql = `
            SELECT p.*, peg.nama_lengkap as nama_dosen, d.nidn, r.link_dokumen as roadmap_link 
            FROM \`3a2_penelitian_dtpr\` p
            JOIN dosen d ON p.id_dosen = d.id_dosen
            JOIN pegawai peg ON d.id_pegawai = peg.id_pegawai
            LEFT JOIN roadmap_lppm r ON p.id_roadmap = r.id_roadmap
            WHERE p.deleted_at IS NULL 
            AND d.id_prodi = ? 
            AND p.id_tahun <= ? 
            AND p.id_tahun >= (? - 2)
            ORDER BY p.id_tahun DESC, peg.nama_lengkap ASC
        `;
        const [rows] = await db.execute(sql, [id_prodi, targetTS, targetTS]);
        
        // Ambil data relasi untuk tiap penelitian
        for (let row of rows) {
            const [kerjasama] = await db.execute('SELECT * FROM `3c1_kerjasama_penelitian` WHERE id_3a2 = ?', [row.id_3a2]);
            const [publikasi] = await db.execute('SELECT * FROM `3c2_publikasi_penelitian` WHERE id_3a2 = ?', [row.id_3a2]);
            const [hki] = await db.execute('SELECT * FROM `3c3_perolehan_hki` WHERE id_3a2 = ?', [row.id_3a2]);
            
            row.kerjasama = kerjasama;
            row.publikasi = publikasi;
            row.hki = hki;
        }

        return rows;
    },

    findTrash: async (id_prodi, targetTS) => {
        const sql = `
            SELECT p.*, peg.nama_lengkap as nama_dosen, d.nidn 
            FROM \`3a2_penelitian_dtpr\` p
            JOIN dosen d ON p.id_dosen = d.id_dosen
            JOIN pegawai peg ON d.id_pegawai = peg.id_pegawai
            WHERE p.deleted_at IS NOT NULL 
            AND d.id_prodi = ? 
            AND p.id_tahun <= ? 
            AND p.id_tahun >= (? - 2)
            ORDER BY p.deleted_at DESC
        `;
        const [rows] = await db.execute(sql, [id_prodi, targetTS, targetTS]);
        return rows;
    },

    // FUNGSI TRANSACTION UNTUK SEKALI INPUT (INDUK + ANAK)
    createTransaction: async (data, userId) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // A. Insert Tabel Induk: 3A2
            const sqlInduk = `
                INSERT INTO \`3a2_penelitian_dtpr\` 
                (id_roadmap, id_dosen, id_tahun, judul_penelitian, jumlah_mahasiswa, jenis_hibah, sumber, durasi, jumlah_dana, link_bukti, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [resInduk] = await connection.execute(sqlInduk, [
                data.penelitian.id_roadmap,
                data.penelitian.id_dosen, 
                data.penelitian.id_tahun, 
                data.penelitian.judul_penelitian, 
                data.penelitian.jumlah_mahasiswa || 0,
                data.penelitian.jenis_hibah || null,
                data.penelitian.sumber || null,
                data.penelitian.durasi || null,
                data.penelitian.jumlah_dana || null,
                data.penelitian.link_bukti || null,
                userId
            ]);
            
            const id_3a2 = resInduk.insertId;

            // B. Insert Tabel Kerjasama (Jika Ada)
            if (data.kerjasama && data.kerjasama.length > 0) {
                const sqlKerjasama = `
                    INSERT INTO \`3c1_kerjasama_penelitian\` 
                    (id_3a2, id_tahun, judul_kerjasama, mitra_kerja_sama, sumber, durasi, jumlah_dana, link_bukti, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                for (let k of data.kerjasama) {
                    await connection.execute(sqlKerjasama, [
                        id_3a2, k.id_tahun, k.judul_kerjasama, k.mitra_kerja_sama, 
                        k.sumber || null, k.durasi || 0, k.jumlah_dana || 0, k.link_bukti || null, userId
                    ]);
                }
            }

            // C. Insert Tabel Publikasi (Jika Ada)
            if (data.publikasi && data.publikasi.length > 0) {
                const sqlPublikasi = `
                    INSERT INTO \`3c2_publikasi_penelitian\` 
                    (id_3a2, id_tahun, judul_publikasi, jenis_publikasi, link_bukti, created_by)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                for (let p of data.publikasi) {
                    await connection.execute(sqlPublikasi, [
                        id_3a2, p.id_tahun, p.judul_publikasi, p.jenis_publikasi || null, p.link_bukti || null, userId
                    ]);
                }
            }

            // D. Insert Tabel HKI (Jika Ada)
            if (data.hki && data.hki.length > 0) {
                const sqlHki = `
                    INSERT INTO \`3c3_perolehan_hki\` 
                    (id_3a2, id_tahun, judul_hki, jenis_hki, link_bukti, created_by)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                for (let h of data.hki) {
                    await connection.execute(sqlHki, [
                        id_3a2, h.id_tahun, h.judul_hki, h.jenis_hki, h.link_bukti || null, userId
                    ]);
                }
            }

            // Jika semua sukses, kunci secara permanen!
            await connection.commit();
            return id_3a2;

        } catch (error) {
            // Jika ada satu saja yang error, batalkan semuanya!
            await connection.rollback();
            throw error;
        } finally {
            // Kembalikan koneksi ke Pool
            connection.release();
        }
    },

    updateTransaction: async (id, data, userId) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // A. Update Tabel Induk: 3A2
            const sqlInduk = `
                UPDATE \`3a2_penelitian_dtpr\`
                SET id_roadmap = ?, id_dosen = ?, id_tahun = ?, judul_penelitian = ?, jumlah_mahasiswa = ?, jenis_hibah = ?, sumber = ?, durasi = ?, jumlah_dana = ?, link_bukti = ?, updated_by = ?
                WHERE id_3a2 = ?
            `;
            await connection.execute(sqlInduk, [
                data.penelitian.id_roadmap, data.penelitian.id_dosen, data.penelitian.id_tahun, data.penelitian.judul_penelitian, 
                data.penelitian.jumlah_mahasiswa || 0, data.penelitian.jenis_hibah || null, data.penelitian.sumber || null, 
                data.penelitian.durasi || null, data.penelitian.jumlah_dana || null, data.penelitian.link_bukti || null, userId, id
            ]);

            // B. Hapus Data Relasi Lama
            await connection.execute(`DELETE FROM \`3c1_kerjasama_penelitian\` WHERE id_3a2 = ?`, [id]);
            await connection.execute(`DELETE FROM \`3c2_publikasi_penelitian\` WHERE id_3a2 = ?`, [id]);
            await connection.execute(`DELETE FROM \`3c3_perolehan_hki\` WHERE id_3a2 = ?`, [id]);

            // C. Insert Tabel Kerjasama Baru (Jika Ada)
            if (data.kerjasama && data.kerjasama.length > 0) {
                const sqlKerjasama = `
                    INSERT INTO \`3c1_kerjasama_penelitian\` 
                    (id_3a2, id_tahun, judul_kerjasama, mitra_kerja_sama, sumber, durasi, jumlah_dana, link_bukti, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                for (let k of data.kerjasama) {
                    await connection.execute(sqlKerjasama, [
                        id, k.id_tahun, k.judul_kerjasama, k.mitra_kerja_sama, 
                        k.sumber || null, k.durasi || 0, k.jumlah_dana || 0, k.link_bukti || null, userId
                    ]);
                }
            }

            // D. Insert Tabel Publikasi Baru (Jika Ada)
            if (data.publikasi && data.publikasi.length > 0) {
                const sqlPublikasi = `
                    INSERT INTO \`3c2_publikasi_penelitian\` 
                    (id_3a2, id_tahun, judul_publikasi, jenis_publikasi, link_bukti, created_by)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                for (let p of data.publikasi) {
                    await connection.execute(sqlPublikasi, [
                        id, p.id_tahun, p.judul_publikasi, p.jenis_publikasi || null, p.link_bukti || null, userId
                    ]);
                }
            }

            // E. Insert Tabel HKI Baru (Jika Ada)
            if (data.hki && data.hki.length > 0) {
                const sqlHki = `
                    INSERT INTO \`3c3_perolehan_hki\` 
                    (id_3a2, id_tahun, judul_hki, jenis_hki, link_bukti, created_by)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                for (let h of data.hki) {
                    await connection.execute(sqlHki, [
                        id, h.id_tahun, h.judul_hki, h.jenis_hki, h.link_bukti || null, userId
                    ]);
                }
            }

            await connection.commit();
            return id;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    softDelete: async (id, userId) => {
        const sql = `UPDATE \`3a2_penelitian_dtpr\` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_3a2 = ?`;
        const [result] = await db.execute(sql, [userId, id]);
        return result;
    },

    restore: async (id) => {
        const sql = `UPDATE \`3a2_penelitian_dtpr\` SET deleted_at = NULL, deleted_by = NULL WHERE id_3a2 = ?`;
        const [result] = await db.execute(sql, [id]);
        return result;
    },

    hardDelete: async (id) => {
        const sql = `DELETE FROM \`3a2_penelitian_dtpr\` WHERE id_3a2 = ?`;
        const [result] = await db.execute(sql, [id]);
        return result;
    }
};

module.exports = ModelPenelitian;
