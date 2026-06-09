const Model2a1 = require('../../models/model_2a1');
const ExcelJS = require('exceljs');

// 1. Ambil Data Aktif (Logic Visibility 0 jika ALA hapus data ALA-nya)
exports.getData = async (req, res) => {
    try {
        const [rows] = await Model2a1.getForPMB(req.params.id_prodi);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Simpan Data PMB
exports.store = async (req, res) => {
    try {
        const { id_prodi, id_tahun, daya, pendaftar, p_afirmasi, p_khusus, reg_in, reg_af, reg_ks, rpl_in, rpl_af, rpl_ks, user_id } = req.body;
        await Model2a1.upsertPMB([id_prodi, id_tahun, daya, pendaftar, p_afirmasi, p_khusus, reg_in, reg_af, reg_ks, rpl_in, rpl_af, rpl_ks, user_id]);
        res.json({ success: true, message: "Data PMB Berhasil Disimpan" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Soft Delete PMB
exports.softDelete = async (req, res) => {
    try {
        const { id_2a1, user_id } = req.body;
        await Model2a1.softDeletePMB(id_2a1, user_id);
        res.json({ success: true, message: "Data dipindahkan ke Trash PMB" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. Get Trash PMB
exports.getTrash = async (req, res) => {
    try {
        const [rows] = await Model2a1.getTrashPMB(req.params.id_prodi);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 5. Restore PMB
exports.restore = async (req, res) => {
    try {
        await Model2a1.restorePMB(req.params.id_2a1);
        res.json({ success: true, message: "Data PMB berhasil dikembalikan" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 6. Hard Delete PMB (Dengan Pengecekan ALA)
exports.hardDelete = async (req, res) => {
    try {
        const id_2a1 = req.params.id_2a1;
        const dataOriginal = await Model2a1.getById(id_2a1);

        // Jika ALA masih memiliki data aktif (tidak di-soft-delete ALA)
        if (dataOriginal.ala_deleted_at === null) {
            // Kita kirim sinyal khusus ke Frontend agar memunculkan Alert Konfirmasi
            return res.json({
                success: false,
                requiresConfirmation: true,
                message: "Peringatan: Terdapat data aktif milik ALA pada baris tahun ini. Menghapus permanen akan menghilangkan seluruh data pada baris ini. Lanjutkan?"
            });
        }

        // Jika ALA juga sudah hapus, atau User sudah konfirmasi nekat (force delete)
        await Model2a1.deletePhysical(id_2a1);
        res.json({ success: true, message: "Data dihapus permanen dari database" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Fungsi pendukung untuk Force Delete (jika user nekat)
exports.forceDelete = async (req, res) => {
    try {
        await Model2a1.deletePhysical(req.params.id_2a1);
        res.json({ success: true, message: "Data dihapus permanen secara paksa" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 6. Export Excel Presisi Sesuai Gambar Tabel 2.A.1
exports.exportExcel = async (req, res) => {
    try {
        const [rows] = await Model2a1.getAllForExport(req.params.id_prodi);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Tabel 2.A.1');

        const centerStyle = { vertical: 'middle', horizontal: 'center', wrapText: true };
        const borderStyle = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
        };

        // --- HEADER LAYOUT (Sesuai Gambar Instrumen) ---
        sheet.mergeCells('A1:R1');
        sheet.getCell('A1').value = 'Tabel 2.A.1 Data Mahasiswa';
        sheet.getCell('A1').font = { bold: true, size: 12 };
        sheet.getCell('A1').alignment = centerStyle;

        // Row 2-4: Multi-level Headers
        sheet.mergeCells('A2:A4'); sheet.getCell('A2').value = 'TS';
        sheet.mergeCells('B2:B4'); sheet.getCell('B2').value = 'Daya Tampung';

        sheet.mergeCells('C2:F3'); sheet.getCell('C2').value = 'Jumlah Calon Mahasiswa';
        sheet.getCell('C4').value = 'Pendaftar';
        sheet.getCell('D4').value = 'Pendaftar Afirmasi';
        sheet.getCell('E4').value = 'Pendaftar Kebutuhan Khusus';
        sheet.getCell('F4').value = 'Lulus Seleksi (Diterima)';

        sheet.mergeCells('G2:L2'); sheet.getCell('G2').value = 'Jumlah Mahasiswa Baru';
        sheet.mergeCells('G3:I3'); sheet.getCell('G3').value = 'Reguler';
        sheet.mergeCells('J3:L3'); sheet.getCell('J3').value = 'RPL';
        ['Diterima', 'Afirmasi', 'Kebutuhan Khusus'].forEach((v, i) => {
            sheet.getCell(4, 7 + i).value = v; // Reguler
            sheet.getCell(4, 10 + i).value = v; // RPL
        });

        sheet.mergeCells('M2:R2'); sheet.getCell('M2').value = 'Jumlah Mahasiswa Aktif';
        sheet.mergeCells('M3:O3'); sheet.getCell('M3').value = 'Reguler';
        sheet.mergeCells('P3:R3'); sheet.getCell('P3').value = 'RPL';
        ['Diterima', 'Afirmasi', 'Kebutuhan Khusus'].forEach((v, i) => {
            sheet.getCell(4, 13 + i).value = v; // Reguler
            sheet.getCell(4, 16 + i).value = v; // RPL
        });

        // Apply Header Styling
        for (let r = 2; r <= 4; r++) {
            for (let c = 1; c <= 18; c++) {
                const cell = sheet.getCell(r, c);
                cell.alignment = centerStyle;
                cell.border = borderStyle;
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                cell.font = { bold: true, size: 9 };
            }
        }

        // --- DATA FILLING ---
        let totals = new Array(18).fill(0);
        rows.forEach((r, idx) => {
            const lulusSeleksi = (r.maba_reg_diterima || 0) + (r.maba_rpl_diterima || 0);
            const rowData = [
                r.tahun, r.daya_tampung, r.pendaftar, r.pendaftar_afirmasi, r.pendaftar_khusus,
                lulusSeleksi,
                r.maba_reg_diterima, r.maba_reg_afirmasi, r.maba_reg_khusus,
                r.maba_rpl_diterima, r.maba_rpl_afirmasi, r.maba_rpl_khusus,
                r.aktif_reg_diterima, r.aktif_reg_afirmasi, r.aktif_reg_khusus,
                r.aktif_rpl_diterima, r.aktif_rpl_afirmasi, r.aktif_rpl_khusus
            ];

            const row = sheet.addRow(rowData);
            row.eachCell(cell => { cell.border = borderStyle; cell.alignment = { horizontal: 'center' }; });

            // Hitung Total untuk baris bawah
            for (let i = 1; i < rowData.length; i++) totals[i] += (rowData[i] || 0);
        });

        // --- SUMMARY ROW (JUMLAH) ---
        const sumRow = sheet.addRow(['Jumlah', ...totals.slice(1)]);
        sumRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.border = borderStyle;
            cell.alignment = { horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
        });

        // Column Widths
        sheet.columns.forEach((col, i) => { col.width = i === 0 ? 15 : 10; });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=LKPS_2A1_PMB_${Date.now()}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        res.status(500).send("Export Error: " + err.message);
    }
};