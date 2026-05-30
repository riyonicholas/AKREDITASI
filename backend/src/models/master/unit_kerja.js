const db = require('../../config/db');

class UnitKerja {
    // 1. Ambil Semua Data (Hanya nama_unit)
    static async getAll() {
        const sql = "SELECT id_unit, nama_unit FROM unit_kerja ORDER BY nama_unit ASC";
        const [rows] = await db.query(sql);
        return rows;
    }

    // 2. Ambil Berdasarkan ID
    static async getById(id) {
        const sql = "SELECT id_unit, nama_unit FROM unit_kerja WHERE id_unit = ?";
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }

    // 3. Tambah Data
    static async create(data) {
        const sql = "INSERT INTO unit_kerja (nama_unit) VALUES (?)";
        const [result] = await db.query(sql, [data.nama_unit]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const sql = "UPDATE unit_kerja SET nama_unit = ? WHERE id_unit = ?";
        const [result] = await db.query(sql, [data.nama_unit, id]);
        return result.affectedRows;
    }

    // 5. Hapus Data (Hard Delete karena tidak ada kolom deleted_at)
    static async hardDelete(id) {
        const sql = "DELETE FROM unit_kerja WHERE id_unit = ?";
        const [result] = await db.query(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = UnitKerja;
