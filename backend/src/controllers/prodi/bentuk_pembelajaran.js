const ModelBentuk = require('../../models/prodi/bentuk_pembelajaran');

const controllerBentuk = {
    index: async (req, res) => {
        try {
            const data = await ModelBentuk.findAll();
            res.status(200).json({ success: true, data });
        } catch (error) { 
            console.error('[Backend Error - GET Master Bentuk]:', error.message);
            res.status(500).json({ success: false, message: error.message, data: [] }); 
        }
    },

    show: async (req, res) => {
        try {
            const data = await ModelBentuk.findById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const [result] = await ModelBentuk.create({ ...req.body });
            res.status(201).json({ 
                success: true, 
                message: "Master Bentuk Pembelajaran ditambahkan",
                id_bentuk: result.insertId
            });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            await ModelBentuk.update(req.params.id, { ...req.body });
            res.status(200).json({ success: true, message: "Master Bentuk Pembelajaran diperbarui" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await ModelBentuk.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Master Bentuk Pembelajaran dihapus permanen" });
        } catch (error) { 
            console.error('[Backend Error - DELETE Master Bentuk]:', error.message);
            res.status(500).json({ 
                success: false, 
                message: "Gagal menghapus! Data ini mungkin sedang digunakan di tabel lain (2.C). Error: " + error.message 
            }); 
        }
    }
};

module.exports = controllerBentuk;
