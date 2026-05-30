const express = require('express');
const router = express.Router();
const controller2b6 = require('../../controllers/kemahasiswaan/2b6_kepuasan');
const { verifyToken, authorize } = require('../../middlewares/auth');

/**
 * ROUTES: Tabel 2.B.6 Kepuasan Pengguna Lulusan
 * Role: MHS (Operator Kemahasiswaan) & ADMIN
 */

router.use(verifyToken, authorize('KEMAHASISWAAN', 'ADMIN'));

// --- Data Aktif & Metadata ---
router.get('/', controller2b6.index);      // Ambil 7 baris + auto-statistik alumni
router.post('/', controller2b6.store);     // Simpan terpadu (Penilaian & Metadata)

// --- Recycle Bin ---
router.get('/trash', controller2b6.trash);
router.post('/restore/:id', controller2b6.restore);
router.delete('/:id', controller2b6.destroy);      // Soft Delete
router.delete('/hard/:id', controller2b6.hardDestroy); // Hard Delete

// --- Export ---
router.get('/export', controller2b6.exportExcel);

module.exports = router;