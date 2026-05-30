const Prodi = require('../../models/master/prodi');

/**
 * Tabel Master: Program Studi (Prodi)
 * Controller untuk mengelola data prodi.
 */

// 1. Get All Data
exports.index = async (req, res) => {
    try {
        const data = await Prodi.getAll();
        res.json({
            success: true,
            message: 'Berhasil mengambil data program studi.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Prodi]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data program studi.', error: error.message });
    }
};

// 2. Get Data by ID
exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Prodi.getById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: 'Data program studi tidak ditemukan.' });
        }

        res.json({
            success: true,
            message: 'Berhasil mengambil detail data program studi.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Prodi By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data program studi.', error: error.message });
    }
};

// 3. Create Data
exports.store = async (req, res) => {
    try {
        const { nama_prodi, id_unit } = req.body;

        if (!nama_prodi) {
            return res.status(400).json({ success: false, message: 'nama_prodi wajib diisi.' });
        }

        const insertId = await Prodi.create({
            nama_prodi, id_unit
        });

        res.status(201).json({
            success: true,
            message: 'Data program studi berhasil ditambahkan.',
            data: { id_prodi: insertId, ...req.body }
        });
    } catch (error) {
        console.error('[Error POST Prodi]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data program studi.', error: error.message });
    }
};

// 4. Update Data
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_prodi, id_unit } = req.body;

        if (!nama_prodi) {
            return res.status(400).json({ success: false, message: 'nama_prodi wajib diisi.' });
        }

        const checkData = await Prodi.getById(id);
        if (!checkData) {
            return res.status(404).json({ success: false, message: 'Data program studi tidak ditemukan.' });
        }

        await Prodi.update(id, {
            nama_prodi, id_unit
        });

        res.json({ success: true, message: 'Data program studi berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT Prodi]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data program studi.', error: error.message });
    }
};

// 5. Delete Data
exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        
        const checkData = await Prodi.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data program studi tidak ditemukan.' });

        await Prodi.hardDelete(id);

        res.json({ success: true, message: 'Data program studi berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE Prodi]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data program studi.', error: error.message });
    }
};
