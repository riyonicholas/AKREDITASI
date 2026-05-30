const db = require('../../config/db');

class CPL {
    static async getAll(id_prodi) {
        let query = `
            SELECT 
                cpl.id_cpl, cpl.id_prodi, cpl.kode_cpl, cpl.deskripsi_cpl,
                p.nama_prodi
            FROM master_cpl cpl
            LEFT JOIN prodi p ON cpl.id_prodi = p.id_prodi
            WHERE 1=1
        `;
        const params = [];
        if (id_prodi) {
            query += ' AND cpl.id_prodi = ?';
            params.push(id_prodi);
        }
        query += ' ORDER BY cpl.id_cpl ASC';
        
        const [rows] = await db.query(query, params);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                cpl.id_cpl, cpl.id_prodi, cpl.kode_cpl, cpl.deskripsi_cpl,
                p.nama_prodi
            FROM master_cpl cpl
            LEFT JOIN prodi p ON cpl.id_prodi = p.id_prodi
            WHERE cpl.id_cpl = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const [lastRow] = await db.query('SELECT kode_cpl FROM master_cpl WHERE id_prodi = ? ORDER BY id_cpl DESC LIMIT 1', [data.id_prodi]);
        let urutan = 1;
        if (lastRow.length > 0 && lastRow[0].kode_cpl) {
            const parts = lastRow[0].kode_cpl.split('-');
            if (parts.length > 0 && !isNaN(parts[parts.length - 1])) {
                urutan = parseInt(parts[parts.length - 1]) + 1;
            }
        }
        const generatedKode = `CPL-${data.id_prodi}-${urutan}`;

        const query = `
            INSERT INTO master_cpl 
            (id_prodi, kode_cpl, deskripsi_cpl) 
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_prodi,
            generatedKode,
            data.deskripsi_cpl
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE master_cpl 
            SET id_prodi = ?, deskripsi_cpl = ?
            WHERE id_cpl = ?
        `;
        const [result] = await db.query(query, [
            data.id_prodi,
            data.deskripsi_cpl,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM master_cpl WHERE id_cpl = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = CPL;
