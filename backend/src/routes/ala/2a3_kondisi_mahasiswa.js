const express = require('express');
const router = express.Router();
const controller2a3 = require('../../controllers/ala/2a3_kondisi_mahasiswa');

/**
 * ENDPOINT UNTUK TABEL 2.A.3 KONDISI JUMLAH MAHASISWA (ALA)
 * Base URL: /api/ala/2a3-kondisi-mahasiswa
 */

// 1. Get Trash List (Wajib ditaruh di atas rute dinamis)
router.get('/trash/:id_prodi', controller2a3.getTrash);

// 2. Export Excel (Menerapkan grid warna kuning-abu BAN-PT)
router.get('/export/:id_prodi/:id_tahun', controller2a3.exportExcel);

// 3. Ambil data laporan 3 angkatan (TS, TS-1, TS-2)
router.get('/:id_prodi/:id_tahun', controller2a3.getData);

// 4. Simpan atau Update data (Upsert dengan validasi sinkronisasi langsung)
router.post('/store', controller2a3.store);

// 5. Soft Delete: Pindahkan data ke sampah
router.post('/delete', controller2a3.softDelete);

// 6. Restore: Mengembalikan data dari sampah
router.post('/restore/:id_2a3', controller2a3.restore);

// 7. Hard Delete: Hapus permanen dari database
router.post('/hard-delete/:id_2a3', controller2a3.hardDelete);

module.exports = router;