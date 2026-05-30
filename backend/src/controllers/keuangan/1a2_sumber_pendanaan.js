const Model1a2 = require('../../models/keuangan/1a2_sumber_pendanaan');
const ExcelJS = require('exceljs');

/**
 * Controller Tabel 1.A.2 Sumber Pendanaan UPPS/PS
 * Mendukung Full CRUD + Soft Delete & Export Excel LKPS
 */
const controller1a2 = {
    // 1. Menampilkan data aktif (pivoted logic biasanya di handle frontend atau excel)
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await Model1a2.findAllRange(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // 2. Menampilkan data di tempat sampah
    trash: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await Model1a2.findTrash(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // 3. Simpan data baru
    store: async (req, res) => {
        try {
            await Model1a2.create({ ...req.body, created_by: req.user.id_user });
            res.status(201).json({ success: true, message: "Sumber pendanaan berhasil disimpan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // 4. Update data
    update: async (req, res) => {
        try {
            await Model1a2.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Data berhasil diperbarui" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // 5. Hapus sementara (Soft Delete)
    destroy: async (req, res) => {
        try {
            await Model1a2.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke tempat sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // 6. Pulihkan data
    restore: async (req, res) => {
        try {
            await Model1a2.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // 7. Hapus Permanen
    hardDestroy: async (req, res) => {
        try {
            await Model1a2.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen dari database" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    // 8. Ekspor Excel sesuai standar LKPS (Pivoted Horizontal)
    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const targetTS = parseInt(id_tahun);
            const rawData = await Model1a2.findAllRange(id_prodi, targetTS);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('1.A.2');

            // Header Judul Utama
            worksheet.mergeCells('A1:E1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = 'Tabel 1.A.2 Sumber Pendanaan UPPS/PS';
            titleCell.font = { bold: true, size: 12 };
            titleCell.alignment = { horizontal: 'center' };

            // Header Kolom (Warna Abu-abu sesuai LKPS)
            const headerRow = worksheet.getRow(2);
            headerRow.values = [
                'Sumber Pendanaan', 
                `TS-2 (${targetTS - 2})`, 
                `TS-1 (${targetTS - 1})`, 
                `TS (${targetTS})`, 
                'Link Bukti'
            ];

            headerRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                c.font = { bold: true };
                c.border = { 
                    top: { style: 'thin' }, left: { style: 'thin' }, 
                    bottom: { style: 'thin' }, right: { style: 'thin' } 
                };
                c.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Logika Pivot: Mengelompokkan data berdasarkan Nama Sumber secara horizontal
            const pivotData = {};
            rawData.forEach(item => {
                if (!pivotData[item.nama_sumber]) {
                    pivotData[item.nama_sumber] = { ts2: 0, ts1: 0, ts: 0, link: item.link_bukti };
                }
                if (item.id_tahun == targetTS) pivotData[item.nama_sumber].ts = item.jumlah_dana;
                else if (item.id_tahun == targetTS - 1) pivotData[item.nama_sumber].ts1 = item.jumlah_dana;
                else if (item.id_tahun == targetTS - 2) pivotData[item.nama_sumber].ts2 = item.jumlah_dana;
            });

            // Memasukkan data ke baris (Warna Kuning sesuai LKPS)
            Object.keys(pivotData).forEach(sumber => {
                const row = worksheet.addRow([
                    sumber,
                    pivotData[sumber].ts2,
                    pivotData[sumber].ts1,
                    pivotData[sumber].ts,
                    pivotData[sumber].link
                ]);

                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    c.border = { 
                        top: { style: 'thin' }, left: { style: 'thin' }, 
                        bottom: { style: 'thin' }, right: { style: 'thin' } 
                    };
                    c.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            });

            // Footer Keterangan
            const footerIndex = worksheet.lastRow.number + 1;
            worksheet.mergeCells(`A${footerIndex}:E${footerIndex}`);
            const footerCell = worksheet.getCell(`A${footerIndex}`);
            footerCell.value = 'Keterangan: Data ditulis dalam jutaan rupiah';
            footerCell.font = { italic: true, size: 9 };

            // Penyesuaian Lebar Kolom
            worksheet.columns = [
                { width: 35 }, { width: 15 }, { width: 15 }, 
                { width: 15 }, { width: 35 }
            ];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=LKPS_1A2_Prodi_${id_prodi}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = controller1a2;