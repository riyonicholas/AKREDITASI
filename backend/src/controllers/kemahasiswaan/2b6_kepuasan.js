const Model2b6 = require('../../models/kemahasiswaan/2b6_kepuasan');
const ExcelJS = require('exceljs');

/**
 * Controller Tabel 2.B.6 Kepuasan Pengguna Lulusan
 * Perbaikan: Precision Header Merging & Average Calculation
 */
const controller2b6 = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await Model2b6.findAll(id_prodi, id_tahun);
            let metadata = await Model2b6.getMetadata(id_prodi, id_tahun);

            const autoAlumni = await Model2b6.calculateAutoAlumni(id_prodi, id_tahun);
            const autoMhsAktif = await Model2b6.getAutoMhsAktif(id_prodi, id_tahun);

            res.status(200).json({ 
                success: true, 
                data, 
                metadata: metadata || { 
                    jml_alumni_3_tahun: autoAlumni, 
                    jml_mhs_aktif_ts: autoMhsAktif,
                    jml_responden: 0 
                } 
            });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const { id_prodi } = req.query;
            const data = await Model2b6.findTrash(id_prodi);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const { penilaian, metadata } = req.body;
            const id_user = req.user.id_user;

            // Validasi Persentase Baris (Harus 100%)
            if (penilaian && Array.isArray(penilaian)) {
                for (const item of penilaian) {
                    const total = parseFloat(item.sangat_baik || 0) + parseFloat(item.baik || 0) + 
                                  parseFloat(item.cukup || 0) + parseFloat(item.kurang || 0);
                    if (total > 0 && Math.round(total) !== 100) {
                        return res.status(400).json({ 
                            success: false, 
                            message: `Total baris '${item.jenis_kemampuan}' adalah ${total}%. Wajib 100%.` 
                        });
                    }
                    await Model2b6.upsertPenilaian({ ...item, created_by: id_user, updated_by: id_user });
                }
            }

            if (metadata) {
                await Model2b6.upsertMetadata({
                    id_prodi: metadata.id_prodi, id_tahun: metadata.id_tahun,
                    jml_alumni: metadata.jml_alumni_3_tahun, jml_responden: metadata.jml_responden,
                    jml_mhs_aktif: metadata.jml_mhs_aktif_ts
                });
            }
            res.status(201).json({ success: true, message: "Data Berhasil Disinkronkan (Validasi 100% OK)" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await Model2b6.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model2b6.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await Model2b6.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    /**
     * PRECISION EXCEL EXPORT (STANDAR LKPS)
     * Memperbaiki merging header vertikal & horizontal sesuai gambar
     */
    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await Model2b6.findAll(id_prodi, id_tahun);
            const meta = await Model2b6.getMetadata(id_prodi, id_tahun) || {};

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('2.B.6');

            // 1. Set Lebar Kolom
            worksheet.columns = [
                { width: 5 }, { width: 45 }, { width: 12 }, { width: 12 }, 
                { width: 12 }, { width: 12 }, { width: 40 }
            ];

            // 2. Judul Utama
            worksheet.mergeCells('A1:G1');
            const title = worksheet.getCell('A1');
            title.value = 'Tabel 2.B.6. Kepuasan Pengguna Lulusan';
            title.font = { bold: true, size: 12 };
            title.alignment = { horizontal: 'center', vertical: 'middle' };

            // 3. Header Bertingkat (Logic Merging Presisi)
            // Vertikal Merge (Baris 2 ke Baris 3)
            worksheet.mergeCells('A2:A3'); worksheet.getCell('A2').value = 'No';
            worksheet.mergeCells('B2:B3'); worksheet.getCell('B2').value = 'Jenis Kemampuan';
            worksheet.mergeCells('G2:G3'); worksheet.getCell('G2').value = 'Rencana Tindak Lanjut oleh UPPS/PS';
            
            // Horizontal Merge (Tingkat Kepuasan)
            worksheet.mergeCells('C2:F2');
            worksheet.getCell('C2').value = 'Tingkat Kepuasan Pengguna (%)';

            // Sub-header Baris 3
            worksheet.getCell('C3').value = 'Sangat Baik';
            worksheet.getCell('D3').value = 'Baik';
            worksheet.getCell('E3').value = 'Cukup';
            worksheet.getCell('F3').value = 'Kurang';

            // Styling Header Abu-abu (#BFBFBF)
            for (let r = 2; r <= 3; r++) {
                const row = worksheet.getRow(r);
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                    cell.font = { bold: true, size: 10 };
                    cell.border = {
                        top: { style: 'thin' }, left: { style: 'thin' },
                        bottom: { style: 'thin' }, right: { style: 'thin' }
                    };
                    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                });
            }

            // 4. Data Rows (Kuning #FFFF00)
            let sums = { sb: 0, b: 0, c: 0, k: 0 };
            const rowCount = data.length || 1;

            data.forEach((item, i) => {
                const row = worksheet.addRow([
                    i + 1, item.jenis_kemampuan, 
                    parseFloat(item.sangat_baik || 0), parseFloat(item.baik || 0), 
                    parseFloat(item.cukup || 0), parseFloat(item.kurang || 0), 
                    item.rencana_tindak_lanjut
                ]);

                sums.sb += parseFloat(item.sangat_baik || 0);
                sums.b += parseFloat(item.baik || 0);
                sums.c += parseFloat(item.cukup || 0);
                sums.k += parseFloat(item.kurang || 0);

                row.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    cell.border = {
                        top: { style: 'thin' }, left: { style: 'thin' },
                        bottom: { style: 'thin' }, right: { style: 'thin' }
                    };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });
                row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
            });

            // 5. Baris Jumlah (Rata-rata - Background Abu-abu)
            const sumIdx = worksheet.lastRow.number + 1;
            worksheet.mergeCells(`A${sumIdx}:B${sumIdx}`);
            worksheet.getCell(`A${sumIdx}`).value = 'Jumlah';
            
            const avgRow = worksheet.getRow(sumIdx);
            avgRow.getCell(3).value = parseFloat((sums.sb / rowCount).toFixed(2));
            avgRow.getCell(4).value = parseFloat((sums.b / rowCount).toFixed(2));
            avgRow.getCell(5).value = parseFloat((sums.c / rowCount).toFixed(2));
            avgRow.getCell(6).value = parseFloat((sums.k / rowCount).toFixed(2));

            avgRow.eachCell({ includeEmpty: true }, (cell) => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' }, left: { style: 'thin' },
                    bottom: { style: 'thin' }, right: { style: 'thin' }
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // 6. Metadata Footer
            const metaStart = sumIdx + 1;
            const metaItems = [
                ['Jumlah alumni/lulusan dalam 3 tahun terakhir', meta.jml_alumni_3_tahun || 0],
                ['Jumlah pengguna lulusan sebagai responden', meta.jml_responden || 0],
                ['Jumlah mahasiswa aktif pada tahun TS', meta.jml_mhs_aktif_ts || 0]
            ];

            metaItems.forEach((m, i) => {
                const r = metaStart + i;
                worksheet.mergeCells(`A${r}:B${r}`);
                worksheet.getCell(`A${r}`).value = m[0];
                worksheet.getCell(`C${r}`).value = m[1];
                worksheet.getCell(`C${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                worksheet.getCell(`C${r}`).border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                worksheet.getCell(`A${r}`).alignment = { horizontal: 'left' };
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=LKPS_Tabel_2B6_Fixed.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = controller2b6;