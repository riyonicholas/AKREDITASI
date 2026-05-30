const db = require('../../config/db');

class Tendik {
    // 1. Get All Data
    static async getAll() {
        const query = `
            SELECT 
                t.id_tendik, t.id_pegawai, t.jenis_tendik,
                p.nama_lengkap, p.nikp
            FROM tenaga_kependidikan t
            INNER JOIN pegawai p ON t.id_pegawai = p.id_pegawai
            ORDER BY t.id_tendik ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                t.id_tendik, t.id_pegawai, t.jenis_tendik,
                p.nama_lengkap, p.nikp
            FROM tenaga_kependidikan t
            INNER JOIN pegawai p ON t.id_pegawai = p.id_pegawai
            WHERE t.id_tendik = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const query = `
            INSERT INTO tenaga_kependidikan 
            (id_pegawai, jenis_tendik) 
            VALUES (?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_pegawai,
            data.jenis_tendik || null
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE tenaga_kependidikan 
            SET id_pegawai = ?, jenis_tendik = ?
            WHERE id_tendik = ?
        `;
        const [result] = await db.query(query, [
            data.id_pegawai,
            data.jenis_tendik || null,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM tenaga_kependidikan WHERE id_tendik = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = Tendik;
