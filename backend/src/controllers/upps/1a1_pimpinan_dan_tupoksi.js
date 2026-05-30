const Model1a1 = require('../../models/upps/1a1_pimpinan_dan_tupoksi');
const ExcelJS = require('exceljs');

/**
 * Controller untuk Tabel 1.A.1 Pimpinan dan Tupoksi
 * Update: Menghapus dependensi id_jafung dari input (Otomatis via Relasi Pegawai)
 */
const controller1a1 = {
    // 1. READ: Ambil semua data pimpinan aktif
    index: async (req, res) => {
        try {
            const data = await Model1a1.findAll();
            res.status(200).json({
                success: true,
                message: "Data Tabel 1.A.1 Berhasil Diambil",
                data: data
            });
        } catch (error) {
            console.error("DEBUG 1A1 INDEX:", error.message);
            res.status(500).json({ success: false, message: "Terjadi kesalahan server saat memuat dashboard" });
        }
    },

    // 2. CREATE: Simpan data dengan auto-SKS & Auto-Jafung
    store: async (req, res) => {
        try {
            const { id_pegawai, periode_mulai, periode_selesai, tupoksi } = req.body;

            // Engine Kalkulasi: Cari pakem SKS secara otomatis berdasarkan Jabatan + Unit di data Pegawai
            const autoSks = await Model1a1.findAutoSks(id_pegawai);

            const dataToSave = {
                id_pegawai,
                periode_mulai,
                periode_selesai,
                tupoksi,
                sks_jabatan: autoSks, // Hasil deteksi otomatis
                created_by: req.user.id_user 
            };

            await Model1a1.create(dataToSave);
            res.status(201).json({
                success: true,
                message: "Data Pimpinan berhasil ditambahkan",
                detail: `SKS Jabatan otomatis terdeteksi: ${autoSks}. Jabatan Fungsional terhubung otomatis.`
            });
        } catch (error) {
            console.error("DEBUG 1A1 STORE:", error.message);
            res.status(500).json({ success: false, message: "Gagal menyimpan data pimpinan" });
        }
    },

    // 3. UPDATE: Perbarui data
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { id_pegawai } = req.body;

            // Hitung ulang SKS jika pegawai berubah
            const autoSks = await Model1a1.findAutoSks(id_pegawai);

            const dataToUpdate = {
                ...req.body,
                sks_jabatan: autoSks,
                updated_by: req.user.id_user
            };

            await Model1a1.update(id, dataToUpdate);
            res.status(200).json({ success: true, message: "Data pimpinan berhasil diperbarui" });
        } catch (error) {
            console.error("DEBUG 1A1 UPDATE:", error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 4. DELETE: Soft Delete
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            await Model1a1.softDelete(id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke sampah" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal menghapus data" });
        }
    },

    // 5. TRASH: Lihat data terhapus
    trash: async (req, res) => {
        try {
            const data = await Model1a1.findDeleted();
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal memuat sampah" });
        }
    },

    // 6. RESTORE: Pulihkan data
    restore: async (req, res) => {
        try {
            const { id } = req.params;
            await Model1a1.restore(id);
            res.status(200).json({ success: true, message: "Data pimpinan berhasil dipulihkan!" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 7. HARD DELETE
    hardDestroy: async (req, res) => {
        try {
            const { id } = req.params;
            await Model1a1.hardDelete(id);
            res.status(200).json({ success: true, message: "Data dihapus permanen" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 8. EXPORT EXCEL: Format Standar LKPS
    exportExcel: async (req, res) => {
        try {
            const data = await Model1a1.findAll();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Tabel 1.A.1');

            // Judul Baris 1
            worksheet.mergeCells('A1:F1');
            const titleRow = worksheet.getRow(1);
            titleRow.getCell(1).value = 'Tabel 1.A.1 Tabel Pimpinan dan Tupoksi UPPS dan PS';
            titleRow.getCell(1).font = { bold: true, size: 12 };
            titleRow.getCell(1).alignment = { horizontal: 'center' };

            // Header Baris 2 (Warna Abu-abu #BFBFBF)
            const headerRow = worksheet.getRow(2);
            headerRow.values = [
                'Unit Kerja', 
                'Nama Ketua', 
                'Periode Jabatan', 
                'Pendidikan Terakhir', 
                'Jabatan Fungsional', 
                'Tugas Pokok dan Fungsi'
            ];
            
            headerRow.eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });

            // Data Baris 3 dst (Warna Kuning #FFFF00)
            data.forEach(item => {
                const row = worksheet.addRow([
                    item.nama_unit_display,
                    item.nama_lengkap,
                    `${item.periode_mulai} - ${item.periode_selesai}`,
                    item.pendidikan_terakhir,
                    item.nama_jafung, // Sudah otomatis dari relasi
                    item.tupoksi
                ]);

                row.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                });
            });

            worksheet.columns = [
                { width: 25 }, { width: 35 }, { width: 25 }, 
                { width: 20 }, { width: 30 }, { width: 55 }
            ];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Tabel_1A1_LKPS.xlsx');
            
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error("DEBUG EXPORT 1A1:", error.message);
            res.status(500).json({ success: false, message: "Gagal ekspor ke Excel" });
        }
    }
};

module.exports = controller1a1;