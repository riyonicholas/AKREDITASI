const db = require('../../config/db');

class MataKuliah {
    static async getAll(id_prodi) {
        let query = `
            SELECT 
                mk.id_mk, mk.id_prodi, mk.kode_mk, mk.nama_mk, mk.sks, mk.semester,
                p.nama_prodi
            FROM master_mata_kuliah mk
            LEFT JOIN prodi p ON mk.id_prodi = p.id_prodi
            WHERE 1=1
        `;
        const params = [];
        if (id_prodi) {
            query += ' AND mk.id_prodi = ?';
            params.push(id_prodi);
        }
        query += ' ORDER BY mk.id_mk ASC';
        
        const [rows] = await db.query(query, params);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                mk.id_mk, mk.id_prodi, mk.kode_mk, mk.nama_mk, mk.sks, mk.semester,
                p.nama_prodi
            FROM master_mata_kuliah mk
            LEFT JOIN prodi p ON mk.id_prodi = p.id_prodi
            WHERE mk.id_mk = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const query = `
            INSERT INTO master_mata_kuliah 
            (id_prodi, kode_mk, nama_mk, sks, semester) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_prodi,
            data.kode_mk,
            data.nama_mk,
            data.sks,
            data.semester
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE master_mata_kuliah 
            SET id_prodi = ?, kode_mk = ?, nama_mk = ?, sks = ?, semester = ?
            WHERE id_mk = ?
        `;
        const [result] = await db.query(query, [
            data.id_prodi,
            data.kode_mk,
            data.nama_mk,
            data.sks,
            data.semester,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM master_mata_kuliah WHERE id_mk = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = MataKuliah;
