const Model1a5 = require('../../models/kepegawaian/1a5_tendik');
const ExcelJS = require('exceljs');

/**
 * Controller 1.A.5 - Mode Live Data (Precision Export)
 */
const controller1a5 = {
    index: async (req, res) => {
        try {
            const summary = await Model1a5.findGlobalSummary();
            res.json({ success: true, summary });
        } catch (error) { 
            res.status(500).json({ success: false, message: error.message }); 
        }
    },

    exportExcel: async (req, res) => {
        try {
            const data = await Model1a5.findGlobalSummary();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('1.A.5');

            // 1. Set Lebar Kolom
            worksheet.columns = [
                { width: 5 }, { width: 30 }, // No, Jenis
                { width: 6 }, { width: 6 }, { width: 6 }, { width: 6 }, // S3 - D4
                { width: 6 }, { width: 6 }, { width: 6 }, { width: 15 }, // D3 - SMA
                { width: 30 } // Unit Kerja
            ];

            // 2. Judul Tabel
            worksheet.mergeCells('A1:K1');
            const title = worksheet.getCell('A1');
            title.value = 'Tabel 1.A.5 Kualifikasi Tenaga Kependidikan';
            title.font = { bold: true, size: 12 };
            title.alignment = { horizontal: 'center' };

            // 3. Header Bertingkat (Row 2 & 3)
            worksheet.mergeCells('A2:A3'); worksheet.getCell('A2').value = 'No.';
            worksheet.mergeCells('B2:B3'); worksheet.getCell('B2').value = 'Jenis Tenaga Kependidikan';
            worksheet.mergeCells('C2:J2'); worksheet.getCell('C2').value = 'Jumlah Tenaga Kependidikan dengan Pendidikan Terakhir';
            worksheet.mergeCells('K2:K3'); worksheet.getCell('K2').value = 'Unit Kerja';

            worksheet.getRow(3).values = ['', '', 'S3', 'S2', 'S1', 'D4', 'D3', 'D2', 'D1', 'SMA/SMK/MA', ''];

            // Styling Header (Grey #BFBFBF)
            const greyFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            [2, 3].forEach(r => {
                worksheet.getRow(r).eachCell(c => {
                    c.fill = greyFill;
                    c.font = { bold: true };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            });

            // 4. Mapping Data (Harus muncul 4 baris tetap)
            const categories = ['Pustakawan *)', 'Laboran/Teknisi', 'Administrasi', 'Lainnya'];
            const yellowFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            
            let totals = { s3:0, s2:0, s1:0, d4:0, d3:0, d2:0, d1:0, sma:0 };
            
            categories.forEach((catName, idx) => {
                const cleanCat = catName.replace(' *)', '');
                const found = data.find(d => d.jenis.includes(cleanCat)) || {};
                
                const rowValues = [
                    idx + 1 + '.', 
                    catName,
                    found.s3 || 0, found.s2 || 0, found.s1 || 0, found.d4 || 0,
                    found.d3 || 0, found.d2 || 0, found.d1 || 0, found.sma || 0,
                    found.unit_kerja || ''
                ];

                const r = worksheet.addRow(rowValues);
                r.eachCell(c => {
                    c.fill = yellowFill;
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center', vertical: 'middle' };
                });

                // Update Totals
                totals.s3 += (found.s3 || 0); totals.s2 += (found.s2 || 0);
                totals.s1 += (found.s1 || 0); totals.d4 += (found.d4 || 0);
                totals.d3 += (found.d3 || 0); totals.d2 += (found.d2 || 0);
                totals.d1 += (found.d1 || 0); totals.sma += (found.sma || 0);
            });

            // 5. Baris Total
            worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:B${worksheet.lastRow.number + 1}`);
            const totalRowIdx = worksheet.lastRow.number;
            worksheet.getCell(`A${totalRowIdx}`).value = 'Total';
            worksheet.getRow(totalRowIdx).values = [
                'Total', '', 
                totals.s3, totals.s2, totals.s1, totals.d4, 
                totals.d3, totals.d2, totals.d1, totals.sma, ''
            ];
            
            worksheet.getRow(totalRowIdx).eachCell(c => {
                c.fill = yellowFill;
                c.font = { bold: true };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                c.alignment = { horizontal: 'center' };
            });

            // 6. Footnote
            const noteRow = worksheet.lastRow.number + 1;
            worksheet.getCell(`A${noteRow}`).value = 'Keterangan :';
            worksheet.getCell(`A${noteRow + 1}`).value = '*) Pustakawan adalah staf perpustakaan yang memiliki ijazah atau sertifikat kompetensi pada bidang ilmu perpustakaan.';

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=LKPS_1A5_Precision.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = controller1a5;