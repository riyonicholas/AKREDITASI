const db = require('../../config/db');

class PetaPemenuhanCpl2B3 {
    // 1. Get All Data
    static async getAll(id_prodi, id_tahun) {
        let query = `
            SELECT 
                b.id_2b3, b.id_cpl, b.id_cpmk, b.id_mk, b.id_tahun,
                cpl.kode_cpl, cpl.deskripsi_cpl, cpl.id_prodi,
                cpmk.kode_cpmk, cpmk.deskripsi_cpmk,
                mk.kode_mk, mk.nama_mk, mk.sks, mk.semester,
                t.tahun
            FROM \`2b3_peta_pemenuhan_cpl\` b
            LEFT JOIN master_cpl cpl ON b.id_cpl = cpl.id_cpl
            LEFT JOIN master_cpmk cpmk ON b.id_cpmk = cpmk.id_cpmk
            LEFT JOIN master_mata_kuliah mk ON b.id_mk = mk.id_mk
            LEFT JOIN tahun_akademik t ON b.id_tahun = t.id_tahun
            WHERE 1=1
        `;
        const params = [];
        if (id_prodi) {
            query += ' AND cpl.id_prodi = ?';
            params.push(id_prodi);
        }
        if (id_tahun) {
            query += ' AND b.id_tahun = ?';
            params.push(id_tahun);
        }
        query += ' ORDER BY b.id_2b3 ASC';
        
        const [rows] = await db.query(query, params);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                b.id_2b3, b.id_cpl, b.id_cpmk, b.id_mk, b.id_tahun,
                cpl.kode_cpl, cpl.deskripsi_cpl,
                cpmk.kode_cpmk, cpmk.deskripsi_cpmk,
                mk.kode_mk, mk.nama_mk, mk.sks, mk.semester,
                t.tahun
            FROM \`2b3_peta_pemenuhan_cpl\` b
            LEFT JOIN master_cpl cpl ON b.id_cpl = cpl.id_cpl
            LEFT JOIN master_cpmk cpmk ON b.id_cpmk = cpmk.id_cpmk
            LEFT JOIN master_mata_kuliah mk ON b.id_mk = mk.id_mk
            LEFT JOIN tahun_akademik t ON b.id_tahun = t.id_tahun
            WHERE b.id_2b3 = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const query = `
            INSERT INTO \`2b3_peta_pemenuhan_cpl\` 
            (id_cpl, id_cpmk, id_mk, id_tahun) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_cpl,
            data.id_cpmk,
            data.id_mk,
            data.id_tahun
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE \`2b3_peta_pemenuhan_cpl\` 
            SET id_cpl = ?, id_cpmk = ?, id_mk = ?, id_tahun = ?
            WHERE id_2b3 = ?
        `;
        const [result] = await db.query(query, [
            data.id_cpl,
            data.id_cpmk,
            data.id_mk,
            data.id_tahun,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM \`2b3_peta_pemenuhan_cpl\` WHERE id_2b3 = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = PetaPemenuhanCpl2B3;
