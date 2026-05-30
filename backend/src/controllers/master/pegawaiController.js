const Pegawai = require('../../models/master/pegawai');

/**
 * Tabel Master: Pegawai
 * Controller untuk mengelola data pegawai.
 */

// 1. Get All Active Data
exports.index = async (req, res) => {
    try {
        const data = await Pegawai.getAll();
        res.json({
            success: true,
            message: 'Berhasil mengambil data pegawai.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Pegawai]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pegawai.', error: error.message });
    }
};

// 2. Get Data by ID
exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Pegawai.getById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: 'Data pegawai tidak ditemukan.' });
        }

        res.json({
            success: true,
            message: 'Berhasil mengambil detail data pegawai.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Pegawai By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pegawai.', error: error.message });
    }
};

// 3. Create Data
exports.store = async (req, res) => {
    try {
        const { nama_lengkap, nikp, id_unit, id_jabatan_struktural, pendidikan_terakhir } = req.body;

        if (!nama_lengkap) {
            return res.status(400).json({ success: false, message: 'nama_lengkap wajib diisi.' });
        }

        const insertId = await Pegawai.create({
            nama_lengkap, nikp, id_unit, id_jabatan_struktural, pendidikan_terakhir
        });

        res.status(201).json({
            success: true,
            message: 'Data pegawai berhasil ditambahkan.',
            data: { id_pegawai: insertId, ...req.body }
        });
    } catch (error) {
        console.error('[Error POST Pegawai]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data pegawai.', error: error.message });
    }
};

// 4. Update Data
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_lengkap, nikp, id_unit, id_jabatan_struktural, pendidikan_terakhir } = req.body;

        if (!nama_lengkap) {
            return res.status(400).json({ success: false, message: 'nama_lengkap wajib diisi.' });
        }

        const checkData = await Pegawai.getById(id);
        if (!checkData) {
            return res.status(404).json({ success: false, message: 'Data pegawai tidak ditemukan.' });
        }

        await Pegawai.update(id, {
            nama_lengkap, nikp, id_unit, id_jabatan_struktural, pendidikan_terakhir
        });

        res.json({ success: true, message: 'Data pegawai berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT Pegawai]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data pegawai.', error: error.message });
    }
};

// 5. Hard Delete Data
exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        
        const checkData = await Pegawai.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data pegawai tidak ditemukan.' });

        await Pegawai.hardDelete(id);

        res.json({ success: true, message: 'Data pegawai berhasil dihapus permanen.' });
    } catch (error) {
        console.error('[Error DELETE Pegawai]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data pegawai.', error: error.message });
    }
};
