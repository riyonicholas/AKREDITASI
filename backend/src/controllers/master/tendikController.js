const Tendik = require('../../models/master/tendik');

/**
 * Tabel Master: Tenaga Kependidikan (Tendik)
 * Controller untuk mengelola data tendik.
 */

// 1. Get All Data
exports.index = async (req, res) => {
    try {
        const data = await Tendik.getAll();
        res.json({
            success: true,
            message: 'Berhasil mengambil data tenaga kependidikan.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Tendik]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data tenaga kependidikan.', error: error.message });
    }
};

// 2. Get Data by ID
exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Tendik.getById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: 'Data tenaga kependidikan tidak ditemukan.' });
        }

        res.json({
            success: true,
            message: 'Berhasil mengambil detail data tenaga kependidikan.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Tendik By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data tenaga kependidikan.', error: error.message });
    }
};

// 3. Create Data
exports.store = async (req, res) => {
    try {
        const { id_pegawai, jenis_tendik } = req.body;

        if (!id_pegawai) {
            return res.status(400).json({ success: false, message: 'id_pegawai wajib diisi.' });
        }

        const insertId = await Tendik.create({
            id_pegawai, jenis_tendik
        });

        res.status(201).json({
            success: true,
            message: 'Data tenaga kependidikan berhasil ditambahkan.',
            data: { id_tendik: insertId, ...req.body }
        });
    } catch (error) {
        console.error('[Error POST Tendik]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data tenaga kependidikan.', error: error.message });
    }
};

// 4. Update Data
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_pegawai, jenis_tendik } = req.body;

        if (!id_pegawai) {
            return res.status(400).json({ success: false, message: 'id_pegawai wajib diisi.' });
        }

        const checkData = await Tendik.getById(id);
        if (!checkData) {
            return res.status(404).json({ success: false, message: 'Data tenaga kependidikan tidak ditemukan.' });
        }

        await Tendik.update(id, {
            id_pegawai, jenis_tendik
        });

        res.json({ success: true, message: 'Data tenaga kependidikan berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT Tendik]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data tenaga kependidikan.', error: error.message });
    }
};

// 5. Delete Data
exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        
        const checkData = await Tendik.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data tenaga kependidikan tidak ditemukan.' });

        await Tendik.hardDelete(id);

        res.json({ success: true, message: 'Data tenaga kependidikan berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE Tendik]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data tenaga kependidikan.', error: error.message });
    }
};
