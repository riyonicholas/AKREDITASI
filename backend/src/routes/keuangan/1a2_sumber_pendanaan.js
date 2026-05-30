const express = require('express');
const router = express.Router();
const controller1a2 = require('../../controllers/keuangan/1a2_sumber_pendanaan');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

// Keamanan: Wajib Login & Role Keuangan/Admin/Waket2
router.use(verifyToken, authorize(UNITS.KEUANGAN, UNITS.ADMIN, UNITS.WAKET_2));

// --- Rute Data Utama ---
router.get('/', controller1a2.index);          // Ambil data aktif (Filter Prodi & Tahun)
router.post('/', controller1a2.store);         // Simpan data baru
router.put('/:id', controller1a2.update);      // Update data berdasarkan ID
router.delete('/:id', controller1a2.destroy);  // Soft Delete

// --- Rute Pengelolaan Sampah ---
router.get('/trash', controller1a2.trash);      // Liat isi sampah
router.post('/restore/:id', controller1a2.restore); // Balikin data
router.delete('/hard/:id', controller1a2.hardDestroy); // Hapus selamanya

// --- Rute Ekspor ---
router.get('/export', controller1a2.exportExcel); // Download Excel LKPS

module.exports = router;