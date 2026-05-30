const Model4a1 = require('../../models/sarpras/4a1_sarana_prasarana');
const ExcelJS = require('exceljs');

const controller4a1 = {
    index: async (req, res) => {
        try {
            const data = await Model4a1.findAll(req.query.id_prodi);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const data = await Model4a1.findTrash(req.query.id_prodi);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            await Model4a1.create({ ...req.body, created_by: req.user.id_user });
            res.status(201).json({ success: true, message: "Data Sarpras PkM berhasil disimpan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            await Model4a1.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Data Sarpras PkM berhasil diperbarui" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await Model4a1.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Dipindahkan ke sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model4a1.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await Model4a1.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Hapus permanen berhasil" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    exportExcel: async (req, res) => {
        try {
            const data = await Model4a1.findAll(req.query.id_prodi);
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('4.A.1 Sarpras PkM');

            worksheet.mergeCells('A1:H1');
            worksheet.getCell('A1').value = 'Tabel 4.A.1 Sarana dan Prasarana PkM';
            worksheet.getCell('A1').font = { bold: true, size: 12 };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };

            const hRow = worksheet.getRow(2);
            hRow.values = ['Nama Prasarana', 'Daya Tampung', 'Luas Ruang (m2)', 'Milik Sendiri (M)/ Sewa (W)', 'Berlisensi (L)/ Public Domain (P)/Tidak Berlisensi (T)', 'Perangkat', '.....', 'Link Bukti'];
            hRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                c.font = { bold: true };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            });

            data.forEach(item => {
                const row = worksheet.addRow([item.nama_prasarana, item.daya_tampung, item.luas_ruang, item.status_milik, item.status_lisensi, item.perangkat, item.info_tambahan, item.link_bukti]);
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            });

            worksheet.columns = [{width: 30}, {width: 12}, {width: 12}, {width: 15}, {width: 25}, {width: 25}, {width: 15}, {width: 30}];
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Tabel_4A1_PkM.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = controller4a1;