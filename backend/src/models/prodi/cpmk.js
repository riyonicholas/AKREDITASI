const db = require('../../config/db');

class CPMK {
    static async getAll(id_prodi) {
        let query = `
            SELECT 
                cpmk.id_cpmk, cpmk.id_prodi, cpmk.kode_cpmk, cpmk.deskripsi_cpmk,
                p.nama_prodi
            FROM master_cpmk cpmk
            LEFT JOIN prodi p ON cpmk.id_prodi = p.id_prodi
            WHERE 1=1
        `;
        const params = [];
        if (id_prodi) {
            query += ' AND cpmk.id_prodi = ?';
            params.push(id_prodi);
        }
        query += ' ORDER BY cpmk.id_cpmk ASC';
        
        const [rows] = await db.query(query, params);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                cpmk.id_cpmk, cpmk.id_prodi, cpmk.kode_cpmk, cpmk.deskripsi_cpmk,
                p.nama_prodi
            FROM master_cpmk cpmk
            LEFT JOIN prodi p ON cpmk.id_prodi = p.id_prodi
            WHERE cpmk.id_cpmk = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const [lastRow] = await db.query('SELECT kode_cpmk FROM master_cpmk WHERE id_prodi = ? ORDER BY id_cpmk DESC LIMIT 1', [data.id_prodi]);
        let urutan = 1;
        if (lastRow.length > 0 && lastRow[0].kode_cpmk) {
            const parts = lastRow[0].kode_cpmk.split('-');
            if (parts.length > 0 && !isNaN(parts[parts.length - 1])) {
                urutan = parseInt(parts[parts.length - 1]) + 1;
            }
        }
        const generatedKode = `CPMK-${data.id_prodi}-${urutan}`;

        const query = `
            INSERT INTO master_cpmk 
            (id_prodi, kode_cpmk, deskripsi_cpmk) 
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_prodi,
            generatedKode,
            data.deskripsi_cpmk
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE master_cpmk 
            SET id_prodi = ?, deskripsi_cpmk = ?
            WHERE id_cpmk = ?
        `;
        const [result] = await db.query(query, [
            data.id_prodi,
            data.deskripsi_cpmk,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM master_cpmk WHERE id_cpmk = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = CPMK;
