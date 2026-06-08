const db = require('../../config/db');

exports.getByUnit = async (req, res) => {
    try {
        const { id_unit } = req.params;
        const [rows] = await db.execute(`
            SELECT p.*, u.nama_unit 
            FROM buku_panduan p
            JOIN unit_kerja u ON p.id_unit = u.id_unit
            WHERE p.id_unit = ?
            ORDER BY p.created_at DESC
        `, [id_unit]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Error getByUnit:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, u.nama_unit 
            FROM buku_panduan p
            JOIN unit_kerja u ON p.id_unit = u.id_unit
            ORDER BY p.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Error getAll:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id_panduan } = req.params;
        const [rows] = await db.execute('SELECT * FROM buku_panduan WHERE id_panduan = ?', [id_panduan]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Panduan tidak ditemukan' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('Error getById:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};

exports.store = async (req, res) => {
    try {
        const { id_unit, judul, konten, link_lampiran } = req.body;
        const id_user = req.user.id_user || req.user.id;

        await db.execute(`
            INSERT INTO buku_panduan (id_unit, judul, konten, link_lampiran, created_by)
            VALUES (?, ?, ?, ?, ?)
        `, [id_unit, judul, konten, link_lampiran || null, id_user]);

        res.status(201).json({ success: true, message: 'Buku Panduan berhasil ditambahkan.' });
    } catch (err) {
        console.error('Error store panduan:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id_panduan } = req.params;
        const { id_unit, judul, konten, link_lampiran } = req.body;

        await db.execute(`
            UPDATE buku_panduan 
            SET id_unit = ?, judul = ?, konten = ?, link_lampiran = ?
            WHERE id_panduan = ?
        `, [id_unit, judul, konten, link_lampiran || null, id_panduan]);

        res.json({ success: true, message: 'Buku Panduan berhasil diperbarui.' });
    } catch (err) {
        console.error('Error update panduan:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id_panduan } = req.params;
        await db.execute('DELETE FROM buku_panduan WHERE id_panduan = ?', [id_panduan]);
        res.json({ success: true, message: 'Buku Panduan berhasil dihapus.' });
    } catch (err) {
        console.error('Error destroy panduan:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};
