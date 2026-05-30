const CPMK = require('../../models/prodi/cpmk');
const Prodi = require('../../models/master/prodi');

const getAutoProdiId = async (req) => {
    if (req.user.nama_unit === 'ADMIN') return req.query.id_prodi || req.body.id_prodi;
    const prodi = await Prodi.getByUnit(req.user.id_unit);
    return prodi ? prodi.id_prodi : null;
};

exports.index = async (req, res) => {
    try {
        const id_prodi = await getAutoProdiId(req);
        const data = await CPMK.getAll(id_prodi);
        res.json({ success: true, message: 'Berhasil mengambil data CPMK.', data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.show = async (req, res) => {
    try {
        const data = await CPMK.getById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
        if (req.user.nama_unit !== 'ADMIN') {
            const userProdi = await Prodi.getByUnit(req.user.id_unit);
            if (data.id_prodi !== userProdi.id_prodi) return res.status(403).json({ success: false, message: 'Bukan wewenang prodi Anda.' });
        }
        res.json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.store = async (req, res) => {
    try {
        const id_prodi = await getAutoProdiId(req);
        if (!id_prodi) return res.status(400).json({ success: false, message: 'ID Prodi tidak teridentifikasi.' });
        const { deskripsi_cpmk } = req.body;
        const insertId = await CPMK.create({ id_prodi, deskripsi_cpmk });
        res.status(201).json({ success: true, message: 'CPMK ditambahkan.', id: insertId });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await CPMK.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
        const id_prodi = await getAutoProdiId(req);
        if (req.user.nama_unit !== 'ADMIN' && checkData.id_prodi !== id_prodi) return res.status(403).json({ success: false, message: 'Bukan wewenang prodi Anda.' });
        const { deskripsi_cpmk } = req.body;
        await CPMK.update(id, { id_prodi, deskripsi_cpmk });
        res.json({ success: true, message: 'Data diperbarui.' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await CPMK.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
        if (req.user.nama_unit !== 'ADMIN') {
            const userProdi = await Prodi.getByUnit(req.user.id_unit);
            if (checkData.id_prodi !== userProdi.id_prodi) return res.status(403).json({ success: false, message: 'Bukan wewenang prodi Anda.' });
        }
        await CPMK.hardDelete(id);
        res.json({ success: true, message: 'Data dihapus.' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
