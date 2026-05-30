const db = require('../../config/db');

class Dosen {
    // 1. Get All Data
    static async getAll() {
        const query = `
            SELECT 
                d.id_dosen, d.id_pegawai, d.nidn, d.nuptk, d.id_prodi, d.perguruan_tinggi, d.id_jabatan_fungsional,
                p.nama_lengkap, p.nikp,
                pr.nama_prodi,
                jf.nama_jafung
            FROM dosen d
            INNER JOIN pegawai p ON d.id_pegawai = p.id_pegawai
            LEFT JOIN prodi pr ON d.id_prodi = pr.id_prodi
            LEFT JOIN jabatan_fungsional jf ON d.id_jabatan_fungsional = jf.id_jafung
            ORDER BY d.id_dosen ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                d.id_dosen, d.id_pegawai, d.nidn, d.nuptk, d.id_prodi, d.perguruan_tinggi, d.id_jabatan_fungsional,
                p.nama_lengkap, p.nikp,
                pr.nama_prodi,
                jf.nama_jafung
            FROM dosen d
            INNER JOIN pegawai p ON d.id_pegawai = p.id_pegawai
            LEFT JOIN prodi pr ON d.id_prodi = pr.id_prodi
            LEFT JOIN jabatan_fungsional jf ON d.id_jabatan_fungsional = jf.id_jafung
            WHERE d.id_dosen = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const query = `
            INSERT INTO dosen 
            (id_pegawai, nidn, nuptk, id_prodi, perguruan_tinggi, id_jabatan_fungsional) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_pegawai,
            data.nidn || null,
            data.nuptk || null,
            data.id_prodi || null,
            data.perguruan_tinggi || null,
            data.id_jabatan_fungsional || null
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE dosen 
            SET id_pegawai = ?, nidn = ?, nuptk = ?, id_prodi = ?, perguruan_tinggi = ?, id_jabatan_fungsional = ?
            WHERE id_dosen = ?
        `;
        const [result] = await db.query(query, [
            data.id_pegawai,
            data.nidn || null,
            data.nuptk || null,
            data.id_prodi || null,
            data.perguruan_tinggi || null,
            data.id_jabatan_fungsional || null,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async hardDelete(id) {
        const query = 'DELETE FROM dosen WHERE id_dosen = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = Dosen;
