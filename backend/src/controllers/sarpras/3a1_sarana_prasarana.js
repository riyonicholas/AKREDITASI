const Model3a1 = require('../../models/sarpras/3a1_sarana_prasarana');
const ExcelJS = require('exceljs');

const controller3a1 = {
    // Menampilkan data aktif
    index: async (req, res) => {
        try {
            const { id_prodi } = req.query;
            const data = await Model3a1.findAll(id_prodi);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // Menampilkan sampah
    trash: async (req, res) => {
        try {
            const { id_prodi } = req.query;
            const data = await Model3a1.findTrash(id_prodi);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            await Model3a1.create({ ...req.body, created_by: req.user.id_user });
            res.status(201).json({ success: true, message: "Data Sarpras berhasil disimpan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            await Model3a1.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Data Sarpras berhasil diperbarui" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await Model3a1.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke tempat sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model3a1.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await Model3a1.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // EKSPOR EXCEL SESUAI GAMBAR LKPS
    exportExcel: async (req, res) => {
        try {
            const { id_prodi } = req.query;
            const data = await Model3a1.findAll(id_prodi);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('3.A.1 Sarpras');

            // Header Judul
            worksheet.mergeCells('A1:H1');
            const title = worksheet.getCell('A1');
            title.value = 'Tabel 3.A.1 Sarana dan Prasarana Penelitian';
            title.font = { bold: true, size: 12 };
            title.alignment = { horizontal: 'center' };

            // Header Kolom (Grey #BFBFBF)
            const hRow = worksheet.getRow(2);
            hRow.values = ['Nama Prasarana', 'Daya Tampung', 'Luas Ruang (m2)', 'Milik Sendiri (M)/Sewa (W)', 'Berlisensi (L)/Public Domain (P)/Tidak Berlisensi (T)', 'Perangkat', '.....', 'Link Bukti'];
            
            hRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                c.font = { bold: true };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            });

            // Isi Data (Kuning #FFFF00)
            data.forEach((item) => {
                const row = worksheet.addRow([
                    item.nama_prasarana,
                    item.daya_tampung,
                    item.luas_ruang,
                    item.status_milik,
                    item.status_lisensi,
                    item.perangkat,
                    item.info_tambahan,
                    item.link_bukti
                ]);
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            });

            // Keterangan di bawah
            const lastRow = worksheet.lastRow.number + 1;
            worksheet.mergeCells(`A${lastRow}:H${lastRow}`);
            worksheet.getCell(`A${lastRow}`).value = 'Keterangan:';
            worksheet.mergeCells(`A${lastRow+1}:H${lastRow+1}`);
            worksheet.getCell(`A${lastRow+1}`).value = '• Prasarana diisi nama laboratorium';
            worksheet.mergeCells(`A${lastRow+2}:H${lastRow+2}`);
            worksheet.getCell(`A${lastRow+2}`).value = '• Perangkat yang dimiliki diisi perangkat keras, perangkat lunak, bandwidth, device, tool dan lain-lain.';

            // Lebar Kolom
            worksheet.columns = [
                { width: 30 }, { width: 12 }, { width: 12 }, { width: 15 }, 
                { width: 25 }, { width: 25 }, { width: 15 }, { width: 30 }
            ];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Tabel_3A1_Prodi_${id_prodi}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = controller3a1;