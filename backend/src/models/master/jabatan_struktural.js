const db = require('../../config/db');

class JabatanStruktural {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM jabatan_struktural ORDER BY nama_jabatan ASC');
        return rows;
    }
}

module.exports = JabatanStruktural;
