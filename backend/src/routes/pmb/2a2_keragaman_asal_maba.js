const express = require('express');
const router = express.Router();
const controller2a2 = require('../../controllers/pmb/2a2_keragaman_asal_maba');

/**
 * ENDPOINT UNTUK TABEL 2.A.2 KERAGAMAN ASAL MAHASISWA
 * Base URL: /api/pmb/2a2-keragaman-asal
 */

// ==========================================
// 1. ROUTE SPESIFIK (WAJIB DI TARUH DI ATAS)
// ==========================================

// Get Trash: Ambil daftar data yang dihapus sementara
router.get('/trash/:id_prodi', controller2a2.getTrash);

// Export Excel: Mapping Horizontal sesuai standar LKPS
router.get('/export/:id_prodi/:id_tahun', controller2a2.exportExcel);


// ==========================================
// 2. ROUTE GENERIK / WILDCARD (WAJIB DI BAWAH)
// ==========================================

// Ambil data laporan (Menerapkan Logika Waterfall untuk TS, TS-1, TS-2)
router.get('/:id_prodi/:id_tahun', controller2a2.getData);


// ==========================================
// 3. ROUTE METODE POST / LAINNYA
// ==========================================

// Simpan atau Update data (Upsert dengan validasi sinkronisasi ke Tabel 2.A.1)
router.post('/store', controller2a2.store);

// Soft Delete: Pindahkan data ke sampah
router.post('/delete', controller2a2.softDelete);

// Restore: Mengembalikan data dari sampah ke dashboard aktif
router.post('/restore/:id_2a2', controller2a2.restore);

// Hard Delete: Hapus permanen dari database
router.post('/hard-delete/:id_2a2', controller2a2.hardDelete);

module.exports = router;