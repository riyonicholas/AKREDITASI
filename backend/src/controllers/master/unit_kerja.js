const UnitKerja = require('../../models/master/unit_kerja');

const controllerUnitKerja = {
    index: async (req, res) => {
        try {
            const data = await UnitKerja.getAll();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    show: async (req, res) => {
        try {
            const data = await UnitKerja.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: "Unit tidak ditemukan" });
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    store: async (req, res) => {
        try {
            if (!req.body.nama_unit) return res.status(400).json({ success: false, message: "Nama unit wajib diisi" });
            const id = await UnitKerja.create(req.body);
            res.status(201).json({ success: true, message: "Unit berhasil ditambahkan", id });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            await UnitKerja.update(req.params.id, req.body);
            res.json({ success: true, message: "Unit berhasil diperbarui" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    destroy: async (req, res) => {
        try {
            await UnitKerja.hardDelete(req.params.id);
            res.json({ success: true, message: "Unit berhasil dihapus secara permanen" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = controllerUnitKerja;
