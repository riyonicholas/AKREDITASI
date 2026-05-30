const Model2a2 = require('../../models/pmb/2a2_keragaman_asal_maba');
const ExcelJS = require('exceljs');

const Controller2a2 = {
    /**
     * 1. GET DATA (DASHBOARD & PREVIEW)
     * Memisahkan data murni (raw) dengan parsing JSON dan data waterfall agar tidak terjadi akumulasi ganda
     */
    getData: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.params;
            const [rows] = await Model2a2.getLaporan(id_prodi, id_tahun);

            // Helper untuk parse JSON detail wilayah dengan aman (mendukung data lama teks biasa)
            const parseKet = (str, defaultKet = '', totalJml = 0) => {
                if (!str) return [{ jml: totalJml, ket: defaultKet }];
                try {
                    const parsed = JSON.parse(str);
                    if (Array.isArray(parsed)) return parsed;
                } catch(e) {}
                // Fallback jika data di database masih format teks lama (bukan JSON)
                return [{ jml: totalJml, ket: str }];
            };

            const result = rows.map(r => {
                const lokalRows = parseKet(r.ket_lokal, 'Banyuwangi', r.jml_lokal);
                const regionalRows = parseKet(r.ket_regional, '', r.jml_regional);
                const nasionalRows = parseKet(r.ket_nasional, '', r.jml_nasional);
                const internasionalRows = parseKet(r.ket_internasional, '', r.jml_internasional);
                const afirmasiRows = parseKet(r.ket_afirmasi, 'Banyuwangi', r.jml_afirmasi);
                const khususRows = parseKet(r.ket_khusus, 'Banyuwangi', r.jml_khusus);

                return {
                    tahun: r.tahun,
                    id_2a2: r.id_2a2,
                    // Data murni / raw dari database untuk form editing (Breakdown Asli Terjaga!)
                    raw: {
                        lokal: { jml: r.jml_lokal, rows: lokalRows, link: r.link_lokal },
                        regional: { jml: r.jml_regional, rows: regionalRows, link: r.link_regional },
                        nasional: { jml: r.jml_nasional, rows: nasionalRows, link: r.link_nasional },
                        internasional: { jml: r.jml_internasional, rows: internasionalRows, link: r.link_internasional },
                        afirmasi: { jml: r.jml_afirmasi, rows: afirmasiRows, link: r.link_afirmasi },
                        khusus: { jml: r.jml_khusus, rows: khususRows, link: r.link_khusus }
                    },
                    // Data waterfall / kumulatif untuk parent rows
                    waterfall: {
                        lokal: { jml: r.jml_lokal, link: r.link_lokal },
                        regional: { 
                            jml: (parseInt(r.jml_regional) || 0) + (parseInt(r.jml_nasional) || 0) + (parseInt(r.jml_internasional) || 0),
                            link: r.link_regional
                        },
                        nasional: {
                            jml: (parseInt(r.jml_nasional) || 0) + (parseInt(r.jml_internasional) || 0),
                            link: r.link_nasional
                        },
                        internasional: { jml: r.jml_internasional, link: r.link_internasional },
                        afirmasi: { jml: r.jml_afirmasi, link: r.link_afirmasi },
                        khusus: { jml: r.jml_khusus, link: r.link_khusus }
                    },
                    total_murni: (parseInt(r.jml_lokal) || 0) + (parseInt(r.jml_regional) || 0) + (parseInt(r.jml_nasional) || 0) + (parseInt(r.jml_internasional) || 0) + (parseInt(r.jml_afirmasi) || 0) + (parseInt(r.jml_khusus) || 0)
                };
            });

            res.json({ success: true, data: result });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    /**
     * 2. STORE DATA (UPSERT DENGAN TIGA SINKRONISASI MATI)
     */
    store: async (req, res) => {
        try {
            const b = req.body;
            const target = await Model2a2.getValidation2a1(b.id_prodi, b.id_tahun);
            
            if (!target) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Data Tabel 2.A.1 untuk prodi dan tahun akademik ini belum diisi! Silahkan isi Tabel 2.A.1 terlebih dahulu." 
                });
            }

            const totalInputWilayah = (parseInt(b.jml_lokal) || 0) + (parseInt(b.jml_regional) || 0) + (parseInt(b.jml_nasional) || 0) + (parseInt(b.jml_internasional) || 0);
            if (totalInputWilayah !== target.target_diterima) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Jumlah Mahasiswa wilayah tidak sinkron! Input wilayah: ${totalInputWilayah}, Seharusnya berdasarkan 2.A.1: ${target.target_diterima}` 
                });
            }

            if (parseInt(b.jml_afirmasi) !== target.target_afirmasi) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Jalur Afirmasi tidak sinkron! Input afirmasi: ${b.jml_afirmasi}, Seharusnya berdasarkan 2.A.1: ${target.target_afirmasi}` 
                });
            }

            if (parseInt(b.jml_khusus) !== target.target_khusus) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Berkebutuhan khusus tidak sinkron! Input khusus: ${b.jml_khusus}, Seharusnya berdasarkan 2.A.1: ${target.target_khusus}` 
                });
            }

            await Model2a2.upsert([
                b.id_prodi, b.id_tahun, 
                b.jml_lokal, b.ket_lokal, b.link_lokal,
                b.jml_regional, b.ket_regional, b.link_regional,
                b.jml_nasional, b.ket_nasional, b.link_nasional,
                b.jml_internasional, b.ket_internasional, b.link_internasional,
                b.jml_afirmasi, b.ket_afirmasi, b.link_afirmasi,
                b.jml_khusus, b.ket_khusus, b.link_khusus,
                b.user_id
            ]);

            res.json({ success: true, message: "Data berhasil disimpan dan disinkronkan dengan aman!" });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    /**
     * 3. EXPORT EXCEL (SINKRON WARNA DAN TATA LETAK LKPS REY 100%)
     */
    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.params;
            const [rows] = await Model2a2.getLaporan(id_prodi, id_tahun);
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Tabel 2.A.2');

            // Aktifkan tampilan garis pembatas (gridlines)
            sheet.views = [{ showGridLines: true }];

            // --- Header & Layout Setup ---
            sheet.mergeCells('A1:E1');
            sheet.getCell('A1').value = 'Tabel 2.A.2 Keragaman Asal Mahasiswa';
            sheet.getCell('A1').font = { bold: true, size: 12, name: 'Arial' };
            sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

            sheet.mergeCells('A2:A3'); sheet.getCell('A2').value = 'Asal Mahasiswa';
            sheet.mergeCells('B2:D2'); sheet.getCell('B2').value = 'Jumlah Mahasiswa Baru';
            sheet.mergeCells('E2:E3'); sheet.getCell('E2').value = 'Link Bukti';
            sheet.getCell('B3').value = 'TS-2'; sheet.getCell('C3').value = 'TS-1'; sheet.getCell('D3').value = 'TS';

            const headerCells = ['A2', 'A3', 'B2', 'B3', 'C3', 'D3', 'E2', 'E3'];
            headerCells.forEach(cell => {
                sheet.getCell(cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } }; // Medium Gray
                sheet.getCell(cell).font = { bold: true, name: 'Arial', size: 10 };
                sheet.getCell(cell).border = { 
                    top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } 
                };
                sheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Mapping baris per tahun
            const rTS = rows[0] || null;
            const rTS1 = rows[1] || null;
            const rTS2 = rows[2] || null;

            // Helper Unpacking Data JSON
            const safeParse = (str) => {
                if (!str) return [];
                try {
                    const p = JSON.parse(str);
                    if (Array.isArray(p)) return p;
                } catch(e) {}
                return [];
            };

            const getUniqueKeys = (field) => {
                const keys = new Set();
                [rTS, rTS1, rTS2].forEach(r => {
                    if (r && r[field]) {
                        safeParse(r[field]).forEach(x => {
                            if (x.ket) keys.add(x.ket.trim());
                        });
                    }
                });
                return Array.from(keys);
            };

            const getValueForKey = (r, field, key) => {
                if (!r || !r[field]) return 0;
                const items = safeParse(r[field]);
                const found = items.find(x => x.ket && x.ket.trim() === key);
                return found ? (parseInt(found.jml) || 0) : 0;
            };

            // FUNGSI UNTUK MENULIS BARIS INDUK (GRAY - BOLD)
            const addParentRow = (label, ts2, ts1, ts, link) => {
                const row = sheet.addRow([label, ts2, ts1, ts, link]);
                row.eachCell(cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } }; // Gray
                    cell.font = { bold: true, name: 'Arial', size: 10 };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });
                sheet.getCell(`A${row.number}`).alignment = { horizontal: 'left', vertical: 'middle' };
                return row;
            };

            // FUNGSI UNTUK MENULIS BARIS ANAK / BREAKDOWN (VIBRANT YELLOW)
            const addChildRow = (label, ts2, ts1, ts) => {
                const row = sheet.addRow([`   ${label}`, ts2, ts1, ts, '']); // Indentasi spasi
                row.eachCell(cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Vibrant Yellow (#FFFF00)
                    cell.font = { name: 'Arial', size: 9 };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });
                sheet.getCell(`A${row.number}`).alignment = { horizontal: 'left', vertical: 'middle' };
                return row;
            };

            // --- EKSEKUSI PENULISAN BARIS DATA ---

            // 1. Kota/Kab sama dengan PS (Parent)
            addParentRow(
                'Kota/Kab sama dengan PS',
                rTS2 ? rTS2.jml_lokal : 0,
                rTS1 ? rTS1.jml_lokal : 0,
                rTS ? rTS.jml_lokal : 0,
                rTS ? rTS.link_lokal : ''
            );
            // 1b. Kota/Kab sama dengan PS (Child - Yellow)
            addChildRow(
                'Banyuwangi',
                rTS2 ? rTS2.jml_lokal : 0,
                rTS1 ? rTS1.jml_lokal : 0,
                rTS ? rTS.jml_lokal : 0
            );

            // 2. Kota/Kabupaten Lain (Parent)
            const regTS2 = rTS2 ? ((parseInt(rTS2.jml_regional)||0) + (parseInt(rTS2.jml_nasional)||0) + (parseInt(rTS2.jml_internasional)||0)) : 0;
            const regTS1 = rTS1 ? ((parseInt(rTS1.jml_regional)||0) + (parseInt(rTS1.jml_nasional)||0) + (parseInt(rTS1.jml_internasional)||0)) : 0;
            const regTS = rTS ? ((parseInt(rTS.jml_regional)||0) + (parseInt(rTS.jml_nasional)||0) + (parseInt(rTS.jml_internasional)||0)) : 0;
            addParentRow('Kota/Kabupaten Lain', regTS2, regTS1, regTS, rTS ? rTS.link_regional : '');
            
            // 2b. Kota/Kabupaten Lain (Children - Yellow)
            const keysReg = getUniqueKeys('ket_regional');
            if (keysReg.length === 0) {
                addChildRow('...', 0, 0, 0);
            } else {
                keysReg.forEach(key => {
                    addChildRow(key, getValueForKey(rTS2, 'ket_regional', key), getValueForKey(rTS1, 'ket_regional', key), getValueForKey(rTS, 'ket_regional', key));
                });
            }

            // 3. Provinsi Lain (Parent)
            const nasTS2 = rTS2 ? ((parseInt(rTS2.jml_nasional)||0) + (parseInt(rTS2.jml_internasional)||0)) : 0;
            const nasTS1 = rTS1 ? ((parseInt(rTS1.jml_nasional)||0) + (parseInt(rTS1.jml_internasional)||0)) : 0;
            const nasTS = rTS ? ((parseInt(rTS.jml_nasional)||0) + (parseInt(rTS.jml_internasional)||0)) : 0;
            addParentRow('Provinsi Lain', nasTS2, nasTS1, nasTS, rTS ? rTS.link_nasional : '');

            // 3b. Provinsi Lain (Children - Yellow)
            const keysNas = getUniqueKeys('ket_nasional');
            if (keysNas.length === 0) {
                addChildRow('...', 0, 0, 0);
            } else {
                keysNas.forEach(key => {
                    addChildRow(key, getValueForKey(rTS2, 'ket_nasional', key), getValueForKey(rTS1, 'ket_nasional', key), getValueForKey(rTS, 'ket_nasional', key));
                });
            }

            // 4. Negara Lain (Parent)
            addParentRow(
                'Negara Lain',
                rTS2 ? rTS2.jml_internasional : 0,
                rTS1 ? rTS1.jml_internasional : 0,
                rTS ? rTS.jml_internasional : 0,
                rTS ? rTS.link_internasional : ''
            );

            // 4b. Negara Lain (Children - Yellow)
            const keysInt = getUniqueKeys('ket_internasional');
            if (keysInt.length === 0) {
                addChildRow('...', 0, 0, 0);
            } else {
                keysInt.forEach(key => {
                    addChildRow(key, getValueForKey(rTS2, 'ket_internasional', key), getValueForKey(rTS1, 'ket_internasional', key), getValueForKey(rTS, 'ket_internasional', key));
                });
            }

            // 5. Afirmasi (Parent)
            addParentRow(
                'Afirmasi',
                rTS2 ? rTS2.jml_afirmasi : 0,
                rTS1 ? rTS1.jml_afirmasi : 0,
                rTS ? rTS.jml_afirmasi : 0,
                rTS ? rTS.link_afirmasi : ''
            );

            // 5b. Afirmasi (Children - Yellow)
            const keysAf = getUniqueKeys('ket_afirmasi');
            if (keysAf.length === 0) {
                addChildRow('...', 0, 0, 0);
            } else {
                keysAf.forEach(key => {
                    addChildRow(key, getValueForKey(rTS2, 'ket_afirmasi', key), getValueForKey(rTS1, 'ket_afirmasi', key), getValueForKey(rTS, 'ket_afirmasi', key));
                });
            }

            // 6. Berkebutuhan Khusus (Parent)
            addParentRow(
                'Berkebutuhan Khusus',
                rTS2 ? rTS2.jml_khusus : 0,
                rTS1 ? rTS1.jml_khusus : 0,
                rTS ? rTS.jml_khusus : 0,
                rTS ? rTS.link_khusus : ''
            );

            // 6b. Berkebutuhan Khusus (Children - Yellow)
            const keysKh = getUniqueKeys('ket_khusus');
            if (keysKh.length === 0) {
                addChildRow('...', 0, 0, 0);
            } else {
                keysKh.forEach(key => {
                    addChildRow(key, getValueForKey(rTS2, 'ket_khusus', key), getValueForKey(rTS1, 'ket_khusus', key), getValueForKey(rTS, 'ket_khusus', key));
                });
            }

            // 7. BARIS TOTAL JUMLAH (Abu-abu / Gray)
            const sumTS2 = rTS2 ? ((parseInt(rTS2.jml_lokal)||0) + (parseInt(rTS2.jml_regional)||0) + (parseInt(rTS2.jml_nasional)||0) + (parseInt(rTS2.jml_internasional)||0)) : 0;
            const sumTS1 = rTS1 ? ((parseInt(rTS1.jml_lokal)||0) + (parseInt(rTS1.jml_regional)||0) + (parseInt(rTS1.jml_nasional)||0) + (parseInt(rTS1.jml_internasional)||0)) : 0;
            const sumTS = rTS ? ((parseInt(rTS.jml_lokal)||0) + (parseInt(rTS.jml_regional)||0) + (parseInt(rTS.jml_nasional)||0) + (parseInt(rTS.jml_internasional)||0)) : 0;
            
            const totalRow = sheet.addRow(['Jumlah', sumTS2, sumTS1, sumTS, '']);
            totalRow.eachCell(cell => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } }; // Gray
                cell.font = { bold: true, name: 'Arial', size: 10 };
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
            sheet.getCell(`A${totalRow.number}`).alignment = { horizontal: 'left', vertical: 'middle' };

            // Row Heights & Widths Adjustment
            sheet.eachRow(row => {
                if(row.number > 1) {
                    row.height = 24;
                }
            });
            sheet.getColumn(1).width = 45;
            sheet.getColumn(2).width = 12;
            sheet.getColumn(3).width = 12;
            sheet.getColumn(4).width = 12;
            sheet.getColumn(5).width = 25;

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Tabel_2A2_Export.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (err) { res.status(500).send(err.message); }
    },

    /**
     * 4. TRASH SYSTEM
     */
    getTrash: async (req, res) => {
        try {
            const [rows] = await Model2a2.getTrash(req.params.id_prodi);
            res.json({ success: true, data: rows });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    },

    softDelete: async (req, res) => {
        try {
            const { id_2a2, user_id } = req.body;
            await Model2a2.softDelete(id_2a2, user_id);
            res.json({ success: true, message: "Berhasil dipindahkan ke sampah." });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    },

    restore: async (req, res) => {
        try {
            await Model2a2.restore(req.params.id_2a2);
            res.json({ success: true, message: "Data berhasil dikembalikan." });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    },

    hardDelete: async (req, res) => {
        try {
            await Model2a2.hardDelete(req.params.id_2a2);
            res.json({ success: true, message: "Data dihapus secara permanen." });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    }
};

module.exports = Controller2a2;