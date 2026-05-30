const Model1b = require('../../models/tpm/1b_unit_spmi');
const ExcelJS = require('exceljs');

/**
 * Controller Tabel 1.B Unit SPMI dan SDM
 * Versi Gabungan: Fitur Lengkap + Debug Logging
 */
const controller1b = {
    // 1. Ambil data aktif
    index: async (req, res) => {
        try {
            const { id_tahun } = req.query;
            const data = await Model1b.findAll(id_tahun);
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("DEBUG 1B INDEX:", error.message);
            res.status(500).json({ success: false, message: "Kesalahan server saat memuat data." });
        }
    },

    // 2. Ambil data di tempat sampah
    trash: async (req, res) => {
        try {
            const { id_tahun } = req.query;
            const data = await Model1b.findTrash(id_tahun);
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("DEBUG 1B TRASH:", error.message);
            res.status(500).json({ success: false, message: "Gagal memuat tempat sampah." });
        }
    },

    // 3. Simpan data baru
    store: async (req, res) => {
        try {
            await Model1b.create({ ...req.body, created_by: req.user.id_user });
            res.status(201).json({ success: true, message: "Data SPMI berhasil disimpan" });
        } catch (error) {
            console.error("DEBUG 1B STORE:", error.message);
            res.status(500).json({ success: false, message: "Gagal menyimpan data." });
        }
    },

    // 4. Update data
    update: async (req, res) => {
        try {
            await Model1b.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Data SPMI berhasil diperbarui" });
        } catch (error) {
            console.error("DEBUG 1B UPDATE:", error.message);
            res.status(500).json({ success: false, message: "Gagal memperbarui data." });
        }
    },

    // 5. Buang ke sampah (Soft Delete)
    destroy: async (req, res) => {
        try {
            await Model1b.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke sampah" });
        } catch (error) {
            console.error("DEBUG 1B DESTROY:", error.message);
            res.status(500).json({ success: false, message: "Gagal menghapus data." });
        }
    },

    // 6. Pulihkan data
    restore: async (req, res) => {
        try {
            await Model1b.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) {
            console.error("DEBUG 1B RESTORE:", error.message);
            res.status(500).json({ success: false, message: "Gagal memulihkan data." });
        }
    },

    // 7. Hapus Permanen
    hardDestroy: async (req, res) => {
        try {
            await Model1b.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen" });
        } catch (error) {
            console.error("DEBUG 1B HARD_DESTROY:", error.message);
            res.status(500).json({ success: false, message: "Gagal menghapus permanen." });
        }
    },

    // 8. Ekspor ke Excel (Format LKPS)
    exportExcel: async (req, res) => {
        try {
            const { id_tahun } = req.query;
            const data = await Model1b.findAll(id_tahun);
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('1.B SPMI');

            // Header Judul & Tabel
            worksheet.mergeCells('A1:I1');
            worksheet.getCell('A1').value = 'Tabel 1.B Tabel Unit SPMI dan SDM';
            worksheet.getRow(2).values = [
                'Unit SPMI', 'Nama Unit SPMI', 'Dokumen SPMI', 
                'Jumlah Auditor Mutu Internal', 'Certified', 'Non Certified', 
                'Frekuensi audit/monev per tahun', 'Bukti Certified Auditor', 'Laporan Audit'
            ];

            // Isi Data
            data.forEach((item) => {
                worksheet.addRow([
                    item.jenis_unit, // <--- Sekarang ambil langsung dari database (PT/UPPS)
                    item.nama_unit,
                    item.dokumen_spmi,
                    item.jumlah_auditor,
                    item.auditor_certified,
                    item.auditor_non_certified,
                    item.frekuensi_audit,
                    item.bukti_certified_auditor,
                    item.laporan_audit
                ]);
            });

            // Styling (Kuning & Border)
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 2) {
                    row.eachCell(cell => {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    });
                }
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Tabel_1B_SPMI.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = controller1b;