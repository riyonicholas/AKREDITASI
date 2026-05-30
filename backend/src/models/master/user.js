const db = require('../../config/db');

class User {
    // 1. Get All Data (TANPA password untuk keamanan)
    static async getAll() {
        const query = `
            SELECT 
                u.id_user, u.id_unit, u.username,
                uk.nama_unit
            FROM users u
            LEFT JOIN unit_kerja uk ON u.id_unit = uk.id_unit
            ORDER BY u.id_user ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                u.id_user, u.id_unit, u.username,
                uk.nama_unit
            FROM users u
            LEFT JOIN unit_kerja uk ON u.id_unit = uk.id_unit
            WHERE u.id_user = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const query = `
            INSERT INTO users 
            (id_unit, username, password) 
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_unit,
            data.username,
            data.password
        ]);
        return result.insertId;
    }

    // 4. Update Data (Cek jika password ikut diupdate)
    static async update(id, data) {
        if (data.password) {
            const query = `
                UPDATE users 
                SET id_unit = ?, username = ?, password = ?
                WHERE id_user = ?
            `;
            const [result] = await db.query(query, [
                data.id_unit,
                data.username,
                data.password,
                id
            ]);
            return result.affectedRows;
        } else {
            const query = `
                UPDATE users 
                SET id_unit = ?, username = ?
                WHERE id_user = ?
            `;
            const [result] = await db.query(query, [
                data.id_unit,
                data.username,
                id
            ]);
            return result.affectedRows;
        }
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM users WHERE id_user = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = User;
