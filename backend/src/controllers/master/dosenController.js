const Dosen = require('../../models/master/dosen');

/**
 * Tabel Master: Dosen
 * Controller untuk mengelola data dosen.
 */

// 1. Get All Data
exports.index = async (req, res) => {
    try {
        const data = await Dosen.getAll();
        res.json({
            success: true,
            message: 'Berhasil mengambil data dosen.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Dosen]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data dosen.', error: error.message });
    }
};

// 2. Get Data by ID
exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Dosen.getById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: 'Data dosen tidak ditemukan.' });
        }

        res.json({
            success: true,
            message: 'Berhasil mengambil detail data dosen.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Dosen By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data dosen.', error: error.message });
    }
};

// 3. Create Data
exports.store = async (req, res) => {
    try {
        const { id_pegawai, nidn, nuptk, id_prodi, perguruan_tinggi, id_jabatan_fungsional } = req.body;

        if (!id_pegawai) {
            return res.status(400).json({ success: false, message: 'id_pegawai wajib diisi.' });
        }

        const insertId = await Dosen.create({
            id_pegawai, nidn, nuptk, id_prodi, perguruan_tinggi, id_jabatan_fungsional
        });

        res.status(201).json({
            success: true,
            message: 'Data dosen berhasil ditambahkan.',
            data: { id_dosen: insertId, ...req.body }
        });
    } catch (error) {
        console.error('[Error POST Dosen]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data dosen.', error: error.message });
    }
};

// 4. Update Data
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_pegawai, nidn, nuptk, id_prodi, perguruan_tinggi, id_jabatan_fungsional } = req.body;

        if (!id_pegawai) {
            return res.status(400).json({ success: false, message: 'id_pegawai wajib diisi.' });
        }

        const checkData = await Dosen.getById(id);
        if (!checkData) {
            return res.status(404).json({ success: false, message: 'Data dosen tidak ditemukan.' });
        }

        await Dosen.update(id, {
            id_pegawai, nidn, nuptk, id_prodi, perguruan_tinggi, id_jabatan_fungsional
        });

        res.json({ success: true, message: 'Data dosen berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT Dosen]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data dosen.', error: error.message });
    }
};

// 5. Delete Data
exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        
        const checkData = await Dosen.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data dosen tidak ditemukan.' });

        await Dosen.hardDelete(id);

        res.json({ success: true, message: 'Data dosen berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE Dosen]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data dosen.', error: error.message });
    }
};
