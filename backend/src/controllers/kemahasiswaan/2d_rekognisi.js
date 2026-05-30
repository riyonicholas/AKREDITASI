const Model2d = require('../../models/kemahasiswaan/2d_rekognisi');
const ExcelJS = require('exceljs');

/**
 * Controller Tabel 2.D Rekognisi Lulusan
 * Update: Precision LKPS Layout for Excel Export
 */
const controller2d = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const targetTS = parseInt(id_tahun);
            const data = await Model2d.findAllRange(id_prodi, targetTS);
            const grads = await Model2d.getGraduatesCount(id_prodi, targetTS);
            const sources = await Model2d.getRefSources();
            res.status(200).json({ success: true, data, metadata: { graduates: grads, ref_sources: sources } });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            let { id_ref_sumber, nama_sumber_baru, id_prodi, id_tahun, jenis_rekognisi, link_bukti } = req.body;
            if (nama_sumber_baru && nama_sumber_baru.trim() !== "") {
                id_ref_sumber = await Model2d.findOrCreateSource(nama_sumber_baru);
            }
            await Model2d.create({ id_prodi, id_tahun, id_ref_sumber, jenis_rekognisi, link_bukti, created_by: req.user.id_user });
            res.status(201).json({ success: true, message: "Data Rekognisi Berhasil Disimpan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try { const data = await Model2d.findTrash(req.query.id_prodi); res.status(200).json({ success: true, data }); }
        catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try { await Model2d.softDelete(req.params.id, req.user.id_user); res.status(200).json({ success: true, message: "Pindah ke sampah" }); }
        catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try { await Model2d.restore(req.params.id); res.status(200).json({ success: true, message: "Pulihkan data" }); }
        catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try { await Model2d.hardDelete(req.params.id); res.status(200).json({ success: true, message: "Hapus permanen" }); }
        catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    /**
     * PRECISION EXCEL EXPORT (STANDAR LKPS)
     * Memastikan header dan footer identik dengan template fisik.
     */
    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const targetTS = parseInt(id_tahun);
            const rawData = await Model2d.findAllRange(id_prodi, targetTS);
            const grads = await Model2d.getGraduatesCount(id_prodi, targetTS);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('2.D Rekognisi');

            worksheet.columns = [
                { width: 25 }, { width: 50 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 35 }
            ];

            // 1. Judul
            worksheet.mergeCells('A1:F1');
            const title = worksheet.getCell('A1');
            title.value = 'Tabel 2.D Rekognisi dan Apresiasi Kompetensi Lulusan';
            title.font = { bold: true, size: 12 };
            title.alignment = { horizontal: 'center', vertical: 'middle' };

            // 2. Header Bertingkat (Logic Merging Presisi)
            worksheet.mergeCells('A2:A3'); worksheet.getCell('A2').value = 'Sumber Rekognisi';
            worksheet.mergeCells('B2:B3'); worksheet.getCell('B2').value = 'Jenis Pengakuan Lulusan (Rekognisi)';
            worksheet.mergeCells('C2:E2'); worksheet.getCell('C2').value = 'Tahun Akademik';
            worksheet.mergeCells('F2:F3'); worksheet.getCell('F2').value = 'Link Bukti';
            
            // Sub-header Baris 3
            worksheet.getCell('C3').value = `TS-2 (${targetTS-2})`;
            worksheet.getCell('D3').value = `TS-1 (${targetTS-1})`;
            worksheet.getCell('E3').value = `TS (${targetTS})`;

            // Styling Header (Grey #BFBFBF)
            const greyFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            for (let r = 2; r <= 3; r++) {
                worksheet.getRow(r).eachCell({ includeEmpty: true }, c => {
                    c.fill = greyFill; c.font = { bold: true, size: 10 };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                });
            }

            // 3. Data Rows (Kuning #FFFF00)
            let counts = { ts2: 0, ts1: 0, ts: 0 };
            rawData.forEach(item => {
                const isTS2 = item.id_tahun == targetTS - 2 ? 'V' : '';
                const isTS1 = item.id_tahun == targetTS - 1 ? 'V' : '';
                const isTS = item.id_tahun == targetTS ? 'V' : '';

                if (isTS2) counts.ts2++; if (isTS1) counts.ts1++; if (isTS) counts.ts++;

                const row = worksheet.addRow([item.nama_sumber, item.jenis_rekognisi, isTS2, isTS1, isTS, item.link_bukti]);
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center', vertical: 'middle' };
                });
                // Rata kiri untuk jenis rekognisi
                row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            });

            // 4. Footer Section (Precision Layout)
            const graduatesMap = {}; grads.forEach(g => graduatesMap[g.id_tahun] = g.total);

            const footerData = [
                { label: 'Jumlah Rekognisi', vals: [counts.ts2, counts.ts1, counts.ts] },
                { label: 'Jumlah Lulusan', vals: [graduatesMap[targetTS-2] || 0, graduatesMap[targetTS-1] || 0, graduatesMap[targetTS] || 0] },
                { label: 'Persentase', vals: [
                    ((counts.ts2 / (graduatesMap[targetTS-2] || 1)) * 100).toFixed(2) + '%',
                    ((counts.ts1 / (graduatesMap[targetTS-1] || 1)) * 100).toFixed(2) + '%',
                    ((counts.ts / (graduatesMap[targetTS] || 1)) * 100).toFixed(2) + '%'
                ] }
            ];

            footerData.forEach(f => {
                const row = worksheet.addRow([f.label, '', f.vals[0], f.vals[1], f.vals[2], '']);
                const rowIdx = row.number;
                
                // Merge A & B untuk label
                worksheet.mergeCells(`A${rowIdx}:B${rowIdx}`);
                
                row.eachCell({ includeEmpty: true }, c => {
                    c.fill = greyFill;
                    c.font = { bold: true };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center', vertical: 'middle' };
                });
                worksheet.getCell(`A${rowIdx}`).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=LKPS_Tabel_2D_Rekognisi.xlsx');
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = controller2d;