const PemetaanCplPl2B2 = require('../../models/prodi/2b2_pemetaan_cpl_pl');

exports.index = async (req, res) => {
    try {
        const { id_prodi, id_tahun } = req.query;
        const data = await PemetaanCplPl2B2.getAll(id_prodi, id_tahun);
        res.json({ success: true, message: 'Berhasil mengambil data tabel 2B2.', data });
    } catch (error) {
        console.error('[Error GET 2B2]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data 2B2.', error: error.message });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PemetaanCplPl2B2.getById(id);
        if (!data) return res.status(404).json({ success: false, message: 'Data 2B2 tidak ditemukan.' });
        res.json({ success: true, message: 'Berhasil mengambil detail data 2B2.', data });
    } catch (error) {
        console.error('[Error GET 2B2 By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data 2B2.', error: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { id_cpl, id_pl, id_tahun } = req.body;
        if (!id_cpl || !id_pl || !id_tahun) {
            return res.status(400).json({ success: false, message: 'Kolom id_cpl, id_pl, id_tahun wajib diisi.' });
        }
        const insertId = await PemetaanCplPl2B2.create({ id_cpl, id_pl, id_tahun });
        res.status(201).json({ success: true, message: 'Data 2B2 berhasil ditambahkan.', data: { id_2b2: insertId, ...req.body } });
    } catch (error) {
        console.error('[Error POST 2B2]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data 2B2.', error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_cpl, id_pl, id_tahun } = req.body;
        const checkData = await PemetaanCplPl2B2.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data 2B2 tidak ditemukan.' });
        await PemetaanCplPl2B2.update(id, { id_cpl, id_pl, id_tahun });
        res.json({ success: true, message: 'Data 2B2 berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT 2B2]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data 2B2.', error: error.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await PemetaanCplPl2B2.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data 2B2 tidak ditemukan.' });
        await PemetaanCplPl2B2.hardDelete(id);
        res.json({ success: true, message: 'Data 2B2 berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE 2B2]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data 2B2.', error: error.message });
    }
};
