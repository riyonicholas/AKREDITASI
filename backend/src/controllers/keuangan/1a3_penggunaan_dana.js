const Model1a3 = require('../../models/keuangan/1a3_penggunaan_dana');
const ExcelJS = require('exceljs');

const controller1a3 = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await Model1a3.findAllRange(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await Model1a3.findTrash(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            await Model1a3.create({ ...req.body, created_by: req.user.id_user });
            res.status(201).json({ success: true, message: "Penggunaan dana berhasil disimpan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            await Model1a3.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Data berhasil diperbarui" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await Model1a3.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Berhasil dipindahkan ke sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model1a3.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await Model1a3.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Dihapus permanen" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const targetTS = parseInt(id_tahun);
            const rawData = await Model1a3.findAllRange(id_prodi, targetTS);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('1.A.3');

            // 1. Judul Utama
            worksheet.mergeCells('A1:E1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = 'Tabel 1.A.3 Penggunaan Dana UPPS/PS';
            titleCell.font = { bold: true, size: 12 };
            titleCell.alignment = { horizontal: 'center' };

            // 2. Header Kolom (Warna Abu-abu #BFBFBF)
            const headerRow = worksheet.getRow(2);
            headerRow.values = ['Penggunaan Dana', `TS-2 (${targetTS - 2})`, `TS-1 (${targetTS - 1})`, `TS (${targetTS})`, 'Link Bukti'];
            headerRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                c.font = { bold: true };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                c.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // 3. Logika Pivot Horizontal
            const pivotData = {};
            rawData.forEach(item => {
                if (!pivotData[item.nama_penggunaan]) {
                    pivotData[item.nama_penggunaan] = { ts2: 0, ts1: 0, ts: 0, link: item.link_bukti };
                }
                if (item.id_tahun == targetTS) pivotData[item.nama_penggunaan].ts = item.jumlah_dana;
                else if (item.id_tahun == targetTS - 1) pivotData[item.nama_penggunaan].ts1 = item.jumlah_dana;
                else if (item.id_tahun == targetTS - 2) pivotData[item.nama_penggunaan].ts2 = item.jumlah_dana;
            });

            // 4. Masukkan Data ke Baris (Warna Kuning #FFFF00)
            Object.keys(pivotData).forEach(nama => {
                const row = worksheet.addRow([nama, pivotData[nama].ts2, pivotData[nama].ts1, pivotData[nama].ts, pivotData[nama].link]);
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            });

            // Footer Keterangan
            const lastRow = worksheet.lastRow.number + 1;
            worksheet.mergeCells(`A${lastRow}:E${lastRow}`);
            worksheet.getCell(`A${lastRow}`).value = 'Keterangan: Data ditulis dalam jutaan rupiah';
            worksheet.getCell(`A${lastRow}`).font = { italic: true, size: 9 };

            worksheet.columns = [{width: 35}, {width: 15}, {width: 15}, {width: 15}, {width: 35}];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Tabel_1A3_Prodi_${id_prodi}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = controller1a3;