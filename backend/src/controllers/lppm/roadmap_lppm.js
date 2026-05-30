const ModelRoadmap = require('../../models/lppm/roadmap_lppm');

const roadmapController = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await ModelRoadmap.findAllRange(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await ModelRoadmap.findTrash(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            await ModelRoadmap.create(req.body, req.user.id_user);
            res.status(201).json({ success: true, message: "Dokumen Roadmap berhasil ditambahkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            await ModelRoadmap.update(req.params.id, req.body, req.user.id_user);
            res.status(200).json({ success: true, message: "Dokumen Roadmap berhasil diperbarui" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await ModelRoadmap.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke tempat sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await ModelRoadmap.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await ModelRoadmap.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen dari database" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    getItems: async (req, res) => {
        try {
            const data = await ModelRoadmap.getItems(req.params.id);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    }
};

module.exports = roadmapController;
