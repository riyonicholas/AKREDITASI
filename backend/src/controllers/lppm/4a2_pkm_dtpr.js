const ModelPkm = require('../../models/lppm/4a2_pkm_dtpr');
const ExcelJS = require('exceljs');
const db = require('../../config/db');

const pkmController = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await ModelPkm.findAllRange(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await ModelPkm.findTrash(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const data = req.body;
            
            if (!data.pkm || !data.pkm.id_roadmap || !data.pkm.id_dosen || !data.pkm.id_tahun || !data.pkm.judul_pkm) {
                return res.status(400).json({
                    success: false,
                    message: "Data Induk PkM tidak lengkap! (id_roadmap, id_dosen, id_tahun, dan judul_pkm wajib diisi)"
                });
            }

            const id_4a2 = await ModelPkm.createTransaction(data, req.user.id_user);

            res.status(201).json({
                success: true,
                message: "Data PkM beserta relasinya (Kerjasama, Publikasi, HKI) berhasil disimpan sekaligus secara aman.",
                id_4a2: id_4a2
            });

        } catch (error) {
            console.error("Error Transaction Sekali Input PkM:", error);
            res.status(500).json({
                success: false,
                message: "Gagal menyimpan data secara keseluruhan, sistem telah dibersihkan otomatis (Rollback). Error: " + error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const data = req.body;
            
            if (!data.pkm || !data.pkm.id_roadmap || !data.pkm.id_dosen || !data.pkm.id_tahun || !data.pkm.judul_pkm) {
                return res.status(400).json({
                    success: false,
                    message: "Data Induk PkM tidak lengkap! (id_roadmap, id_dosen, id_tahun, dan judul_pkm wajib diisi)"
                });
            }

            await ModelPkm.updateTransaction(req.params.id, data, req.user.id_user);
            res.status(200).json({ success: true, message: "Data PkM beserta relasinya berhasil diperbarui" });
        } catch (error) { 
            console.error("Error Update Transaction PkM:", error);
            res.status(500).json({ success: false, message: "Gagal memperbarui data. Error: " + error.message }); 
        }
    },

    destroy: async (req, res) => {
        try {
            await ModelPkm.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke tempat sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await ModelPkm.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await ModelPkm.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen dari database" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    exportExcel: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const targetTS = parseInt(id_tahun);
            const rawData = await ModelPkm.findAllRange(id_prodi, targetTS);
            
            let prodiName = id_prodi;
            let tahunName = id_tahun;
            try {
                const [prodiRows] = await db.execute('SELECT nama_prodi FROM prodi WHERE id_prodi = ?', [id_prodi]);
                if(prodiRows[0]) prodiName = prodiRows[0].nama_prodi.replace(/[^a-zA-Z0-9]/g, '_');
                
                const [tahunRows] = await db.execute('SELECT tahun FROM tahun_akademik WHERE id_tahun = ?', [id_tahun]);
                if(tahunRows[0]) tahunName = String(tahunRows[0].tahun).replace(/[^a-zA-Z0-9]/g, '_');
            } catch (e) { console.error('Error fetching prodi/tahun name:', e); }

            const workbook = new ExcelJS.Workbook();
            
            // Helper function for styling headers
            const styleHeader = (row) => {
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                    c.font = { bold: true };
                    c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                });
            };

            // Helper function for styling data
            const styleData = (row) => {
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    c.alignment = { vertical: 'middle', wrapText: true };
                });
            };

            // SHEET 1: 4.A.2 PkM
            const ws1 = workbook.addWorksheet('4.A.2');
            
            // Row 0: Judul Tabel
            ws1.mergeCells('A1:K1');
            const titleCell = ws1.getCell('A1');
            titleCell.value = 'Tabel 4.A.2  PkM DTPR, Hibah dan Pembiayaan PkM';
            titleCell.font = { bold: true, size: 12 };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
            ws1.getRow(1).height = 20;

            // Row 2: Roadmap
            ws1.getCell('A2').value = 'Roadmap';
            ws1.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            ws1.getCell('A2').font = { bold: true };
            ws1.getCell('A2').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            ws1.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

            ws1.mergeCells('B2:K2');
            const h1B = ws1.getCell('B2');
            const roadmapLink = rawData.length > 0 && rawData[0].roadmap_link ? rawData[0].roadmap_link : 'Tuliskan link ke dokumen roadmap PkM';
            h1B.value = roadmapLink;
            h1B.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            h1B.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            h1B.alignment = { horizontal: 'left', vertical: 'middle' };

            // Header Row 3 & 4 (Complex Headers)
            ws1.mergeCells('A3:A4'); ws1.getCell('A3').value = 'No';
            ws1.mergeCells('B3:B4'); ws1.getCell('B3').value = 'Nama DTPR\n(Sebagai Ketua PkM)';
            ws1.mergeCells('C3:C4'); ws1.getCell('C3').value = 'Judul PkM';
            ws1.mergeCells('D3:D4'); ws1.getCell('D3').value = 'Jumlah Mahasiswa yang Terlibat';
            ws1.mergeCells('E3:E4'); ws1.getCell('E3').value = 'Jenis Hibah PkM';
            
            ws1.getCell('F3').value = 'Sumber Dana';
            ws1.getCell('F4').value = 'L/N/I';

            ws1.mergeCells('G3:G4'); ws1.getCell('G3').value = 'Durasi (tahun)';

            ws1.mergeCells('H3:J3'); ws1.getCell('H3').value = 'Pendanaan (Rp Juta)';
            ws1.getCell('H4').value = 'TS-2';
            ws1.getCell('I4').value = 'TS-1';
            ws1.getCell('J4').value = 'TS';
            ws1.mergeCells('K3:K4'); ws1.getCell('K3').value = 'Link Bukti';

            styleHeader(ws1.getRow(3));
            styleHeader(ws1.getRow(4));

            // Data Rows
            let sumTS2 = 0, sumTS1 = 0, sumTS = 0;
            let countPkm = rawData.length;
            let setHibah = new Set();

            const formatSumber = (s) => {
                if (!s) return '-';
                const lower = s.toLowerCase();
                if (lower.includes('lokal') || lower.includes('wilayah')) return 'L';
                if (lower.includes('nasional')) return 'N';
                if (lower.includes('internasional')) return 'I';
                return s.charAt(0).toUpperCase();
            };

            rawData.forEach((item, index) => {
                const ts2 = item.id_tahun === targetTS - 2 ? item.jumlah_dana : 0;
                const ts1 = item.id_tahun === targetTS - 1 ? item.jumlah_dana : 0;
                const ts = item.id_tahun === targetTS ? item.jumlah_dana : 0;

                sumTS2 += ts2;
                sumTS1 += ts1;
                sumTS += ts;

                if (item.jenis_hibah) setHibah.add(item.jenis_hibah);

                const row = ws1.addRow([
                    index + 1,
                    item.nama_dosen,
                    item.judul_pkm,
                    item.jumlah_mahasiswa || 0,
                    item.jenis_hibah || '-',
                    formatSumber(item.sumber),
                    item.durasi || 0,
                    ts2,
                    ts1,
                    ts,
                    item.link_bukti || '-'
                ]);
                styleData(row);
            });

            // Footers (sesuai urutan LKPS: Jumlah Dana → Jumlah PkM → Jumlah Jenis Hibah PKM)
            const fRow1 = ws1.addRow([]);
            ws1.mergeCells(`A${fRow1.number}:G${fRow1.number}`);
            fRow1.getCell(1).value = 'Jumlah Dana';
            fRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fRow1.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow1.getCell(1).font = { bold: true };
            fRow1.getCell(8).value = sumTS2; fRow1.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fRow1.getCell(9).value = sumTS1; fRow1.getCell(9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fRow1.getCell(10).value = sumTS; fRow1.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fRow1.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fRow1.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            const fRow2 = ws1.addRow([]);
            ws1.mergeCells(`A${fRow2.number}:B${fRow2.number}`);
            fRow2.getCell(1).value = 'Jumlah PkM';
            fRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fRow2.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow2.getCell(1).font = { bold: true };
            fRow2.getCell(3).value = countPkm;
            fRow2.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            ws1.mergeCells(`D${fRow2.number}:K${fRow2.number}`);
            fRow2.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow2.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            const fRow3 = ws1.addRow([]);
            ws1.mergeCells(`A${fRow3.number}:D${fRow3.number}`);
            fRow3.getCell(1).value = 'Jumlah Jenis Hibah PKM';
            fRow3.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fRow3.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow3.getCell(1).font = { bold: true };
            fRow3.getCell(5).value = setHibah.size;
            fRow3.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            ws1.mergeCells(`F${fRow3.number}:K${fRow3.number}`);
            fRow3.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow3.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            ws1.addRow(['L: Lokal/Wilayah, N: Nasional, I : Internasional']);

            ws1.columns = [
                { width: 5 }, { width: 25 }, { width: 35 }, { width: 15 }, 
                { width: 20 }, { width: 10 }, { width: 10 }, 
                { width: 15 }, { width: 15 }, { width: 15 }, { width: 25 }
            ];

            // SHEET 2: 4.C.1 Kerjasama PkM
            const ws2 = workbook.addWorksheet('4.C.1');
            ws2.mergeCells('A1:I1');
            const h2A = ws2.getCell('A1');
            h2A.value = 'Tabel 4.C.1 Kerjasama PkM';
            h2A.font = { bold: true, size: 12 };
            h2A.alignment = { horizontal: 'center', vertical: 'middle' };

            // Header Row 2 & 3
            ws2.mergeCells('A2:A3'); ws2.getCell('A2').value = 'No';
            ws2.mergeCells('B2:B3'); ws2.getCell('B2').value = 'Judul Kerjasama';
            ws2.mergeCells('C2:C3'); ws2.getCell('C2').value = 'Mitra Kerja Sama';
            
            ws2.getCell('D2').value = 'Sumber';
            ws2.getCell('D3').value = 'L/N/I';

            ws2.mergeCells('E2:E3'); ws2.getCell('E2').value = 'Durasi (Tahun)';

            ws2.mergeCells('F2:H2'); ws2.getCell('F2').value = 'Pendanaan (Rp Juta)';
            ws2.getCell('F3').value = 'TS-2';
            ws2.getCell('G3').value = 'TS-1';
            ws2.getCell('H3').value = 'TS';
            
            ws2.mergeCells('I2:I3'); ws2.getCell('I2').value = 'Link Bukti';

            styleHeader(ws2.getRow(2));
            styleHeader(ws2.getRow(3));

            let sumKTS2 = 0, sumKTS1 = 0, sumKTS = 0;
            let countMitra = 0;
            let counterKerjasama = 1;

            rawData.forEach(item => {
                if(item.kerjasama && item.kerjasama.length > 0) {
                    item.kerjasama.forEach(k => {
                        const ts2 = k.id_tahun === targetTS - 2 ? k.jumlah_dana : 0;
                        const ts1 = k.id_tahun === targetTS - 1 ? k.jumlah_dana : 0;
                        const ts = k.id_tahun === targetTS ? k.jumlah_dana : 0;

                        sumKTS2 += ts2;
                        sumKTS1 += ts1;
                        sumKTS += ts;
                        countMitra++;

                        const row = ws2.addRow([
                            counterKerjasama++,
                            k.judul_kerjasama || '-',
                            k.mitra_kerja_sama || '-',
                            formatSumber(k.sumber),
                            k.durasi || 0,
                            ts2,
                            ts1,
                            ts,
                            k.link_bukti || '-'
                        ]);
                        styleData(row);
                    });
                }
            });

            // Footers Sheet 4.C.1
            const fKRow1 = ws2.addRow([]);
            ws2.mergeCells(`A${fKRow1.number}:D${fKRow1.number}`);
            fKRow1.getCell(1).value = 'Jumlah Dana';
            fKRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fKRow1.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fKRow1.getCell(1).font = { bold: true };
            fKRow1.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } }; // Durasi abu-abu
            fKRow1.getCell(6).value = sumKTS2; fKRow1.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fKRow1.getCell(7).value = sumKTS1; fKRow1.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fKRow1.getCell(8).value = sumKTS;  fKRow1.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fKRow1.getCell(9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fKRow1.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            const fKRow2 = ws2.addRow([]);
            ws2.mergeCells(`A${fKRow2.number}:B${fKRow2.number}`);
            fKRow2.getCell(1).value = 'Jumlah Kerjasama';
            fKRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fKRow2.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fKRow2.getCell(1).font = { bold: true };
            fKRow2.getCell(3).value = countMitra;
            fKRow2.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            ws2.mergeCells(`D${fKRow2.number}:I${fKRow2.number}`);
            fKRow2.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fKRow2.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            ws2.addRow(['L: Lokal/Wilayah, N: Nasional, I : Internasional']);

            ws2.columns = [
                { width: 5 }, { width: 35 }, { width: 25 }, { width: 10 }, 
                { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 25 }
            ];

            // SHEET 3: 4.C.2 Diseminasi Hasil PkM
            const ws3 = workbook.addWorksheet('4.C.2');
            ws3.mergeCells('A1:H1');
            const h3A = ws3.getCell('A1');
            h3A.value = 'Tabel 4.C.2 Diseminasi Hasil PkM';
            h3A.font = { bold: true, size: 12 };
            h3A.alignment = { horizontal: 'center', vertical: 'middle' };
            ws3.getRow(1).height = 20;

            // Header Row 2 & 3
            ws3.mergeCells('A2:A3'); ws3.getCell('A2').value = 'No';
            ws3.mergeCells('B2:B3'); ws3.getCell('B2').value = 'Nama DTPR\n(Ketua)';
            ws3.mergeCells('C2:C3'); ws3.getCell('C2').value = 'Judul';
            ws3.mergeCells('D2:D3'); ws3.getCell('D2').value = 'Diseminasi Hasil PkM\n(L/N/I)';
            
            // Merge TS agar tidak ada baris putih di bawahnya
            ws3.mergeCells('E2:E3'); ws3.getCell('E2').value = 'TS-2';
            ws3.mergeCells('F2:F3'); ws3.getCell('F2').value = 'TS-1';
            ws3.mergeCells('G2:G3'); ws3.getCell('G2').value = 'TS';
            ws3.mergeCells('H2:H3'); ws3.getCell('H2').value = 'Link Bukti';

            styleHeader(ws3.getRow(2));
            styleHeader(ws3.getRow(3));

            let countPubTS2 = 0, countPubTS1 = 0, countPubTS = 0;
            let countLokal = 0, countNasional = 0, countInternasional = 0;
            let totalJudulPkm = 0;
            let counterPub = 1;

            rawData.forEach(item => {
                if(item.publikasi && item.publikasi.length > 0) {
                    totalJudulPkm++;
                    item.publikasi.forEach(p => {
                        const isTS2 = p.id_tahun === targetTS - 2;
                        const isTS1 = p.id_tahun === targetTS - 1;
                        const isTS  = p.id_tahun === targetTS;

                        if(isTS2) countPubTS2++;
                        if(isTS1) countPubTS1++;
                        if(isTS)  countPubTS++;

                        const tingkat = (p.tingkat_diseminasi || '').toLowerCase();
                        if(tingkat.includes('lokal') || tingkat.includes('wilayah')) countLokal++;
                        else if(tingkat.includes('nasional')) countNasional++;
                        else if(tingkat.includes('internasional')) countInternasional++;

                        const row = ws3.addRow([
                            counterPub++,
                            item.nama_dosen,
                            p.judul_diseminasi || '-',
                            p.tingkat_diseminasi || '-',
                            isTS2 ? '√' : '',
                            isTS1 ? '√' : '',
                            isTS  ? '√' : '',
                            p.link_bukti || '-'
                        ]);
                        styleData(row);
                    });
                }
            });

            // Footer 1: Jumlah Judul PkM
            const fPRow1 = ws3.addRow([]);
            ws3.mergeCells(`A${fPRow1.number}:B${fPRow1.number}`);
            fPRow1.getCell(1).value = 'Jumlah Judul PkM';
            fPRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fPRow1.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fPRow1.getCell(1).font = { bold: true };
            fPRow1.getCell(3).value = totalJudulPkm;
            fPRow1.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            ws3.mergeCells(`D${fPRow1.number}:H${fPRow1.number}`);
            fPRow1.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fPRow1.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            // Footer 2: Jumlah Diseminasi Hasil PkM (dengan count TS-2, TS-1, TS)
            const fPRow2 = ws3.addRow([]);
            ws3.mergeCells(`A${fPRow2.number}:D${fPRow2.number}`);
            fPRow2.getCell(1).value = 'Jumlah Diseminasi Hasil PkM';
            fPRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fPRow2.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fPRow2.getCell(1).font = { bold: true };
            fPRow2.getCell(5).value = countPubTS2; fPRow2.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fPRow2.getCell(6).value = countPubTS1; fPRow2.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fPRow2.getCell(7).value = countPubTS;  fPRow2.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fPRow2.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fPRow2.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            // Sub-totals: Lokal, Nasional, Internasional (tanpa border, di luar tabel)
            const rLokal  = ws3.addRow(['Jumlah PkM Lokal', countLokal]);
            const rNas    = ws3.addRow(['Jumlah PkM Nasional', countNasional]);
            const rInt    = ws3.addRow(['Jumlah PkM Internasional', countInternasional]);
            [rLokal, rNas, rInt].forEach(r => {
                r.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                r.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });

            ws3.columns = [
                { width: 5 }, { width: 25 }, { width: 40 }, { width: 25 }, 
                { width: 10 }, { width: 10 }, { width: 10 }, { width: 25 }
            ];
            ws3.getColumn(1).width = 30; // Lebihkan untuk teks sub-total

            // SHEET 4: 4.C.3 HKI PkM
            const ws4 = workbook.addWorksheet('4.C.3');
            ws4.mergeCells('A1:H1');
            const h4A = ws4.getCell('A1');
            h4A.value = 'Tabel 4.C.3 Perolehan HKI PkM (Granted)';
            h4A.font = { bold: true, size: 12 };
            h4A.alignment = { horizontal: 'center', vertical: 'middle' };

            // Header Row 2 & 3
            ws4.mergeCells('A2:A3'); ws4.getCell('A2').value = 'No';
            ws4.mergeCells('B2:B3'); ws4.getCell('B2').value = 'Judul';
            ws4.mergeCells('C2:C3'); ws4.getCell('C2').value = 'Jenis HKI';
            ws4.mergeCells('D2:D3'); ws4.getCell('D2').value = 'Nama DTPR';

            ws4.mergeCells('E2:G2'); ws4.getCell('E2').value = 'Tahun Perolehan (beri tanda √)';
            ws4.getCell('E3').value = 'TS-2';
            ws4.getCell('F3').value = 'TS-1';
            ws4.getCell('G3').value = 'TS';

            ws4.mergeCells('H2:H3'); ws4.getCell('H2').value = 'Link Bukti';

            styleHeader(ws4.getRow(2));
            styleHeader(ws4.getRow(3));

            let countHKITS2 = 0, countHKITS1 = 0, countHKITS = 0;
            let counterHKI = 1;

            rawData.forEach(item => {
                if(item.hki && item.hki.length > 0) {
                    item.hki.forEach(h => {
                        const isTS2 = h.id_tahun === targetTS - 2;
                        const isTS1 = h.id_tahun === targetTS - 1;
                        const isTS  = h.id_tahun === targetTS;

                        if(isTS2) countHKITS2++;
                        if(isTS1) countHKITS1++;
                        if(isTS)  countHKITS++;

                        const row = ws4.addRow([
                            counterHKI++,
                            h.judul_hki || '-',
                            h.jenis_hki || '-',
                            item.nama_dosen,
                            isTS2 ? '√' : '',
                            isTS1 ? '√' : '',
                            isTS  ? '√' : '',
                            h.link_bukti || '-'
                        ]);
                        styleData(row);
                    });
                }
            });

            // Footer: Jumlah HKI (merge A:C, D abu-abu, E/F/G kuning)
            const fHRow1 = ws4.addRow([
                'Jumlah HKI', '', '', '',
                countHKITS2, countHKITS1, countHKITS, ''
            ]);
            ws4.mergeCells(`A${fHRow1.number}:C${fHRow1.number}`);
            fHRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fHRow1.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fHRow1.getCell(1).font = { bold: true };
            fHRow1.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fHRow1.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fHRow1.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fHRow1.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fHRow1.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fHRow1.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            ws4.columns = [
                { width: 5 }, { width: 40 }, { width: 20 }, { width: 25 }, 
                { width: 10 }, { width: 10 }, { width: 10 }, { width: 25 }
            ];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=LKPS_4A2_PkM_Prodi_${prodiName}_Tahun_${tahunName}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = pkmController;
