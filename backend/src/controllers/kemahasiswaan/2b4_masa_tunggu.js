const Model2b4 = require('../../models/kemahasiswaan/2b4_masa_tunggu');
const ExcelJS = require('exceljs');

const controller2b4 = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await Model2b4.findAllRange(id_prodi, id_tahun);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const data = await Model2b4.findTrash(req.query.id_prodi);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const [result] = await Model2b4.create({ ...req.body, created_by: req.user.id_user });
            res.status(201).json({ 
                success: true, 
                message: "Data Populasi Alumni (2.B.4) berhasil disimpan",
                id_2b4: result.insertId 
            });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            await Model2b4.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Data Populasi (2.B.4) diperbarui" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await Model2b4.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model2b4.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await Model2b4.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    /**
     * PRECISION EXCEL EXPORT 2.B.4
     * Mengikuti standar LKPS (Grey Header, Yellow Data, Bottom Summary)
     */
    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const targetTS = parseInt(id_tahun);
            const rawData = await Model2b4.findAllRange(id_prodi, targetTS);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('2.B.4');

            // Set Lebar Kolom
            worksheet.columns = [
                { width: 20 }, { width: 25 }, { width: 30 }, { width: 30 }
            ];

            // 1. Judul Tabel
            worksheet.mergeCells('A1:D1');
            const title = worksheet.getCell('A1');
            title.value = 'Tabel 2.B.4 Rata-rata Masa Tunggu Lulusan untuk Bekerja Pertama Kali';
            title.font = { bold: true, size: 12 };
            title.alignment = { horizontal: 'center' };

            // 2. Header (Warna Abu-abu #BFBFBF)
            const hRow = worksheet.getRow(2);
            hRow.values = ['Tahun Lulus', 'Jumlah Lulusan', 'Jumlah Lulusan yang Terlacak', 'Rata-rata Waktu Tunggu (Bulan)'];
            hRow.height = 30;
            
            hRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                c.font = { bold: true };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            });

            // 3. Mapping Data (Harus urut TS-2, TS-1, TS)
            let totalLulusan = 0;
            let totalTerlacak = 0;
            let totalTunggu = 0;
            let countTunggu = 0;

            const years = [targetTS - 2, targetTS - 1, targetTS];
            years.forEach((y, i) => {
                const found = rawData.find(d => d.id_tahun == y) || { jumlah_lulusan: 0, jumlah_terlacak: 0, rata_tunggu: 0 };
                const label = i === 0 ? `TS-2 (${y})` : i === 1 ? `TS-1 (${y})` : `TS (${y})`;
                
                const row = worksheet.addRow([label, found.jumlah_lulusan, found.jumlah_terlacak, found.rata_tunggu]);
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center' };
                });

                totalLulusan += parseFloat(found.jumlah_lulusan || 0);
                totalTerlacak += parseFloat(found.jumlah_terlacak || 0);
                if(found.rata_tunggu > 0) {
                    totalTunggu += parseFloat(found.rata_tunggu);
                    countTunggu++;
                }
            });

            // 4. Baris Jumlah / Rata-rata
            const avgTunggu = countTunggu > 0 ? (totalTunggu / countTunggu).toFixed(2) : 0;
            const summaryRow = worksheet.addRow(['Jumlah', totalLulusan, totalTerlacak, avgTunggu]);
            summaryRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                c.font = { bold: true };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                c.alignment = { horizontal: 'center' };
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=LKPS_Tabel_2B4.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = controller2b4;