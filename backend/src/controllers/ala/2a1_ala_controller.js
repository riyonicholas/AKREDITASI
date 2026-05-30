const Model2a1 = require('../../models/model_2a1');
const ExcelJS = require('exceljs');

// 1. Ambil Data Aktif (Logic Visibility 0 jika PMB hapus data PMB-nya)
exports.getData = async (req, res) => {
    try {
        const [rows] = await Model2a1.getForALA(req.params.id_prodi);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Simpan Data ALA (Mahasiswa Aktif)
exports.store = async (req, res) => {
    try {
        const { 
            id_prodi, id_tahun, 
            a_reg_in, a_reg_af, a_reg_ks, 
            a_rpl_in, a_rpl_af, a_rpl_ks, 
            user_id 
        } = req.body;

        await Model2a1.upsertALA([
            id_prodi, id_tahun, 
            a_reg_in, a_reg_af, a_reg_ks, 
            a_rpl_in, a_rpl_af, a_rpl_ks, 
            user_id
        ]);
        
        res.json({ success: true, message: "Data Mahasiswa Aktif Berhasil Disimpan" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Soft Delete ALA
exports.softDelete = async (req, res) => {
    try {
        const { id_2a1, user_id } = req.body;
        await Model2a1.softDeleteALA(id_2a1, user_id);
        res.json({ success: true, message: "Data dipindahkan ke Trash ALA" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. Get Trash ALA
exports.getTrash = async (req, res) => {
    try {
        const [rows] = await Model2a1.getTrashALA(req.params.id_prodi);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 5. Restore ALA
exports.restore = async (req, res) => {
    try {
        await Model2a1.restoreALA(req.params.id_2a1);
        res.json({ success: true, message: "Data Mahasiswa Aktif berhasil dikembalikan" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 6. Hard Delete ALA (Dengan Pengecekan PMB)
exports.hardDelete = async (req, res) => {
    try {
        const id_2a1 = req.params.id_2a1;
        const dataOriginal = await Model2a1.getById(id_2a1);

        // Jika PMB masih memiliki data aktif (tidak di-soft-delete PMB)
        if (dataOriginal.pmb_deleted_at === null) {
            return res.json({ 
                success: false, 
                requiresConfirmation: true, 
                message: "Peringatan: Terdapat data aktif milik Bidang PMB pada baris tahun ini. Menghapus permanen akan menghilangkan seluruh data pada baris ini. Lanjutkan?" 
            });
        }

        // Jika PMB juga sudah hapus, eksekusi hapus fisik
        await Model2a1.deletePhysical(id_2a1);
        res.json({ success: true, message: "Data dihapus permanen dari database" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Fungsi pendukung untuk Force Delete
exports.forceDelete = async (req, res) => {
    try {
        await Model2a1.deletePhysical(req.params.id_2a1);
        res.json({ success: true, message: "Data dihapus permanen secara paksa" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 6. Export Excel Presisi Sesuai Gambar 2.A.1
exports.exportExcel = async (req, res) => {
    try {
        const [rows] = await Model2a1.getAllForExport(req.params.id_prodi);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Tabel 2.A.1');

        // --- STYLING HELPER ---
        const centerStyle = { vertical: 'middle', horizontal: 'center', wrapText: true };
        const borderStyle = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
        };

        // --- ROW 1: TITLE ---
        sheet.mergeCells('A1:R1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'Tabel 2.A.1 Data Mahasiswa';
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = centerStyle;

        // --- ROW 2-4: COMPLEX HEADERS ---
        // Kolom TS & Daya Tampung (Merge 3 baris kebawah)
        sheet.mergeCells('A2:A4'); sheet.getCell('A2').value = 'TS';
        sheet.mergeCells('B2:B4'); sheet.getCell('B2').value = 'Daya Tampung';

        // Kelompok Calon Mahasiswa
        sheet.mergeCells('C2:F3'); sheet.getCell('C2').value = 'Jumlah Calon Mahasiswa';
        sheet.getCell('C4').value = 'Pendaftar';
        sheet.getCell('D4').value = 'Pendaftar Afirmasi';
        sheet.getCell('E4').value = 'Pendaftar Kebutuhan Khusus';
        sheet.getCell('F4').value = 'Lulus Seleksi';

        // Kelompok Mahasiswa Baru
        sheet.mergeCells('G2:L2'); sheet.getCell('G2').value = 'Jumlah Mahasiswa Baru';
        sheet.mergeCells('G3:I3'); sheet.getCell('G3').value = 'Reguler';
        sheet.mergeCells('J3:L3'); sheet.getCell('J3').value = 'RPL';
        sheet.getCell('G4').value = 'Diterima'; sheet.getCell('H4').value = 'Afirmasi'; sheet.getCell('I4').value = 'Kebutuhan Khusus';
        sheet.getCell('J4').value = 'Diterima'; sheet.getCell('K4').value = 'Afirmasi'; sheet.getCell('L4').value = 'Kebutuhan Khusus';

        // Kelompok Mahasiswa Aktif
        sheet.mergeCells('M2:R2'); sheet.getCell('M2').value = 'Jumlah Mahasiswa Aktif';
        sheet.mergeCells('M3:O3'); sheet.getCell('M3').value = 'Reguler';
        sheet.mergeCells('P3:R3'); sheet.getCell('P3').value = 'RPL';
        sheet.getCell('M4').value = 'Diterima'; sheet.getCell('N4').value = 'Afirmasi'; sheet.getCell('O4').value = 'Kebutuhan Khusus';
        sheet.getCell('P4').value = 'Diterima'; sheet.getCell('Q4').value = 'Afirmasi'; sheet.getCell('R4').value = 'Kebutuhan Khusus';

        // Apply Styles to Header
        for (let r = 2; r <= 4; r++) {
            for (let c = 1; c <= 18; c++) {
                const cell = sheet.getCell(r, c);
                cell.alignment = centerStyle;
                cell.border = borderStyle;
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } }; // Light Grey Header
                cell.font = { bold: true, size: 9 };
            }
        }

        // --- DATA ROWS ---
        let currentRow = 5;
        let totals = new Array(17).fill(0); // Index 1-17 untuk kolom B-R

        rows.forEach(r => {
            // IKU: Logika Kalkulasi Server-Side (Lulus Seleksi = Reg Diterima + RPL Diterima)
            const lulusSeleksi = (r.maba_reg_diterima || 0) + (r.maba_rpl_diterima || 0);
            
            const dataRow = [
                r.tahun, r.daya_tampung, r.pendaftar, r.pendaftar_afirmasi, r.pendaftar_khusus, 
                lulusSeleksi,
                r.maba_reg_diterima, r.maba_reg_afirmasi, r.maba_reg_khusus,
                r.maba_rpl_diterima, r.maba_rpl_afirmasi, r.maba_rpl_khusus,
                r.aktif_reg_diterima, r.aktif_reg_afirmasi, r.aktif_reg_khusus,
                r.aktif_rpl_diterima, r.aktif_rpl_afirmasi, r.aktif_rpl_khusus
            ];

            const row = sheet.addRow(dataRow);
            row.eachCell((cell) => {
                cell.border = borderStyle;
                cell.alignment = { horizontal: 'center' };
            });

            // Update Totals (Abaikan kolom 0 karena itu nama tahun)
            for(let i=1; i<dataRow.length; i++) {
                totals[i] += (dataRow[i] || 0);
            }
            currentRow++;
        });

        // --- BOTTOM SUMMARY ROW (JUMLAH) ---
        const summaryRowValues = ['Jumlah', ...totals.slice(1)];
        const lastRow = sheet.addRow(summaryRowValues);
        lastRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.border = borderStyle;
            cell.alignment = { horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Yellow Summary
        });

        // Setting Column Widths
        sheet.columns.forEach((col, i) => {
            col.width = i === 0 ? 12 : 10;
        });

        // Send Response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Tabel_2A1_Data_Mahasiswa_${Date.now()}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal mengexport file: " + err.message);
    }
};