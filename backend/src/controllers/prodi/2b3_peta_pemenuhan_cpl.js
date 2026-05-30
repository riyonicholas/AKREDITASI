const PetaPemenuhanCpl2B3 = require('../../models/prodi/2b3_peta_pemenuhan_cpl');

exports.index = async (req, res) => {
    try {
        const { id_prodi, id_tahun } = req.query;
        const data = await PetaPemenuhanCpl2B3.getAll(id_prodi, id_tahun);
        res.json({ success: true, message: 'Berhasil mengambil data tabel 2B3.', data });
    } catch (error) {
        console.error('[Error GET 2B3]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data 2B3.', error: error.message });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PetaPemenuhanCpl2B3.getById(id);
        if (!data) return res.status(404).json({ success: false, message: 'Data 2B3 tidak ditemukan.' });
        res.json({ success: true, message: 'Berhasil mengambil detail data 2B3.', data });
    } catch (error) {
        console.error('[Error GET 2B3 By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data 2B3.', error: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { id_cpl, id_cpmk, id_mk, id_tahun } = req.body;
        if (!id_cpl || !id_cpmk || !id_mk || !id_tahun) {
            return res.status(400).json({ success: false, message: 'Kolom id_cpl, id_cpmk, id_mk, id_tahun wajib diisi.' });
        }
        const insertId = await PetaPemenuhanCpl2B3.create({ id_cpl, id_cpmk, id_mk, id_tahun });
        res.status(201).json({ success: true, message: 'Data 2B3 berhasil ditambahkan.', data: { id_2b3: insertId, ...req.body } });
    } catch (error) {
        console.error('[Error POST 2B3]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data 2B3.', error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_cpl, id_cpmk, id_mk, id_tahun } = req.body;
        const checkData = await PetaPemenuhanCpl2B3.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data 2B3 tidak ditemukan.' });
        await PetaPemenuhanCpl2B3.update(id, { id_cpl, id_cpmk, id_mk, id_tahun });
        res.json({ success: true, message: 'Data 2B3 berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT 2B3]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data 2B3.', error: error.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await PetaPemenuhanCpl2B3.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data 2B3 tidak ditemukan.' });
        await PetaPemenuhanCpl2B3.hardDelete(id);
        res.json({ success: true, message: 'Data 2B3 berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE 2B3]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data 2B3.', error: error.message });
    }
};
