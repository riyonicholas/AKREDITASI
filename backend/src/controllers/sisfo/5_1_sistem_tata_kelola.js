const Model51 = require('../../models/sisfo/5_1_sistem_tata_kelola');
const db = require('../../config/db');

const Controller51 = {
    index: async (req, res) => {
        try {
            const data = await Model51.getAll();
            const [units] = await db.execute("SELECT id_unit, nama_unit FROM unit_kerja ORDER BY nama_unit ASC");
            res.status(200).json({ success: true, data, units });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    show: async (req, res) => {
        try {
            const data = await Model51.findById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const data = await Model51.findTrash();
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const [result] = await Model51.create({ ...req.body, created_by: req.user.id_user });
            res.status(201).json({ success: true, message: "Data berhasil disimpan oleh Unit SISFO", id_5_1: result.insertId });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            await Model51.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Data berhasil diperbarui oleh Unit SISFO" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await Model51.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model51.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await Model51.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus secara permanen" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    exportExcel: async (req, res) => {
        try {
            const data = await Model51.getAll();
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Tabel 5.1');
            worksheet.columns = [
                { header: 'No', key: 'no', width: 5 },
                { header: 'Jenis Tata Kelola', key: 'jenis', width: 25 },
                { header: 'Nama Sistem Informasi', key: 'nama', width: 40 },
                { header: 'Akses', key: 'akses', width: 15 },
                { header: 'Unit Pengelola', key: 'unit', width: 25 },
                { header: 'Link Bukti', key: 'link', width: 40 }
            ];
            worksheet.getRow(1).font = { bold: true };
            data.forEach((r, idx) => {
                worksheet.addRow({ no: idx + 1, jenis: r.jenis_tata_kelola, nama: r.nama_sistem, akses: r.akses, unit: r.nama_unit || '-', link: r.link_bukti });
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Tabel_5_1_SISFO.xlsx');
            await workbook.xlsx.write(res); res.end();
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    }
};

module.exports = Controller51;
