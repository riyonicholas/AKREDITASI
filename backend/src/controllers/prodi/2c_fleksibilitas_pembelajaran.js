const Model2c = require('../../models/prodi/2c_fleksibilitas_pembelajaran');

const controller2c = {
    index: async (req, res) => {
        try {
            const db = require('../../config/db');
            
            // 1. Ambil data master untuk populate dropdown
            const [prodis] = await db.execute("SELECT id_prodi, nama_prodi FROM prodi ORDER BY nama_prodi ASC");
            const [tahuns] = await db.execute("SELECT id_tahun, tahun FROM tahun_akademik ORDER BY tahun DESC");
            const [bentuks] = await db.execute("SELECT id_bentuk, nama_bentuk FROM master_bentuk_pembelajaran ORDER BY id_bentuk ASC");

            const master = {
                prodi: prodis,
                tahun: tahuns,
                bentuk: bentuks
            };

            const id_prodi = req.query.id_prodi;
            // Mendukung parameter id_tahun_ts (dari test-2c.html) maupun id_tahun
            let id_tahun = req.query.id_tahun_ts || req.query.id_tahun;

            // Jika id_prodi belum dipilih/kosong, kirim master data dengan borang kosong agar dropdown terpopulasi
            if (!id_prodi) {
                return res.status(200).json({
                    success: true,
                    master,
                    borang: {
                        tahunHeaders: [],
                        barisBentuk: bentuks,
                        mhsAktif: []
                    },
                    data: []
                });
            }

            // Jika id_tahun kosong, default ke tahun akademik terbaru
            if (!id_tahun && tahuns.length > 0) {
                id_tahun = tahuns[0].id_tahun;
            }

            // 2. Ambil matrix borang menggunakan model
            const matrix = await Model2c.findMatrix(id_prodi, id_tahun);

            const borang = {
                tahunHeaders: matrix.years,
                barisBentuk: matrix.rows,
                mhsAktif: matrix.mhs_aktif.map(m => ({
                    id_tahun: m.id_tahun,
                    total_aktif: m.total
                }))
            };

            // 3. Ambil data transaksi flat untuk tabel riwayat (history)
            const [historyData] = await db.execute(`
                SELECT t.id_2c, t.id_prodi, t.id_tahun, t.id_bentuk, t.jumlah_mhs, t.link_bukti,
                       p.nama_prodi, ta.tahun, mb.nama_bentuk
                FROM \`2c_fleksibilitas_pembelajaran\` t
                JOIN prodi p ON t.id_prodi = p.id_prodi
                JOIN tahun_akademik ta ON t.id_tahun = ta.id_tahun
                JOIN master_bentuk_pembelajaran mb ON t.id_bentuk = mb.id_bentuk
                WHERE t.id_prodi = ? AND t.deleted_at IS NULL
                ORDER BY ta.tahun DESC, mb.id_bentuk ASC
            `, [id_prodi]);

            res.status(200).json({
                success: true,
                master,
                borang,
                data: historyData
            });
        } catch (error) { 
            res.status(500).json({ success: false, message: error.message }); 
        }
    },

    show: async (req, res) => {
        try {
            const data = await Model2c.findById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const id_prodi = req.query.id_prodi;
            let data;
            if (id_prodi) {
                data = await Model2c.findTrash(id_prodi);
            } else {
                const db = require('../../config/db');
                const sql = `SELECT m.*, mb.nama_bentuk FROM \`2c_fleksibilitas_pembelajaran\` m 
                             JOIN master_bentuk_pembelajaran mb ON m.id_bentuk = mb.id_bentuk 
                             WHERE m.deleted_at IS NOT NULL`;
                const [rows] = await db.execute(sql);
                data = rows;
            }
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const { id_prodi, id_tahun, details } = req.body;
            
            if (details && Array.isArray(details)) {
                // Batch Upsert Mode (dari test-2c.html)
                await Model2c.batchUpsert(id_prodi, details, req.user.id_user);
                return res.status(201).json({ 
                    success: true, 
                    message: "Seluruh data Fleksibilitas Pembelajaran (2.C) berhasil diperbarui secara massal." 
                });
            } else {
                // Single Create Mode
                const [result] = await Model2c.create({ ...req.body, created_by: req.user.id_user });
                return res.status(201).json({ 
                    success: true, 
                    message: "Data Fleksibilitas Pembelajaran (2.C) berhasil disimpan",
                    id_2c: result.insertId 
                });
            }
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    update: async (req, res) => {
        try {
            await Model2c.update(req.params.id, { ...req.body, updated_by: req.user.id_user });
            res.status(200).json({ success: true, message: "Data Fleksibilitas (2.C) diperbarui" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    destroy: async (req, res) => {
        try {
            await Model2c.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model2c.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await Model2c.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const result = await Model2c.findMatrix(id_prodi, id_tahun);
            
            // Hitung Summary per Tahun
            const summary = result.years.map(y => {
                const totalMhsBentuk = result.rows.reduce((sum, row) => sum + (row.values[y.id_tahun] || 0), 0);
                const mhsAktifObj = result.mhs_aktif.find(m => m.id_tahun == y.id_tahun);
                const totalMhsAktif = mhsAktifObj ? mhsAktifObj.total : 0;
                const persentase = totalMhsAktif > 0 ? ((totalMhsBentuk / totalMhsAktif) * 100).toFixed(2) : "0.00";
                return { totalMhsBentuk, totalMhsAktif, persentase };
            });

            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('2.C Fleksibilitas');

            // 1. Judul
            worksheet.mergeCells(`A1:${String.fromCharCode(65 + result.years.length + 1)}1`);
            worksheet.getCell('A1').value = 'Tabel 2.c Fleksibilitas Dalam Proses Pembelajaran';
            worksheet.getCell('A1').font = { bold: true, size: 12 };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };

            // 2. Header
            const hRow = worksheet.getRow(3);
            const headers = ['Tahun Akademik', ...result.years.map(y => `${y.label} (${y.tahun})`), 'Link Bukti'];
            hRow.values = headers;
            hRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
                c.font = { bold: true };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                c.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // 3. Baris Mahasiswa Aktif
            const mRow = worksheet.getRow(4);
            mRow.values = ['Jumlah Mahasiswa Aktif', ...summary.map(s => s.totalMhsAktif), ''];
            mRow.eachCell(c => {
                c.font = { bold: true };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
            });

            // 4. Baris Judul Tengah
            const midRow = worksheet.getRow(5);
            midRow.values = ['Bentuk Pembelajaran', 'Jumlah mahasiswa untuk setiap bentuk pembelajaran', '', '', ''];
            worksheet.mergeCells(`B5:${String.fromCharCode(65 + result.years.length)}5`);
            midRow.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } };
                c.font = { bold: true, italic: true, size: 9 };
                c.alignment = { horizontal: 'center' };
                c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
            });

            // 5. Data Kuning
            result.rows.forEach((item, idx) => {
                const row = worksheet.addRow([
                    item.nama_bentuk,
                    ...result.years.map(y => item.values[y.id_tahun] || 0),
                    item.link_bukti || ''
                ]);
                row.eachCell((c, colIdx) => {
                    if (colIdx > 1) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF99' } }; // Kuning
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center' };
                });
            });

            // 6. Summary Footer
            const sumRow = worksheet.addRow(['Jumlah', ...summary.map(s => s.totalMhsBentuk), '']);
            const perRow = worksheet.addRow(['Persentase (%)', ...summary.map(s => s.persentase + '%'), '']);
            
            [sumRow, perRow].forEach(row => {
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
                    c.font = { bold: true };
                    c.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
                    c.alignment = { horizontal: 'center' };
                });
            });

            worksheet.columns = [{width: 30}, {width: 15}, {width: 15}, {width: 15}, {width: 30}];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Tabel_2C_Matrix.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }

};

module.exports = controller2c;
