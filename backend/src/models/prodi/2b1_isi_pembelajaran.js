const db = require('../../config/db');

class IsiPembelajaran2B1 {
    // 1. Get All Data
    static async getAll(id_prodi, id_tahun) {
        let query = `
            SELECT 
                b.id_2b1, b.id_mk, b.id_pl, b.id_tahun,
                mk.kode_mk, mk.nama_mk, mk.sks, mk.semester, mk.id_prodi,
                pl.kode_pl, pl.deskripsi_pl,
                t.tahun
            FROM \`2b1_isi_pembelajaran\` b
            LEFT JOIN master_mata_kuliah mk ON b.id_mk = mk.id_mk
            LEFT JOIN master_profil_lulusan pl ON b.id_pl = pl.id_pl
            LEFT JOIN tahun_akademik t ON b.id_tahun = t.id_tahun
            WHERE 1=1
        `;
        const params = [];
        if (id_prodi) {
            query += ' AND mk.id_prodi = ?';
            params.push(id_prodi);
        }
        if (id_tahun) {
            query += ' AND b.id_tahun = ?';
            params.push(id_tahun);
        }
        query += ' ORDER BY b.id_2b1 ASC';
        
        const [rows] = await db.query(query, params);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                b.id_2b1, b.id_mk, b.id_pl, b.id_tahun,
                mk.kode_mk, mk.nama_mk, mk.sks, mk.semester,
                pl.kode_pl, pl.deskripsi_pl,
                t.tahun
            FROM \`2b1_isi_pembelajaran\` b
            LEFT JOIN master_mata_kuliah mk ON b.id_mk = mk.id_mk
            LEFT JOIN master_profil_lulusan pl ON b.id_pl = pl.id_pl
            LEFT JOIN tahun_akademik t ON b.id_tahun = t.id_tahun
            WHERE b.id_2b1 = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const query = `
            INSERT INTO \`2b1_isi_pembelajaran\` 
            (id_mk, id_pl, id_tahun) 
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_mk,
            data.id_pl,
            data.id_tahun
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE \`2b1_isi_pembelajaran\` 
            SET id_mk = ?, id_pl = ?, id_tahun = ?
            WHERE id_2b1 = ?
        `;
        const [result] = await db.query(query, [
            data.id_mk,
            data.id_pl,
            data.id_tahun,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM \`2b1_isi_pembelajaran\` WHERE id_2b1 = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = IsiPembelajaran2B1;
