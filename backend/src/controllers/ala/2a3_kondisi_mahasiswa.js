const Model2a3 = require('../../models/ala/2a3_kondisi_mahasiswa');
const ExcelJS = require('exceljs');

const Controller2a3 = {
    /**
     * 1. GET DATA (DASHBOARD PREVIEW & FORM LOAD - SINKRONISASI AKTIF MURNI DARI 2.A.1)
     */
    getData: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.params;
            const kronologis = await Model2a3.getTahunKronologis(id_tahun);
            
            if (!kronologis || !kronologis.ts) {
                return res.status(400).json({ success: false, message: "Tahun Akademik TS berjalan tidak ditemukan." });
            }

            // Helper memproses dan menyelaraskan data murni maba & aktif dari 2.A.1
            const processCohort = async (cohortTahun, fallbackLabel) => {
                if (!cohortTahun) return { label: fallbackLabel, id_tahun: 0, maba: 0, lulus: 0, do: 0, aktif: 0 };
                
                // Sinkron murni maba & aktif dari 2.A.1
                const syncData = await Model2a3.getSyncData2a1(id_prodi, cohortTahun.id_tahun);
                const dbEntry = await Model2a3.getCohortEntry(id_prodi, cohortTahun.id_tahun);

                return {
                    id_2a3: dbEntry ? dbEntry.id_2a3 : null,
                    label: fallbackLabel,
                    id_tahun: cohortTahun.id_tahun,
                    tahun: cohortTahun.tahun,
                    maba: syncData.sync_maba,
                    aktif: syncData.sync_aktif, // Kunci sinkron murni dari 2.A.1
                    lulus: dbEntry ? dbEntry.lulus : 0,
                    do: dbEntry ? dbEntry.do : 0
                };
            };

            const tsData = await processCohort(kronologis.ts, 'TS');
            const ts1Data = await processCohort(kronologis.ts1, 'TS-1');
            const ts2Data = await processCohort(kronologis.ts2, 'TS-2');

            res.json({
                success: true,
                data: {
                    ts: tsData,
                    ts1: ts1Data,
                    ts2: ts2Data
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    /**
     * 2. STORE DATA COHORT TUNGGAL (SINKRON DATA MURNI DARI 2.A.1 & BEBAS BEBAN ARRAY LOOP!)
     */
    store: async (req, res) => {
        try {
            const { id_prodi, id_tahun, lulus, do: _do, user_id } = req.body;

            // Tarik murni data Mahasiswa Baru & Mahasiswa Aktif dari Tabel 2.A.1 milik ALA/PMB
            const syncData = await Model2a3.getSyncData2a1(id_prodi, id_tahun);

            await Model2a3.upsert([
                id_prodi, 
                id_tahun, 
                syncData.sync_maba, // Tarik otomatis maba dari 2.A.1
                parseInt(lulus) || 0, 
                parseInt(_do) || 0, 
                syncData.sync_aktif, // Tarik otomatis aktif dari 2.A.1
                user_id
            ]);

            res.json({ success: true, message: "Data retensi angkatan berjalan berhasil disimpan dan disinkronkan murni dengan data 2.A.1!" });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    /**
     * 3. EXPORT EXCEL (PRESISI WARNA & TATA LETAK LKPS REY 100% MATCH DENGAN TEMPLATE)
     */
    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.params;
            const kronologis = await Model2a3.getTahunKronologis(id_tahun);
            
            if (!kronologis) return res.status(400).send("Tahun Akademik tidak valid.");

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Tabel 2.A.3');
            
            // Tampilkan garis pembatas bawaan Excel
            sheet.views = [{ showGridLines: true }];

            // --- HEADER JUDUL (Diletakkan di Baris 1, Tengah) ---
            sheet.mergeCells('A1:E1');
            sheet.getCell('A1').value = 'Tabel 2.A.3  Kondisi Jumlah Mahasiswa';
            sheet.getCell('A1').font = { bold: true, size: 12, name: 'Arial' };
            sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

            // --- HEADER TABEL (Baris 3) ---
            // Sesuai image_23c1e9.png, kolom A3 dibiarkan kosong/blank tanpa teks
            sheet.getCell('A3').value = ''; 
            sheet.getCell('B3').value = 'TS-2';
            sheet.getCell('C3').value = 'TS-1';
            sheet.getCell('D3').value = 'TS';
            sheet.getCell('E3').value = 'Jumlah';

            // Ambil data sinkron 2.A.1
            const processExcelCohort = async (cohortTahun) => {
                if (!cohortTahun) return { maba: 0, lulus: 0, do: 0, aktif: 0 };
                const syncData = await Model2a3.getSyncData2a1(id_prodi, cohortTahun.id_tahun);
                const dbEntry = await Model2a3.getCohortEntry(id_prodi, cohortTahun.id_tahun);
                return { 
                    maba: syncData.sync_maba, 
                    lulus: dbEntry ? dbEntry.lulus : 0, 
                    do: dbEntry ? dbEntry.do : 0, 
                    aktif: syncData.sync_aktif 
                };
            };

            const ts2 = await processExcelCohort(kronologis.ts2);
            const ts1 = await processExcelCohort(kronologis.ts1);
            const ts = await processExcelCohort(kronologis.ts);

            // Tambah Baris Laporan LKPS
            const rowsData = [
                ['Mahasiswa Baru', ts2.maba, ts1.maba, ts.maba, ts2.maba + ts1.maba + ts.maba],
                ['Mahasiswa Aktif pada saat TS', ts2.aktif, ts1.aktif, ts.aktif, ts2.aktif + ts1.aktif + ts.aktif],
                ['Lulus pada saat TS', ts2.lulus, ts1.lulus, ts.lulus, ts2.lulus + ts1.lulus + ts.lulus],
                ['Mengundurkan Diri/DO pada saat TS', ts2.do, ts1.do, ts.do, ts2.do + ts1.do + ts.do]
            ];

            rowsData.forEach((r, idx) => {
                const row = sheet.addRow(r);
                row.eachCell((cell, colIdx) => {
                    // Berikan border tipis untuk seluruh sel
                    cell.border = { 
                        top: { style: 'thin' }, 
                        left: { style: 'thin' }, 
                        bottom: { style: 'thin' }, 
                        right: { style: 'thin' } 
                    };
                    
                    // Pembagian Warna Presisi:
                    // Kolom 1 (Kondisi Retensi) wajib berlatar Abu-abu Solid dengan Teks Bold & Left-Aligned
                    if (colIdx === 1) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } }; // Gray (#BFBFBF)
                        cell.font = { bold: true, name: 'Arial', size: 10 };
                        cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    } 
                    // Kolom 2, 3, 4, 5 (TS-2, TS-1, TS, Jumlah) wajib berlatar Kuning Terang Solid, Centered
                    else {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Yellow (#FFFF00)
                        // Khusus kolom Jumlah (Col 5) diberikan style Semi-Bold
                        cell.font = { name: 'Arial', size: 10, bold: colIdx === 5 };
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    }
                });
            });

            // Mewarnai Seluruh Header Row 3 (Gray #BFBFBF & Bold)
            ['A3', 'B3', 'C3', 'D3', 'E3'].forEach(c => {
                const cell = sheet.getCell(c);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } }; // Gray
                cell.font = { bold: true, name: 'Arial', size: 10 };
                cell.border = { 
                    top: { style: 'thin' }, 
                    left: { style: 'thin' }, 
                    bottom: { style: 'thin' }, 
                    right: { style: 'thin' } 
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Mengatur lebar kolom agar rapi saat dicetak
            sheet.getColumn(1).width = 45;
            ['B', 'C', 'D', 'E'].forEach(col => sheet.getColumn(col).width = 12);
            
            // Set tinggi baris yang nyaman dibaca
            sheet.eachRow(row => { 
                if (row.number > 2) row.height = 24; 
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Tabel_2A3_Export.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (err) { res.status(500).send(err.message); }
    },

    /**
     * 4. TRASH SYSTEM
     */
    getTrash: async (req, res) => {
        try {
            const [rows] = await Model2a3.getTrash(req.params.id_prodi);
            res.json({ success: true, data: rows });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    },

    softDelete: async (req, res) => {
        try {
            const { id_2a3, user_id } = req.body;
            await Model2a3.softDelete(id_2a3, user_id);
            res.json({ success: true, message: "Berhasil dipindahkan ke sampah." });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model2a3.restore(req.params.id_2a3);
            res.json({ success: true, message: "Data berhasil dikembalikan." });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    },

    hardDelete: async (req, res) => {
        try {
            await Model2a3.hardDelete(req.params.id_2a3);
            res.json({ success: true, message: "Data dihapus secara permanen." });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    }
};

module.exports = Controller2a3;