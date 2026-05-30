const IsiPembelajaran2B1 = require('../../models/prodi/2b1_isi_pembelajaran');

exports.index = async (req, res) => {
    try {
        const { id_prodi, id_tahun } = req.query;
        const data = await IsiPembelajaran2B1.getAll(id_prodi, id_tahun);
        res.json({ success: true, message: 'Berhasil mengambil data tabel 2B1.', data });
    } catch (error) {
        console.error('[Error GET 2B1]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data 2B1.', error: error.message });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await IsiPembelajaran2B1.getById(id);
        if (!data) return res.status(404).json({ success: false, message: 'Data 2B1 tidak ditemukan.' });
        res.json({ success: true, message: 'Berhasil mengambil detail data 2B1.', data });
    } catch (error) {
        console.error('[Error GET 2B1 By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data 2B1.', error: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { id_mk, id_pl, id_tahun } = req.body;
        if (!id_mk || !id_pl || !id_tahun) {
            return res.status(400).json({ success: false, message: 'Kolom id_mk, id_pl, id_tahun wajib diisi.' });
        }
        const insertId = await IsiPembelajaran2B1.create({ id_mk, id_pl, id_tahun });
        res.status(201).json({ success: true, message: 'Data 2B1 berhasil ditambahkan.', data: { id_2b1: insertId, ...req.body } });
    } catch (error) {
        console.error('[Error POST 2B1]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data 2B1.', error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_mk, id_pl, id_tahun } = req.body;
        const checkData = await IsiPembelajaran2B1.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data 2B1 tidak ditemukan.' });
        await IsiPembelajaran2B1.update(id, { id_mk, id_pl, id_tahun });
        res.json({ success: true, message: 'Data 2B1 berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT 2B1]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data 2B1.', error: error.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await IsiPembelajaran2B1.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data 2B1 tidak ditemukan.' });
        await IsiPembelajaran2B1.hardDelete(id);
        res.json({ success: true, message: 'Data 2B1 berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE 2B1]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data 2B1.', error: error.message });
    }
};
