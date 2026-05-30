const db = require('../../config/db');

class TahunAkademik {
    // Hanya fungsi Read (Get All)
    static async getAll() {
        // Mengurutkan dari tahun terbaru ke terlama
        const query = 'SELECT id_tahun, tahun FROM tahun_akademik ORDER BY tahun DESC';
        const [rows] = await db.query(query);
        return rows;
    }
}

module.exports = TahunAkademik;
