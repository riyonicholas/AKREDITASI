const db = require('../../config/db');

class ProfilLulusan {
    static async getAll(id_prodi) {
        let query = `
            SELECT 
                pl.id_pl, pl.id_prodi, pl.kode_pl, pl.deskripsi_pl,
                p.nama_prodi
            FROM master_profil_lulusan pl
            LEFT JOIN prodi p ON pl.id_prodi = p.id_prodi
            WHERE 1=1
        `;
        const params = [];
        if (id_prodi) {
            query += ' AND pl.id_prodi = ?';
            params.push(id_prodi);
        }
        query += ' ORDER BY pl.id_pl ASC';
        
        const [rows] = await db.query(query, params);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                pl.id_pl, pl.id_prodi, pl.kode_pl, pl.deskripsi_pl,
                p.nama_prodi
            FROM master_profil_lulusan pl
            LEFT JOIN prodi p ON pl.id_prodi = p.id_prodi
            WHERE pl.id_pl = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const [lastRow] = await db.query('SELECT kode_pl FROM master_profil_lulusan WHERE id_prodi = ? ORDER BY id_pl DESC LIMIT 1', [data.id_prodi]);
        let urutan = 1;
        if (lastRow.length > 0 && lastRow[0].kode_pl) {
            const parts = lastRow[0].kode_pl.split('-');
            if (parts.length > 0 && !isNaN(parts[parts.length - 1])) {
                urutan = parseInt(parts[parts.length - 1]) + 1;
            }
        }
        const generatedKode = `PL-${data.id_prodi}-${urutan}`;

        const query = `
            INSERT INTO master_profil_lulusan 
            (id_prodi, kode_pl, deskripsi_pl) 
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_prodi,
            generatedKode,
            data.deskripsi_pl
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE master_profil_lulusan 
            SET id_prodi = ?, deskripsi_pl = ?
            WHERE id_pl = ?
        `;
        const [result] = await db.query(query, [
            data.id_prodi,
            data.deskripsi_pl,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM master_profil_lulusan WHERE id_pl = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = ProfilLulusan;
