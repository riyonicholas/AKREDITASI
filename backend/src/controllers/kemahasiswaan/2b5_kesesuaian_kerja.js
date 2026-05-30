const Model2b5 = require('../../models/kemahasiswaan/2b5_kesesuaian_kerja');
const db = require('../../config/db');
const ExcelJS = require('exceljs');

/**
 * Controller 2.B.5 - Kesesuaian Bidang Kerja Lulusan
 * Perbaikan: Ekspor Excel Presisi Tinggi dengan Merging Header Vertikal & Horizontal
 */
const controller2b5 = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await Model2b5.findAllRange(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const { id_2b4, profesi_infokom, profesi_non_infokom, lingkup_multinasional, lingkup_nasional, lingkup_wirausaha } = req.body;
            const [master] = await db.execute("SELECT jumlah_terlacak FROM `2b4_masa_tunggu` WHERE id_2b4 = ?", [id_2b4]);
            if (!master.length) return res.status(404).json({ success: false, message: "Data Master 2.B.4 tidak ditemukan" });

            const terlacak = parseInt(master[0].jumlah_terlacak);
            const sumProfesi = parseInt(profesi_infokom || 0) + parseInt(profesi_non_infokom || 0);
            const sumLingkup = parseInt(lingkup_multinasional || 0) + parseInt(lingkup_nasional || 0) + parseInt(lingkup_wirausaha || 0);

            if (sumProfesi !== terlacak || sumLingkup !== terlacak) {
                return res.status(400).json({ success: false, message: `Data tidak balance! Harus berjumlah ${terlacak} sesuai data terlacak.` });
            }
            await Model2b5.create({ ...req.body, created_by: req.user.id_user });
            res.status(201).json({ success: true, message: "Data 2.B.5 Berhasil Disimpan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            const { profesi_infokom, profesi_non_infokom, lingkup_multinasional, lingkup_nasional, lingkup_wirausaha } = req.body;
            const [current] = await db.execute("SELECT id_2b4 FROM `2b5_kesesuaian_kerja` WHERE id_2b5 = ?", [req.params.id]);
            const [master] = await db.execute("SELECT jumlah_terlacak FROM `2b4_masa_tunggu` WHERE id_2b4 = ?", [current[0].id_2b4]);
            const terlacak = parseInt(master[0].jumlah_terlacak);
            if ((parseInt(profesi_infokom) + parseInt(profesi_non_infokom)) !== terlacak) {
                return res.status(400).json({ success: false, message: `Data profesi tidak balance! Harus total ${terlacak}.` });
            }
            await Model2b5.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Update Data Valid & Tersimpan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await Model2b5.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model2b5.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await Model2b5.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const data = await Model2b5.findTrash(req.query.id_prodi);
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    /**
     * PRECISION EXCEL EXPORT (FIXED HEADER & MERGING)
     * Memastikan header vertikal (Row 2-3) menyatu sempurna sesuai gambar LKPS.
     */
    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const targetTS = parseInt(id_tahun);
            const rawData = await Model2b5.findAllRange(id_prodi, targetTS);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('2.B.5');

            // 1. Set Kolom & Lebar
            worksheet.columns = [
                { width: 15, key: 'tahun' },
                { width: 15, key: 'lulusan' },
                { width: 22, key: 'terlacak' },
                { width: 15, key: 'info' },
                { width: 15, key: 'non' },
                { width: 20, key: 'multi' },
                { width: 15, key: 'nas' },
                { width: 15, key: 'wira' }
            ];

            // 2. Judul Utama
            worksheet.mergeCells('A1:H1');
            const title = worksheet.getCell('A1');
            title.value = 'Tabel 2.B.5. Kesesuaian Bidang Kerja Lulusan';
            title.font = { bold: true, size: 12 };
            title.alignment = { horizontal: 'center', vertical: 'middle' };

            // 3. Header Bertingkat (Logic Merging Presisi)
            // Vertikal Merge (Baris 2 ke Baris 3)
            const vMerge = ['A', 'B', 'C', 'D', 'E'];
            vMerge.forEach(col => {
                worksheet.mergeCells(`${col}2:${col}3`);
            });

            // Set Nilai Header Baris 2
            worksheet.getCell('A2').value = 'Tahun Lulus';
            worksheet.getCell('B2').value = 'Jumlah Lulusan';
            worksheet.getCell('C2').value = 'Jumlah Lulusan yang Terlacak';
            worksheet.getCell('D2').value = 'Profesi Kerja Bidang Infokom';
            worksheet.getCell('E2').value = 'Profesi Kerja Bidang NON Infokom';
            
            // Horizontal Merge (Lingkup Tempat Kerja)
            worksheet.mergeCells('F2:H2');
            worksheet.getCell('F2').value = 'Lingkup Tempat Kerja';

            // Sub-header Baris 3 (Hanya untuk kolom yang di-merge horizontal)
            worksheet.getCell('F3').value = 'Multinasional/ Internasional';
            worksheet.getCell('G3').value = 'Nasional';
            worksheet.getCell('H3').value = 'Wirausaha';

            // Styling Header (Grey #BFBFBF + Bold + Borders)
            for (let r = 2; r <= 3; r++) {
                const row = worksheet.getRow(r);
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                    cell.font = { bold: true, size: 10 };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                });
            }

            // 4. Data (TS-2, TS-1, TS)
            let sums = { l: 0, t: 0, i: 0, ni: 0, m: 0, na: 0, w: 0 };
            const years = [targetTS - 2, targetTS - 1, targetTS];

            years.forEach((y, index) => {
                const d = rawData.find(x => parseInt(x.id_tahun) === y) || { 
                    jumlah_lulusan: 0, jumlah_terlacak: 0, profesi_infokom: 0, 
                    profesi_non_infokom: 0, lingkup_multinasional: 0, 
                    lingkup_nasional: 0, lingkup_wirausaha: 0 
                };

                const label = index === 0 ? 'TS-2' : index === 1 ? 'TS-1' : 'TS';
                const row = worksheet.addRow([
                    label, d.jumlah_lulusan, d.jumlah_terlacak,
                    d.profesi_infokom, d.profesi_non_infokom,
                    d.lingkup_multinasional, d.lingkup_nasional, d.lingkup_wirausaha
                ]);

                row.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });

                sums.l += parseInt(d.jumlah_lulusan); sums.t += parseInt(d.jumlah_terlacak);
                sums.i += parseInt(d.profesi_infokom); sums.ni += parseInt(d.profesi_non_infokom);
                sums.m += parseInt(d.lingkup_multinasional); sums.na += parseInt(d.lingkup_nasional);
                sums.w += parseInt(d.lingkup_wirausaha);
            });

            // 5. Baris Jumlah (Summary)
            const sumRow = worksheet.addRow([
                'Jumlah', sums.l, sums.t, sums.i, sums.ni, sums.m, sums.na, sums.w
            ]);
            sumRow.eachCell((cell) => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Final Response
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=LKPS_Tabel_2B5_Final.xlsx');
            
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) { 
            console.error("Export Error:", error.message);
            res.status(500).send("Gagal mengunduh excel: " + error.message); 
        }
    }
};

module.exports = controller2b5;