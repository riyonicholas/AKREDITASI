const db = require('../../config/db');

class Prodi {
    // 1. Get All Data
    static async getAll() {
        const query = `
            SELECT 
                p.id_prodi, p.nama_prodi, p.id_unit,
                uk.nama_unit
            FROM prodi p
            LEFT JOIN unit_kerja uk ON p.id_unit = uk.id_unit
            ORDER BY p.id_prodi ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                p.id_prodi, p.nama_prodi, p.id_unit,
                uk.nama_unit
            FROM prodi p
            LEFT JOIN unit_kerja uk ON p.id_unit = uk.id_unit
            WHERE p.id_prodi = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // New: Get Data by Unit ID
    static async getByUnit(id_unit) {
        const query = "SELECT * FROM prodi WHERE id_unit = ?";
        const [rows] = await db.query(query, [id_unit]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const query = `
            INSERT INTO prodi 
            (nama_prodi, id_unit) 
            VALUES (?, ?)
        `;
        const [result] = await db.query(query, [
            data.nama_prodi,
            data.id_unit || null
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE prodi 
            SET nama_prodi = ?, id_unit = ?
            WHERE id_prodi = ?
        `;
        const [result] = await db.query(query, [
            data.nama_prodi,
            data.id_unit || null,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM prodi WHERE id_prodi = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = Prodi;
